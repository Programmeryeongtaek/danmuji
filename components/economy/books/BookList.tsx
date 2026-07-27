'use client';

import { useBooks } from '@/entities/economy/book/hooks';
import { BookCard } from './BookCard';
import Link from 'next/link';

export function BookList() {
  const { data: books, isLoading } = useBooks();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/economy/books/new" className="text-sm text-amber-700">
          + 등록
        </Link>
      </div>

      {isLoading && <p className="text-sm text-neutral-400">불러오는 중...</p>}
      {!isLoading && (!books || books.length === 0) && (
        <p className="text-sm text-neutral-400">등록된 책이 없습니다.</p>
      )}

      <div className="space-y-3">
        {books?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
