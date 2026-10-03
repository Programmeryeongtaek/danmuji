'use client';

import { useCreateSelfCapitalItem } from '@/entities/self-capital/hook';
import { CapitalType } from '@/types/selfCapital';
import { useId, useState } from 'react';

interface AddItemFormProps {
  capital: CapitalType;
  capitalName: string;
}

export default function AddItemForm({
  capital,
  capitalName,
}: AddItemFormProps) {
  const inputId = useId();
  const [content, setContent] = useState('');
  const create = useCreateSelfCapitalItem();

  const submit = () => {
    const trimmed = content.trim();
    if (!trimmed || create.isPending) return;
    create.mutate(
      { capital, content: trimmed },
      {
        onSuccess: () => setContent(''),
      },
    );
  };

  return (
    <div className="flex flex-col gap-1.5 pt-3">
      <div className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          {capitalName} 문항 추가
        </label>
        <input
          id={inputId}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit();
          }}
          placeholder="새 문항 — 예: 꾸준히 파고드는 분야가 있다"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-stone-300 px-3 text-[15px] text-stone-800 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!content.trim() || create.isPending}
          className="min-h-11 shrink-0 rounded-lg border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {create.isError && (
        <p role="alert" className="text-[13px] text-red-700">
          추가하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
