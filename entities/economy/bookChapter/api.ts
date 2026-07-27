import { supabase } from '@/shared/lib/supabase';
import { BookChapter, ChapterFormValues } from '@/types/book';
import { deleteLinksForItem } from '../relatedLinks/api';

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
  await deleteLinksForItem(chapterId);
  const { error } = await supabase.from("book_chapters").delete().eq("id", chapterId);
  if (error) throw error;
}