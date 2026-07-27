'use client';

import { useBooks } from '@/entities/economy/book/hooks';
import Link from 'next/link';

export function EconomyOverview() {
  const { data: books, isLoading } = useBooks();
  const recentBooks = books?.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs text-neutral-400 mb-3">도서 요약</p>
        {isLoading && (
          <p className="text-sm text-neutral-400">불러오는 중...</p>
        )}
        <div className="space-y-2">
          {recentBooks.map((book) => (
            <Link
              key={book.id}
              href={`/economy/books/${book.id}`}
              className="block text-sm hover:text-amber-700"
            >
              {book.title}
            </Link>
          ))}
        </div>
      </section>

      {/* TODO: entities/economy/keyword 완성되면 useKeywords()로 교체 */}
      <section>
        <p className="text-xs text-neutral-400 mb-3">기본용어</p>
        <p className="text-sm text-neutral-300">준비 중</p>
      </section>

      {/* TODO: entities/economy/news 완성되면 useNews()로 교체 */}
      <section>
        <p className="text-xs text-neutral-400 mb-3">뉴스 요약</p>
        <p className="text-sm text-neutral-300">준비 중</p>
      </section>

      {/* TODO: entities/economy/etf 완성되면 useEtfs()로 교체 */}
      <section>
        <p className="text-xs text-neutral-400 mb-3">ETF</p>
        <p className="text-sm text-neutral-300">준비 중</p>
      </section>
    </div>
  );
}
