'use client';

import { useBook } from '@/entities/economy/book/hooks';
import { useChapters } from '@/entities/economy/bookChapter/hooks';
import Link from 'next/link';

export function ChapterList({ bookId }: { bookId: string }) {
  const { data: book } = useBook(bookId);
  const { data: chapters, isLoading } = useChapters(bookId);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;

  return (
    <div>
      <p className="font-serif text-xl mb-1">{book?.title}</p>
      <p className="text-xs text-neutral-500 mb-6">{book?.author}</p>
      <div className="space-y-1">
        {chapters?.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/economy/books/${bookId}/chapters/${chapter.id}`}
            className="block border-l-2 border-amber-600 pl-3 py-2 hover:bg-neutral-50"
          >
            {chapter.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
