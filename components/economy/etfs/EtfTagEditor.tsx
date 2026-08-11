'use client';

import { useUpdateEtf } from '@/entities/economy/etf/hooks';
import { useState } from 'react';

export function EtfTagEditor({
  etfId,
  tags,
}: {
  etfId: string;
  tags: string[] | null;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState((tags ?? []).join(', '));
  const updateEtf = useUpdateEtf(etfId);

  async function handleSave() {
    const parsed = draft
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await updateEtf.mutateAsync({ tags: parsed });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="태그를 쉼표로 구분 (예: 반도체, 배당)"
          autoFocus
          className="text-xs border border-neutral-200 rounded px-2 py-1 flex-1"
        />
        <button onClick={handleSave} className="text-xs text-amber-700">
          저장
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {(tags ?? []).map((tag) => (
        <span
          key={tag}
          className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded"
        >
          {tag}
        </span>
      ))}
      <button
        onClick={() => setEditing(true)}
        className="text-[10px] text-neutral-300"
      >
        {tags && tags.length > 0 ? '편집' : '+ 태그'}
      </button>
    </div>
  );
}
