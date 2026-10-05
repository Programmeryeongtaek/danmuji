import { useUpdateStockNextReview } from '@/entities/invest/hooks';
import { InvestStock } from '@/types/invest';
import { useState } from 'react';
import { defaultNextReviewDate, formatDay } from './review';

const SECONDARY_BUTTON =
  'inline-flex min-h-11 items-center rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900';

interface NextReviewControlProps {
  stock: InvestStock;
}

export function NextReviewControl({ stock }: NextReviewControlProps) {
  const updateNextReview = useUpdateStockNextReview();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(stock.next_review_at ?? '');
  const [error, setError] = useState<string | null>(null);

  async function save(nextReviewAt: string | null) {
    setError(null);
    try {
      await updateNextReview.mutateAsync({ id: stock.id, nextReviewAt });
      setIsEditing(false);
    } catch {
      setError('점검일을 저장하지 못했어요.');
    }
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => {
          setValue(stock.next_review_at ?? defaultNextReviewDate());
          setIsEditing(true);
        }}
        className={SECONDARY_BUTTON}
      >
        {stock.next_review_at
          ? `다음 점검 ${formatDay(stock.next_review_at)}`
          : '다음 점검일 정하기'}
      </button>
    );
  }

  const isSaving = updateNextReview.isPending;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={`next-review-${stock.id}`} className="sr-only">
        다음 점검일
      </label>
      <input
        id={`next-review-${stock.id}`}
        type="date"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
      />
      <button
        type="button"
        onClick={() => save(value || null)}
        disabled={!value || isSaving}
        className="inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:bg-neutral-100 dark:text-neutral-900"
      >
        저장
      </button>
      {stock.next_review_at && (
        <button
          type="button"
          onClick={() => save(null)}
          disabled={isSaving}
          className={SECONDARY_BUTTON}
        >
          지우기
        </button>
      )}
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        disabled={isSaving}
        className={SECONDARY_BUTTON}
      >
        취소
      </button>
      {error && (
        <p
          role="alert"
          className="w-full text-sm text-amber-800 dark:text-amber-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}
