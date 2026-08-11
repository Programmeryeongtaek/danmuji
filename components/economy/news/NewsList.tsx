'use client';

import { useNewsSummariesWithRelatedCount } from '@/entities/economy/news/hooks';
import Link from 'next/link';
import { NewsCard } from './NewsCard';

export function NewsList() {
  const { data: newsList, isLoading } = useNewsSummariesWithRelatedCount();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/economy/news/new" className="text-sm text-amber-700">
          + 요약 작성
        </Link>
      </div>

      {isLoading && <p className="text-sm text-neutral-400">불러오는 중...</p>}
      {!isLoading && (!newsList || newsList.length === 0) && (
        <p className="text-sm text-neutral-400">작성된 요약이 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {newsList?.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
