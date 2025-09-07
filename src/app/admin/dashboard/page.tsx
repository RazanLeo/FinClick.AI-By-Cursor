'use client'

import { useState } from 'react'

export default function AdminDashboard() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gold mb-8">
          {t('لوحة تحكم الإدارة', 'Admin Dashboard')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('إدارة المستخدمين', 'User Management')}
            </h3>
            <p className="text-gold/70">
              {t('إدارة حسابات المستخدمين والصلاحيات', 'Manage user accounts and permissions')}
            </p>
          </div>
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('إدارة الاشتراكات', 'Subscription Management')}
            </h3>
            <p className="text-gold/70">
              {t('إدارة خطط الاشتراك والمدفوعات', 'Manage subscription plans and payments')}
            </p>
          </div>
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('التحليلات', 'Analytics')}
            </h3>
            <p className="text-gold/70">
              {t('عرض إحصائيات النظام والأداء', 'View system statistics and performance')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
