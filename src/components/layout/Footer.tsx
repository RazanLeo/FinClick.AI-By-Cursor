import React from 'react';

interface FooterProps {
  language: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <footer className="bg-black/90 border-t border-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">FinClick.AI</h3>
            <p className="text-gold/70 text-sm">
              {t('منصة التحليل المالي الذكية والثورية', 'Revolutionary Intelligent Financial Analysis Platform')}
            </p>
        </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('التواصل والدعم', 'Contact & Support')}</h4>
            <div className="space-y-2 text-gold/70 text-sm">
              <p>Office: {t('المملكة العربية السعودية، جدة', 'Kingdom of Saudi Arabia, Jeddah')}</p>
              <p>Email: finclick.ai@gmail.com</p>
              <p>Phone: 00966544827213</p>
            </div>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('النظام', 'System')}</h4>
            <ul className="space-y-2 text-gold/70 text-sm">
              <li>{t('مميزات النظام', 'System Features')}</li>
              <li>{t('أنواع التحليل', 'Analysis Types')}</li>
              <li>{t('الاشتراكات والأسعار', 'Subscriptions & Pricing')}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold mb-4">{t('الشركة', 'Company')}</h4>
            <ul className="space-y-2 text-gold/70 text-sm">
              <li>{t('الرؤية والرسالة', 'Vision & Mission')}</li>
              <li>{t('الأهداف والخدمات', 'Goals & Services')}</li>
              <li>{t('الأسئلة الشائعة', 'FAQ')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gold/60 text-sm">
            FinClick.AI 2025 {t('جميع الحقوق محفوظة', 'All Rights Reserved')} | 
            {t('صنع في المملكة العربية السعودية', 'Made in Kingdom of Saudi Arabia')} 🇸🇦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;