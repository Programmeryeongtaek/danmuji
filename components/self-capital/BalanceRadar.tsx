'use client';

import { CAPITALS, SCORE_MAX } from './constants';

/** SVG 좌표계(viewBox 340×300) 안의 중심과 반지름 */
const CX = 170;
const CY = 160;
const RADIUS = 110;
const LABEL_RADIUS = 132;
const AXES = CAPITALS.length;
const RINGS = [1, 0.8, 0.6, 0.4, 0.2];

const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / AXES;

/** 0~1 비율 배열 → polygon points 문자열 */
const toPoints = (ratios: number[]) =>
  ratios
    .map((r, i) => {
      const len = RADIUS * r;
      return `${(CX + len * Math.cos(angle(i))).toFixed(1)},${(CY + len * Math.sin(angle(i))).toFixed(1)}`;
    })
    .join(' ');

const LABELS = CAPITALS.map((c, i) => {
  const cos = Math.cos(angle(i));
  const sin = Math.sin(angle(i));
  return {
    key: c.type,
    text: c.short,
    x: CX + LABEL_RADIUS * cos,
    // 위·아래 축 이름이 원과 겹치지 않게 살짝 밀어냄
    y: CY + LABEL_RADIUS * sin + (sin > 0.5 ? 10 : sin < -0.9 ? -2 : 4),
    anchor: (Math.abs(cos) < 0.1 ? 'middle' : cos > 0 ? 'start' : 'end') as
      | 'middle'
      | 'start'
      | 'end',
  };
});

interface BalanceRadarProps {
  open: boolean;
  onToggle: () => void;
  /** CAPITALS 순서의 자본별 평균. 응답이 없는 자본은 null */
  endValues: (number | null)[];
  endLabel: string;
  /** 비교 시작점의 평균. 없으면 점선을 그리지 않음 */
  startValues?: (number | null)[];
  startLabel?: string;
}

const toRatios = (values: (number | null)[]) =>
  values.map((v) => (v ?? 0) / SCORE_MAX);

export default function BalanceRadar({
  open,
  onToggle,
  endValues,
  endLabel,
  startValues,
  startLabel,
}: BalanceRadarProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="self-capital-balance"
        onClick={onToggle}
        className="flex min-h-14 w-full items-center justify-between px-6 text-left"
      >
        <span className="font-serif text-lg text-stone-900">
          일곱 자본의 균형
        </span>
        <span className="text-sm text-stone-600">
          {open ? '접기' : '펼치기'}
        </span>
      </button>

      {open && (
        <div
          id="self-capital-balance"
          className="flex flex-col gap-4 px-6 pb-6"
        >
          <svg
            viewBox="0 0 340 300"
            className="h-auto w-full"
            role="img"
            aria-label={`일곱 자본 평균 레이더 차트: ${endLabel}${startLabel ? `, 비교 ${startLabel}` : ''}`}
          >
            {RINGS.map((ring) => (
              <polygon
                key={ring}
                points={toPoints(Array(AXES).fill(ring))}
                className="fill-none stroke-stone-200"
              />
            ))}
            {CAPITALS.map((c, i) => (
              <line
                key={c.type}
                x1={CX}
                y1={CY}
                x2={CX + RADIUS * Math.cos(angle(i))}
                y2={CY + RADIUS * Math.sin(angle(i))}
                className="stroke-stone-200"
              />
            ))}
            {startValues && (
              <polygon
                points={toPoints(toRatios(startValues))}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                className="fill-none stroke-stone-500"
              />
            )}
            <polygon
              points={toPoints(toRatios(endValues))}
              strokeWidth={2}
              className="fill-amber-700/15 stroke-amber-700"
            />
            {LABELS.map((l) => (
              <text
                key={l.key}
                x={l.x}
                y={l.y}
                fontSize={13}
                textAnchor={l.anchor}
                className="fill-stone-700"
              >
                {l.text}
              </text>
            ))}
          </svg>

          <div className="flex gap-5 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="w-5 border-t-2 border-amber-700" />
              {endLabel}
            </span>
            {startValues && startLabel && (
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="w-5 border-t-2 border-dashed border-stone-500"
                />
                {startLabel}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
