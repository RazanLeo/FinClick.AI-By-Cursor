'use client'

import React from 'react'
import { Calculator, TrendingUp, PieChart, BarChart3 } from 'lucide-react'

interface FreeToolsSectionProps {
  language: 'ar' | 'en'
}

const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const freeTools = [
    {
      icon: Calculator,
      title: t('حاسبة النسب المالية', 'Financial Ratios Calculator'),
      description: t(
        'احسب النسب المالية الأساسية بسهولة وسرعة',
        'Calculate basic financial ratios easily and quickly'
      ),
      features: [
        t('نسبة السيولة', 'Liquidity Ratio'),
        t('نسبة الربحية', 'Profitability Ratio'),
        t('نسبة الكفاءة', 'Efficiency Ratio'),
        t('نسبة الرافعة', 'Leverage Ratio'),
      ],
    },
    {
      icon: TrendingUp,
      title: t('مؤشرات الأداء', 'Performance Indicators'),
      description: t(
        'تتبع مؤشرات الأداء المالي الرئيسية',
        'Track key financial performance indicators'
      ),
      features: [
        t('معدل النمو', 'Growth Rate'),
        t('العائد على الاستثمار', 'ROI'),
        t('العائد على الأصول', 'ROA'),
        t('العائد على حقوق الملكية', 'ROE'),
      ],
    },
    {
      icon: PieChart,
      title: t('تحليل التوزيع', 'Distribution Analysis'),
      description: t(
        'حلل توزيع الأصول والالتزامات',
        'Analyze asset and liability distribution'
      ),
      features: [
        t('توزيع الأصول', 'Asset Distribution'),
        t('توزيع الالتزامات', 'Liability Distribution'),
        t('توزيع الإيرادات', 'Revenue Distribution'),
        t('توزيع التكاليف', 'Cost Distribution'),
      ],
    },
    {
      icon: BarChart3,
      title: t('التحليل المقارن', 'Comparative Analysis'),
      description: t(
        'قارن الأداء المالي عبر فترات زمنية مختلفة',
        'Compare financial performance across different time periods'
      ),
      features: [
        t('المقارنة السنوية', 'Year-over-Year'),
        t('المقارنة الفصلية', 'Quarter-over-Quarter'),
        t('المقارنة الشهرية', 'Month-over-Month'),
        t('المقارنة مع المعايير', 'Benchmark Comparison'),
      ],
    },
  ]

  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('الأدوات المجانية', 'Free Tools')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'استخدم أدواتنا المجانية للتحليل المالي الأساسي دون الحاجة للاشتراك',
              'Use our free tools for basic financial analysis without needing a subscription'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {freeTools.map((tool, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <tool.icon className="w-8 h-8 text-gold" />
              </div>
              
              <h3 className="text-xl font-semibold text-gold mb-3 text-center">
                {tool.title}
              </h3>
              
              <p className="text-gold/70 mb-4 text-center text-sm leading-relaxed">
                {tool.description}
              </p>
              
              <ul className="space-y-2">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-gold/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full mt-6 bg-gold/10 text-gold py-2 px-4 rounded-lg hover:bg-gold/20 transition-colors duration-300 text-sm font-medium">
                {t('جرب الآن', 'Try Now')}
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gold/10 rounded-xl p-8 border border-gold/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gold mb-4">
              {t('هل تريد المزيد؟', 'Want More?')}
            </h3>
            <p className="text-gold/70 mb-6">
              {t(
                'احصل على وصول كامل لجميع التحليلات المتقدمة والتقارير المفصلة',
                'Get full access to all advanced analyses and detailed reports'
              )}
            </p>
            <button className="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300">
              {t('اشترك الآن', 'Subscribe Now')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeToolsSection
