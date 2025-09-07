// التحليل الهيكلي للقوائم المالية - 15 نوع تحليل
import { FinancialStatement, AnalysisResult, CompanyData } from '@/types/financial';
import { calculateGrowthRate, calculatePercentage, formatCurrency } from '@/lib/utils/calculations';

// 1. التحليل الرأسي (Vertical Analysis)
export function verticalAnalysis(statement: FinancialStatement): AnalysisResult {
  const results = {
    name: 'التحليل الرأسي',
    type: 'structural',
    description: 'تحليل العلاقات النسبية بين بنود القوائم المالية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  if (statement.type === 'balance_sheet') {
    const totalAssets = statement.data.assets.total;
    const totalLiabilities = statement.data.liabilities.total;
    const totalEquity = statement.data.equity.total;
    
    // حساب النسب لكل بند من الأصول
    results.data.assets = {
      current: {
        amount: statement.data.assets.current,
        percentage: calculatePercentage(statement.data.assets.current, totalAssets),
        components: analyzeCurrentAssets(statement.data.assets.currentDetails, totalAssets)
      },
      nonCurrent: {
        amount: statement.data.assets.nonCurrent,
        percentage: calculatePercentage(statement.data.assets.nonCurrent, totalAssets),
        components: analyzeNonCurrentAssets(statement.data.assets.nonCurrentDetails, totalAssets)
      }
    };

    // حساب النسب للالتزامات وحقوق الملكية
    results.data.liabilities = {
      current: {
        amount: statement.data.liabilities.current,
        percentage: calculatePercentage(statement.data.liabilities.current, totalLiabilities + totalEquity),
      },
      nonCurrent: {
        amount: statement.data.liabilities.nonCurrent,
        percentage: calculatePercentage(statement.data.liabilities.nonCurrent, totalLiabilities + totalEquity),
      }
    };

    results.data.equity = {
      amount: totalEquity,
      percentage: calculatePercentage(totalEquity, totalLiabilities + totalEquity),
      components: analyzeEquityComponents(statement.data.equity, totalLiabilities + totalEquity)
    };
  } else if (statement.type === 'income_statement') {
    const totalRevenue = statement.data.revenue;
    
    results.data.revenues = {
      total: totalRevenue,
      percentage: 100,
      breakdown: analyzeRevenueBreakdown(statement.data.revenueDetails, totalRevenue)
    };

    results.data.costs = {
      cogs: {
        amount: statement.data.cogs,
        percentage: calculatePercentage(statement.data.cogs, totalRevenue)
      },
      operatingExpenses: {
        amount: statement.data.operatingExpenses,
        percentage: calculatePercentage(statement.data.operatingExpenses, totalRevenue)
      },
      financialExpenses: {
        amount: statement.data.financialExpenses,
        percentage: calculatePercentage(statement.data.financialExpenses, totalRevenue)
      }
    };

    results.data.profitability = {
      grossProfit: {
        amount: statement.data.grossProfit,
        percentage: calculatePercentage(statement.data.grossProfit, totalRevenue)
      },
      operatingProfit: {
        amount: statement.data.operatingProfit,
        percentage: calculatePercentage(statement.data.operatingProfit, totalRevenue)
      },
      netProfit: {
        amount: statement.data.netProfit,
        percentage: calculatePercentage(statement.data.netProfit, totalRevenue)
      }
    };
  }

  results.interpretation = generateVerticalAnalysisInterpretation(results.data, statement.type);
  results.recommendations = generateVerticalAnalysisRecommendations(results.data, statement.type);
  
  return results;
}

