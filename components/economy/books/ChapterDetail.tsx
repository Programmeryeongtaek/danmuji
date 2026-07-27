'use client';

import { useBook } from '@/entities/economy/book/hooks';
import {
  useChapter,
  useRelatedItems,
} from '@/entities/economy/bookChapter/hooks';
import Link from 'next/link';
import { RelatedItems } from './RelatedItems';

export function ChapterDetail({
  bookId,
  chapterId,
}: {
  bookId: string;
  chapterId: string;
}) {
  const { data: book } = useBook(bookId);
  const { data: chapter, isLoading } = useChapter(chapterId);
  const { data: related } = useRelatedItems(chapterId);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (!chapter) return null;

  return (
    <div>
      <Link
        href={`/economy/books/${bookId}`}
        className="text-xs text-amber-700 mb-4 inline-block"
      >
        ← {book?.title} 목차로
      </Link>
      <p className="font-serif text-xl mb-1">{chapter.title}</p>
      <p className="text-xs text-neutral-500 mb-4">
        {book?.title} · {book?.author}
      </p>
      <p className="text-sm text-neutral-700 leading-relaxed mb-6">
        {chapter.content}
      </p>
      <RelatedItems items={related ?? []} />
    </div>
  );
}
