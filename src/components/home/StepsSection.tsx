import React from 'react';

interface StepsSectionProps {
  language: 'ar' | 'en';
}

const StepsSection: React.FC<StepsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('خطوات النظام', 'System Steps')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
          <h3 className="text-xl font-semibold text-gold mb-2">
            {t('ارفع قوائمك', 'Upload Your Statements')}
          </h3>
          <p className="text-gold/70">
            {t('ارفق القوائم المالية أو موازين المراجعة', 'Upload financial statements or trial balances')}
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
          <h3 className="text-xl font-semibold text-gold mb-2">
            {t('حدد خيارات التحليل', 'Select Analysis Options')}
          </h3>
          <p className="text-gold/70">
            {t('اختر القطاع والنشاط ونوع التحليل', 'Choose sector, activity, and analysis type')}
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gold text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
          <h3 className="text-xl font-semibold text-gold mb-2">
            {t('اضغط زر التحليل', 'Press Analysis Button')}
          </h3>
          <p className="text-gold/70">
            {t('احصل على تحليل شامل في ثواني', 'Get comprehensive analysis in seconds')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
