import InvestTabs from '@/components/invest/InvestTabs';

export default function InvestTemplatePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <InvestTabs />
      <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
        나의 기본 원칙
      </h1>
      {/* 5단계: 기준표 편집 */}
    </div>
  );
}
