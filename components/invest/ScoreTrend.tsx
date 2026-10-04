import { InvestEvaluation } from '@/types/invest';
import { formatDate } from './firnat';

const MAX_BARS = 6;

interface ScoreTrendProps {
  evaluations: InvestEvaluation[];
}

export function ScoreTrend({ evaluations }: ScoreTrendProps) {
  const recent = evaluations.slice(0, MAX_BARS).reverse();
  if (recent.length < 2) return null;

  return (
    <ol aria-label="점수 추이" className="flex items-end gap-3">
      {recent.map((evaluation, index) => {
        const isLatest = index === recent.length - 1;
        return (
          <li
            key={evaluation.id}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex h-16 w-6 items-end">
              <div
                className={`w-full rounded-t ${
                  isLatest
                    ? 'bg-amber-800 dark:bg-amber-500'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
                style={{ height: `${Math.max(evaluation.score, 4)}%` }}
              />
            </div>
            <span
              className={`text-xs ${
                isLatest
                  ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500'
              }`}
            >
              {formatDate(evaluation.evaluated_at).slice(5)}
              <span className="sr-only"> {evaluation.score}점</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
