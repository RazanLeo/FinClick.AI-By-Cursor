/**
 * محرك التحليل المالي الأساسي الكلاسيكي
 * Basic Classical Financial Analysis Engine
 */

export interface FinancialStatement {
  year: number;
  balanceSheet: {
    assets: {
      current: {
        cash: number;
        accountsReceivable: number;
        inventory: number;
        otherCurrentAssets: number;
        totalCurrentAssets: number;
      };
      nonCurrent: {
        ppe: number; // Property, Plant & Equipment
        intangibleAssets: number;
        investments: number;
        otherNonCurrentAssets: number;
        totalNonCurrentAssets: number;
      };
      totalAssets: number;
    };
    liabilities: {
      current: {
        accountsPayable: number;
        shortTermDebt: number;
        otherCurrentLiabilities: number;
        totalCurrentLiabilities: number;
      };
      nonCurrent: {
        longTermDebt: number;
        otherNonCurrentLiabilities: number;
        totalNonCurrentLiabilities: number;
      };
      totalLiabilities: number;
    };
    equity: {
      commonStock: number;
      retainedEarnings: number;
      otherEquity: number;
      totalEquity: number;
    };
  };
  incomeStatement: {
    revenue: number;
    costOfGoodsSold: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingIncome: number;
    interestExpense: number;
    taxExpense: number;
    netIncome: number;
  };
  cashFlowStatement: {
    operating: {
      netIncome: number;
      depreciation: number;
      changesInWorkingCapital: number;
      totalOperatingCashFlow: number;
    };
    investing: {
      capitalExpenditures: number;
      acquisitions: number;
      otherInvesting: number;
      totalInvestingCashFlow: number;
    };
    financing: {
      debtIssued: number;
      debtRepaid: number;
      dividendsPaid: number;
      otherFinancing: number;
      totalFinancingCashFlow: number;
    };
    netCashFlow: number;
    beginningCash: number;
    endingCash: number;
  };
}

export class BasicAnalysisEngine {
  private statements: FinancialStatement[];
  private industryAverages: any;

  constructor(statements: FinancialStatement[], industryAverages?: any) {
    this.statements = statements;
    this.industryAverages = industryAverages || {};
  }

  /**
   * 1. التحليل الرأسي (Vertical Analysis)
   */
  public verticalAnalysis(year?: number): any {
    const statement = year 
      ? this.statements.find(s => s.year === year)
      : this.statements[this.statements.length - 1];

    if (!statement) return null;

    const { balanceSheet, incomeStatement } = statement;
    const totalAssets = balanceSheet.assets.totalAssets;
    const totalRevenue = incomeStatement.revenue;

    return {
      analysisName: 'التحليل الرأسي',
      analysisType: 'Vertical Analysis',
      year: statement.year,
      balanceSheet: {
        assets: {
          current: {
            cash: this.percentage(balanceSheet.assets.current.cash, totalAssets),
            accountsReceivable: this.percentage(balanceSheet.assets.current.accountsReceivable, totalAssets),
            inventory: this.percentage(balanceSheet.assets.current.inventory, totalAssets),
            totalCurrentAssets: this.percentage(balanceSheet.assets.current.totalCurrentAssets, totalAssets),
          },
          nonCurrent: {
            ppe: this.percentage(balanceSheet.assets.nonCurrent.ppe, totalAssets),
            totalNonCurrentAssets: this.percentage(balanceSheet.assets.nonCurrent.totalNonCurrentAssets, totalAssets),
          },
        },
        liabilities: {
          current: {
            totalCurrentLiabilities: this.percentage(balanceSheet.liabilities.current.totalCurrentLiabilities, totalAssets),
          },
          nonCurrent: {
            totalNonCurrentLiabilities: this.percentage(balanceSheet.liabilities.nonCurrent.totalNonCurrentLiabilities, totalAssets),
          },
          totalLiabilities: this.percentage(balanceSheet.liabilities.totalLiabilities, totalAssets),
        },
        equity: {
          totalEquity: this.percentage(balanceSheet.equity.totalEquity, totalAssets),
        },
      },
      incomeStatement: {
        costOfGoodsSold: this.percentage(incomeStatement.costOfGoodsSold, totalRevenue),
        grossProfit: this.percentage(incomeStatement.grossProfit, totalRevenue),
        operatingExpenses: this.percentage(incomeStatement.operatingExpenses, totalRevenue),
        operatingIncome: this.percentage(incomeStatement.operatingIncome, totalRevenue),
        netIncome: this.percentage(incomeStatement.netIncome, totalRevenue),
      },
      interpretation: this.generateVerticalInterpretation(statement),
    };
  }

