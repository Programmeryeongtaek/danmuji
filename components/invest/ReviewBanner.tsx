import Link from 'next/link';
import { CompareColumn } from './compare';
import { findDueReviews } from './review';

interface ReviewBannerProps {
  columns: CompareColumn[];
}

export function ReviewBanner({ columns }: ReviewBannerProps) {
  const dueReviews = findDueReviews(columns);
  if (dueReviews.length === 0) return null;

  return (
    <section
      aria-labelledby="review-banner-heading"
      className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900 dark:bg-amber-950"
    >
      <h2
        id="review-banner-heading"
        className="text-sm font-semibold text-amber-900 dark:text-amber-200"
      >
        다시 볼 때가 된 종목 {dueReviews.length}개
      </h2>
      <ul className="flex flex-col gap-2">
        {dueReviews.map(({ stock, reason }) => (
          <li
            key={stock.id}
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <span className="text-sm text-amber-900 dark:text-amber-200">
              <span className="font-semibold">{stock.name}</span> — {reason}
            </span>
            <Link
              href={`/invest/new?stockId=${stock.id}`}
              className="inline-flex min-h-10 items-center rounded-lg border border-amber-300 bg-white px-3 text-sm text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-neutral-950 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              다시 평가
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
