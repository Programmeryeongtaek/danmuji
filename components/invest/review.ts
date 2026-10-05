import { InvestStock } from '@/types/invest';
import { CompareColumn } from './compare';

/** 점검일을 정하지 않았을 때, 이만큼 지나면 다시 볼 종목으로 */
export const REVIEW_STALE_DAYS = 90;
/** 점검일을 처음 정할 때 기본으로 제안하는 기간 */
const DEFAULT_REVIEW_MONTHS = 3;

const pad = (value: number) => String(value).padStart(2, '0');

/** 로컬 기준 'YYYY-MM-DD' */
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** '2027-01-15' → '2027.01.15' */
export function formatDay(dateString: string): string {
  return dateString.split('-').join('.');
}

export function defaultNextReviewDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + DEFAULT_REVIEW_MONTHS);
  return toDateString(date);
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export interface DueReview {
  stock: InvestStock;
  reason: string;
}

export function findDueReviews(columns: CompareColumn[]): DueReview[] {
  const today = toDateString(new Date());

  return columns.flatMap(({ stock, evaluation }) => {
    const evaluatedDay = toDateString(new Date(evaluation.evaluated_at));

    if (stock.next_review_at) {
      const isDue = stock.next_review_at <= today && evaluatedDay < stock.next_review_at;
      return isDue
        ? [{ stock, reason: `정해둔 점검일(${formatDay(stock.next_review_at)})이 지났어요.` }]
        : [];
    }

    const days = daysSince(evaluation.evaluated_at);
    return days >= REVIEW_STALE_DAYS
      ? [{ stock, reason: `마지막 평가 후 ${Math.floor(days / 30)}개월이 지났어요.` }]
      : [];
  });
}