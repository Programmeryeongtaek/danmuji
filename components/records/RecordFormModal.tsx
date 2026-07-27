'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { X } from 'lucide-react';
import {
  editingRecordAtom,
  isRecordFormOpenAtom,
  recordFormTypeAtom,
} from './recordFormAtoms';
import { RecordDraft, RecordItem, RecordType } from '@/types/record';

const TYPE_OPTIONS: { key: RecordType; label: string }[] = [
  { key: 'quote', label: '문장' },
  { key: 'thought', label: '생각' },
  { key: 'saying', label: '명언' },
];

interface FormValues {
  content: string;
  bookTitle: string;
  author: string;
  pageNumber: string;
  sourcePerson: string;
  context: string;
  tagsInput: string;
}

const EMPTY_FORM_VALUES: FormValues = {
  content: '',
  bookTitle: '',
  author: '',
  pageNumber: '',
  sourcePerson: '',
  context: '',
  tagsInput: '',
};

// 수정 모드일 때 기존 기록에서 폼 초깃값을 계산
// 타입별 필드는 해당 타입이 아니면 빈 값으로
function getInitialFormValues(record: RecordItem | null): FormValues {
  if (!record) return EMPTY_FORM_VALUES;

  return {
    content: record.content,
    bookTitle: record.record_type === 'quote' ? record.book_title : '',
    author: record.record_type === 'quote' ? record.author : '',
    pageNumber:
      record.record_type === 'quote' && record.page_number
        ? String(record.page_number)
        : '',
    sourcePerson: record.record_type === 'saying' ? record.source_person : '',
    context: record.record_type === 'saying' ? (record.context ?? '') : '',
    tagsInput: record.tags.join(', '),
  };
}

function parseTags(tagsInput: string): string[] {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

interface RecordFormModalProps {
  onCreate: (draft: RecordDraft) => void;
  onUpdate: (id: string, draft: RecordDraft) => void;
  isSubmitting?: boolean;
}

// 두 모달(작성/상세)이 콘텐츠 양과 무관하게 같은 크기감을 유지하도록
// 공용 크기 클래스를 씁니다. RecordDetailModal과 동일한 값입니다.
const MODAL_SIZE_CLASS =
  'w-full max-w-[480px] min-h-[380px] max-h-[85vh] overflow-y-auto flex flex-col';

export function RecordFormModal({
  onCreate,
  onUpdate,
  isSubmitting = false,
}: RecordFormModalProps) {
  const [isOpen, setIsOpen] = useAtom(isRecordFormOpenAtom);
  const [formType, setFormType] = useAtom(recordFormTypeAtom);
  const [editingRecord, setEditingRecord] = useAtom(editingRecordAtom);

  const [values, setValues] = useState<FormValues>(() =>
    getInitialFormValues(editingRecord),
  );

  const isEditing = editingRecord !== null;

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setValues(EMPTY_FORM_VALUES);
    setEditingRecord(null);
    setIsOpen(false);
  };

  const {
    content,
    bookTitle,
    author,
    pageNumber,
    sourcePerson,
    context,
    tagsInput,
  } = values;

  const isValid =
    content.trim().length > 0 &&
    (formType !== 'quote' || (bookTitle.trim() && author.trim())) &&
    (formType !== 'saying' || sourcePerson.trim().length > 0);

  const handleSave = () => {
    if (!isValid) return;

    const base = { content: content.trim(), tags: parseTags(tagsInput) };

    let draft: RecordDraft;
    if (formType === 'quote') {
      draft = {
        ...base,
        record_type: 'quote',
        book_title: bookTitle.trim(),
        author: author.trim(),
        page_number: pageNumber ? Number(pageNumber) : null,
      };
    } else if (formType === 'saying') {
      draft = {
        ...base,
        record_type: 'saying',
        source_person: sourcePerson.trim(),
        context: context.trim() || null,
      };
    } else {
      draft = { ...base, record_type: 'thought' };
    }

    if (isEditing && editingRecord) {
      onUpdate(editingRecord.id, draft);
    } else {
      onCreate(draft);
    }
    setValues(EMPTY_FORM_VALUES);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={handleClose}
    >
      <div
        className={`${MODAL_SIZE_CLASS} rounded-xl bg-white p-6 dark:bg-neutral-900`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-medium">
            {isEditing ? '기록 수정' : '새 기록 추가'}
          </p>
          <button onClick={handleClose} aria-label="닫기">
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        <div className="mb-3 flex gap-1.5">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.key}
              disabled={isEditing}
              onClick={() => setFormType(option.key)}
              className={`rounded-md px-3 py-1 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-50 ${
                formType === option.key
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <textarea
            rows={4}
            value={content}
            onChange={(event) => setField('content', event.target.value)}
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
                onChange={(event) => setField('bookTitle', event.target.value)}
                placeholder="책 제목"
                className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
              />
              <input
                value={author}
                onChange={(event) => setField('author', event.target.value)}
                placeholder="저자"
                className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
              />
              <input
                value={pageNumber}
                onChange={(event) =>
                  setField('pageNumber', event.target.value.replace(/\D/g, ''))
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
                onChange={(event) =>
                  setField('sourcePerson', event.target.value)
                }
                placeholder="인물명"
                className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
              />
              <input
                value={context}
                onChange={(event) => setField('context', event.target.value)}
                placeholder="맥락 (선택 — 연설, 인터뷰 등)"
                className="rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
              />
            </div>
          )}

          <input
            value={tagsInput}
            onChange={(event) => setField('tagsInput', event.target.value)}
            placeholder="태그 (쉼표로 구분, 예: 습관, 자기계발)"
            className="w-full rounded-md border border-neutral-200 p-2 text-[12.5px] dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-[12.5px] dark:border-neutral-700"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isSubmitting}
            className="rounded-md bg-amber-600 px-3 py-1.5 text-[12.5px] text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-700"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
