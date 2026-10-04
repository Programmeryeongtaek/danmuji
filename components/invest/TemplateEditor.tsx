'use client';

import { useInvestCriteria, useInvestTemplate } from '@/entities/invest/hooks';
import { useState } from 'react';
import { TemplateForm } from './TemplateForm';

export function TemplateEditor() {
  const templateQuery = useInvestTemplate();
  const template = templateQuery.data ?? null;
  const criteriaQuery = useInvestCriteria(template?.id);
  const [notice, setNotice] = useState<string | null>(null);

  if (templateQuery.isPending || (template && criteriaQuery.isPending)) {
    return <p className="text-sm text-neutral-500">불러오는 중…</p>;
  }
  if (templateQuery.isError || criteriaQuery.isError) {
    return (
      <p className="text-sm text-neutral-500">기준표를 불러오지 못했어요.</p>
    );
  }
  if (!template) {
    return (
      <p className="text-sm text-neutral-500">
        기준표가 없어요. 2단계 SQL의 마지막 insert를 실행했는지 확인해 주세요.
      </p>
    );
  }

  const criteria = criteriaQuery.data ?? [];
  const formKey = `${template.updated_at}-${criteria.map((criterion) => criterion.id).join(',')}`;

  return (
    <TemplateForm
      key={formKey}
      template={template}
      criteria={criteria}
      notice={notice}
      onNotice={setNotice}
    />
  );
}