// 2. التحليل الأفقي (Horizontal Analysis)
export function horizontalAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'التحليل الأفقي',
    type: 'structural',
    description: 'تحليل التغيرات عبر الفترات الزمنية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // ترتيب القوائم حسب السنة
  const sortedStatements = statements.sort((a, b) => a.year - b.year);
  const baseYear = sortedStatements[0];
  
  results.data.trends = sortedStatements.map((statement, index) => {
    if (index === 0) {
      return {
        year: statement.year,
        isBaseYear: true,
        changes: null
      };
    }

    const previousStatement = sortedStatements[index - 1];
    
    return {
      year: statement.year,
      isBaseYear: false,
      changes: calculateHorizontalChanges(statement, previousStatement, baseYear)
    };
  });

  results.data.summary = {
    totalGrowthRate: calculateTotalGrowthRate(sortedStatements),
    averageGrowthRate: calculateAverageGrowthRate(sortedStatements),
    volatility: calculateVolatility(sortedStatements),
    trend: determineTrend(sortedStatements)
  };

  results.interpretation = generateHorizontalAnalysisInterpretation(results.data);
  results.recommendations = generateHorizontalAnalysisRecommendations(results.data);
  
  return results;
}

// 3. التحليل المختلط (Combined Analysis)
export function combinedAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const verticalResults = statements.map(stmt => verticalAnalysis(stmt));
  const horizontalResults = horizontalAnalysis(statements);
  
  return {
    name: 'التحليل المختلط',
    type: 'structural',
    description: 'دمج التحليل الرأسي والأفقي للحصول على رؤية شاملة',
    data: {
      vertical: verticalResults,
      horizontal: horizontalResults.data,
      combined: generateCombinedInsights(verticalResults, horizontalResults)
    },
    charts: generateCombinedCharts(verticalResults, horizontalResults),
    interpretation: generateCombinedInterpretation(verticalResults, horizontalResults),
    recommendations: generateCombinedRecommendations(verticalResults, horizontalResults)
  };
}

// 4. تحليل الاتجاه (Trend Analysis)
export function trendAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل الاتجاه',
    type: 'structural',
    description: 'تحليل الاتجاهات طويلة المدى للبيانات المالية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const sortedStatements = statements.sort((a, b) => a.year - b.year);
  
  // حساب خط الاتجاه لكل بند رئيسي
  results.data.trendLines = {
    revenue: calculateTrendLine(sortedStatements.map(s => ({
      x: s.year,
      y: s.data.revenue || 0
    }))),
    netProfit: calculateTrendLine(sortedStatements.map(s => ({
      x: s.year,
      y: s.data.netProfit || 0
    }))),
    totalAssets: calculateTrendLine(sortedStatements.map(s => ({
      x: s.year,
      y: s.data.assets?.total || 0
    }))),
    totalEquity: calculateTrendLine(sortedStatements.map(s => ({
      x: s.year,
      y: s.data.equity?.total || 0
    })))
  };

  // التنبؤ بالقيم المستقبلية
  results.data.forecasts = {
    nextYear: forecastNextYear(results.data.trendLines),
    nextThreeYears: forecastMultipleYears(results.data.trendLines, 3)
  };

  // تحديد الأنماط والدورات
  results.data.patterns = {
    seasonality: detectSeasonality(sortedStatements),
    cycles: detectBusinessCycles(sortedStatements),
    outliers: detectOutliers(sortedStatements)
  };

  results.interpretation = generateTrendAnalysisInterpretation(results.data);
  results.recommendations = generateTrendAnalysisRecommendations(results.data);
  
  return results;
}

