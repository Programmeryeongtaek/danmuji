'use client';

import {
  useDeleteSentence,
  useSentenceDetail,
  useToggleSentenceReview,
  useUpdateSentence,
} from '@/entities/language/hooks';
import { Sentence } from '@/types/language';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SentenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sentence, isLoading } = useSentenceDetail(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-neutral-400">불러오는 중...</div>;
  }

  if (!sentence) {
    return (
      <div className="p-6 text-sm text-neutral-400">
        문장을 찾을 수 없습니다.
      </div>
    );
  }

  // sentence.id를 key로 줘서, 데이터가 바뀌면(수정 저장 후 refetch 등)
  // 아래 컴포넌트가 통째로 리마운트되며 useState 초기값이 새로 계산됨
  return <SentenceDetailContent key={sentence.id} sentence={sentence} />;
}

interface SentenceDetailContentProps {
  sentence: Sentence;
}

function SentenceDetailContent({ sentence }: SentenceDetailContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = sentence.id;

  const updateSentence = useUpdateSentence(id);
  const deleteSentence = useDeleteSentence();
  const toggleReview = useToggleSentenceReview();

  const [isEditing, setIsEditing] = useState(
    searchParams.get('edit') === 'true' || !!searchParams.get('add'),
  );

  // lazy initializer — sentence는 이미 위에서 존재가 보장됨
  const [form, setForm] = useState(() => ({
    korean_sentence: sentence.korean_sentence,
    english_sentence: sentence.english_sentence ?? '',
    chinese_sentence: sentence.chinese_sentence ?? '',
    chinese_pinyin: sentence.chinese_pinyin ?? '',
    memo: sentence.memo ?? '',
  }));

  const englishRef = useRef<HTMLTextAreaElement>(null);
  const chineseRef = useRef<HTMLTextAreaElement>(null);

  // ?add=en / ?add=zh 로 들어왔을 때 해당 필드 포커스 — 이건 외부 시스템(DOM 포커스) 제어라 useEffect가 맞음
  useEffect(() => {
    if (!isEditing) return;
    const addLang = searchParams.get('add');
    if (addLang === 'en') englishRef.current?.focus();
    if (addLang === 'zh') chineseRef.current?.focus();
  }, [isEditing, searchParams]);

  const isReviewed = !!sentence.review_marked_at;

  const handleSave = async () => {
    await updateSentence.mutateAsync({
      korean_sentence: form.korean_sentence,
      english_sentence: form.english_sentence || null,
      chinese_sentence: form.chinese_sentence || null,
      chinese_pinyin: form.chinese_pinyin || null,
      memo: form.memo || null,
    });
    setIsEditing(false);
    router.replace(`/language/${id}`);
  };

  const handleCancel = () => {
    setForm({
      korean_sentence: sentence.korean_sentence,
      english_sentence: sentence.english_sentence ?? '',
      chinese_sentence: sentence.chinese_sentence ?? '',
      chinese_pinyin: sentence.chinese_pinyin ?? '',
      memo: sentence.memo ?? '',
    });
    setIsEditing(false);
    router.replace(`/language/${id}`);
  };

  const handleDelete = () => {
    if (
      confirm(
        `"${sentence.korean_sentence}" 문장을 삭제할까요?\n번역과 숙어가 함께 삭제되며 되돌릴 수 없습니다.`,
      )
    ) {
      deleteSentence.mutate(id, {
        onSuccess: () => router.push('/language'),
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/language')}
          className="flex items-center gap-1 text-[13px] text-neutral-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          목록으로
        </button>
        {!isEditing && (
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 text-neutral-400" />
            </button>
            <button onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-neutral-400" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5 flex-wrap">
          {sentence.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
            >
              {tag.name}
            </span>
          ))}
          {/* 태그 편집 UI는 다음 단계에서 */}
        </div>
        <button
          onClick={() => toggleReview.mutate({ id, isReviewed: !isReviewed })}
          className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 ${
            isReviewed
              ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
          }`}
        >
          {isReviewed ? '완료' : '학습필요'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={form.korean_sentence}
          onChange={(e) =>
            setForm((f) => ({ ...f, korean_sentence: e.target.value }))
          }
          className="w-full text-[19px] font-medium mb-1 border rounded-md p-2 resize-none"
          rows={2}
        />
      ) : (
        <>
          <p className="text-[19px] font-medium mb-1">
            {sentence.korean_sentence}
          </p>
          <p className="text-[11px] text-neutral-400 mb-6">
            {new Date(sentence.created_at).toLocaleDateString('ko-KR')} 작성
          </p>
        </>
      )}

      <div className="flex flex-col gap-2.5 mt-4">
        {/* 영어 */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5">
          <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mb-2">
            EN
          </span>
          {isEditing ? (
            <textarea
              ref={englishRef}
              value={form.english_sentence}
              onChange={(e) =>
                setForm((f) => ({ ...f, english_sentence: e.target.value }))
              }
              placeholder="영어 번역"
              className="w-full text-[14px] border rounded-md p-2 resize-none"
              rows={2}
            />
          ) : sentence.english_sentence ? (
            <p className="text-[15px]">{sentence.english_sentence}</p>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => englishRef.current?.focus(), 0);
              }}
              className="flex items-center gap-1 text-[12px] text-amber-600 dark:text-amber-400"
            >
              <Plus className="h-3 w-3" />
              추가
            </button>
          )}
        </div>

        {/* 중국어 */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5">
          <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mb-2">
            中
          </span>
          {isEditing ? (
            <div className="flex flex-col gap-1.5">
              <textarea
                ref={chineseRef}
                value={form.chinese_sentence}
                onChange={(e) =>
                  setForm((f) => ({ ...f, chinese_sentence: e.target.value }))
                }
                placeholder="중국어 번역"
                className="w-full text-[14px] border rounded-md p-2 resize-none"
                rows={2}
              />
              <input
                type="text"
                value={form.chinese_pinyin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, chinese_pinyin: e.target.value }))
                }
                placeholder="병음 (선택)"
                className="w-full text-[13px] border rounded-md p-2"
              />
            </div>
          ) : sentence.chinese_sentence ? (
            <>
              <p className="text-[15px]">{sentence.chinese_sentence}</p>
              {sentence.chinese_pinyin && (
                <p className="text-[12px] text-neutral-400 mt-0.5">
                  {sentence.chinese_pinyin}
                </p>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => chineseRef.current?.focus(), 0);
              }}
              className="flex items-center gap-1 text-[12px] text-amber-600 dark:text-amber-400"
            >
              <Plus className="h-3 w-3" />
              추가
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-5">
        <p className="text-[12px] text-neutral-400 mb-1.5">메모</p>
        {isEditing ? (
          <textarea
            value={form.memo}
            onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
            placeholder="메모"
            className="w-full text-[14px] border rounded-md p-2 resize-none"
            rows={2}
          />
        ) : (
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
            {sentence.memo || '메모 없음'}
          </p>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={handleCancel}
            className="text-[13px] px-3 py-1.5 border rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="text-[13px] px-3 py-1.5 bg-amber-600 text-white rounded-md"
          >
            저장
          </button>
        </div>
      )}

      {/* 숙어 목록 (sentence.phrases) 은 다음 단계에서 */}
    </div>
  );
}
