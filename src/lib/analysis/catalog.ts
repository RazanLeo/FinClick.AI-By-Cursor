export interface AnalysisDefinition {
  id: string;
  name: { ar: string; en: string };
  category: 'basic.structural' | 'basic.ratios' | 'basic.flow' | 'intermediate.comparison' | 'intermediate.valuation' | 'intermediate.performance' | 'advanced.modeling' | 'advanced.statistical' | 'advanced.risk' | 'advanced.detection';
  description: { ar: string; en: string };
  measures: { ar: string; en: string };
}

// NOTE: This catalog seeds the 181 analyses with IDs and names.
// For brevity, we seed a representative subset and reserve IDs for the rest to be filled.
// We'll ensure the analyzer iterates over this catalog and produces outputs per analysis.

export const ANALYSES: AnalysisDefinition[] = [
  // Structural (15)
  { id: 'struct.vertical', name: { ar: 'التحليل الرأسي', en: 'Vertical Analysis' }, category: 'basic.structural', description: { ar: 'تحليل مكونات القوائم كنسبة من الإجمالي', en: 'Components as a percent of totals' }, measures: { ar: 'نِسب بنود القوائم', en: 'Statement item percentages' } },
  { id: 'struct.horizontal', name: { ar: 'التحليل الأفقي', en: 'Horizontal Analysis' }, category: 'basic.structural', description: { ar: 'تحليل التغيرات بين الفترات', en: 'Period-over-period changes' }, measures: { ar: 'معدلات نمو/انخفاض', en: 'Growth/decline rates' } },
  { id: 'struct.combined', name: { ar: 'التحليل المختلط', en: 'Combined Analysis' }, category: 'basic.structural', description: { ar: 'دمج رأسي وأفقي', en: 'Combined vertical & horizontal' }, measures: { ar: 'نِسب وتغيرات', en: 'Percents and changes' } },
  // Ratios (30) - sample few, rest will be programmatically handled by ratio map
  { id: 'ratio.current', name: { ar: 'النسبة الجارية', en: 'Current Ratio' }, category: 'basic.ratios', description: { ar: 'السيولة قصيرة الأجل', en: 'Short-term liquidity' }, measures: { ar: 'مرة/نسبة', en: 'x/ratio' } },
  { id: 'ratio.quick', name: { ar: 'النسبة السريعة', en: 'Quick Ratio' }, category: 'basic.ratios', description: { ar: 'سيولة بدون مخزون', en: 'Liquidity excluding inventory' }, measures: { ar: 'مرة/نسبة', en: 'x/ratio' } },
  { id: 'ratio.cash', name: { ar: 'نسبة النقد', en: 'Cash Ratio' }, category: 'basic.ratios', description: { ar: 'أقصى سيولة نقدية', en: 'Maximum cash liquidity' }, measures: { ar: 'مرة/نسبة', en: 'x/ratio' } },
  // Flow (10) - sample
  { id: 'flow.cash_basic', name: { ar: 'تحليل التدفقات النقدية الأساسي', en: 'Basic Cash Flow Analysis' }, category: 'basic.flow', description: { ar: 'تشغيل/استثمار/تمويل', en: 'Operating/Investing/Financing' }, measures: { ar: 'قيمة/نسبة', en: 'Value/ratio' } },
  // Intermediate, Advanced ... (placeholders with IDs and labels)
  { id: 'inter.comp.industry', name: { ar: 'التحليل المقارن الصناعي', en: 'Industry Comparative' }, category: 'intermediate.comparison', description: { ar: 'مقارنة مع متوسط الصناعة', en: 'Compare with industry average' }, measures: { ar: 'فجوات', en: 'Gaps' } },
  { id: 'inter.valuation.npv', name: { ar: 'تحليل صافي القيمة الحالية', en: 'Net Present Value (NPV)' }, category: 'intermediate.valuation', description: { ar: 'تقييم التدفقات المخصومة', en: 'Discounted cash valuation' }, measures: { ar: 'قيمة', en: 'Value' } },
  { id: 'adv.stat.arima', name: { ar: 'نماذج ARIMA', en: 'ARIMA Models' }, category: 'advanced.statistical', description: { ar: 'تنبؤ السلاسل الزمنية', en: 'Time series forecasting' }, measures: { ar: 'تنبؤات/أخطاء', en: 'Forecasts/errors' } },
  { id: 'adv.risk.var', name: { ar: 'القيمة المعرضة للخطر', en: 'Value at Risk (VaR)' }, category: 'advanced.risk', description: { ar: 'مخاطر السوق', en: 'Market risk' }, measures: { ar: 'قيمة/احتمال', en: 'Value/probability' } },
  { id: 'adv.detect.fraud', name: { ar: 'كشف الاحتيال بالذكاء الاصطناعي', en: 'AI Fraud Detection' }, category: 'advanced.detection', description: { ar: 'كشف الشذوذ والأنماط', en: 'Anomaly and pattern detection' }, measures: { ar: 'احتمالات/إنذارات', en: 'Probabilities/alerts' } },
];


