// تحليل النسب المالية - 30 نسبة مالية
import { FinancialStatement, RatioAnalysisResult, IndustryBenchmarks } from '@/types/financial';
import { calculatePercentage, formatNumber, formatCurrency } from '@/lib/utils/calculations';
import { getIndustryBenchmarks } from '@/lib/data/industry-benchmarks';

export interface FinancialRatio {
  name: string;
  nameEn: string;
  value: number;
  formula: string;
  interpretation: string;
  industryAverage: number;
  comparisonWithIndustry: 'أعلى' | 'مساوي' | 'أقل';
  percentileDifference: number;
  peerComparison: {
    average: number;
    rank: number;
    total: number;
  };
  competitivePosition: 'ممتاز' | 'جيد جدا' | 'جيد' | 'مقبول' | 'ضعيف';
  evaluation: 'ممتاز' | 'جيد جدا' | 'جيد' | 'مقبول' | 'ضعيف';
  recommendation: string;
}

export interface RatioCategory {
  category: string;
  categoryEn: string;
  ratios: FinancialRatio[];
  summary: {
    averagePerformance: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

// ==================== نسب السيولة (5 نسب) ====================

// 1. النسبة الجارية (Current Ratio)
export function calculateCurrentRatio(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const currentAssets = statement.data.assets.current;
  const currentLiabilities = statement.data.liabilities.current;
  const value = currentAssets / currentLiabilities;
  const industryAverage = benchmarks.liquidity.currentRatio;
  
  return {
    name: 'النسبة الجارية',
    nameEn: 'Current Ratio',
    value: value,
    formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
    interpretation: interpretCurrentRatio(value),
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.currentRatio),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.currentRatio),
    evaluation: evaluateRatio(value, industryAverage, 'currentRatio'),
    recommendation: generateCurrentRatioRecommendation(value, industryAverage)
  };
}

// 2. النسبة السريعة (Quick Ratio)
export function calculateQuickRatio(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const currentAssets = statement.data.assets.current;
  const inventory = statement.data.assets.currentDetails?.inventory || 0;
  const currentLiabilities = statement.data.liabilities.current;
  const value = (currentAssets - inventory) / currentLiabilities;
  const industryAverage = benchmarks.liquidity.quickRatio;
  
  return {
    name: 'النسبة السريعة',
    nameEn: 'Quick Ratio',
    value: value,
    formula: '(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة',
    interpretation: interpretQuickRatio(value),
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.quickRatio),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.quickRatio),
    evaluation: evaluateRatio(value, industryAverage, 'quickRatio'),
    recommendation: generateQuickRatioRecommendation(value, industryAverage)
  };
}

// 3. نسبة النقد (Cash Ratio)
export function calculateCashRatio(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const cash = statement.data.assets.currentDetails?.cash || 0;
  const marketableSecurities = statement.data.assets.currentDetails?.marketableSecurities || 0;
  const currentLiabilities = statement.data.liabilities.current;
  const value = (cash + marketableSecurities) / currentLiabilities;
  const industryAverage = benchmarks.liquidity.cashRatio;
  
  return {
    name: 'نسبة النقد',
    nameEn: 'Cash Ratio',
    value: value,
    formula: '(النقد + الاستثمارات قصيرة الأجل) ÷ الالتزامات المتداولة',
    interpretation: interpretCashRatio(value),
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.cashRatio),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.cashRatio),
    evaluation: evaluateRatio(value, industryAverage, 'cashRatio'),
    recommendation: generateCashRatioRecommendation(value, industryAverage)
  };
}

// 4. نسبة التدفقات النقدية التشغيلية (Operating Cash Flow Ratio)
export function calculateOperatingCashFlowRatio(
  statement: FinancialStatement,
  cashFlow: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const operatingCashFlow = cashFlow.operatingActivities.netCash;
  const currentLiabilities = statement.data.liabilities.current;
  const value = operatingCashFlow / currentLiabilities;
  const industryAverage = benchmarks.liquidity.operatingCashFlowRatio;
  
  return {
    name: 'نسبة التدفقات النقدية التشغيلية',
    nameEn: 'Operating Cash Flow Ratio',
    value: value,
    formula: 'التدفق النقدي من الأنشطة التشغيلية ÷ الالتزامات المتداولة',
    interpretation: interpretOperatingCashFlowRatio(value),
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.operatingCashFlowRatio),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.operatingCashFlowRatio),
    evaluation: evaluateRatio(value, industryAverage, 'operatingCashFlowRatio'),
    recommendation: generateOperatingCashFlowRatioRecommendation(value, industryAverage)
  };
}

// 5. نسبة رأس المال العامل (Working Capital Ratio)
export function calculateWorkingCapitalRatio(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const currentAssets = statement.data.assets.current;
  const currentLiabilities = statement.data.liabilities.current;
  const totalAssets = statement.data.assets.total;
  const value = (currentAssets - currentLiabilities) / totalAssets;
  const industryAverage = benchmarks.liquidity.workingCapitalRatio;
  
  return {
    name: 'نسبة رأس المال العامل',
    nameEn: 'Working Capital Ratio',
    value: value,
    formula: '(الأصول المتداولة - الالتزامات المتداولة) ÷ إجمالي الأصول',
    interpretation: interpretWorkingCapitalRatio(value),
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.workingCapitalRatio),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.workingCapitalRatio),
    evaluation: evaluateRatio(value, industryAverage, 'workingCapitalRatio'),
    recommendation: generateWorkingCapitalRatioRecommendation(value, industryAverage)
  };
}

// ==================== نسب النشاط/الكفاءة (9 نسب) ====================

