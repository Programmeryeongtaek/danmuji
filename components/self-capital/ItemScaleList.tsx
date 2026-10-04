'use client';

import Link from 'next/link';
import { SCORE_MAX, SCORE_MIN, SCORE_SCALE } from './constants';
import { deltaTone, formatDelta } from './scoreUtils';
import { TONE_BADGE, TONE_TEXT } from './Deltastyle';
export interface ScaleItem {
  id: string;
  content: string;
  /** 비교 시작점의 점수 */
  from?: number;
  /** 비교 끝점의 점수 (끝점이 '지금'이면 작성 중인 점수) */
  score?: number;
}

interface ItemScaleListProps {
  name: string;
  desc: string;
  avg: number | null;
  delta: number | null;
  items: ScaleItem[];
  /** 시작점 이름 (예: '26.09'). 없으면 비교 표시 생략 */
  fromLabel?: string;
  /** 끝점 이름 (예: '지금', '26.07') */
  toLabel: string;
  /** 끝점이 과거면 읽기 전용 */
  locked: boolean;
  onScore: (itemId: string, score: number) => void;
}

export default function ItemScaleList({
  name,
  desc,
  avg,
  delta,
  items,
  fromLabel,
  toLabel,
  locked,
  onScore,
}: ItemScaleListProps) {
  return (
    <section className="flex min-w-0 grow basis-96 flex-col gap-2">
      <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-serif text-2xl text-stone-900">{name}</h2>
          <p className="text-base text-stone-600">{desc}</p>
        </div>
        <p className="whitespace-nowrap text-sm text-stone-600">
          평균{' '}
          <strong className="text-xl text-amber-800">
            {avg === null ? '–' : avg.toFixed(1)}
          </strong>{' '}
          {delta !== null && (
            <span
              className={`text-sm font-semibold ${TONE_TEXT[deltaTone(delta)]}`}
            >
              {formatDelta(delta, 1)}
            </span>
          )}
        </p>
      </div>

      <p className="mt-2 text-sm text-stone-500">
        {SCORE_MIN} 전혀 아니다 — {SCORE_MAX} 매우 그렇다
        {fromLabel && ' · 회색 테두리는 시작점의 점수'}
      </p>

      {locked && (
        <p className="mt-2 rounded-lg bg-stone-100 px-4 py-3 text-sm leading-relaxed text-stone-700">
          지난 구간을 보는 중이라 점수는 읽기 전용입니다. 이번 점검을 고치려면
          끝점을 ‘지금’에 두세요.
        </p>
      )}

      {items.length === 0 && (
        <p className="py-6 text-base text-stone-600">
          이 자본에는 아직 문항이 없습니다.{' '}
          <Link
            href="/self-capital/items"
            className="text-amber-700 underline-offset-4 hover:underline"
          >
            문항 추가하기
          </Link>
        </p>
      )}

      {items.map((item) => {
        const comparable =
          fromLabel !== undefined &&
          item.from !== undefined &&
          item.score !== undefined;
        const itemDelta = comparable
          ? (item.score as number) - (item.from as number)
          : 0;

        return (
          <div
            key={item.id}
            className="flex flex-col gap-3 border-b border-stone-100 py-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-base text-stone-800">{item.content}</p>
              {comparable && (
                <span className="inline-flex items-center gap-2.5 text-sm tabular-nums text-stone-600">
                  <span>
                    {fromLabel} {item.from} → {toLabel} {item.score}
                  </span>
                  <span
                    className={`min-w-9 rounded-full px-2 py-0.5 text-center font-semibold ${TONE_BADGE[deltaTone(itemDelta)]}`}
                  >
                    {formatDelta(itemDelta)}
                  </span>
                </span>
              )}
            </div>
            <div
              role="radiogroup"
              aria-label={item.content}
              className="flex flex-wrap gap-1.5"
            >
              {SCORE_SCALE.map((n) => {
                const on = n === item.score;
                const was = fromLabel !== undefined && n === item.from && !on;
                const look = on
                  ? locked
                    ? 'border border-stone-500 bg-stone-500 text-white'
                    : 'border border-amber-700 bg-amber-700 text-white'
                  : was
                    ? 'border-2 border-stone-500 bg-white text-stone-700'
                    : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-400';
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={was ? `${n}점 (시작점)` : `${n}점`}
                    disabled={locked}
                    onClick={() => onScore(item.id, n)}
                    className={`size-11 rounded-lg text-base font-semibold tabular-nums transition-colors disabled:cursor-default ${look}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
