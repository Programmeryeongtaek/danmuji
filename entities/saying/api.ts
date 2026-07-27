import { supabase } from "@/shared/lib/supabase";
import type { Saying } from "@/types/record";

export type CreateSayingInput = Pick<
  Saying,
  "content" | "source_person" | "context" | "tags"
>;

export async function fetchSayings(): Promise<Saying[]> {
  const { data, error } = await supabase
    .from("sayings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: "saying" as const }));
}

// TODO: 로그인 기능 추가 시 user_id를 다시 포함시키기
export async function createSaying(
  input: CreateSayingInput
): Promise<Saying> {
  const { content, source_person, context, tags } = input;

  const { data, error } = await supabase
    .from("sayings")
    .insert({ content, source_person, context, tags })
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "saying" as const };
}

export async function updateSaying(id: string, input: CreateSayingInput): Promise<Saying> {
  const { content, source_person, context, tags } = input;

  const { data, error } = await supabase
    .from("sayings")
    .update({ content, source_person, context, tags })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return { ...data, record_type: "saying" as const };
}

export async function deleteSaying(id: string): Promise<void> {
  const { error } = await supabase.from("sayings").delete().eq("id", id);
  if (error) throw error;
}