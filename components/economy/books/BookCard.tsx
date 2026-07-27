import { Book } from '@/types/book';
import Link from 'next/link';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/economy/books/${book.id}`}
      className="block rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 hover:bg-neutral-100"
    >
      <p className="font-serif text-base mb-1">{book.title}</p>
      <p className="text-xs text-neutral-500">
        {book.author} · {book.status === 'reading' ? '읽는 중' : '완독'}
      </p>
    </Link>
  );
}
