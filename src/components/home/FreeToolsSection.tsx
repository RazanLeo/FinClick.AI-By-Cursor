import React from 'react';

interface FreeToolsSectionProps {
  language: 'ar' | 'en';
}

const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('الأدوات المجانية', 'Free Tools')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('الأخبار المالية', 'Financial News')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('أخبار مالية مباشرة', 'Live financial news')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('التقويم الاقتصادي', 'Economic Calendar')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('أحداث اقتصادية مهمة', 'Important economic events')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('الحاسبات المالية', 'Financial Calculators')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('حاسبات مالية متقدمة', 'Advanced financial calculators')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('بوت جي بي تي مالي', 'Financial GPT Bot')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('مساعد ذكي للاستشارات المالية', 'Smart assistant for financial advice')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeToolsSection;
