import { KeywordWithRelatedCount } from '@/types/keyword';
import Link from 'next/link';

const STATUS_LABEL: Record<KeywordWithRelatedCount['status'], string> = {
  done: '완료',
  review: '복습필요',
  new: '미학습',
};

export function KeywordCard({ keyword }: { keyword: KeywordWithRelatedCount }) {
  return (
    <Link
      href={`/economy/keywords/${keyword.id}`}
      className="block relative rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 hover:bg-neutral-100"
    >
      <span className="absolute top-3 right-4 text-xs text-neutral-400">
        {STATUS_LABEL[keyword.status]}
      </span>
      <p className="text-sm font-medium pr-14 mb-1.5">{keyword.term}</p>
      <p className="text-xs text-neutral-500 mb-2 line-clamp-2">
        {keyword.definition}
      </p>
      <p className="text-xs text-neutral-400" style={{ minHeight: 16 }}>
        {keyword.relatedCount > 0 ? `관련 개념 ${keyword.relatedCount}` : ''}
      </p>
    </Link>
  );
}
