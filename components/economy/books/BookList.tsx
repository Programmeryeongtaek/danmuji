'use client';

import { useBooks } from '@/entities/economy/book/hooks';
import { BookCard } from './BookCard';

export function BookList() {
  const { data: books, isLoading } = useBooks();

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (!books || books.length === 0)
    return <p className="text-sm text-neutral-400">등록된 책이 없습니다.</p>;

  return (
    <div className="space-y-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