// 6. معدل دوران المخزون (Inventory Turnover)
export function calculateInventoryTurnover(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const cogs = statement.data.cogs;
  const averageInventory = statement.data.assets.currentDetails?.inventory || 0;
  const value = cogs / averageInventory;
  const industryAverage = benchmarks.activity.inventoryTurnover;
  
  return {
    name: 'معدل دوران المخزون',
    nameEn: 'Inventory Turnover',
    value: value,
    formula: 'تكلفة البضاعة المباعة ÷ متوسط المخزون',
    interpretation: `المخزون يدور ${value.toFixed(1)} مرة في السنة`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.inventoryTurnover),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.inventoryTurnover),
    evaluation: evaluateRatio(value, industryAverage, 'inventoryTurnover'),
    recommendation: generateInventoryTurnoverRecommendation(value, industryAverage)
  };
}

// 7. معدل دوران الذمم المدينة (Receivables Turnover)
export function calculateReceivablesTurnover(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const revenue = statement.data.revenue;
  const averageReceivables = statement.data.assets.currentDetails?.accountsReceivable || 0;
  const value = revenue / averageReceivables;
  const industryAverage = benchmarks.activity.receivablesTurnover;
  
  return {
    name: 'معدل دوران الذمم المدينة',
    nameEn: 'Receivables Turnover',
    value: value,
    formula: 'المبيعات ÷ متوسط الذمم المدينة',
    interpretation: `الذمم المدينة تُحصل ${value.toFixed(1)} مرة في السنة`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.receivablesTurnover),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.receivablesTurnover),
    evaluation: evaluateRatio(value, industryAverage, 'receivablesTurnover'),
    recommendation: generateReceivablesTurnoverRecommendation(value, industryAverage)
  };
}

// 8. فترة تحصيل الذمم المدينة (Days Sales Outstanding)
export function calculateDaysSalesOutstanding(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const receivablesTurnover = calculateReceivablesTurnover(statement, benchmarks).value;
  const value = 365 / receivablesTurnover;
  const industryAverage = benchmarks.activity.daysSalesOutstanding;
  
  return {
    name: 'فترة تحصيل الذمم المدينة',
    nameEn: 'Days Sales Outstanding',
    value: value,
    formula: '365 ÷ معدل دوران الذمم المدينة',
    interpretation: `متوسط فترة التحصيل ${value.toFixed(0)} يوم`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.daysSalesOutstanding, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.daysSalesOutstanding, true),
    evaluation: evaluateRatio(value, industryAverage, 'daysSalesOutstanding'),
    recommendation: generateDSORecommendation(value, industryAverage)
  };
}

// 9. معدل دوران الذمم الدائنة (Payables Turnover)
export function calculatePayablesTurnover(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const purchases = statement.data.cogs + (statement.data.endingInventory || 0) - (statement.data.beginningInventory || 0);
  const averagePayables = statement.data.liabilities.currentDetails?.accountsPayable || 0;
  const value = purchases / averagePayables;
  const industryAverage = benchmarks.activity.payablesTurnover;
  
  return {
    name: 'معدل دوران الذمم الدائنة',
    nameEn: 'Payables Turnover',
    value: value,
    formula: 'المشتريات ÷ متوسط الذمم الدائنة',
    interpretation: `الذمم الدائنة تُسدد ${value.toFixed(1)} مرة في السنة`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.payablesTurnover),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.payablesTurnover),
    evaluation: evaluateRatio(value, industryAverage, 'payablesTurnover'),
    recommendation: generatePayablesTurnoverRecommendation(value, industryAverage)
  };
}

// 10. فترة سداد الذمم الدائنة (Days Payables Outstanding)
export function calculateDaysPayablesOutstanding(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const payablesTurnover = calculatePayablesTurnover(statement, benchmarks).value;
  const value = 365 / payablesTurnover;
  const industryAverage = benchmarks.activity.daysPayablesOutstanding;
  
  return {
    name: 'فترة سداد الذمم الدائنة',
    nameEn: 'Days Payables Outstanding',
    value: value,
    formula: '365 ÷ معدل دوران الذمم الدائنة',
    interpretation: `متوسط فترة السداد ${value.toFixed(0)} يوم`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.daysPayablesOutstanding),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.daysPayablesOutstanding),
    evaluation: evaluateRatio(value, industryAverage, 'daysPayablesOutstanding'),
    recommendation: generateDPORecommendation(value, industryAverage)
  };
}

// 11. معدل دوران الأصول الثابتة (Fixed Asset Turnover)
export function calculateFixedAssetTurnover(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const revenue = statement.data.revenue;
  const fixedAssets = statement.data.assets.nonCurrent;
  const value = revenue / fixedAssets;
  const industryAverage = benchmarks.activity.fixedAssetTurnover;
  
  return {
    name: 'معدل دوران الأصول الثابتة',
    nameEn: 'Fixed Asset Turnover',
    value: value,
    formula: 'المبيعات ÷ الأصول الثابتة',
    interpretation: `كل ريال من الأصول الثابتة يولد ${value.toFixed(2)} ريال مبيعات`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.fixedAssetTurnover),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.fixedAssetTurnover),
    evaluation: evaluateRatio(value, industryAverage, 'fixedAssetTurnover'),
    recommendation: generateFixedAssetTurnoverRecommendation(value, industryAverage)
  };
}

// 12. معدل دوران إجمالي الأصول (Total Asset Turnover)
export function calculateTotalAssetTurnover(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const revenue = statement.data.revenue;
  const totalAssets = statement.data.assets.total;
  const value = revenue / totalAssets;
  const industryAverage = benchmarks.activity.totalAssetTurnover;
  
  return {
    name: 'معدل دوران إجمالي الأصول',
    nameEn: 'Total Asset Turnover',
    value: value,
    formula: 'المبيعات ÷ إجمالي الأصول',
    interpretation: `كل ريال من الأصول يولد ${value.toFixed(2)} ريال مبيعات`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.totalAssetTurnover),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.totalAssetTurnover),
    evaluation: evaluateRatio(value, industryAverage, 'totalAssetTurnover'),
    recommendation: generateTotalAssetTurnoverRecommendation(value, industryAverage)
  };
}

