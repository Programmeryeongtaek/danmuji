'use client';

import { RecordItem, RecordType } from '@/types/Record';
import { useAtom } from 'jotai';
import { X } from 'lucide-react';
import { useState } from 'react';
import { isRecordFormOpenAtom, recordFormTypeAtom } from './RecordFormAtoms';

const TYPE_OPTIONS: { key: RecordType; label: string }[] = [
  { key: 'quote', label: '문장' },
  { key: 'thought', label: '생각' },
  { key: 'saying', label: '명언' },
];

function parseTags(tagsInput: string): string[] {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

interface RecordFormModalProps {
  onSubmit: (record: RecordItem) => void;
}

export function RecordFormModal({ onSubmit }: RecordFormModalProps) {
  const [isOpen, setIsOpen] = useAtom(isRecordFormOpenAtom);
  const [formType, setFormType] = useAtom(recordFormTypeAtom);

  const [content, setContent] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [sourcePerson, setSourcePerson] = useState('');
  const [context, setContext] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setContent('');
    setBookTitle('');
    setAuthor('');
    setPageNumber('');
    setSourcePerson('');
    setContext('');
    setTagsInput('');
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const isValid =
    content.trim().length > 0 &&
    (formType !== 'quote' || (bookTitle.trim() && author.trim())) &&
    (formType !== 'saying' || sourcePerson.trim().length > 0);

  const handleSave = () => {
    if (!isValid) return;

    const base = {
      id: crypto.randomUUID(),
      content: content.trim(),
      tags: parseTags(tagsInput),
      created_at: new Date().toISOString(),
    };

    let record: RecordItem;
    if (formType === 'quote') {
      record = {
        ...base,
        record_type: 'quote',
        book_title: bookTitle.trim(),
        author: author.trim(),
        page_number: pageNumber ? Number(pageNumber) : null,
      };
    } else if (formType === 'saying') {
      record = {
        ...base,
        record_type: 'saying',
        source_person: sourcePerson.trim(),
        context: context.trim() || null,
      };
    } else {
      record = { ...base, record_type: 'thought' };
    }

    onSubmit(record);
    resetForm();
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-120 rounded-xl bg-white p-6 dark:bg-neutral-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-medium">새 기록 추가</p>
          <button onClick={handleClose} aria-label="닫기">
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        <div className="mb-3 flex gap-1.5">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => setFormType(option.key)}
              className={`rounded-md px-3 py-1 text-[12.5px] ${
                formType === option.key
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            formType === 'thought'
              ? '오늘의 생각을 적어보세요'
              : '내용을 입력하세요'
          }
          className="mb-3 w-full resize-none rounded-md border border-neutral-200 p-2.5 text-[13.5px] dark:border-neutral-700 dark:bg-neutral-900"
        />

        {formType === 'quote' && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            <input
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              placeholder="책 제목"
              className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="저자"
              className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              value={pageNumber}
              onChange={(event) =>
                setPageNumber(event.target.value.replace(/\D/g, ''))
              }
              placeholder="페이지 (선택)"
              className="col-span-2 rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        )}

        {formType === 'saying' && (
          <div className="mb-3 flex flex-col gap-2">
            <input
              value={sourcePerson}
              onChange={(event) => setSourcePerson(event.target.value)}
              placeholder="인물명"
              className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="맥락 (선택 — 연설, 인터뷰 등)"
              className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        )}

        <input
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="태그 (쉼표로 구분, 예: 습관, 자기계발)"
          className="mb-4 w-full rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-[12.5px] dark:border-neutral-700"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="rounded-md bg-amber-600 px-3 py-1.5 text-[12.5px] text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
