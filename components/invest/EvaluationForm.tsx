'use client';

import {
  AnswerSnapshot,
  InvestCriterion,
  InvestStock,
  InvestTemplate,
} from '@/types/invest';
import {
  answerRatio,
  categoryBreakdown,
  evaluate,
  isComplete,
  passesRequired,
  toSnapshot,
} from './verdict';
import { Check, X } from 'lucide-react';
import {
  useCreateEvaluation,
  useCreateStock,
  useInvestCriteria,
  useInvestStocks,
  useInvestTemplate,
  useStockEvaluations,
} from '@/entities/invest/hooks';
import Link from 'next/link';
import { initialRawAnswers, RawAnswer, toAnswerValue } from './answerDraft';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { StockChoice, StockPicker } from './StockPicker';
import { formatDate } from './firnat';
import { KIND_LABEL } from './constants';
import { AnswerInput } from './AnswerInput';
import { EvaluationSummary } from './EvaluationSummary';

/* ───────── 데이터 불러오기 ───────── */

interface EvaluationFormProps {
  stockId: string | null;
}

export function EvaluationForm({ stockId }: EvaluationFormProps) {
  const templateQuery = useInvestTemplate();
  const template = templateQuery.data ?? null;
  const criteriaQuery = useInvestCriteria(template?.id);
  const stocksQuery = useInvestStocks();
  const evaluationsQuery = useStockEvaluations(stockId);

  const isLoading =
    templateQuery.isPending ||
    stocksQuery.isPending ||
    (template !== null && criteriaQuery.isPending) ||
    (stockId !== null && evaluationsQuery.isPending);

  if (isLoading)
    return <p className="text-sm text-neutral-500">불러오는 중…</p>;
  if (templateQuery.isError || criteriaQuery.isError || stocksQuery.isError) {
    return (
      <p className="text-sm text-neutral-500">
        평가에 필요한 정보를 불러오지 못했어요.
      </p>
    );
  }

  const criteria = criteriaQuery.data ?? [];
  if (!template || criteria.length === 0) {
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        먼저 기준표에 항목을 만들어 주세요.{' '}
        <Link
          href="/invest/template"
          className="font-semibold text-amber-800 dark:text-amber-300"
        >
          기준표로 가기
        </Link>
      </p>
    );
  }

  const stocks = stocksQuery.data ?? [];
  const fixedStock = stockId
    ? (stocks.find((stock) => stock.id === stockId) ?? null)
    : null;
  if (stockId && !fixedStock) {
    return <p className="text-sm text-neutral-500">종목을 찾을 수 없어요.</p>;
  }

  return (
    <EvaluationFormBody
      key={`${template.id}-${template.version}-${stockId ?? 'new'}`}
      template={template}
      criteria={criteria}
      stocks={stocks}
      fixedStock={fixedStock}
      initialValues={initialRawAnswers(criteria, evaluationsQuery.data?.[0])}
    />
  );
}

/* ───────── 평가 화면 본체 ───────── */

interface EvaluationFormBodyProps {
  template: InvestTemplate;
  criteria: InvestCriterion[];
  stocks: InvestStock[];
  fixedStock: InvestStock | null;
  initialValues: Record<string, RawAnswer>;
}

