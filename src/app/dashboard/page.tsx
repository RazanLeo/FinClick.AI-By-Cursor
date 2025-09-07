'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gold mb-8">
          {t('لوحة التحكم', 'Dashboard')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('التحليلات المالية', 'Financial Analyses')}
            </h3>
            <p className="text-gold/70">
              {t('اختر من بين 181 نوعاً من التحليلات المالية المتاحة', 'Choose from 181 available financial analysis types')}
            </p>
          </div>
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('التقارير', 'Reports')}
            </h3>
            <p className="text-gold/70">
              {t('احصل على تقارير مالية مفصلة بصيغ متعددة', 'Get detailed financial reports in multiple formats')}
            </p>
          </div>
          <div className="bg-black/50 border border-gold/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gold mb-4">
              {t('الإعدادات', 'Settings')}
            </h3>
            <p className="text-gold/70">
              {t('قم بتخصيص إعداداتك وتفضيلاتك', 'Customize your settings and preferences')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
