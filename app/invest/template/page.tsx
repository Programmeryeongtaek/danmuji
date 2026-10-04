import { InvestTabs } from '@/components/invest/InvestTabs';
import { TemplateEditor } from '@/components/invest/TemplateEditor';

export default function InvestTemplatePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <InvestTabs />
      <TemplateEditor />
    </div>
  );
}
