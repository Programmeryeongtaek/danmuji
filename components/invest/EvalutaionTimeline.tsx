import { InvestEvaluation } from '@/types/invest';
import { useState } from 'react';
import { answerChanges, formatScoreDelta } from './history';
import { formatDate } from './firnat';
import { VerdictBadge } from './VerdictBadge';
import { EvaluationBreakdown } from './EvaluationBreakdown';

interface EvaluationTimelineProps {
  /** 최신순 전체 평가. 첫 번째(최신)는 위에서 따로 보여주므로 두 번째부터 그린다 */
  evaluations: InvestEvaluation[];
}

export function EvaluationTimeline({ evaluations }: EvaluationTimelineProps) {
  const latestVersion = evaluations[0]?.template_version;
  const past = evaluations.slice(1);

  if (past.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        첫 평가예요. 다시 평가할 때마다 이곳에 판단의 기록이 쌓입니다.
      </p>
    );
  }

  return (
    <ol className="flex flex-col">
      {past.map((evaluation, index) => (
        <TimelineEntry
          key={evaluation.id}
          evaluation={evaluation}
          previous={evaluations[index + 2]}
          showVersion={evaluation.template_version !== latestVersion}
          isLast={index === past.length - 1}
        />
      ))}
    </ol>
  );
}

interface TimelineEntryProps {
  evaluation: InvestEvaluation;
  previous: InvestEvaluation | undefined;
  showVersion: boolean;
  isLast: boolean;
}

function TimelineEntry({
  evaluation,
  previous,
  showVersion,
  isLast,
}: TimelineEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const changes = answerChanges(evaluation, previous);
  const panelId = `timeline-${evaluation.id}`;

  return (
    <li className="flex gap-4">
      <div className="hidden w-24 shrink-0 pt-5 text-right text-sm text-neutral-500 sm:block">
        {formatDate(evaluation.evaluated_at)}
      </div>
      <div
        className="flex w-3 shrink-0 flex-col items-center"
        aria-hidden="true"
      >
        <div className="mt-6 h-3 w-3 rounded-full border-2 border-amber-600 bg-white dark:bg-neutral-950" />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      <article className="mb-5 flex min-w-0 flex-1 flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-3">
          <VerdictBadge verdict={evaluation.verdict} />
          <span className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {evaluation.score}
          </span>
          <span className="text-xs text-neutral-500">
            <span className="sm:hidden">
              {formatDate(evaluation.evaluated_at)} ·{' '}
            </span>
            {formatScoreDelta(evaluation.score, previous?.score)}
            {showVersion && ` · 기준표 v${evaluation.template_version}`}
          </span>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto min-h-10 rounded-lg px-2 text-sm text-amber-800 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"
          >
            {isOpen ? '항목 접기' : '항목 펼쳐보기'}
          </button>
        </div>

        {evaluation.reason && (
          <p className="font-serif text-base leading-8 text-neutral-800 dark:text-neutral-200">
            {evaluation.reason}
          </p>
        )}

        {changes.length > 0 && (
          <ul
            aria-label="지난번과 달라진 응답"
            className="flex flex-wrap gap-1.5"
          >
            {changes.map((change) => (
              <li
                key={change}
                className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {change}
              </li>
            ))}
          </ul>
        )}

        {evaluation.review_note && (
          <div className="flex flex-col gap-1.5 rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
            <span className="text-xs font-semibold text-neutral-500">
              돌아보기
              {evaluation.reviewed_at &&
                ` · ${formatDate(evaluation.reviewed_at)}`}
            </span>
            <p className="text-sm leading-7 text-neutral-800 dark:text-neutral-200">
              {evaluation.review_note}
            </p>
          </div>
        )}

        {isOpen && (
          <div id={panelId}>
            <EvaluationBreakdown answers={evaluation.answers} />
          </div>
        )}
      </article>
    </li>
  );
}
