'use client';

import {
  useSaveSelfCapitalCheck,
  useSelfCapitalChecks,
  useSelfCapitalItems,
} from '@/entities/self-capital/hook';
import { ScoreMap } from '@/types/selfCapital';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useState } from 'react';
import { capitalMeta, CAPITALS } from './constants';
import CapitalNav from './CapitalNav';
import ItemScaleList from './ItemScaleList';
import { averageScore, currentPeriod } from './scoreUtils';
import { selectedCapitalAtom } from './Atoms';

const EMPTY: ScoreMap = {};

export default function SelfCapitalCheck() {
  const itemsQuery = useSelfCapitalItems();
  const checksQuery = useSelfCapitalChecks();
  const save = useSaveSelfCapitalCheck();
  const [selected, setSelected] = useAtom(selectedCapitalAtom);

  /** 이번 달 작성 중인 점수. null이면 아직 손대지 않음 */
  const [draft, setDraft] = useState<ScoreMap | null>(null);

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

  const period = currentPeriod();
  const [year, month] = period.split('-').map(Number);
  const savedThisMonth = checks.find((c) => c.period === period);
  const latestPast = checks.filter((c) => c.period < period).at(-1);

  // 이번 달 기록이 있으면 그것, 없으면 가장 최근 점검에서 출발
  const baseScores = savedThisMonth?.scores ?? latestPast?.scores ?? EMPTY;
  const scores = draft ?? baseScores;

  const itemsOf = (type: string) =>
    activeItems.filter((item) => item.capital === type);
  const navRows = CAPITALS.map((c) => ({
    type: c.type,
    name: c.name,
    avg: averageScore(itemsOf(c.type), scores),
  }));
  const meta = capitalMeta(selected);
  const currentItems = itemsOf(selected);

  const answeredCount = activeItems.filter(
    (item) => typeof scores[item.id] === 'number',
  ).length;
  // 새 달에는 지난 점수 그대로도 저장할 수 있게
  const canSave =
    !save.isPending && answeredCount > 0 && (draft !== null || !savedThisMonth);

  const handleScore = (itemId: string, score: number) => {
    setDraft((prev) => ({ ...(prev ?? baseScores), [itemId]: score }));
  };

  const handleSave = () => {
    // 지금 보이는(숨기지 않은) 문항의 점수만 저장
    const toSave = Object.fromEntries(
      activeItems
        .filter((item) => typeof scores[item.id] === 'number')
        .map((item) => [item.id, scores[item.id]]),
    );
    save.mutate(
      { period, scores: toSave },
      { onSuccess: () => setDraft(null) },
    );
  };

  const status = save.isError
    ? '저장하지 못했습니다. 다시 시도해 주세요.'
    : draft !== null
      ? `저장하지 않은 변경이 있습니다 · ${activeItems.length}개 중 ${answeredCount}개 응답`
      : savedThisMonth
        ? '이번 달 점검이 저장되어 있습니다'
        : `${activeItems.length}개 중 ${answeredCount}개 응답`;

  return (
    <div className="min-h-screen bg-[#FCFBF8] px-6 pb-18 pt-14 text-stone-800">
      <div className="mx-auto flex max-w-280 flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] tracking-wide text-stone-500">
              기록 · 자기 자본 점검 · {year}년 {month}월
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
          <div className="flex flex-wrap items-start gap-7">
            <CapitalNav
              rows={navRows}
              selected={selected}
              onSelect={setSelected}
            />

            <ItemScaleList
              name={meta.name}
              desc={meta.desc}
              avg={averageScore(currentItems, scores)}
              items={currentItems.map((item) => ({
                id: item.id,
                content: item.content,
                score: scores[item.id],
              }))}
              onScore={handleScore}
            />

            <aside className="flex flex-[0_0_300px] flex-col gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="min-h-12 rounded-lg bg-amber-700 text-[15px] font-semibold text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {save.isPending
                  ? '저장 중…'
                  : savedThisMonth
                    ? '이번 점검 다시 저장'
                    : '이번 점검 저장'}
              </button>
              <p
                className="text-center text-[13px] text-stone-600"
                aria-live="polite"
              >
                {status}
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
