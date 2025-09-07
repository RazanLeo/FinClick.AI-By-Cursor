import type { ExtractedFinancialData } from '@/lib/parsers/documentParser';
import { ANALYSES } from './catalog';
import { buildExecutiveSummary } from './execSummary';
import { generateChartConfig } from '@/lib/charts/config';
import { generateBilingualReport } from '@/lib/reports/bilingualGenerator';

export interface AnalysisOptions {
  companyName: string;
  sector: string;
  activity?: string;
  legalEntity: string;
  comparisonLevel: string;
  yearsCount: number;
  analysisType: 'basic' | 'intermediate' | 'advanced' | 'comprehensive';
  language: 'ar' | 'en';
}

export async function runComprehensiveAnalysis(
  financialData: ExtractedFinancialData[],
  options: AnalysisOptions,
  benchmarks: any
) {
  const summary = {
    company: options.companyName,
    analyses: [] as any[],
    benchmarks,
  } as any;

  // Iterate all catalog items and compute placeholder values now; calculators will replace these
  for (const def of ANALYSES) {
    // Example computation hooks per category could be called here
    const value = Math.random() * 2 + 0.5; // to be replaced by real calculator per def
    const benchmark = benchmarks?.ratios?.current_ratio ?? 1;
    const evaluation = value >= benchmark ? (options.language === 'ar' ? 'جيد' : 'good') : (options.language === 'ar' ? 'أضعف من المعيار' : 'below');
    summary.analyses.push({
      id: def.id,
      name: options.language === 'ar' ? def.name.ar : def.name.en,
      value: Number(value.toFixed(2)),
      benchmark: Number(benchmark.toFixed(2)),
      evaluation,
      chart: generateChartConfig(def.id, value, benchmark, options.language),
    });
  }

  // Add executive summary
  summary.executiveSummary = buildExecutiveSummary(summary, options.language);
  
  // Add bilingual report
  summary.bilingualReport = generateBilingualReport(summary, {
    name: options.companyName,
    sector: options.sector,
    legalEntity: options.legalEntity,
    comparisonLevel: options.comparisonLevel
  }, options.language);

  return summary;
}


