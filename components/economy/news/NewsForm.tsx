'use client';

import {
  useCreateNewsSummary,
  useUpdateNewsSummary,
} from '@/entities/economy/news/hooks';
import { createLink } from '@/entities/economy/relatedLinks/api';
import { useRelatedItems } from '@/entities/economy/relatedLinks/hooks';
import { Keyword } from '@/types/keyword';
import { NewsSummary, NewsSummaryFormValues } from '@/types/news';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';
import { RelatedItems } from '../RelatedItems';
import { RelatedItemPicker } from '../RelatedItemPicker';
import { RelatedConceptDraftPicker } from '../RelatedConceptDraftPicker';

export function NewsForm({
  mode,
  news,
}: {
  mode: 'create' | 'edit';
  news?: NewsSummary;
}) {
  const router = useRouter();
  const createNews = useCreateNewsSummary();
  const updateNews = useUpdateNewsSummary(news?.id ?? '');
  const { data: related } = useRelatedItems(news?.id ?? '');

  const [values, setValues] = useState<NewsSummaryFormValues>({
    title: news?.title ?? '',
    source: news?.source ?? '',
    summary: news?.summary ?? '',
    article_url: news?.article_url ?? '',
    published_date:
      news?.published_date ?? new Date().toISOString().slice(0, 10),
  });

  const [draftRelated, setDraftRelated] = useState<Keyword[]>([]);
  const isPending = createNews.isPending || updateNews.isPending;

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === 'create') {
      const created = await createNews.mutateAsync(values);

      if (draftRelated.length > 0) {
        await Promise.all(
          draftRelated.map((k) =>
            createLink('news', created.id, 'keyword', k.id),
          ),
        );
      }

      router.push(`/economy/news/${created.id}`);
    } else if (news) {
      await updateNews.mutateAsync(values);
      router.push(`/economy/news/${news.id}`);
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
        <label className="text-xs text-neutral-400 block mb-1">언론사</label>
        <input
          value={values.source ?? ''}
          onChange={(e) => setValues({ ...values, source: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">보도일</label>
        <input
          type="date"
          value={values.published_date ?? ''}
          onChange={(e) =>
            setValues({ ...values, published_date: e.target.value })
          }
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">제목</label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">원문 링크</label>
        <input
          type="url"
          value={values.article_url ?? ''}
          onChange={(e) =>
            setValues({ ...values, article_url: e.target.value })
          }
          placeholder="https://..."
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">요약</label>
        <textarea
          required
          rows={5}
          value={values.summary}
          onChange={(e) => setValues({ ...values, summary: e.target.value })}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="border-t border-neutral-200 pt-4">
        {mode === 'create' ? (
          <RelatedConceptDraftPicker
            currentText={values.summary}
            selected={draftRelated}
            onAdd={addDraft}
            onRemove={removeDraft}
          />
        ) : (
          news && (
            <>
              <RelatedItems itemId={news.id} items={related ?? []} />
              <RelatedItemPicker
                itemType="news"
                itemId={news.id}
                currentText={values.summary}
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
