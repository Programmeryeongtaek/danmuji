import { supabase } from '@/shared/lib/supabase';
import { RelatedItem, RelatedItemType } from '@/types/book';

const BATCH_SIZE = 100;

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

export async function fetchRelatedItems(itemId: string): Promise<RelatedItem[]> {
  const { data: links, error } = await supabase
    .from("content_links")
    .select("*")
    .or(`source_id.eq.${itemId},target_id.eq.${itemId}`);

  if (error) throw error;
  if (!links || links.length === 0) return [];

  const results = await Promise.all(
    links.map(async (link) => {
      const isSource = link.source_id === itemId;
      const relatedType = (isSource ? link.target_type : link.source_type) as RelatedItemType;
      const relatedId = isSource ? link.target_id : link.source_id;

      const { data, error: fetchError } = await supabase
        .from(TARGET_TABLE[relatedType])
        .select("*")
        .eq("id", relatedId)
        .single();

      if (fetchError || !data) return null;

      const row = data as Record<string, unknown>;
      const titleColumn = TARGET_TITLE_COLUMN[relatedType];

      return {
        linkId: link.id,
        type: relatedType,
        id: relatedId,
        title: row[titleColumn] as string,
      } as RelatedItem;
    })
  );

  return results.filter((item): item is RelatedItem => item !== null);
}

export async function fetchRelatedTermsForItems(
  itemIds: string[]
): Promise<Record<string, string[]>> {
  if (itemIds.length === 0) return {};

  const keywordIdsByItem: Record<string, string[]> = {};
  const allKeywordIds = new Set<string>();

  const batches = chunkArray(itemIds, BATCH_SIZE);

  for (const batch of batches) {
    const idList = batch.join(",");
    const { data: links, error } = await supabase
      .from("content_links")
      .select("source_id, target_id, source_type, target_type")
      .or(`source_id.in.(${idList}),target_id.in.(${idList})`);

    if (error) throw error;
    if (!links) continue;

    for (const link of links) {
      const isSourceOurs = batch.includes(link.source_id);
      const ourId = isSourceOurs ? link.source_id : link.target_id;
      const otherType = isSourceOurs ? link.target_type : link.source_type;
      const otherId = isSourceOurs ? link.target_id : link.source_id;

      if (otherType !== "keyword") continue;

      if (!keywordIdsByItem[ourId]) keywordIdsByItem[ourId] = [];
      keywordIdsByItem[ourId].push(otherId);
      allKeywordIds.add(otherId);
    }
  }

  if (allKeywordIds.size === 0) return {};

  const { data: keywords, error: keywordError } = await supabase
    .from("economic_keywords")
    .select("id, term")
    .in("id", Array.from(allKeywordIds));

  if (keywordError) throw keywordError;

  const termById = new Map((keywords ?? []).map((k) => [k.id, k.term]));

  const result: Record<string, string[]> = {};
  for (const [itemId, keywordIds] of Object.entries(keywordIdsByItem)) {
    result[itemId] = keywordIds.map((id) => termById.get(id)).filter((t): t is string => !!t);
  }

  return result;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function fetchRelatedCounts(itemIds: string[]): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};

  const counts: Record<string, number> = {};
  for (const id of itemIds) counts[id] = 0;

  const batches = chunkArray(itemIds, BATCH_SIZE);

  for (const batch of batches) {
    const idList = batch.join(",");
    const { data: links, error } = await supabase
      .from("content_links")
      .select("source_id, target_id")
      .or(`source_id.in.(${idList}),target_id.in.(${idList})`);

    if (error) throw error;

    for (const link of links ?? []) {
      if (counts[link.source_id] !== undefined) counts[link.source_id]++;
      if (counts[link.target_id] !== undefined) counts[link.target_id]++;
    }
  }

  return counts;
}

export async function createLink(
  sourceType: RelatedItemType,
  sourceId: string,
  targetType: RelatedItemType,
  targetId: string,
  relationKind?: "related" | "prerequisite" | "derived"
): Promise<void> {
  const { error } = await supabase.from("content_links").insert({
    source_type: sourceType,
    source_id: sourceId,
    target_type: targetType,
    target_id: targetId,
    relation_kind: relationKind ?? "related",
  });

  if (error) throw error;
}

export async function deleteLink(linkId: string): Promise<void> {
  const { error } = await supabase.from("content_links").delete().eq("id", linkId);
  if (error) throw error;
}

export async function deleteLinksForItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from("content_links")
    .delete()
    .or(`source_id.eq.${itemId},target_id.eq.${itemId}`);

  if (error) throw error;
}