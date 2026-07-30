import { deleteCoverImage } from '@/entities/media/api';
import { supabase } from '@/shared/lib/supabase';
import { Book, BookFormValues } from '@/types/book';

export async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("book_summaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchBookById(bookId: string): Promise<Book> {
  const { data, error } = await supabase
    .from("book_summaries")
    .select("*")
    .eq("id", bookId)
    .single();

  if (error) throw error;
  return data;
}

export async function createBook(
  payload: BookFormValues): Promise<Book> {
  const { data, error } = await supabase
    .from("book_summaries")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBook(
  bookId: string,
  payload: Partial<BookFormValues>
): Promise<Book> {
  const { data, error } = await supabase
    .from("book_summaries")
    .update(payload)
    .eq("id", bookId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBook(bookId: string): Promise<void> {
  const { data: book } = await supabase
    .from('book_summaries')
    .select('cover_url')
    .eq('id', bookId)
    .single();

  if (book?.cover_url) {
    await deleteCoverImage(book.cover_url);
  }
  const { error } = await supabase.from("book_summaries").delete().eq("id", bookId);
  if (error) throw error;
}