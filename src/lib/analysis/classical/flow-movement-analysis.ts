// تحليلات التدفق والحركة - 10 أنواع تحليل
import { FinancialStatement, AnalysisResult, CashFlowStatement } from '@/types/financial';
import { calculatePercentage, formatCurrency, calculateGrowthRate } from '@/lib/utils/calculations';

// 1. تحليل التدفقات النقدية الأساسي
export function basicCashFlowAnalysis(
  cashFlow: CashFlowStatement,
  statement: FinancialStatement,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل التدفقات النقدية الأساسي',
    type: 'flow-movement',
    description: 'تحليل مصادر واستخدامات النقد في الأنشطة التشغيلية والاستثمارية والتمويلية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // تحليل الأنشطة التشغيلية
  const operatingCF = cashFlow.operatingActivities;
  results.data.operating = {
    netCash: operatingCF.netCash,
    percentageOfRevenue: (operatingCF.netCash / statement.data.revenue) * 100,
    qualityOfEarnings: (operatingCF.netCash / statement.data.netProfit),
    components: {
      netIncome: operatingCF.netIncome,
      depreciation: operatingCF.depreciation,
      workingCapitalChanges: operatingCF.workingCapitalChanges,
      otherAdjustments: operatingCF.otherAdjustments
    },
    analysis: {
      isPositive: operatingCF.netCash > 0,
      coversCapex: operatingCF.netCash > Math.abs(cashFlow.investingActivities.capex),
      coversDividends: operatingCF.netCash > cashFlow.financingActivities.dividendsPaid,
      trend: 'مستقر' // يتم حسابه من البيانات التاريخية
    }
  };

  // تحليل الأنشطة الاستثمارية
  const investingCF = cashFlow.investingActivities;
  results.data.investing = {
    netCash: investingCF.netCash,
    capex: investingCF.capex,
    capexToRevenue: (Math.abs(investingCF.capex) / statement.data.revenue) * 100,
    capexToDepreciation: Math.abs(investingCF.capex) / operatingCF.depreciation,
    acquisitions: investingCF.acquisitions,
    assetSales: investingCF.assetSales,
    investments: investingCF.investments,
    analysis: {
      isExpanding: investingCF.capex < 0 && Math.abs(investingCF.capex) > operatingCF.depreciation,
      maintenanceCapex: operatingCF.depreciation,
      growthCapex: Math.abs(investingCF.capex) - operatingCF.depreciation
    }
  };

  // تحليل الأنشطة التمويلية
  const financingCF = cashFlow.financingActivities;
  results.data.financing = {
    netCash: financingCF.netCash,
    debtIssued: financingCF.debtIssued,
    debtRepaid: financingCF.debtRepaid,
    equityIssued: financingCF.equityIssued,
    dividendsPaid: financingCF.dividendsPaid,
    dividendPayoutRatio: (financingCF.dividendsPaid / statement.data.netProfit) * 100,
    analysis: {
      isRaisingCapital: financingCF.netCash > 0,
      isPayingDown: financingCF.debtRepaid > financingCF.debtIssued,
      dividendSustainability: operatingCF.netCash > financingCF.dividendsPaid
    }
  };

  // التدفق النقدي الحر
  results.data.freeCashFlow = {
    fcf: operatingCF.netCash - Math.abs(investingCF.capex),
    fcfToRevenue: ((operatingCF.netCash - Math.abs(investingCF.capex)) / statement.data.revenue) * 100,
    fcfPerShare: (operatingCF.netCash - Math.abs(investingCF.capex)) / statement.data.sharesOutstanding,
    fcfYield: ((operatingCF.netCash - Math.abs(investingCF.capex)) / statement.data.marketCap) * 100,
    uses: {
      dividends: financingCF.dividendsPaid,
      debtReduction: financingCF.debtRepaid - financingCF.debtIssued,
      shareRepurchases: financingCF.shareRepurchases,
      remaining: operatingCF.netCash - Math.abs(investingCF.capex) - financingCF.dividendsPaid - (financingCF.debtRepaid - financingCF.debtIssued)
    }
  };

  // مؤشرات الجودة
  results.data.qualityMetrics = {
    cashFlowToNetIncome: operatingCF.netCash / statement.data.netProfit,
    cashFlowToEBITDA: operatingCF.netCash / (statement.data.ebitda || statement.data.operatingProfit + operatingCF.depreciation),
    cashFlowROA: (operatingCF.netCash / statement.data.assets.total) * 100,
    cashFlowMargin: (operatingCF.netCash / statement.data.revenue) * 100,
    cashConversionRate: (operatingCF.netCash / statement.data.operatingProfit) * 100
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    operatingCFMargin: {
      company: results.data.qualityMetrics.cashFlowMargin,
      industry: benchmarks.cashFlow.operatingMargin,
      difference: results.data.qualityMetrics.cashFlowMargin - benchmarks.cashFlow.operatingMargin
    },
    fcfYield: {
      company: results.data.freeCashFlow.fcfYield,
      industry: benchmarks.cashFlow.fcfYield,
      difference: results.data.freeCashFlow.fcfYield - benchmarks.cashFlow.fcfYield
    },
    capexIntensity: {
      company: results.data.investing.capexToRevenue,
      industry: benchmarks.cashFlow.capexToRevenue,
      difference: results.data.investing.capexToRevenue - benchmarks.cashFlow.capexToRevenue
    }
  };

  results.interpretation = generateCashFlowInterpretation(results.data);
  results.recommendations = generateCashFlowRecommendations(results.data);
  
  return results;
}

