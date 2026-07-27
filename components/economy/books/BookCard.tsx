import { useDeleteBook } from '@/entities/economy/book/hooks';
import { Book } from '@/types/book';
import Link from 'next/link';

export function BookCard({ book }: { book: Book }) {
  const deleteBook = useDeleteBook();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(`"${book.title}"을(를) 삭제할까요? 관련 챕터도 함께 삭제됩니다.`)
    )
      return;
    await deleteBook.mutateAsync(book.id);
  }

  return (
    <Link
      href={`/economy/books/${book.id}`}
      className="block rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 hover:bg-neutral-100 relative group"
    >
      <p className="font-serif text-base mb-1">{book.title}</p>
      <p className="text-xs text-neutral-500">
        {book.author} · {book.status === 'reading' ? '읽는 중' : '완독'}
      </p>
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
      >
        삭제
      </button>
    </Link>
  );
}