// 5. التحليل المقارن الأساسي (Basic Comparative Analysis)
export function basicComparativeAnalysis(
  companyData: CompanyData,
  peerCompanies: CompanyData[]
): AnalysisResult {
  const results = {
    name: 'التحليل المقارن الأساسي',
    type: 'structural',
    description: 'مقارنة الأداء مع الشركات المماثلة',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // اختيار أفضل 10 شركات مماثلة
  const topPeers = selectTopPeers(peerCompanies, companyData, 10);
  
  results.data.comparison = {
    company: companyData.name,
    metrics: {
      revenue: {
        company: companyData.latestStatement.data.revenue,
        peerAverage: calculatePeerAverage(topPeers, 'revenue'),
        percentile: calculatePercentile(companyData, topPeers, 'revenue'),
        rank: calculateRank(companyData, topPeers, 'revenue')
      },
      profitability: {
        company: companyData.latestStatement.data.netProfit,
        peerAverage: calculatePeerAverage(topPeers, 'netProfit'),
        percentile: calculatePercentile(companyData, topPeers, 'netProfit'),
        rank: calculateRank(companyData, topPeers, 'netProfit')
      },
      efficiency: compareEfficiencyMetrics(companyData, topPeers),
      growth: compareGrowthMetrics(companyData, topPeers),
      financial_health: compareFinancialHealth(companyData, topPeers)
    }
  };

  results.data.positioning = {
    strengths: identifyCompetitiveStrengths(companyData, topPeers),
    weaknesses: identifyCompetitiveWeaknesses(companyData, topPeers),
    opportunities: identifyOpportunities(companyData, topPeers),
    threats: identifyThreats(companyData, topPeers)
  };

  results.interpretation = generateComparativeInterpretation(results.data);
  results.recommendations = generateComparativeRecommendations(results.data);
  
  return results;
}

// 6. تحليل القيمة المضافة
export function valueAddedAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل القيمة المضافة',
    type: 'structural',
    description: 'تحليل القيمة المضافة التي تحققها الشركة',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const latestStatement = statements[statements.length - 1];
  
  // حساب القيمة المضافة
  const valueAdded = {
    gross: calculateGrossValueAdded(latestStatement),
    net: calculateNetValueAdded(latestStatement),
    economic: calculateEconomicValueAdded(latestStatement),
    market: calculateMarketValueAdded(latestStatement)
  };

  // توزيع القيمة المضافة
  results.data.distribution = {
    toEmployees: calculateEmployeeShare(latestStatement, valueAdded.gross),
    toGovernment: calculateGovernmentShare(latestStatement, valueAdded.gross),
    toCapitalProviders: calculateCapitalProvidersShare(latestStatement, valueAdded.gross),
    retained: calculateRetainedShare(latestStatement, valueAdded.gross)
  };

  // كفاءة توليد القيمة
  results.data.efficiency = {
    valueAddedPerEmployee: valueAdded.gross / (latestStatement.data.employees || 1),
    valueAddedPerAsset: valueAdded.gross / latestStatement.data.assets.total,
    valueAddedMargin: (valueAdded.gross / latestStatement.data.revenue) * 100
  };

  results.interpretation = generateValueAddedInterpretation(results.data);
  results.recommendations = generateValueAddedRecommendations(results.data);
  
  return results;
}

// 7. تحليل الأساس المشترك (Common-Size Analysis)
export function commonSizeAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل الأساس المشترك',
    type: 'structural',
    description: 'تحويل القوائم المالية إلى نسب مئوية للمقارنة',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  results.data.statements = statements.map(statement => ({
    year: statement.year,
    type: statement.type,
    commonSize: convertToCommonSize(statement)
  }));

  // تحليل التغيرات في الهيكل
  results.data.structuralChanges = analyzeStructuralChanges(results.data.statements);
  
  // المقارنة مع معايير الصناعة
  results.data.industryComparison = compareWithIndustryCommonSize(
    results.data.statements[results.data.statements.length - 1]
  );

  results.interpretation = generateCommonSizeInterpretation(results.data);
  results.recommendations = generateCommonSizeRecommendations(results.data);
  
  return results;
}

// 8. تحليل السلاسل الزمنية البسيط
export function simpleTimeSeriesAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل السلاسل الزمنية البسيط',
    type: 'structural',
    description: 'تحليل البيانات المالية عبر الزمن',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const timeSeries = statements.sort((a, b) => a.year - b.year);
  
  // تحليل المكونات
  results.data.components = {
    trend: extractTrendComponent(timeSeries),
    seasonal: extractSeasonalComponent(timeSeries),
    cyclical: extractCyclicalComponent(timeSeries),
    irregular: extractIrregularComponent(timeSeries)
  };

  // حساب المتوسطات المتحركة
  results.data.movingAverages = {
    simple: calculateSimpleMovingAverage(timeSeries, 3),
    weighted: calculateWeightedMovingAverage(timeSeries, 3),
    exponential: calculateExponentialMovingAverage(timeSeries, 0.3)
  };

  results.interpretation = generateTimeSeriesInterpretation(results.data);
  results.recommendations = generateTimeSeriesRecommendations(results.data);
  
  return results;
}

