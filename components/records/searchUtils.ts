
import { RecordItem } from '@/types/record';

// 문장: 내용, 책 제목, 저자, 태그
// 생각: 내용, 태그
// 명언: 내용, 인물명, 맥락, 태그
// TODO: 내용에 대한 검색이 필요할까?
// TODO: 디바운스 기능을 어떻게 적용할 것인가, 게시글 수가 많아졌을 때 어떻게?

export function matchesRecordSearch(
  record: RecordItem,
  query: string,
): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const haystack: string[] = [record.content, ...record.tags];

  if (record.record_type === 'quote') {
    haystack.push(record.book_title, record.author);
  } else if (record.record_type === 'saying') {
    haystack.push(record.source_person, record.context ?? '');
  }

  return haystack.some((field) => field.toLowerCase().includes(trimmed));
}
