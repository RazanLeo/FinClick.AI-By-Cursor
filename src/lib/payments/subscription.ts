
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key'
);

// PayTabs Configuration
const PAYTABS_CONFIG = {
  serverKey: process.env.PAYTABS_SERVER_KEY || 'placeholder_server_key',
  clientKey: process.env.PAYTABS_CLIENT_KEY || 'placeholder_client_key',
  profileId: process.env.PAYTABS_PROFILE_ID || 'placeholder_profile_id',
  baseUrl: 'https://secure.paytabs.sa',
  currency: 'SAR'
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
}

export interface PaymentMethod {
  type: 'mada' | 'visa' | 'mastercard' | 'paypal' | 'applepay';
  last4?: string;
  expiryDate?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
  paidAt?: Date;
  invoiceUrl?: string;
}

// خطط الاشتراك
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'الخطة الشهرية',
    price: 5000,
    duration: 'monthly',
    features: [
      'تحليل شامل 181 نوع',
      'تقارير غير محدودة',
      'دعم فني 24/7',
      'تخزين سحابي آمن',
      'مقارنات عالمية'
    ]
  },
  {
    id: 'yearly',
    name: 'الخطة السنوية',
    price: 54000,
    duration: 'yearly',
    features: [
      'جميع مميزات الخطة الشهرية',
      'خصم 10% (وفر 6000 ريال)',
      'أولوية الدعم الفني',
      'تدريب مجاني',
      'تحديثات حصرية'
    ]
  }
];

// إنشاء اشتراك جديد
export async function createSubscription(
  userId: string,
  planId: string,
  paymentMethod: PaymentMethod
): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
  try {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return { success: false, error: 'خطة الاشتراك غير موجودة' };
    }

    // الحصول على بيانات المستخدم
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    // إنشاء معرف فريد للدفعة
    const transactionRef = `FIN-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // إعداد طلب الدفع لـ PayTabs
    const paymentRequest = {
      profile_id: PAYTABS_CONFIG.profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: transactionRef,
      cart_currency: PAYTABS_CONFIG.currency,
      cart_amount: plan.price,
      cart_description: `اشتراك ${plan.name} - FinClick.AI`,
      
      // بيانات العميل
      customer_details: {
        name: user.company_name,
        email: user.email,
        phone: user.phone_number,
        street1: 'Saudi Arabia',
        city: 'Jeddah',
        state: 'Mecca',
        country: 'SA',
        zip: '00000'
      },
      
      // بيانات الشحن (نفس بيانات العميل للخدمات الرقمية)
      shipping_details: {
        name: user.company_name,
        email: user.email,
        phone: user.phone_number,
        street1: 'Saudi Arabia',
        city: 'Jeddah',
        state: 'Mecca',
        country: 'SA',
        zip: '00000'
      },
      
      // URLs للإعادة التوجيه
      callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      return: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription/success`,
      
      // معلومات إضافية
      hide_shipping: true,
      framed: false,
      paypage_lang: 'ar'
    };

    // إرسال الطلب إلى PayTabs
    const response = await axios.post(
      `${PAYTABS_CONFIG.baseUrl}/payment/request`,
      paymentRequest,
      {
        headers: {
          'Authorization': PAYTABS_CONFIG.serverKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.redirect_url) {
      // حفظ معلومات الاشتراك المعلق
      await supabase
        .from('pending_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          transaction_ref: transactionRef,
          amount: plan.price,
          status: 'pending',
          payment_method: paymentMethod.type,
          created_at: new Date().toISOString()
        });

      return {
        success: true,
        redirectUrl: response.data.redirect_url
      };
    } else {
      return {
        success: false,
        error: 'فشل في إنشاء صفحة الدفع'
      };
    }
  } catch (error) {
    console.error('Subscription creation error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء إنشاء الاشتراك'
    };
  }
}

