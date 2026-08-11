'use client';

import { DomesticEtfCandidate } from '@/types/etf';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { EtfCandidateRow } from './EtfCandidateRow';
import { formatBasDt } from '@/shared/lib/formatBasDt';

interface DomesticResponse {
  items: DomesticEtfCandidate[];
  date: string;
}

async function fetchDomesticCandidates(): Promise<DomesticResponse> {
  const res = await fetch('/api/prices/domestic');
  if (!res.ok) throw new Error('국내 시세 조회 실패');
  return res.json();
}

export function DomesticEtfList() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['domesticEtfCandidates'],
    queryFn: fetchDomesticCandidates,
    staleTime: 1000 * 60 * 60,
  });

  const visible = useMemo(() => {
    if (!data?.items) return [];
    if (query.trim() === '') return data.items.slice(0, 50);
    return data.items.filter(
      (c) => c.name.includes(query) || c.ticker.includes(query),
    );
  }, [data, query]);

  if (isLoading)
    return <p className="text-sm text-neutral-400">불러오는 중...</p>;
  if (error)
    return <p className="text-sm text-red-500">시세를 불러오지 못했습니다.</p>;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="종목명 또는 티커 검색"
        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm mb-2"
      />
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-neutral-400">
          {query.trim() === ''
            ? '시가총액 상위 50개'
            : `검색 결과 ${visible.length}건`}
        </p>
        {data?.date && (
          <p className="text-xs text-neutral-400">
            {formatBasDt(data.date)} 종가 기준
          </p>
        )}
      </div>
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
          {visible.map((c) => (
            <EtfCandidateRow
              key={c.ticker}
              ticker={c.ticker}
              market="domestic"
              name={c.name}
              price={c.price}
              changePercent={c.changePercent}
              currency="KRW"
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
