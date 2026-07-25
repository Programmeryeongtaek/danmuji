export type RecordType = 'quote' | 'thought' | 'saying';

export interface Quote {
  id: string;
  record_type: 'quote';
  content: string;
  book_title: string;
  author: string;
  page_number: number | null;
  tags: string[];
  created_at: string;
}

export interface Thought {
  id: string;
  record_type: 'thought';
  content: string;
  tags: string[];
  created_at: string;
}

export interface Saying {
  id: string;
  record_type: 'saying';
  source_person: string;
  content: string | null;
  tags: string[];
  created_at: string;
}

export type RecordItem = Quote | Thought | Saying;

export type RecordTabKey = 'all' | 'quote' | 'thought' | 'saying';

export interface RecordTab {
  key: RecordTabKey;
  label: string;
}