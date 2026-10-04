import { ScoreMap, SelfCapitalItem } from '@/types/selfCapital';

/** 오늘 기준 'YYYY-MM' */
export const currentPeriod = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

/** 응답한 문항만으로 평균. 하나도 없으면 null */
export function averageScore(items: SelfCapitalItem[], scores: ScoreMap): number | null {
  const values = items
    .map((item) => scores[item.id])
    .filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** '2026-10' → '2026.10' */
export const formatPeriod = (period: string) => period.replace('-', '.');

/** '2026-10' → '26.10' */
export const shortPeriod = (period: string) => period.slice(2).replace('-', '.');

export type DeltaTone = 'up' | 'down' | 'same';

/** 소수 평균의 미세한 차이(±0.04 이하)는 '그대로'로 봄 */
export const deltaTone = (delta: number): DeltaTone =>
  delta > 0.04 ? 'up' : delta < -0.04 ? 'down' : 'same';

/** +2 / −1 / 0, decimals=1이면 +0.7 */
export function formatDelta(delta: number, decimals: 0 | 1 = 0) {
  const rounded = decimals ? Math.round(delta * 10) / 10 : delta;
  if (deltaTone(rounded) === 'same') return '0';
  const abs = decimals ? Math.abs(rounded).toFixed(1) : String(Math.abs(rounded));
  return `${rounded > 0 ? '+' : '−'}${abs}`;
}

/** 두 'YYYY-MM' 사이의 개월 수 */
export function monthsBetween(from: string, to: string) {
  const [fromYear, fromMonth] = from.split('-').map(Number);
  const [toYear, toMonth] = to.split('-').map(Number);
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
}

/** 12개월 단위면 'n년', 아니면 'n개월' */
export const formatSpan = (months: number) =>
  months > 0 && months % 12 === 0 ? `${months / 12}년` : `${months}개월`;
