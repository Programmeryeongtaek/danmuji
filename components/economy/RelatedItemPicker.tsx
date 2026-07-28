'use client';

import {
  useCreateLink,
  useRelatedItems,
} from '@/entities/economy/relatedLinks/hooks';
import { useKeywords } from '@/entities/keyword/hooks';
import { RelatedItemType } from '@/types/book';
import { Keyword } from '@/types/keyword';
import { useMemo, useState } from 'react';

export function RelatedItemPicker({
  itemType,
  itemId,
  currentText,
  onLinkCreated,
}: {
  itemType: RelatedItemType;
  itemId: string;
  currentText: string;
  onLinkCreated?: () => void;
}) {
  const [query, setQuery] = useState('');
  const { data: allKeywords } = useKeywords();
  const { data: related } = useRelatedItems(itemId);
  const createLink = useCreateLink(itemId);

  const linkedIds = useMemo(
    () => new Set((related ?? []).map((r) => r.id)),
    [related],
  );

  const candidates: Keyword[] = useMemo(() => {
    if (!allKeywords) return [];
    const pool = allKeywords.filter(
      (k) => k.id !== itemId && !linkedIds.has(k.id),
    );

    if (query.trim() === '') {
      return pool.filter((k) => currentText.includes(k.term));
    }
    return pool.filter((k) => k.term.includes(query));
  }, [allKeywords, itemId, linkedIds, query, currentText]);

  const isAutoSuggested = query.trim() === '';

  async function handleAdd(keyword: Keyword) {
    await createLink.mutateAsync({
      sourceType: itemType,
      sourceId: itemId,
      targetType: 'keyword',
      targetId: keyword.id,
    });
    onLinkCreated?.();
  }

  return (
    <div className="border border-neutral-200 rounded-xl p-3 mt-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="개념 검색..."
        className="w-full text-sm outline-none mb-2 bg-transparent"
      />
      <div className="border-t border-neutral-100 pt-2">
        {isAutoSuggested && candidates.length > 0 && (
          <p className="text-xs text-neutral-400 mb-1.5">
            이 설명에서 발견된 개념
          </p>
        )}
        {candidates.length === 0 && (
          <p className="text-xs text-neutral-300">
            {isAutoSuggested
              ? '연결할 만한 개념을 찾지 못했습니다.'
              : '검색 결과가 없습니다.'}
          </p>
        )}
        {candidates.map((k) => (
          <div key={k.id} className="flex justify-between items-center py-1">
            <span className="text-sm">{k.term}</span>
            <button
              type="button"
              onClick={() => handleAdd(k)}
              disabled={createLink.isPending}
              className="text-xs text-amber-700"
            >
              + 추가
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
