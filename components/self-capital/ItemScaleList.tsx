'use client';

import Link from 'next/link';
import { SCORE_MAX, SCORE_MIN, SCORE_SCALE } from './constants';
export interface ScaleItem {
  id: string;
  content: string;
  score?: number;
}

interface ItemScaleListProps {
  name: string;
  desc: string;
  avg: number | null;
  items: ScaleItem[];
  onScore: (itemId: string, score: number) => void;
}

export default function ItemScaleList({
  name,
  desc,
  avg,
  items,
  onScore,
}: ItemScaleListProps) {
  return (
    <section className="flex min-w-0 flex-[1_1_380px] flex-col gap-2">
      <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-serif text-[26px] text-stone-900">{name}</h2>
          <p className="text-[15px] text-stone-600">{desc}</p>
        </div>
        <p className="whitespace-nowrap text-sm text-stone-600">
          평균{' '}
          <strong className="text-xl text-amber-800">
            {avg === null ? '–' : avg.toFixed(1)}
          </strong>
        </p>
      </div>

      <p className="mt-2 text-[13px] text-stone-500">
        {SCORE_MIN} 전혀 아니다 — {SCORE_MAX} 매우 그렇다
      </p>

      {items.length === 0 && (
        <p className="py-6 text-[15px] text-stone-600">
          이 자본에는 아직 문항이 없습니다.{' '}
          <Link
            href="/self-capital/items"
            className="text-amber-700 underline-offset-4 hover:underline"
          >
            문항 추가하기
          </Link>
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 border-b border-stone-100 py-5"
        >
          <p className="text-base text-stone-800">{item.content}</p>
          <div
            role="radiogroup"
            aria-label={item.content}
            className="flex flex-wrap gap-1.5"
          >
            {SCORE_SCALE.map((n) => {
              const on = n === item.score;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onScore(item.id, n)}
                  className={`h-11 w-11 rounded-lg border text-[15px] font-semibold tabular-nums transition-colors ${
                    on
                      ? 'border-amber-700 bg-amber-700 text-white'
                      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
