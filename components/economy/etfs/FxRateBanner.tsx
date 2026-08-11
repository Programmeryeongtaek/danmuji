'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchFxRate() {
  const res = await fetch('/api/prices/fx');
  if (!res.ok) throw new Error('환율 조회 실패');
  return res.json();
}

function formatFxDate(searchDate: string) {
  return `${searchDate.slice(0, 4)}.${searchDate.slice(4, 6)}.${searchDate.slice(6, 8)}`;
}

export function FxRateBanner() {
  const { data, isLoading } = useQuery({
    queryKey: ['fxRate'],
    queryFn: fetchFxRate,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading || !data) return null;

  return (
    <p className="text-xs text-neutral-400 mb-3">
      {formatFxDate(data.date)} 환율 · 1 USD = {data.rate.toLocaleString()}원
    </p>
  );
}
