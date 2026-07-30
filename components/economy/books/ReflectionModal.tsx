'use client';

import { useUpdateBook } from '@/entities/economy/book/hooks';
import { useState } from 'react';

export function ReflectionModal({
  bookId,
  initialReflection,
  onClose,
}: {
  bookId: string;
  initialReflection: string;
  onClose: () => void;
}) {
  const [text, setText] = useState(initialReflection);
  const updateBook = useUpdateBook(bookId);

  async function handleSave() {
    await updateBook.mutateAsync({ reflection: text });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-95 h-80 flex flex-col p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium">소감 남기기</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-400"
          >
            닫기
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="이 책에 대해 남기고 싶은 생각을 적어보세요"
          className="flex-1 border border-neutral-200 rounded-lg p-3 text-sm resize-none"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={updateBook.isPending}
          className="mt-3 text-sm bg-amber-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {updateBook.isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
