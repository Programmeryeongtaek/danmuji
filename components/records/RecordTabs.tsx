import { RecordTab, RecordTabKey } from '@/types/record';

const TABS: RecordTab[] = [
  { key: 'all', label: '전체' },
  { key: 'quote', label: '문장' },
  { key: 'thought', label: '생각' },
  { key: 'saying', label: '명언' },
];

interface RecordTabsProps {
  activeTab: RecordTabKey;
  onChange: (tab: RecordTabKey) => void;
}

export function RecordTabs({ activeTab, onChange }: RecordTabsProps) {
  return (
    <div className="flex gap-4">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`border-b-2 pb-2 text-[13.5px] ${
              isActive
                ? 'border-amber-500 font-medium text-amber-700 dark:border-amber-700 dark:text-amber-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
