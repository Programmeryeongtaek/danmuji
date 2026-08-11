import { NewsForm } from '@/components/economy/news/NewsForm';
import { fetchNewsSummaryById } from '@/entities/economy/news/api';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = await params;
  const news = await fetchNewsSummaryById(newsId);
  return <NewsForm mode="edit" news={news} />;
}