// 9. تحليل التغيرات النسبية
export function relativeChangeAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل التغيرات النسبية',
    type: 'structural',
    description: 'قياس التغيرات النسبية في البنود المالية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const sortedStatements = statements.sort((a, b) => a.year - b.year);
  
  results.data.changes = [];
  for (let i = 1; i < sortedStatements.length; i++) {
    const current = sortedStatements[i];
    const previous = sortedStatements[i - 1];
    
    results.data.changes.push({
      period: `${previous.year}-${current.year}`,
      relativeChanges: calculateRelativeChanges(current, previous),
      absoluteChanges: calculateAbsoluteChanges(current, previous),
      percentageChanges: calculatePercentageChanges(current, previous)
    });
  }

  // تحديد البنود الأكثر تغيراً
  results.data.mostVolatile = identifyMostVolatileItems(results.data.changes);
  results.data.mostStable = identifyMostStableItems(results.data.changes);

  results.interpretation = generateRelativeChangeInterpretation(results.data);
  results.recommendations = generateRelativeChangeRecommendations(results.data);
  
  return results;
}

// 10. تحليل معدلات النمو
export function growthRateAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل معدلات النمو',
    type: 'structural',
    description: 'حساب وتحليل معدلات النمو للبنود المالية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const sortedStatements = statements.sort((a, b) => a.year - b.year);
  
  // حساب معدلات النمو السنوية
  results.data.annualGrowth = calculateAnnualGrowthRates(sortedStatements);
  
  // معدل النمو السنوي المركب (CAGR)
  results.data.cagr = {
    revenue: calculateCAGR(
      sortedStatements[0].data.revenue,
      sortedStatements[sortedStatements.length - 1].data.revenue,
      sortedStatements.length - 1
    ),
    netProfit: calculateCAGR(
      sortedStatements[0].data.netProfit,
      sortedStatements[sortedStatements.length - 1].data.netProfit,
      sortedStatements.length - 1
    ),
    assets: calculateCAGR(
      sortedStatements[0].data.assets?.total || 0,
      sortedStatements[sortedStatements.length - 1].data.assets?.total || 0,
      sortedStatements.length - 1
    )
  };

  // تحليل استدامة النمو
  results.data.sustainability = analyzeSustainableGrowthRate(sortedStatements);

  results.interpretation = generateGrowthRateInterpretation(results.data);
  results.recommendations = generateGrowthRateRecommendations(results.data);
  
  return results;
}

// 11. تحليل الانحرافات الأساسي
export function basicDeviationAnalysis(
  actual: FinancialStatement,
  budget: FinancialStatement
): AnalysisResult {
  const results = {
    name: 'تحليل الانحرافات الأساسي',
    type: 'structural',
    description: 'تحليل الانحرافات بين الأداء الفعلي والموازنة',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // حساب الانحرافات
  results.data.deviations = {
    revenue: {
      actual: actual.data.revenue,
      budget: budget.data.revenue,
      variance: actual.data.revenue - budget.data.revenue,
      percentageVariance: ((actual.data.revenue - budget.data.revenue) / budget.data.revenue) * 100
    },
    costs: calculateCostDeviations(actual, budget),
    profit: calculateProfitDeviations(actual, budget),
    volume: calculateVolumeVariances(actual, budget),
    price: calculatePriceVariances(actual, budget)
  };

  // تصنيف الانحرافات
  results.data.classification = {
    favorable: identifyFavorableVariances(results.data.deviations),
    unfavorable: identifyUnfavorableVariances(results.data.deviations),
    material: identifyMaterialVariances(results.data.deviations)
  };

  results.interpretation = generateDeviationInterpretation(results.data);
  results.recommendations = generateDeviationRecommendations(results.data);
  
  return results;
}

// 12. تحليل التباين البسيط
export function simpleVarianceAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل التباين البسيط',
    type: 'structural',
    description: 'قياس التباين في الأداء المالي',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // حساب المتوسط والانحراف المعياري
  const metrics = extractKeyMetrics(statements);
  
  results.data.statistics = {
    mean: calculateMean(metrics),
    median: calculateMedian(metrics),
    standardDeviation: calculateStandardDeviation(metrics),
    variance: calculateVariance(metrics),
    coefficientOfVariation: calculateCoefficientOfVariation(metrics)
  };

  // تحليل التشتت
  results.data.dispersion = {
    range: calculateRange(metrics),
    interquartileRange: calculateIQR(metrics),
    outliers: identifyStatisticalOutliers(metrics)
  };

  results.interpretation = generateVarianceInterpretation(results.data);
  results.recommendations = generateVarianceRecommendations(results.data);
  
  return results;
}

