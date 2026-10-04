import { useTemplateVersions } from '@/entities/invest/hooks';
import { InvestTemplate } from '@/types/invest';
import { formatDate } from './firnat';

interface TemplateHistoryProps {
  template: InvestTemplate;
}

export function TemplateHistory({ template }: TemplateHistoryProps) {
  const { data: versions = [] } = useTemplateVersions(template.id);

  return (
    <section
      aria-labelledby="template-history-heading"
      className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2
        id="template-history-heading"
        className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
      >
        원칙의 변천
      </h2>
      <ol className="flex flex-col gap-4">
        {versions.map((version) => (
          <li
            key={version.id}
            className="flex flex-col gap-1 border-b border-neutral-100 pb-4 dark:border-neutral-800"
          >
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                v{version.version}
              </span>
              <span className="text-neutral-500">
                {formatDate(version.created_at)}
              </span>
            </div>
            <p className="font-serif text-sm leading-7 text-neutral-800 dark:text-neutral-200">
              {version.reason || '이유를 남기지 않았어요.'}
            </p>
          </li>
        ))}
        <li className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              v1
            </span>
            <span className="text-neutral-500">
              {formatDate(template.created_at)}
            </span>
          </div>
          <p className="font-serif text-sm leading-7 text-neutral-800 dark:text-neutral-200">
            처음 세운 기준
          </p>
        </li>
      </ol>
    </section>
  );
}
