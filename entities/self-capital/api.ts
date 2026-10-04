import { supabase } from '@/shared/lib/supabase';
import { SaveCheckInput, SelfCapitalCheckWithScores, SelfCapitalItem, SelfCapitalItemInput, SelfCapitalItemUpdate } from '@/types/selfCapital';

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

  return ((data ?? []) as CheckRow[]).map(({ self_capital_scores, ...check }) => ({
    ...check,
    scores: Object.fromEntries(
      (self_capital_scores ?? []).map((s) => [s.item_id, s.score]),
    ),
  }));
}

/** 문항 추가 (정렬은 추가한 순서 = created_at) */
export async function createSelfCapitalItem(input: SelfCapitalItemInput): Promise<void> {
  const { error } = await supabase
    .from('self_capital_items')
    .insert({ capital: input.capital, content: input.content });

  if (error) throw error;
}

/** 문장 또는 자본 분류 수정 */
export async function updateSelfCapitalItem(
  id: string,
  update: SelfCapitalItemUpdate,
): Promise<void> {
  const { error } = await supabase
    .from('self_capital_items')
    .update(update)
    .eq('id', id);

  if (error) throw error;
}

/** 완전 삭제 — 점수 기록이 있으면 DB가 거부함(on delete restrict) */
export async function deleteSelfCapitalItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('self_capital_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/** 숨기기 / 다시 보이기 */
export async function setSelfCapitalItemActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('self_capital_items')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;
}

/** 월별 점검 저장 — 같은 달이면 덮어쓰기(upsert) */
export async function saveSelfCapitalCheck(input: SaveCheckInput): Promise<string> {
  const { data: check, error } = await supabase
    .from('self_capital_checks')
    .upsert(
      { period: input.period, memo: input.memo ?? null, updated_at: new Date().toISOString() },
      { onConflict: 'period' }, // TODO(auth): 'user_id, period'
    )
    .select('id')
    .single();

  if (error) throw error;

  const rows = Object.entries(input.scores).map(([item_id, score]) => ({
    check_id: check.id as string,
    item_id,
    score,
  }));

  if (rows.length > 0) {
    const { error: scoreError } = await supabase
      .from('self_capital_scores')
      .upsert(rows, { onConflict: 'check_id, item_id' });
    if (scoreError) throw scoreError;
  }

  return check.id as string;
}