// 13. تحليل الفروقات
export function differenceAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل الفروقات',
    type: 'structural',
    description: 'تحليل الفروقات بين الفترات والبنود',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // حساب الفروقات بين الفترات
  results.data.periodDifferences = calculatePeriodDifferences(statements);
  
  // حساب الفروقات بين البنود
  results.data.itemDifferences = calculateItemDifferences(statements);
  
  // تحليل أسباب الفروقات
  results.data.causes = {
    volume: analyzeVolumeDifferences(statements),
    price: analyzePriceDifferences(statements),
    mix: analyzeMixDifferences(statements),
    efficiency: analyzeEfficiencyDifferences(statements)
  };

  results.interpretation = generateDifferenceInterpretation(results.data);
  results.recommendations = generateDifferenceRecommendations(results.data);
  
  return results;
}

// 14. تحليل البنود الاستثنائية
export function exceptionalItemsAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل البنود الاستثنائية',
    type: 'structural',
    description: 'تحديد وتحليل البنود غير العادية والاستثنائية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // تحديد البنود الاستثنائية
  results.data.exceptionalItems = statements.map(statement => ({
    year: statement.year,
    items: identifyExceptionalItems(statement),
    impact: calculateExceptionalImpact(statement)
  }));

  // تحليل التكرار والأنماط
  results.data.patterns = {
    recurring: identifyRecurringExceptionalItems(results.data.exceptionalItems),
    oneTime: identifyOneTimeItems(results.data.exceptionalItems),
    frequency: calculateExceptionalFrequency(results.data.exceptionalItems)
  };

  // الأداء المعدل (بدون البنود الاستثنائية)
  results.data.adjustedPerformance = calculateAdjustedPerformance(statements);

  results.interpretation = generateExceptionalItemsInterpretation(results.data);
  results.recommendations = generateExceptionalItemsRecommendations(results.data);
  
  return results;
}

