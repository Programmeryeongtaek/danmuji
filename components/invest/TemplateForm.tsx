import { InvestCriterion, InvestTemplate } from '@/types/invest';
import { useMemo, useState } from 'react';
import {
  diffCriteria,
  DraftCriterion,
  newDraft,
  orderByCategory,
  toDraft,
  validateDrafts,
} from './templateDraft';
import {
  useBumpTemplateVersion,
  useCreateCriterion,
  useDeleteCriterion,
  useUpdateCriterion,
  useUpdateTemplateMeta,
} from '@/entities/invest/hooks';
import { CriterionRow } from './CriterionRow';
import { TemplateHistory } from './TemplateHistory';

const CARD_CLASS =
  'flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900';
const INPUT_CLASS =
  'min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100';
const CATEGORY_LIST_ID = 'invest-category-options';
const DEFAULT_CATEGORIES = ['재무', '사업', '가격', '나의 태도'];

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

interface TemplateFormProps {
  template: InvestTemplate;
  criteria: InvestCriterion[];
  notice: string | null;
  onNotice: (notice: string | null) => void;
}

export function TemplateForm({
  template,
  criteria,
  notice,
  onNotice,
}: TemplateFormProps) {
  const [motto, setMotto] = useState(template.motto ?? '');
  const [buyText, setBuyText] = useState(String(template.buy_threshold));
  const [watchText, setWatchText] = useState(String(template.watch_threshold));
  const [drafts, setDrafts] = useState<DraftCriterion[]>(() =>
    orderByCategory(criteria.map(toDraft)),
  );
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const updateMeta = useUpdateTemplateMeta();
  const createCriterion = useCreateCriterion(template.id);
  const updateCriterion = useUpdateCriterion(template.id);
  const deleteCriterion = useDeleteCriterion(template.id);
  const bumpVersion = useBumpTemplateVersion();

  const diff = useMemo(
    () => diffCriteria(criteria, drafts),
    [criteria, drafts],
  );

  const buy = Number(buyText);
  const watch = Number(watchText);
  const isInitialSetup = criteria.length === 0;
  const thresholdsChanged =
    buy !== template.buy_threshold || watch !== template.watch_threshold;
  const mottoChanged = motto.trim() !== (template.motto ?? '');
  const scoringChanged =
    !isInitialSetup && (diff.scoringChanged || thresholdsChanged);
  const hasChanges =
    diff.scoringChanged ||
    thresholdsChanged ||
    mottoChanged ||
    diff.updates.length > 0;

  const categoryOptions = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...drafts.map((draft) => draft.category.trim()),
    ]),
  ).filter(Boolean);
  const requiredCount = drafts.filter((draft) => draft.is_required).length;

  function getValidationError(): string | null {
    const draftError = validateDrafts(drafts);
    if (draftError) return draftError;
    const isValidThreshold = (value: number) =>
      Number.isInteger(value) && value >= 0 && value <= 100;
    if (!isValidThreshold(buy) || !isValidThreshold(watch)) {
      return '판정 경계는 0에서 100 사이의 정수로 적어주세요.';
    }
    if (watch >= buy) return '관망 경계는 매수 검토 경계보다 낮아야 해요.';
    if (scoringChanged && !reason.trim()) {
      return '점수에 영향을 주는 변경이라 이유를 한 줄 남겨주세요.';
    }
    return null;
  }
  const validationError = getValidationError();

  function patchDraft(key: string, patch: Partial<DraftCriterion>) {
    onNotice(null);
    setDrafts((prev) =>
      prev.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );
  }

  function removeDraft(key: string) {
    onNotice(null);
    setDrafts((prev) => prev.filter((draft) => draft.key !== key));
  }

  function addDraft() {
    onNotice(null);
    const lastCategory =
      drafts[drafts.length - 1]?.category.trim() || DEFAULT_CATEGORIES[0];
    setDrafts((prev) => [...prev, newDraft(lastCategory)]);
  }

  async function handleSave() {
    if (!hasChanges || validationError || isSaving) return;
    setIsSaving(true);
    onNotice(null);

    try {
      if (mottoChanged || thresholdsChanged) {
        await updateMeta.mutateAsync({
          id: template.id,
          input: {
            motto: motto.trim() || null,
            buy_threshold: buy,
            watch_threshold: watch,
          },
        });
      }
      await Promise.all([
        ...diff.deletes.map((id) => deleteCriterion.mutateAsync(id)),
        ...diff.updates.map(({ id, input }) =>
          updateCriterion.mutateAsync({ id, input }),
        ),
        ...diff.creates.map((input) => createCriterion.mutateAsync(input)),
      ]);
      if (scoringChanged) {
        await bumpVersion.mutateAsync({ template, reason: reason.trim() });
      }
      onNotice('저장했어요.');
    } catch {
      onNotice('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  let saveSummary = '바뀐 내용이 없어요.';
  if (hasChanges && scoringChanged) {
    saveSummary = `점수에 영향을 주는 변경이 있어요. 저장하면 v${template.version + 1}이 됩니다.`;
  } else if (hasChanges && isInitialSetup) {
    saveSummary = '첫 기준을 구성하는 중이에요. 버전은 v1로 시작합니다.';
  } else if (hasChanges) {
    saveSummary = '문구만 바뀌어서 버전은 그대로예요.';
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {template.name}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          v{template.version} · 항목 {drafts.length}개 · 필수 {requiredCount}개
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className={CARD_CLASS}>
            <label
              htmlFor="invest-motto"
              className="text-sm font-semibold text-neutral-600 dark:text-neutral-400"
            >
              원칙 한 문장
            </label>
            <input
              id="invest-motto"
              value={motto}
              onChange={(event) => {
                onNotice(null);
                setMotto(event.target.value);
              }}
              placeholder="예: 이해하지 못하는 회사에는 돈을 넣지 않는다."
              className={`${INPUT_CLASS} min-h-12 font-serif text-lg`}
            />
          </section>

          <section aria-labelledby="criteria-heading" className={CARD_CLASS}>
            <h2
              id="criteria-heading"
              className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              기준 항목
            </h2>
            {drafts.length === 0 && (
              <p className="text-sm text-neutral-500">
                아직 항목이 없어요. 아래 버튼으로 첫 기준을 추가해 보세요.
              </p>
            )}
            <div className="flex flex-col">
              {drafts.map((draft, index) => {
                const category = draft.category.trim();
                const showHeading =
                  index === 0 || drafts[index - 1].category.trim() !== category;
                return (
                  <div key={draft.key}>
                    {showHeading && (
                      <h3 className="pb-1 pt-4 text-xs font-semibold tracking-wide text-neutral-500">
                        {category || '분류 없음'}
                      </h3>
                    )}
                    <CriterionRow
                      draft={draft}
                      categoryListId={CATEGORY_LIST_ID}
                      onChange={(patch) => patchDraft(draft.key, patch)}
                      onDelete={() => removeDraft(draft.key)}
                    />
                  </div>
                );
              })}
            </div>
            <datalist id={CATEGORY_LIST_ID}>
              {categoryOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={addDraft}
              className="min-h-12 rounded-xl border border-dashed border-amber-400 bg-amber-50 text-sm text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
            >
              + 항목 추가
            </button>
          </section>

          <section aria-labelledby="threshold-heading" className={CARD_CLASS}>
            <h2
              id="threshold-heading"
              className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              판정 경계
            </h2>
            <div className="flex flex-wrap gap-5 text-sm text-neutral-700 dark:text-neutral-300">
              <label className="flex items-center gap-2">
                매수 검토
                <input
                  inputMode="numeric"
                  value={buyText}
                  onChange={(event) => {
                    onNotice(null);
                    setBuyText(event.target.value);
                  }}
                  className={`${INPUT_CLASS} w-16 text-center`}
                />
                점 이상
              </label>
              <label className="flex items-center gap-2">
                관망
                <input
                  inputMode="numeric"
                  value={watchText}
                  onChange={(event) => {
                    onNotice(null);
                    setWatchText(event.target.value);
                  }}
                  className={`${INPUT_CLASS} w-16 text-center`}
                />
                점 이상
              </label>
            </div>
            <div
              className="flex h-3 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <div
                className="bg-neutral-200 dark:bg-neutral-700"
                style={{ width: `${clampPercent(watch)}%` }}
              />
              <div
                className="bg-amber-300 dark:bg-amber-700"
                style={{
                  width: `${Math.max(clampPercent(buy) - clampPercent(watch), 0)}%`,
                }}
              />
              <div className="flex-1 bg-amber-800 dark:bg-amber-500" />
            </div>
            <p className="text-xs text-neutral-500">
              필수 항목이 하나라도 미달이면 점수와 관계없이 보류로 판정됩니다.
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <section aria-labelledby="save-heading" className={CARD_CLASS}>
            <h2
              id="save-heading"
              className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              저장
            </h2>
            <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {saveSummary}
            </p>
            {scoringChanged && (
              <label className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                이번 변경의 이유
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  placeholder="예: 부채를 늦게 읽은 경험이 있어 재무 건전성의 비중을 높인다."
                  className={`${INPUT_CLASS} resize-y py-2 leading-6`}
                />
              </label>
            )}
            {hasChanges && validationError && (
              <p
                role="alert"
                className="text-sm text-amber-800 dark:text-amber-300"
              >
                {validationError}
              </p>
            )}
            {notice && (
              <p
                role="status"
                className="text-sm text-neutral-600 dark:text-neutral-400"
              >
                {notice}
              </p>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || validationError !== null || isSaving}
              className="min-h-12 rounded-xl bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:disabled:bg-neutral-700"
            >
              {isSaving
                ? '저장 중…'
                : scoringChanged
                  ? `v${template.version + 1}로 저장`
                  : '저장'}
            </button>
            <p className="text-xs leading-5 text-neutral-500">
              기준표를 고쳐도 지난 평가는 당시 기준 그대로 보존됩니다.
            </p>
          </section>

          <TemplateHistory template={template} />
        </aside>
      </div>
    </div>
  );
}
