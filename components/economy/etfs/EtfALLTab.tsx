'use client';

import { useState } from 'react';
import { FxRateBanner } from './FxRateBanner';
import { DomesticEtfList } from './DomesticEtfList';
import { OverseasEtfList } from './OverseasEtfList';

export function EtfAllTab() {
  const [market, setMarket] = useState<'domestic' | 'overseas'>('domestic');

  return (
    <div>
      <div className="flex gap-2 mb-3 text-xs">
        <button
          onClick={() => setMarket('domestic')}
          className={`px-2.5 py-1 rounded-lg ${market === 'domestic' ? 'bg-amber-50 text-amber-700' : 'text-neutral-500'}`}
        >
          국내
        </button>
        <button
          onClick={() => setMarket('overseas')}
          className={`px-2.5 py-1 rounded-lg ${market === 'overseas' ? 'bg-amber-50 text-amber-700' : 'text-neutral-500'}`}
        >
          해외
        </button>
      </div>

      {market === 'overseas' && <FxRateBanner />}
      {market === 'domestic' ? <DomesticEtfList /> : <OverseasEtfList />}
    </div>
  );
}
