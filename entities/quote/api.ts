import { supabase } from "@/shared/lib/supabase";
import type { Quote } from "@/types/record";

export type CreateQuoteInput = Pick<
  Quote,
  "content" | "book_title" | "author" | "page_number" | "tags"
>;

export async function fetchQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: "quote" as const }));
}

// TODO: 로그인 기능 추가 시 user_id를 다시 포함시키고
// (getCurrentUserId 헬퍼 참고), quotes.user_id를 not null + RLS로 되돌리기
export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const { content, book_title, author, page_number, tags } = input;

  const { data, error } = await supabase
    .from("quotes")
    .insert({ content, book_title, author, page_number, tags })
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "quote" as const };
}

export async function updateQuote(
  id: string,
  input: CreateQuoteInput
): Promise<Quote> {
  const { content, book_title, author, page_number, tags } = input;

  const { data, error } = await supabase
    .from("quotes")
    .update({ content, book_title, author, page_number, tags })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "quote" as const };
}

export async function deleteQuote(id: string): Promise<void> {
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  if (error) throw error;
}