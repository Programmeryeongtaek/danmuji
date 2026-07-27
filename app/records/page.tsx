'use client';

import { activeRecordTabAtom } from '@/components/records/atoms';
import { RecordCard } from '@/components/records/RecordCard';
import { RecordDetailModal } from '@/components/records/RecordDetailModal';
import {
  editingRecordAtom,
  isRecordFormOpenAtom,
  recordFormTypeAtom,
} from '@/components/records/recordFormAtoms';
import { RecordFormModal } from '@/components/records/RecordFormModal';
import { RecordTabs } from '@/components/records/RecordTabs';
import {
  useCreateQuote,
  useDeleteQuote,
  useUpdateQuote,
} from '@/entities/quote/hook';
import { recordFeedKeys, useRecordsFeed } from '@/entities/record/hook';
import {
  useCreateSaying,
  useDeleteSaying,
  useUpdateSaying,
} from '@/entities/saying/hook';
import {
  useCreateThought,
  useDeleteThought,
  useUpdateThought,
} from '@/entities/thought/hook';
import { selectedRecordAtom } from '@/shared/atoms/recordModalAtoms';
import { RecordDraft, RecordItem } from '@/types/record';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Plus, Search } from 'lucide-react';

export default function RecordsPage() {
  const queryClient = useQueryClient();
  const { data: records = [], isLoading, isError } = useRecordsFeed();

  const [activeTab, setActiveTab] = useAtom(activeRecordTabAtom);
  const [selectedRecord, setSelectedRecord] = useAtom(selectedRecordAtom);
  const setIsFormOpen = useSetAtom(isRecordFormOpenAtom);
  const setFormType = useSetAtom(recordFormTypeAtom);
  const setEditingRecord = useSetAtom(editingRecordAtom);
  const editingRecord = useAtomValue(editingRecordAtom);

  const createQuote = useCreateQuote();
  const createThought = useCreateThought();
  const createSaying = useCreateSaying();

  const updateQuote = useUpdateQuote();
  const updateThought = useUpdateThought();
  const updateSaying = useUpdateSaying();

  const deleteQuote = useDeleteQuote();
  const deleteThought = useDeleteThought();
  const deleteSaying = useDeleteSaying();

  const isSubmitting =
    createQuote.isPending ||
    createThought.isPending ||
    createSaying.isPending ||
    updateQuote.isPending ||
    updateThought.isPending ||
    updateSaying.isPending;

  const filteredRecords: RecordItem[] =
    activeTab === 'all'
      ? records
      : records.filter((record) => record.record_type === activeTab);

  const handleAddClick = () => {
    setEditingRecord(null);
    if (activeTab !== 'all') {
      setFormType(activeTab);
    }
    setIsFormOpen(true);
  };

  // records_feed 뷰는 별도 쿼리 키로 캐싱되어 있어서, 각 타입 테이블에
  // insert/update/delete가 성공한 뒤 recordFeedKeys도 같이 무효화
  const invalidateFeed = () => {
    queryClient.invalidateQueries({ queryKey: recordFeedKeys.all });
  };

  const handleCreateRecord = (draft: RecordDraft) => {
    const onSuccess = () => {
      invalidateFeed();
      setIsFormOpen(false);
    };

    if (draft.record_type === 'quote') {
      createQuote.mutate(draft, { onSuccess });
    } else if (draft.record_type === 'saying') {
      createSaying.mutate(draft, { onSuccess });
    } else {
      createThought.mutate(draft, { onSuccess });
    }
  };

  const handleUpdateRecord = (id: string, draft: RecordDraft) => {
    const onSuccess = () => {
      invalidateFeed();
      setIsFormOpen(false);
      setEditingRecord(null);
    };

    if (draft.record_type === 'quote') {
      updateQuote.mutate({ id, input: draft }, { onSuccess });
    } else if (draft.record_type === 'saying') {
      updateSaying.mutate({ id, input: draft }, { onSuccess });
    } else {
      updateThought.mutate({ id, input: draft }, { onSuccess });
    }
  };

  const handleDeleteRecord = (record: RecordItem) => {
    const onSuccess = () => {
      invalidateFeed();
      setSelectedRecord(null);
    };

    if (record.record_type === 'quote') {
      deleteQuote.mutate(record.id, { onSuccess });
    } else if (record.record_type === 'saying') {
      deleteSaying.mutate(record.id, { onSuccess });
    } else {
      deleteThought.mutate(record.id, { onSuccess });
    }
  };

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <RecordTabs activeTab={activeTab} onChange={setActiveTab} />
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 rounded-md border border-neutral-300 px-3 py-1.5 text-[12.5px] dark:border-neutral-700"
        >
          <Plus className="h-3.5 w-3.5" />
          추가
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md bg-neutral-50 px-2.5 py-1.5 dark:bg-neutral-900">
        <Search className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-xs text-neutral-400">
          책 제목, 저자, 태그로 검색
        </span>
      </div>

      {isLoading && (
        <p className="py-8 text-center text-[13px] text-neutral-400">
          불러오는 중...
        </p>
      )}

      {isError && (
        <p className="py-8 text-center text-[13px] text-red-500">
          기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {!isLoading && !isError && filteredRecords.length === 0 && (
        <p className="py-8 text-center text-[13px] text-neutral-400">
          아직 기록이 없어요. 첫 기록을 추가해보세요.
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {filteredRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onOpen={setSelectedRecord}
          />
        ))}
      </div>

      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onDelete={handleDeleteRecord}
      />
      <RecordFormModal
        key={editingRecord?.id ?? 'new'}
        onCreate={handleCreateRecord}
        onUpdate={handleUpdateRecord}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
