import { ChapterDetail } from '@/components/economy/books/ChapterDetail';

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ bookId: string; chapterId: string }>;
}) {
  const { bookId, chapterId } = await params;
  return <ChapterDetail bookId={bookId} chapterId={chapterId} />;
}
