'use client';

import { createLink } from '@/entities/economy/relatedLinks/api';
import { useRelatedItems } from '@/entities/economy/relatedLinks/hooks';
import {
  keywordKeys,
  useCreateKeyword,
  useUpdateKeyword,
} from '@/entities/keyword/hooks';
import { Keyword, KeywordFormValues } from '@/types/keyword';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';
import { RelatedConceptDraftPicker } from '../RelatedConceptDraftPicker';
import { RelatedItems } from '../RelatedItems';
import { RelatedItemPicker } from '../RelatedItemPicker';

export function KeywordForm({
  mode,
  keyword,
}: {
  mode: 'create' | 'edit';
  keyword?: Keyword;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createKeyword = useCreateKeyword();
  const updateKeyword = useUpdateKeyword(keyword?.id ?? '');
  const { data: related } = useRelatedItems(keyword?.id ?? '');

  const [values, setValues] = useState<KeywordFormValues>({
    term: keyword?.term ?? '',
    definition: keyword?.definition ?? '',
    status: keyword?.status ?? 'new',
    category: keyword?.category ?? '',
  });

  const [draftRelated, setDraftRelated] = useState<Keyword[]>([]);

  const isPending = createKeyword.isPending || updateKeyword.isPending;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === 'create') {
      const created = await createKeyword.mutateAsync(values);

      if (draftRelated.length > 0) {
        await Promise.all(
          draftRelated.map((k) =>
            createLink('keyword', created.id, 'keyword', k.id),
          ),
        );
        queryClient.invalidateQueries({ queryKey: keywordKeys.withCounts });
      }

      router.push(`/economy/keywords/${created.id}`);
    } else if (keyword) {
      await updateKeyword.mutateAsync(values);
      router.push(`/economy/keywords/${keyword.id}`);
    }
  }

  function addDraft(k: Keyword) {
    setDraftRelated((prev) => [...prev, k]);
  }

  function removeDraft(keywordId: string) {
    setDraftRelated((prev) => prev.filter((k) => k.id !== keywordId));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-neutral-400 block mb-1">용어</label>
        <input
          required
          value={values.term}
          onChange={(e) => setValues({ ...values, term: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">정의</label>
        <textarea
          required
          rows={4}
          value={values.definition}
          onChange={(e) => setValues({ ...values, definition: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">학습 상태</label>
        <select
          value={values.status}
          onChange={(e) =>
            setValues({
              ...values,
              status: e.target.value as KeywordFormValues['status'],
            })
          }
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="new">미학습</option>
          <option value="review">복습필요</option>
          <option value="done">완료</option>
        </select>
      </div>

      <div className="border-t border-neutral-200 pt-4">
        {mode === 'create' ? (
          <RelatedConceptDraftPicker
            currentText={values.definition}
            selected={draftRelated}
            onAdd={addDraft}
            onRemove={removeDraft}
          />
        ) : (
          keyword && (
            <>
              <RelatedItems itemId={keyword.id} items={related ?? []} />
              <RelatedItemPicker
                itemType="keyword"
                itemId={keyword.id}
                currentText={values.definition}
              />
            </>
          )
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {mode === 'create' ? '등록' : '저장'}
      </button>
    </form>
  );
}
