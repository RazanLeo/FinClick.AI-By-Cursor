
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StepsSection from '@/components/home/StepsSection';
import AnalysisTypesSection from '@/components/home/AnalysisTypesSection';
import FreeToolsSection from '@/components/home/FreeToolsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PricingSection from '@/components/home/PricingSection';
import MarketTicker from '@/components/widgets/MarketTicker';
import AIBackground from '@/components/effects/AIBackground';

export default function HomePage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // تحديد اتجاه الصفحة حسب اللغة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-black text-gold relative overflow-hidden">
      {/* خلفية الذكاء الاصطناعي */}
      <AIBackground />
      
      {/* الهيدر */}
      <Header language={language} setLanguage={setLanguage} />
      
      {/* شريط الأسعار المباشر */}
      <MarketTicker />
      
      {/* المحتوى الرئيسي */}
      <main className="relative z-10">
        {/* قسم الهيرو */}
        <HeroSection language={language} />
        
        {/* قسم المميزات */}
        <FeaturesSection language={language} />
        
        {/* قسم الخطوات */}
        <StepsSection language={language} />
        
        {/* قسم أنواع التحليل */}
        <AnalysisTypesSection language={language} />
        
        {/* قسم الأدوات المجانية */}
        <FreeToolsSection language={language} />
        
        {/* قسم آراء العملاء */}
        <TestimonialsSection language={language} />
        
        {/* قسم الأسعار */}
        <PricingSection language={language} />
      </main>
      
      {/* الفوتر */}
      <Footer language={language} />
    </div>
  );
}
