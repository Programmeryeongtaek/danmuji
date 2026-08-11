import { supabase } from '@/shared/lib/supabase';
import { NewsSummary, NewsSummaryFormValues, NewsSummaryWithRelatedCount } from '@/types/news';
import { deleteLinksForItem, fetchRelatedCounts, fetchRelatedTermsForItems } from '../relatedLinks/api';

export async function fetchNewsSummaries(): Promise<NewsSummary[]> {
  const { data, error } = await supabase
    .from("news_summaries")
    .select("*")
    .order("published_date", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data;
}

export async function fetchNewsSummariesWithRelatedCount(): Promise<NewsSummaryWithRelatedCount[]> {
  const newsList = await fetchNewsSummaries();
  if (newsList.length === 0) return [];

  const ids = newsList.map((n) => n.id);
  const [counts, terms] = await Promise.all([
    fetchRelatedCounts(ids),
    fetchRelatedTermsForItems(ids),
  ]);

  return newsList.map((n) => ({
    ...n,
    relatedCount: counts[n.id] ?? 0,
    relatedTerms: terms[n.id] ?? [],
  }));
}

export async function fetchNewsSummaryById(newsId: string): Promise<NewsSummary> {
  const { data, error } = await supabase
    .from("news_summaries")
    .select("*")
    .eq("id", newsId)
    .single();

  if (error) throw error;
  return data;
}

export async function createNewsSummary(payload: NewsSummaryFormValues): Promise<NewsSummary> {
  const { data, error } = await supabase
    .from("news_summaries")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNewsSummary(
  newsId: string,
  payload: Partial<NewsSummaryFormValues>
): Promise<NewsSummary> {
  const { data, error } = await supabase
    .from("news_summaries")
    .update(payload)
    .eq("id", newsId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNewsSummary(newsId: string): Promise<void> {
  await deleteLinksForItem(newsId);
  const { error } = await supabase.from("news_summaries").delete().eq("id", newsId);
  if (error) throw error;
}