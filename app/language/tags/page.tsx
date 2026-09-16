'use client';

import {
  useDeleteSituationTag,
  useRenameSituationTag,
  useSituationTagsWithCount,
} from '@/entities/language/hooks';
import { ArrowLeft, Check, Edit2, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TagManagementPage() {
  const router = useRouter();
  const { data: tags, isLoading } = useSituationTagsWithCount();
  const renameTag = useRenameSituationTag();
  const deleteTags = useDeleteSituationTag();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // 미사용 태그 위로, 그 다음 이름순 정렬
  const sorted = [...(tags ?? [])].sort((a, b) => {
    if (a.count === 0 && b.count > 0) return -1;
    if (a.count > 0 && b.count === 0) return 1;
    return a.name.localeCompare(b.name, 'ko');
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleRename = async (id: string) => {
    if (!editValue.trim()) {
      setEditingId(null);
      return;
    }
    const result = await renameTag.mutateAsync({ id, name: editValue.trim() });
    if (result.merged) {
      alert(`"${editValue.trim()}" 태그로 병합되었습니다.`);
    }
    setEditingId(null);
  };

  const handleDeleteOne = (id: string, name: string, count: number) => {
    const message =
      count > 0
        ? `"${name}" 태그를 삭제할까요?\n이 태그가 달린 문장 ${count}개에서도 함께 제거됩니다.`
        : `"${name}" 태그를 삭제할까요?`;
    if (confirm(message)) {
      deleteTags.mutate([id]);
    }
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const totalCount = sorted
      .filter((t) => selectedIds.has(t.id))
      .reduce((sum, t) => sum + t.count, 0);
    const message =
      totalCount > 0
        ? `선택한 태그 ${ids.length}개를 삭제할까요?\n연결된 문장 총 ${totalCount}건에서도 함께 제거됩니다.`
        : `선택한 태그 ${ids.length}개를 삭제할까요?`;
    if (confirm(message)) {
      deleteTags.mutate(ids, { onSuccess: () => setSelectedIds(new Set()) });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/language')}
          className="flex items-center gap-1 text-[13px] text-neutral-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          언어로
        </button>
        <h1 className="text-[15px] font-medium">태그 관리</h1>
        <button
          onClick={handleBulkDelete}
          disabled={selectedIds.size === 0}
          className="text-[11px] px-2.5 py-1 bg-red-600 text-white rounded-md disabled:opacity-30"
        >
          선택 삭제 ({selectedIds.size})
        </button>
      </div>

      {isLoading && <p className="text-sm text-neutral-400">불러오는 중...</p>}

      <div className="flex flex-col gap-1.5">
        {sorted.map((tag) => (
          <div
            key={tag.id}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md border ${
              tag.count === 0
                ? 'border-dashed border-neutral-300 dark:border-neutral-700'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(tag.id)}
              onChange={() => toggleSelect(tag.id)}
              className="h-3.5 w-3.5"
            />

            {editingId === tag.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(tag.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="flex-1 text-[13px] border rounded-md px-2 py-1"
              />
            ) : (
              <span className="flex-1 text-[13px]">{tag.name}</span>
            )}

            <span className="text-[11px] text-neutral-400 w-14 text-right">
              {tag.count}개 사용
            </span>

            {editingId === tag.id ? (
              <>
                <button onClick={() => handleRename(tag.id)}>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </button>
                <button onClick={() => setEditingId(null)}>
                  <X className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(tag.id, tag.name)}>
                  <Edit2 className="h-3.5 w-3.5 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleDeleteOne(tag.id, tag.name, tag.count)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {!isLoading && sorted.length === 0 && (
        <p className="text-sm text-neutral-400">등록된 태그가 없습니다.</p>
      )}
    </div>
  );
}
