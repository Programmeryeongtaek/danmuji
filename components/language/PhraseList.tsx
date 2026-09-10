'use client';

import {
  useDeleteSentencePhrase,
  useUpdateSentencePhrase,
} from '@/entities/language/hooks';
import { SentencePhrase } from '@/types/language';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PhraseListProps {
  phrases: SentencePhrase[];
  language: 'en' | 'zh';
}

export function PhraseList({ phrases, language }: PhraseListProps) {
  const filtered = phrases.filter((p) => p.language === language);
  if (filtered.length === 0) return null;

  return (
    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2">
      <p className="text-[10px] text-neutral-400 mb-1.5">저장한 표현</p>
      <div className="flex flex-col gap-1.5">
        {filtered.map((phrase) => (
          <PhraseRow key={phrase.id} phrase={phrase} />
        ))}
      </div>
    </div>
  );
}

function PhraseRow({ phrase }: { phrase: SentencePhrase }) {
  const [editing, setEditing] = useState(false);
  const [phraseText, setPhraseText] = useState(phrase.phrase);
  const [meaning, setMeaning] = useState(phrase.meaning ?? '');

  const updatePhrase = useUpdateSentencePhrase();
  const deletePhrase = useDeleteSentencePhrase();

  const isReviewed = !!phrase.review_marked_at;

  const handleSave = async () => {
    await updatePhrase.mutateAsync({
      id: phrase.id,
      phrase: phraseText.trim(),
      meaning: meaning.trim(),
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`"${phrase.phrase}" 표현을 삭제할까요?`)) {
      deletePhrase.mutate(phrase.id);
    }
  };

  if (editing) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-2 flex flex-col gap-1.5">
        <input
          value={phraseText}
          onChange={(e) => setPhraseText(e.target.value)}
          className="text-[13px] font-medium border rounded-md p-1.5"
          autoFocus
        />
        <input
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="뜻"
          className="text-[13px] border rounded-md p-1.5"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => setEditing(false)}
            className="text-[11px] px-2 py-1"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="text-[11px] px-2.5 py-1 bg-amber-600 text-white rounded-md"
          >
            저장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5">
      <div>
        <span className="text-[13px] font-medium">{phrase.phrase}</span>
        {phrase.meaning && (
          <span className="text-[12px] text-neutral-400 ml-2">
            {phrase.meaning}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isReviewed && (
          <span className="text-[10px] text-green-600 dark:text-green-400">
            완료
          </span>
        )}
        <button onClick={() => setEditing(true)}>
          <Edit2 className="h-3 w-3 text-neutral-400" />
        </button>
        <button onClick={handleDelete}>
          <Trash2 className="h-3 w-3 text-neutral-400" />
        </button>
      </div>
    </div>
  );
}