// 2. تحليل رأس المال العامل
export function workingCapitalAnalysis(
  statement: FinancialStatement,
  previousStatement: FinancialStatement,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل رأس المال العامل',
    type: 'flow-movement',
    description: 'تحليل مكونات وكفاءة إدارة رأس المال العامل',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const currentAssets = statement.data.assets.current;
  const currentLiabilities = statement.data.liabilities.current;
  const prevCurrentAssets = previousStatement.data.assets.current;
  const prevCurrentLiabilities = previousStatement.data.liabilities.current;

  // حساب رأس المال العامل
  results.data.workingCapital = {
    current: currentAssets - currentLiabilities,
    previous: prevCurrentAssets - prevCurrentLiabilities,
    change: (currentAssets - currentLiabilities) - (prevCurrentAssets - prevCurrentLiabilities),
    percentageChange: calculateGrowthRate(
      prevCurrentAssets - prevCurrentLiabilities,
      currentAssets - currentLiabilities
    ),
    asPercentageOfRevenue: ((currentAssets - currentLiabilities) / statement.data.revenue) * 100,
    asPercentageOfAssets: ((currentAssets - currentLiabilities) / statement.data.assets.total) * 100
  };

  // تحليل المكونات
  results.data.components = {
    receivables: {
      amount: statement.data.assets.currentDetails?.accountsReceivable || 0,
      change: (statement.data.assets.currentDetails?.accountsReceivable || 0) - 
              (previousStatement.data.assets.currentDetails?.accountsReceivable || 0),
      daysOutstanding: (statement.data.assets.currentDetails?.accountsReceivable || 0) / (statement.data.revenue / 365),
      percentageOfWC: ((statement.data.assets.currentDetails?.accountsReceivable || 0) / 
                       (currentAssets - currentLiabilities)) * 100
    },
    inventory: {
      amount: statement.data.assets.currentDetails?.inventory || 0,
      change: (statement.data.assets.currentDetails?.inventory || 0) - 
              (previousStatement.data.assets.currentDetails?.inventory || 0),
      daysOnHand: (statement.data.assets.currentDetails?.inventory || 0) / (statement.data.cogs / 365),
      percentageOfWC: ((statement.data.assets.currentDetails?.inventory || 0) / 
                       (currentAssets - currentLiabilities)) * 100
    },
    payables: {
      amount: statement.data.liabilities.currentDetails?.accountsPayable || 0,
      change: (statement.data.liabilities.currentDetails?.accountsPayable || 0) - 
              (previousStatement.data.liabilities.currentDetails?.accountsPayable || 0),
      daysOutstanding: (statement.data.liabilities.currentDetails?.accountsPayable || 0) / (statement.data.cogs / 365),
      percentageOfWC: ((statement.data.liabilities.currentDetails?.accountsPayable || 0) / 
                       (currentAssets - currentLiabilities)) * 100
    }
  };

  // دورة رأس المال العامل
  results.data.workingCapitalCycle = {
    daysSalesOutstanding: results.data.components.receivables.daysOutstanding,
    daysInventoryOnHand: results.data.components.inventory.daysOnHand,
    daysPayablesOutstanding: results.data.components.payables.daysOutstanding,
    operatingCycle: results.data.components.receivables.daysOutstanding + 
                    results.data.components.inventory.daysOnHand,
    cashConversionCycle: results.data.components.receivables.daysOutstanding + 
                         results.data.components.inventory.daysOnHand - 
                         results.data.components.payables.daysOutstanding,
    targetCCC: benchmarks.workingCapital.cashConversionCycle,
    gapToTarget: (results.data.components.receivables.daysOutstanding + 
                  results.data.components.inventory.daysOnHand - 
                  results.data.components.payables.daysOutstanding) - 
                 benchmarks.workingCapital.cashConversionCycle
  };

  // كفاءة رأس المال العامل
  results.data.efficiency = {
    workingCapitalTurnover: statement.data.revenue / (currentAssets - currentLiabilities),
    workingCapitalProductivity: statement.data.operatingProfit / (currentAssets - currentLiabilities),
    cashToWorkingCapital: (statement.data.assets.currentDetails?.cash || 0) / (currentAssets - currentLiabilities),
    quickAssetsToWC: ((currentAssets - (statement.data.assets.currentDetails?.inventory || 0)) - currentLiabilities) / 
                      (currentAssets - currentLiabilities)
  };

  // احتياجات رأس المال العامل
  results.data.requirements = {
    seasonal: calculateSeasonalRequirements(statement, benchmarks),
    growth: calculateGrowthRequirements(statement, benchmarks),
    optimal: calculateOptimalWorkingCapital(statement, benchmarks),
    gap: (currentAssets - currentLiabilities) - calculateOptimalWorkingCapital(statement, benchmarks),
    financingNeeds: Math.max(0, calculateOptimalWorkingCapital(statement, benchmarks) - (currentAssets - currentLiabilities))
  };

  results.interpretation = generateWorkingCapitalInterpretation(results.data);
  results.recommendations = generateWorkingCapitalRecommendations(results.data);
  
  return results;
}

// 3. تحليل دورة النقد
export function cashCycleAnalysis(
  statements: FinancialStatement[],
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل دورة النقد',
    type: 'flow-movement',
    description: 'تحليل دورة تحويل النقد وكفاءة إدارة التدفقات النقدية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const latestStatement = statements[statements.length - 1];
  
  // حساب مكونات دورة النقد
  const daysInventory = (latestStatement.data.assets.currentDetails?.inventory || 0) / 
                       (latestStatement.data.cogs / 365);
  const daysReceivables = (latestStatement.data.assets.currentDetails?.accountsReceivable || 0) / 
                         (latestStatement.data.revenue / 365);
  const daysPayables = (latestStatement.data.liabilities.currentDetails?.accountsPayable || 0) / 
                      (latestStatement.data.cogs / 365);

  results.data.currentCycle = {
    daysInventoryOutstanding: daysInventory,
    daysSalesOutstanding: daysReceivables,
    daysPayablesOutstanding: daysPayables,
    operatingCycle: daysInventory + daysReceivables,
    cashConversionCycle: daysInventory + daysReceivables - daysPayables,
    interpretation: interpretCashCycle(daysInventory + daysReceivables - daysPayables)
  };

  // تحليل الاتجاه التاريخي
  results.data.trend = statements.map(stmt => {
    const inv = (stmt.data.assets.currentDetails?.inventory || 0) / (stmt.data.cogs / 365);
    const rec = (stmt.data.assets.currentDetails?.accountsReceivable || 0) / (stmt.data.revenue / 365);
    const pay = (stmt.data.liabilities.currentDetails?.accountsPayable || 0) / (stmt.data.cogs / 365);
    
    return {
      year: stmt.year,
      cashConversionCycle: inv + rec - pay,
      components: {
        inventory: inv,
        receivables: rec,
        payables: pay
      }
    };
  });

  // تأثير دورة النقد على السيولة
  results.data.liquidityImpact = {
    cashTiedUp: (results.data.currentCycle.cashConversionCycle / 365) * latestStatement.data.revenue,
    percentageOfRevenue: (results.data.currentCycle.cashConversionCycle / 365) * 100,
    workingCapitalRequirement: calculateWorkingCapitalRequirement(latestStatement, results.data.currentCycle.cashConversionCycle),
    financingCost: ((results.data.currentCycle.cashConversionCycle / 365) * latestStatement.data.revenue) * 
                   (benchmarks.interestRate || 0.05)
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    industry: {
      cashConversionCycle: benchmarks.cashCycle.industry,
      gap: results.data.currentCycle.cashConversionCycle - benchmarks.cashCycle.industry,
      percentageGap: ((results.data.currentCycle.cashConversionCycle - benchmarks.cashCycle.industry) / 
                      benchmarks.cashCycle.industry) * 100
    },
    bestInClass: {
      cashConversionCycle: benchmarks.cashCycle.bestInClass,
      gap: results.data.currentCycle.cashConversionCycle - benchmarks.cashCycle.bestInClass,
      percentageGap: ((results.data.currentCycle.cashConversionCycle - benchmarks.cashCycle.bestInClass) / 
                      benchmarks.cashCycle.bestInClass) * 100
    }
  };

  // فرص التحسين
  results.data.improvement = {
    potentialSavings: calculatePotentialSavings(latestStatement, results.data, benchmarks),
    targetReductions: {
      inventory: Math.max(0, daysInventory - benchmarks.targets.inventory),
      receivables: Math.max(0, daysReceivables - benchmarks.targets.receivables),
      payables: Math.max(0, benchmarks.targets.payables - daysPayables)
    },
    cashRelease: calculateCashRelease(latestStatement, results.data, benchmarks)
  };

  results.interpretation = generateCashCycleInterpretation(results.data);
  results.recommendations = generateCashCycleRecommendations(results.data);
  
  return results;
}

