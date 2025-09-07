'use client'

import React from 'react'
import { BarChart3, Brain, FileText, Globe, Shield, Zap } from 'lucide-react'

interface FeaturesSectionProps {
  language: 'ar' | 'en'
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const features = [
    {
      icon: Brain,
      title: t('ذكاء اصطناعي متقدم', 'Advanced AI'),
      description: t(
        'تقنيات الذكاء الاصطناعي الأحدث لتحليل البيانات المالية بدقة عالية وسرعة فائقة',
        'Latest AI technologies for high-accuracy and ultra-fast financial data analysis'
      ),
    },
    {
      icon: BarChart3,
      title: t('181 نوع تحليل', '181 Analysis Types'),
      description: t(
        'مجموعة شاملة من التحليلات المالية من الأساسية إلى المتقدمة مع تفسيرات مفصلة',
        'Comprehensive range of financial analyses from basic to advanced with detailed explanations'
      ),
    },
    {
      icon: FileText,
      title: t('تقارير متعددة الصيغ', 'Multi-format Reports'),
      description: t(
        'تصدير التقارير بصيغ PDF و Word و Excel و PowerPoint مع تصميم احترافي',
        'Export reports in PDF, Word, Excel, and PowerPoint formats with professional design'
      ),
    },
    {
      icon: Globe,
      title: t('دعم ثنائي اللغة', 'Bilingual Support'),
      description: t(
        'واجهة وتقارير باللغتين العربية والإنجليزية مع دعم كامل للاتجاهات',
        'Interface and reports in both Arabic and English with full RTL/LTR support'
      ),
    },
    {
      icon: Shield,
      title: t('أمان عالي', 'High Security'),
      description: t(
        'حماية متقدمة للبيانات المالية مع تشفير من الدرجة العسكرية',
        'Advanced protection for financial data with military-grade encryption'
      ),
    },
    {
      icon: Zap,
      title: t('سرعة فائقة', 'Ultra Fast'),
      description: t(
        'معالجة سريعة للبيانات مع نتائج فورية ودقة عالية',
        'Fast data processing with instant results and high accuracy'
      ),
    },
  ]

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('مميزات المنصة', 'Platform Features')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'اكتشف القوة الكاملة لمنصة FinClick.AI مع المميزات المتقدمة التي تجعل التحليل المالي سهلاً وفعالاً',
              'Discover the full power of FinClick.AI with advanced features that make financial analysis easy and effective'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-8 hover:border-gold/40 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl font-semibold text-gold mb-4">
                {feature.title}
              </h3>
              <p className="text-gold/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
