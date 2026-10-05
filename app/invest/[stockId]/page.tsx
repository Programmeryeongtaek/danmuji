import { StockDetail } from '@/components/invest/StockDetail';
import Link from 'next/link';

type Props = {
  params: Promise<{ stockId: string }>;
};

export default async function InvestStockPage({ params }: Props) {
  const { stockId } = await params;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <Link
        href="/invest"
        className="text-sm text-amber-800 hover:text-amber-900"
      >
        ← 종목 비교
      </Link>
      <StockDetail stockId={stockId} />
    </div>
  );
}