// 13. دورة التشغيل (Operating Cycle)
export function calculateOperatingCycle(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const daysInventory = 365 / calculateInventoryTurnover(statement, benchmarks).value;
  const daysSalesOutstanding = calculateDaysSalesOutstanding(statement, benchmarks).value;
  const value = daysInventory + daysSalesOutstanding;
  const industryAverage = benchmarks.activity.operatingCycle;
  
  return {
    name: 'دورة التشغيل',
    nameEn: 'Operating Cycle',
    value: value,
    formula: 'فترة بقاء المخزون + فترة تحصيل الذمم المدينة',
    interpretation: `دورة التشغيل ${value.toFixed(0)} يوم`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.operatingCycle, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.operatingCycle, true),
    evaluation: evaluateRatio(value, industryAverage, 'operatingCycle'),
    recommendation: generateOperatingCycleRecommendation(value, industryAverage)
  };
}

// 14. دورة التحويل النقدي (Cash Conversion Cycle)
export function calculateCashConversionCycle(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const operatingCycle = calculateOperatingCycle(statement, benchmarks).value;
  const daysPayablesOutstanding = calculateDaysPayablesOutstanding(statement, benchmarks).value;
  const value = operatingCycle - daysPayablesOutstanding;
  const industryAverage = benchmarks.activity.cashConversionCycle;
  
  return {
    name: 'دورة التحويل النقدي',
    nameEn: 'Cash Conversion Cycle',
    value: value,
    formula: 'دورة التشغيل - فترة سداد الذمم الدائنة',
    interpretation: `تحتاج الشركة ${value.toFixed(0)} يوم لتحويل استثماراتها إلى نقد`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.cashConversionCycle, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.cashConversionCycle, true),
    evaluation: evaluateRatio(value, industryAverage, 'cashConversionCycle'),
    recommendation: generateCashConversionCycleRecommendation(value, industryAverage)
  };
}

// ==================== نسب المديونية/الرفع المالي (5 نسب) ====================

// 15. نسبة الدين إلى إجمالي الأصول (Debt to Assets)
export function calculateDebtToAssets(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const totalDebt = statement.data.liabilities.total;
  const totalAssets = statement.data.assets.total;
  const value = (totalDebt / totalAssets) * 100;
  const industryAverage = benchmarks.leverage.debtToAssets;
  
  return {
    name: 'نسبة الدين إلى إجمالي الأصول',
    nameEn: 'Debt to Assets Ratio',
    value: value,
    formula: '(إجمالي الديون ÷ إجمالي الأصول) × 100',
    interpretation: `${value.toFixed(1)}% من الأصول ممولة بالديون`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.debtToAssets, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.debtToAssets, true),
    evaluation: evaluateRatio(value, industryAverage, 'debtToAssets'),
    recommendation: generateDebtToAssetsRecommendation(value, industryAverage)
  };
}

// 16. نسبة الدين إلى حقوق الملكية (Debt to Equity)
export function calculateDebtToEquity(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const totalDebt = statement.data.liabilities.total;
  const totalEquity = statement.data.equity.total;
  const value = (totalDebt / totalEquity) * 100;
  const industryAverage = benchmarks.leverage.debtToEquity;
  
  return {
    name: 'نسبة الدين إلى حقوق الملكية',
    nameEn: 'Debt to Equity Ratio',
    value: value,
    formula: '(إجمالي الديون ÷ حقوق الملكية) × 100',
    interpretation: `${value.toFixed(1)}% نسبة الديون إلى حقوق الملكية`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.debtToEquity, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.debtToEquity, true),
    evaluation: evaluateRatio(value, industryAverage, 'debtToEquity'),
    recommendation: generateDebtToEquityRecommendation(value, industryAverage)
  };
}

// 17. نسبة تغطية الفوائد (Interest Coverage)
export function calculateInterestCoverage(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const ebit = statement.data.ebit || (statement.data.operatingProfit + statement.data.financialExpenses);
  const interestExpense = statement.data.financialExpenses;
  const value = interestExpense > 0 ? ebit / interestExpense : 999;
  const industryAverage = benchmarks.leverage.interestCoverage;
  
  return {
    name: 'نسبة تغطية الفوائد',
    nameEn: 'Interest Coverage Ratio',
    value: value,
    formula: 'الأرباح قبل الفوائد والضرائب ÷ مصروفات الفوائد',
    interpretation: `الشركة قادرة على تغطية الفوائد ${value.toFixed(1)} مرة`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.interestCoverage),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.interestCoverage),
    evaluation: evaluateRatio(value, industryAverage, 'interestCoverage'),
    recommendation: generateInterestCoverageRecommendation(value, industryAverage)
  };
}

// 18. نسبة تغطية خدمة الدين (Debt Service Coverage)
export function calculateDebtServiceCoverage(
  statement: FinancialStatement,
  cashFlow: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const operatingCashFlow = cashFlow.operatingActivities.netCash;
  const debtService = statement.data.currentPortionLongTermDebt + statement.data.financialExpenses;
  const value = debtService > 0 ? operatingCashFlow / debtService : 999;
  const industryAverage = benchmarks.leverage.debtServiceCoverage;
  
  return {
    name: 'نسبة تغطية خدمة الدين',
    nameEn: 'Debt Service Coverage Ratio',
    value: value,
    formula: 'التدفق النقدي التشغيلي ÷ خدمة الدين',
    interpretation: `القدرة على خدمة الدين ${value.toFixed(2)} مرة`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.debtServiceCoverage),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.debtServiceCoverage),
    evaluation: evaluateRatio(value, industryAverage, 'debtServiceCoverage'),
    recommendation: generateDebtServiceCoverageRecommendation(value, industryAverage)
  };
}

