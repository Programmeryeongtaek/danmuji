'use client';

import { Fragment } from 'react/jsx-runtime';
import { CompareHandle } from './Atoms';

export interface TimelinePoint {
  id: string;
  label: string;
}

export interface PresetOption {
  label: string;
  /** 이 프리셋이 시작점으로 삼을 점검 id. 해당 점검이 없으면 null */
  targetId: string | null;
}

interface PeriodTimelineProps {
  /** 오래된 순, 마지막은 '지금' */
  points: TimelinePoint[];
  startIndex: number;
  endIndex: number;
  spanText: string;
  presets: PresetOption[];
  handle: CompareHandle;
  onHandleChange: (handle: CompareHandle) => void;
  onPick: (index: number) => void;
  onPreset: (targetId: string) => void;
}

const HANDLES: { key: CompareHandle; label: string }[] = [
  { key: 'start', label: '시작' },
  { key: 'end', label: '끝' },
];

export default function PeriodTimeline({
  points,
  startIndex,
  endIndex,
  spanText,
  presets,
  handle,
  onHandleChange,
  onPick,
  onPreset,
}: PeriodTimelineProps) {
  const lastIndex = points.length - 1;
  const startId = points[startIndex]?.id;

  return (
    <section
      aria-label="비교 구간"
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-base text-stone-800">
            비교 구간{' '}
            <strong className="text-amber-800">
              {points[startIndex]?.label} → {points[endIndex]?.label}
            </strong>{' '}
            <span className="text-sm text-stone-600">· {spanText}</span>
          </p>

          <div
            role="group"
            aria-label="빠른 선택"
            className="flex gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1"
          >
            {presets.map((preset) => {
              const active =
                preset.targetId !== null &&
                preset.targetId === startId &&
                endIndex === lastIndex;
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={!preset.targetId}
                  aria-pressed={active}
                  onClick={() => preset.targetId && onPreset(preset.targetId)}
                  className={`min-h-9 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <span>바꿀 점</span>
            {HANDLES.map((h) => {
              const on = h.key === handle;
              return (
                <button
                  key={h.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onHandleChange(h.key)}
                  className={`min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors ${
                    on
                      ? 'border-amber-700 bg-amber-700 text-white'
                      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
          <span className="text-sm text-stone-600">
            시작점과 끝점을 차례로 누르세요
          </span>
        </div>
      </div>

      <div className="flex items-center overflow-x-auto">
        {points.map((point, i) => {
          const isStart = i === startIndex;
          const isEnd = i === endIndex;
          const marked = isStart || isEnd;
          const inRange = i > startIndex && i <= endIndex;
          // 시작점은 '지금'이 될 수 없고, 끝점은 가장 오래된 점검이 될 수 없음
          const disabled =
            (handle === 'start' && i === lastIndex) ||
            (handle === 'end' && i === 0);

          return (
            <Fragment key={point.id}>
              {i > 0 && (
                <div
                  aria-hidden
                  className={`mb-11 min-w-6 grow ${inRange ? 'h-1 bg-amber-700' : 'h-px bg-stone-300'}`}
                />
              )}
              <button
                type="button"
                disabled={disabled}
                aria-pressed={marked}
                aria-label={`${point.label}${isStart ? ' (시작)' : isEnd ? ' (끝)' : ''}`}
                onClick={() => onPick(i)}
                className="flex min-w-16 shrink-0 flex-col items-center gap-1 disabled:cursor-not-allowed"
              >
                <span className="flex h-7 w-11 items-center justify-center">
                  <span
                    className={`rounded-full border-2 ${marked ? 'size-4 border-amber-700' : 'size-3 border-stone-400'} ${
                      isEnd ? 'bg-amber-700' : 'bg-white'
                    }`}
                  />
                </span>
                <span
                  className={`text-sm ${marked ? 'font-semibold text-amber-800' : 'text-stone-600'}`}
                >
                  {point.label}
                </span>
                <span className="h-4 text-xs font-semibold leading-4 tracking-wide text-amber-800">
                  {isStart ? '시작' : isEnd ? '끝' : ''}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
