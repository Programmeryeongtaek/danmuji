import { VerdictFilterValue } from './compare';
import { VERDICT_META } from './constants';

const OPTIONS: { value: VerdictFilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'buy', label: VERDICT_META.buy.label },
  { value: 'watch', label: VERDICT_META.watch.label },
  { value: 'hold', label: VERDICT_META.hold.label },
];

interface VerdictFilterProps {
  value: VerdictFilterValue;
  counts: Record<VerdictFilterValue, number>;
  onChange: (value: VerdictFilterValue) => void;
}

export function VerdictFilter({ value, counts, onChange }: VerdictFilterProps) {
  return (
    <div role="group" aria-label="판정 필터" className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`min-h-10 rounded-full border px-4 text-sm ${
              selected
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900'
            }`}
          >
            {option.label} {counts[option.value]}
          </button>
        );
      })}
    </div>
  );
}
