'use client';

import {
  useCreateEtf,
  useDeleteEtf,
  useEtfs,
} from '@/entities/economy/etf/hooks';
import { externalEtfLink } from '@/shared/lib/externalEtfLink';
import { EtfMarket } from '@/types/etf';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export function EtfCandidateRow({
  ticker,
  market,
  name,
  price,
  changePercent,
  currency,
  tagsSlot,
}: {
  ticker: string;
  market: EtfMarket;
  name: string;
  price: number | null;
  changePercent: number | null;
  currency: 'KRW' | 'USD';
  tagsSlot?: ReactNode;
}) {
  const router = useRouter();
  const { data: etfs } = useEtfs();
  const createEtf = useCreateEtf();
  const deleteEtf = useDeleteEtf();

  const existing = etfs?.find(
    (e) => e.ticker === ticker && e.market === market,
  );
  const isStarred = !!existing;

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (existing) {
      if (!confirm(`"${name}"을(를) 관심목록에서 제거할까요?`)) return;
      await deleteEtf.mutateAsync(existing.id);
    } else {
      await createEtf.mutateAsync({ ticker, market, name, tags: [] });
    }
  }

  const priceLabel =
    price === null
      ? '-'
      : currency === 'KRW'
        ? `${price.toLocaleString()}원`
        : `$${price.toFixed(2)}`;

  const changeLabel =
    changePercent === null
      ? '-'
      : `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  const changeColor =
    changePercent === null
      ? 'text-neutral-400'
      : changePercent >= 0
        ? 'text-emerald-600'
        : 'text-red-500';

  return (
    <tr className="border-t border-neutral-100 align-top">
      <td className="py-2 pr-1">
        <button
          onClick={handleToggle}
          className="text-base"
          style={{ color: isStarred ? '#d97706' : '#d4d4d4' }}
        >
          {isStarred ? '★' : '☆'}
        </button>
      </td>
      <td className="py-2">
        <div
          onClick={() => router.push(`/economy/etf/${market}/${ticker}`)}
          className="cursor-pointer hover:text-amber-700"
        >
          {name} <span className="text-[10px] text-neutral-400">{ticker}</span>{' '}
          <a
            href={externalEtfLink(ticker, market)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-neutral-400 hover:text-amber-700"
          >
            ↗
          </a>
        </div>
        {tagsSlot}
      </td>
      <td className="py-2 text-right">{priceLabel}</td>
      <td className="py-2 text-right">
        <span className={changeColor}>{changeLabel}</span>
      </td>
    </tr>
  );
}
