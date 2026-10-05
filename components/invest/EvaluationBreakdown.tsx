import { AnswerSnapshot } from '@/types/invest';
import { AnswerCell } from './AnswerCell';

interface EvaluationBreakdownProps {
  answers: AnswerSnapshot[];
}

export function EvaluationBreakdown({ answers }: EvaluationBreakdownProps) {
  return (
    <div className="flex flex-col">
      {answers.map((answer, index) => {
        const showHeading =
          index === 0 || answers[index - 1].category !== answer.category;
        return (
          <div key={answer.criterion_id}>
            {showHeading && (
              <h4 className="pb-1 pt-3 text-xs font-semibold tracking-wide text-neutral-500">
                {answer.category}
              </h4>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 py-2.5 text-sm dark:border-neutral-800">
              <span className="inline-flex flex-wrap items-center gap-2 text-neutral-900 dark:text-neutral-100">
                {answer.label}
                {answer.is_required && (
                  <span className="rounded border border-amber-800 px-1 text-xs text-amber-800 dark:border-amber-400 dark:text-amber-300">
                    필수
                  </span>
                )}
              </span>
              <AnswerCell answer={answer} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
