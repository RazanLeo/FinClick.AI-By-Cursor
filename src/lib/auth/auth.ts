// src/lib/auth/auth.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET!;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin' | 'guest';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired';
  createdAt: Date;
  lastLogin: Date;
  twoFactorEnabled: boolean;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// تشفير البيانات الحساسة
export function encryptData(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

// فك تشفير البيانات
export function decryptData(encryptedText: string): string {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// تسجيل مستخدم جديد
export async function registerUser(
  email: string,
  password: string,
  companyName: string,
  phoneNumber: string
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // التحقق من عدم وجود المستخدم مسبقاً
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المستخدم في Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          phone_number: phoneNumber
        }
      }
    });

    if (authError) {
      throw authError;
    }

    // إنشاء سجل المستخدم في قاعدة البيانات
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authUser.user!.id,
        email: email,
        password: hashedPassword,
        company_name: companyName,
        phone_number: encryptData(phoneNumber),
        role: 'user',
        subscription_status: 'trial',
        created_at: new Date().toISOString(),
        last_login: null,
        two_factor_enabled: false,
        email_verified: false
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // إرسال بريد التحقق
    await sendVerificationEmail(email, authUser.user!.id);

    return {
      success: true,
      message: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني',
      user: {
        id: newUser.id,
        email: newUser.email,
        companyName: newUser.company_name,
        role: newUser.role,
        subscriptionStatus: newUser.subscription_status,
        createdAt: new Date(newUser.created_at),
        lastLogin: newUser.last_login ? new Date(newUser.last_login) : new Date(),
        twoFactorEnabled: newUser.two_factor_enabled
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'حدث خطأ أثناء التسجيل' };
  }
}

// تسجيل الدخول
export async function loginUser(
  email: string,
  password: string,
  twoFactorCode?: string
): Promise<{ success: boolean; message: string; token?: AuthToken; user?: User }> {
  try {
    // البحث عن المستخدم
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    // التحقق من كلمة المرور
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      // تسجيل محاولة دخول فاشلة
      await logFailedLoginAttempt(email);
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    // التحقق من التوثيق الثنائي
    if (user.two_factor_enabled) {
      if (!twoFactorCode) {
        return { success: false, message: 'يرجى إدخال رمز التوثيق الثنائي' };
      }

      const isValidCode = await verifyTwoFactorCode(user.id, twoFactorCode);
      if (!isValidCode) {
        return { success: false, message: 'رمز التوثيق غير صحيح' };
      }
    }

    // التحقق من حالة الاشتراك
    const subscription = await checkSubscriptionStatus(user.id);
    if (subscription.status === 'expired') {
      return { success: false, message: 'انتهى اشتراكك. يرجى التجديد للمتابعة' };
    }

    // إنشاء JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        companyName: user.company_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // تحديث آخر تسجيل دخول
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // تسجيل نشاط تسجيل الدخول
    await logUserActivity(user.id, 'login', { ip: getClientIP() });

    return {
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token: {
        token,
        refreshToken,
        expiresIn: 86400 // 24 ساعة بالثواني
      },
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        role: user.role,
        subscriptionStatus: subscription.status,
        createdAt: new Date(user.created_at),
        lastLogin: new Date(),
        twoFactorEnabled: user.two_factor_enabled
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}

// التحقق من JWT Token
export async function verifyToken(token: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false };
  }
}

// تحديث كلمة المرور
export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single();

    if (!user) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid) {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', userId);

    // إرسال بريد إلكتروني للتنبيه
    await sendPasswordChangeNotification(userId);

    return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
  } catch (error) {
    console.error('Password update error:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث كلمة المرور' };
  }
}

// إعادة تعيين كلمة المرور
export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (!user) {
      return { success: false, message: 'البريد الإلكتروني غير مسجل' };
    }

    // إنشاء رمز إعادة التعيين
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // ساعة واحدة

    await supabase
      .from('password_resets')
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: resetTokenExpiry.toISOString()
      });

    // إرسال بريد إعادة التعيين
    await sendPasswordResetEmail(email, resetToken);

    return { success: true, message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
  }
}

