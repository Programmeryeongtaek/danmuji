/* ───────── 기준표 (지금은 하나만 사용) ───────── */

import { supabase } from '@/shared/lib/supabase';
import { CriterionInput, EvaluationInput, InvestCriterion, InvestEvaluation, InvestStock, InvestTemplate, InvestTemplateVersion, StockInput, TemplateMetaInput } from '@/types/invest';

export async function fetchTemplate(): Promise<InvestTemplate | null> {
  const { data, error } = await supabase
    .from('invest_templates')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateTemplateMeta(
  id: string,
  input: TemplateMetaInput,
): Promise<void> {
  const { error } = await supabase
    .from('invest_templates')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** 버전을 하나 올리고 변경 이유를 이력에 남긴다 */
export async function bumpTemplateVersion(
  template: InvestTemplate,
  reason: string,
): Promise<number> {
  const nextVersion = template.version + 1;

  const { error: updateError } = await supabase
    .from('invest_templates')
    .update({ version: nextVersion, updated_at: new Date().toISOString() })
    .eq('id', template.id);
  if (updateError) throw updateError;

  const { error: insertError } = await supabase
    .from('invest_template_versions')
    .insert({ template_id: template.id, version: nextVersion, reason });
  if (insertError) throw insertError;

  return nextVersion;
}

export async function fetchTemplateVersions(
  templateId: string,
): Promise<InvestTemplateVersion[]> {
  const { data, error } = await supabase
    .from('invest_template_versions')
    .select('*')
    .eq('template_id', templateId)
    .order('version', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* ───────── 기준 항목 ───────── */

export async function fetchCriteria(templateId: string): Promise<InvestCriterion[]> {
  const { data, error } = await supabase
    .from('invest_criteria')
    .select('*')
    .eq('template_id', templateId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCriterion(
  templateId: string,
  input: CriterionInput,
): Promise<InvestCriterion> {
  const { data, error } = await supabase
    .from('invest_criteria')
    .insert({ ...input, template_id: templateId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCriterion(
  id: string,
  input: Partial<CriterionInput>,
): Promise<void> {
  const { error } = await supabase.from('invest_criteria').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteCriterion(id: string): Promise<void> {
  const { error } = await supabase.from('invest_criteria').delete().eq('id', id);
  if (error) throw error;
}

/* ───────── 종목 ───────── */

export async function fetchStocks(): Promise<InvestStock[]> {
  const { data, error } = await supabase
    .from('invest_stocks')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchStock(id: string): Promise<InvestStock | null> {
  const { data, error } = await supabase
    .from('invest_stocks')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createStock(input: StockInput): Promise<InvestStock> {
  const { data, error } = await supabase
    .from('invest_stocks')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStockNextReview(
  id: string,
  nextReviewAt: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('invest_stocks')
    .update({ next_review_at: nextReviewAt })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteStock(id: string): Promise<void> {
  const { error } = await supabase.from('invest_stocks').delete().eq('id', id);
  if (error) throw error;
}

/* ───────── 평가 기록 ───────── */

/** 비교표용: 전체 평가를 최신순으로 (종목별 최신 1건은 화면에서 고른다) */
export async function fetchEvaluations(): Promise<InvestEvaluation[]> {
  const { data, error } = await supabase
    .from('invest_evaluations')
    .select('*')
    .order('evaluated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchStockEvaluations(
  stockId: string,
): Promise<InvestEvaluation[]> {
  const { data, error } = await supabase
    .from('invest_evaluations')
    .select('*')
    .eq('stock_id', stockId)
    .order('evaluated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEvaluation(
  input: EvaluationInput,
): Promise<InvestEvaluation> {
  const { data, error } = await supabase
    .from('invest_evaluations')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEvaluationReview(
  id: string,
  reviewNote: string,
): Promise<void> {
  const { error } = await supabase
    .from('invest_evaluations')
    .update({ review_note: reviewNote, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}