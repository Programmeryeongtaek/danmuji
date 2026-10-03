'use client';

import {
  useSelfCapitalChecks,
  useSelfCapitalItems,
} from '@/entities/self-capital/hook';
import Link from 'next/link';

export default function SelfCapitalCheck() {
  const itemsQuery = useSelfCapitalItems();
  const checksQuery = useSelfCapitalChecks();

  if (itemsQuery.isPending || checksQuery.isPending) {
    return <p className="p-10 text-stone-500">불러오는 중…</p>;
  }

  if (itemsQuery.isError || checksQuery.isError) {
    return (
      <p className="p-10 text-stone-600">점검 기록을 불러오지 못했습니다.</p>
    );
  }

  const activeItems = itemsQuery.data.filter((item) => item.is_active);
  const checks = checksQuery.data;

  return (
    <div className="min-h-screen bg-[#FCFBF8] px-6 pb-18 pt-14 text-stone-800">
      <div className="mx-auto flex max-w-280 flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] tracking-wide text-stone-500">
              기록 · 자기 자본 점검
            </p>
            <h1 className="font-serif text-4xl font-bold text-stone-900">
              자본의 형태
            </h1>
            <p className="text-base leading-relaxed text-stone-600">
              점검이 쌓일수록, 무엇이 자랐고 무엇이 줄었는지 보입니다.
            </p>
          </div>
          <Link
            href="/self-capital/items"
            className="inline-flex min-h-10 items-center rounded-lg border border-stone-300 bg-white px-4 text-sm text-stone-700 transition-colors hover:border-stone-400"
          >
            문항 관리
          </Link>
        </header>

        {activeItems.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-6">
            <p className="text-[15px] leading-relaxed text-stone-700">
              아직 점검 문항이 없습니다. 일곱 자본마다 나에게 맞는 문항을 먼저
              만들어 주세요.
            </p>
            <Link
              href="/self-capital/items"
              className="inline-flex min-h-11 items-center rounded-lg bg-amber-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
            >
              문항 만들기
            </Link>
          </div>
        ) : (
          // 5단계에서 점수 입력 화면으로 바뀜
          <p className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-[15px] text-stone-700">
            문항 {activeItems.length}개 · 점검 {checks.length}회
          </p>
        )}
      </div>
    </div>
  );
}
