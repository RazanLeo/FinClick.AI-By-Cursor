export async function generateAnalysisReport(results: any, options: any) {
  // Generate comprehensive report with all sections
  const report = {
    format: 'comprehensive',
    title: options.language === 'ar' ? 'تقرير التحليل المالي الشامل' : 'Comprehensive Financial Analysis Report',
    subtitle: options.language === 'ar' ? `شركة ${options.companyName}` : `Company: ${options.companyName}`,
    createdAt: new Date().toISOString(),
    company: {
      name: options.companyName,
      sector: options.sector,
      legalEntity: options.legalEntity,
      comparisonLevel: options.comparisonLevel
    },
    executiveSummary: results.executiveSummary,
    analyses: results.analyses,
    charts: results.analyses?.map((a: any) => a.chart) || [],
    bilingualReport: results.bilingualReport,
    downloads: {
      pdfUrl: `/api/reports/pdf/${Date.now()}.pdf`,
      docxUrl: `/api/reports/word/${Date.now()}.docx`,
      xlsxUrl: `/api/reports/excel/${Date.now()}.xlsx`,
      pptxUrl: `/api/reports/ppt/${Date.now()}.pptx`,
    },
  };
  
  return report;
}