// 19. نسبة حقوق الملكية إلى الأصول (Equity to Assets)
export function calculateEquityToAssets(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const totalEquity = statement.data.equity.total;
  const totalAssets = statement.data.assets.total;
  const value = (totalEquity / totalAssets) * 100;
  const industryAverage = benchmarks.leverage.equityToAssets;
  
  return {
    name: 'نسبة حقوق الملكية إلى الأصول',
    nameEn: 'Equity to Assets Ratio',
    value: value,
    formula: '(حقوق الملكية ÷ إجمالي الأصول) × 100',
    interpretation: `${value.toFixed(1)}% من الأصول ممولة بحقوق الملكية`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.equityToAssets),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.equityToAssets),
    evaluation: evaluateRatio(value, industryAverage, 'equityToAssets'),
    recommendation: generateEquityToAssetsRecommendation(value, industryAverage)
  };
}

// ==================== نسب الربحية (6 نسب) ====================

// 20. هامش الربح الإجمالي (Gross Profit Margin)
export function calculateGrossProfitMargin(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const grossProfit = statement.data.grossProfit;
  const revenue = statement.data.revenue;
  const value = (grossProfit / revenue) * 100;
  const industryAverage = benchmarks.profitability.grossProfitMargin;
  
  return {
    name: 'هامش الربح الإجمالي',
    nameEn: 'Gross Profit Margin',
    value: value,
    formula: '(الربح الإجمالي ÷ المبيعات) × 100',
    interpretation: `هامش الربح الإجمالي ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.grossProfitMargin),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.grossProfitMargin),
    evaluation: evaluateRatio(value, industryAverage, 'grossProfitMargin'),
    recommendation: generateGrossProfitMarginRecommendation(value, industryAverage)
  };
}

// 21. هامش الربح التشغيلي (Operating Profit Margin)
export function calculateOperatingProfitMargin(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const operatingProfit = statement.data.operatingProfit;
  const revenue = statement.data.revenue;
  const value = (operatingProfit / revenue) * 100;
  const industryAverage = benchmarks.profitability.operatingProfitMargin;
  
  return {
    name: 'هامش الربح التشغيلي',
    nameEn: 'Operating Profit Margin',
    value: value,
    formula: '(الربح التشغيلي ÷ المبيعات) × 100',
    interpretation: `هامش الربح التشغيلي ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.operatingProfitMargin),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.operatingProfitMargin),
    evaluation: evaluateRatio(value, industryAverage, 'operatingProfitMargin'),
    recommendation: generateOperatingProfitMarginRecommendation(value, industryAverage)
  };
}

// 22. هامش صافي الربح (Net Profit Margin)
export function calculateNetProfitMargin(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const netProfit = statement.data.netProfit;
  const revenue = statement.data.revenue;
  const value = (netProfit / revenue) * 100;
  const industryAverage = benchmarks.profitability.netProfitMargin;
  
  return {
    name: 'هامش صافي الربح',
    nameEn: 'Net Profit Margin',
    value: value,
    formula: '(صافي الربح ÷ المبيعات) × 100',
    interpretation: `هامش صافي الربح ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.netProfitMargin),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.netProfitMargin),
    evaluation: evaluateRatio(value, industryAverage, 'netProfitMargin'),
    recommendation: generateNetProfitMarginRecommendation(value, industryAverage)
  };
}

// 23. العائد على الأصول ROA
export function calculateROA(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const netProfit = statement.data.netProfit;
  const totalAssets = statement.data.assets.total;
  const value = (netProfit / totalAssets) * 100;
  const industryAverage = benchmarks.profitability.roa;
  
  return {
    name: 'العائد على الأصول',
    nameEn: 'Return on Assets (ROA)',
    value: value,
    formula: '(صافي الربح ÷ إجمالي الأصول) × 100',
    interpretation: `العائد على الأصول ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.roa),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.roa),
    evaluation: evaluateRatio(value, industryAverage, 'roa'),
    recommendation: generateROARecommendation(value, industryAverage)
  };
}

// 24. العائد على حقوق الملكية ROE
export function calculateROE(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const netProfit = statement.data.netProfit;
  const totalEquity = statement.data.equity.total;
  const value = (netProfit / totalEquity) * 100;
  const industryAverage = benchmarks.profitability.roe;
  
  return {
    name: 'العائد على حقوق الملكية',
    nameEn: 'Return on Equity (ROE)',
    value: value,
    formula: '(صافي الربح ÷ حقوق الملكية) × 100',
    interpretation: `العائد على حقوق الملكية ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.roe),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.roe),
    evaluation: evaluateRatio(value, industryAverage, 'roe'),
    recommendation: generateROERecommendation(value, industryAverage)
  };
}

// 25. العائد على رأس المال المستثمر ROIC
export function calculateROIC(statement: FinancialStatement, benchmarks: IndustryBenchmarks): FinancialRatio {
  const nopat = statement.data.operatingProfit * (1 - (statement.data.taxRate || 0.25));
  const investedCapital = statement.data.equity.total + statement.data.liabilities.longTerm;
  const value = (nopat / investedCapital) * 100;
  const industryAverage = benchmarks.profitability.roic;
  
  return {
    name: 'العائد على رأس المال المستثمر',
    nameEn: 'Return on Invested Capital (ROIC)',
    value: value,
    formula: '(الربح التشغيلي بعد الضريبة ÷ رأس المال المستثمر) × 100',
    interpretation: `العائد على رأس المال المستثمر ${value.toFixed(1)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.roic),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.roic),
    evaluation: evaluateRatio(value, industryAverage, 'roic'),
    recommendation: generateROICRecommendation(value, industryAverage)
  };
}

// ==================== نسب السوق/القيمة (5 نسب) ====================

// 26. نسبة السعر إلى الأرباح P/E
export function calculatePERatio(
  statement: FinancialStatement,
  marketData: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const eps = statement.data.netProfit / marketData.sharesOutstanding;
  const value = marketData.stockPrice / eps;
  const industryAverage = benchmarks.market.peRatio;
  
  return {
    name: 'نسبة السعر إلى الأرباح',
    nameEn: 'Price to Earnings Ratio (P/E)',
    value: value,
    formula: 'سعر السهم ÷ ربحية السهم',
    interpretation: `المستثمرون مستعدون لدفع ${value.toFixed(1)} ريال لكل ريال من الأرباح`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.peRatio, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.peRatio, true),
    evaluation: evaluateRatio(value, industryAverage, 'peRatio'),
    recommendation: generatePERatioRecommendation(value, industryAverage)
  };
}

