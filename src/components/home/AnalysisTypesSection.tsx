import React from 'react';

interface AnalysisTypesSectionProps {
  language: 'ar' | 'en';
}

const AnalysisTypesSection: React.FC<AnalysisTypesSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-gold text-center mb-12">
        {t('أنواع التحليل', 'Analysis Types')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('التحليل الأساسي الكلاسيكي', 'Basic Classical Analysis')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('55 تحليل أساسي', '55 Basic Analyses')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('التحليل التطبيقي المتوسط', 'Applied Intermediate Analysis')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('38 تحليل تطبيقي', '38 Applied Analyses')}
          </p>
        </div>
        <div className="bg-black/50 border border-gold/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gold mb-3">
            {t('التحليل المتقدم والمتطور', 'Advanced & Sophisticated Analysis')}
          </h3>
          <p className="text-gold/70 text-sm">
            {t('88 تحليل متقدم', '88 Advanced Analyses')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisTypesSection;
