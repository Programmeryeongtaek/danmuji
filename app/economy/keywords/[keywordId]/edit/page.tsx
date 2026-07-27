import { KeywordForm } from '@/components/economy/keywords/KeywordForm';
import { fetchKeywordById } from '@/entities/keyword/api';

export default async function EditKeywordPage({
  params,
}: {
  params: Promise<{ keywordId: string }>;
}) {
  const { keywordId } = await params;
  const keyword = await fetchKeywordById(keywordId);
  return <KeywordForm mode="edit" keyword={keyword} />;
}
