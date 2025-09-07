import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  SparklesIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  language: 'ar' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  const features = [
    {
      icon: ChartBarIcon,
      text: t('181 تحليل مالي', '181 Financial Analyses'),
      subtext: t('شامل ومفصل', 'Comprehensive & Detailed')
    },
    {
      icon: ClockIcon,
      text: t('تحليل فوري', 'Instant Analysis'),
      subtext: t('في ثوانٍ معدودة', 'In Seconds')
    },
    {
      icon: SparklesIcon,
      text: t('ذكاء اصطناعي', 'AI Powered'),
      subtext: t('أحدث التقنيات', 'Latest Technologies')
    },
    {
      icon: ShieldCheckIcon,
      text: t('آمن ومحمي', 'Secure & Protected'),
      subtext: t('معايير SAMA', 'SAMA Standards')
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gold/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gold/5 rounded-full blur-xl animate-pulse delay-2000"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">
                {t('منصة التحليل المالي الثورية', 'Revolutionary Financial Analysis Platform')}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                {t('FinClick.AI', 'FinClick.AI')}
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl text-gold/90 mb-4"
            >
              {t('التحليل المالي الذكي الشامل', 'Comprehensive Smart Financial Analysis')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-gold/70 mb-8 leading-relaxed"
            >
              {t(
                'منصة ذكاء اصطناعي سعودية متطورة تقدم 181 نوع تحليل مالي شامل في ثوانٍ معدودة. احصل على تقارير احترافية، تحليلات تفصيلية، وتوقعات ذكية لاتخاذ قرارات مالية مدروسة.',
                'Advanced Saudi AI platform offering 181 comprehensive financial analysis types in seconds. Get professional reports, detailed analyses, and smart predictions for informed financial decisions.'
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{t('ابدأ التحليل الآن', 'Start Analysis Now')}</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-gold rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Link>

              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gold/30 text-gold font-semibold text-lg rounded-xl hover:border-gold hover:bg-gold/10 transition-all duration-300">
                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>{t('شاهد العرض التوضيحي', 'Watch Demo')}</span>
              </button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-3 p-4 bg-black/30 border border-gold/20 rounded-lg hover:bg-gold/5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-gold font-semibold text-sm">{feature.text}</p>
                      <p className="text-gold/60 text-xs">{feature.subtext}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            {/* Main Demo Card */}
            <div className="relative bg-black/50 border border-gold/20 rounded-2xl p-8 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">F</span>
                  </div>
                  <div>
                    <h3 className="text-gold font-bold text-lg">FinClick.AI</h3>
                    <p className="text-gold/60 text-sm">{t('لوحة التحليل', 'Analysis Dashboard')}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="space-y-4">
                <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gold font-semibold">{t('التحليل الجاري', 'Analysis in Progress')}</span>
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-gold to-yellow-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                  <p className="text-gold/60 text-sm mt-2">75% {t('مكتمل', 'Complete')}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gold">181</p>
                    <p className="text-gold/60 text-xs">{t('تحليل', 'Analyses')}</p>
                  </div>
                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gold">2.3s</p>
                    <p className="text-gold/60 text-xs">{t('ثانية', 'Seconds')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gold/80 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('تحليل النسب المالية', 'Financial Ratios Analysis')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gold/80 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('تحليل التدفق النقدي', 'Cash Flow Analysis')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gold/80 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>{t('تحليل المخاطر', 'Risk Analysis')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gold/60 text-sm">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>{t('التوقعات المستقبلية', 'Future Predictions')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-gold to-yellow-400 text-black p-3 rounded-lg shadow-xl"
            >
              <p className="font-bold text-sm">{t('+50% دقة', '+50% Accuracy')}</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-black/80 border border-gold/30 text-gold p-3 rounded-lg shadow-xl"
            >
              <p className="font-semibold text-sm">{t('IFRS متوافق', 'IFRS Compliant')}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
