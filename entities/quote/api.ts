import { supabase } from '@/shared/lib/supabase';
import { Quote } from '@/types/Record';

type CreateQuoteInput = Pick<
  Quote,
  'content' | 'book_title' | 'author' | 'page_number' | 'tags'
>;

export async function fetchQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: 'quote' as const }));
}

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "quote" as const };
}

export async function deleteQuote(id: string): Promise<void> {
  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) throw error;
}