import { supabase } from '@/shared/lib/supabase';

async function uploadToBucket(bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteFromBucket(bucket: string, publicUrl: string): Promise<void> {
  const marker = `/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;

  const path = publicUrl.slice(index + marker.length);
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export function uploadCoverImage(file: File): Promise<string> {
  return uploadToBucket("book-covers", file);
}

export function deleteCoverImage(url: string): Promise<void> {
  return deleteFromBucket("book-covers", url);
}

export function uploadContentImage(file: File): Promise<string> {
  return uploadToBucket("content-images", file);
}