import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

interface FinancialData {
  companyName: string;
  sector: string;
  activity: string;
  legalEntity: string;
  comparisonLevel: string;
  yearsCount: number;
  analysisType: string[];
  language: 'ar' | 'en';
  files: File[];
  financialStatements?: any[];
  trialBalance?: any;
  manualData?: any;
}

interface AnalysisResult {
  id: string;
  timestamp: Date;
  executiveSummary: any;
  detailedAnalysis: any[];
  charts: any[];
  recommendations: any;
  risks: any;
  opportunities: any;
  swot: any;
  predictions: any;
}

interface AnalysisContextType {
  financialData: FinancialData | null;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  progress: number;
  setFinancialData: (data: FinancialData) => void;
  startAnalysis: () => Promise<void>;
  clearAnalysis: () => void;
  exportReport: (format: 'pdf' | 'word' | 'excel' | 'ppt') => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startAnalysis = async () => {
    if (!financialData) {
      toast.error('يرجى إدخال البيانات المالية أولاً');
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);

      // Step 1: Process uploaded files (10%)
      setProgress(10);
      const processedData = await processFiles(financialData.files);

      // Step 2: Extract financial data (20%)
      setProgress(20);
      const extractedData = await extractFinancialData(processedData);

      // Step 3: Fetch market data (30%)
      setProgress(30);
      const marketData = await fetchMarketData(financialData);

      // Step 4: Fetch industry averages (40%)
      setProgress(40);
      const industryAverages = await fetchIndustryAverages(financialData);

      // Step 5: Perform all 181 analyses (50-90%)
      const analyses = await performAllAnalyses(
        extractedData,
        marketData,
        industryAverages,
        financialData,
        (p) => setProgress(50 + p * 0.4)
      );

      // Step 6: Generate charts and visualizations (95%)
      setProgress(95);
      const charts = await generateCharts(analyses);

      // Step 7: Compile final results (100%)
      setProgress(100);
      const result: AnalysisResult = {
        id: generateAnalysisId(),
        timestamp: new Date(),
        executiveSummary: generateExecutiveSummary(analyses),
        detailedAnalysis: analyses,
        charts: charts,
        recommendations: generateRecommendations(analyses),
        risks: identifyRisks(analyses),
        opportunities: identifyOpportunities(analyses),
        swot: generateSWOT(analyses),
        predictions: generatePredictions(analyses),
      };

      setAnalysisResult(result);
      
      // Save to database
      await saveAnalysisResult(result);
      
      toast.success('تم إكمال التحليل بنجاح!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error('حدث خطأ أثناء التحليل: ' + error.message);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const processFiles = async (files: File[]): Promise<any> => {
    const processed = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('فشل في معالجة الملف: ' + file.name);
      
      const data = await response.json();
      processed.push(data);
    }
    
    return processed;
  };

  const extractFinancialData = async (processedData: any): Promise<any> => {
    const response = await fetch('/api/extract-financial-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: processedData }),
    });
    
    if (!response.ok) throw new Error('فشل في استخراج البيانات المالية');
    