// 27. نسبة السعر إلى القيمة الدفترية P/B
export function calculatePBRatio(
  statement: FinancialStatement,
  marketData: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const bookValuePerShare = statement.data.equity.total / marketData.sharesOutstanding;
  const value = marketData.stockPrice / bookValuePerShare;
  const industryAverage = benchmarks.market.pbRatio;
  
  return {
    name: 'نسبة السعر إلى القيمة الدفترية',
    nameEn: 'Price to Book Ratio (P/B)',
    value: value,
    formula: 'سعر السهم ÷ القيمة الدفترية للسهم',
    interpretation: `السهم يتداول بـ ${value.toFixed(2)} مرة قيمته الدفترية`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value < industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((industryAverage - value) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.pbRatio, true),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.pbRatio, true),
    evaluation: evaluateRatio(value, industryAverage, 'pbRatio'),
    recommendation: generatePBRatioRecommendation(value, industryAverage)
  };
}

// 28. عائد التوزيعات (Dividend Yield)
export function calculateDividendYield(
  statement: FinancialStatement,
  marketData: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const dividendPerShare = statement.data.dividends / marketData.sharesOutstanding;
  const value = (dividendPerShare / marketData.stockPrice) * 100;
  const industryAverage = benchmarks.market.dividendYield;
  
  return {
    name: 'عائد التوزيعات',
    nameEn: 'Dividend Yield',
    value: value,
    formula: '(التوزيعات للسهم ÷ سعر السهم) × 100',
    interpretation: `عائد التوزيعات ${value.toFixed(2)}%`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.dividendYield),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.dividendYield),
    evaluation: evaluateRatio(value, industryAverage, 'dividendYield'),
    recommendation: generateDividendYieldRecommendation(value, industryAverage)
  };
}

// 29. ربحية السهم EPS
export function calculateEPS(
  statement: FinancialStatement,
  marketData: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const value = statement.data.netProfit / marketData.sharesOutstanding;
  const industryAverage = benchmarks.market.eps;
  
  return {
    name: 'ربحية السهم',
    nameEn: 'Earnings Per Share (EPS)',
    value: value,
    formula: 'صافي الربح ÷ عدد الأسهم القائمة',
    interpretation: `ربحية السهم ${value.toFixed(2)} ريال`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.eps),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.eps),
    evaluation: evaluateRatio(value, industryAverage, 'eps'),
    recommendation: generateEPSRecommendation(value, industryAverage)
  };
}

// 30. القيمة الدفترية للسهم
export function calculateBookValuePerShare(
  statement: FinancialStatement,
  marketData: any,
  benchmarks: IndustryBenchmarks
): FinancialRatio {
  const value = statement.data.equity.total / marketData.sharesOutstanding;
  const industryAverage = benchmarks.market.bookValuePerShare;
  
  return {
    name: 'القيمة الدفترية للسهم',
    nameEn: 'Book Value Per Share',
    value: value,
    formula: 'حقوق الملكية ÷ عدد الأسهم القائمة',
    interpretation: `القيمة الدفترية للسهم ${value.toFixed(2)} ريال`,
    industryAverage: industryAverage,
    comparisonWithIndustry: value > industryAverage ? 'أعلى' : value === industryAverage ? 'مساوي' : 'أقل',
    percentileDifference: ((value - industryAverage) / industryAverage) * 100,
    peerComparison: compareToPeers(value, benchmarks.peerData.bookValuePerShare),
    competitivePosition: evaluateCompetitivePosition(value, industryAverage, benchmarks.peerData.bookValuePerShare),
    evaluation: evaluateRatio(value, industryAverage, 'bookValuePerShare'),
    recommendation: generateBookValuePerShareRecommendation(value, industryAverage)
  };
}

// ==================== الدوال الرئيسية ====================

