import { DeltaTone } from './scoreUtils';

/** 늘어남 = 앰버, 줄어듦 = 남색. 색만으로 구분되지 않도록 항상 +/− 부호와 함께 씀 */
export const TONE_TEXT: Record<DeltaTone, string> = {
  up: 'text-amber-800',
  down: 'text-blue-800',
  same: 'text-stone-500',
};

export const TONE_BADGE: Record<DeltaTone, string> = {
  up: 'bg-amber-100 text-amber-800',
  down: 'bg-indigo-100 text-blue-800',
  same: 'bg-stone-100 text-stone-500',
};