    return response.json();
  };

  const fetchMarketData = async (data: FinancialData): Promise<any> => {
    const response = await fetch('/api/market-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sector: data.sector,
        activity: data.activity,
        comparisonLevel: data.comparisonLevel,
      }),
    });
    
    if (!response.ok) throw new Error('فشل في جلب بيانات السوق');
    
    return response.json();
  };

  const fetchIndustryAverages = async (data: FinancialData): Promise<any> => {
    const response = await fetch('/api/industry-averages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sector: data.sector,
        activity: data.activity,
        legalEntity: data.legalEntity,
        comparisonLevel: data.comparisonLevel,
      }),
    });
    
    if (!response.ok) throw new Error('فشل في جلب متوسطات الصناعة');
    
    return response.json();
  };

  const performAllAnalyses = async (
    financialData: any,
    marketData: any,
    industryAverages: any,
    config: FinancialData,
    onProgress: (p: number) => void
  ): Promise<any[]> => {
    const analyses = [];
    const totalAnalyses = 181;
    
    // Perform each analysis type
    for (let i = 0; i < totalAnalyses; i++) {
      const analysis = await performSingleAnalysis(
        i,
        financialData,
        marketData,
        industryAverages,
        config
      );
      analyses.push(analysis);
      onProgress((i + 1) / totalAnalyses);
    }
    
    return analyses;
  };

  const performSingleAnalysis = async (
    analysisType: number,
    financialData: any,
    marketData: any,
    industryAverages: any,
    config: FinancialData
  ): Promise<any> => {
    const response = await fetch('/api/analysis/perform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: analysisType,
        financialData,
        marketData,
        industryAverages,
        config,
      }),
    });
    
    if (!response.ok) throw new Error(`فشل في تنفيذ التحليل رقم ${analysisType}`);
    
    return response.json();
  };

  const generateCharts = async (analyses: any[]): Promise<any[]> => {
    const response = await fetch('/api/generate-charts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analyses }),
    });
    
    if (!response.ok) throw new Error('فشل في إنشاء الرسوم البيانية');
    
    return response.json();
  };

  const generateExecutiveSummary = (analyses: any[]): any => {
    // Generate executive summary from all analyses
    return {
      overview: 'ملخص تنفيذي شامل',
      keyFindings: analyses.slice(0, 10).map(a => a.summary),
      criticalMetrics: analyses.filter(a => a.critical).map(a => a.metric),
    };
  };

  const generateRecommendations = (analyses: any[]): any => {
    return {
      immediate: analyses.filter(a => a.priority === 'high').map(a => a.recommendation),
      shortTerm: analyses.filter(a => a.priority === 'medium').map(a => a.recommendation),
      longTerm: analyses.filter(a => a.priority === 'low').map(a => a.recommendation),
    };
  };

  const identifyRisks = (analyses: any[]): any => {
    return analyses.filter(a => a.risk).map(a => ({
      type: a.riskType,
      level: a.riskLevel,
      description: a.riskDescription,
      mitigation: a.riskMitigation,
    }));
  };

  const identifyOpportunities = (analyses: any[]): any => {
    return analyses.filter(a => a.opportunity).map(a => ({
      type: a.opportunityType,
      potential: a.opportunityPotential,
      description: a.opportunityDescription,
      action: a.opportunityAction,
    }));
  };

  const generateSWOT = (analyses: any[]): any => {
    return {
      strengths: analyses.filter(a => a.strength).map(a => a.strength),
      weaknesses: analyses.filter(a => a.weakness).map(a => a.weakness),
      opportunities: analyses.filter(a => a.opportunity).map(a => a.opportunity),
      threats: analyses.filter(a => a.threat).map(a => a.threat),
    };
  };

  const generatePredictions = (analyses: any[]): any => {
    return analyses.filter(a => a.prediction).map(a => ({
      metric: a.predictionMetric,
      current: a.currentValue,
      predicted: a.predictedValue,
      confidence: a.predictionConfidence,
      timeframe: a.predictionTimeframe,
    }));
  };

  const generateAnalysisId = (): string => {
    return `ANALYSIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveAnalysisResult = async (result: AnalysisResult): Promise<void> => {
    await fetch('/api/save-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
  };

  const clearAnalysis = () => {
    setFinancialData(null);
    setAnalysisResult(null);
    setProgress(0);
  };

  const exportReport = async (format: 'pdf' | 'word' | 'excel' | 'ppt') => {
    if (!analysisResult) {
      toast.error('لا يوجد تحليل لتصديره');
      return;
    }

    try {
      toast.loading('جاري إنشاء التقرير...');
      
      const response = await fetch('/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          data: analysisResult,
          config: financialData,
        }),
      });

      if (!response.ok) throw new Error('فشل في إنشاء التقرير');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FinClick-Analysis-${analysisResult.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success('تم تصدير التقرير بنجاح');
    } catch (error: any) {
      toast.dismiss();
      toast.error('حدث خطأ في تصدير التقرير: ' + error.message);
    }
  };

  const value = {
    financialData,
    analysisResult,
    isAnalyzing,
    progress,
    setFinancialData,
    startAnalysis,
    clearAnalysis,
    exportReport,
  };

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