  /**
   * 2. التحليل الأفقي (Horizontal Analysis)
   */
  public horizontalAnalysis(): any {
    if (this.statements.length < 2) {
      return { error: 'يتطلب التحليل الأفقي بيانات سنتين على الأقل' };
    }

    const analyses = [];
    for (let i = 1; i < this.statements.length; i++) {
      const current = this.statements[i];
      const previous = this.statements[i - 1];

      analyses.push({
        period: `${previous.year} - ${current.year}`,
        changes: {
          revenue: this.calculateChange(previous.incomeStatement.revenue, current.incomeStatement.revenue),
          netIncome: this.calculateChange(previous.incomeStatement.netIncome, current.incomeStatement.netIncome),
          totalAssets: this.calculateChange(
            previous.balanceSheet.assets.totalAssets,
            current.balanceSheet.assets.totalAssets
          ),
          totalEquity: this.calculateChange(
            previous.balanceSheet.equity.totalEquity,
            current.balanceSheet.equity.totalEquity
          ),
          operatingCashFlow: this.calculateChange(
            previous.cashFlowStatement.operating.totalOperatingCashFlow,
            current.cashFlowStatement.operating.totalOperatingCashFlow
          ),
        },
      });
    }

    return {
      analysisName: 'التحليل الأفقي',
      analysisType: 'Horizontal Analysis',
      periods: analyses,
      interpretation: this.generateHorizontalInterpretation(analyses),
    };
  }

  /**
   * 3. تحليل الاتجاه (Trend Analysis)
   */
  public trendAnalysis(): any {
    if (this.statements.length < 3) {
      return { error: 'يتطلب تحليل الاتجاه بيانات 3 سنوات على الأقل' };
    }

    const baseYear = this.statements[0];
    const trends = this.statements.map(statement => ({
      year: statement.year,
      revenue: this.indexNumber(baseYear.incomeStatement.revenue, statement.incomeStatement.revenue),
      netIncome: this.indexNumber(baseYear.incomeStatement.netIncome, statement.incomeStatement.netIncome),
      totalAssets: this.indexNumber(
        baseYear.balanceSheet.assets.totalAssets,
        statement.balanceSheet.assets.totalAssets
      ),
      totalEquity: this.indexNumber(
        baseYear.balanceSheet.equity.totalEquity,
        statement.balanceSheet.equity.totalEquity
      ),
    }));

    return {
      analysisName: 'تحليل الاتجاه',
      analysisType: 'Trend Analysis',
      baseYear: baseYear.year,
      trends,
      interpretation: this.generateTrendInterpretation(trends),
    };
  }

