'use client';

import { useKeyword, useUpdateKeyword } from '@/entities/keyword/hooks';
import { KeywordStatusButtons } from './keywords/KeywordStatusButton';

export function RelatedKeywordModal({
  keywordId,
  onClose,
  showStatusControls = false,
}: {
  keywordId: string | null;
  onClose: () => void;
  showStatusControls?: boolean;
}) {
  const { data: keyword, isLoading } = useKeyword(keywordId ?? '');
  const updateKeyword = useUpdateKeyword(keywordId ?? '');

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

        {showStatusControls && keyword && (
          <div className="pt-3 border-t border-neutral-100">
            <KeywordStatusButtons keyword={keyword} />
          </div>
        )}
      </div>
    </div>
  );
}
