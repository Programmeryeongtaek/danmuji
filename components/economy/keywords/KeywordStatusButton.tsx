'use client';

import { useUpdateKeyword } from '@/entities/keyword/hooks';
import { Keyword, KeywordStatus } from '@/types/keyword';

export function KeywordStatusButtons({ keyword }: { keyword: Keyword }) {
  const updateKeyword = useUpdateKeyword(keyword.id);

  function handleClick(target: KeywordStatus, e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    const nextStatus = keyword.status === target ? 'new' : target;
    updateKeyword.mutate({
      status: nextStatus,
      review_marked_at:
        nextStatus === 'review' ? new Date().toISOString() : null,
    });
  }

  return (
    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => handleClick('review', e)}
        disabled={updateKeyword.isPending}
        className={`text-xs px-2.5 py-1 rounded-lg ${
          keyword.status === 'review'
            ? 'bg-amber-50 text-amber-700'
            : 'text-neutral-400'
        }`}
      >
        복습필요
      </button>
      <button
        onClick={(e) => handleClick('done', e)}
        disabled={updateKeyword.isPending}
        className={`text-xs px-2.5 py-1 rounded-lg ${
          keyword.status === 'done'
            ? 'bg-amber-50 text-amber-700'
            : 'text-neutral-400'
        }`}
      >
        완료
      </button>
    </div>
  );
}
