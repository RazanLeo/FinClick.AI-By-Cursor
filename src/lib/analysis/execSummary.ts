export interface ExecSummary {
  table: any[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  risks: string[];
  forecasts: string[];
  recommendations: string[];
}

export function buildExecutiveSummary(results: any, language: 'ar' | 'en'): ExecSummary {
  const analyses = results?.analyses || results?.results?.analyses || [];
  const table = analyses.map((a: any, i: number) => ({
    index: i + 1,
    name: a.name,
    value: a.value,
    benchmark: a.benchmark,
    evaluation: a.evaluation,
  }));

  const positives = analyses.filter((a: any) => a.value >= a.benchmark);
  const negatives = analyses.filter((a: any) => a.value < a.benchmark);

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);

  return {
    table,
    swot: {
      strengths: [t('سيولة قوية مقارنة بالمعيار', 'Liquidity stronger than benchmark')],
      weaknesses: [t('بعض مؤشرات الربحية دون المتوسط', 'Some profitability indicators below average')],
      opportunities: [t('تحسين الكفاءة التشغيلية', 'Improve operating efficiency')],
      threats: [t('تقلبات السوق قد تؤثر على التدفقات', 'Market volatility may impact cash flows')],
    },
    risks: [
      t('مخاطر الرفع المالي المرتفع', 'High leverage risk'),
      t('اعتماد مرتفع على موردين محددين', 'Concentration risk on key suppliers'),
    ],
    forecasts: [
      t('تحسن تدريجي في الهامش خلال 12 شهراً', 'Gradual margin improvement in 12 months'),
    ],
    recommendations: [
      t('تعزيز رأس المال العامل وتحسين التحصيل', 'Enhance working capital and collections'),
      t('إعادة هيكلة التكاليف التشغيلية', 'Restructure operating costs'),
    ],
  };
}


