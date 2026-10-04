export type CriterionKind = 'bool' | 'number' | 'scale';
export type NumberOp = 'gte' | 'lte';
export type Verdict = 'buy' | 'watch' | 'hold';

export interface InvestTemplate {
  id: string;
  user_id: string | null;
  name: string;
  motto: string | null;
  version: number;
  buy_threshold: number;
  watch_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface InvestCriterion {
  id: string;
  template_id: string;
  category: string;
  label: string;
  kind: CriterionKind;
  weight: number;
  is_required: boolean;
  number_op: NumberOp | null;
  number_target: number | null;
  unit: string | null;
  sort_order: number;
  created_at: string;
}

export interface InvestTemplateVersion {
  id: string;
  template_id: string;
  version: number;
  reason: string | null;
  created_at: string;
}

export interface InvestStock {
  id: string;
  user_id: string | null;
  name: string;
  ticker: string | null;
  market: string | null;
  next_review_at: string | null;
  created_at: string;
}

/** 평가 시점의 기준 항목과 응답을 함께 얼려둔 스냅샷 */
export interface AnswerSnapshot {
  criterion_id: string;
  category: string;
  label: string;
  kind: CriterionKind;
  weight: number;
  is_required: boolean;
  number_op: NumberOp | null;
  number_target: number | null;
  unit: string | null;
  value: boolean | number | null;
}

export interface InvestEvaluation {
  id: string;
  user_id: string | null;
  stock_id: string;
  template_id: string | null;
  template_version: number;
  evaluated_at: string;
  answers: AnswerSnapshot[];
  score: number;
  verdict: Verdict;
  required_failed: boolean;
  reason: string | null;
  review_note: string | null;
  reviewed_at: string | null;
}