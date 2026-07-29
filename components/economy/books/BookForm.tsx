'use client';

import { useCreateBook, useUpdateBook } from '@/entities/economy/book/hooks';
import { deleteCoverImage, uploadCoverImage } from '@/entities/media/api';
import { Book, BookFormValues } from '@/types/book';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

interface AladinSearchResult {
  title: string;
  author: string;
  publisher: string;
  summary: string;
  cover_url: string;
  isbn: string;
}

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
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AladinSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [values, setValues] = useState<BookFormValues>({
    title: book?.title ?? '',
    author: book?.author ?? '',
    publisher: book?.publisher ?? '',
    summary: book?.summary ?? '',
    status: book?.status ?? 'reading',
    tags: book?.tags ?? [],
    isbn: book?.isbn ?? '',
    cover_url: book?.cover_url ?? '',
  });

  const isPending = createBook.isPending || updateBook.isPending;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === 'create') {
      const created = await createBook.mutateAsync(values);
      router.push(`/economy/books/${created.id}`);
    } else if (book) {
      await updateBook.mutateAsync(values);
      router.push(`/economy/books/${book.id}`);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadCoverImage(file);
      setValues((prev) => ({ ...prev, cover_url: url }));
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  }

  async function handleCoverRemove() {
    if (!values.cover_url) return;
    if (!confirm('표지 이미지를 제거할까요?')) return;

    await deleteCoverImage(values.cover_url);
    setValues((prev) => ({ ...prev, cover_url: '' }));
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    try {
      const res = await fetch(
        `/api/aladin/search?query=${encodeURIComponent(searchQuery)}`,
      );
      if (!res.ok) {
        const body = await res.json();
        setSearchError(body.error ?? '검색에 실패했습니다.');
        return;
      }
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        setSearchError('검색 결과가 없습니다.');
        return;
      }
      setSearchResults(data.items);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectResult(result: AladinSearchResult) {
    setValues((prev) => ({
      ...prev,
      title: result.title,
      author: result.author,
      publisher: result.publisher,
      summary: result.summary,
      cover_url: result.cover_url,
      isbn: result.isbn,
    }));
    setSearchResults([]);
    setSearchQuery('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-neutral-400 block mb-1">도서 검색</label>
        <div className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="책 제목으로 검색"
            className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="text-xs px-3 py-2 rounded-lg border border-neutral-200 text-amber-700 disabled:text-neutral-300 disabled:cursor-not-allowed"
          >
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </div>
        {searchError && (
          <p className="text-xs text-red-500 mt-1">{searchError}</p>
        )}

        {searchResults.length > 0 && (
          <div className="border border-neutral-200 rounded-lg mt-2 divide-y divide-neutral-100 max-h-72 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.isbn}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="flex gap-3 w-full text-left px-3 py-2 hover:bg-neutral-50"
              >
                <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-neutral-100">
                  {result.cover_url && (
                    <Image
                      src={result.cover_url}
                      alt={result.title}
                      width={40}
                      height={56}
                      className="w-full h-full object-cover"
                      priority
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate">{result.title}</p>
                  <p className="text-xs text-neutral-500 truncate">
                    {result.author} · {result.publisher}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">표지</label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-20 shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            {values.cover_url ? (
              <Image
                src={values.cover_url}
                alt="표지 미리보기"
                width={64}
                height={80}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <i
                className="ti ti-book"
                style={{ fontSize: 20, color: 'var(--text-muted, #9ca3af)' }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-amber-700 cursor-pointer">
              {isUploadingCover ? '업로드 중...' : '직접 업로드'}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={isUploadingCover}
              />
            </label>
            {values.cover_url && (
              <button
                type="button"
                onClick={handleCoverRemove}
                className="text-xs text-neutral-400 text-left"
              >
                제거
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">ISBN</label>
        <input
          value={values.isbn ?? ''}
          readOnly
          placeholder="검색으로 자동 입력됩니다"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-neutral-50 text-neutral-500"
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
        <label className="text-xs text-neutral-400 block mb-1">저자</label>
        <input
          value={values.author ?? ''}
          onChange={(e) => setValues({ ...values, author: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">출판사</label>
        <input
          value={values.publisher ?? ''}
          onChange={(e) => setValues({ ...values, publisher: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">소개</label>
        <textarea
          required
          rows={10}
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
