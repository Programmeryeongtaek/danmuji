import { CapitalType } from '@/types/selfCapital';
import { atom } from 'jotai';

/** 점검 화면에서 보고 있는 자본 */
export const selectedCapitalAtom = atom<CapitalType>('psychological');