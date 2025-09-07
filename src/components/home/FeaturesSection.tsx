import React from 'react';

interface FeaturesSectionProps {
  language: 'ar' | 'en';
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('لماذا FinClick.AI؟', 'Why FinClick.AI?')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gold mb-4">
            {t('181 نوع تحليل مالي', '181 Financial Analysis Types')}
          </h3>
          <p className="text-gold/70">
            {t('تحليل شامل لجميع أنواع التحليل المالي المعروفة في العالم', 'Comprehensive analysis of all known financial analysis types in the world')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gold mb-4">
            {t('الذكاء الاصطناعي', 'Artificial Intelligence')}
          </h3>
          <p className="text-gold/70">
            {t('نظام قائم على الذكاء الاصطناعي بشكل كامل', 'Fully AI-powered system')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gold mb-4">
            {t('السرعة والدقة', 'Speed and Accuracy')}
          </h3>
          <p className="text-gold/70">
            {t('تحليل في ثواني معدودة بدقة متناهية', 'Analysis in seconds with extreme accuracy')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
