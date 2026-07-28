'use client';

import { useKeywordsWithRelatedCount } from '@/entities/keyword/hooks';
import { KeywordFilter, keywordFilterAtom } from './atom';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { KeywordCard } from './KeywordCard';

const FILTERS: { value: KeywordFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'new', label: '미학습' },
  { value: 'review', label: '복습필요' },
  { value: 'done', label: '완료' },
];

export function KeywordList() {
  const { data: keywords, isLoading } = useKeywordsWithRelatedCount();
  const [filter, setFilter] = useAtom(keywordFilterAtom);

  const filtered =
    keywords?.filter((k) => filter === 'all' || k.status === filter) ?? [];

  return (
    <div>
      <Link href="/economy/keywords/map" className="text-sm text-neutral-500">
        용어 지도 보기
      </Link>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 text-xs">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 rounded-lg ${
                filter === f.value
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-neutral-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Link href="/economy/keywords/new" className="text-sm text-amber-700">
          + 추가
        </Link>
      </div>

      {isLoading && <p className="text-sm text-neutral-400">불러오는 중...</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-neutral-400">해당하는 개념이 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((keyword) => (
          <KeywordCard key={keyword.id} keyword={keyword} />
        ))}
      </div>
    </div>
  );
}