  /**
   * 4. النسب المالية الأساسية (Financial Ratios)
   */
  public financialRatios(year?: number): any {
    const statement = year 
      ? this.statements.find(s => s.year === year)
      : this.statements[this.statements.length - 1];

    if (!statement) return null;

    const { balanceSheet, incomeStatement, cashFlowStatement } = statement;

    // نسب السيولة
    const liquidityRatios = {
      currentRatio: this.ratio(
        balanceSheet.assets.current.totalCurrentAssets,
        balanceSheet.liabilities.current.totalCurrentLiabilities
      ),
      quickRatio: this.ratio(
        balanceSheet.assets.current.totalCurrentAssets - balanceSheet.assets.current.inventory,
        balanceSheet.liabilities.current.totalCurrentLiabilities
      ),
      cashRatio: this.ratio(
        balanceSheet.assets.current.cash,
        balanceSheet.liabilities.current.totalCurrentLiabilities
      ),
      operatingCashFlowRatio: this.ratio(
        cashFlowStatement.operating.totalOperatingCashFlow,
        balanceSheet.liabilities.current.totalCurrentLiabilities
      ),
      workingCapitalRatio: this.ratio(
        balanceSheet.assets.current.totalCurrentAssets - balanceSheet.liabilities.current.totalCurrentLiabilities,
        balanceSheet.assets.totalAssets
      ),
    };

    // نسب النشاط/الكفاءة
    const activityRatios = {
      inventoryTurnover: this.ratio(
        incomeStatement.costOfGoodsSold,
        balanceSheet.assets.current.inventory
      ),
      receivablesTurnover: this.ratio(
        incomeStatement.revenue,
        balanceSheet.assets.current.accountsReceivable
      ),
      daysSalesInReceivables: this.days(
        balanceSheet.assets.current.accountsReceivable,
        incomeStatement.revenue
      ),
      payablesTurnover: this.ratio(
        incomeStatement.costOfGoodsSold,
        balanceSheet.liabilities.current.accountsPayable
      ),
      daysPayablesOutstanding: this.days(
        balanceSheet.liabilities.current.accountsPayable,
        incomeStatement.costOfGoodsSold
      ),
      assetTurnover: this.ratio(
        incomeStatement.revenue,
        balanceSheet.assets.totalAssets
      ),
      fixedAssetTurnover: this.ratio(
        incomeStatement.revenue,
        balanceSheet.assets.nonCurrent.ppe
      ),
    };

    // نسب المديونية/الرفع المالي
    const leverageRatios = {
      debtToAssets: this.ratio(
        balanceSheet.liabilities.totalLiabilities,
        balanceSheet.assets.totalAssets
      ),
      debtToEquity: this.ratio(
        balanceSheet.liabilities.totalLiabilities,
        balanceSheet.equity.totalEquity
      ),
      interestCoverage: this.ratio(
        incomeStatement.operatingIncome,
        incomeStatement.interestExpense
      ),
      equityRatio: this.ratio(
        balanceSheet.equity.totalEquity,
        balanceSheet.assets.totalAssets
      ),
    };

    // نسب الربحية
    const profitabilityRatios = {
      grossProfitMargin: this.percentage(incomeStatement.grossProfit, incomeStatement.revenue),
      operatingProfitMargin: this.percentage(incomeStatement.operatingIncome, incomeStatement.revenue),
      netProfitMargin: this.percentage(incomeStatement.netIncome, incomeStatement.revenue),
      returnOnAssets: this.percentage(incomeStatement.netIncome, balanceSheet.assets.totalAssets),
      returnOnEquity: this.percentage(incomeStatement.netIncome, balanceSheet.equity.totalEquity),
    };

    return {
      analysisName: 'النسب المالية الأساسية',
      analysisType: 'Financial Ratios',
      year: statement.year,
      ratios: {
        liquidity: liquidityRatios,
        activity: activityRatios,
        leverage: leverageRatios,
        profitability: profitabilityRatios,
      },
      benchmarks: this.compareWithIndustry({
        liquidity: liquidityRatios,
        activity: activityRatios,
        leverage: leverageRatios,
        profitability: profitabilityRatios,
      }),
      interpretation: this.generateRatiosInterpretation({
        liquidity: liquidityRatios,
        activity: activityRatios,
        leverage: leverageRatios,
        profitability: profitabilityRatios,
      }),
    };
  }

