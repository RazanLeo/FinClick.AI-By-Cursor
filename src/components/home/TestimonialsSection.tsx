import React from 'react';

interface TestimonialsSectionProps {
  language: 'ar' | 'en';
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('ماذا يقول عملاؤنا', 'What Our Clients Say')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <div className="flex text-gold mb-3">
            {'★'.repeat(5)}
          </div>
          <p className="text-gold/80 mb-4">
            {t('نظام شامل ومتكامل ساعدني على فهم أداء شركتي بسرعة ودقة', 'Comprehensive system that helped me understand my company performance quickly and accurately')}
          </p>
          <p className="text-gold/60 text-sm">
            {t('أحمد محمد - مدير مالي', 'Ahmed Mohammed - Financial Manager')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <div className="flex text-gold mb-3">
            {'★'.repeat(5)}
          </div>
          <p className="text-gold/80 mb-4">
            {t('لم أعد بحاجة لتضييع وقتي في الحسابات الطويلة', 'I no longer need to waste time on lengthy calculations')}
          </p>
          <p className="text-gold/60 text-sm">
            {t('فاطمة العلي - محللة مالية', 'Fatima Al-Ali - Financial Analyst')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <div className="flex text-gold mb-3">
            {'★'.repeat(5)}
          </div>
          <p className="text-gold/80 mb-4">
            {t('صرت أستطيع اتخاذ قرارات استثمارية لحظية', 'I can now make instant investment decisions')}
          </p>
          <p className="text-gold/60 text-sm">
            {t('خالد السعد - مستثمر', 'Khalid Al-Saad - Investor')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
