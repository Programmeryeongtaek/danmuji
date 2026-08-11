'use client';

import {
  useCreateEtf,
  useDeleteEtf,
  useEtfs,
} from '@/entities/economy/etf/hooks';
import { CURATED_OVERSEAS_ETFS } from '@/shared/lib/curatedOverseasEtfs';
import { EtfMarket } from '@/types/etf';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FxRateBanner } from './FxRateBanner';
import { formatBasDt } from '@/shared/lib/formatBasDt';
import { EtfTagEditor } from './EtfTagEditor';

async function fetchDomesticSnapshot() {
  const res = await fetch('/api/prices/domestic');
  if (!res.ok) return null;
  return res.json();
}

async function fetchOverseasPrice(ticker: string) {
  const res = await fetch(`/api/prices/overseas?ticker=${ticker}`);
  if (!res.ok) return null;
  return res.json();
}

export function EtfDetail({
  market,
  ticker,
}: {
  market: EtfMarket;
  ticker: string;
}) {
  const router = useRouter();
  const { data: etfs, isLoading: isLoadingEtfs } = useEtfs();
  const createEtf = useCreateEtf();
  const deleteEtf = useDeleteEtf();

  const existing = etfs?.find(
    (e) => e.ticker === ticker && e.market === market,
  );

  const { data: domesticData } = useQuery({
    queryKey: ['domesticEtfCandidates'],
    queryFn: fetchDomesticSnapshot,
    staleTime: 1000 * 60 * 60,
    enabled: market === 'domestic',
  });

  const { data: overseasData } = useQuery({
    queryKey: ['overseasPrice', ticker],
    queryFn: () => fetchOverseasPrice(ticker),
    staleTime: 1000 * 60 * 5,
    enabled: market === 'overseas',
  });

  if (isLoadingEtfs)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;

  const domesticMatch = domesticData?.items?.find(
    (s: { ticker: string }) => s.ticker === ticker,
  );
  const overseasCandidate = CURATED_OVERSEAS_ETFS.find(
    (c) => c.ticker === ticker,
  );
  const name =
    existing?.name ?? domesticMatch?.name ?? overseasCandidate?.name ?? ticker;

  const price =
    market === 'domestic'
      ? (domesticMatch?.price ?? null)
      : (overseasData?.price ?? null);
  const changePercent =
    market === 'domestic'
      ? (domesticMatch?.changePercent ?? null)
      : (overseasData?.changePercent ?? null);

  const priceLabel =
    price === null
      ? '-'
      : market === 'domestic'
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

  async function handleToggle() {
    if (existing) {
      if (!confirm(`"${name}"을(를) 관심목록에서 제거할까요?`)) return;
      await deleteEtf.mutateAsync(existing.id);
    } else {
      await createEtf.mutateAsync({ ticker, market, name, tags: [] });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={() => router.push('/economy/etf')}
          className="text-xs text-amber-700"
        >
          ← ETF 목록으로
        </button>
        <button
          onClick={handleToggle}
          className="text-xs"
          style={{ color: existing ? '#9ca3af' : '#d97706' }}
        >
          {existing ? '관심목록에서 제거' : '☆ 관심목록에 추가'}
        </button>
      </div>

      <p className="text-[11px] text-neutral-400 mb-1">
        {market === 'domestic' ? '국내' : '해외'} · {ticker}
      </p>
      <p className="font-serif text-xl mb-4">{name}</p>

      {market === 'overseas' && <FxRateBanner />}

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl">{priceLabel}</span>
        <span className={`text-sm ${changeColor}`}>{changeLabel}</span>
      </div>
      {market === 'domestic' && domesticData?.date && (
        <p className="text-xs text-neutral-400 mb-6">
          {formatBasDt(domesticData.date)} 종가 기준
        </p>
      )}

      <div className="border-t border-neutral-100 pt-4">
        <p className="text-xs text-neutral-400 mb-2">태그</p>
        {existing ? (
          <EtfTagEditor etfId={existing.id} tags={existing.tags} />
        ) : (
          <p className="text-xs text-neutral-300">
            관심목록에 추가하면 태그를 남길 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
}
