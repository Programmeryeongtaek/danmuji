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
      <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
        종목 상세
      </h1>
      {/* 8단계: 최근 평가 + 판단 기록 */}
      <p className="text-sm text-stone-500">종목 ID: {stockId}</p>
    </div>
  );
}
