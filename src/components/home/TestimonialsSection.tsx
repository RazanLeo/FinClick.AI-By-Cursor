'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

interface TestimonialsSectionProps {
  language: 'ar' | 'en'
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const testimonials = [
    {
      name: t('أحمد محمد', 'Ahmed Mohammed'),
      position: t('مدير مالي', 'Financial Manager'),
      company: t('شركة التقنية المتقدمة', 'Advanced Technology Company'),
      content: t(
        'منصة FinClick.AI غيرت طريقة تحليلنا المالي تماماً. الدقة والسرعة في التحليل لا مثيل لها',
        'FinClick.AI platform completely changed our financial analysis approach. The accuracy and speed of analysis is unmatched'
      ),
      rating: 5,
    },
    {
      name: t('سارة أحمد', 'Sara Ahmed'),
      position: t('محللة مالية', 'Financial Analyst'),
      company: t('مجموعة الاستثمار الذكي', 'Smart Investment Group'),
      content: t(
        'التقارير الثنائية اللغة والتحليلات المتقدمة ساعدتني في اتخاذ قرارات استثمارية أفضل',
        'Bilingual reports and advanced analyses helped me make better investment decisions'
      ),
      rating: 5,
    },
    {
      name: t('محمد علي', 'Mohammed Ali'),
      position: t('رئيس قسم المحاسبة', 'Head of Accounting'),
      company: t('البنك التجاري', 'Commercial Bank'),
      content: t(
        'سهولة الاستخدام والتحليلات الشاملة جعلت من FinClick.AI أداة لا غنى عنها',
        'Ease of use and comprehensive analyses made FinClick.AI an indispensable tool'
      ),
      rating: 5,
    },
    {
      name: t('فاطمة حسن', 'Fatima Hassan'),
      position: t('مستشارة مالية', 'Financial Consultant'),
      company: t('مؤسسة الاستشارات المالية', 'Financial Consulting Firm'),
      content: t(
        'الذكاء الاصطناعي المتقدم والتحليلات الدقيقة يوفران رؤى قيمة لعملائنا',
        'Advanced AI and accurate analyses provide valuable insights for our clients'
      ),
      rating: 5,
    },
    {
      name: t('خالد عبدالله', 'Khalid Abdullah'),
      position: t('مدير عام', 'General Manager'),
      company: t('شركة التطوير العقاري', 'Real Estate Development Company'),
      content: t(
        'التقارير التفصيلية والتحليلات المتقدمة ساعدتنا في تحسين أدائنا المالي بشكل كبير',
        'Detailed reports and advanced analyses helped us significantly improve our financial performance'
      ),
      rating: 5,
    },
    {
      name: t('نورا السعيد', 'Nora Al-Saeed'),
      position: t('محاسبة أولى', 'Senior Accountant'),
      company: t('شركة الخدمات المالية', 'Financial Services Company'),
      content: t(
        'واجهة سهلة الاستخدام والتحليلات الشاملة تجعل العمل أكثر كفاءة وفعالية',
        'User-friendly interface and comprehensive analyses make work more efficient and effective'
      ),
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-playfair">
            {t('آراء عملائنا', 'Client Testimonials')}
          </h2>
          <p className="text-xl text-gold/70 max-w-3xl mx-auto">
            {t(
              'اكتشف ما يقوله عملاؤنا عن منصة FinClick.AI وكيف ساعدتهم في تحسين أدائهم المالي',
              'Discover what our clients say about FinClick.AI platform and how it helped them improve their financial performance'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-gold/50 mr-2" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gold/70 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-gold/20 pt-4">
                <div className="font-semibold text-gold">
                  {testimonial.name}
                </div>
                <div className="text-gold/70 text-sm">
                  {testimonial.position}
                </div>
                <div className="text-gold/50 text-sm">
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gold mb-2">500+</div>
            <div className="text-gold/70">{t('عميل راضي', 'Satisfied Clients')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold mb-2">98%</div>
            <div className="text-gold/70">{t('معدل الرضا', 'Satisfaction Rate')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold mb-2">24/7</div>
            <div className="text-gold/70">{t('دعم فني', 'Technical Support')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold mb-2">99.9%</div>
            <div className="text-gold/70">{t('وقت التشغيل', 'Uptime')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
