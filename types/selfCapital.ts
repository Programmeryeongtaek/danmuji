/** 일곱 가지 자본 (DB의 capital 컬럼 값과 동일) */
export type CapitalType =
  | 'psychological'
  | 'cultural'
  | 'knowledge'
  | 'economic'
  | 'physical'
  | 'linguistic'
  | 'social';

/** 점검 문항 */
export interface SelfCapitalItem {
  id: string;
  capital: CapitalType;
  content: string;
  sort_order: number;
  /** false = 숨김 (점수 기록이 있어 삭제 대신 숨긴 문항) */
  is_active: boolean;
  created_at: string;
}

/** 문항 추가 */
export interface SelfCapitalItemInput {
  capital: CapitalType;
  content: string;
}

/** 문항 수정 (capital은 점수 기록이 없을 때만 변경 가능) */
export interface SelfCapitalItemUpdate {
  content?: string;
  capital?: CapitalType;
}

/** 월별 점검 회차 */
export interface SelfCapitalCheck {
  id: string;
  /** 'YYYY-MM' */
  period: string;
  memo: string | null;
  created_at: string;
}

/** item_id → 점수(1~10) */
export type ScoreMap = Record<string, number>;

export interface SelfCapitalCheckWithScores extends SelfCapitalCheck {
  scores: ScoreMap;
}

/** 점검 저장 (같은 달이면 덮어쓰기) */
export interface SaveCheckInput {
  period: string;
  scores: ScoreMap;
  memo?: string | null;
}