  /**
   * 5. تحليل التدفق النقدي (Cash Flow Analysis)
   */
  public cashFlowAnalysis(): any {
    const latestStatement = this.statements[this.statements.length - 1];
    const { cashFlowStatement, incomeStatement, balanceSheet } = latestStatement;

    const analysis = {
      operatingCashFlowMargin: this.percentage(
        cashFlowStatement.operating.totalOperatingCashFlow,
        incomeStatement.revenue
      ),
      freeCashFlow: cashFlowStatement.operating.totalOperatingCashFlow + 
                    cashFlowStatement.investing.capitalExpenditures,
      freeCashFlowToEquity: cashFlowStatement.operating.totalOperatingCashFlow + 
                            cashFlowStatement.investing.capitalExpenditures +
                            cashFlowStatement.financing.debtIssued -
                            cashFlowStatement.financing.debtRepaid,
      cashFlowCoverage: this.ratio(
        cashFlowStatement.operating.totalOperatingCashFlow,
        balanceSheet.liabilities.totalLiabilities
      ),
      cashFlowToCapex: this.ratio(
        cashFlowStatement.operating.totalOperatingCashFlow,
        Math.abs(cashFlowStatement.investing.capitalExpenditures)
      ),
      cashConversionCycle: this.calculateCashConversionCycle(latestStatement),
    };

    return {
      analysisName: 'تحليل التدفق النقدي',
      analysisType: 'Cash Flow Analysis',
      year: latestStatement.year,
      metrics: analysis,
      interpretation: this.generateRatiosInterpretation(analysis),
    };
  }

  /**
   * 6. تحليل نقطة التعادل (Break-Even Analysis)
   */
  public breakEvenAnalysis(): any {
    const latestStatement = this.statements[this.statements.length - 1];
    const { incomeStatement } = latestStatement;

    // تقدير التكاليف الثابتة والمتغيرة
    const fixedCosts = incomeStatement.operatingExpenses * 0.6; // تقدير 60% ثابتة
    const variableCosts = incomeStatement.costOfGoodsSold + (incomeStatement.operatingExpenses * 0.4);
    const contributionMargin = incomeStatement.revenue - variableCosts;
    const contributionMarginRatio = contributionMargin / incomeStatement.revenue;

    const breakEvenPoint = {
      inValue: fixedCosts / contributionMarginRatio,
      inUnits: null, // يحتاج سعر الوحدة
      marginOfSafety: {
        value: incomeStatement.revenue - (fixedCosts / contributionMarginRatio),
        percentage: ((incomeStatement.revenue - (fixedCosts / contributionMarginRatio)) / incomeStatement.revenue) * 100,
      },
      operatingLeverage: contributionMargin / incomeStatement.operatingIncome,
    };

    return {
      analysisName: 'تحليل نقطة التعادل',
      analysisType: 'Break-Even Analysis',
      year: latestStatement.year,
      fixedCosts,
      variableCosts,
      contributionMargin,
      contributionMarginRatio: contributionMarginRatio * 100,
      breakEvenPoint,
      interpretation: this.generateBreakEvenInterpretation(breakEvenPoint),
    };
  }

  // Helper Methods
  private percentage(value: number, base: number): number {
    if (base === 0) return 0;
    return Number(((value / base) * 100).toFixed(2));
  }

  private ratio(numerator: number, denominator: number): number {
    if (denominator === 0) return 0;
    return Number((numerator / denominator).toFixed(2));
  }

  private days(balance: number, flow: number): number {
    if (flow === 0) return 0;
    return Number(((balance / flow) * 365).toFixed(0));
  }

  private calculateChange(previous: number, current: number): any {
    const absoluteChange = current - previous;
    const percentageChange = previous !== 0 ? ((absoluteChange / previous) * 100) : 0;
    
    return {
      absolute: Number(absoluteChange.toFixed(2)),
      percentage: Number(percentageChange.toFixed(2)),
    };
  }

  private indexNumber(base: number, current: number): number {
    if (base === 0) return 100;
    return Number(((current / base) * 100).toFixed(2));
  }

  private calculateCashConversionCycle(statement: FinancialStatement): number {
    const daysInventory = this.days(
      statement.balanceSheet.assets.current.inventory,
      statement.incomeStatement.costOfGoodsSold
    );
    const daysReceivables = this.days(
      statement.balanceSheet.assets.current.accountsReceivable,
      statement.incomeStatement.revenue
    );
    const daysPayables = this.days(
      statement.balanceSheet.liabilities.current.accountsPayable,
      statement.incomeStatement.costOfGoodsSold
    );

    return daysInventory + daysReceivables - daysPayables;
  }

