'use client'

import React from 'react'

interface FooterProps {
  language: 'ar' | 'en'
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  return (
    <footer className="bg-black/90 border-t border-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">FinClick.AI</h3>
            <p className="text-gold/70 text-sm mb-4">
              {t('منصة التحليل المالي الذكية والثورية', 'Revolutionary Intelligent Financial Analysis Platform')}
            </p>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('روابط سريعة', 'Quick Links')}</h4>
            <ul className="space-y-2 text-gold/70 text-sm">
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('الرئيسية', 'Home')}</a></li>
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('المميزات', 'Features')}</a></li>
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('أنواع التحليل', 'Analysis Types')}</a></li>
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('الأسعار', 'Pricing')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('قانوني', 'Legal')}</h4>
            <ul className="space-y-2 text-gold/70 text-sm">
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('سياسة الخصوصية', 'Privacy Policy')}</a></li>
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('شروط الاستخدام', 'Terms of Use')}</a></li>
              <li><a href="#" className="hover:text-gold/90 transition-colors duration-200">{t('سياسة الأمان', 'Security Policy')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('اتصل بنا', 'Contact Us')}</h4>
            <div className="space-y-2 text-gold/70 text-sm">
              <p>{t('البريد الإلكتروني: info@finclick.ai', 'Email: info@finclick.ai')}</p>
              <p>{t('الهاتف: +966 50 123 4567', 'Phone: +966 50 123 4567')}</p>
              <p>{t('العنوان: الرياض، المملكة العربية السعودية', 'Address: Riyadh, Saudi Arabia')}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gold/20 mt-8 pt-6 text-center">
          <p className="text-gold/50 text-sm">
            © 2024 FinClick.AI. {t('جميع الحقوق محفوظة.', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
