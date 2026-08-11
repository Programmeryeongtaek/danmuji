'use client';

import { useEtfs } from '@/entities/economy/etf/hooks';
import { useQueries, useQuery } from '@tanstack/react-query';
import { EtfCandidateRow } from './EtfCandidateRow';
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

export function EtfWatchlistTab() {
  const { data: etfs, isLoading } = useEtfs();

  const domesticEtfs = etfs?.filter((e) => e.market === 'domestic') ?? [];
  const overseasEtfs = etfs?.filter((e) => e.market === 'overseas') ?? [];

  const { data: domesticData } = useQuery({
    queryKey: ['domesticEtfCandidates'],
    queryFn: fetchDomesticSnapshot,
    staleTime: 1000 * 60 * 60,
  });
  const domesticSnapshot = domesticData?.items;

  const overseasPriceQueries = useQueries({
    queries: overseasEtfs.map((e) => ({
      queryKey: ['overseasPrice', e.ticker],
      queryFn: () => fetchOverseasPrice(e.ticker),
      staleTime: 1000 * 60 * 5,
    })),
  });

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (domesticEtfs.length === 0 && overseasEtfs.length === 0) {
    return (
      <p className="text-sm text-neutral-400">관심 등록한 종목이 없습니다.</p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-neutral-400">국내</p>
        {domesticData?.date && (
          <p className="text-xs text-neutral-400">
            {formatBasDt(domesticData.date)} 기준
          </p>
        )}
      </div>
      <table className="w-full text-sm mb-6">
        <tbody>
          {domesticEtfs.map((e) => {
            const snap = domesticSnapshot?.find(
              (s: { ticker: string }) => s.ticker === e.ticker,
            );
            return (
              <EtfCandidateRow
                key={e.id}
                ticker={e.ticker}
                market="domestic"
                name={e.name}
                price={snap?.price ?? null}
                changePercent={snap?.changePercent ?? null}
                currency="KRW"
                tagsSlot={<EtfTagEditor etfId={e.id} tags={e.tags} />}
              />
            );
          })}
          {domesticEtfs.length === 0 && (
            <tr>
              <td className="text-xs text-neutral-300 py-2">없음</td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="text-xs text-neutral-400 mb-2">해외</p>
      {overseasEtfs.length > 0 && <FxRateBanner />}
      <table className="w-full text-sm">
        <tbody>
          {overseasEtfs.map((e, i) => (
            <EtfCandidateRow
              key={e.id}
              ticker={e.ticker}
              market="overseas"
              name={e.name}
              price={overseasPriceQueries[i]?.data?.price ?? null}
              changePercent={
                overseasPriceQueries[i]?.data?.changePercent ?? null
              }
              currency="USD"
              tagsSlot={<EtfTagEditor etfId={e.id} tags={e.tags} />}
            />
          ))}
          {overseasEtfs.length === 0 && (
            <tr>
              <td className="text-xs text-neutral-300 py-2">없음</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
