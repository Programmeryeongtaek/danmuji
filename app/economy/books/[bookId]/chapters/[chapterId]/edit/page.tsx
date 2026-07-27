import { ChapterForm } from '@/components/economy/books/ChapterForm';
import { fetchChapterById } from '@/entities/economy/bookChapter/api';

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ bookId: string; chapterId: string }>;
}) {
  const { bookId, chapterId } = await params;
  const chapter = await fetchChapterById(chapterId);
  return <ChapterForm mode="edit" bookId={bookId} chapter={chapter} />;
}
