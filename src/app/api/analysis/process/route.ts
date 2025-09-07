// src/app/api/analysis/process/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { extractFinancialData } from '@/lib/parsers/documentParser';
import { runComprehensiveAnalysis } from '@/lib/analysis/analyzer';
import { getIndustryBenchmarks } from '@/lib/data/benchmarks';
import { generateAnalysisReport } from '@/lib/reports/generator';
import { verifySubscription } from '@/lib/auth/subscription';
import { saveAnalysisResults } from '@/lib/database/analysis';

export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // التحقق من الاشتراك
    const subscription = await verifySubscription(token);
    if (!subscription.isActive) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 402 });
    }

    // استخراج البيانات من الطلب
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const options = JSON.parse(formData.get('options') as string);

    // معالجة الملفات واستخراج البيانات المالية
    const financialData = await extractFinancialData(files);

    // الحصول على معايير الصناعة
    const benchmarks = await getIndustryBenchmarks(
      options.sector,
      options.legalEntity,
      options.comparisonLevel
    );

    // تشغيل التحليل الشامل
    const analysisResults = await runComprehensiveAnalysis(
      financialData,
      options,
      benchmarks
    );

    // حفظ النتائج في قاعدة البيانات
    await saveAnalysisResults({
      userId: subscription.userId,
      companyName: options.companyName,
      results: analysisResults,
      options: options,
      timestamp: new Date()
    });

    // توليد التقرير
    const report = await generateAnalysisReport(analysisResults, options);

    return NextResponse.json({
      success: true,
      results: analysisResults,
      report: report,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process analysis' },
      { status: 500 }
    );
  }
}
