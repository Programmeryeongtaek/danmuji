'use client';

import {
  useInvestStock,
  useInvestTemplate,
  useStockEvaluations,
} from '@/entities/invest/hooks';
import Link from 'next/link';
import { categoryBreakdown, passesRequired } from './verdict';
import { answerChanges, formatScoreDelta } from './history';
import { formatDate } from './firnat';
import { ScoreTrend } from './ScoreTrend';
import { VerdictBadge } from './VerdictBadge';
import { EvaluationBreakdown } from './EvaluationBreakdown';
import { EvaluationTimeline } from './EvalutaionTimeline';

const CARD_CLASS =
  'rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900';

interface StockDetailProps {
  stockId: string;
}

export function StockDetail({ stockId }: StockDetailProps) {
  const stockQuery = useInvestStock(stockId);
  const evaluationsQuery = useStockEvaluations(stockId);
  const templateQuery = useInvestTemplate();

  if (stockQuery.isPending || evaluationsQuery.isPending) {
    return <p className="text-sm text-neutral-500">불러오는 중…</p>;
  }
  if (stockQuery.isError || evaluationsQuery.isError || !stockQuery.data) {
    return <p className="text-sm text-neutral-500">종목을 찾을 수 없어요.</p>;
  }

  const stock = stockQuery.data;
  const evaluations = evaluationsQuery.data ?? [];
  const latest = evaluations[0];
  const reEvaluateHref = `/invest/new?stockId=${stock.id}`;

  if (!latest) {
    return (
      <div className="flex flex-col items-start gap-3">
        <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {stock.name}
        </h1>
        <p className="text-sm text-neutral-500">아직 평가가 없어요.</p>
        <Link
          href={reEvaluateHref}
          className="text-sm font-semibold text-amber-800 dark:text-amber-300"
        >
          평가하기
        </Link>
      </div>
    );
  }

  const first = evaluations[evaluations.length - 1];
  const template = templateQuery.data ?? null;
  const isOutdated =
    template !== null && latest.template_version < template.version;
  const breakdown = categoryBreakdown(latest.answers);
  const requiredAnswers = latest.answers.filter((answer) => answer.is_required);
  const requiredPassed = requiredAnswers.filter(passesRequired).length;
  const changes = answerChanges(latest, evaluations[1]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-neutral-200 pb-7 dark:border-neutral-800">
        <div className="flex flex-col gap-2.5">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {stock.name}
            {stock.ticker && (
              <span className="ml-3 font-sans text-base font-normal text-neutral-500">
                {stock.ticker}
              </span>
            )}
          </h1>
          <p className="text-sm text-neutral-500">
            평가 {evaluations.length}회 · 첫 평가{' '}
            {formatDate(first.evaluated_at)}
          </p>
          {isOutdated && template && (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              기준표가 v{template.version}로 바뀌었어요. 지금 기준으로 다시
              평가해 보세요.
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-2">
            <Link
              href={reEvaluateHref}
              className="inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              다시 평가하기
            </Link>
          </div>
        </div>

        <div className="flex items-end gap-8">
          <ScoreTrend evaluations={evaluations} />
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-baseline gap-1">
              <span
                className={`font-serif text-6xl font-bold leading-none ${
                  latest.required_failed
                    ? 'text-neutral-400'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {latest.score}
              </span>
              <span className="text-base text-neutral-500">/ 100</span>
            </div>
            <VerdictBadge verdict={latest.verdict} size="md" />
          </div>
        </div>
      </header>

      <section aria-labelledby="latest-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="latest-heading"
            className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            최근 평가
          </h2>
          <span className="text-sm text-neutral-500">
            {formatDate(latest.evaluated_at)} ·{' '}
            {formatScoreDelta(latest.score, evaluations[1]?.score)}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
          <div className={`${CARD_CLASS} lg:col-span-2`}>
            <EvaluationBreakdown answers={latest.answers} />
          </div>

          <aside className={`${CARD_CLASS} flex flex-col gap-5`}>
            <div className="flex flex-col gap-2.5">
              {breakdown.map(({ category, ratio }) => (
                <div key={category} className="flex items-center gap-3 text-sm">
                  <span className="w-16 shrink-0 truncate text-neutral-700 dark:text-neutral-300">
                    {category}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-1.5 rounded-full bg-amber-800 dark:bg-amber-500"
                      style={{ width: `${Math.round(ratio * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-neutral-500">
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
              ))}
            </div>

            {requiredAnswers.length > 0 && (
              <p className="text-sm text-neutral-500">
                필수 {requiredPassed}/{requiredAnswers.length} 충족
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

            <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-500">
                판단 근거
              </span>
              <p className="font-serif text-base leading-8 text-neutral-800 dark:text-neutral-200">
                {latest.reason ?? '근거를 남기지 않았어요.'}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section
        aria-labelledby="history-heading"
        className="flex flex-col gap-5"
      >
        <h2
          id="history-heading"
          className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100"
        >
          판단 기록
        </h2>
        <EvaluationTimeline evaluations={evaluations} />
      </section>
    </div>
  );
}
