'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/economy', label: '전체' },
  { href: '/economy/books', label: '도서요약' },
  { href: '/economy/keywords', label: '기본용어' },
  { href: '/economy/news', label: '뉴스요약' },
  { href: '/economy/etf', label: 'ETF' },
];

export function EconomyTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 border-b border-neutral-200 mb-6 text-sm">
      {TABS.map((tab) => {
        const isActive =
          tab.href === '/economy'
            ? pathname === '/economy'
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-2 ${
              isActive
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-neutral-500'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
