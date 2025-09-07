'use client'

import React from 'react'
import { Upload, BarChart3, FileText, Download } from 'lucide-react'

interface StepsSectionProps {
  language: 'ar' | 'en'
}

const StepsSection: React.FC<StepsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: t('رفع البيانات', 'Upload Data'),
      description: t(
        'قم برفع ملفاتك المالية بصيغ مختلفة مثل Excel أو CSV أو PDF',
        'Upload your financial files in various formats like Excel, CSV, or PDF'
      ),
    },
    {
      number: '02',
      icon: BarChart3,
      title: t('اختيار التحليل', 'Select Analysis'),
      description: t(
        'اختر من بين 181 نوعاً من التحليلات المالية المتاحة',
        'Choose from 181 available financial analysis types'
      ),
    },
    {
      number: '03',
      icon: FileText,
      title: t('معالجة البيانات', 'Process Data'),
      description: t(
        'يقوم الذكاء الاصطناعي بمعالجة البيانات وإنتاج التحليل المطلوب',
        'AI processes the data and produces the required analysis'
      ),
    },
    {
      number: '04',
      icon: Download,
      title: t('تحميل التقرير', 'Download Report'),
      description: t(
        'احصل على تقريرك المالي المفصل بصيغة PDF أو Word أو Excel',
        'Get your detailed financial report in PDF, Word, or Excel format'
      ),
    },
  ]

  return (
    <section className="py-20 px-4 bg-black/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('كيف يعمل النظام', 'How It Works')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'خطوات بسيطة للحصول على تحليل مالي شامل ومفصل',
              'Simple steps to get comprehensive and detailed financial analysis'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gold/20 transform translate-x-8" />
              )}
              
              <div className="relative z-10">
                <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors duration-300 relative">
                  <step.icon className="w-12 h-12 text-gold" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gold mb-4">
                  {step.title}
                </h3>
                <p className="text-gold/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StepsSection