export async function calculateAllFinancialRatios(
  statement: FinancialStatement,
  cashFlow: any,
  marketData: any,
  companyOptions: any
): Promise<RatioCategory[]> {
  // جلب المعايير القطاعية
  const benchmarks = await getIndustryBenchmarks(
    companyOptions.sector,
    companyOptions.activity,
    companyOptions.legalEntity,
    companyOptions.comparisonLevel
  );

  const categories: RatioCategory[] = [];

  // 1. نسب السيولة
  const liquidityRatios: FinancialRatio[] = [
    calculateCurrentRatio(statement, benchmarks),
    calculateQuickRatio(statement, benchmarks),
    calculateCashRatio(statement, benchmarks),
    calculateOperatingCashFlowRatio(statement, cashFlow, benchmarks),
    calculateWorkingCapitalRatio(statement, benchmarks)
  ];

  categories.push({
    category: 'نسب السيولة',
    categoryEn: 'Liquidity Ratios',
    ratios: liquidityRatios,
    summary: generateCategorySummary(liquidityRatios, 'liquidity')
  });

  // 2. نسب النشاط/الكفاءة
  const activityRatios: FinancialRatio[] = [
    calculateInventoryTurnover(statement, benchmarks),
    calculateReceivablesTurnover(statement, benchmarks),
    calculateDaysSalesOutstanding(statement, benchmarks),
    calculatePayablesTurnover(statement, benchmarks),
    calculateDaysPayablesOutstanding(statement, benchmarks),
    calculateFixedAssetTurnover(statement, benchmarks),
    calculateTotalAssetTurnover(statement, benchmarks),
    calculateOperatingCycle(statement, benchmarks),
    calculateCashConversionCycle(statement, benchmarks)
  ];

  categories.push({
    category: 'نسب النشاط والكفاءة',
    categoryEn: 'Activity/Efficiency Ratios',
    ratios: activityRatios,
    summary: generateCategorySummary(activityRatios, 'activity')
  });

  // 3. نسب المديونية والرفع المالي
  const leverageRatios: FinancialRatio[] = [
    calculateDebtToAssets(statement, benchmarks),
    calculateDebtToEquity(statement, benchmarks),
    calculateInterestCoverage(statement, benchmarks),
    calculateDebtServiceCoverage(statement, cashFlow, benchmarks),
    calculateEquityToAssets(statement, benchmarks)
  ];

  categories.push({
    category: 'نسب المديونية والرفع المالي',
    categoryEn: 'Leverage Ratios',
    ratios: leverageRatios,
    summary: generateCategorySummary(leverageRatios, 'leverage')
  });

  // 4. نسب الربحية
  const profitabilityRatios: FinancialRatio[] = [
    calculateGrossProfitMargin(statement, benchmarks),
    calculateOperatingProfitMargin(statement, benchmarks),
    calculateNetProfitMargin(statement, benchmarks),
    calculateROA(statement, benchmarks),
    calculateROE(statement, benchmarks),
    calculateROIC(statement, benchmarks)
  ];

  categories.push({
    category: 'نسب الربحية',
    categoryEn: 'Profitability Ratios',
    ratios: profitabilityRatios,
    summary: generateCategorySummary(profitabilityRatios, 'profitability')
  });

  // 5. نسب السوق والقيمة
  if (marketData && marketData.stockPrice) {
    const marketRatios: FinancialRatio[] = [
      calculatePERatio(statement, marketData, benchmarks),
      calculatePBRatio(statement, marketData, benchmarks),
      calculateDividendYield(statement, marketData, benchmarks),
      calculateEPS(statement, marketData, benchmarks),
      calculateBookValuePerShare(statement, marketData, benchmarks)
    ];

    categories.push({
      category: 'نسب السوق والأسهم والقيمة',
      categoryEn: 'Market/Value Ratios',
      ratios: marketRatios,
      summary: generateCategorySummary(marketRatios, 'market')
    });
  }

  return categories;
}

// ==================== دوال مساعدة ====================

function compareToPeers(value: number, peerData: any[], lowerIsBetter: boolean = false): any {
  if (!peerData || peerData.length === 0) {
    return { average: value, rank: 1, total: 1 };
  }

  const average = peerData.reduce((sum, p) => sum + p.value, 0) / peerData.length;
  const sorted = lowerIsBetter 
    ? [...peerData].sort((a, b) => a.value - b.value)
    : [...peerData].sort((a, b) => b.value - a.value);
  
  const rank = sorted.findIndex(p => lowerIsBetter ? value <= p.value : value >= p.value) + 1;

  return {
    average,
    rank: rank || peerData.length + 1,
    total: peerData.length
  };
}

function evaluateCompetitivePosition(
  value: number,
  industryAverage: number,
  peerData: any[],
  lowerIsBetter: boolean = false
): 'ممتاز' | 'جيد جدا' | 'جيد' | 'مقبول' | 'ضعيف' {
  const percentileDiff = ((value - industryAverage) / industryAverage) * 100;
  const adjustedDiff = lowerIsBetter ? -percentileDiff : percentileDiff;

  if (adjustedDiff > 20) return 'ممتاز';
  if (adjustedDiff > 10) return 'جيد جدا';
  if (adjustedDiff > 0) return 'جيد';
  if (adjustedDiff > -10) return 'مقبول';
  return 'ضعيف';
}

function evaluateRatio(value: number, industryAverage: number, ratioType: string): 'ممتاز' | 'جيد جدا' | 'جيد' | 'مقبول' | 'ضعيف' {
  // تقييم مخصص لكل نسبة حسب طبيعتها
  const evaluationRules: any = {
    currentRatio: { excellent: 2, veryGood: 1.5, good: 1.2, acceptable: 1, weak: 0 },
    quickRatio: { excellent: 1.5, veryGood: 1.2, good: 1, acceptable: 0.8, weak: 0 },
    cashRatio: { excellent: 0.5, veryGood: 0.3, good: 0.2, acceptable: 0.1, weak: 0 },
    roa: { excellent: 15, veryGood: 10, good: 5, acceptable: 2, weak: 0 },
    roe: { excellent: 20, veryGood: 15, good: 10, acceptable: 5, weak: 0 },
    netProfitMargin: { excellent: 15, veryGood: 10, good: 5, acceptable: 2, weak: 0 }
  };

  const rules = evaluationRules[ratioType] || { excellent: 100, veryGood: 75, good: 50, acceptable: 25, weak: 0 };
  
  if (value >= rules.excellent) return 'ممتاز';
  if (value >= rules.veryGood) return 'جيد جدا';
  if (value >= rules.good) return 'جيد';
  if (value >= rules.acceptable) return 'مقبول';
  return 'ضعيف';
}

function generateCategorySummary(ratios: FinancialRatio[], categoryType: string): any {
  const excellentRatios = ratios.filter(r => r.evaluation === 'ممتاز');
  const weakRatios = ratios.filter(r => r.evaluation === 'ضعيف');
  
  const strengths = excellentRatios.map(r => r.name);
  const weaknesses = weakRatios.map(r => r.name);
  
  const averagePerformance = calculateAveragePerformance(ratios);
  const recommendations = generateCategoryRecommendations(ratios, categoryType);

  return {
    averagePerformance,
    strengths,
    weaknesses,
    recommendations
  };
}

function calculateAveragePerformance(ratios: FinancialRatio[]): string {
  const scores = ratios.map(r => {
    switch(r.evaluation) {
      case 'ممتاز': return 5;
      case 'جيد جدا': return 4;
      case 'جيد': return 3;
      case 'مقبول': return 2;
      case 'ضعيف': return 1;
      default: return 0;
    }
  });
  
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  
  if (average >= 4.5) return 'أداء ممتاز';
  if (average >= 3.5) return 'أداء جيد جدا';
  if (average >= 2.5) return 'أداء جيد';
  if (average >= 1.5) return 'أداء مقبول';
  return 'أداء ضعيف';
}

