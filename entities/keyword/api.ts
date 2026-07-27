import { supabase } from '@/shared/lib/supabase';
import { Keyword, KeywordFormValues, KeywordWithRelatedCount } from '@/types/keyword';
import { deleteLinksForItem, fetchRelatedCounts } from '../economy/relatedLinks/api';

export async function fetchKeywords(): Promise<Keyword[]> {
  const { data, error } = await supabase
    .from("economic_keywords")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchKeywordsWithRelatedCount(): Promise<KeywordWithRelatedCount[]> {
  const keywords = await fetchKeywords();
  if (keywords.length === 0) return [];

  const counts = await fetchRelatedCounts(keywords.map((k) => k.id));

  return keywords.map((k) => ({ ...k, relatedCount: counts[k.id] ?? 0 }));
}

export async function fetchKeywordById(keywordId: string): Promise<Keyword> {
  const { data, error } = await supabase
    .from("economic_keywords")
    .select("*")
    .eq("id", keywordId)
    .single();

  if (error) throw error;
  return data;
}

export async function createKeyword(payload: KeywordFormValues): Promise<Keyword> {
  const { data, error } = await supabase
    .from("economic_keywords")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateKeyword(
  keywordId: string,
  payload: Partial<KeywordFormValues>
): Promise<Keyword> {
  const { data, error } = await supabase
    .from("economic_keywords")
    .update(payload)
    .eq("id", keywordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteKeyword(keywordId: string): Promise<void> {
  await deleteLinksForItem(keywordId);
  const { error } = await supabase.from("economic_keywords").delete().eq("id", keywordId);
  if (error) throw error;
}