// 4. تحليل نقطة التعادل
export function breakEvenAnalysis(
  statement: FinancialStatement,
  costStructure: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل نقطة التعادل',
    type: 'flow-movement',
    description: 'تحديد نقطة التعادل ومستوى المبيعات المطلوب لتحقيق الربحية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  // تصنيف التكاليف
  const fixedCosts = costStructure.fixed || estimateFixedCosts(statement);
  const variableCosts = costStructure.variable || estimateVariableCosts(statement);
  const revenue = statement.data.revenue;
  const units = costStructure.units || statement.data.unitsSold || estimateUnits(statement);
  const pricePerUnit = revenue / units;
  const variableCostPerUnit = variableCosts / units;
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = contributionMargin / pricePerUnit;

  // حساب نقطة التعادل
  results.data.breakEvenPoint = {
    inUnits: fixedCosts / contributionMargin,
    inRevenue: fixedCosts / contributionMarginRatio,
    currentUnits: units,
    currentRevenue: revenue,
    marginOfSafety: {
      units: units - (fixedCosts / contributionMargin),
      revenue: revenue - (fixedCosts / contributionMarginRatio),
      percentage: ((revenue - (fixedCosts / contributionMarginRatio)) / revenue) * 100
    }
  };

  // تحليل هيكل التكاليف
  results.data.costStructure = {
    fixed: {
      amount: fixedCosts,
      percentageOfRevenue: (fixedCosts / revenue) * 100,
      components: breakdownFixedCosts(statement, costStructure)
    },
    variable: {
      amount: variableCosts,
      percentageOfRevenue: (variableCosts / revenue) * 100,
      perUnit: variableCostPerUnit,
      components: breakdownVariableCosts(statement, costStructure)
    },
    total: {
      amount: fixedCosts + variableCosts,
      percentageOfRevenue: ((fixedCosts + variableCosts) / revenue) * 100
    }
  };

  // تحليل المساهمة
  results.data.contributionAnalysis = {
    contributionMargin: contributionMargin,
    contributionMarginRatio: contributionMarginRatio * 100,
    totalContribution: contributionMargin * units,
    contributionToFixed: (contributionMargin * units) / fixedCosts,
    excessContribution: (contributionMargin * units) - fixedCosts
  };

  // تحليل الحساسية
  results.data.sensitivity = {
    priceChange: {
      increase10Percent: calculateBreakEvenWithPriceChange(fixedCosts, pricePerUnit * 1.1, variableCostPerUnit),
      decrease10Percent: calculateBreakEvenWithPriceChange(fixedCosts, pricePerUnit * 0.9, variableCostPerUnit)
    },
    costChange: {
      fixedIncrease10Percent: (fixedCosts * 1.1) / contributionMargin,
      variableIncrease10Percent: fixedCosts / (pricePerUnit - (variableCostPerUnit * 1.1))
    },
    volumeRequired: {
      for10PercentProfit: (fixedCosts + (revenue * 0.1)) / contributionMargin,
      for20PercentProfit: (fixedCosts + (revenue * 0.2)) / contributionMargin,
      forTargetProfit: (targetProfit: number) => (fixedCosts + targetProfit) / contributionMargin
    }
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    marginOfSafety: {
      company: results.data.breakEvenPoint.marginOfSafety.percentage,
      industry: benchmarks.breakEven.marginOfSafety,
      evaluation: evaluateMarginOfSafety(results.data.breakEvenPoint.marginOfSafety.percentage)
    },
    contributionMargin: {
      company: contributionMarginRatio * 100,
      industry: benchmarks.breakEven.contributionMargin,
      evaluation: evaluateContributionMargin(contributionMarginRatio * 100)
    },
    operatingLeverage: calculateOperatingLeverage(contributionMargin * units, statement.data.operatingProfit)
  };

  results.interpretation = generateBreakEvenInterpretation(results.data);
  results.recommendations = generateBreakEvenRecommendations(results.data);
  
  return results;
}

// 5. تحليل هامش الأمان
export function marginOfSafetyAnalysis(
  statement: FinancialStatement,
  breakEvenData: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل هامش الأمان',
    type: 'flow-movement',
    description: 'تحليل المسافة بين المبيعات الفعلية ونقطة التعادل',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const actualSales = statement.data.revenue;
  const breakEvenSales = breakEvenData.breakEvenPoint.inRevenue;
  
  // حساب هامش الأمان
  results.data.marginOfSafety = {
    absolute: {
      revenue: actualSales - breakEvenSales,
      units: statement.data.unitsSold - breakEvenData.breakEvenPoint.inUnits,
      days: ((actualSales - breakEvenSales) / actualSales) * 365
    },
    percentage: ((actualSales - breakEvenSales) / actualSales) * 100,
    ratio: actualSales / breakEvenSales,
    evaluation: evaluateSafetyMargin(((actualSales - breakEvenSales) / actualSales) * 100)
  };

  // تحليل المخاطر
  results.data.riskAnalysis = {
    riskLevel: determineRiskLevel(results.data.marginOfSafety.percentage),
    vulnerabilityToDownturn: {
      salesDecline10Percent: actualSales * 0.9 > breakEvenSales,
      salesDecline20Percent: actualSales * 0.8 > breakEvenSales,
      salesDecline30Percent: actualSales * 0.7 > breakEvenSales,
      maxSafeDecline: results.data.marginOfSafety.percentage
    },
    scenarioAnalysis: [
      { scenario: 'أفضل حالة', sales: actualSales * 1.2, marginOfSafety: ((actualSales * 1.2 - breakEvenSales) / (actualSales * 1.2)) * 100 },
      { scenario: 'حالة متوقعة', sales: actualSales, marginOfSafety: results.data.marginOfSafety.percentage },
      { scenario: 'أسوأ حالة', sales: actualSales * 0.8, marginOfSafety: ((actualSales * 0.8 - breakEvenSales) / (actualSales * 0.8)) * 100 }
    ]
  };

  // العوامل المؤثرة
  results.data.factors = {
    positive: identifyPositiveSafetyFactors(statement, breakEvenData),
    negative: identifyNegativeSafetyFactors(statement, breakEvenData),
    improvement: {
      byReducingFixed: calculateSafetyWithReducedFixed(actualSales, breakEvenData, 0.1),
      byReducingVariable: calculateSafetyWithReducedVariable(actualSales, breakEvenData, 0.1),
      byIncreasingPrice: calculateSafetyWithIncreasedPrice(actualSales, breakEvenData, 0.1),
      byIncreasingVolume: calculateSafetyWithIncreasedVolume(actualSales, breakEvenData, 0.1)
    }
  };

  // الاتجاه التاريخي
  results.data.trend = {
    current: results.data.marginOfSafety.percentage,
    previous: calculatePreviousMarginOfSafety(statement, breakEvenData),
    change: results.data.marginOfSafety.percentage - calculatePreviousMarginOfSafety(statement, breakEvenData),
    isImproving: results.data.marginOfSafety.percentage > calculatePreviousMarginOfSafety(statement, breakEvenData)
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    industry: {
      average: benchmarks.marginOfSafety.industry,
      difference: results.data.marginOfSafety.percentage - benchmarks.marginOfSafety.industry,
      position: results.data.marginOfSafety.percentage > benchmarks.marginOfSafety.industry ? 'أعلى' : 'أقل'
    },
    bestPractice: {
      target: benchmarks.marginOfSafety.bestPractice,
      gap: benchmarks.marginOfSafety.bestPractice - results.data.marginOfSafety.percentage,
      achievable: results.data.marginOfSafety.percentage >= benchmarks.marginOfSafety.bestPractice * 0.8
    }
  };

  results.interpretation = generateMarginOfSafetyInterpretation(results.data);
  results.recommendations = generateMarginOfSafetyRecommendations(results.data);
  
  return results;
}

