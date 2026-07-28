'use client';

import { useKeyword } from '@/entities/keyword/hooks';

export function RelatedKeywordModal({
  keywordId,
  onClose,
}: {
  keywordId: string | null;
  onClose: () => void;
}) {
  const { data: keyword, isLoading } = useKeyword(keywordId ?? '');

  if (!keywordId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-95 h-70 flex flex-col p-5">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-xs text-neutral-400">
            닫기
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="text-sm text-neutral-400">불러오는 중...</p>
          )}
          {keyword && (
            <>
              <p className="font-serif text-lg mb-3">{keyword.term}</p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {keyword.definition}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
