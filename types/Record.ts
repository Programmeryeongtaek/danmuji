export type RecordType = "quote" | "thought" | "saying";

export interface Quote {
  id: string;
  record_type: "quote";
  content: string;
  book_title: string;
  author: string;
  page_number: number | null;
  tags: string[];
  created_at: string;
}

export interface Thought {
  id: string;
  record_type: "thought";
  content: string;
  tags: string[];
  created_at: string;
}

export interface Saying {
  id: string;
  record_type: "saying";
  content: string;
  source_person: string;
  context: string | null;
  tags: string[];
  created_at: string;
}

export type RecordItem = Quote | Thought | Saying;

export type RecordDraft =
  | Omit<Quote, "id" | "created_at">
  | Omit<Thought, "id" | "created_at">
  | Omit<Saying, "id" | "created_at">;

export type RecordTabKey = "all" | "quote" | "thought" | "saying";

export interface RecordTab {
  key: RecordTabKey;
  label: string;
}