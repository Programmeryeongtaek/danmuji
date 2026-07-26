import { RecordItem } from '@/types/record';

const TYPE_LABEL: Record<RecordItem['record_type'], string> = {
  quote: '문장',
  thought: '생각',
  saying: '명언',
};

// 이 글자 수를 넘으면 카드에서 3줄로 잘라 보여주고 "전체보기" 노출
const TRUNCATE_THRESHOLD = 80;

function getSubtitle(record: RecordItem): string {
  if (record.record_type === 'quote') {
    const page = record.page_number ? ` · p.${record.page_number}` : '';
    return `${record.book_title} · ${record.author}${page}`;
  }
  if (record.record_type === 'saying') {
    return record.context
      ? `${record.source_person} · ${record.context}`
      : record.source_person;
  }
  return new Date(record.created_at).toLocaleDateString('ko-KR');
}

interface RecordCardProps {
  record: RecordItem;
  onOpen: (record: RecordItem) => void;
}

export function RecordCard({ record, onOpen }: RecordCardProps) {
  const isLong = record.content.length > TRUNCATE_THRESHOLD;
  const isQuoteLike =
    record.record_type === 'quote' || record.record_type === 'saying';

  return (
    <button
      type="button"
      onClick={() => onOpen(record)}
      className="flex w-full flex-col rounded-xl bg-neutral-50 p-4 text-left dark:bg-neutral-900"
    >
      <span className="mb-1.5 text-[10.5px] text-neutral-400 dark:text-neutral-500">
        {TYPE_LABEL[record.record_type]}
      </span>

      <p
        className={`mb-2 text-[15px] leading-relaxed ${
          isQuoteLike ? 'font-serif' : ''
        } ${isLong ? 'line-clamp-3' : ''}`}
      >
        {isQuoteLike ? `"${record.content}"` : record.content}
      </p>

      {isLong && (
        <p className="mb-2 text-[11px] text-amber-700 dark:text-amber-400">
          전체보기
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span className="text-[11.5px] text-neutral-400 dark:text-neutral-500">
          {getSubtitle(record)}
        </span>
        <div className="flex gap-1">
          {record.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-amber-100 px-2 py-0.5 text-[10.5px] text-amber-700 dark:bg-amber-950 dark:text-amber-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
