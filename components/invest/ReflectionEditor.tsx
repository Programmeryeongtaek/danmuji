import { useUpdateEvaluationReview } from '@/entities/invest/hooks';
import { InvestEvaluation } from '@/types/invest';
import { useState } from 'react';
import { formatDate } from './firnat';

interface ReflectionEditorProps {
  evaluation: InvestEvaluation;
}

export function ReflectionEditor({ evaluation }: ReflectionEditorProps) {
  const updateReview = useUpdateEvaluationReview();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(evaluation.review_note ?? '');
  const [error, setError] = useState<string | null>(null);
  const textareaId = `reflection-${evaluation.id}`;

  function startEditing() {
    setDraft(evaluation.review_note ?? '');
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    const note = draft.trim();
    if (!note) return;
    setError(null);
    try {
      await updateReview.mutateAsync({ id: evaluation.id, reviewNote: note });
      setIsEditing(false);
    } catch {
      setError('돌아보기를 저장하지 못했어요.');
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold text-neutral-500"
        >
          돌아보기
        </label>
        <textarea
          id={textareaId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="그때의 판단을 지금 돌아보면 어떤가요?"
          className="resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm leading-7 text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        {error && (
          <p
            role="alert"
            className="text-sm text-amber-800 dark:text-amber-300"
          >
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!draft.trim() || updateReview.isPending}
            className="min-h-10 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:bg-neutral-100 dark:text-neutral-900"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={updateReview.isPending}
            className="min-h-10 rounded-lg px-4 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  if (!evaluation.review_note) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="min-h-10 self-start rounded-lg border border-dashed border-amber-400 px-3 text-sm text-amber-800 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950"
      >
        돌아보기 쓰기
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-neutral-500">
          돌아보기
          {evaluation.reviewed_at && ` · ${formatDate(evaluation.reviewed_at)}`}
        </span>
        <button
          type="button"
          onClick={startEditing}
          className="min-h-8 rounded px-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          고치기
        </button>
      </div>
      <p className="text-sm leading-7 text-neutral-800 dark:text-neutral-200">
        {evaluation.review_note}
      </p>
    </div>
  );
}
