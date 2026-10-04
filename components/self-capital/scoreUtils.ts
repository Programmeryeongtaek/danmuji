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