  private compareWithIndustry(ratios: any): any {
    // مقارنة مع متوسطات الصناعة
    const comparison = {};
    
    // هذا مثال - في الواقع سيتم جلب البيانات من API
    const industryBenchmarks = {
      liquidity: {
        currentRatio: 2.0,
        quickRatio: 1.5,
        cashRatio: 0.5,
      },
      profitability: {
        grossProfitMargin: 35,
        netProfitMargin: 10,
        returnOnAssets: 8,
        returnOnEquity: 15,
      },
    };

    for (const category in ratios) {
      comparison[category] = {};
      for (const ratio in ratios[category]) {
        if (industryBenchmarks[category] && industryBenchmarks[category][ratio]) {
          const actual = ratios[category][ratio];
          const benchmark = industryBenchmarks[category][ratio];
          comparison[category][ratio] = {
            actual,
            benchmark,
            variance: actual - benchmark,
            performance: actual >= benchmark ? 'أعلى من المتوسط' : 'أقل من المتوسط',
          };
        }
      }
    }

    return comparison;
  }

  private generateVerticalInterpretation(statement: FinancialStatement): string {
    const { balanceSheet, incomeStatement } = statement;
    const currentAssetsRatio = this.percentage(
      balanceSheet.assets.current.totalCurrentAssets,
      balanceSheet.assets.totalAssets
    );
    const debtRatio = this.percentage(
      balanceSheet.liabilities.totalLiabilities,
      balanceSheet.assets.totalAssets
    );
    const netMargin = this.percentage(
      incomeStatement.netIncome,
      incomeStatement.revenue
    );

    return `تُظهر نتائج التحليل الرأسي أن الأصول المتداولة تمثل ${currentAssetsRatio}% من إجمالي الأصول، 
    بينما تمثل الالتزامات ${debtRatio}% من إجمالي الأصول. 
    هامش الربح الصافي بلغ ${netMargin}% من الإيرادات، 
    مما يشير إلى ${netMargin > 10 ? 'أداء جيد' : netMargin > 5 ? 'أداء مقبول' : 'حاجة لتحسين الربحية'}.`;
  }

  private generateHorizontalInterpretation(analyses: any[]): string {
    const latestChange = analyses[analyses.length - 1];
    const revenueChange = latestChange.changes.revenue.percentage;
    const netIncomeChange = latestChange.changes.netIncome.percentage;

    return `خلال الفترة الأخيرة، ${revenueChange > 0 ? 'نمت الإيرادات بنسبة' : 'انخفضت الإيرادات بنسبة'} ${Math.abs(revenueChange)}%، 
    بينما ${netIncomeChange > 0 ? 'ارتفع صافي الربح بنسبة' : 'انخفض صافي الربح بنسبة'} ${Math.abs(netIncomeChange)}%. 
    ${revenueChange > netIncomeChange ? 'يُلاحظ أن نمو الإيرادات يفوق نمو الأرباح، مما قد يشير إلى ارتفاع في التكاليف.' : 
    'الأرباح تنمو بوتيرة أسرع من الإيرادات، مما يدل على تحسن في الكفاءة التشغيلية.'}`;
  }

  private generateTrendInterpretation(trends: any[]): string {
    const latestTrend = trends[trends.length - 1];
    const overallGrowth = latestTrend.revenue - 100;

    return `على مدى فترة التحليل، نمت الإيرادات بنسبة إجمالية قدرها ${overallGrowth}% مقارنة بسنة الأساس. 
    ${overallGrowth > 50 ? 'هذا يمثل نمواً قوياً ومستداماً.' : 
     overallGrowth > 20 ? 'هذا يمثل نمواً معتدلاً وصحياً.' : 
     overallGrowth > 0 ? 'النمو بطيء ويحتاج إلى تحسين.' : 
     'هناك انخفاض في الأداء يتطلب اتخاذ إجراءات تصحيحية.'}`;
  }

