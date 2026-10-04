import { InvestCriterion } from '@/types/invest';
import { CompareColumn } from './compare';
import { Fragment } from 'react/jsx-runtime';
import { AnswerCell } from './AnswerCell';
import Link from 'next/link';
import { VerdictBadge } from './VerdictBadge';
import { formatDate } from './firnat';

interface CompareTableProps {
  criteria: InvestCriterion[];
  columns: CompareColumn[];
}

export function CompareTable({ criteria, columns }: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-48 bg-neutral-50 px-4 py-4 text-left align-bottom text-xs font-medium text-neutral-500 dark:bg-neutral-950"
            >
              기준 (가중치)
            </th>
            {columns.map((column) => (
              <th
                key={column.stock.id}
                scope="col"
                className="min-w-36 px-4 py-4 text-left align-top font-normal"
              >
                <ColumnHeader column={column} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion, index) => {
            const showGroup =
              index === 0 ||
              criteria[index - 1].category !== criterion.category;
            return (
              <Fragment key={criterion.id}>
                {showGroup && (
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={columns.length + 1}
                      className="px-4 pb-1 pt-4 text-left text-xs font-semibold tracking-wide text-neutral-500"
                    >
                      {criterion.category}
                    </th>
                  </tr>
                )}
                <tr className="border-t border-neutral-100 dark:border-neutral-800">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-normal text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  >
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                      {criterion.label}
                      <span className="text-neutral-500">
                        ({criterion.weight})
                      </span>
                      {criterion.is_required && (
                        <span className="rounded border border-amber-800 px-1 text-xs text-amber-800 dark:border-amber-400 dark:text-amber-300">
                          필수
                        </span>
                      )}
                    </span>
                  </th>
                  {columns.map((column) => (
                    <td key={column.stock.id} className="px-4 py-3">
                      <AnswerCell answer={column.answers.get(criterion.id)} />
                    </td>
                  ))}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ColumnHeader({ column }: { column: CompareColumn }) {
  const { stock, evaluation, isOutdated } = column;

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/invest/${stock.id}`}
        className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-amber-700 dark:text-neutral-100 dark:decoration-neutral-600"
      >
        {stock.name}
      </Link>
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={`font-serif text-2xl font-bold ${
            evaluation.required_failed
              ? 'text-neutral-400'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {evaluation.score}
        </span>
        <VerdictBadge verdict={evaluation.verdict} />
      </div>
      <span className="text-xs text-neutral-500">
        {formatDate(evaluation.evaluated_at)}
        {evaluation.required_failed && ' · 필수 미달'}
      </span>
      {isOutdated && (
        <Link
          href={`/invest/new?stockId=${stock.id}`}
          className="text-xs text-amber-800 hover:text-amber-900 dark:text-amber-300"
        >
          이전 기준 · 다시 평가
        </Link>
      )}
    </div>
  );
}
