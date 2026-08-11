import { NewsSummaryWithRelatedCount } from '@/types/news';
import Link from 'next/link';

export function NewsCard({ news }: { news: NewsSummaryWithRelatedCount }) {
  return (
    <Link
      href={`/economy/news/${news.id}`}
      className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4 hover:bg-neutral-100"
      style={{ minHeight: 170 }}
    >
      <p className="text-xs text-neutral-400 mb-2">
        {news.source}
        {news.source && news.published_date ? ' · ' : ''}
        {news.published_date}
      </p>
      <p className="text-sm font-medium mb-2.5">{news.title}</p>
      <div className="border-l-2 border-amber-600 pl-2.5 mb-3 flex-1">
        <p
          className="text-sm text-neutral-600 italic"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {news.summary}
        </p>
      </div>
      <div className="flex gap-1.5" style={{ minHeight: 20 }}>
        {news.relatedTerms?.slice(0, 3).map((term) => (
          <span
            key={term}
            className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded"
          >
            {term}
          </span>
        ))}
      </div>
    </Link>
  );
}