// 6. تحليل هيكل التكاليف
export function costStructureAnalysis(
  statement: FinancialStatement,
  detailedCosts: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل هيكل التكاليف',
    type: 'flow-movement',
    description: 'تحليل تفصيلي لمكونات التكاليف وكفاءتها',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const revenue = statement.data.revenue;
  const totalCosts = statement.data.cogs + statement.data.operatingExpenses + statement.data.financialExpenses;

  // تصنيف التكاليف الرئيسية
  results.data.mainCategories = {
    cogs: {
      amount: statement.data.cogs,
      percentage: (statement.data.cogs / revenue) * 100,
      components: analyzeCOGSComponents(statement, detailedCosts),
      trend: 'مستقر', // يحسب من البيانات التاريخية
      benchmarkComparison: (statement.data.cogs / revenue) * 100 - benchmarks.costs.cogsPercentage
    },
    operatingExpenses: {
      amount: statement.data.operatingExpenses,
      percentage: (statement.data.operatingExpenses / revenue) * 100,
      components: analyzeOperatingExpenses(statement, detailedCosts),
      trend: 'متزايد',
      benchmarkComparison: (statement.data.operatingExpenses / revenue) * 100 - benchmarks.costs.opexPercentage
    },
    financialExpenses: {
      amount: statement.data.financialExpenses,
      percentage: (statement.data.financialExpenses / revenue) * 100,
      components: analyzeFinancialExpenses(statement, detailedCosts),
      trend: 'مستقر',
      benchmarkComparison: (statement.data.financialExpenses / revenue) * 100 - benchmarks.costs.finexPercentage
    }
  };

  // تحليل التكاليف الثابتة والمتغيرة
  const fixedCosts = estimateFixedCosts(statement);
  const variableCosts = estimateVariableCosts(statement);
  
  results.data.costBehavior = {
    fixed: {
      amount: fixedCosts,
      percentage: (fixedCosts / totalCosts) * 100,
      perUnit: fixedCosts / (statement.data.unitsSold || 1),
      leverageEffect: calculateOperatingLeverage(revenue - variableCosts, statement.data.operatingProfit)
    },
    variable: {
      amount: variableCosts,
      percentage: (variableCosts / totalCosts) * 100,
      perUnit: variableCosts / (statement.data.unitsSold || 1),
      variabilityRatio: variableCosts / revenue
    },
    semiVariable: {
      amount: totalCosts - fixedCosts - variableCosts,
      percentage: ((totalCosts - fixedCosts - variableCosts) / totalCosts) * 100
    }
  };

  // كفاءة التكاليف
  results.data.efficiency = {
    costToRevenueRatio: (totalCosts / revenue) * 100,
    costPerUnit: totalCosts / (statement.data.unitsSold || 1),
    costProductivity: revenue / totalCosts,
    valueAdded: (revenue - statement.data.cogs) / statement.data.cogs,
    costSavingsOpportunities: identifyCostSavings(statement, detailedCosts, benchmarks)
  };

  // تحليل التكاليف حسب النشاط
  results.data.activityBasedCosting = {
    production: allocateCostsByActivity(detailedCosts, 'production'),
    sales: allocateCostsByActivity(detailedCosts, 'sales'),
    administration: allocateCostsByActivity(detailedCosts, 'administration'),
    support: allocateCostsByActivity(detailedCosts, 'support')
  };

  // المقارنة والتحليل
  results.data.analysis = {
    costCompetitiveness: evaluateCostCompetitiveness(results.data, benchmarks),
    costDrivers: identifyCostDrivers(statement, detailedCosts),
    abnormalCosts: identifyAbnormalCosts(statement, detailedCosts, benchmarks),
    optimizationPotential: calculateOptimizationPotential(results.data, benchmarks)
  };

  results.interpretation = generateCostStructureInterpretation(results.data);
  results.recommendations = generateCostStructureRecommendations(results.data);
  
  return results;
}

