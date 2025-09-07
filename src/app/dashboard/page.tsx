// src/app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Download, 
  Play,
  Settings,
  Building,
  Calendar,
  Globe,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FileUploadZone from '@/components/dashboard/FileUploadZone';
import AnalysisOptions from '@/components/dashboard/AnalysisOptions';
import AnalysisResults from '@/components/dashboard/AnalysisResults';
import { useAuth } from '@/hooks/useAuth';
import { analyzeFinancialData } from '@/lib/analysis/analyzer';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisOptions, setAnalysisOptions] = useState({
    companyName: '',
    sector: '',
    activity: '',
    legalEntity: '',
    comparisonLevel: '',
    yearsCount: 1,
    analysisType: 'comprehensive',
    language: 'ar'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const content = {
    ar: {
      title: 'لوحة التحكم',
      uploadSection: 'رفع المستندات المالية',
      uploadInstructions: 'ارفق القوائم المالية أو موازين المراجعة (PDF, Excel, Word, صور)',
      maxFiles: 'حتى 10 ملفات - أي حجم',
      companyName: 'اسم الشركة',
      sector: 'القطاع',
      activity: 'النشاط',
      legalEntity: 'الكيان القانوني',
      comparisonLevel: 'مستوى المقارنة',
      yearsCount: 'عدد سنوات التحليل',
      analysisType: 'نوع التحليل',
      startAnalysis: 'بدء التحليل',
      analyzing: 'جاري التحليل...',
      generateReport: 'توليد التقرير',
      generatePresentation: 'توليد العرض التقديمي',
      uploadedFiles: 'الملفات المرفوعة',
      removeFile: 'إزالة',
      selectSector: 'اختر القطاع',
      selectActivity: 'اختر النشاط',
      selectLegalEntity: 'اختر الكيان القانوني',
      selectComparisonLevel: 'اختر مستوى المقارنة',
      selectAnalysisType: 'اختر نوع التحليل'
    },
    en: {
      title: 'Dashboard',
      uploadSection: 'Upload Financial Documents',
      uploadInstructions: 'Upload financial statements or trial balances (PDF, Excel, Word, Images)',
      maxFiles: 'Up to 10 files - Any size',
      companyName: 'Company Name',
      sector: 'Sector',
      activity: 'Activity',
      legalEntity: 'Legal Entity',
      comparisonLevel: 'Comparison Level',
      yearsCount: 'Years of Analysis',
      analysisType: 'Analysis Type',
      startAnalysis: 'Start Analysis',
      analyzing: 'Analyzing...',
      generateReport: 'Generate Report',
      generatePresentation: 'Generate Presentation',
      uploadedFiles: 'Uploaded Files',
      removeFile: 'Remove',
      selectSector: 'Select Sector',
      selectActivity: 'Select Activity',
      selectLegalEntity: 'Select Legal Entity',
      selectComparisonLevel: 'Select Comparison Level',
      selectAnalysisType: 'Select Analysis Type'
    }
  };

  const t = content[language];

  // القطاعات
  const sectors = {
    ar: [
      'الطاقة والموارد الطبيعية',
      'المواد الأساسية والكيماويات',
      'التعدين والمعادن',
      'الصناعات التحويلية',
      'الأغذية والمشروبات',
      'الزراعة والثروة الحيوانية',
      'الصيد والموارد البحرية',
      'القطاع المالي والمصرفي',
      'العقارات والإنشاءات',
      'التجارة والتجزئة',
      'النقل واللوجستيات',
      'الاتصالات وتكنولوجيا المعلومات',
      'الذكاء الاصطناعي والتعلم الآلي',
      'الرعاية الصحية',
      'التعليم والتدريب',
      'السياحة والضيافة',
      'الإعلام والترفيه',
      'الخدمات المهنية والاستشارية',
      'الخدمات الشخصية والمجتمعية',
      'الدفاع والأمن',
      'الفضاء والأقمار الصناعية',
      'البيئة والاستدامة',
      'الروبوتات والأتمتة',
      'القطاع الحكومي والعام',
      'القطاع غير الربحي والخيري',
      'قطاع الاقتصاد الإبداعي',
      'القطاعات الناشئة والمستقبلية'
    ],
    en: [
      'Energy and Natural Resources',
      'Basic Materials and Chemicals',
      'Mining and Metals',
      'Manufacturing Industries',
      'Food and Beverages',
      'Agriculture and Livestock',
      'Fishing and Marine Resources',
      'Financial and Banking Sector',
      'Real Estate and Construction',
      'Trade and Retail',
      'Transportation and Logistics',
      'Communications and IT',
      'AI and Machine Learning',
      'Healthcare',
      'Education and Training',
      'Tourism and Hospitality',
      'Media and Entertainment',
      'Professional and Consulting Services',
      'Personal and Community Services',
      'Defense and Security',
      'Space and Satellites',
      'Environment and Sustainability',
      'Robotics and Automation',
      'Government and Public Sector',
      'Non-profit and Charitable Sector',
      'Creative Economy Sector',
      'Emerging and Future Sectors'
    ]
  };

  // الكيانات القانونية
  const legalEntities = {
    ar: [
      'شركة مساهمة عامة',
      'شركة مساهمة خاصة',
      'شركة مساهمة مبسطة',
      'شركة ذات مسؤولية محدودة',
      'شركة الشخص الواحد',
      'شركة تضامن',
      'شركة توصية بسيطة',
      'شركة محاصة',
      'شركة توصية بالأسهم',
      'مؤسسة فردية',
      'شركة قابضة',
      'شركة تابعة',
      'جمعية خيرية / منظمة غير ربحية',
      'جمعية تعاونية',
      'مؤسسة وقفية',
      'مؤسسة عامة',
      'شركة مملوكة للدولة'
    ],
    en: [
      'Public Joint Stock Company',
      'Private Joint Stock Company',
      'Simplified Joint Stock Company',
      'Limited Liability Company (LLC)',
      'Single Person Company',
      'General Partnership',
      'Limited Partnership',
      'Joint Venture',
      'Partnership Limited by Shares',
      'Sole Proprietorship',
      'Holding Company',
      'Subsidiary Company',
      'Charity / Non-profit Organization',
      'Cooperative Society',
      'Endowment Foundation',
      'Public Institution',
      'State-Owned Enterprise'
    ]
  };

  // مستويات المقارنة
  const comparisonLevels = {
    ar: [
      'محلي - السعودية',
      'خليجي',
      'عربي',
      'آسيوي',
      'أفريقي',
      'أوروبي',
      'أمريكا الشمالية',
      'أمريكا الجنوبية',
      'أستراليا',
      'عالمي'
    ],
    en: [
      'Local - Saudi Arabia',
      'Gulf Region',
      'Arab Region',
      'Asian',
      'African',
      'European',
      'North American',
      'South American',
      'Australian',
      'Global'
    ]
  };

  // أنواع التحليل
  const analysisTypes = {
    ar: [
      { value: 'basic', label: 'أساسي كلاسيكي' },
      { value: 'intermediate', label: 'تطبيقي متوسط' },
      { value: 'advanced', label: 'متقدم ومتطور' },
      { value: 'comprehensive', label: 'شامل (181 نوع تحليل)' }
    ],
    en: [
      { value: 'basic', label: 'Basic Classical' },
      { value: 'intermediate', label: 'Applied Intermediate' },
      { value: 'advanced', label: 'Advanced & Sophisticated' },
      { value: 'comprehensive', label: 'Comprehensive (181 Analysis Types)' }
    ]
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleFileUpload = (files: File[]) => {
    if (uploadedFiles.length + files.length > 10) {
      toast.error(language === 'ar' ? 
        'لا يمكن رفع أكثر من 10 ملفات' : 
        'Cannot upload more than 10 files'
      );
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
    toast.success(language === 'ar' ? 
      'تم رفع الملفات بنجاح' : 
      'Files uploaded successfully'
    );
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const handleStartAnalysis = async () => {
    // التحقق من المدخلات
    if (uploadedFiles.length === 0) {
      toast.error(language === 'ar' ? 
        'الرجاء رفع ملف واحد على الأقل' : 
        'Please upload at least one file'
      );
      return;
    }

    if (!analysisOptions.companyName || !analysisOptions.sector || 
        !analysisOptions.legalEntity || !analysisOptions.comparisonLevel) {
      toast.error(language === 'ar' ? 
        'الرجاء ملء جميع الحقول المطلوبة' : 
        'Please fill all required fields'
      );
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // معالجة الملفات واستخراج البيانات
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('options', JSON.stringify(analysisOptions));

      // استدعاء API للتحليل
      const response = await fetch('/api/analysis/process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const results = await response.json();
      setAnalysisResults(results);
      
      toast.success(language === 'ar' ? 
        'تم إكمال التحليل بنجاح!' : 
        'Analysis completed successfully!'
      );
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(language === 'ar' ? 
        'حدث خطأ أثناء التحليل' : 
        'An error occurred during analysis'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <DashboardLayout language={language} setLanguage={setLanguage}>
      <div className="space-y-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gold font-playfair mb-2">
            {t.title}
          </h1>
          <p className="text-gold/70">
            {user?.companyName || 'FinClick.AI'}
          </p>
        </motion.div>

        {!analysisResults ? (
          <>
            {/* قسم رفع الملفات */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-gold/20"
            >
              <div className="flex items-center mb-4">
                <Upload className="w-6 h-6 text-gold mr-2" />
                <h2 className="text-xl font-semibold text-gold">
                  {t.uploadSection}
                </h2>
              </div>
              
              <FileUploadZone
                onFileUpload={handleFileUpload}
                language={language}
                maxFiles={10 - uploadedFiles.length}
              />

              {/* الملفات المرفوعة */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-gold mb-2">{t.uploadedFiles}:</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gold/10 rounded-lg p-3">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gold mr-2" />
                          <span className="text-gold/80 text-sm">{file.name}</span>
                          <span className="text-gold/60 text-xs ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          {t.removeFile}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* قسم خيارات التحليل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-gold/20"
            >
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-gold mr-2" />
                <h2 className="text-xl font-semibold text-gold">
                  {language === 'ar' ? 'خيارات التحليل' : 'Analysis Options'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم الشركة */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.companyName} *
                  </label>
                  <input
                    type="text"
                    value={analysisOptions.companyName}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      companyName: e.target.value
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                    placeholder={t.companyName}
                  />
                </div>

                {/* القطاع */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.sector} *
                  </label>
                  <select
                    value={analysisOptions.sector}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      sector: e.target.value
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                  >
                    <option value="">{t.selectSector}</option>
                    {sectors[language].map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* الكيان القانوني */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.legalEntity} *
                  </label>
                  <select
                    value={analysisOptions.legalEntity}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      legalEntity: e.target.value
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                  >
                    <option value="">{t.selectLegalEntity}</option>
                    {legalEntities[language].map((entity, index) => (
                      <option key={index} value={entity}>{entity}</option>
                    ))}
                  </select>
                </div>

                {/* مستوى المقارنة */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.comparisonLevel} *
                  </label>
                  <select
                    value={analysisOptions.comparisonLevel}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      comparisonLevel: e.target.value
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                  >
                    <option value="">{t.selectComparisonLevel}</option>
                    {comparisonLevels[language].map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* عدد سنوات التحليل */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.yearsCount}
                  </label>
                  <select
                    value={analysisOptions.yearsCount}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      yearsCount: parseInt(e.target.value)
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                      <option key={year} value={year}>
                        {year} {language === 'ar' ? 
                          (year === 1 ? 'سنة' : year === 2 ? 'سنتان' : 'سنوات') : 
                          (year === 1 ? 'Year' : 'Years')
                        }
                      </option>
                    ))}
                  </select>
                </div>

                {/* نوع التحليل */}
                <div>
                  <label className="block text-gold/80 text-sm mb-2">
                    {t.analysisType}
                  </label>
                  <select
                    value={analysisOptions.analysisType}
                    onChange={(e) => setAnalysisOptions({
                      ...analysisOptions,
                      analysisType: e.target.value
                    })}
                    className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-gold focus:border-gold focus:outline-none"
                  >
                    {analysisTypes[language].map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* زر بدء التحليل */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || uploadedFiles.length === 0}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isAnalyzing || uploadedFiles.length === 0
                      ? 'bg-gold/30 text-black/50 cursor-not-allowed'
                      : 'bg-gold text-black hover:bg-gold/90 animate-pulse-slow'
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                      {t.analyzing}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      {t.startAnalysis}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          /* عرض نتائج التحليل */
          <AnalysisResults
            results={analysisResults}
            language={language}
            companyInfo={{
              name: analysisOptions.companyName,
              sector: analysisOptions.sector,
              legalEntity: analysisOptions.legalEntity,
              comparisonLevel: analysisOptions.comparisonLevel
            }}
            onReset={() => {
              setAnalysisResults(null);
              setUploadedFiles([]);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
