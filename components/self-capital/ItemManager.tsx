'use client';

import {
  useSelfCapitalChecks,
  useSelfCapitalItems,
} from '@/entities/self-capital/hook';
import { CAPITALS } from './constants';
import Link from 'next/link';
import ItemRow from './ItemRow';
import AddItemForm from './AddItemForm';

export default function ItemManager() {
  const itemsQuery = useSelfCapitalItems();
  const checksQuery = useSelfCapitalChecks();

  if (itemsQuery.isPending || checksQuery.isPending) {
    return <p className="p-10 text-stone-500">불러오는 중…</p>;
  }
  if (itemsQuery.isError || checksQuery.isError) {
    return <p className="p-10 text-stone-600">문항을 불러오지 못했습니다.</p>;
  }

  const items = itemsQuery.data;
  // 한 번이라도 점수가 매겨진 문항
  const usedIds = new Set(
    checksQuery.data.flatMap((check) => Object.keys(check.scores)),
  );

  return (
    <div className="min-h-screen bg-stone-50 px-6 pb-16 pt-14 text-stone-800">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2.5">
          <Link
            href="/self-capital"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            ← 점검으로 돌아가기
          </Link>
          <h1 className="font-serif text-4xl font-bold text-stone-900">
            문항 관리
          </h1>
          <p className="text-base leading-relaxed text-stone-600">
            일곱 자본마다 나를 점검할 문항을 만듭니다. 점수 기록이 있는 문항은
            지우는 대신 숨겨, 지난 기록을 지킵니다.
          </p>
        </header>

        {CAPITALS.map((capital) => {
          const ofCapital = items.filter(
            (item) => item.capital === capital.type,
          );
          const active = ofCapital.filter((item) => item.is_active);
          const hidden = ofCapital.filter((item) => !item.is_active);

          return (
            <section
              key={capital.type}
              aria-labelledby={`capital-${capital.type}`}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-stone-200 pb-3">
                <div className="flex flex-col gap-1">
                  <h2
                    id={`capital-${capital.type}`}
                    className="font-serif text-xl text-stone-900"
                  >
                    {capital.name}
                  </h2>
                  <p className="text-sm text-stone-600">{capital.desc}</p>
                </div>
                <span className="shrink-0 text-sm text-stone-500">
                  {active.length}개
                </span>
              </div>

              {active.length > 0 ? (
                <ul>
                  {active.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      used={usedIds.has(item.id)}
                    />
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-stone-500">
                  아직 문항이 없습니다.
                </p>
              )}

              <AddItemForm capital={capital.type} capitalName={capital.name} />

              {hidden.length > 0 && (
                <details className="mt-4 border-t border-stone-100 pt-3">
                  <summary className="cursor-pointer py-2 text-sm text-stone-500 hover:text-stone-700">
                    숨긴 문항 {hidden.length}개
                  </summary>
                  <ul>
                    {hidden.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        used={usedIds.has(item.id)}
                      />
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
