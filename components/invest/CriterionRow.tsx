import { CriterionKind, NumberOp } from '@/types/invest';
import { KIND_LABEL } from './constants';
import { DraftCriterion } from './templateDraft';
import { X } from 'lucide-react';

const INPUT_CLASS =
  'min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100';

const WEIGHT_OPTIONS = [1, 2, 3, 4, 5];
const KINDS = Object.keys(KIND_LABEL) as CriterionKind[];

interface CriterionRowProps {
  draft: DraftCriterion;
  categoryListId: string;
  onChange: (patch: Partial<DraftCriterion>) => void;
  onDelete: () => void;
}

export function CriterionRow({
  draft,
  categoryListId,
  onChange,
  onDelete,
}: CriterionRowProps) {
  const name = draft.label.trim() || '새 항목';

  return (
    <div className="flex flex-col gap-2 border-t border-neutral-100 py-3 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="항목 이름"
          value={draft.label}
          onChange={(event) => onChange({ label: event.target.value })}
          placeholder="예: 사업 모델을 한 문장으로 설명할 수 있다"
          className={`${INPUT_CLASS} min-w-0 flex-1 basis-64`}
        />
        <select
          aria-label={`${name} 유형`}
          value={draft.kind}
          onChange={(event) =>
            onChange({ kind: event.target.value as CriterionKind })
          }
          className={INPUT_CLASS}
        >
          {KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {KIND_LABEL[kind]}
            </option>
          ))}
        </select>
        <select
          aria-label={`${name} 가중치`}
          value={draft.weight}
          onChange={(event) => onChange({ weight: Number(event.target.value) })}
          className={INPUT_CLASS}
        >
          {WEIGHT_OPTIONS.map((weight) => (
            <option key={weight} value={weight}>
              가중치 {weight}
            </option>
          ))}
        </select>
        <label className="inline-flex min-h-11 items-center gap-2 px-1 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={draft.is_required}
            onChange={(event) =>
              onChange({ is_required: event.target.checked })
            }
            className="h-4 w-4 accent-amber-700"
          />
          필수
        </label>
        <button
          type="button"
          aria-label={`${name} 삭제`}
          onClick={onDelete}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label={`${name} 분류`}
          list={categoryListId}
          value={draft.category}
          onChange={(event) => onChange({ category: event.target.value })}
          placeholder="분류"
          className={`${INPUT_CLASS} w-32`}
        />
        {draft.kind === 'number' && (
          <>
            <input
              aria-label={`${name} 기준값`}
              inputMode="decimal"
              value={draft.target_text}
              onChange={(event) =>
                onChange({ target_text: event.target.value })
              }
              placeholder="기준값"
              className={`${INPUT_CLASS} w-24 text-right`}
            />
            <input
              aria-label={`${name} 단위`}
              value={draft.unit}
              onChange={(event) => onChange({ unit: event.target.value })}
              placeholder="단위"
              className={`${INPUT_CLASS} w-20`}
            />
            <select
              aria-label={`${name} 비교 방식`}
              value={draft.number_op}
              onChange={(event) =>
                onChange({ number_op: event.target.value as NumberOp })
              }
              className={INPUT_CLASS}
            >
              <option value="gte">이상</option>
              <option value="lte">이하</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
}
