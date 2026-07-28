import { supabase } from '@/shared/lib/supabase';
import { RelatedItem, RelatedItemType } from '@/types/book';

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

export async function fetchRelatedCounts(itemIds: string[]): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};

  const idList = itemIds.join(",");
  const { data: links, error } = await supabase
    .from("content_links")
    .select("source_id, target_id")
    .or(`source_id.in.(${idList}),target_id.in.(${idList})`);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const id of itemIds) counts[id] = 0;

  for (const link of links ?? []) {
    if (counts[link.source_id] !== undefined) counts[link.source_id]++;
    if (counts[link.target_id] !== undefined) counts[link.target_id]++;
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