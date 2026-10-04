'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/invest', label: '종목 비교' },
  { href: '/invest/template', label: '기준표' },
] as const;

export default function InvestTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="투자 하위 메뉴"
      className="flex gap-6 overflow-x-auto border-b border-stone-200 text-sm"
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 py-2.5 ${
              isActive
                ? 'border-amber-700 font-semibold text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
