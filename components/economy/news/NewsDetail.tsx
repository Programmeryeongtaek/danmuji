'use client';

import {
  newsKeys,
  useDeleteNewsSummary,
  useNewsSummary,
} from '@/entities/economy/news/hooks';
import { useRelatedItems } from '@/entities/economy/relatedLinks/hooks';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RelatedItems } from '../RelatedItems';
import { RelatedItemPicker } from '../RelatedItemPicker';

export function NewsDetail({ newsId }: { newsId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: news, isLoading } = useNewsSummary(newsId);
  const { data: related } = useRelatedItems(newsId);
  const deleteNews = useDeleteNewsSummary();

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (!news) return null;

  async function handleDelete() {
    if (!confirm('이 요약을 삭제할까요?')) return;
    await deleteNews.mutateAsync(newsId);
    router.push('/economy/news');
  }

  function invalidateCounts() {
    queryClient.invalidateQueries({ queryKey: newsKeys.withCounts });
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <Link href="/economy/news" className="text-xs text-amber-700">
          ← 뉴스요약 목록으로
        </Link>
        <div className="flex gap-3 text-xs text-neutral-400">
          <Link href={`/economy/news/${newsId}/edit`}>수정</Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <p className="text-xs text-neutral-400 mb-1">
        {news.source}
        {news.source && news.published_date ? ' · ' : ''}
        {news.published_date}
      </p>
      <p className="font-serif text-xl mb-4">{news.title}</p>
      <p className="text-sm text-neutral-700 leading-relaxed mb-4">
        {news.summary}
      </p>

      {news.article_url && (
        <a
          href={news.article_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-700 underline inline-block mb-6"
        >
          원문 보기 ↗
        </a>
      )}

      <RelatedItems
        itemId={newsId}
        items={related ?? []}
        onLinkDeleted={invalidateCounts}
      />
      <RelatedItemPicker
        itemType="news"
        itemId={newsId}
        currentText={news.summary}
        onLinkCreated={invalidateCounts}
      />
    </div>
  );
}
