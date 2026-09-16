'use client';

import {
  useDeleteSentence,
  useToggleSentenceReview,
} from '@/entities/language/hooks';
import { Sentence } from '@/types/language';
import { MoreVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SentenceCardProps {
  sentence: Sentence;
}

export function SentenceCard({ sentence }: SentenceCardProps) {
  const router = useRouter();
  const [revealedEn, setRevealedEn] = useState(false);
  const [revealedZh, setRevealedZh] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addLangOpen, setAddLangOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const addLangRef = useRef<HTMLDivElement>(null);

  const toggleReview = useToggleSentenceReview();
  const deleteSentence = useDeleteSentence();

  const isReviewed = !!sentence.review_marked_at;
  const missingEn = !sentence.english_sentence;
  const missingZh = !sentence.chinese_sentence;
  const hasMissingTranslation = missingEn || missingZh;

  // 메뉴/팝업 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (
        addLangRef.current &&
        !addLangRef.current.contains(e.target as Node)
      ) {
        setAddLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToDetail = () => router.push(`/language/${sentence.id}`);

  const handleToggleReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleReview.mutate({ id: sentence.id, isReviewed: !isReviewed });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        `"${sentence.korean_sentence}" 문장을 삭제할까요?\n번역과 숙어가 함께 삭제되며 되돌릴 수 없습니다.`,
      )
    ) {
      deleteSentence.mutate(sentence.id);
    }
    setMenuOpen(false);
  };

  const handleAddLanguage = (e: React.MouseEvent, lang: 'en' | 'zh') => {
    e.stopPropagation();
    setAddLangOpen(false);
    router.push(`/language/${sentence.id}?add=${lang}`);
  };

  return (
    <div
      onClick={goToDetail}
      className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex gap-1.5 flex-wrap">
          {sentence.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleToggleReview}
            className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 ${
              isReviewed
                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
            }`}
          >
            {isReviewed ? '완료' : '학습필요'}
          </button>

          {hasMissingTranslation && (
            <>
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
              <div className="relative" ref={addLangRef}>
                <button
                  onClick={() => setAddLangOpen((v) => !v)}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                >
                  <Plus className="h-3 w-3" />
                  번역
                </button>
                {addLangOpen && (
                  <div className="absolute right-0 top-7 z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg min-w-27.5 overflow-hidden">
                    <div className="px-3 py-1.5 text-[11px] text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                      추가할 언어
                    </div>
                    {missingZh && (
                      <button
                        onClick={(e) => handleAddLanguage(e, 'zh')}
                        className="w-full text-left px-3 py-2 text-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      >
                        중국어
                      </button>
                    )}
                    {missingEn && (
                      <button
                        onClick={(e) => handleAddLanguage(e, 'en')}
                        className="w-full text-left px-3 py-2 text-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      >
                        영어
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((v) => !v)}>
              <MoreVertical className="h-4 w-4 text-neutral-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-6 z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg min-w-25 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/language/${sentence.id}?edit=true`);
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-[13px] text-red-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-[15px] font-medium mb-2.5">
        {sentence.korean_sentence}
      </p>

      <div className="flex flex-col gap-1.5">
        <TranslationRow
          label="EN"
          exists={!!sentence.english_sentence}
          text={sentence.english_sentence}
          revealed={revealedEn}
          onToggle={(e) => {
            e.stopPropagation();
            setRevealedEn((v) => !v);
          }}
        />
        <TranslationRow
          label="中"
          exists={!!sentence.chinese_sentence}
          text={sentence.chinese_sentence}
          revealed={revealedZh}
          onToggle={(e) => {
            e.stopPropagation();
            setRevealedZh((v) => !v);
          }}
        />
      </div>
    </div>
  );
}

interface TranslationRowProps {
  label: string;
  exists: boolean;
  text: string | null;
  revealed: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

function TranslationRow({
  label,
  exists,
  text,
  revealed,
  onToggle,
}: TranslationRowProps) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={exists ? onToggle : undefined}
    >
      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded min-w-5 text-center ${
          exists
            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
            : 'border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400'
        }`}
      >
        {label}
      </span>
      <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
        {!exists ? '번역 없음' : revealed ? text : '탭하여 확인'}
      </span>
    </div>
  );
}
