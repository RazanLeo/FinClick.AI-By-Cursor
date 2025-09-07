'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SignInPage() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen bg-black text-gold flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border border-gold/40 rounded-xl p-6">
        <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
        <input className="input-gold w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input-gold w-full" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} className="btn-gold w-full" type="submit">{loading ? '...' : 'دخول'}</button>
        <div className="text-xs opacity-70">
          Admin: Razan@FinClick.AI / RazanFinClickAI@056300 — Guest: Guest@FinClick.AI / GuestFinClickAI@123321
        </div>
      </form>
    </div>
  );
}


