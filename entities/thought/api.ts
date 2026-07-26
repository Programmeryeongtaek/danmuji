import { supabase } from '@/shared/lib/supabase';
import { Thought } from '@/types/Record';

type CreateThoughtInput = Pick<Thought, 'content' | 'tags'>;

export async function fetchThoughts(): Promise<Thought[]> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: 'thought' as const }));
}

export async function createThought(input: CreateThoughtInput): Promise<Thought> {
  const { data, error } = await supabase
    .from("thoughts")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "thought" as const };
}

export async function deleteThought(id: string): Promise<void> {
  const { error } = await supabase.from('thoughts').delete().eq('id', id);
  if (error) throw error;
}