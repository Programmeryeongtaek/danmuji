import { BookForm } from '@/components/economy/books/BookForm';
import { fetchBookById } from '@/entities/economy/book/api';

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await fetchBookById(bookId);
  return <BookForm mode="edit" book={book} />;
}
