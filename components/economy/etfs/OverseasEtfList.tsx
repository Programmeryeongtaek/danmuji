'use client';

import { CURATED_OVERSEAS_ETFS } from '@/shared/lib/curatedOverseasEtfs';
import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { EtfCandidateRow } from './EtfCandidateRow';

async function fetchOverseasPrice(ticker: string) {
  const res = await fetch(`/api/prices/overseas?ticker=${ticker}`);
  if (!res.ok) return null;
  return res.json();
}

export function OverseasEtfList() {
  const [query, setQuery] = useState('');

  const priceQueries = useQueries({
    queries: CURATED_OVERSEAS_ETFS.map((etf) => ({
      queryKey: ['overseasPrice', etf.ticker],
      queryFn: () => fetchOverseasPrice(etf.ticker),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const visible = useMemo(() => {
    if (query.trim() === '') return CURATED_OVERSEAS_ETFS;
    return CURATED_OVERSEAS_ETFS.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.ticker.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="종목명 또는 티커 검색"
        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] text-neutral-400">
            <td className="w-6"></td>
            <td>종목</td>
            <td className="text-right">현재가</td>
            <td className="text-right">등락률</td>
          </tr>
        </thead>
        <tbody>
          {visible.map((c) => {
            const index = CURATED_OVERSEAS_ETFS.findIndex(
              (x) => x.ticker === c.ticker,
            );
            const priceData = priceQueries[index]?.data;
            return (
              <EtfCandidateRow
                key={c.ticker}
                ticker={c.ticker}
                market="overseas"
                name={c.name}
                price={priceData?.price ?? null}
                changePercent={priceData?.changePercent ?? null}
                currency="USD"
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
