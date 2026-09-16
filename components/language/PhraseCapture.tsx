'use client';

import { useCreatePhrase } from '@/entities/language/hooks';
import { findPhraseMatches } from '@/entities/language/matchPhrase';
import { SentencePhrase } from '@/types/language';
import { BookmarkPlus, Plus, Repeat, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface PhraseCaptureProps {
  sentenceId: string;
  language: 'en' | 'zh';
  text: string;
  libraryPhrases: SentencePhrase[]; // 같은 언어, 다른 문장들에 저장된 전체 숙어
  currentPhrases: SentencePhrase[]; // 이 문장에 이미 저장된 숙어 (중복 추천 방지)
}

interface SelectionPopup {
  x: number;
  y: number;
}

export function PhraseCapture({
  sentenceId,
  language,
  text,
  libraryPhrases,
  currentPhrases,
}: PhraseCaptureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<SelectionPopup | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [phraseText, setPhraseText] = useState('');
  const [meaning, setMeaning] = useState('');

  const createPhrase = useCreatePhrase(sentenceId);

  // 이미 이 문장에 추가된 표현은 후보에서 제외
  const currentTexts = new Set(
    currentPhrases.map((p) => p.phrase.toLowerCase()),
  );
  const candidates = libraryPhrases.filter(
    (p) =>
      p.sentence_id !== sentenceId && !currentTexts.has(p.phrase.toLowerCase()),
  );

  const matches = useMemo(
    () => findPhraseMatches(text, candidates, language),
    [text, candidates, language],
  );

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

  useEffect(() => {
    if (!popup) return;
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        closePopup();
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

  const handleAddSuggestion = (phrase: SentencePhrase) => {
    createPhrase.mutate({
      language,
      phrase: phrase.phrase,
      meaning: phrase.meaning ?? '',
    });
  };

  // 매칭된 구간에 점선 밑줄 렌더링
  const renderedText = useMemo(() => {
    if (matches.length === 0) return text;
    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
      nodes.push(
        <span key={i} className="border-b-2 border-dashed border-amber-500">
          {text.slice(m.start, m.end)}
        </span>,
      );
      cursor = m.end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  }, [text, matches]);

  return (
    <div ref={containerRef} className="relative" onMouseUp={handleMouseUp}>
      <p className="text-[15px] select-text leading-relaxed">{renderedText}</p>

      {matches.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {matches.map((m) => (
            <div
              key={m.phrase.id}
              className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5"
            >
              <span className="flex items-center gap-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
                <Repeat className="h-3 w-3" />
                저장된 표현과 일치:{' '}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {m.phrase.phrase}
                </span>
              </span>
              <button
                onClick={() => handleAddSuggestion(m.phrase)}
                disabled={createPhrase.isPending}
                className="flex items-center gap-1 text-[11px] px-2 py-1 border rounded-md disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                추가
              </button>
            </div>
          ))}
        </div>
      )}

      {popup && !editMode && (
        <div
          ref={popupRef}
          style={{ left: popup.x, top: popup.y - 36 }}
          onMouseDown={(e) => e.preventDefault()}
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
