import { supabase } from '@/shared/lib/supabase';
import { Keyword, KeywordFormValues, KeywordStatus, KeywordWithRelatedCount } from '@/types/keyword';
import { deleteLinksForItem, fetchRelatedCounts } from '../economy/relatedLinks/api';

export interface KeywordGraphNode {
  id: string;
  term: string;
  status: KeywordStatus;
}

export interface KeywordGraphLink {
  source: string;
  target: string;
}

export async function fetchKeywordGraph(): Promise<{
  nodes: KeywordGraphNode[];
  links: KeywordGraphLink[];
}> {
  const { data: keywords, error: keywordError } = await supabase
    .from("economic_keywords")
    .select('id, term, status');

  if (keywordError) throw keywordError;

  const ids = (keywords ?? []).map((k) => k.id);
  if (ids.length === 0) return { nodes: [], links: [] };

  const idList = ids.join(',');
  const { data: links, error: linkError } = await supabase
    .from("content_links")
    .select('source_id, target_id, source_type, target_type')
    .eq('source_type', 'keyword')
    .eq('target_type', 'keyword')
    .or(`source_id.in.(${idList}),target_id.in.(${idList})`);

  if (linkError) throw linkError;

  return {
    nodes: keywords ?? [],
    links: (links ?? []).map((l) => ({ source: l.source_id, target: l.target_id })),
  };
}

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