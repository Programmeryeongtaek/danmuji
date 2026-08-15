export type KeywordStatus = 'new' | 'review' | 'done';

export interface Keyword {
  id: string;
  user_id: string | null;
  term: string;
  definition: string;
  status: KeywordStatus;
  category: string | null;
  review_marked_at: string | null;
  created_at: string;
}

export interface KeywordWithRelatedCount extends Keyword {
  relatedCount: number;
}

export type KeywordFormValues = Pick<Keyword, "term" | "definition" | "status" | "category">;

export type KeywordUpdateValues = Partial<Pick<Keyword, "term" | "definition" | "status" | "category" | "review_marked_at">>;