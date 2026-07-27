'use client';

import { useRelatedItems } from '@/entities/economy/relatedLinks/hooks';
import { useDeleteKeyword, useKeyword } from '@/entities/keyword/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RelatedItems } from '../RelatedItems';

export function KeywordDetail({ keywordId }: { keywordId: string }) {
  const router = useRouter();
  const { data: keyword, isLoading } = useKeyword(keywordId);
  const { data: related } = useRelatedItems(keywordId);
  const deleteKeyword = useDeleteKeyword();

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (!keyword) return null;

  async function handleDelete() {
    if (!confirm('이 개념을 삭제할까요?')) return;
    await deleteKeyword.mutateAsync(keywordId);
    router.push('/economy/keywords');
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <Link href="/economy/keywords" className="text-xs text-amber-700">
          ← 기본용어 목록으로
        </Link>
        <div className="flex gap-3 text-xs text-neutral-400">
          <Link href={`/economy/keywords/${keywordId}/edit`}>수정</Link>
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>

      <p className="font-serif text-xl mb-4">{keyword.term}</p>
      <p className="text-sm text-neutral-700 leading-relaxed mb-6">
        {keyword.definition}
      </p>
      <RelatedItems items={related ?? []} />
    </div>
  );
}