// 7. تحليل التكاليف الثابتة والمتغيرة
export function fixedVariableCostAnalysis(
  statements: FinancialStatement[],
  costDetails: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل التكاليف الثابتة والمتغيرة',
    type: 'flow-movement',
    description: 'تحليل سلوك التكاليف وتأثيرها على الربحية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const latestStatement = statements[statements.length - 1];
  
  // فصل التكاليف باستخدام طرق مختلفة
  const costSeparation = {
    highLowMethod: separateCostsHighLow(statements),
    regressionMethod: separateCostsRegression(statements),
    accountAnalysis: separateCostsAccountAnalysis(latestStatement, costDetails),
    average: calculateAverageSeparation(statements)
  };

  results.data.costSeparation = {
    fixed: costSeparation.average.fixed,
    variable: costSeparation.average.variable,
    mixedCosts: costSeparation.average.mixed,
    confidence: calculateSeparationConfidence(costSeparation)
  };

  // تحليل التكاليف الثابتة
  results.data.fixedCosts = {
    total: costSeparation.average.fixed,
    components: {
      rent: costDetails.rent || 0,
      salaries: costDetails.salaries || 0,
      depreciation: costDetails.depreciation || 0,
      insurance: costDetails.insurance || 0,
      other: costSeparation.average.fixed - (costDetails.rent || 0) - (costDetails.salaries || 0) - (costDetails.depreciation || 0) - (costDetails.insurance || 0)
    },
    percentageOfRevenue: (costSeparation.average.fixed / latestStatement.data.revenue) * 100,
    coverageRatio: (latestStatement.data.revenue - costSeparation.average.variable) / costSeparation.average.fixed,
    stepCosts: identifyStepCosts(statements, costDetails)
  };

  // تحليل التكاليف المتغيرة
  results.data.variableCosts = {
    total: costSeparation.average.variable,
    components: {
      directMaterials: costDetails.materials || 0,
      directLabor: costDetails.directLabor || 0,
      utilities: costDetails.utilities || 0,
      commissions: costDetails.commissions || 0,
      other: costSeparation.average.variable - (costDetails.materials || 0) - (costDetails.directLabor || 0) - (costDetails.utilities || 0) - (costDetails.commissions || 0)
    },
    percentageOfRevenue: (costSeparation.average.variable / latestStatement.data.revenue) * 100,
    perUnit: costSeparation.average.variable / (latestStatement.data.unitsSold || 1),
    variabilityCoefficient: calculateVariabilityCoefficient(statements)
  };

  // تحليل نسبة التكاليف
  results.data.costRatios = {
    fixedToTotal: (costSeparation.average.fixed / (costSeparation.average.fixed + costSeparation.average.variable)) * 100,
    variableToTotal: (costSeparation.average.variable / (costSeparation.average.fixed + costSeparation.average.variable)) * 100,
    operatingLeverage: (latestStatement.data.revenue - costSeparation.average.variable) / latestStatement.data.operatingProfit,
    contributionMargin: ((latestStatement.data.revenue - costSeparation.average.variable) / latestStatement.data.revenue) * 100
  };

  // تحليل الحساسية للتغيرات
  results.data.sensitivityAnalysis = {
    impactOfVolumeChange: {
      increase10Percent: calculateProfitWithVolumeChange(latestStatement, costSeparation.average, 1.1),
      decrease10Percent: calculateProfitWithVolumeChange(latestStatement, costSeparation.average, 0.9)
    },
    impactOfCostChange: {
      fixedIncrease10Percent: calculateProfitWithFixedChange(latestStatement, costSeparation.average, 1.1),
      variableIncrease10Percent: calculateProfitWithVariableChange(latestStatement, costSeparation.average, 1.1)
    },
    breakEvenAnalysis: {
      currentBreakEven: costSeparation.average.fixed / ((latestStatement.data.revenue - costSeparation.average.variable) / latestStatement.data.revenue),
      withFixedReduction: (costSeparation.average.fixed * 0.9) / ((latestStatement.data.revenue - costSeparation.average.variable) / latestStatement.data.revenue),
      withVariableReduction: costSeparation.average.fixed / ((latestStatement.data.revenue - costSeparation.average.variable * 0.9) / latestStatement.data.revenue)
    }
  };

  results.interpretation = generateFixedVariableInterpretation(results.data);
  results.recommendations = generateFixedVariableRecommendations(results.data);
  
  return results;
}

// 8. تحليل الرافعة التشغيلية
export function operatingLeverageAnalysis(
  statements: FinancialStatement[],
  costStructure: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل الرافعة التشغيلية',
    type: 'flow-movement',
    description: 'تحليل تأثير التغيرات في المبيعات على الأرباح التشغيلية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const latestStatement = statements[statements.length - 1];
  const fixedCosts = costStructure.fixed || estimateFixedCosts(latestStatement);
  const variableCosts = costStructure.variable || estimateVariableCosts(latestStatement);
  const revenue = latestStatement.data.revenue;
  const contributionMargin = revenue - variableCosts;
  const operatingProfit = latestStatement.data.operatingProfit;

  // حساب درجة الرافعة التشغيلية
  results.data.operatingLeverage = {
    degree: contributionMargin / operatingProfit,
    interpretation: interpretOperatingLeverage(contributionMargin / operatingProfit),
    formula: 'هامش المساهمة ÷ الربح التشغيلي',
    components: {
      contributionMargin: contributionMargin,
      operatingProfit: operatingProfit,
      fixedCosts: fixedCosts
    }
  };

  // تحليل التأثير
  results.data.impactAnalysis = {
    on10PercentSalesIncrease: {
      profitChange: (contributionMargin / operatingProfit) * 10,
      newProfit: operatingProfit * (1 + ((contributionMargin / operatingProfit) * 0.1)),
      profitMargin: (operatingProfit * (1 + ((contributionMargin / operatingProfit) * 0.1)) / (revenue * 1.1)) * 100
    },
    on10PercentSalesDecrease: {
      profitChange: (contributionMargin / operatingProfit) * -10,
      newProfit: operatingProfit * (1 - ((contributionMargin / operatingProfit) * 0.1)),
      profitMargin: (operatingProfit * (1 - ((contributionMargin / operatingProfit) * 0.1)) / (revenue * 0.9)) * 100
    },
    breakEvenPoint: fixedCosts / (contributionMargin / revenue),
    safetyMargin: ((revenue - (fixedCosts / (contributionMargin / revenue))) / revenue) * 100
  };

  // تحليل المخاطر والفرص
  results.data.riskOpportunity = {
    risk: {
      level: evaluateLeverageRisk(contributionMargin / operatingProfit),
      volatility: calculateEarningsVolatility(statements),
      downside: calculateDownsideRisk(latestStatement, costStructure)
    },
    opportunity: {
      upside: calculateUpsidePotential(latestStatement, costStructure),
      scalability: evaluateScalability(contributionMargin / operatingProfit, fixedCosts),
      growthLeverage: calculateGrowthLeverage(statements)
    }
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    industry: {
      averageLeverage: benchmarks.operatingLeverage.industry,
      companyPosition: (contributionMargin / operatingProfit) > benchmarks.operatingLeverage.industry ? 'أعلى' : 'أقل',
      difference: (contributionMargin / operatingProfit) - benchmarks.operatingLeverage.industry
    },
    optimal: {
      targetLeverage: benchmarks.operatingLeverage.optimal,
      gap: Math.abs((contributionMargin / operatingProfit) - benchmarks.operatingLeverage.optimal),
      recommendation: (contributionMargin / operatingProfit) > benchmarks.operatingLeverage.optimal ? 'تقليل الرافعة' : 'زيادة الرافعة'
    }
  };

  // استراتيجيات التحسين
  results.data.strategies = {
    toReduceLeverage: [
      'تحويل التكاليف الثابتة إلى متغيرة',
      'الاستعانة بمصادر خارجية للأنشطة غير الأساسية',
      'استخدام عقود مرنة'
    ],
    toIncreaseLeverage: [
      'الاستثمار في الأتمتة',
      'زيادة الطاقة الإنتاجية',
      'تحقيق وفورات الحجم'
    ],
    optimal: determineOptimalStrategy(contributionMargin / operatingProfit, benchmarks)
  };

  results.interpretation = generateOperatingLeverageInterpretation(results.data);
  results.recommendations = generateOperatingLeverageRecommendations(results.data);
  
  return results;
}

