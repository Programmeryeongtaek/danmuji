import { EvaluationForm } from '@/components/invest/EvaluationForm';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ stockId?: string }>;
};

export default async function InvestNewPage({ searchParams }: Props) {
  const { stockId } = await searchParams;
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <Link
        href="/invest"
        className="text-sm text-amber-800 hover:text-amber-900"
      >
        ← 종목 비교
      </Link>
      <EvaluationForm stockId={stockId ?? null} />
    </div>
  );
}
