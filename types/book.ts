export type BookStatus = 'reading' | 'done';

export interface Book {
  id: string;
  user_id: string | null;
  title: string;
  author: string | null;
  summary: string;
  status: BookStatus;
  tags: string[] | null;
  created_at: string;
}

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_order: number;
  title: string;
  content: string;
  created_at: string;
}

export type RelatedItemType = 'chapter' | 'keyword' | 'news' | 'etf';

export interface RelatedItem {
  type: RelatedItemType;
  id: string;
  title: string;
}