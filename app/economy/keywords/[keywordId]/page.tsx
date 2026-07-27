import { KeywordDetail } from '@/components/economy/keywords/KeywordDetail';

export default async function KeywordDetailPage({
  params,
}: {
  params: Promise<{ keywordId: string }>;
}) {
  const { keywordId } = await params;
  return <KeywordDetail keywordId={keywordId} />;
}
