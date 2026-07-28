'use client';

import { useKeywords } from '@/entities/keyword/hooks';
import { Keyword } from '@/types/keyword';
import { useMemo, useState } from 'react';

export function RelatedConceptDraftPicker({
  currentText,
  selected,
  onAdd,
  onRemove,
}: {
  currentText: string;
  selected: Keyword[];
  onAdd: (keyword: Keyword) => void;
  onRemove: (keywordId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const { data: allKeywords } = useKeywords();

  const selectedIds = useMemo(
    () => new Set(selected.map((k) => k.id)),
    [selected],
  );

  const candidates: Keyword[] = useMemo(() => {
    if (!allKeywords) return [];
    const pool = allKeywords.filter((k) => !selectedIds.has(k.id));

    if (query.trim() === '') {
      return pool.filter((k) => currentText.includes(k.term));
    }
    return pool.filter((k) => k.term.includes(query));
  }, [allKeywords, selectedIds, query, currentText]);

  const isAutoSuggested = query.trim() === '';

  return (
    <div>
      <p className="text-xs text-neutral-400 mb-2">
        관련 개념 (선택, 저장 시 함께 연결됨)
      </p>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((k) => (
            <span
              key={k.id}
              className="flex items-center gap-1.5 bg-amber-50 text-amber-700 rounded-full pl-3 pr-2 py-1 text-xs"
            >
              {k.term}
              <span onClick={() => onRemove(k.id)} className="cursor-pointer">
                ×
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="border border-neutral-200 rounded-lg p-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="개념 검색..."
          className="w-full text-xs outline-none mb-1.5 bg-transparent"
        />
        {isAutoSuggested && candidates.length > 0 && (
          <p className="text-[10px] text-neutral-400 mb-1">
            이 정의에서 발견된 개념
          </p>
        )}
        {candidates.map((k) => (
          <div key={k.id} className="flex justify-between items-center py-0.5">
            <span className="text-xs">{k.term}</span>
            <button
              type="button"
              onClick={() => onAdd(k)}
              className="text-[11px] text-amber-700"
            >
              + 추가
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
