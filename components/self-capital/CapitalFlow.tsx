import { SCORE_MAX } from './constants';

export interface FlowBar {
  key: string;
  label: string;
  value: number | null;
  role: 'start' | 'end' | 'other';
}

const BAR_COLOR: Record<FlowBar['role'], string> = {
  start: 'bg-stone-400',
  end: 'bg-amber-700',
  other: 'bg-stone-200',
};

/** 막대 최대 높이(px) — 점수에 따라 달라지는 값이라 Tailwind 클래스 대신 style로 지정 */
const BAR_MAX_HEIGHT = 112;

export default function CapitalFlow({
  name,
  bars,
}: {
  name: string;
  bars: FlowBar[];
}) {
  return (
    <section
      aria-label={`${name}의 흐름`}
      className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5"
    >
      <p className="text-sm font-semibold text-stone-700">{name}의 흐름</p>
      <div className="flex h-40 items-end gap-5">
        {bars.map((bar) => (
          <div
            key={bar.key}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span
              className={`text-sm font-semibold tabular-nums ${bar.role === 'end' ? 'text-amber-800' : 'text-stone-600'}`}
            >
              {bar.value === null ? '–' : bar.value.toFixed(1)}
            </span>
            <div
              className={`w-full max-w-14 rounded-t-md ${BAR_COLOR[bar.role]}`}
              style={{
                height: `${Math.round(((bar.value ?? 0) / SCORE_MAX) * BAR_MAX_HEIGHT)}px`,
              }}
            />
            <span className="text-xs text-stone-600">{bar.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
