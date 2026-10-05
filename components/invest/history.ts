import { AnswerSnapshot, InvestEvaluation } from '@/types/invest';

function formatValue(answer: AnswerSnapshot): string {
  if (answer.value === null) return '—';
  if (answer.kind === 'bool') return answer.value ? '예' : '아니오';
  return `${answer.value}${answer.unit ?? ''}`;
}

/** 직전 평가와 비교해 응답이 바뀐 항목을 '해자 3 → 4' 형태로 */
export function answerChanges(
  current: InvestEvaluation,
  previous: InvestEvaluation | undefined,
): string[] {
  if (!previous) return [];
  const previousById = new Map(previous.answers.map((answer) => [answer.criterion_id, answer]));

  return current.answers.flatMap((answer) => {
    const before = previousById.get(answer.criterion_id);
    if (!before || before.kind !== answer.kind || before.value === answer.value) return [];
    return [`${answer.label} ${formatValue(before)} → ${formatValue(answer)}`];
  });
}

export function formatScoreDelta(current: number, previous: number | undefined): string {
  if (previous === undefined) return '첫 평가';
  const delta = current - previous;
  if (delta === 0) return '지난번과 같음';
  return `지난번보다 ${delta > 0 ? '+' : ''}${delta}`;
}