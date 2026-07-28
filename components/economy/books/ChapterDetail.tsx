'use client';

import { useBook } from '@/entities/economy/book/hooks';
import {
  useChapter,
  useDeleteChapter,
} from '@/entities/economy/bookChapter/hooks';
import Link from 'next/link';
import { RelatedItems } from '../RelatedItems';
import { useRouter } from 'next/navigation';
import { useRelatedItems } from '@/entities/economy/relatedLinks/hooks';
import { RelatedItemPicker } from '../RelatedItemPicker';

export function ChapterDetail({
  bookId,
  chapterId,
}: {
  bookId: string;
  chapterId: string;
}) {
  const router = useRouter();
  const { data: book } = useBook(bookId);
  const { data: chapter, isLoading } = useChapter(chapterId);
  const { data: related } = useRelatedItems(chapterId);
  const deleteChapter = useDeleteChapter(bookId);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (!chapter) return null;

  async function handleDelete() {
    if (!confirm('이 챕터를 삭제할까요?')) return;
    await deleteChapter.mutateAsync(chapterId);
    router.push(`/economy/books/${bookId}`);
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <Link
          href={`/economy/books/${bookId}`}
          className="text-xs text-amber-700"
        >
          ← {book?.title} 목차로
        </Link>
        <div className="flex gap-3 text-xs text-neutral-400">
          <Link href={`/economy/books/${bookId}/chapters/${chapterId}/edit`}>
            수정
          </Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <p className="font-serif text-xl mb-1">{chapter.title}</p>
      <p className="text-xs text-neutral-500 mb-4">
        {book?.title} · {book?.author}
      </p>
      <p className="text-sm text-neutral-700 leading-relaxed mb-6">
        {chapter.content}
      </p>

      <RelatedItems
        itemId={chapterId}
        items={related ?? []}
        openKeywordsInModal
      />
      <RelatedItemPicker
        itemType="chapter"
        itemId={chapterId}
        currentText={chapter.content}
      />
    </div>
  );
}
