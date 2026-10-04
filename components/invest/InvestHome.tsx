'use client';

import { useState } from 'react';
import { buildColumns, countByVerdict, VerdictFilterValue } from './compare';
import {
  useInvestCriteria,
  useInvestEvaluations,
  useInvestStocks,
  useInvestTemplate,
} from '@/entities/invest/hooks';
import Link from 'next/link';
import { VerdictFilter } from './VerdictFilter';
import { CompareTable } from './CompareTable';

export function InvestHome() {
  const [filter, setFilter] = useState<VerdictFilterValue>('all');

  const templateQuery = useInvestTemplate();
  const template = templateQuery.data ?? null;
  const criteriaQuery = useInvestCriteria(template?.id);
  const stocksQuery = useInvestStocks();
  const evaluationsQuery = useInvestEvaluations();

  const isLoading =
    templateQuery.isPending ||
    stocksQuery.isPending ||
    evaluationsQuery.isPending ||
    (template !== null && criteriaQuery.isPending);
  const isError =
    templateQuery.isError ||
    criteriaQuery.isError ||
    stocksQuery.isError ||
    evaluationsQuery.isError;

  const columns = buildColumns(
    stocksQuery.data ?? [],
    evaluationsQuery.data ?? [],
    template?.version ?? 1,
  );
  const visibleColumns =
    filter === 'all'
      ? columns
      : columns.filter((column) => column.evaluation.verdict === filter);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            투자
          </h1>
          {template?.motto && (
            <p className="font-serif text-base text-neutral-700 dark:text-neutral-300">
              “{template.motto}”
              <span className="ml-2 font-sans text-sm text-neutral-500">
                — {template.name} v{template.version}
              </span>
            </p>
          )}
        </div>
        <Link
          href="/invest/new"
          className="inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          새 종목 평가
        </Link>
      </header>

      {isLoading && <p className="text-sm text-neutral-500">불러오는 중…</p>}
      {isError && (
        <p className="text-sm text-neutral-500">
          종목 정보를 불러오지 못했어요.
        </p>
      )}

      {!isLoading && !isError && columns.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 dark:border-neutral-700">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            아직 평가한 종목이 없어요. 기준표를 정리한 뒤 첫 종목을 평가해
            보세요.
          </p>
          <Link
            href="/invest/template"
            className="text-sm font-semibold text-amber-800 hover:text-amber-900 dark:text-amber-300"
          >
            기준표 보기
          </Link>
        </div>
      )}

      {!isLoading && !isError && columns.length > 0 && (
        <>
          <VerdictFilter
            value={filter}
            counts={countByVerdict(columns)}
            onChange={setFilter}
          />
          {visibleColumns.length === 0 ? (
            <p className="text-sm text-neutral-500">
              이 판정에 해당하는 종목이 없어요.
            </p>
          ) : (
            <CompareTable
              criteria={criteriaQuery.data ?? []}
              columns={visibleColumns}
            />
          )}
          <p className="text-xs text-neutral-500">
            각 열은 종목의 가장 최근 평가입니다. 종목 이름을 누르면 상세
            페이지로 이동합니다.
          </p>
        </>
      )}
    </div>
  );
}
