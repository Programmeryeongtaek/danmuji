import { supabase } from '@/shared/lib/supabase';
import { Etf, EtfFormValues } from '@/types/etf';

export async function fetchEtfs(): Promise<Etf[]> {
  const { data, error } = await supabase
    .from("etfs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchEtfById(etfId: string): Promise<Etf> {
  const { data, error } = await supabase
    .from("etfs")
    .select("*")
    .eq("id", etfId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchEtfByTicker(ticker: string, market: string): Promise<Etf | null> {
  const { data, error } = await supabase
    .from("etfs")
    .select("*")
    .eq("ticker", ticker)
    .eq("market", market)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createEtf(payload: EtfFormValues): Promise<Etf> {
  const { data, error } = await supabase
    .from("etfs")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEtf(
  etfId: string,
  payload: Partial<EtfFormValues>
): Promise<Etf> {
  const { data, error } = await supabase
    .from("etfs")
    .update(payload)
    .eq("id", etfId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEtf(etfId: string): Promise<void> {
  const { error } = await supabase.from("etfs").delete().eq("id", etfId);
  if (error) throw error;
}