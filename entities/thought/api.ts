import { supabase } from "@/shared/lib/supabase";
import type { Thought } from "@/types/record";

export type CreateThoughtInput = Pick<Thought, "content" | "tags">;

export async function fetchThoughts(): Promise<Thought[]> {
  const { data, error } = await supabase
    .from("thoughts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: "thought" as const }));
}

// TODO: 로그인 기능 추가 시 user_id를 다시 포함시키기
export async function createThought(
  input: CreateThoughtInput
): Promise<Thought> {
  const { content, tags } = input;

  const { data, error } = await supabase
    .from("thoughts")
    .insert({ content, tags })
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "thought" as const };
}

export async function updateThought(id: string, input: CreateThoughtInput): Promise<Thought> {
  const { content, tags } = input;

  const { data, error } = await supabase
    .from("thoughts")
    .update({ content, tags })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "thought" as const };
}

export async function deleteThought(id: string): Promise<void> {
  const { error } = await supabase.from("thoughts").delete().eq("id", id);
  if (error) throw error;
}