// 15. تحليل الأرقام القياسية
export function indexNumberAnalysis(statements: FinancialStatement[]): AnalysisResult {
  const results = {
    name: 'تحليل الأرقام القياسية',
    type: 'structural',
    description: 'استخدام الأرقام القياسية لتحليل التغيرات',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const baseYear = statements[0];
  
  // حساب الأرقام القياسية البسيطة
  results.data.simpleIndices = statements.map(statement => ({
    year: statement.year,
    indices: calculateSimpleIndices(statement, baseYear)
  }));

  // حساب الأرقام القياسية المرجحة
  results.data.weightedIndices = statements.map(statement => ({
    year: statement.year,
    indices: calculateWeightedIndices(statement, baseYear)
  }));

  // مؤشرات مركبة
  results.data.compositeIndices = {
    performance: calculatePerformanceIndex(statements),
    efficiency: calculateEfficiencyIndex(statements),
    growth: calculateGrowthIndex(statements),
    financial_health: calculateFinancialHealthIndex(statements)
  };

  results.interpretation = generateIndexNumberInterpretation(results.data);
  results.recommendations = generateIndexNumberRecommendations(results.data);
  
  return results;
}

// دوال مساعدة للتحليل الهيكلي

function analyzeCurrentAssets(currentDetails: any, totalAssets: number) {
  if (!currentDetails) return [];
  
  return Object.entries(currentDetails).map(([key, value]) => ({
    name: key,
    amount: value as number,
    percentageOfTotal: calculatePercentage(value as number, totalAssets),
    percentageOfCurrent: calculatePercentage(
      value as number,
      Object.values(currentDetails).reduce((a, b) => (a as number) + (b as number), 0) as number
    )
  }));
}

function analyzeNonCurrentAssets(nonCurrentDetails: any, totalAssets: number) {
  if (!nonCurrentDetails) return [];
  
  return Object.entries(nonCurrentDetails).map(([key, value]) => ({
    name: key,
    amount: value as number,
    percentageOfTotal: calculatePercentage(value as number, totalAssets),
    percentageOfNonCurrent: calculatePercentage(
      value as number,
      Object.values(nonCurrentDetails).reduce((a, b) => (a as number) + (b as number), 0) as number
    )
  }));
}

function analyzeEquityComponents(equity: any, total: number) {
  if (!equity) return [];
  
  return Object.entries(equity).map(([key, value]) => ({
    name: key,
    amount: value as number,
    percentageOfTotal: calculatePercentage(value as number, total)
  }));
}

function analyzeRevenueBreakdown(revenueDetails: any, totalRevenue: number) {
  if (!revenueDetails) return [];
  
  return Object.entries(revenueDetails).map(([key, value]) => ({
    source: key,
    amount: value as number,
    percentage: calculatePercentage(value as number, totalRevenue)
  }));
}

function calculateHorizontalChanges(current: FinancialStatement, previous: FinancialStatement, base: FinancialStatement) {
  return {
    absoluteChange: {
      revenue: current.data.revenue - previous.data.revenue,
      netProfit: current.data.netProfit - previous.data.netProfit,
      assets: (current.data.assets?.total || 0) - (previous.data.assets?.total || 0)
    },
    percentageChange: {
      revenue: calculateGrowthRate(previous.data.revenue, current.data.revenue),
      netProfit: calculateGrowthRate(previous.data.netProfit, current.data.netProfit),
      assets: calculateGrowthRate(previous.data.assets?.total || 0, current.data.assets?.total || 0)
    },
    baseYearComparison: {
      revenue: ((current.data.revenue / base.data.revenue) - 1) * 100,
      netProfit: ((current.data.netProfit / base.data.netProfit) - 1) * 100,
      assets: (((current.data.assets?.total || 0) / (base.data.assets?.total || 0)) - 1) * 100
    }
  };
}

function calculateTotalGrowthRate(statements: FinancialStatement[]) {
  const first = statements[0];
  const last = statements[statements.length - 1];
  
  return {
    revenue: calculateGrowthRate(first.data.revenue, last.data.revenue),
    netProfit: calculateGrowthRate(first.data.netProfit, last.data.netProfit),
    assets: calculateGrowthRate(first.data.assets?.total || 0, last.data.assets?.total || 0)
  };
}

function calculateAverageGrowthRate(statements: FinancialStatement[]) {
  const growthRates = [];
  
  for (let i = 1; i < statements.length; i++) {
    growthRates.push({
      revenue: calculateGrowthRate(statements[i - 1].data.revenue, statements[i].data.revenue),
      netProfit: calculateGrowthRate(statements[i - 1].data.netProfit, statements[i].data.netProfit)
    });
  }
  
  return {
    revenue: growthRates.reduce((sum, r) => sum + r.revenue, 0) / growthRates.length,
    netProfit: growthRates.reduce((sum, r) => sum + r.netProfit, 0) / growthRates.length
  };
}

function calculateVolatility(statements: FinancialStatement[]) {
  const returns = [];
  
  for (let i = 1; i < statements.length; i++) {
    returns.push(
      (statements[i].data.revenue - statements[i - 1].data.revenue) / statements[i - 1].data.revenue
    );
  }
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
}

function determineTrend(statements: FinancialStatement[]) {
  const growthRates = [];
  
  for (let i = 1; i < statements.length; i++) {
    growthRates.push(
      calculateGrowthRate(statements[i - 1].data.revenue, statements[i].data.revenue)
    );
  }
  
  const avgGrowth = growthRates.reduce((sum, r) => sum + r, 0) / growthRates.length;
  
  if (avgGrowth > 10) return 'نمو قوي';
  if (avgGrowth > 5) return 'نمو معتدل';
  if (avgGrowth > 0) return 'نمو بطيء';
  if (avgGrowth > -5) return 'انخفاض طفيف';
  return 'انخفاض حاد';
}

function calculateTrendLine(data: { x: number; y: number }[]) {
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return {
    slope,
    intercept,
    equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
    r2: calculateR2(data, slope, intercept)
  };
}

function calculateR2(data: { x: number; y: number }[], slope: number, intercept: number) {
  const meanY = data.reduce((sum, d) => sum + d.y, 0) / data.length;
  const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.y - meanY, 2), 0);
  const ssResidual = data.reduce((sum, d) => {
    const predicted = slope * d.x + intercept;
    return sum + Math.pow(d.y - predicted, 2);
  }, 0);
  
  return 1 - (ssResidual / ssTotal);
}

