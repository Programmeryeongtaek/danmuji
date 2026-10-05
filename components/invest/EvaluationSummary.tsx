import { CategoryRatio, EvaluationResult } from './verdict';
import { VerdictBadge } from './VerdictBadge';

interface EvaluationSummaryProps {
  result: EvaluationResult;
  breakdown: CategoryRatio[];
  buyThreshold: number;
  watchThreshold: number;
  remaining: number;
  requiredTotal: number;
  requiredPassed: number;
  reason: string;
  onReasonChange: (reason: string) => void;
  onSave: () => void;
  canSave: boolean;
  isSaving: boolean;
  error: string | null;
}

export function EvaluationSummary({
  result,
  breakdown,
  buyThreshold,
  watchThreshold,
  remaining,
  requiredTotal,
  requiredPassed,
  reason,
  onReasonChange,
  onSave,
  canSave,
  isSaving,
  error,
}: EvaluationSummaryProps) {
  return (
    <aside
      aria-label="판정"
      className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 lg:sticky lg:top-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-6xl font-bold leading-none text-neutral-900 dark:text-neutral-100">
          {result.score}
        </span>
        <span className="text-lg text-neutral-500">/ 100</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-2 rounded-full bg-amber-800 dark:bg-amber-500"
            style={{ width: `${result.score}%` }}
          />
          <div
            className="absolute -top-1 h-4 w-0.5 bg-neutral-500"
            style={{ left: `${watchThreshold}%` }}
          />
          <div
            className="absolute -top-1 h-4 w-0.5 bg-neutral-500"
            style={{ left: `${buyThreshold}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500">
          관망 {watchThreshold} · 매수 검토 {buyThreshold}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {remaining === 0 ? (
          <VerdictBadge verdict={result.verdict} size="md" />
        ) : (
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {remaining}개 항목이 남았어요
          </span>
        )}
        {requiredTotal > 0 && (
          <span className="text-sm text-neutral-500">
            필수 {requiredPassed}/{requiredTotal} 충족
          </span>
        )}
      </div>

      {breakdown.length > 0 && (
        <div className="flex flex-col gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
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
      )}

      <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        판단 근거
        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          rows={4}
          placeholder="왜 이렇게 판단했는지 한두 문장으로 남겨 두세요."
          className="resize-y rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 font-normal leading-6 text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-amber-800 dark:text-amber-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className="min-h-12 rounded-xl bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:disabled:bg-neutral-700"
      >
        {isSaving ? '저장 중…' : '평가 기록으로 저장'}
      </button>
      <p className="text-xs leading-5 text-neutral-500">
        이 판정은 내가 정한 기준에 비춘 결과일 뿐, 판단을 대신하지 않습니다.
      </p>
    </aside>
  );
}