function generateCategoryRecommendations(ratios: FinancialRatio[], categoryType: string): string[] {
  const recommendations: string[] = [];
  const weakRatios = ratios.filter(r => r.evaluation === 'ضعيف' || r.evaluation === 'مقبول');
  
  weakRatios.forEach(ratio => {
    recommendations.push(ratio.recommendation);
  });
  
  return recommendations.slice(0, 3); // أهم 3 توصيات
}

// دوال التفسير لكل نسبة
function interpretCurrentRatio(value: number): string {
  if (value >= 2) return 'سيولة ممتازة، الشركة قادرة على تغطية التزاماتها القصيرة بشكل مريح';
  if (value >= 1.5) return 'سيولة جيدة جداً، وضع مالي مستقر';
  if (value >= 1) return 'سيولة مقبولة، الشركة قادرة على الوفاء بالتزاماتها';
  return 'سيولة ضعيفة، قد تواجه الشركة صعوبات في سداد التزاماتها';
}

function interpretQuickRatio(value: number): string {
  if (value >= 1.5) return 'قدرة ممتازة على السداد الفوري';
  if (value >= 1) return 'قدرة جيدة على السداد السريع';
  if (value >= 0.5) return 'قدرة مقبولة مع بعض المخاطر';
  return 'قدرة ضعيفة على السداد الفوري';
}

function interpretCashRatio(value: number): string {
  if (value >= 0.5) return 'وضع نقدي قوي جداً';
  if (value >= 0.2) return 'وضع نقدي جيد';
  if (value >= 0.1) return 'وضع نقدي مقبول';
  return 'نقص في السيولة النقدية';
}

function interpretOperatingCashFlowRatio(value: number): string {
  if (value >= 1) return 'تدفقات نقدية تشغيلية قوية';
  if (value >= 0.5) return 'تدفقات نقدية تشغيلية جيدة';
  return 'تدفقات نقدية تشغيلية ضعيفة';
}

function interpretWorkingCapitalRatio(value: number): string {
  if (value >= 0.3) return 'رأس مال عامل قوي';
  if (value >= 0.1) return 'رأس مال عامل مقبول';
  if (value >= 0) return 'رأس مال عامل إيجابي لكن محدود';
  return 'عجز في رأس المال العامل';
}

// دوال التوصيات
function generateCurrentRatioRecommendation(value: number, industryAverage: number): string {
  if (value < 1) {
    return 'ضرورة تحسين السيولة بشكل عاجل من خلال زيادة الأصول المتداولة أو تقليل الالتزامات القصيرة';
  }
  if (value < industryAverage) {
    return 'العمل على تحسين إدارة رأس المال العامل للوصول لمتوسط الصناعة';
  }
  if (value > 3) {
    return 'النظر في استثمار السيولة الفائضة بشكل أكثر كفاءة';
  }
  return 'المحافظة على مستوى السيولة الحالي';
}

function generateQuickRatioRecommendation(value: number, industryAverage: number): string {
  if (value < 0.5) {
    return 'تحسين السيولة السريعة بشكل عاجل وتقليل الاعتماد على المخزون';
  }
  if (value < industryAverage) {
    return 'تسريع تحصيل الذمم المدينة وتحسين إدارة النقد';
  }
  return 'الحفاظ على مستوى السيولة السريعة الجيد';
}

function generateCashRatioRecommendation(value: number, industryAverage: number): string {
  if (value < 0.1) {
    return 'زيادة الاحتياطيات النقدية لمواجهة الطوارئ';
  }
  if (value > 0.5) {
    return 'دراسة فرص استثمار النقد الفائض بشكل أكثر ربحية';
  }
  return 'مستوى النقد مناسب للعمليات';
}

function generateOperatingCashFlowRatioRecommendation(value: number, industryAverage: number): string {
  if (value < 0.5) {
    return 'تحسين التدفقات النقدية التشغيلية من خلال تحسين دورة التحويل النقدي';
  }
  return 'المحافظة على كفاءة التدفقات النقدية التشغيلية';
}

function generateWorkingCapitalRatioRecommendation(value: number, industryAverage: number): string {
  if (value < 0) {
    return 'معالجة العجز في رأس المال العامل بشكل فوري';
  }
  if (value < 0.1) {
    return 'زيادة رأس المال العامل لتحسين المرونة المالية';
  }
  return 'إدارة رأس المال العامل بكفاءة';
}

function generateInventoryTurnoverRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.5) {
    return 'تسريع دوران المخزون وتقليل المخزون البطيء الحركة';
  }
  if (value > industryAverage * 2) {
    return 'التأكد من توفر مخزون كافي لتلبية الطلب';
  }
  return 'معدل دوران المخزون مناسب';
}

function generateReceivablesTurnoverRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'تحسين سياسات التحصيل ومتابعة الذمم المدينة بشكل أكثر فعالية';
  }
  return 'إدارة الذمم المدينة بكفاءة';
}

function generateDSORecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 1.5) {
    return 'تقليل فترة التحصيل من خلال تحسين شروط الائتمان ومتابعة التحصيل';
  }
  return 'فترة التحصيل مناسبة';
}

function generatePayablesTurnoverRecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 1.5) {
    return 'الاستفادة من فترات الائتمان المتاحة بشكل أفضل';
  }
  if (value < industryAverage * 0.5) {
    return 'تحسين سرعة سداد الموردين للحصول على خصومات وتحسين العلاقات';
  }
  return 'إدارة الذمم الدائنة بشكل متوازن';
}

function generateDPORecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 2) {
    return 'تسريع سداد الموردين لتجنب فقدان الثقة';
  }
  return 'فترة السداد مناسبة';
}

function generateFixedAssetTurnoverRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'تحسين استخدام الأصول الثابتة أو التخلص من الأصول غير المنتجة';
  }
  return 'كفاءة استخدام الأصول الثابتة جيدة';
}

function generateTotalAssetTurnoverRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'تحسين كفاءة استخدام الأصول لتوليد المبيعات';
  }
  return 'كفاءة استخدام الأصول مناسبة';
}

function generateOperatingCycleRecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 1.5) {
    return 'تقليل دورة التشغيل من خلال تسريع دوران المخزون وتحصيل الذمم';
  }
  return 'دورة التشغيل في المستوى المقبول';
}

function generateCashConversionCycleRecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 1.5) {
    return 'تحسين دورة التحويل النقدي لتحرير السيولة المحتجزة';
  }
  if (value < 0) {
    return 'الاستفادة من دورة التحويل النقدي السالبة في التوسع';
  }
  return 'دورة التحويل النقدي مناسبة';
}

function generateDebtToAssetsRecommendation(value: number, industryAverage: number): string {
  if (value > 70) {
    return 'تقليل الاعتماد على الديون وتعزيز حقوق الملكية';
  }
  if (value < 30) {
    return 'يمكن الاستفادة من الرفع المالي لتحسين العائد على حقوق الملكية';
  }
  return 'هيكل رأس المال متوازن';
}

function generateDebtToEquityRecommendation(value: number, industryAverage: number): string {
  if (value > 200) {
    return 'خفض نسبة المديونية لتقليل المخاطر المالية';
  }
  if (value < 50) {
    return 'دراسة إمكانية استخدام الديون لتمويل النمو';
  }
  return 'نسبة الدين إلى حقوق الملكية مناسبة';
}

function generateInterestCoverageRecommendation(value: number, industryAverage: number): string {
  if (value < 1.5) {
    return 'تحسين القدرة على خدمة الديون بشكل عاجل';
  }
  if (value < 3) {
    return 'العمل على تحسين تغطية الفوائد لتقليل المخاطر';
  }
  return 'قدرة جيدة على تغطية الفوائد';
}

function generateDebtServiceCoverageRecommendation(value: number, industryAverage: number): string {
  if (value < 1.2) {
    return 'تحسين التدفقات النقدية التشغيلية أو إعادة هيكلة الديون';
  }
  return 'قدرة مناسبة على خدمة الديون';
}

function generateEquityToAssetsRecommendation(value: number, industryAverage: number): string {
  if (value < 30) {
    return 'تعزيز حقوق الملكية لتحسين الملاءة المالية';
  }
  return 'نسبة حقوق الملكية مناسبة';
}

function generateGrossProfitMarginRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'تحسين هامش الربح الإجمالي من خلال خفض التكاليف أو رفع الأسعار';
  }
  return 'هامش الربح الإجمالي جيد';
}

function generateOperatingProfitMarginRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'تحسين الكفاءة التشغيلية وخفض المصروفات التشغيلية';
  }
  return 'هامش الربح التشغيلي مناسب';
}

function generateNetProfitMarginRecommendation(value: number, industryAverage: number): string {
  if (value < 2) {
    return 'العمل على تحسين الربحية الصافية بشكل شامل';
  }
  if (value < industryAverage) {
    return 'تحليل هيكل التكاليف وإيجاد فرص لتحسين الربحية';
  }
  return 'هامش صافي الربح جيد';
}

function generateROARecommendation(value: number, industryAverage: number): string {
  if (value < 5) {
    return 'تحسين كفاءة استخدام الأصول لتوليد الأرباح';
  }
  return 'عائد جيد على الأصول';
}

function generateROERecommendation(value: number, industryAverage: number): string {
  if (value < 10) {
    return 'العمل على تحسين العائد على حقوق المساهمين';
  }
  if (value > 30) {
    return 'التأكد من استدامة العائد المرتفع على حقوق الملكية';
  }
  return 'عائد مناسب على حقوق الملكية';
}

function generateROICRecommendation(value: number, industryAverage: number): string {
  if (value < 10) {
    return 'تحسين العائد على رأس المال المستثمر';
  }
  return 'عائد جيد على رأس المال المستثمر';
}

function generatePERatioRecommendation(value: number, industryAverage: number): string {
  if (value > industryAverage * 1.5) {
    return 'السهم قد يكون مبالغاً في تقييمه';
  }
  if (value < industryAverage * 0.7) {
    return 'السهم قد يكون مقيماً بأقل من قيمته العادلة';
  }
  return 'تقييم السهم في النطاق المعقول';
}

function generatePBRatioRecommendation(value: number, industryAverage: number): string {
  if (value > 3) {
    return 'السعر مرتفع مقارنة بالقيمة الدفترية';
  }
  if (value < 1) {
    return 'السهم يتداول بأقل من قيمته الدفترية';
  }
  return 'نسبة السعر للقيمة الدفترية مناسبة';
}

function generateDividendYieldRecommendation(value: number, industryAverage: number): string {
  if (value < 2) {
    return 'عائد التوزيعات منخفض، قد يناسب المستثمرين الباحثين عن النمو';
  }
  if (value > 6) {
    return 'عائد توزيعات مرتفع، التأكد من استدامة التوزيعات';
  }
  return 'عائد توزيعات مناسب';
}

function generateEPSRecommendation(value: number, industryAverage: number): string {
  if (value < 0) {
    return 'العمل على تحقيق الربحية';
  }
  if (value < industryAverage) {
    return 'تحسين ربحية السهم لمواكبة متوسط الصناعة';
  }
  return 'ربحية السهم جيدة';
}

function generateBookValuePerShareRecommendation(value: number, industryAverage: number): string {
  if (value < industryAverage * 0.7) {
    return 'العمل على تعزيز القيمة الدفترية للسهم';
  }
  return 'القيمة الدفترية للسهم مناسبة';
}
