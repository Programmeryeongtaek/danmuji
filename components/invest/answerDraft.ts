import { AnswerSnapshot, InvestCriterion, InvestEvaluation } from '@/types/invest';

/** 입력 중인 응답. 수치 항목은 입력 칸 그대로의 문자열 */
export type RawAnswer = boolean | number | string | null;

export function toAnswerValue(
  criterion: InvestCriterion,
  raw: RawAnswer,
): AnswerSnapshot['value'] {
  if (raw === null) return null;

  if (criterion.kind === 'number') {
    if (typeof raw === 'number') return raw;
    if (typeof raw !== 'string' || raw.trim() === '') return null;
    const parsed = Number(raw.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return typeof raw === 'string' ? null : raw;
}

/** 다시 평가할 때 지난 응답으로 미리 채운다 (유형이 바뀐 항목은 비워둠) */
export function initialRawAnswers(
  criteria: InvestCriterion[],
  latest: InvestEvaluation | undefined,
): Record<string, RawAnswer> {
  const previous = new Map(
    (latest?.answers ?? []).map((answer) => [answer.criterion_id, answer]),
  );
  const result: Record<string, RawAnswer> = {};

  for (const criterion of criteria) {
    const answer = previous.get(criterion.id);
    if (!answer || answer.kind !== criterion.kind || answer.value === null) {
      result[criterion.id] = null;
    } else {
      result[criterion.id] =
        criterion.kind === 'number' ? String(answer.value) : answer.value;
    }
  }
  return result;
}