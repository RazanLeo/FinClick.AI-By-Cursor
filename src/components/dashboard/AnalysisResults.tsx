import React from 'react';
import { Download, FileText, BarChart3, Presentation, RefreshCw } from 'lucide-react';

interface Props {
  results: any;
  language: 'ar' | 'en';
  companyInfo: { name: string; sector: string; legalEntity: string; comparisonLevel: string };
  onReset: () => void;
}

const AnalysisResults: React.FC<Props> = ({ results, language, companyInfo, onReset }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-black/50 border border-gold/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          {t('الملخص التنفيذي', 'Executive Summary')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('اسم الشركة', 'Company')}:</span> {companyInfo.name}
            </div>
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('القطاع', 'Sector')}:</span> {companyInfo.sector}
            </div>
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('الكيان القانوني', 'Legal Entity')}:</span> {companyInfo.legalEntity}
            </div>
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('مستوى المقارنة', 'Comparison Level')}:</span> {companyInfo.comparisonLevel}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('عدد التحليلات', 'Analysis Count')}:</span> {results?.analyses?.length || 0}
            </div>
            <div className="text-gold/80 text-sm">
              <span className="font-semibold">{t('تاريخ التحليل', 'Analysis Date')}:</span> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* SWOT Analysis */}
        {results?.executiveSummary?.swot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">{t('نقاط القوة', 'Strengths')}</h3>
              <ul className="text-green-300/80 text-sm space-y-1">
                {results.executiveSummary.swot.strengths.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-2">{t('نقاط الضعف', 'Weaknesses')}</h3>
              <ul className="text-red-300/80 text-sm space-y-1">
                {results.executiveSummary.swot.weaknesses.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">{t('الفرص', 'Opportunities')}</h3>
              <ul className="text-blue-300/80 text-sm space-y-1">
                {results.executiveSummary.swot.opportunities.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">{t('التهديدات', 'Threats')}</h3>
              <ul className="text-yellow-300/80 text-sm space-y-1">
                {results.executiveSummary.swot.threats.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results Table */}
      <div className="bg-black/50 border border-gold/20 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {t('ملخص النتائج', 'Summary of Results')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gold/70">
              <tr>
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">{t('اسم التحليل', 'Analysis')}</th>
                <th className="text-left py-2 px-2">{t('النتيجة', 'Value')}</th>
                <th className="text-left py-2 px-2">{t('معيار الصناعة', 'Benchmark')}</th>
                <th className="text-left py-2 px-2">{t('التقييم', 'Evaluation')}</th>
              </tr>
            </thead>
            <tbody className="text-gold/90">
              {(results?.analyses || []).map((row: any, idx: number) => (
                <tr key={row.id || idx} className="border-t border-gold/10">
                  <td className="py-2 px-2">{idx + 1}</td>
                  <td className="py-2 px-2">{row.name}</td>
                  <td className="py-2 px-2">{row.value}</td>
                  <td className="py-2 px-2">{row.benchmark}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.evaluation === 'good' || row.evaluation === 'جيد' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {row.evaluation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-black/50 border border-gold/20 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gold mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          {t('تحميل التقارير', 'Download Reports')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors">
            <FileText className="w-8 h-8 text-gold mb-2" />
            <span className="text-gold text-sm font-medium">PDF</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors">
            <FileText className="w-8 h-8 text-gold mb-2" />
            <span className="text-gold text-sm font-medium">Word</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors">
            <FileText className="w-8 h-8 text-gold mb-2" />
            <span className="text-gold text-sm font-medium">Excel</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors">
            <Presentation className="w-8 h-8 text-gold mb-2" />
            <span className="text-gold text-sm font-medium">PPT</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button 
          onClick={onReset} 
          className="flex items-center px-6 py-3 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors font-semibold"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {t('بدء تحليل جديد', 'Start New Analysis')}
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;