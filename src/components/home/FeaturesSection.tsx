import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  DocumentTextIcon,
  SparklesIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface FeaturesSectionProps {
  language: 'ar' | 'en';
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  const features = [
    {
      icon: ChartBarIcon,
      title: t('181 تحليل مالي شامل', '181 Comprehensive Financial Analyses'),
      description: t(
        'تحليلات مالية متقدمة تغطي جميع جوانب الأداء المالي من النسب الأساسية إلى التحليلات المتقدمة',
        'Advanced financial analyses covering all aspects of financial performance from basic ratios to advanced analytics'
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ClockIcon,
      title: t('تحليل فوري', 'Instant Analysis'),
      description: t(
        'احصل على نتائج التحليل في ثوانٍ معدودة بدلاً من أسابيع من العمل التقليدي',
        'Get analysis results in seconds instead of weeks of traditional work'
      ),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: SparklesIcon,
      title: t('ذكاء اصطناعي متقدم', 'Advanced AI'),
      description: t(
        'تقنيات الذكاء الاصطناعي الأحدث لتحليل البيانات المالية وتقديم رؤى دقيقة',
        'Latest AI technologies for financial data analysis and accurate insights'
      ),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: DocumentTextIcon,
      title: t('تقارير احترافية', 'Professional Reports'),
      description: t(
        'تقارير شاملة باللغتين العربية والإنجليزية جاهزة للعرض والتسليم',
        'Comprehensive reports in Arabic and English ready for presentation and delivery'
      ),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: GlobeAltIcon,
      title: t('مقارنات عالمية', 'Global Comparisons'),
      description: t(
        'قارن أداء شركتك مع متوسطات الصناعة محلياً وإقليمياً وعالمياً',
        'Compare your company performance with industry averages locally, regionally and globally'
      ),
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: ShieldCheckIcon,
      title: t('أمان وحماية', 'Security & Protection'),
      description: t(
        'حماية كاملة للبيانات وفق أعلى المعايير السعودية والعالمية',
        'Complete data protection according to the highest Saudi and international standards'
      ),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: CpuChipIcon,
      title: t('تحليل متقدم', 'Advanced Analytics'),
      description: t(
        'تحليلات إحصائية ونمذجة مالية متقدمة للتنبؤ والتخطيط',
        'Statistical analysis and advanced financial modeling for prediction and planning'
      ),
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: CurrencyDollarIcon,
      title: t('تقييم الاستثمار', 'Investment Valuation'),
      description: t(
        'تقييم دقيق للاستثمارات والمشاريع مع حساب العوائد والمخاطر',
        'Accurate investment and project valuation with return and risk calculation'
      ),
      color: 'from-green-600 to-teal-500'
    },
    {
      icon: UserGroupIcon,
      title: t('إدارة المستخدمين', 'User Management'),
      description: t(
        'نظام إدارة متقدم للمستخدمين مع صلاحيات مختلفة ومتابعة الأداء',
        'Advanced user management system with different permissions and performance tracking'
      ),
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: LockClosedIcon,
      title: t('امتثال IFRS', 'IFRS Compliance'),
      description: t(
        'التوافق الكامل مع معايير المحاسبة الدولية IFRS',
        'Full compliance with international accounting standards IFRS'
      ),
      color: 'from-gray-500 to-slate-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-6">
            {t('مميزات المنصة المتطورة', 'Advanced Platform Features')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto leading-relaxed">
            {t(
              'منصة شاملة تجمع بين أحدث تقنيات الذكاء الاصطناعي والتحليل المالي المتقدم لتقديم حلول مالية ذكية ومبتكرة',
              'A comprehensive platform that combines the latest AI technologies and advanced financial analysis to provide smart and innovative financial solutions'
            )}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-black/40 border border-gold/20 rounded-2xl p-8 hover:border-gold/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gold mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gold/70 leading-relaxed group-hover:text-gold/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border border-gold/0 group-hover:border-gold/20 transition-all duration-300"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gold/10 to-yellow-400/10 border border-gold/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gold mb-4">
              {t('جاهز لبدء رحلتك في التحليل المالي الذكي؟', 'Ready to start your smart financial analysis journey?')}
            </h3>
            <p className="text-gold/70 mb-6">
              {t('انضم إلى آلاف الشركات التي تثق في FinClick.AI لتحليلها المالي', 'Join thousands of companies that trust FinClick.AI for their financial analysis')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105">
                {t('ابدأ التجربة المجانية', 'Start Free Trial')}
              </button>
              <button className="px-8 py-3 border border-gold/30 text-gold font-semibold rounded-lg hover:border-gold hover:bg-gold/10 transition-all duration-300">
                {t('شاهد العرض التوضيحي', 'Watch Demo')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
