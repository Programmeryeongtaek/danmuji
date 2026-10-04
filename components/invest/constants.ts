import { CriterionKind, Verdict } from '@/types/invest';

export const SCALE_MIN = 1;
export const SCALE_MAX = 5;
/** 척도 항목이 '필수'일 때 통과로 보는 최소 점수 */
export const SCALE_REQUIRED_PASS = 3;

export const KIND_LABEL: Record<CriterionKind, string> = {
  bool: '예/아니오',
  number: '수치',
  scale: `척도 ${SCALE_MIN}–${SCALE_MAX}`,
};

export const VERDICT_META: Record<Verdict, { label: string; badgeClass: string }> = {
  buy: {
    label: '매수 검토',
    badgeClass: 'border border-amber-800 bg-amber-800 text-white dark:border-amber-600 dark:bg-amber-600',
  },
  watch: {
    label: '관망',
    badgeClass:
      'border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  hold: {
    label: '보류',
    badgeClass:
      'border border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
  },
};