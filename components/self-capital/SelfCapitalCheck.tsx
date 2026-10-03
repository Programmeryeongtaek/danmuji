'use client';

import {
  useSelfCapitalChecks,
  useSelfCapitalItems,
} from '@/entities/self-capital/hook';

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
        <header className="flex flex-col gap-2.5">
          <p className="text-[13px] tracking-wide text-stone-500">
            기록 · 자기 자본 점검
          </p>
          <h1 className="font-serif text-4xl font-bold text-stone-900">
            자본의 형태
          </h1>
          <p className="text-base leading-relaxed text-stone-600">
            점검이 쌓일수록, 무엇이 자랐고 무엇이 줄었는지 보입니다.
          </p>
        </header>

        {/* 3단계 연결 확인용 — 다음 단계에서 실제 화면으로 바뀜 */}
        <p className="rounded-2xl border border-stone-200 bg-white px-6 py-5 text-[15px] text-stone-700">
          문항 {activeItems.length}개 · 점검 {checks.length}회
        </p>
      </div>
    </div>
  );
}
