export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'gauge';
  title: { ar: string; en: string };
  data: any[];
  options: any;
}

export function generateChartConfig(analysisId: string, value: number, benchmark: number, language: 'ar' | 'en'): ChartConfig {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);
  
  // Chart configurations for different analysis types
  const configs: Record<string, () => ChartConfig> = {
    'ratio.current': () => ({
      type: 'bar',
      title: { ar: 'النسبة الجارية', en: 'Current Ratio' },
      data: [
        { name: t('الشركة', 'Company'), value },
        { name: t('معيار الصناعة', 'Industry Benchmark'), benchmark }
      ],
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'top' } }
      }
    }),
    'ratio.quick': () => ({
      type: 'bar',
      title: { ar: 'النسبة السريعة', en: 'Quick Ratio' },
      data: [
        { name: t('الشركة', 'Company'), value },
        { name: t('معيار الصناعة', 'Industry Benchmark'), benchmark }
      ],
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'top' } }
      }
    }),
    'struct.vertical': () => ({
      type: 'pie',
      title: { ar: 'التحليل الرأسي - توزيع الأصول', en: 'Vertical Analysis - Asset Distribution' },
      data: [
        { name: t('الأصول المتداولة', 'Current Assets'), value: 40 },
        { name: t('الأصول الثابتة', 'Fixed Assets'), value: 60 }
      ],
      options: {
        plugins: { legend: { position: 'right' } }
      }
    }),
    'struct.horizontal': () => ({
      type: 'line',
      title: { ar: 'التحليل الأفقي - النمو عبر السنوات', en: 'Horizontal Analysis - Growth Over Years' },
      data: [
        { year: '2021', value: 100 },
        { year: '2022', value: 110 },
        { year: '2023', value: 125 }
      ],
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'top' } }
      }
    }),
    'flow.cash_basic': () => ({
      type: 'bar',
      title: { ar: 'تحليل التدفقات النقدية', en: 'Cash Flow Analysis' },
      data: [
        { name: t('التشغيل', 'Operating'), value: 50 },
        { name: t('الاستثمار', 'Investing'), value: -20 },
        { name: t('التمويل', 'Financing'), value: -10 }
      ],
      options: {
        scales: { y: { beginAtZero: false } },
        plugins: { legend: { position: 'top' } }
      }
    })
  };
  
  const configGenerator = configs[analysisId] || configs['ratio.current'];
  return configGenerator();
}
