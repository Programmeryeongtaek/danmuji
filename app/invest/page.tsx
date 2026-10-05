import { InvestHome } from '@/components/invest/InvestHome';
import { InvestTabs } from '@/components/invest/InvestTabs';

export default function InvestPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <InvestTabs />
      <InvestHome />
    </div>
  );
}
