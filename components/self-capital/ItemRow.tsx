'use client';

import {
  useDeleteSelfCapitalItem,
  useSetSelfCapitalItemActive,
  useUpdateSelfCapitalItem,
} from '@/entities/self-capital/hook';
import {
  CapitalType,
  SelfCapitalItem,
  SelfCapitalItemUpdate,
} from '@/types/selfCapital';
import { useId, useState } from 'react';
import { CAPITALS } from './constants';

interface ItemRowProps {
  item: SelfCapitalItem;
  /** 점수 기록이 있는 문항인지 */
  used: boolean;
}

const actionButton =
  'min-h-10 rounded-lg px-3 text-sm text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-50';

export default function ItemRow({ item, used }: ItemRowProps) {
  const inputId = useId();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const [capital, setCapital] = useState<CapitalType>(item.capital);

  const update = useUpdateSelfCapitalItem();
  const remove = useDeleteSelfCapitalItem();
  const setActive = useSetSelfCapitalItemActive();
  const busy = update.isPending || remove.isPending || setActive.isPending;

  const startEdit = () => {
    setContent(item.content);
    setCapital(item.capital);
    setEditing(true);
  };

  const save = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const patch: SelfCapitalItemUpdate = {};
    if (trimmed !== item.content) patch.content = trimmed;
    if (!used && capital !== item.capital) patch.capital = capital;

    if (Object.keys(patch).length === 0) {
      setEditing(false);
      return;
    }
    update.mutate(
      { id: item.id, update: patch },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleRemove = () => {
    if (used) {
      const ok = window.confirm(
        '이 문항에는 점수 기록이 있어 삭제 대신 숨깁니다.\n앞으로의 점검에는 나오지 않고, 지난 기록과의 비교에는 남습니다.\n숨길까요?',
      );
      if (ok) setActive.mutate({ id: item.id, isActive: false });
      return;
    }
    if (window.confirm('이 문항을 삭제할까요? 되돌릴 수 없습니다.')) {
      remove.mutate(item.id);
    }
  };

  // 숨긴 문항: 다시 보이기만 가능
  if (!item.is_active) {
    return (
      <li className="flex min-h-12 items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-b-0">
        <span className="text-base text-stone-500">{item.content}</span>
        <button
          type="button"
          disabled={busy}
          onClick={() => setActive.mutate({ id: item.id, isActive: true })}
          className={actionButton}
        >
          다시 보이기
        </button>
      </li>
    );
  }

  if (editing) {
    return (
      <li className="flex flex-col gap-3 border-b border-stone-100 py-4">
        <label htmlFor={inputId} className="sr-only">
          문항 내용
        </label>
        <input
          id={inputId}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) save();
            if (e.key === 'Escape') setEditing(false);
          }}
          autoFocus
          className="min-h-11 rounded-lg border border-stone-300 px-3 text-base text-stone-800 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            자본
            <select
              value={capital}
              disabled={used}
              onChange={(e) => setCapital(e.target.value as CapitalType)}
              className="min-h-10 rounded-lg border border-stone-300 bg-white px-2 text-sm text-stone-800 disabled:bg-stone-100 disabled:text-stone-500"
            >
              {CAPITALS.map((c) => (
                <option key={c.type} value={c.type}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {used && (
            <span className="text-sm text-stone-500">
              점수 기록이 있어 분류는 바꿀 수 없습니다
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500">
          뜻이 달라진다면 수정 대신 새 문항으로 추가해 주세요.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={actionButton}
          >
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy || !content.trim()}
            className="min-h-10 rounded-lg bg-amber-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-50"
          >
            저장
          </button>
          {update.isError && (
            <span role="alert" className="text-sm text-red-700">
              저장하지 못했습니다.
            </span>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="flex min-h-14 items-center justify-between gap-3 border-b border-stone-100 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-base text-stone-800">{item.content}</span>
        {used && (
          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
            기록 있음
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={startEdit}
          disabled={busy}
          className={actionButton}
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={busy}
          className={`${actionButton} hover:text-red-700`}
        >
          {used ? '숨기기' : '삭제'}
        </button>
      </div>
    </li>
  );
}
