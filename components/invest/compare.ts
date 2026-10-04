import { AnswerSnapshot, InvestEvaluation, InvestStock, Verdict } from '@/types/invest';

export type VerdictFilterValue = 'all' | Verdict;

export interface CompareColumn {
  stock: InvestStock;
  evaluation: InvestEvaluation;
  /** 지금 기준표보다 이전 버전으로 평가됨 */
  isOutdated: boolean;
  answers: Map<string, AnswerSnapshot>;
}

const VERDICT_ORDER: Record<Verdict, number> = { buy: 0, watch: 1, hold: 2 };

/** 종목마다 가장 최근 평가 하나로 열을 만들고, 판정 → 점수 순으로 정렬 */
export function buildColumns(
  stocks: InvestStock[],
  evaluations: InvestEvaluation[],
  currentVersion: number,
): CompareColumn[] {
  // evaluations는 최신순으로 들어온다 → 처음 만난 것이 그 종목의 최신 평가
  const latest = new Map<string, InvestEvaluation>();
  for (const evaluation of evaluations) {
    if (!latest.has(evaluation.stock_id)) latest.set(evaluation.stock_id, evaluation);
  }

  const columns = stocks.flatMap((stock) => {
    const evaluation = latest.get(stock.id);
    if (!evaluation) return [];
    return [
      {
        stock,
        evaluation,
        isOutdated: evaluation.template_version < currentVersion,
        answers: new Map(evaluation.answers.map((answer) => [answer.criterion_id, answer])),
      },
    ];
  });

  return columns.sort(
    (a, b) =>
      VERDICT_ORDER[a.evaluation.verdict] - VERDICT_ORDER[b.evaluation.verdict] ||
      b.evaluation.score - a.evaluation.score,
  );
}

export function countByVerdict(columns: CompareColumn[]): Record<VerdictFilterValue, number> {
  const counts: Record<VerdictFilterValue, number> = { all: columns.length, buy: 0, watch: 0, hold: 0 };
  for (const column of columns) counts[column.evaluation.verdict] += 1;
  return counts;
}