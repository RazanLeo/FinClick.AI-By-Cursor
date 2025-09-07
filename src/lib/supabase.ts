import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  role: 'admin' | 'user' | 'guest';
  subscription: {
    plan: 'monthly' | 'annual' | 'trial';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  company_name: string;
  sector: string;
  activity: string;
  legal_entity: string;
  comparison_level: string;
  years_count: number;
  analysis_types: string[];
  language: 'ar' | 'en';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_data: any;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'annual';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id: string;
  gateway_response: any;
  created_at: string;
}

// Helper functions
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getUserAnalyses = async (userId: string): Promise<Analysis[]> => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }

  return data || [];
};

export const getAnalysisById = async (analysisId: string): Promise<Analysis | null> => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }

  return data;
};

export const createAnalysis = async (analysis: Omit<Analysis, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('analyses')
    .insert(analysis)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateAnalysis = async (analysisId: string, updates: Partial<Analysis>) => {
  const { data, error } = await supabase
    .from('analyses')
    .update(updates)
    .eq('id', analysisId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') { // Not found error
    console.error('Error fetching subscription:', error);
  }

  return data;
};

export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateSubscription = async (subscriptionId: string, updates: Partial<Subscription>) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }

  return data || [];
};
