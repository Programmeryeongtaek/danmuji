import InvestTabs from '@/components/invest/InvestTabs';
import Link from 'next/link';

export default function InvestPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <InvestTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
          투자
        </h1>
        <Link
          href="/invest/new"
          className="inline-flex min-h-11 items-center rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-700"
        >
          새 종목 평가
        </Link>
      </header>
      {/* 7단계: 종목 비교표 */}
      <p className="text-sm text-stone-500">평가한 종목이 아직 없어요.</p>
    </div>
  );
}
