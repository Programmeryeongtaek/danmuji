import { CriterionInput, CriterionKind, InvestCriterion, NumberOp } from '@/types/invest';

/** 편집 중인 항목. id가 null이면 아직 저장되지 않은 새 항목 */
export interface DraftCriterion {
  key: string;
  id: string | null;
  category: string;
  label: string;
  kind: CriterionKind;
  weight: number;
  is_required: boolean;
  number_op: NumberOp;
  target_text: string;
  unit: string;
}

export function toDraft(criterion: InvestCriterion): DraftCriterion {
  return {
    key: criterion.id,
    id: criterion.id,
    category: criterion.category,
    label: criterion.label,
    kind: criterion.kind,
    weight: criterion.weight,
    is_required: criterion.is_required,
    number_op: criterion.number_op ?? 'gte',
    target_text: criterion.number_target === null ? '' : String(criterion.number_target),
    unit: criterion.unit ?? '',
  };
}

export function newDraft(category: string): DraftCriterion {
  return {
    key: crypto.randomUUID(),
    id: null,
    category,
    label: '',
    kind: 'bool',
    weight: 1,
    is_required: false,
    number_op: 'gte',
    target_text: '',
    unit: '',
  };
}

/** 같은 분류끼리 모으되, 분류가 처음 나온 순서는 유지 */
export function orderByCategory(drafts: DraftCriterion[]): DraftCriterion[] {
  const order: string[] = [];
  for (const draft of drafts) {
    const category = draft.category.trim();
    if (!order.includes(category)) order.push(category);
  }
  return order.flatMap((category) =>
    drafts.filter((draft) => draft.category.trim() === category),
  );
}

function toInput(draft: DraftCriterion, sortOrder: number): CriterionInput {
  const isNumber = draft.kind === 'number';
  const target = Number(draft.target_text.trim());
  const unit = draft.unit.trim();

  return {
    category: draft.category.trim(),
    label: draft.label.trim(),
    kind: draft.kind,
    weight: draft.weight,
    is_required: draft.is_required,
    number_op: isNumber ? draft.number_op : null,
    number_target: isNumber && Number.isFinite(target) ? target : null,
    unit: isNumber && unit ? unit : null,
    sort_order: sortOrder,
  };
}

function pickChanged(input: CriterionInput, original: InvestCriterion): Partial<CriterionInput> {
  const changed: Partial<CriterionInput> = {};
  (Object.keys(input) as (keyof CriterionInput)[]).forEach((key) => {
    if (input[key] !== original[key]) Object.assign(changed, { [key]: input[key] });
  });
  return changed;
}

/** 이 필드가 바뀌면 점수가 달라진다 → 버전을 올린다 */
const SCORING_KEYS: (keyof CriterionInput)[] = [
  'kind',
  'weight',
  'is_required',
  'number_op',
  'number_target',
];

export interface CriteriaDiff {
  creates: CriterionInput[];
  updates: { id: string; input: Partial<CriterionInput> }[];
  deletes: string[];
  scoringChanged: boolean;
}

export function diffCriteria(
  original: InvestCriterion[],
  drafts: DraftCriterion[],
): CriteriaDiff {
  const byId = new Map(original.map((criterion) => [criterion.id, criterion]));
  const keptIds = new Set<string>();
  const creates: CriterionInput[] = [];
  const updates: CriteriaDiff['updates'] = [];
  let scoringChanged = false;

  orderByCategory(drafts).forEach((draft, index) => {
    const input = toInput(draft, index);
    const originalItem = draft.id ? byId.get(draft.id) : undefined;

    if (!originalItem) {
      creates.push(input);
      scoringChanged = true;
      return;
    }

    keptIds.add(originalItem.id);
    const changed = pickChanged(input, originalItem);
    const changedKeys = Object.keys(changed) as (keyof CriterionInput)[];
    if (changedKeys.length > 0) updates.push({ id: originalItem.id, input: changed });
    if (changedKeys.some((key) => SCORING_KEYS.includes(key))) scoringChanged = true;
  });

  const deletes = original
    .filter((criterion) => !keptIds.has(criterion.id))
    .map((criterion) => criterion.id);
  if (deletes.length > 0) scoringChanged = true;

  return { creates, updates, deletes, scoringChanged };
}

/** 저장 전 확인. 문제가 없으면 null */
export function validateDrafts(drafts: DraftCriterion[]): string | null {
  for (const draft of drafts) {
    const label = draft.label.trim();
    if (!label) return '이름이 비어 있는 항목이 있어요.';
    if (!draft.category.trim()) return `「${label}」의 분류를 적어주세요.`;

    const target = draft.target_text.trim();
    if (draft.kind === 'number' && (target === '' || !Number.isFinite(Number(target)))) {
      return `「${label}」의 기준값을 숫자로 적어주세요.`;
    }
  }
  return null;
}