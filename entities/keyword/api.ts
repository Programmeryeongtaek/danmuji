import { supabase } from '@/shared/lib/supabase';
import { Keyword, KeywordFormValues, KeywordStatus, KeywordUpdateValues, KeywordWithRelatedCount } from '@/types/keyword';
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

const GRAPH_BATCH_SIZE = 100;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function fetchKeywordGraph(): Promise<{
  nodes: KeywordGraphNode[];
  links: KeywordGraphLink[];
}> {
  const { data: keywords, error: keywordError } = await supabase
    .from("economic_keywords")
    .select("id, term, status");

  if (keywordError) throw keywordError;

  const ids = (keywords ?? []).map((k) => k.id);
  if (ids.length === 0) return { nodes: [], links: [] };

  const batches = chunkArray(ids, GRAPH_BATCH_SIZE);
  const allLinks: { source_id: string; target_id: string; source_type: string; target_type: string }[] = [];

  for (const batch of batches) {
    const idList = batch.join(",");
    const { data: links, error: linkError } = await supabase
      .from("content_links")
      .select("source_id, target_id, source_type, target_type")
      .eq("source_type", "keyword")
      .eq("target_type", "keyword")
      .or(`source_id.in.(${idList}),target_id.in.(${idList})`);

    if (linkError) throw linkError;
    allLinks.push(...(links ?? []));
  }

  // 배치를 나눠 조회하면 같은 링크가 두 번(양쪽 배치에서 각각) 잡힐 수 있어 중복 제거
  const seen = new Set<string>();
  const uniqueLinks = allLinks.filter((l) => {
    const key = [l.source_id, l.target_id].sort().join("-");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    nodes: keywords ?? [],
    links: uniqueLinks.map((l) => ({ source: l.source_id, target: l.target_id })),
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
  payload: KeywordUpdateValues
): Promise<Keyword> {
  const normalized = { ...payload };

  if (payload.status === "review") {
    normalized.review_marked_at = new Date().toISOString();
  } else if (payload.status !== undefined) {
    normalized.review_marked_at = null;
  }

  const { data, error } = await supabase
    .from("economic_keywords")
    .update(normalized)
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