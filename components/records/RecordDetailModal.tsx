'use client';

import { RecordItem } from '@/types/Record';
import { X } from 'lucide-react';

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

interface RecordDetailModalProps {
  record: RecordItem | null;
  onClose: () => void;
}

export function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
  if (!record) return null;

  const isQuoteLike =
    record.record_type === 'quote' || record.record_type === 'saying';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-120 rounded-xl bg-white p-6 dark:bg-neutral-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-1 flex justify-end">
          <button onClick={onClose} aria-label="닫기">
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        <p
          className={`mb-4 text-[16px] leading-loose ${
            isQuoteLike ? 'font-serif' : ''
          }`}
        >
          {isQuoteLike ? `"${record.content}"` : record.content}
        </p>

        <p className="mb-3 text-[12.5px] text-neutral-500 dark:text-neutral-400">
          {getSubtitle(record)}
        </p>

        <div className="mb-4 flex gap-1">
          {record.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-amber-100 px-2 py-0.5 text-[10.5px] text-amber-700 dark:bg-amber-950 dark:text-amber-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-[12.5px] dark:border-neutral-700">
            수정
          </button>
          <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-[12.5px] dark:border-neutral-700">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
