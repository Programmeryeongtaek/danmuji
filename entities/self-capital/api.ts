import { supabase } from '@/shared/lib/supabase';
import { SelfCapitalCheckWithScores, SelfCapitalItem } from '@/types/selfCapital';

/** 모든 문항 (숨긴 문항 포함 — 과거 점검 비교에 필요) */
export async function fetchSelfCapitalItems(): Promise<SelfCapitalItem[]> {
  const { data, error } = await supabase
    .from('self_capital_items')
    .select('id, capital, content, sort_order, is_active, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as SelfCapitalItem[];
}

interface CheckRow {
  id: string;
  period: string;
  memo: string | null;
  created_at: string;
  self_capital_scores: { item_id: string; score: number }[] | null;
}

/** 모든 점검 회차와 점수, 오래된 순 */
export async function fetchSelfCapitalChecks(): Promise<SelfCapitalCheckWithScores[]> {
  const { data, error } = await supabase
    .from('self_capital_checks')
    .select('id, period, memo, created_at, self_capital_scores(item_id, score)')
    .order('period', { ascending: true });

  if (error) throw error;

  return ((data ??[]) as CheckRow[]).map(({ self_capital_scores, ...check }) => ({
    ...check,
    scores: Object.fromEntries(
      (self_capital_scores ?? []).map((s) => [s.item_id, s.score]),
    ),
  }));
}