'use client'

import React from 'react'
import { Check, Star, Zap } from 'lucide-react'

interface PricingSectionProps {
  language: 'ar' | 'en'
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const plans = [
    {
      name: t('الخطة الأساسية', 'Basic Plan'),
      price: t('99', '99'),
      currency: t('ريال', 'SAR'),
      period: t('شهرياً', 'monthly'),
      description: t(
        'مثالية للشركات الصغيرة والمستثمرين الأفراد',
        'Perfect for small businesses and individual investors'
      ),
      features: [
        t('50 تحليل مالي', '50 Financial Analyses'),
        t('تقارير PDF', 'PDF Reports'),
        t('دعم فني', 'Technical Support'),
        t('تخزين 1GB', '1GB Storage'),
        t('تصدير Excel', 'Excel Export'),
      ],
      popular: false,
    },
    {
      name: t('الخطة المتقدمة', 'Advanced Plan'),
      price: t('199', '199'),
      currency: t('ريال', 'SAR'),
      period: t('شهرياً', 'monthly'),
      description: t(
        'الأكثر شعبية للشركات المتوسطة والمحللين الماليين',
        'Most popular for medium companies and financial analysts'
      ),
      features: [
        t('181 تحليل مالي', '181 Financial Analyses'),
        t('جميع صيغ التقارير', 'All Report Formats'),
        t('دعم فني متقدم', 'Advanced Technical Support'),
        t('تخزين 10GB', '10GB Storage'),
        t('تصدير متعدد الصيغ', 'Multi-format Export'),
        t('تحليل مقارن', 'Comparative Analysis'),
        t('تقارير مخصصة', 'Custom Reports'),
      ],
      popular: true,
    },
    {
      name: t('الخطة المؤسسية', 'Enterprise Plan'),
      price: t('499', '499'),
      currency: t('ريال', 'SAR'),
      period: t('شهرياً', 'monthly'),
      description: t(
        'للشركات الكبيرة والمؤسسات المالية',
        'For large companies and financial institutions'
      ),
      features: [
        t('جميع التحليلات المتقدمة', 'All Advanced Analyses'),
        t('تقارير مخصصة كاملة', 'Full Custom Reports'),
        t('دعم فني مخصص', 'Dedicated Technical Support'),
        t('تخزين غير محدود', 'Unlimited Storage'),
        t('API متقدم', 'Advanced API'),
        t('تحليل متعدد المستخدمين', 'Multi-user Analysis'),
        t('تقارير تلقائية', 'Automated Reports'),
        t('تدريب مخصص', 'Custom Training'),
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-black/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('خطط الاشتراك', 'Subscription Plans')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'اختر الخطة التي تناسب احتياجاتك واحصل على أفضل قيمة مقابل المال',
              'Choose the plan that suits your needs and get the best value for money'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-black/50 backdrop-blur-sm border rounded-xl p-8 hover:border-gold/40 transition-all duration-300 group hover:transform hover:scale-105 ${
                plan.popular
                  ? 'border-gold/60 ring-2 ring-gold/20'
                  : 'border-gold/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gold text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{t('الأكثر شعبية', 'Most Popular')}</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gold mb-2">
                  {plan.name}
                </h3>
                <p className="text-gold/70 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gold">
                    {plan.price}
                  </span>
                  <span className="text-gold/70 ml-2">
                    {plan.currency}
                  </span>
                  <span className="text-gold/50 text-sm ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-gold/70">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gold text-black hover:bg-gold/90'
                    : 'bg-gold/10 text-gold hover:bg-gold/20 border border-gold/20'
                }`}
              >
                {t('اشترك الآن', 'Subscribe Now')}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-gold/10 rounded-xl p-8 border border-gold/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gold mb-4">
              {t('هل تحتاج خطة مخصصة؟', 'Need a Custom Plan?')}
            </h3>
            <p className="text-gold/70 mb-6">
              {t(
                'تواصل معنا للحصول على خطة مخصصة تناسب احتياجاتك الخاصة',
                'Contact us for a custom plan that suits your specific needs'
              )}
            </p>
            <button className="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300 flex items-center space-x-2 mx-auto">
              <Zap className="w-5 h-5" />
              <span>{t('تواصل معنا', 'Contact Us')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
