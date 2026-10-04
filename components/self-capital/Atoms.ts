import { CapitalType } from '@/types/selfCapital';
import { atom } from 'jotai';

/** 타임라인에서 '지금'(이번 달 작성 중인 점검)을 가리키는 id */
export const NOW = 'now';

export type CompareHandle = 'start' | 'end';

/** 점검 화면에서 보고 있는 자본 */
export const selectedCapitalAtom = atom<CapitalType>('psychological');

/** 비교 시작점(점검 id). null이면 자동 = 직전 점검 */
export const compareStartAtom = atom<string | null>(null);

/** 비교 끝점(점검 id 또는 NOW) */
export const compareEndAtom = atom<string>(NOW);

/** 타임라인 점을 눌렀을 때 바뀌는 쪽 */
export const activeHandleAtom = atom<CompareHandle>('start');

/** 균형 레이더 차트 펼침 여부 (기본은 접힘) */
export const balanceChartOpenAtom = atom(false);