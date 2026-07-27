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
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="font-serif text-xl mb-1">{book?.title}</p>
          <p className="text-xs text-neutral-500">{book?.author}</p>
        </div>
        <Link
          href={`/economy/books/${bookId}/edit`}
          className="text-xs text-neutral-400"
        >
          정보 수정
        </Link>
      </div>

      <div className="space-y-1 mb-4">
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

      <Link
        href={`/economy/books/${bookId}/chapters/new`}
        className="text-sm text-amber-700"
      >
        + 추가
      </Link>
    </div>
  );
}
