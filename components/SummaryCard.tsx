import { SummaryCard } from '@/types/dashboard';
import { BookOpen, Newspaper, PencilLine } from 'lucide-react';
import Link from 'next/link';

const ICON_MAP = {
  news: Newspaper,
  pencil: PencilLine,
  book: BookOpen,
} as const;

interface SummaryCardProps {
  card: SummaryCard;
}

export function SummaryCardView({ card }: SummaryCardProps) {
  const Icon = ICON_MAP[card.icon];

  return (
    <div className="rounded-lg border-t-2 border-amber-300 bg-white p-3 dark:border-amber-800 dark:bg-neutral-900">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
          <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          {card.title}
        </span>
        <Link
          href={card.moreHref}
          className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          더보기
        </Link>
      </div>

      <ul className="flex flex-col gap-1.5">
        {card.items.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block truncate text-[12.5px] ${
                index === 0
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 dark:text-neutral-400'
              } hover:text-amber-700 dark:hover:text-amber-400`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
