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

/**
 * 두 시점 모두 응답한 문항만으로 본 평균 변화.
 * 문항을 추가하거나 숨겨서 생기는 평균의 착시를 막기 위해, 문항별 변화의 평균으로 계산.
 */
export function averageDelta(
  items: SelfCapitalItem[],
  start: ScoreMap,
  end: ScoreMap,
): number | null {
  const deltas = items
    .filter((item) => typeof start[item.id] === 'number' && typeof end[item.id] === 'number')
    .map((item) => end[item.id] - start[item.id]);
  if (deltas.length === 0) return null;
  return deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
}

export interface ItemChange {
  item: SelfCapitalItem;
  from: number;
  to: number;
  delta: number;
}

/** 두 시점 모두 응답한 문항의 변화를 늘어난 것 / 줄어든 것 / 그대로로 나눔 */
export function diffItems(items: SelfCapitalItem[], start: ScoreMap, end: ScoreMap) {
  const changes: ItemChange[] = [];
  for (const item of items) {
    const from = start[item.id];
    const to = end[item.id];
    if (typeof from === 'number' && typeof to === 'number') {
      changes.push({ item, from, to, delta: to - from });
    }
  }
  return {
    ups: changes.filter((c) => c.delta > 0).sort((a, b) => b.delta - a.delta),
    downs: changes.filter((c) => c.delta < 0).sort((a, b) => a.delta - b.delta),
    sameCount: changes.filter((c) => c.delta === 0).length,
  };
}
 