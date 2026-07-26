import { supabase } from '@/shared/lib/supabase';
import { Saying } from '@/types/Record';

type CreateSayingInput = Pick<Saying, 'content' | 'source_person' | 'context' | 'tags'>;

export async function fetchSayings(): Promise<Saying[]> {
  const { data, error } = await supabase
    .from('sayings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map((row) => ({ ...row, record_type: 'saying' as const }));
}

export async function createSaying(input: CreateSayingInput): Promise<Saying> {
  const { data, error } = await supabase
    .from("sayings")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return { ...data, record_type: "saying" as const };
}

export async function deleteSaying(id: string): Promise<void> {
  const { error } = await supabase.from('sayings').delete().eq('id', id);
  if (error) throw error;
}