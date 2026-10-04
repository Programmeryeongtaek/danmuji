'use client';

import { CapitalType } from '@/types/selfCapital';

export interface CapitalNavRow {
  type: CapitalType;
  name: string;
  avg: number | null;
}

interface CapitalNavProps {
  rows: CapitalNavRow[];
  selected: CapitalType;
  onSelect: (type: CapitalType) => void;
}

export default function CapitalNav({
  rows,
  selected,
  onSelect,
}: CapitalNavProps) {
  return (
    <nav
      aria-label="자본 목록"
      className="flex flex-[0_0_210px] flex-col gap-1"
    >
      {rows.map((row) => {
        const on = row.type === selected;
        return (
          <button
            key={row.type}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(row.type)}
            className={`flex min-h-13 items-center justify-between gap-2 rounded-lg px-3.5 text-left text-[15px] transition-colors ${
              on
                ? 'bg-amber-100 font-semibold text-amber-900'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{row.name}</span>
            <span className="text-sm tabular-nums">
              {row.avg === null ? '–' : row.avg.toFixed(1)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
