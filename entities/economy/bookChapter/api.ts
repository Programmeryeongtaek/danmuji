import { supabase } from '@/shared/lib/supabase';
import { BookChapter, ChapterFormValues, RelatedItem, RelatedItemType } from '@/types/book';

export async function fetchChaptersByBookId(bookId: string): Promise<BookChapter[]> {
  const { data, error } = await supabase
    .from("book_chapters")
    .select("*")
    .eq("book_id", bookId)
    .order("chapter_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchChapterById(chapterId: string): Promise<BookChapter> {
  const { data, error } = await supabase
    .from("book_chapters")
    .select("*")
    .eq("id", chapterId)
    .single();

  if (error) throw error;
  return data;
}

// target_type별로 실제 테이블/타이틀 칼럼이 다르므로 매핑 필요
// keyword/new/etf 테이블이 아직 없으므로 스키마 확정 시 이름 맞춰야 한다.
const TARGET_TABLE: Record<RelatedItemType, string> = {
  chapter: "book_chapters",
  keyword: "economic_keywords",
  news: "news_summaries",
  etf: "etfs",
};

const TARGET_TITLE_COLUMN: Record<RelatedItemType, string> = {
  chapter: "title",
  keyword: "term",
  news: "title",
  etf: "name",
};

export async function fetchRelatedItems(chapterId: string): Promise<RelatedItem[]> {
  const { data: links, error } = await supabase
    .from("content_links")
    .select("*")
    .or(`source_id.eq.${chapterId},target_id.eq.${chapterId}`);

  if (error) throw error;
  if (!links || links.length === 0) return [];

  const results = await Promise.all(
    links.map(async (link) => {
      const isSource = link.source_id === chapterId;
      const relatedType = (isSource ? link.target_type : link.source_type) as RelatedItemType;
      const relatedId = isSource ? link.target_id : link.source_id;

      const { data, error: fetchError } = await supabase
  .from(TARGET_TABLE[relatedType])
  .select('*')
  .eq("id", relatedId)
  .single();

if (fetchError || !data) return null;

const row = data as Record<string, unknown>;
const titleColumn = TARGET_TITLE_COLUMN[relatedType];

return {
  type: relatedType,
  id: relatedId,
  title: row[titleColumn] as string,
} as RelatedItem;
    })
  );

  return results.filter((item): item is RelatedItem => item !== null);
}

export async function createChapter(
  bookId: string,
  payload: ChapterFormValues
): Promise<BookChapter> {
  const { data, error } = await supabase
    .from("book_chapters")
    .insert({ ...payload, book_id: bookId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateChapter(
  chapterId: string,
  payload: Partial<ChapterFormValues>
): Promise<BookChapter> {
  const { data, error } = await supabase
    .from("book_chapters")
    .update(payload)
    .eq("id", chapterId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChapter(chapterId: string): Promise<void> {
  await supabase
    .from("content_links")
    .delete()
    .or(`source_id.eq.${chapterId},target_id.eq.${chapterId}`);

  const { error } = await supabase.from("book_chapters").delete().eq("id", chapterId);
  if (error) throw error;
}