// تفعيل التوثيق الثنائي
export async function enableTwoFactor(userId: string): Promise<{ success: boolean; secret?: string; qrCode?: string }> {
  try {
    const speakeasy = require('speakeasy');
    const qrcode = require('qrcode');

    const secret = speakeasy.generateSecret({
      name: 'FinClick.AI',
      length: 32
    });

    await supabase
      .from('users')
      .update({
        two_factor_secret: encryptData(secret.base32),
        two_factor_enabled: false // سيتم التفعيل بعد التحقق
      })
      .eq('id', userId);

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return {
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    };
  } catch (error) {
    console.error('2FA enable error:', error);
    return { success: false };
  }
}

// التحقق من رمز التوثيق الثنائي
async function verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
  try {
    const speakeasy = require('speakeasy');
    
    const { data: user } = await supabase
      .from('users')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();

    if (!user || !user.two_factor_secret) {
      return false;
    }

    const secret = decryptData(user.two_factor_secret);

    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return false;
  }
}

// تسجيل نشاط المستخدم
async function logUserActivity(userId: string, action: string, metadata?: any): Promise<void> {
  try {
    await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        action,
        metadata,
        ip_address: metadata?.ip || null,
        user_agent: metadata?.userAgent || null,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Activity logging error:', error);
  }
}

// تسجيل محاولات الدخول الفاشلة
async function logFailedLoginAttempt(email: string): Promise<void> {
  try {
    await supabase
      .from('failed_login_attempts')
      .insert({
        email,
        ip_address: getClientIP(),
        attempted_at: new Date().toISOString()
      });

    // التحقق من عدد المحاولات الفاشلة
    const { count } = await supabase
      .from('failed_login_attempts')
      .select('*', { count: 'exact' })
      .eq('email', email)
      .gte('attempted_at', new Date(Date.now() - 3600000).toISOString()); // آخر ساعة

    if (count && count >= 5) {
      // قفل الحساب مؤقتاً
      await lockAccount(email);
    }
  } catch (error) {
    console.error('Failed login logging error:', error);
  }
}

// قفل الحساب
async function lockAccount(email: string): Promise<void> {
  try {
    await supabase
      .from('users')
      .update({
        account_locked: true,
        locked_until: new Date(Date.now() + 3600000).toISOString() // ساعة واحدة
      })
      .eq('email', email);

    // إرسال بريد إلكتروني للتنبيه
    await sendAccountLockNotification(email);
  } catch (error) {
    console.error('Account lock error:', error);
  }
}

// التحقق من حالة الاشتراك
async function checkSubscriptionStatus(userId: string): Promise<{ status: string; expiresAt?: Date }> {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!subscription) {
      return { status: 'inactive' };
    }

    const now = new Date();
    const expiresAt = new Date(subscription.expires_at);

    if (expiresAt < now) {
      return { status: 'expired', expiresAt };
    }

    return { status: subscription.status, expiresAt };
  } catch (error) {
    console.error('Subscription check error:', error);
    return { status: 'inactive' };
  }
}

// دوال إرسال البريد الإلكتروني
async function sendVerificationEmail(email: string, userId: string): Promise<void> {
  // تنفيذ إرسال البريد الإلكتروني
}

async function sendPasswordChangeNotification(userId: string): Promise<void> {
  // تنفيذ إرسال البريد الإلكتروني
}

async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  // تنفيذ إرسال البريد الإلكتروني
}

async function sendAccountLockNotification(email: string): Promise<void> {
  // تنفيذ إرسال البريد الإلكتروني
}

function getClientIP(): string {
  // الحصول على IP العميل
  return '0.0.0.0';
}

export default {
  registerUser,
  loginUser,
  verifyToken,
  updatePassword,
  resetPassword,
  enableTwoFactor,
  encryptData,
  decryptData
};
