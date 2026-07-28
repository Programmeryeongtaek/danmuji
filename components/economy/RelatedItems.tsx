import { useDeleteLink } from '@/entities/economy/relatedLinks/hooks';
import { RelatedItem } from '@/types/book';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RelatedKeywordModal } from './RelatedKeywordModal';

const TYPE_HREF: Record<RelatedItem['type'], (id: string) => string> = {
  chapter: (id) => `/economy/books/chapters/${id}`,
  keyword: (id) => `/economy/keywords/${id}`,
  news: (id) => `/economy/news/${id}`,
  etf: (id) => `/economy/etf/${id}`,
};

export function RelatedItems({
  itemId,
  items,
  onLinkDeleted,
  openKeywordsInModal = false,
}: {
  itemId: string;
  items: RelatedItem[];
  onLinkDeleted?: () => void;
  openKeywordsInModal?: boolean;
}) {
  const router = useRouter();
  const deleteLink = useDeleteLink(itemId);
  const [managing, setManaging] = useState(false);
  const [modalKeywordId, setModalKeywordId] = useState<string | null>(null);

  if (items.length === 0) return null;

  function handleChipClick(item: RelatedItem) {
    if (managing) return;

    if (openKeywordsInModal && item.type === 'keyword') {
      setModalKeywordId(item.id);
      return;
    }

    router.push(TYPE_HREF[item.type](item.id));
  }

  return (
    <div className="border-t border-neutral-200 pt-4 mt-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-neutral-400">관련 항목</p>
        <button
          onClick={() => setManaging((v) => !v)}
          className="text-xs text-amber-700"
        >
          {managing ? '완료' : '관리'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.linkId}
            onClick={() => handleChipClick(item)}
            className={`flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 pl-3 pr-2 py-1 ${
              managing ? '' : 'cursor-pointer hover:bg-neutral-100'
            }`}
          >
            <span className={`text-sm ${managing ? 'text-neutral-400' : ''}`}>
              {item.title}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (managing) {
                  deleteLink.mutate(item.linkId, {
                    onSuccess: () => onLinkDeleted?.(),
                  });
                }
              }}
              className="w-4 h-4 flex items-center justify-center text-sm text-red-400 cursor-pointer"
              style={{ visibility: managing ? 'visible' : 'hidden' }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      <RelatedKeywordModal
        keywordId={modalKeywordId}
        onClose={() => setModalKeywordId(null)}
      />
    </div>
  );
}
