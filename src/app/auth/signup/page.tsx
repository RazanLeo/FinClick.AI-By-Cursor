'use client'

import { useState } from 'react'

export default function SignUp() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-black/50 border border-gold/20 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gold mb-8 text-center">
          {t('إنشاء حساب جديد', 'Create New Account')}
        </h1>
        <form className="space-y-6">
          <div>
            <label className="block text-gold/70 text-sm font-medium mb-2">
              {t('الاسم الكامل', 'Full Name')}
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
              placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
            />
          </div>
          <div>
            <label className="block text-gold/70 text-sm font-medium mb-2">
              {t('البريد الإلكتروني', 'Email')}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
              placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
            />
          </div>
          <div>
            <label className="block text-gold/70 text-sm font-medium mb-2">
              {t('كلمة المرور', 'Password')}
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
              placeholder={t('أدخل كلمة المرور', 'Enter your password')}
            />
          </div>
          <div>
            <label className="block text-gold/70 text-sm font-medium mb-2">
              {t('تأكيد كلمة المرور', 'Confirm Password')}
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none"
              placeholder={t('أكد كلمة المرور', 'Confirm your password')}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold text-black py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300"
          >
            {t('إنشاء الحساب', 'Create Account')}
          </button>
        </form>
        <p className="text-gold/70 text-sm text-center mt-6">
          {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
          <a href="/auth/signin" className="text-gold hover:text-gold/90 transition-colors duration-200">
            {t('تسجيل الدخول', 'Sign In')}
          </a>
        </p>
      </div>
    </div>
  )
}