// معالجة رد PayTabs
export async function handlePaymentCallback(
  transactionRef: string,
  paymentStatus: string,
  paymentData: any
): Promise<{ success: boolean }> {
  try {
    // الحصول على الاشتراك المعلق
    const { data: pendingSubscription } = await supabase
      .from('pending_subscriptions')
      .select('*')
      .eq('transaction_ref', transactionRef)
      .single();

    if (!pendingSubscription) {
      throw new Error('Pending subscription not found');
    }

    if (paymentStatus === 'A' || paymentStatus === 'V') {
      // الدفع ناجح - تفعيل الاشتراك
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === pendingSubscription.plan_id);
      
      const startDate = new Date();
      const endDate = new Date();
      
      if (plan?.duration === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // إنشاء الاشتراك
      await supabase
        .from('subscriptions')
        .insert({
          user_id: pendingSubscription.user_id,
          plan_id: pendingSubscription.plan_id,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          amount: pendingSubscription.amount,
          payment_method: pendingSubscription.payment_method,
          transaction_ref: transactionRef,
          created_at: new Date().toISOString()
        });

      // تحديث حالة المستخدم
      await supabase
        .from('users')
        .update({ subscription_status: 'active' })
        .eq('id', pendingSubscription.user_id);

      // إنشاء الفاتورة
      await createInvoice(
        pendingSubscription.user_id,
        pendingSubscription.amount,
        transactionRef
      );

      // حذف الاشتراك المعلق
      await supabase
        .from('pending_subscriptions')
        .delete()
        .eq('id', pendingSubscription.id);

      // إرسال بريد التأكيد
      await sendSubscriptionConfirmation(pendingSubscription.user_id);

      return { success: true };
    } else {
      // الدفع فشل
      await supabase
        .from('pending_subscriptions')
        .update({ status: 'failed' })
        .eq('transaction_ref', transactionRef);

      return { success: false };
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return { success: false };
  }
}

// إلغاء الاشتراك
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return { success: false, message: 'لا يوجد اشتراك نشط' };
    }

    // تحديث حالة الاشتراك
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    // تحديث حالة المستخدم
    await supabase
      .from('users')
      .update({ subscription_status: 'cancelled' })
      .eq('id', userId);

    // إرسال بريد التأكيد
    await sendCancellationConfirmation(userId);

    return { success: true, message: 'تم إلغاء الاشتراك بنجاح' };
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return { success: false, message: 'حدث خطأ أثناء إلغاء الاشتراك' };
  }
}

// تجديد الاشتراك التلقائي
export async function renewSubscription(subscriptionId: string): Promise<void> {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (!subscription || subscription.status !== 'active') {
      return;
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan_id);
    if (!plan) {
      return;
    }

    // محاولة تحصيل الدفعة
    const paymentResult = await processAutoPayment(
      subscription.user_id,
      plan.price,
      subscription.payment_method
    );

    if (paymentResult.success) {
      // تمديد الاشتراك
      const newEndDate = new Date(subscription.end_date);
      if (plan.duration === 'monthly') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      } else {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      }

      await supabase
        .from('subscriptions')
        .update({
          end_date: newEndDate.toISOString(),
          last_renewed_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      // إرسال بريد التأكيد
      await sendRenewalConfirmation(subscription.user_id);
    } else {
      // فشل التجديد
      await handleFailedRenewal(subscriptionId);
    }
  } catch (error) {
    console.error('Subscription renewal error:', error);
  }
}

// معالجة فشل التجديد
async function handleFailedRenewal(subscriptionId: string): Promise<void> {
  try {
    await supabase
      .from('subscriptions')
      .update({
        status: 'payment_failed',
        payment_failed_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    // إرسال تنبيه للمستخدم
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('id', subscriptionId)
      .single();

    if (subscription) {
      await sendPaymentFailedNotification(subscription.user_id);
    }
  } catch (error) {
    console.error('Failed renewal handling error:', error);
  }
}

// معالجة الدفع التلقائي
async function processAutoPayment(
  userId: string,
  amount: number,
  paymentMethod: string
): Promise<{ success: boolean }> {
  // تنفيذ معالجة الدفع التلقائي
  // هنا يتم التكامل مع PayTabs للدفع المتكرر
  return { success: true };
}

// إنشاء فاتورة
async function createInvoice(
  userId: string,
  amount: number,
  transactionRef: string
): Promise<void> {
  try {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number: invoiceNumber,
        amount: amount,
        status: 'paid',
        transaction_ref: transactionRef,
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    // توليد PDF الفاتورة
    await generateInvoicePDF(invoiceNumber, userId, amount);
  } catch (error) {
    console.error('Invoice creation error:', error);
  }
}

// توليد PDF للفاتورة
async function generateInvoicePDF(
  invoiceNumber: string,
  userId: string,
  amount: number
): Promise<void> {
  // تنفيذ توليد PDF
}

// دوال إرسال البريد الإلكتروني
async function sendSubscriptionConfirmation(userId: string): Promise<void> {
  // تنفيذ إرسال البريد
}

async function sendCancellationConfirmation(userId: string): Promise<void> {
  // تنفيذ إرسال البريد
}

async function sendRenewalConfirmation(userId: string): Promise<void> {
  // تنفيذ إرسال البريد
}

async function sendPaymentFailedNotification(userId: string): Promise<void> {
  // تنفيذ إرسال البريد
}

export default {
  createSubscription,
  handlePaymentCallback,
  cancelSubscription,
  renewSubscription,
  SUBSCRIPTION_PLANS
};