function forecastNextYear(trendLines: any) {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  return {
    year: nextYear,
    revenue: trendLines.revenue.slope * nextYear + trendLines.revenue.intercept,
    netProfit: trendLines.netProfit.slope * nextYear + trendLines.netProfit.intercept,
    totalAssets: trendLines.totalAssets.slope * nextYear + trendLines.totalAssets.intercept,
    totalEquity: trendLines.totalEquity.slope * nextYear + trendLines.totalEquity.intercept
  };
}

function forecastMultipleYears(trendLines: any, years: number) {
  const currentYear = new Date().getFullYear();
  const forecasts = [];
  
  for (let i = 1; i <= years; i++) {
    const year = currentYear + i;
    forecasts.push({
      year,
      revenue: trendLines.revenue.slope * year + trendLines.revenue.intercept,
      netProfit: trendLines.netProfit.slope * year + trendLines.netProfit.intercept,
      totalAssets: trendLines.totalAssets.slope * year + trendLines.totalAssets.intercept,
      totalEquity: trendLines.totalEquity.slope * year + trendLines.totalEquity.intercept
    });
  }
  
  return forecasts;
}

function detectSeasonality(statements: FinancialStatement[]) {
  // تحليل الموسمية في البيانات
  // يتطلب بيانات ربع سنوية أو شهرية للدقة
  return {
    hasSeasonality: false,
    pattern: null,
    strength: 0
  };
}

function detectBusinessCycles(statements: FinancialStatement[]) {
  // تحديد الدورات الاقتصادية
  return {
    cycles: [],
    currentPhase: 'growth',
    duration: 0
  };
}

function detectOutliers(statements: FinancialStatement[]) {
  const values = statements.map(s => s.data.revenue);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  );
  
  return statements.filter((s, i) => {
    const zScore = Math.abs((values[i] - mean) / stdDev);
    return zScore > 2; // Outlier if z-score > 2
  }).map(s => ({
    year: s.year,
    value: s.data.revenue,
    zScore: Math.abs((s.data.revenue - mean) / stdDev)
  }));
}

// دوال التفسير والتوصيات
function generateVerticalAnalysisInterpretation(data: any, type: string): string {
  let interpretation = `تحليل الهيكل المالي للشركة:\n\n`;
  
  if (type === 'balance_sheet') {
    interpretation += `• الأصول المتداولة تشكل ${data.assets.current.percentage.toFixed(1)}% من إجمالي الأصول\n`;
    interpretation += `• الأصول غير المتداولة تشكل ${data.assets.nonCurrent.percentage.toFixed(1)}% من إجمالي الأصول\n`;
    interpretation += `• نسبة حقوق الملكية ${data.equity.percentage.toFixed(1)}% مما يشير إلى ${
      data.equity.percentage > 50 ? 'قوة المركز المالي' : 'اعتماد كبير على الديون'
    }\n`;
  } else if (type === 'income_statement') {
    interpretation += `• هامش الربح الإجمالي ${data.profitability.grossProfit.percentage.toFixed(1)}%\n`;
    interpretation += `• هامش الربح التشغيلي ${data.profitability.operatingProfit.percentage.toFixed(1)}%\n`;
    interpretation += `• هامش صافي الربح ${data.profitability.netProfit.percentage.toFixed(1)}%\n`;
  }
  
  return interpretation;
}

