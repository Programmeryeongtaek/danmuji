import { useDeleteBook } from '@/entities/economy/book/hooks';
import { Book } from '@/types/book';
import Image from 'next/image';
import Link from 'next/link';
import { ReflectionModal } from './ReflectionModal';
import { useState } from 'react';

export function BookCard({ book }: { book: Book }) {
  const deleteBook = useDeleteBook();
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(`"${book.title}"을(를) 삭제할까요? 관련 챕터도 함께 삭제됩니다.`)
    )
      return;
    await deleteBook.mutateAsync(book.id);
  }

  function handleReflectionClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowReflectionModal(true);
  }

  return (
    <>
      <Link
        href={`/economy/books/${book.id}`}
        className="flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 hover:bg-neutral-100 relative group"
      >
        <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-neutral-200 flex items-center justify-center">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              width={48}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <i
              className="ti ti-book"
              style={{ fontSize: 18, color: 'var(--text-muted, #9ca3af)' }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-serif text-base mb-1 truncate">{book.title}</p>
          <p className="text-xs text-neutral-500">
            {book.author}
            {book.publisher ? ` · ${book.publisher}` : ''} ·{' '}
            {book.status === 'reading' ? '읽는 중' : '완독'}
            {book.status === 'done' && !book.reflection && (
              <button
                onClick={handleReflectionClick}
                className="text-amber-600 ml-1 underline"
              >
                소감 남기기
              </button>
            )}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
        >
          삭제
        </button>
      </Link>

      {showReflectionModal && (
        <ReflectionModal
          bookId={book.id}
          initialReflection={book.reflection ?? ''}
          onClose={() => setShowReflectionModal(false)}
        />
      )}
    </>
  );
}
