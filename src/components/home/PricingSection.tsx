import React from 'react';

interface PricingSectionProps {
  language: 'ar' | 'en';
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('الاشتراكات والأسعار', 'Subscriptions & Pricing')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-black/50 border border-gold/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gold mb-4">
            {t('الخطة الشهرية', 'Monthly Plan')}
          </h3>
          <div className="text-3xl font-bold text-gold mb-6">
            5,000 <span className="text-lg">{t('ريال سعودي', 'SAR')}</span>
          </div>
          <ul className="space-y-3 text-gold/80">
            <li>• {t('تحليل شامل 181 نوع', 'Comprehensive 181 analysis types')}</li>
            <li>• {t('تقارير غير محدودة', 'Unlimited reports')}</li>
            <li>• {t('دعم فني 24/7', '24/7 technical support')}</li>
            <li>• {t('تخزين سحابي آمن', 'Secure cloud storage')}</li>
          </ul>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-8 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-black px-4 py-1 rounded-full text-sm font-semibold">
            {t('الأكثر شعبية', 'Most Popular')}
          </div>
          <h3 className="text-2xl font-bold text-gold mb-4">
            {t('الخطة السنوية', 'Annual Plan')}
          </h3>
          <div className="text-3xl font-bold text-gold mb-2">
            54,000 <span className="text-lg">{t('ريال سعودي', 'SAR')}</span>
          </div>
          <div className="text-gold/60 line-through mb-6">
            60,000 {t('ريال سعودي', 'SAR')}
          </div>
          <ul className="space-y-3 text-gold/80">
            <li>• {t('جميع مميزات الخطة الشهرية', 'All monthly plan features')}</li>
            <li>• {t('خصم 10% (وفر 6,000 ريال)', '10% discount (Save 6,000 SAR)')}</li>
            <li>• {t('أولوية الدعم الفني', 'Priority technical support')}</li>
            <li>• {t('تدريب مجاني', 'Free training')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
