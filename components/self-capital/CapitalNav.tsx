'use client';

import { CapitalType } from '@/types/selfCapital';
import { deltaTone, formatDelta } from './scoreUtils';
import { TONE_TEXT } from './deltaStyle';

export interface CapitalNavRow {
  type: CapitalType;
  name: string;
  avg: number | null;
  /** 비교 시점 대비 평균 변화. 비교할 수 없으면 null */
  delta: number | null;
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
    <nav aria-label="자본 목록" className="flex w-52 shrink-0 flex-col gap-1">
      {rows.map((row) => {
        const on = row.type === selected;
        return (
          <button
            key={row.type}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(row.type)}
            className={`flex min-h-12 items-center justify-between gap-2 rounded-lg px-3.5 text-left text-base transition-colors ${
              on
                ? 'bg-amber-100 font-semibold text-amber-900'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{row.name}</span>
            <span className="flex items-baseline gap-2 tabular-nums">
              <span className="text-sm">
                {row.avg === null ? '–' : row.avg.toFixed(1)}
              </span>
              {row.delta !== null && (
                <span
                  className={`min-w-9 text-right text-xs font-semibold ${TONE_TEXT[deltaTone(row.delta)]}`}
                >
                  {formatDelta(row.delta, 1)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
