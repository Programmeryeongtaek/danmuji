import { capitalMeta } from './constants';
import { formatDelta, ItemChange } from './scoreUtils';

interface ChangeSummaryProps {
  title: string;
  ups: ItemChange[];
  downs: ItemChange[];
  sameCount: number;
  /** 목록마다 보여줄 최대 개수 */
  limit?: number;
}

function ChangeRow({
  change,
  tone,
}: {
  change: ItemChange;
  tone: 'up' | 'down';
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-normal">
      <span
        className={`min-w-8 shrink-0 rounded-full px-1.5 py-px text-center text-xs font-semibold tabular-nums ${
          tone === 'up'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-indigo-100 text-blue-800'
        }`}
      >
        {formatDelta(change.delta)}
      </span>
      <span className="text-stone-800">
        {change.item.content}{' '}
        <span className="text-stone-500">
          · {capitalMeta(change.item.capital).short}
          {!change.item.is_active && ' · 숨김'}
        </span>
      </span>
    </li>
  );
}

export default function ChangeSummary({
  title,
  ups,
  downs,
  sameCount,
  limit = 5,
}: ChangeSummaryProps) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="font-serif text-xl text-stone-900">{title}</h3>
        <p className="text-sm text-stone-600">
          늘어난 문항 {ups.length} · 줄어든 문항 {downs.length} · 그대로{' '}
          {sameCount}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-amber-800">늘어난 것</p>
        {ups.length === 0 ? (
          <p className="text-sm text-stone-600">늘어난 문항이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {ups.slice(0, limit).map((c) => (
              <ChangeRow key={c.item.id} change={c} tone="up" />
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-stone-100 pt-4">
        <p className="text-sm font-semibold text-blue-800">줄어든 것</p>
        {downs.length === 0 ? (
          <p className="text-sm text-stone-600">줄어든 문항이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {downs.slice(0, limit).map((c) => (
              <ChangeRow key={c.item.id} change={c} tone="down" />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
