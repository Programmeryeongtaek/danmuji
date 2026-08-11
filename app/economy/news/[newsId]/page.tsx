import { NewsDetail } from '@/components/economy/news/NewsDetail';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = await params;
  return <NewsDetail newsId={newsId} />;
}
