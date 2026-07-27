'use client';

import {
  useCreateChapter,
  useUpdateChapter,
} from '@/entities/economy/bookChapter/hooks';
import { BookChapter, ChapterFormValues } from '@/types/book';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ChapterForm({
  mode,
  bookId,
  chapter,
  nextOrder,
}: {
  mode: 'create' | 'edit';
  bookId: string;
  chapter?: BookChapter;
  nextOrder?: number;
}) {
  const router = useRouter();
  const createChapter = useCreateChapter(bookId);
  const updateChapter = useUpdateChapter(chapter?.id ?? '', bookId);

  const [values, setValues] = useState<ChapterFormValues>({
    chapter_order: chapter?.chapter_order ?? nextOrder ?? 1,
    title: chapter?.title ?? '',
    content: chapter?.content ?? '',
  });

  const isPending = createChapter.isPending || updateChapter.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === 'create') {
      const created = await createChapter.mutateAsync(values);
      router.push(`/economy/books/${bookId}/chapters/${created.id}`);
    } else if (chapter) {
      await updateChapter.mutateAsync(values);
      router.push(`/economy/books/${bookId}/chapters/${chapter.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-neutral-400 block mb-1">순서</label>
        <input
          type="number"
          required
          value={values.chapter_order}
          onChange={(e) =>
            setValues({ ...values, chapter_order: Number(e.target.value) })
          }
          className="w-24 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">제목</label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">내용</label>
        <textarea
          required
          rows={8}
          value={values.content}
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {mode === 'create' ? '등록' : '저장'}
      </button>
    </form>
  );
}
