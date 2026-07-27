import { EconomyTabs } from '../../components/economy/EconomyTabs';

export default function EconomyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <EconomyTabs />
      {children}
    </div>
  );
}
