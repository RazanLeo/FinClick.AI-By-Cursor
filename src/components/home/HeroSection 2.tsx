import React from 'react';

interface HeroSectionProps {
  language: 'ar' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold text-gold mb-6">
        {t('منصة التحليل المالي الذكي والثوري', 'Revolutionary Intelligent Financial Analysis Platform')}
      </h1>
      <p className="text-xl text-gold/80 mb-8">
        {t('ثورة في عالم التحليل المالي - 181 نوع تحليل مالي شامل', 'Revolution in Financial Analysis - 181 Comprehensive Financial Analysis Types')}
      </p>
      <button className="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
        {t('ابدأ التحليل الآن', 'Start Analysis Now')}
      </button>
    </section>
  );
};

export default HeroSection;
