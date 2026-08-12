import { supabase } from '@/shared/lib/supabase';

export interface SearchKeywordResult {
  type: "keyword";
  id: string;
  term: string;
  definition: string;
}

export interface SearchChapterResult {
  type: "chapter";
  id: string;
  bookId: string;
  title: string;
  bookTitle: string;
}

export interface SearchNewsResult {
  type: "news";
  id: string;
  title: string;
  source: string | null;
  publishedDate: string | null;
}

export interface UnifiedSearchResult {
  keywords: SearchKeywordResult[];
  chapters: SearchChapterResult[];
  news: SearchNewsResult[];
}

export async function searchAll(query: string): Promise<UnifiedSearchResult> {
  const pattern = `%${query}%`;

  const [keywordsRes, chaptersRes, newsRes] = await Promise.all([
    supabase
      .from("economic_keywords")
      .select("id, term, definition")
      .or(`term.ilike.${pattern},definition.ilike.${pattern}`),
    supabase
      .from("book_chapters")
      .select("id, book_id, title, content, book_summaries(title)")
      .or(`title.ilike.${pattern},content.ilike.${pattern}`),
    supabase
      .from("news_summaries")
      .select("id, title, source, published_date, summary")
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`),
  ]);

  if (keywordsRes.error) throw keywordsRes.error;
  if (chaptersRes.error) throw chaptersRes.error;
  if (newsRes.error) throw newsRes.error;

  return {
    keywords: (keywordsRes.data ?? []).map((k) => ({
      type: "keyword" as const,
      id: k.id,
      term: k.term,
      definition: k.definition,
    })),
    chapters: (chaptersRes.data ?? []).map((c: Record<string, unknown>) => ({
      type: "chapter" as const,
      id: c.id as string,
      bookId: c.book_id as string,
      title: c.title as string,
      bookTitle: (c.book_summaries as { title: string } | null)?.title ?? "",
    })),
    news: (newsRes.data ?? []).map((n) => ({
      type: "news" as const,
      id: n.id,
      title: n.title,
      source: n.source,
      publishedDate: n.published_date,
    })),
  };
}