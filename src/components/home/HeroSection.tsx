'use client'

import React from 'react'
import { ArrowRight, BarChart3, Brain, Zap } from 'lucide-react'

interface HeroSectionProps {
  language: 'ar' | 'en'
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  return (
    <section className="pt-32 pb-20 px-4 relative">
      <div className="container mx-auto text-center">
        {/* Main Heading */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gold mb-6 font-playfair leading-tight">
            {t(
              'منصة التحليل المالي الذكية والثورية',
              'Revolutionary Intelligent Financial Analysis Platform'
            )}
          </h1>
          <p className="text-xl md:text-2xl text-gold/70 mb-8 leading-relaxed">
            {t(
              'اكتشف قوة الذكاء الاصطناعي في التحليل المالي مع 181 نوعاً من التحليلات المتقدمة والتقارير الثنائية اللغة',
              'Discover the power of AI in financial analysis with 181 advanced analysis types and bilingual reports'
            )}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="group bg-gold text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gold/90 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <span>{t('ابدأ التحليل الآن', 'Start Analysis Now')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button className="group border-2 border-gold text-gold px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gold hover:text-black transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
            <span>{t('شاهد العرض التوضيحي', 'Watch Demo')}</span>
            <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
              <Brain className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-gold mb-3">
              {t('ذكاء اصطناعي متقدم', 'Advanced AI')}
            </h3>
            <p className="text-gold/70">
              {t(
                'تقنيات الذكاء الاصطناعي الأحدث لتحليل البيانات المالية بدقة عالية',
                'Latest AI technologies for high-accuracy financial data analysis'
              )}
            </p>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
              <BarChart3 className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-gold mb-3">
              {t('181 نوع تحليل', '181 Analysis Types')}
            </h3>
            <p className="text-gold/70">
              {t(
                'مجموعة شاملة من التحليلات المالية من الأساسية إلى المتقدمة',
                'Comprehensive range of financial analyses from basic to advanced'
              )}
            </p>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
              <Zap className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-gold mb-3">
              {t('تقارير فورية', 'Instant Reports')}
            </h3>
            <p className="text-gold/70">
              {t(
                'تقارير مالية مفصلة بصيغ متعددة مع دعم اللغتين العربية والإنجليزية',
                'Detailed financial reports in multiple formats with Arabic and English support'
              )}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">181</div>
            <div className="text-gold/70">{t('نوع تحليل', 'Analysis Types')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">50+</div>
            <div className="text-gold/70">{t('شركة', 'Companies')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">99.9%</div>
            <div className="text-gold/70">{t('دقة', 'Accuracy')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gold mb-2">24/7</div>
            <div className="text-gold/70">{t('دعم', 'Support')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
