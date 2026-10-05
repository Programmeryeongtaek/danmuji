'use client';

import { NavItem, NavItemKey } from '@/types/dashBoard';
import {
  BarChart3,
  Hexagon,
  Home,
  Languages,
  ListChecks,
  NotebookText,
  PencilLine,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: 'home' },
  { key: 'economy', label: '경제', icon: 'chart' },
  { key: 'invest', label: '투자', icon: 'checklist' },
  { key: 'records', label: '기록', icon: 'pencil' },
  { key: 'language', label: '언어', icon: 'language' },
  { key: 'selfCapital', label: '자기 자본', icon: 'hexagon' },
];

const ICON_MAP = {
  home: Home,
  chart: BarChart3,
  checklist: ListChecks,
  pencil: PencilLine,
  language: Languages,
  hexagon: Hexagon,
} as const;

const HREF_MAP: Record<NavItemKey, string> = {
  home: '/',
  economy: '/economy',
  invest: '/invest',
  records: '/records',
  language: '/language',
  selfCapital: '/self-capital',
};

const isActivePath = (pathname: string, href: string) =>
  href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`);

interface SidebarProps {
  userName: string;
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-47.5 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 px-2 py-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-3 flex items-center gap-2 px-2 py-1">
        <NotebookText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          단무지
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const href = HREF_MAP[item.key];
          const Icon = ICON_MAP[item.icon];
          const isActive = isActivePath(pathname, href);

          return (
            <Link
              key={item.key}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                isActive
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2 border-t border-neutral-200 px-2 pt-3 dark:border-neutral-800">
        <div className="h-5.5 w-5.5 rounded-full bg-amber-100 dark:bg-amber-950" />
        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
          {userName}
        </p>
      </div>
    </aside>
  );
}