function generateVerticalAnalysisRecommendations(data: any, type: string): string[] {
  const recommendations = [];
  
  if (type === 'balance_sheet') {
    if (data.assets.current.percentage < 30) {
      recommendations.push('زيادة الأصول المتداولة لتحسين السيولة');
    }
    if (data.equity.percentage < 40) {
      recommendations.push('تعزيز حقوق الملكية لتقليل المخاطر المالية');
    }
  } else if (type === 'income_statement') {
    if (data.profitability.grossProfit.percentage < 30) {
      recommendations.push('العمل على تحسين هامش الربح الإجمالي من خلال تخفيض التكاليف أو رفع الأسعار');
    }
    if (data.costs.operatingExpenses.percentage > 20) {
      recommendations.push('مراجعة المصروفات التشغيلية وإيجاد فرص للتحسين');
    }
  }
  
  return recommendations;
}

function generateHorizontalAnalysisInterpretation(data: any): string {
  const summary = data.summary;
  return `
    تحليل الأداء عبر الزمن:
    • معدل النمو الإجمالي للإيرادات: ${summary.totalGrowthRate.revenue.toFixed(1)}%
    • معدل النمو السنوي المتوسط: ${summary.averageGrowthRate.revenue.toFixed(1)}%
    • مستوى التقلب: ${(summary.volatility * 100).toFixed(1)}%
    • الاتجاه العام: ${summary.trend}
  `;
}

function generateHorizontalAnalysisRecommendations(data: any): string[] {
  const recommendations = [];
  const summary = data.summary;
  
  if (summary.averageGrowthRate.revenue < 5) {
    recommendations.push('وضع استراتيجيات لتسريع النمو في الإيرادات');
  }
  
  if (summary.volatility > 0.2) {
    recommendations.push('العمل على استقرار الأداء وتقليل التقلبات');
  }
  
  if (summary.trend === 'انخفاض حاد' || summary.trend === 'انخفاض طفيف') {
    recommendations.push('اتخاذ إجراءات عاجلة لعكس الاتجاه السلبي');
  }
  
  return recommendations;
}

// باقي دوال التفسير والتوصيات...
// سيتم إضافتها بنفس النمط

function generateCombinedInsights(vertical: any[], horizontal: any) {
  // دمج الرؤى من التحليلين
  return {
    structuralTrends: analyzeStructuralTrends(vertical),
    performanceTrends: horizontal.summary,
    keyFindings: extractKeyFindings(vertical, horizontal)
  };
}

function generateCombinedCharts(vertical: any[], horizontal: any) {
  // إنشاء الرسوم البيانية المدمجة
  return [];
}

function generateCombinedInterpretation(vertical: any[], horizontal: any): string {
  return 'تحليل شامل يدمج البعدين الرأسي والأفقي...';
}

function generateCombinedRecommendations(vertical: any[], horizontal: any): string[] {
  return ['توصيات مبنية على التحليل الشامل...'];
}

// المزيد من الدوال المساعدة...
// سيتم إضافتها حسب الحاجة

function selectTopPeers(peers: CompanyData[], company: CompanyData, count: number): CompanyData[] {
  // اختيار الشركات الأكثر تشابهاً
  return peers
    .filter(p => p.sector === company.sector && p.activity === company.activity)
    .slice(0, count);
}

function calculatePeerAverage(peers: CompanyData[], metric: string): number {
  const values = peers.map(p => p.latestStatement.data[metric] || 0);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculatePercentile(company: CompanyData, peers: CompanyData[], metric: string): number {
  const allValues = [...peers, company]
    .map(c => c.latestStatement.data[metric] || 0)
    .sort((a, b) => a - b);
  
  const companyValue = company.latestStatement.data[metric] || 0;
  const index = allValues.indexOf(companyValue);
  
  return (index / allValues.length) * 100;
}

function calculateRank(company: CompanyData, peers: CompanyData[], metric: string): number {
  const allCompanies = [...peers, company]
    .sort((a, b) => (b.latestStatement.data[metric] || 0) - (a.latestStatement.data[metric] || 0));
  
  return allCompanies.findIndex(c => c.id === company.id) + 1;
}

// ... باقي الدوال المساعدة
