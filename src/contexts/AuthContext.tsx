import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role: 'admin' | 'user' | 'guest';
  subscription?: {
    plan: 'monthly' | 'annual' | 'trial';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt: Date;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isGuest: boolean;
  checkSubscription: () => boolean;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  company: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = useSupabaseClient();
  const supabaseUser = useUser();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (supabaseUser) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (error) throw error;

          // Check if admin
          const isAdminUser = supabaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          const isGuestUser = supabaseUser.email === process.env.NEXT_PUBLIC_GUEST_EMAIL;

          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profile?.name,
            company: profile?.company,
            role: isAdminUser ? 'admin' : isGuestUser ? 'guest' : 'user',
            subscription: profile?.subscription,
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [supabaseUser, supabase]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check for admin credentials
      if (email === 'Razan@FinClick.AI' && password === 'RazanFinClickAI@056300') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Create admin account if doesn't exist
          await signUp({
            email,
            password,
            name: 'Admin',
            company: 'FinClick.AI',
            phone: '00966544827213',
          });
        }
        
        toast.success('مرحباً بك في لوحة الإدارة');
        router.push('/admin/dashboard');
        return;
      }
      
      // Check for guest credentials
      if (email === 'Guest@FinClick.AI' && password === 'GuestFinClickAI@123321') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Create guest account if doesn't exist
          await signUp({
            email,
            password,
            name: 'Guest User',
            company: 'Guest',
            phone: '0000000000',
          });
        }
        
        toast.success('مرحباً بك كضيف');
        router.push('/dashboard');
        return;
      }
      
      // Regular user sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            company: data.company,
            phone: data.phone,
            role: data.email === 'Razan@FinClick.AI' ? 'admin' : 
                  data.email === 'Guest@FinClick.AI' ? 'guest' : 'user',
            subscription: {
              plan: 'trial',
              status: 'active',
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
            },
            created_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;

        // Send welcome email
        await sendWelcomeEmail(data.email, data.name);

        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني');
        router.push('/auth/verify-email');
      }
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('تم تسجيل الخروج بنجاح');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = (): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'guest') return true;
    
    if (user.subscription) {
      const now = new Date();
      const expiresAt = new Date(user.subscription.expiresAt);
      return user.subscription.status === 'active' && expiresAt > now;
    }
    
    return false;
  };

  const sendWelcomeEmail = async (email: string, name: string) => {
    try {
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: user?.role === 'admin',
    isGuest: user?.role === 'guest',
    checkSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
