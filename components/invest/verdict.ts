import { AnswerSnapshot, InvestCriterion, InvestTemplate, Verdict } from '@/types/invest';
import { SCALE_MAX, SCALE_MIN, SCALE_REQUIRED_PASS } from './constants';

/** 기준 항목과 응답값을 합쳐 평가 시점의 스냅샷으로 얼린다 */
export function toSnapshot(
  criterion: InvestCriterion,
  value: AnswerSnapshot['value'],
): AnswerSnapshot {
  return {
    criterion_id: criterion.id,
    category: criterion.category,
    label: criterion.label,
    kind: criterion.kind,
    weight: criterion.weight,
    is_required: criterion.is_required,
    number_op: criterion.number_op,
    number_target: criterion.number_target,
    unit: criterion.unit,
    value,
  };
}

/** 수치 항목이 기준을 만족하는지 */
function meetsNumberTarget(answer: AnswerSnapshot): boolean {
  if (typeof answer.value !== 'number' || answer.number_target === null) return false;
  return answer.number_op === 'lte'
    ? answer.value <= answer.number_target
    : answer.value >= answer.number_target;
}

/** 한 항목의 충족 비율 (0 ~ 1) */
export function answerRatio(answer: AnswerSnapshot): number {
  if (answer.value === null) return 0;

  switch (answer.kind) {
    case 'bool':
      return answer.value === true ? 1 : 0;
    case 'number':
      return meetsNumberTarget(answer) ? 1 : 0;
    case 'scale': {
      if (typeof answer.value !== 'number') return 0;
      const clamped = Math.min(Math.max(answer.value, SCALE_MIN), SCALE_MAX);
      return (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
    }
  }
}

/** 필수 항목 기준으로 통과했는지 */
export function passesRequired(answer: AnswerSnapshot): boolean {
  if (answer.kind === 'scale') {
    return typeof answer.value === 'number' && answer.value >= SCALE_REQUIRED_PASS;
  }
  return answerRatio(answer) === 1;
}

export function isComplete(answers: AnswerSnapshot[]): boolean {
  return answers.length > 0 && answers.every((answer) => answer.value !== null);
}

export interface EvaluationResult {
  score: number;
  verdict: Verdict;
  required_failed: boolean;
}

type Thresholds = Pick<InvestTemplate, 'buy_threshold' | 'watch_threshold'>;

/** 점수(0~100)와 판정. 필수 항목이 하나라도 미달이면 점수와 관계없이 보류 */
export function evaluate(answers: AnswerSnapshot[], thresholds: Thresholds): EvaluationResult {
  const totalWeight = answers.reduce((sum, answer) => sum + answer.weight, 0);
  const gained = answers.reduce((sum, answer) => sum + answer.weight * answerRatio(answer), 0);
  const score = totalWeight === 0 ? 0 : Math.round((gained / totalWeight) * 100);

  const required_failed = answers.some(
    (answer) => answer.is_required && !passesRequired(answer),
  );

  let verdict: Verdict = 'hold';
  if (!required_failed && score >= thresholds.buy_threshold) verdict = 'buy';
  else if (!required_failed && score >= thresholds.watch_threshold) verdict = 'watch';

  return { score, verdict, required_failed };
}

export interface CategoryRatio {
  category: string;
  ratio: number;
}

/** 카테고리별 충족도 (처음 나온 순서 유지) */
export function categoryBreakdown(answers: AnswerSnapshot[]): CategoryRatio[] {
  const order: string[] = [];
  const totals = new Map<string, { weight: number; gained: number }>();

  for (const answer of answers) {
    if (!totals.has(answer.category)) {
      order.push(answer.category);
      totals.set(answer.category, { weight: 0, gained: 0 });
    }
    const entry = totals.get(answer.category);
    if (entry) {
      entry.weight += answer.weight;
      entry.gained += answer.weight * answerRatio(answer);
    }
  }

  return order.map((category) => {
    const entry = totals.get(category);
    const ratio = entry && entry.weight > 0 ? entry.gained / entry.weight : 0;
    return { category, ratio };
  });
}