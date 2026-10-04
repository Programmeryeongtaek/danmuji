import type { CapitalType } from '@/types/selfCapital';

export interface CapitalMeta {
  type: CapitalType;
  name: string;
  short: string;
  desc: string;
}

/** 순서 = 화면 목록 순서 = 레이더 축 순서 */
export const CAPITALS: CapitalMeta[] = [
  { type: 'psychological', name: '심리자본', short: '심리', desc: '불확실함을 견디고 길게 보는 내적 힘' },
  { type: 'cultural', name: '문화자본', short: '문화', desc: '취향과 그것을 알아보는 감식안' },
  { type: 'knowledge', name: '지식자본', short: '지식', desc: '무엇을 알고, 어떻게 배우는가' },
  { type: 'economic', name: '경제자본', short: '경제', desc: '돈의 양보다 돈을 대하는 태도' },
  { type: 'physical', name: '신체자본', short: '신체', desc: '몸과 자세, 차림이 주는 인상' },
  { type: 'linguistic', name: '언어자본', short: '언어', desc: '말과 글의 격과 유연함' },
  { type: 'social', name: '사회자본', short: '사회', desc: '관계망의 넓이와 질' },
];

export const capitalMeta = (type: CapitalType): CapitalMeta =>
  CAPITALS.find((c) => c.type === type) ?? CAPITALS[0];

/** 점수 범위 — DB check 제약(1~10)과 반드시 같게 유지 */
export const SCORE_MIN = 1;
export const SCORE_MAX = 10;
export const SCORE_SCALE = Array.from(
  { length: SCORE_MAX - SCORE_MIN + 1 },
  (_, i) => SCORE_MIN + i,
);