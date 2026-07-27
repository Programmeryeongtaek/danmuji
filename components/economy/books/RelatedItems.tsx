import { RelatedItem } from '@/types/book';

const TYPE_LABEL: Record<RelatedItem['type'], string> = {
  chapter: '도서',
  keyword: '키워드',
  news: '뉴스',
  etf: 'ETF',
};

export function RelatedItems({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-t border-neutral-200 pt-4 mt-6">
      <p className="text-xs text-neutral-400 mb-2">관련 항목</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
              {TYPE_LABEL[item.type]}
            </span>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
