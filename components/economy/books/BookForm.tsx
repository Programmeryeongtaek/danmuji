'use client';

import { useCreateBook, useUpdateBook } from '@/entities/economy/book/hooks';
import { Book, BookFormValues } from '@/types/book';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function BookForm({
  mode,
  book,
}: {
  mode: 'create' | 'edit';
  book?: Book;
}) {
  const router = useRouter();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook(book?.id ?? '');

  const [values, setValues] = useState<BookFormValues>({
    title: book?.title ?? '',
    author: book?.author ?? '',
    summary: book?.summary ?? '',
    status: book?.status ?? 'reading',
    tags: book?.tags ?? [],
    isbn: book?.isbn ?? '',
    cover_url: book?.cover_url ?? '',
  });

  const isPending = createBook.isPending || updateBook.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === 'create') {
      const created = await createBook.mutateAsync(values);
      router.push(`/economy/books/${created.id}`);
    } else if (book) {
      await updateBook.mutateAsync(values);
      router.push(`/economy/books/${book.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-neutral-400 block mb-1">ISBN</label>
        <div className="flex gap-2">
          <input
            value={values.isbn ?? ''}
            onChange={(e) => setValues({ ...values, isbn: e.target.value })}
            placeholder="ISBN 입력 (선택)"
            className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled
            title="추후 알라딘 API 연동 예정"
            className="text-xs px-3 py-2 rounded-lg border border-neutral-200 text-neutral-300 cursor-not-allowed"
          >
            검색으로 가져오기
          </button>
        </div>
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
        <label className="text-xs text-neutral-400 block mb-1">저자</label>
        <input
          value={values.author ?? ''}
          onChange={(e) => setValues({ ...values, author: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">요약</label>
        <textarea
          required
          rows={4}
          value={values.summary}
          onChange={(e) => setValues({ ...values, summary: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">상태</label>
        <select
          value={values.status}
          onChange={(e) =>
            setValues({
              ...values,
              status: e.target.value as BookFormValues['status'],
            })
          }
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="reading">읽는 중</option>
          <option value="done">완독</option>
        </select>
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