// 9. تحليل هامش المساهمة
export function contributionMarginAnalysis(
  statement: FinancialStatement,
  productData: any,
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل هامش المساهمة',
    type: 'flow-movement',
    description: 'تحليل المساهمة في تغطية التكاليف الثابتة وتحقيق الأرباح',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const revenue = statement.data.revenue;
  const variableCosts = statement.data.cogs * 0.7; // تقدير التكاليف المتغيرة
  const contributionMargin = revenue - variableCosts;
  const fixedCosts = statement.data.operatingExpenses + (statement.data.cogs * 0.3);

  // هامش المساهمة الإجمالي
  results.data.totalContribution = {
    amount: contributionMargin,
    percentage: (contributionMargin / revenue) * 100,
    perUnit: contributionMargin / (statement.data.unitsSold || 1),
    coverageOfFixed: contributionMargin / fixedCosts,
    excessOverFixed: contributionMargin - fixedCosts
  };

  // تحليل المنتجات (إذا توفرت بيانات المنتجات)
  if (productData && productData.products) {
    results.data.productAnalysis = productData.products.map((product: any) => ({
      name: product.name,
      revenue: product.revenue,
      variableCost: product.variableCost,
      contributionMargin: product.revenue - product.variableCost,
      contributionMarginRatio: ((product.revenue - product.variableCost) / product.revenue) * 100,
      percentageOfTotal: ((product.revenue - product.variableCost) / contributionMargin) * 100,
      ranking: 0 // سيتم الترتيب لاحقاً
    }));

    // ترتيب المنتجات حسب هامش المساهمة
    results.data.productAnalysis.sort((a: any, b: any) => b.contributionMarginRatio - a.contributionMarginRatio);
    results.data.productAnalysis.forEach((product: any, index: number) => {
      product.ranking = index + 1;
    });

    // تحليل المزيج
    results.data.mixAnalysis = {
      optimalMix: calculateOptimalProductMix(results.data.productAnalysis, fixedCosts),
      currentMix: analyzeCurrentProductMix(results.data.productAnalysis),
      recommendedChanges: recommendMixChanges(results.data.productAnalysis)
    };
  }

  // تحليل الحساسية
  results.data.sensitivity = {
    toVolumeChange: {
      increase10Percent: (contributionMargin * 1.1) - fixedCosts,
      decrease10Percent: (contributionMargin * 0.9) - fixedCosts,
      breakEvenVolume: fixedCosts / (contributionMargin / revenue)
    },
    toPriceChange: {
      increase5Percent: ((revenue * 1.05) - variableCosts) - fixedCosts,
      decrease5Percent: ((revenue * 0.95) - variableCosts) - fixedCosts
    },
    toCostChange: {
      variableIncrease5Percent: (revenue - (variableCosts * 1.05)) - fixedCosts,
      fixedIncrease5Percent: contributionMargin - (fixedCosts * 1.05)
    }
  };

  // تحليل الأداء
  results.data.performance = {
    contributionToSalesRatio: (contributionMargin / revenue) * 100,
    contributionPerEmployee: contributionMargin / (statement.data.employees || 1),
    contributionGrowthRate: calculateContributionGrowthRate(statement),
    efficiency: evaluateContributionEfficiency(contributionMargin / revenue, benchmarks)
  };

  // المقارنة مع المعايير
  results.data.benchmarkComparison = {
    contributionMarginRatio: {
      company: (contributionMargin / revenue) * 100,
      industry: benchmarks.contributionMargin.industry,
      bestInClass: benchmarks.contributionMargin.bestInClass,
      gap: (contributionMargin / revenue) * 100 - benchmarks.contributionMargin.industry
    },
    evaluation: evaluateContributionMargin((contributionMargin / revenue) * 100, benchmarks)
  };

  results.interpretation = generateContributionMarginInterpretation(results.data);
  results.recommendations = generateContributionMarginRecommendations(results.data);
  
  return results;
}

// 10. تحليل التدفقات الحرة
export function freeCashFlowAnalysis(
  cashFlows: CashFlowStatement[],
  statements: FinancialStatement[],
  benchmarks: any
): AnalysisResult {
  const results = {
    name: 'تحليل التدفقات النقدية الحرة',
    type: 'flow-movement',
    description: 'تحليل النقد المتاح للمساهمين والدائنين بعد الاستثمارات الرأسمالية',
    data: {},
    charts: [],
    interpretation: '',
    recommendations: []
  };

  const latestCashFlow = cashFlows[cashFlows.length - 1];
  const latestStatement = statements[statements.length - 1];
  
  // حساب التدفق النقدي الحر
  const operatingCashFlow = latestCashFlow.operatingActivities.netCash;
  const capex = Math.abs(latestCashFlow.investingActivities.capex);
  const fcf = operatingCashFlow - capex;

  results.data.freeCashFlow = {
    calculation: {
      operatingCashFlow: operatingCashFlow,
      lessCapex: -capex,
      freeCashFlow: fcf,
      alternativeCalculation: {
        ebitda: latestStatement.data.ebitda || (latestStatement.data.operatingProfit + latestCashFlow.operatingActivities.depreciation),
        lessTax: latestStatement.data.taxExpense,
        lessWorkingCapitalChange: latestCashFlow.operatingActivities.workingCapitalChanges,
        lessCapex: -capex,
        result: (latestStatement.data.ebitda || (latestStatement.data.operatingProfit + latestCashFlow.operatingActivities.depreciation)) - 
                latestStatement.data.taxExpense + latestCashFlow.operatingActivities.workingCapitalChanges - capex
      }
    },
    metrics: {
      fcfYield: (fcf / latestStatement.data.marketCap) * 100,
      fcfToRevenue: (fcf / latestStatement.data.revenue) * 100,
      fcfToAssets: (fcf / latestStatement.data.assets.total) * 100,
      fcfPerShare: fcf / latestStatement.data.sharesOutstanding,
      fcfGrowthRate: calculateFCFGrowthRate(cashFlows)
    }
  };

  // تحليل جودة التدفق النقدي الحر
  results.data.quality = {
    consistency: analyzeF FCFConsistency(cashFlows),
    sustainability: {
      maintenanceCapex: latestCashFlow.operatingActivities.depreciation,
      growthCapex: capex - latestCashFlow.operatingActivities.depreciation,
      isPositiveAfterMaintenance: operatingCashFlow > latestCashFlow.operatingActivities.depreciation
    },
    conversionRate: fcf / latestStatement.data.netProfit,
    qualityScore: calculateFCFQualityScore(fcf, latestStatement, latestCashFlow)
  };

  // استخدامات التدفق النقدي الحر
  results.data.uses = {
    dividends: {
      amount: latestCashFlow.financingActivities.dividendsPaid,
      percentageOfFCF: (latestCashFlow.financingActivities.dividendsPaid / fcf) * 100,
      coverage: fcf / latestCashFlow.financingActivities.dividendsPaid
    },
    debtReduction: {
      amount: latestCashFlow.financingActivities.debtRepaid - latestCashFlow.financingActivities.debtIssued,
      percentageOfFCF: ((latestCashFlow.financingActivities.debtRepaid - latestCashFlow.financingActivities.debtIssued) / fcf) * 100
    },
    shareRepurchases: {
      amount: latestCashFlow.financingActivities.shareRepurchases,
      percentageOfFCF: (latestCashFlow.financingActivities.shareRepurchases / fcf) * 100
    },
    reinvestment: {
      amount: Math.max(0, capex - latestCashFlow.operatingActivities.depreciation),
      percentageOfFCF: (Math.max(0, capex - latestCashFlow.operatingActivities.depreciation) / fcf) * 100
    },
    excess: fcf - latestCashFlow.financingActivities.dividendsPaid - 
            (latestCashFlow.financingActivities.debtRepaid - latestCashFlow.financingActivities.debtIssued) - 
            latestCashFlow.financingActivities.shareRepurchases
  };

  // تحليل الاتجاه
  results.data.trend = cashFlows.map((cf, index) => {
    const ocf = cf.operatingActivities.netCash;
    const cx = Math.abs(cf.investingActivities.capex);
    return {
      year: statements[index].year,
      operatingCashFlow: ocf,
      capex: cx,
      freeCashFlow: ocf - cx,
      fcfMargin: ((ocf - cx) / statements[index].data.revenue) * 100
    };
  });

  // التقييم والمقارنة
  results.data.valuation = {
    fcfMultiple: latestStatement.data.marketCap / fcf,
    impliedYield: (fcf / latestStatement.data.marketCap) * 100,
    paybackPeriod: latestStatement.data.marketCap / fcf,
    presentValue: calculateFCFPresentValue(cashFlows, benchmarks.discountRate)
  };

  results.data.benchmarkComparison = {
    fcfYield: {
      company: results.data.freeCashFlow.metrics.fcfYield,
      industry: benchmarks.fcf.yield,
      premium: results.data.freeCashFlow.metrics.fcfYield - benchmarks.fcf.yield
    },
    fcfMargin: {
      company: results.data.freeCashFlow.metrics.fcfToRevenue,
      industry: benchmarks.fcf.margin,
      difference: results.data.freeCashFlow.metrics.fcfToRevenue - benchmarks.fcf.margin
    },
    evaluation: evaluateFCFPerformance(results.data, benchmarks)
  };

  results.interpretation = generateFCFInterpretation(results.data);
  results.recommendations = generateFCFRecommendations(results.data);
  
  return results;
}

