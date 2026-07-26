import { supabase } from '@/shared/lib/supabase';
import { RecordItem } from '@/types/Record';

export async function fetchRecordsFeed(): Promise<RecordItem[]> {
  const { data, error } = await supabase
    .from('records_feed')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // records_feed 뷰는 타입별로 필드가 겹치지 않는 컬럼을 null로 채워서 내려주므로, record_type에 따라 RecordItem 유니온 형태로 좁혀서 반환
  return data.map((row): RecordItem => {
    if (row.record_type === 'quote') {
      return {
        id: row.id,
        record_type: 'quote',
        content: row.content,
        book_title: row.subtitle!,
        author: row.detail!,
        page_number: row.page_number,
        tags: row.tags,
        created_at: row.created_at,
      };
    }
    if (row.record_type === 'saying') {
      return {
        id: row.id,
        record_type: 'saying',
        content: row.content,
        source_person: row.source_person!,
        context: row.context,
        tags: row.tags,
        created_at: row.created_at,
      };
    }
    return {
      id: row.id,
      record_type: 'thought',
      content: row.content,
      tags: row.tags,
      created_at: row.created_at,
    };
  });
}