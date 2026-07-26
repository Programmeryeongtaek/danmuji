'use client';

import { activeRecordTabAtom } from '@/components/records/atoms';
import { RecordCard } from '@/components/records/RecordCard';
import { RecordDetailModal } from '@/components/records/RecordDetailModal';
import {
  isRecordFormOpenAtom,
  recordFormTypeAtom,
} from '@/components/records/RecordFormAtoms';
import { RecordFormModal } from '@/components/records/RecordFormModal';
import { RecordTabs } from '@/components/records/RecordTabs';
import { getMockRecordsFeed } from '@/mock/Records';
import { selectedRecordAtom } from '@/shared/atoms/recordModalAtoms';
import { RecordItem } from '@/types/Record';
import { useAtom, useSetAtom } from 'jotai';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

// TODO: Supabase 연동 시 getMockRecordsFeed() 대신 useRecordsFeed() (records_feed 뷰 조회)로 교체
// useState 대신 TanStack Query의 mutation 사용

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>(getMockRecordsFeed());
  const [activeTab, setActiveTab] = useAtom(activeRecordTabAtom);
  const [selectedRecord, setSelectedRecord] = useAtom(selectedRecordAtom);
  const setIsFormOpen = useSetAtom(isRecordFormOpenAtom);
  const setFormType = useSetAtom(recordFormTypeAtom);

  const filteredRecords: RecordItem[] =
    activeTab === 'all'
      ? records
      : records.filter((record) => record.record_type === activeTab);

  const handleAddClick = () => {
    if (activeTab !== 'all') {
      setFormType(activeTab);
    }
    setIsFormOpen(true);
  };

  const handleCreateRecord = (record: RecordItem) => {
    setRecords((prev) => [record, ...prev]);
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
      />
      <RecordFormModal onSubmit={handleCreateRecord} />
    </div>
  );
}
