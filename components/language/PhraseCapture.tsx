'use client';

import { useCreatePhrase } from '@/entities/language/hooks';
import { BookmarkPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PhraseCaptureProps {
  sentenceId: string;
  language: 'en' | 'zh';
  text: string;
}

interface SelectionPopup {
  x: number;
  y: number;
}

export function PhraseCapture({
  sentenceId,
  language,
  text,
}: PhraseCaptureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<SelectionPopup | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [phraseText, setPhraseText] = useState('');
  const [meaning, setMeaning] = useState('');

  const createPhrase = useCreatePhrase(sentenceId);

  const closePopup = () => {
    setPopup(null);
    setEditMode(false);
    setPhraseText('');
    setMeaning('');
    window.getSelection()?.removeAllRanges();
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) return;

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setPopup({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top,
    });
    setPhraseText(selectedText);
    setMeaning('');
    setEditMode(false);
  };

  // 바깥 클릭 또는 Esc로 취소
  useEffect(() => {
    if (!popup) return;

    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') closePopup();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [popup]);

  const handleSave = async () => {
    if (!phraseText.trim()) return;
    await createPhrase.mutateAsync({
      language,
      phrase: phraseText.trim(),
      meaning: meaning.trim(),
    });
    closePopup();
  };

  return (
    <div ref={containerRef} className="relative" onMouseUp={handleMouseUp}>
      <p className="text-[15px] select-text leading-relaxed">{text}</p>

      {popup && !editMode && (
        <div
          ref={popupRef}
          style={{ left: popup.x, top: popup.y - 36 }}
          onMouseDown={(e) => e.preventDefault()} // 클릭해도 선택이 풀리지 않게
          className="absolute -translate-x-1/2 flex items-center gap-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[12px] rounded-md shadow-lg z-20 whitespace-nowrap overflow-hidden"
        >
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            숙어로 저장
          </button>
          <button
            onClick={closePopup}
            className="px-2 py-1.5 border-l border-white/20 dark:border-black/20"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {popup && editMode && (
        <div
          ref={popupRef}
          style={{ left: Math.max(0, popup.x - 110) }}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg p-3 w-64 z-20"
        >
          <label className="text-[10px] text-neutral-400 block mb-1">
            저장될 형태 (변하는 부분은 A로)
          </label>
          <input
            type="text"
            value={phraseText}
            onChange={(e) => setPhraseText(e.target.value)}
            className="w-full text-[13px] font-medium border rounded-md p-1.5 mb-2"
            autoFocus
          />
          <label className="text-[10px] text-neutral-400 block mb-1">뜻</label>
          <input
            type="text"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="뜻 입력"
            className="w-full text-[13px] border rounded-md p-1.5 mb-2"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="flex justify-end gap-1.5">
            <button onClick={closePopup} className="text-[11px] px-2 py-1">
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={createPhrase.isPending || !phraseText.trim()}
              className="text-[11px] px-2.5 py-1 bg-amber-600 text-white rounded-md disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
