import { ChapterForm } from '@/components/economy/books/ChapterForm';
import { fetchChaptersByBookId } from '@/entities/economy/bookChapter/api';

export default async function NewChapterPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const chapters = await fetchChaptersByBookId(bookId);
  const nextOrder = chapters.length + 1;
  return <ChapterForm mode="create" bookId={bookId} nextOrder={nextOrder} />;
}
