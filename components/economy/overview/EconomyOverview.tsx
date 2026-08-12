'use client';

import { useBooks } from '@/entities/economy/book/hooks';
import { searchAll } from '@/entities/economy/search/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

export function EconomyOverview() {
  const { data: books, isLoading } = useBooks();
  const recentBooks = books?.slice(0, 3) ?? [];

  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data: results, isLoading: isSearching } = useQuery({
    queryKey: ['unifiedSearch', submitted],
    queryFn: () => searchAll(submitted),
    enabled: submitted.trim().length > 0,
  });

  function handleSearch() {
    setSubmitted(query.trim());
  }

  function handleClear() {
    setQuery('');
    setSubmitted('');
  }

  return (
    <div>
      <div className="relative mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="개념이나 키워드를 검색해보세요"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm"
        />
        {submitted && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400"
          >
            지우기
          </button>
        )}
      </div>

      {submitted ? (
        <SearchResults isLoading={isSearching} results={results} />
      ) : (
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

          <section>
            <p className="text-xs text-neutral-400 mb-3">기본용어</p>
            <p className="text-sm text-neutral-300">준비 중</p>
          </section>

          <section>
            <p className="text-xs text-neutral-400 mb-3">뉴스 요약</p>
            <p className="text-sm text-neutral-300">준비 중</p>
          </section>

          <section>
            <p className="text-xs text-neutral-400 mb-3">ETF</p>
            <p className="text-sm text-neutral-300">준비 중</p>
          </section>
        </div>
      )}
    </div>
  );
}

function SearchResults({
  isLoading,
  results,
}: {
  isLoading: boolean;
  results?: Awaited<ReturnType<typeof searchAll>>;
}) {
  if (isLoading) return <p className="text-sm text-neutral-400">검색 중...</p>;

  const hasResults =
    results &&
    (results.keywords.length > 0 ||
      results.chapters.length > 0 ||
      results.news.length > 0);

  if (!hasResults)
    return <p className="text-sm text-neutral-400">검색 결과가 없습니다.</p>;

  return (
    <div>
      {results.keywords.length > 0 && (
        <section className="mb-5">
          <p className="text-xs text-amber-700 mb-2">기본용어</p>
          <div className="space-y-3">
            {results.keywords.map((k) => (
              <Link
                key={k.id}
                href={`/economy/keywords/${k.id}`}
                className="block border-l-2 border-amber-600 pl-3"
              >
                <p className="text-sm">{k.term}</p>
                <p className="text-xs text-neutral-500 line-clamp-1">
                  {k.definition}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.chapters.length > 0 && (
        <section className="mb-5">
          <p className="text-xs text-amber-700 mb-2">
            도서 챕터 ({results.chapters.length})
          </p>
          <div className="space-y-1.5">
            {results.chapters.map((c) => (
              <Link
                key={c.id}
                href={`/economy/books/${c.bookId}/chapters/${c.id}`}
                className="block text-sm hover:text-amber-700"
              >
                『{c.bookTitle}』 {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.news.length > 0 && (
        <section>
          <p className="text-xs text-amber-700 mb-2">
            뉴스요약 ({results.news.length})
          </p>
          <div className="space-y-1.5">
            {results.news.map((n) => (
              <Link
                key={n.id}
                href={`/economy/news/${n.id}`}
                className="block text-sm hover:text-amber-700"
              >
                {n.title}
                {n.source && (
                  <span className="text-xs text-neutral-400">
                    {' '}
                    — {n.source}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
