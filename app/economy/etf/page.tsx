'use client';

import { EtfAllTab } from '@/components/economy/etfs/EtfALLTab';
import { EtfWatchlistTab } from '@/components/economy/etfs/EtfWatchlistTab';
import { useState } from 'react';

export default function EtfPage() {
  const [tab, setTab] = useState<'all' | 'watchlist'>('all');

  return (
    <div>
      <div className="flex gap-4 border-b border-neutral-200 mb-4 text-sm">
        <button
          onClick={() => setTab('all')}
          className={`pb-2 ${tab === 'all' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-neutral-500'}`}
        >
          전체
        </button>
        <button
          onClick={() => setTab('watchlist')}
          className={`pb-2 ${tab === 'watchlist' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-neutral-500'}`}
        >
          관심목록
        </button>
      </div>

      {tab === 'all' ? <EtfAllTab /> : <EtfWatchlistTab />}
    </div>
  );
}
