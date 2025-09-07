'use client'

import React from 'react'
import { TrendingUp, Calculator, PieChart, BarChart3 } from 'lucide-react'

interface AnalysisTypesSectionProps {
  language: 'ar' | 'en'
}

const AnalysisTypesSection: React.FC<AnalysisTypesSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const analysisCategories = [
    {
      icon: Calculator,
      title: t('التحليلات الأساسية', 'Basic Analysis'),
      count: '55',
      description: t(
        'التحليلات المالية الأساسية مثل النسب المالية والتحليل الأفقي والعمودي',
        'Basic financial analyses like financial ratios and horizontal and vertical analysis'
      ),
      features: [
        t('النسب المالية', 'Financial Ratios'),
        t('التحليل الأفقي', 'Horizontal Analysis'),
        t('التحليل العمودي', 'Vertical Analysis'),
        t('تحليل التدفق النقدي', 'Cash Flow Analysis'),
      ],
    },
    {
      icon: TrendingUp,
      title: t('التحليلات المتوسطة', 'Intermediate Analysis'),
      count: '38',
      description: t(
        'التحليلات المتقدمة للأداء المالي والتقييم والتنبؤ',
        'Advanced analyses for financial performance, valuation, and forecasting'
      ),
      features: [
        t('تحليل الأداء', 'Performance Analysis'),
        t('التقييم المالي', 'Financial Valuation'),
        t('التنبؤ المالي', 'Financial Forecasting'),
        t('تحليل المخاطر', 'Risk Analysis'),
      ],
    },
    {
      icon: PieChart,
      title: t('التحليلات المتقدمة', 'Advanced Analysis'),
      count: '88',
      description: t(
        'التحليلات المتطورة باستخدام الذكاء الاصطناعي والتعلم الآلي',
        'Advanced analyses using AI and machine learning'
      ),
      features: [
        t('الذكاء الاصطناعي', 'Artificial Intelligence'),
        t('التعلم الآلي', 'Machine Learning'),
        t('تحليل المشاعر', 'Sentiment Analysis'),
        t('التحليل التنبؤي', 'Predictive Analysis'),
      ],
    },
  ]

  return (
    <section id="analysis-types" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('أنواع التحليل المالي', 'Financial Analysis Types')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'اكتشف 181 نوعاً من التحليلات المالية المتقدمة المصممة لتلبية جميع احتياجاتك',
              'Discover 181 advanced financial analysis types designed to meet all your needs'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {analysisCategories.map((category, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-8 hover:border-gold/40 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
                  <category.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="text-3xl font-bold text-gold">
                  {category.count}
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-gold mb-4">
                {category.title}
              </h3>
              
              <p className="text-gold/70 mb-6 leading-relaxed">
                {category.description}
              </p>
              
              <ul className="space-y-2">
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-gold/70">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Total Count */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-gold/10 rounded-full px-8 py-4 border border-gold/20">
            <BarChart3 className="w-8 h-8 text-gold" />
            <div>
              <div className="text-3xl font-bold text-gold">181</div>
              <div className="text-gold/70">{t('نوع تحليل شامل', 'Comprehensive Analysis Types')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnalysisTypesSection
