'use client';

import { SentenceCard } from '@/components/language/SentenceCard';
import { useSentenceList, useSituationTags } from '@/entities/language/hooks';

export default function LanguagePage() {
  const { data: sentences, isLoading } = useSentenceList();
  const { data: tags } = useSituationTags();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">언어</h1>
        <button className="text-sm px-3 py-1.5 border rounded-md">
          + 문장 추가
        </button>
      </div>

      <input
        type="text"
        placeholder="문장 검색"
        className="w-full mb-4 px-3 py-2 border rounded-md text-sm dark:bg-transparent"
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          전체
        </span>
        {tags?.map((tag) => (
          <span
            key={tag.id}
            className="text-xs px-3 py-1 rounded-full border text-gray-600 dark:text-gray-300"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {isLoading && <p className="text-sm text-gray-400">불러오는 중...</p>}

      <div className="flex flex-col gap-3">
        {sentences?.map((sentence) => (
          <SentenceCard key={sentence.id} sentence={sentence} />
        ))}
      </div>
    </div>
  );
}
