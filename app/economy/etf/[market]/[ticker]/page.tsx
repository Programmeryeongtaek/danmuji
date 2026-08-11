import { EtfDetail } from '@/components/economy/etfs/EtfDetail';
import { EtfMarket } from '@/types/etf';

export default async function EtfDetailPage({
  params,
}: {
  params: Promise<{ market: EtfMarket; ticker: string }>;
}) {
  const { market, ticker } = await params;
  return <EtfDetail market={market} ticker={ticker} />;
}
