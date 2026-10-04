import { Verdict } from '@/types/invest';
import { VERDICT_META } from './constants';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md';
}

export function VerdictBadge({ verdict, size = 'sm' }: VerdictBadgeProps) {
  const meta = VERDICT_META[verdict];
  const sizeClass =
    size === 'md' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}
