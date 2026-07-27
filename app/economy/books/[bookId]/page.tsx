import { ChapterList } from '@/components/economy/books/ChapterList';

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  return <ChapterList bookId={bookId} />;
}