// ================ دوال مساعدة ================

function generateCashFlowInterpretation(data: any): string {
  let interpretation = 'تحليل التدفقات النقدية:\n\n';
  
  if (data.operating.analysis.isPositive) {
    interpretation += `• التدفقات النقدية التشغيلية إيجابية (${formatCurrency(data.operating.netCash)}) مما يشير إلى قدرة الشركة على توليد النقد من عملياتها الأساسية\n`;
  } else {
    interpretation += `• التدفقات النقدية التشغيلية سلبية (${formatCurrency(data.operating.netCash)}) مما يشير إلى مشاكل في توليد النقد من العمليات\n`;
  }
  
  if (data.operating.analysis.coversCapex) {
    interpretation += `• التدفقات التشغيلية تغطي الاستثمارات الرأسمالية بشكل كامل\n`;
  }
  
  if (data.freeCashFlow.fcf > 0) {
    interpretation += `• التدفق النقدي الحر إيجابي (${formatCurrency(data.freeCashFlow.fcf)}) مما يوفر مرونة للتوزيعات والنمو\n`;
  }
  
  interpretation += `• جودة الأرباح ${data.operating.qualityOfEarnings > 1 ? 'ممتازة' : 'تحتاج لتحسين'} (نسبة ${data.operating.qualityOfEarnings.toFixed(2)})\n`;
  
  return interpretation;
}

function generateCashFlowRecommendations(data: any): string[] {
  const recommendations = [];
  
  if (!data.operating.analysis.isPositive) {
    recommendations.push('تحسين التدفقات النقدية التشغيلية بشكل عاجل من خلال تحسين التحصيل وإدارة المخزون');
  }
  
  if (data.operating.qualityOfEarnings < 0.8) {
    recommendations.push('تحسين جودة الأرباح من خلال تقليل الاعتماد على البنود غير النقدية');
  }
  
  if (data.investing.capexToRevenue > 10) {
    recommendations.push('مراجعة كفاءة الإنفاق الرأسمالي وضمان تحقيق عائد مناسب على الاستثمارات');
  }
  
  if (data.freeCashFlow.fcf < 0) {
    recommendations.push('العمل على تحقيق تدفق نقدي حر إيجابي من خلال تحسين الكفاءة التشغيلية');
  }
  
  if (data.uses.dividends.coverage < 1.5) {
    recommendations.push('مراجعة سياسة التوزيعات لضمان الاستدامة');
  }
  
  return recommendations;
}

function generateWorkingCapitalInterpretation(data: any): string {
  let interpretation = 'تحليل رأس المال العامل:\n\n';
  
  interpretation += `• رأس المال العامل الحالي: ${formatCurrency(data.workingCapital.current)}\n`;
  interpretation += `• التغير عن الفترة السابقة: ${data.workingCapital.percentageChange.toFixed(1)}%\n`;
  interpretation += `• دورة التحويل النقدي: ${data.workingCapitalCycle.cashConversionCycle.toFixed(0)} يوم\n`;
  
  if (data.workingCapitalCycle.cashConversionCycle > data.workingCapitalCycle.targetCCC) {
    interpretation += `• دورة التحويل النقدي أطول من المستهدف بـ ${data.workingCapitalCycle.gapToTarget.toFixed(0)} يوم\n`;
  }
  
  interpretation += `• كفاءة رأس المال العامل: ${data.efficiency.workingCapitalTurnover.toFixed(1)} مرة\n`;
  
  if (data.requirements.gap < 0) {
    interpretation += `• هناك عجز في رأس المال العامل بمقدار ${formatCurrency(Math.abs(data.requirements.gap))}\n`;
  }
  
  return interpretation;
}

function generateWorkingCapitalRecommendations(data: any): string[] {
  const recommendations = [];
  
  if (data.workingCapitalCycle.cashConversionCycle > data.workingCapitalCycle.targetCCC) {
    recommendations.push('تقليل دورة التحويل النقدي من خلال تسريع التحصيل وتحسين إدارة المخزون');
  }
  
  if (data.components.receivables.daysOutstanding > 60) {
    recommendations.push('تحسين سياسات الائتمان والتحصيل لتقليل فترة تحصيل الذمم المدينة');
  }
  
  if (data.components.inventory.daysOnHand > 90) {
    recommendations.push('تحسين إدارة المخزون وتقليل المخزون بطيء الحركة');
  }
  
  if (data.requirements.gap < 0) {
    recommendations.push('زيادة رأس المال العامل لتلبية احتياجات التشغيل');
  }
  
  if (data.efficiency.workingCapitalTurnover < 5) {
    recommendations.push('تحسين كفاءة استخدام رأس المال العامل');
  }
  
  return recommendations;
}

// دوال مساعدة إضافية
function estimateFixedCosts(statement: FinancialStatement): number {
  // تقدير التكاليف الثابتة (30% من إجمالي التكاليف كتقدير أولي)
  const totalCosts = statement.data.cogs + statement.data.operatingExpenses;
  return totalCosts * 0.3;
}

function estimateVariableCosts(statement: FinancialStatement): number {
  // تقدير التكاليف المتغيرة (70% من إجمالي التكاليف كتقدير أولي)
  const totalCosts = statement.data.cogs + statement.data.operatingExpenses;
  return totalCosts * 0.7;
}