  private generateRatiosInterpretation(ratios: any): string {
    const { liquidity, profitability, leverage } = ratios;

    let interpretation = `تحليل النسب المالية يُظهر:\n\n`;
    
    // السيولة
    interpretation += `السيولة: النسبة الجارية ${liquidity.currentRatio} `;
    interpretation += liquidity.currentRatio >= 2 ? '(ممتازة) ' : 
                      liquidity.currentRatio >= 1.5 ? '(جيدة) ' : 
                      liquidity.currentRatio >= 1 ? '(مقبولة) ' : '(ضعيفة) ';
    interpretation += `تشير إلى ${liquidity.currentRatio >= 1.5 ? 'قدرة جيدة على سداد الالتزامات قصيرة الأجل' : 'حاجة لتحسين إدارة السيولة'}.\n\n`;

    // الربحية
    interpretation += `الربحية: هامش الربح الصافي ${profitability.netProfitMargin}% `;
    interpretation += profitability.netProfitMargin >= 15 ? '(ممتاز) ' : 
                      profitability.netProfitMargin >= 10 ? '(جيد) ' : 
                      profitability.netProfitMargin >= 5 ? '(مقبول) ' : '(ضعيف) ';
    interpretation += `والعائد على حقوق الملكية ${profitability.returnOnEquity}% `;
    interpretation += profitability.returnOnEquity >= 20 ? 'يُظهر أداءً استثنائياً' : 
                      profitability.returnOnEquity >= 15 ? 'يُظهر أداءً جيداً' : 'يحتاج إلى تحسين';\n\n`;

    // الرفع المالي
    interpretation += `الرفع المالي: نسبة الدين إلى حقوق الملكية ${leverage.debtToEquity} `;
    interpretation += leverage.debtToEquity <= 0.5 ? '(محافظة) ' : 
                      leverage.debtToEquity <= 1 ? '(متوازنة) ' : 
                      leverage.debtToEquity <= 2 ? '(مرتفعة) ' : '(خطرة) ';
    interpretation += `${leverage.debtToEquity <= 1 ? 'مما يدل على هيكل رأسمالي صحي' : 'تتطلب مراجعة هيكل التمويل'}.`;

    return interpretation;
  }

  private generateCashFlowInterpretation(analysis: any): string {
    const { operatingCashFlowMargin, freeCashFlow, cashConversionCycle } = analysis;

    return `التدفق النقدي التشغيلي يمثل ${operatingCashFlowMargin}% من الإيرادات، 
    ${operatingCashFlowMargin > 15 ? 'وهو مستوى ممتاز' : operatingCashFlowMargin > 10 ? 'وهو مستوى جيد' : 'ويحتاج إلى تحسين'}. 
    التدفق النقدي الحر بلغ ${freeCashFlow.toLocaleString()} ريال، 
    ${freeCashFlow > 0 ? 'مما يوفر مرونة مالية جيدة' : 'مما يتطلب تحسين إدارة النقد'}. 
    دورة التحويل النقدي ${cashConversionCycle} يوماً 
    ${cashConversionCycle < 30 ? '(ممتازة)' : cashConversionCycle < 60 ? '(جيدة)' : '(تحتاج تحسين)'}.`;
  }

  private generateBreakEvenInterpretation(breakEvenPoint: any): string {
    const { marginOfSafety, operatingLeverage } = breakEvenPoint;

    return `نقطة التعادل تحدث عند مبيعات قدرها ${breakEvenPoint.inValue.toLocaleString()} ريال. 
    هامش الأمان ${marginOfSafety.percentage.toFixed(1)}% 
    ${marginOfSafety.percentage > 30 ? '(ممتاز)' : marginOfSafety.percentage > 20 ? '(جيد)' : marginOfSafety.percentage > 10 ? '(مقبول)' : '(منخفض)'}, 
    مما يعني أن المبيعات يمكن أن تنخفض بنسبة ${marginOfSafety.percentage.toFixed(1)}% قبل الوصول لنقطة التعادل. 
    الرافعة التشغيلية ${operatingLeverage.toFixed(2)}x تشير إلى أن كل 1% تغير في المبيعات يؤدي إلى ${operatingLeverage.toFixed(2)}% تغير في الربح التشغيلي.`;
  }
}
