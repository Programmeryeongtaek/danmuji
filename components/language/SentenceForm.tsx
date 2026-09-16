'use client';

import { useCreateSentence } from '@/entities/language/hooks';
import { X } from 'lucide-react';
import { useState } from 'react';
import { TagPicker } from './TagPicker';

interface SentenceFormProps {
  onClose: () => void;
}

export function SentenceForm({ onClose }: SentenceFormProps) {
  const [korean, setKorean] = useState('');
  const [english, setEnglish] = useState('');
  const [chinese, setChinese] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const createSentence = useCreateSentence();

  const handleSubmit = async () => {
    if (!korean.trim()) return;
    await createSentence.mutateAsync({
      korean_sentence: korean.trim(),
      english_sentence: english.trim() || null,
      chinese_sentence: chinese.trim() || null,
      chinese_pinyin: pinyin.trim() || null,
      memo: memo.trim() || null,
      tag_ids: selectedTagIds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium">문장 추가</h2>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">
              한국어
            </label>
            <textarea
              value={korean}
              onChange={(e) => setKorean(e.target.value)}
              placeholder="한국어 문장 (필수)"
              className="w-full text-[14px] border rounded-md p-2 resize-none"
              rows={2}
              autoFocus
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">
              영어 (선택)
            </label>
            <textarea
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="영어 번역 — 나중에 추가해도 됨"
              className="w-full text-[14px] border rounded-md p-2 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">
              중국어 (선택)
            </label>
            <textarea
              value={chinese}
              onChange={(e) => setChinese(e.target.value)}
              placeholder="중국어 번역 — 나중에 추가해도 됨"
              className="w-full text-[14px] border rounded-md p-2 resize-none"
              rows={2}
            />
            <input
              type="text"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              placeholder="병음 (선택)"
              className="w-full text-[13px] border rounded-md p-2 mt-1.5"
            />
          </div>

          {/* 상황 태그 — TagPicker 하나만 남김 */}
          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">
              상황 태그
            </label>
            <TagPicker
              selectedTagIds={selectedTagIds}
              onChange={setSelectedTagIds}
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 mb-1 block">
              메모 (선택)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="출처, 뉘앙스 등"
              className="w-full text-[14px] border rounded-md p-2 resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="text-[13px] px-3 py-1.5 border rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!korean.trim() || createSentence.isPending}
            className="text-[13px] px-3 py-1.5 bg-amber-600 text-white rounded-md disabled:opacity-50"
          >
            {createSentence.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
