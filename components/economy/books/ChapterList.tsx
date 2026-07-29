'use client';

import { useBook } from '@/entities/economy/book/hooks';
import { useChaptersWithRelatedCount } from '@/entities/economy/bookChapter/hooks';
import Image from 'next/image';
import Link from 'next/link';

export function ChapterList({ bookId }: { bookId: string }) {
  const { data: book } = useBook(bookId);
  const { data: chapters, isLoading } = useChaptersWithRelatedCount(bookId);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;

  return (
    <div>
      <div className="flex gap-4 items-start mb-6">
        <div className="w-16 h-20 shrink-0 rounded-md overflow-hidden bg-neutral-200 flex items-center justify-center">
          {book?.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              width={64}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <i
              className="ti ti-book"
              style={{ fontSize: 22, color: 'var(--text-muted, #9ca3af)' }}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1">
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
            className="flex items-center justify-between border-l-2 border-amber-600 pl-3 py-2 hover:bg-neutral-50"
          >
            <span>{chapter.title}</span>
            {chapter.relatedCount > 0 && (
              <span className="text-xs text-neutral-400">
                관련 개념 {chapter.relatedCount}
              </span>
            )}
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
