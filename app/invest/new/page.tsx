import Link from 'next/link';

export default function InvestNewPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <Link
        href="/invest"
        className="text-sm text-amber-800 hover:text-amber-900"
      >
        ← 종목 비교
      </Link>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
        종목 평가
      </h1>
      {/* 6단계: 평가 입력 */}
    </div>
  );
}
