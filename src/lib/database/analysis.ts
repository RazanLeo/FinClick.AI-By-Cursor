import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveAnalysisResults(record: {
  userId: string;
  companyName: string;
  results: any;
  options: any;
  timestamp: Date;
}) {
  try {
    await supabase.from('analyses').insert({
      user_id: record.userId,
      company_name: record.companyName,
      results: record.results,
      options: record.options,
      created_at: record.timestamp.toISOString(),
    });
  } catch (e) {
    console.error('Failed to save analysis results', e);
  }
}


