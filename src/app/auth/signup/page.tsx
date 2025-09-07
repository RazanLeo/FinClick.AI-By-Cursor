'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpPage() {
  const { signUp, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '', phone: '' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(form);
  };

  return (
    <div className="min-h-screen bg-black text-gold flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 border border-gold/40 rounded-xl p-6">
        <h1 className="text-2xl font-bold">إنشاء حساب</h1>
        {(['email','password','name','company','phone'] as const).map((k)=>(
          <input key={k} className="input-gold w-full" placeholder={k}
            type={k==='password'?'password':'text'} value={(form as any)[k]}
            onChange={(e)=>setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button disabled={loading} className="btn-gold w-full" type="submit">{loading ? '...' : 'تسجيل'}</button>
      </form>
    </div>
  );
}