function estimateUnits(statement: FinancialStatement): number {
  // تقدير عدد الوحدات إذا لم تكن متوفرة
  return statement.data.unitsSold || (statement.data.revenue / 100); // افتراض متوسط سعر 100
}

function calculateSeasonalRequirements(statement: FinancialStatement, benchmarks: any): number {
  // حساب احتياجات رأس المال العامل الموسمية
  return (statement.data.revenue * benchmarks.workingCapital.seasonalFactor) / 365 * 30;
}

function calculateGrowthRequirements(statement: FinancialStatement, benchmarks: any): number {
  // حساب احتياجات رأس المال العامل للنمو
  const expectedGrowth = benchmarks.growth.expected || 0.1;
  return (statement.data.assets.current - statement.data.liabilities.current) * expectedGrowth;
}

function calculateOptimalWorkingCapital(statement: FinancialStatement, benchmarks: any): number {
  // حساب رأس المال العامل الأمثل
  return statement.data.revenue * benchmarks.workingCapital.optimalPercentage;
}

function calculateWorkingCapitalRequirement(statement: FinancialStatement, cashCycle: number): number {
  // حساب احتياج رأس المال العامل بناءً على دورة النقد
  return (cashCycle / 365) * statement.data.revenue;
}

function interpretCashCycle(days: number): string {
  if (days < 0) return 'دورة نقدية سالبة ممتازة - الشركة تحصل النقد قبل السداد';
  if (days < 30) return 'دورة نقدية قصيرة وفعالة';
  if (days < 60) return 'دورة نقدية مقبولة';
  if (days < 90) return 'دورة نقدية طويلة نسبياً';
  return 'دورة نقدية طويلة جداً تحتاج لتحسين عاجل';
}

function calculatePotentialSavings(statement: FinancialStatement, cycleData: any, benchmarks: any): number {
  const currentCash = (cycleData.currentCycle.cashConversionCycle / 365) * statement.data.revenue;
  const targetCash = (benchmarks.cashCycle.industry / 365) * statement.data.revenue;
  return Math.max(0, currentCash - targetCash);
}

function calculateCashRelease(statement: FinancialStatement, cycleData: any, benchmarks: any): number {
  const improvement = cycleData.currentCycle.cashConversionCycle - benchmarks.cashCycle.industry;
  return Math.max(0, (improvement / 365) * statement.data.revenue);
}

function generateCashCycleInterpretation(data: any): string {
  let interpretation = 'تحليل دورة النقد:\n\n';
  
  interpretation += `• دورة التحويل النقدي الحالية: ${data.currentCycle.cashConversionCycle.toFixed(0)} يوم\n`;
  interpretation += `• ${data.currentCycle.interpretation}\n`;
  interpretation += `• النقد المحتجز في دورة التشغيل: ${formatCurrency(data.liquidityImpact.cashTiedUp)}\n`;
  
  if (data.benchmarkComparison.industry.gap > 0) {
    interpretation += `• الدورة أطول من متوسط الصناعة بـ ${data.benchmarkComparison.industry.gap.toFixed(0)} يوم\n`;
    interpretation += `• إمكانية تحرير نقد بقيمة ${formatCurrency(data.improvement.cashRelease)}\n`;
  }
  
  return interpretation;
}

function generateCashCycleRecommendations(data: any): string[] {
  const recommendations = [];
  
  if (data.currentCycle.daysInventoryOutstanding > 60) {
    recommendations.push(`تقليل فترة الاحتفاظ بالمخزون من ${data.currentCycle.daysInventoryOutstanding.toFixed(0)} يوم`);
  }
  
  if (data.currentCycle.daysSalesOutstanding > 45) {
    recommendations.push(`تسريع تحصيل الذمم المدينة من ${data.currentCycle.daysSalesOutstanding.toFixed(0)} يوم`);
  }
  
  if (data.currentCycle.daysPayablesOutstanding < 30) {
    recommendations.push('التفاوض على شروط سداد أفضل مع الموردين');
  }
  
  if (data.improvement.cashRelease > 0) {
    recommendations.push(`العمل على تحرير ${formatCurrency(data.improvement.cashRelease)} من النقد المحتجز`);
  }
  
  return recommendations;
}

// المزيد من الدوال المساعدة...
function breakdownFixedCosts(statement: FinancialStatement, costStructure: any): any {
  return {
    rent: costStructure.rent || 0,
    salaries: costStructure.salaries || 0,
    depreciation: costStructure.depreciation || 0,
    insurance: costStructure.insurance || 0,
    other: 0
  };
}

function breakdownVariableCosts(statement: FinancialStatement, costStructure: any): any {
  return {
    materials: costStructure.materials || 0,
    directLabor: costStructure.directLabor || 0,
    utilities: costStructure.utilities || 0,
    commissions: costStructure.commissions || 0,
    other: 0
  };
}

function calculateBreakEvenWithPriceChange(fixed: number, newPrice: number, variableCost: number): number {
  return fixed / (newPrice - variableCost);
}

function evaluateMarginOfSafety(percentage: number): string {
  if (percentage > 40) return 'ممتاز - مخاطر منخفضة جداً';
  if (percentage > 30) return 'جيد جداً - مخاطر منخفضة';
  if (percentage > 20) return 'جيد - مخاطر معتدلة';
  if (percentage > 10) return 'مقبول - مخاطر متوسطة';
  return 'ضعيف - مخاطر عالية';
}

function evaluateContributionMargin(percentage: number): string {
  if (percentage > 40) return 'ممتاز';
  if (percentage > 30) return 'جيد جداً';
  if (percentage > 20) return 'جيد';
  if (percentage > 10) return 'مقبول';
  return 'ضعيف';
}

function calculateOperatingLeverage(contributionMargin: number, operatingProfit: number): number {
  return operatingProfit > 0 ? contributionMargin / operatingProfit : 0;
}

function generateBreakEvenInterpretation(data: any): string {
  let interpretation = 'تحليل نقطة التعادل:\n\n';
  
  interpretation += `• نقطة التعادل: ${formatCurrency(data.breakEvenPoint.inRevenue)} أو ${data.breakEvenPoint.inUnits.toFixed(0)} وحدة\n`;
  interpretation += `• هامش الأمان: ${data.breakEvenPoint.marginOfSafety.percentage.toFixed(1)}%\n`;
  interpretation += `• هامش المساهمة: ${data.contributionAnalysis.contributionMarginRatio.toFixed(1)}%\n`;
  
  return interpretation;
}

function generateBreakEvenRecommendations(data: any): string[] {
  const recommendations = [];
  
  if (data.breakEvenPoint.marginOfSafety.percentage < 20) {
    recommendations.push('زيادة هامش الأمان من خلال زيادة المبيعات أو تقليل التكاليف الثابتة');
  }
  
  if (data.contributionAnalysis.contributionMarginRatio < 30) {
    recommendations.push('تحسين هامش المساهمة من خلال رفع الأسعار أو تقليل التكاليف المتغيرة');
  }
  
  return recommendations;
}
