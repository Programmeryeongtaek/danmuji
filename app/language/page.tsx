'use client';

import { SentenceCard } from '@/components/language/SentenceCard';
import { SentenceForm } from '@/components/language/SentenceForm';
import { useSentenceList, useSituationTags } from '@/entities/language/hooks';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function LanguagePage() {
  const router = useRouter();
  const { data: sentences, isLoading } = useSentenceList();
  const { data: tags } = useSituationTags();
  const [formOpen, setFormOpen] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filteredSentences = useMemo(() => {
    if (!sentences) return [];
    const q = query.trim().toLowerCase();

    return sentences.filter((s) => {
      const matchesTag =
        !activeTagId || s.tags.some((t) => t.id === activeTagId);
      if (!matchesTag) return false;

      if (!q) return true;
      const haystack = [
        s.korean_sentence,
        s.english_sentence,
        s.chinese_sentence,
        s.memo,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sentences, activeTagId, query]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">언어</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="text-sm px-3 py-1.5 border rounded-md"
        >
          + 문장 추가
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="문장, 번역, 메모 검색"
        className="w-full mb-4 px-3 py-2 border rounded-md text-sm dark:bg-transparent"
      />

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <button
          onClick={() => setActiveTagId(null)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            activeTagId === null
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
              : 'border text-gray-600 dark:text-gray-300 dark:border-neutral-800'
          }`}
        >
          전체
        </button>
        {tags?.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setActiveTagId(tag.id)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              activeTagId === tag.id
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                : 'border text-gray-600 dark:text-gray-300 dark:border-neutral-800'
            }`}
          >
            {tag.name}
          </button>
        ))}
        <button
          onClick={() => router.push('/language/tags')}
          className="text-neutral-400 ml-1"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-400">불러오는 중...</p>}

      {!isLoading && filteredSentences.length === 0 && (
        <p className="text-sm text-gray-400">
          {query || activeTagId
            ? '조건에 맞는 문장이 없습니다.'
            : '아직 추가한 문장이 없습니다.'}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {filteredSentences.map((sentence) => (
          <SentenceCard key={sentence.id} sentence={sentence} />
        ))}
      </div>

      {formOpen && <SentenceForm onClose={() => setFormOpen(false)} />}
    </div>
  );
}
