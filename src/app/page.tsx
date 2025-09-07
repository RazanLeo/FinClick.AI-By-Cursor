'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import StepsSection from '@/components/home/StepsSection'
import AnalysisTypesSection from '@/components/home/AnalysisTypesSection'
import FreeToolsSection from '@/components/home/FreeToolsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import PricingSection from '@/components/home/PricingSection'
import AIBackground from '@/components/ui/AIBackground'
import MarketTicker from '@/components/ui/MarketTicker'

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar')
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <AIBackground />
      <MarketTicker />
      
      <Header 
        language={language} 
        onLanguageToggle={toggleLanguage}
      />
      
      <HeroSection language={language} />
      <FeaturesSection language={language} />
      <StepsSection language={language} />
      <AnalysisTypesSection language={language} />
      <FreeToolsSection language={language} />
      <TestimonialsSection language={language} />
      <PricingSection language={language} />
      
      <Footer language={language} />
    </main>
  )
}