function EvaluationFormBody({
  template,
  criteria,
  stocks,
  fixedStock,
  initialValues,
}: EvaluationFormBodyProps) {
  const router = useRouter();
  const createStock = useCreateStock();
  const createEvaluation = useCreateEvaluation();

  const [values, setValues] =
    useState<Record<string, RawAnswer>>(initialValues);
  const [choice, setChoice] = useState<StockChoice>(() =>
    fixedStock
      ? { mode: 'existing', stockId: fixedStock.id }
      : stocks.length > 0
        ? { mode: 'existing', stockId: '' }
        : { mode: 'new', name: '', ticker: '' },
  );
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapshots = useMemo<AnswerSnapshot[]>(
    () =>
      criteria.map((criterion) =>
        toSnapshot(
          criterion,
          toAnswerValue(criterion, values[criterion.id] ?? null),
        ),
      ),
    [criteria, values],
  );
  const result = evaluate(snapshots, template);
  const breakdown = categoryBreakdown(snapshots);
  const remaining = snapshots.filter(
    (snapshot) => snapshot.value === null,
  ).length;
  const requiredTotal = snapshots.filter(
    (snapshot) => snapshot.is_required,
  ).length;
  const requiredPassed = snapshots.filter(
    (snapshot) => snapshot.is_required && passesRequired(snapshot),
  ).length;

  const stockReady =
    choice.mode === 'existing'
      ? choice.stockId !== ''
      : choice.name.trim() !== '';
  const canSave = isComplete(snapshots) && stockReady && !isSaving;

  async function handleSave() {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    try {
      let targetId: string;
      if (choice.mode === 'existing') {
        targetId = choice.stockId;
      } else {
        const created = await createStock.mutateAsync({
          name: choice.name.trim(),
          ticker: choice.ticker.trim() || null,
          market: null,
        });
        targetId = created.id;
      }

      await createEvaluation.mutateAsync({
        stock_id: targetId,
        template_id: template.id,
        template_version: template.version,
        answers: snapshots,
        score: result.score,
        verdict: result.verdict,
        required_failed: result.required_failed,
        reason: reason.trim() || null,
      });
      router.push(`/invest/${targetId}`);
    } catch {
      setError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-neutral-500">
          {fixedStock ? '다시 평가' : '새 평가'} ·{' '}
          {formatDate(new Date().toISOString())}
        </p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {fixedStock ? fixedStock.name : '종목 평가'}
        </h1>
        <p className="text-sm text-neutral-500">
          기준표 「{template.name}」 v{template.version}
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {!fixedStock && (
            <StockPicker stocks={stocks} choice={choice} onChange={setChoice} />
          )}

          <section aria-label="기준 항목" className="flex flex-col">
            {criteria.map((criterion, index) => {
              const snapshot = snapshots[index];
              const showHeading =
                index === 0 ||
                criteria[index - 1].category !== criterion.category;
              return (
                <div key={criterion.id}>
                  {showHeading && (
                    <h2 className="pb-2 pt-5 text-xs font-semibold tracking-wide text-neutral-500">
                      {criterion.category}
                    </h2>
                  )}
                  <div className="flex flex-wrap items-center gap-4 border-t border-neutral-200 py-3.5 dark:border-neutral-800">
                    <div className="flex min-w-0 flex-1 basis-64 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {criterion.label}
                        </span>
                        {criterion.is_required && (
                          <span className="rounded border border-amber-800 px-1.5 text-xs text-amber-800 dark:border-amber-400 dark:text-amber-300">
                            필수
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500">
                        {KIND_LABEL[criterion.kind]} · 가중치 {criterion.weight}
                      </span>
                    </div>
                    <AnswerInput
                      criterion={criterion}
                      value={values[criterion.id] ?? null}
                      onChange={(value) =>
                        setValues((prev) => ({
                          ...prev,
                          [criterion.id]: value,
                        }))
                      }
                    />
                    <ResultMark snapshot={snapshot} />
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <EvaluationSummary
          result={result}
          breakdown={breakdown}
          buyThreshold={template.buy_threshold}
          watchThreshold={template.watch_threshold}
          remaining={remaining}
          requiredTotal={requiredTotal}
          requiredPassed={requiredPassed}
          reason={reason}
          onReasonChange={setReason}
          onSave={handleSave}
          canSave={canSave}
          isSaving={isSaving}
          error={error}
        />
      </div>
    </div>
  );
}

/* ───────── 항목별 충족 표시 ───────── */

function ResultMark({ snapshot }: { snapshot: AnswerSnapshot }) {
  if (snapshot.value === null)
    return <span className="w-10" aria-hidden="true" />;

  const ratio = answerRatio(snapshot);
  if (snapshot.kind === 'scale') {
    return (
      <span className="w-10 text-right text-xs font-semibold text-amber-800 dark:text-amber-300">
        {Math.round(ratio * 100)}%
      </span>
    );
  }
  return (
    <span className="flex w-10 justify-end">
      {ratio === 1 ? (
        <Check
          aria-label="충족"
          className="h-5 w-5 text-amber-800 dark:text-amber-400"
        />
      ) : (
        <X aria-label="미달" className="h-5 w-5 text-neutral-400" />
      )}
    </span>
  );
}
