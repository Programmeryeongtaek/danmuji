import { InvestCriterion } from '@/types/invest';
import { SCALE_MAX, SCALE_MIN } from './constants';
import { RawAnswer } from './answerDraft';

const SCALE_VALUES = Array.from(
  { length: SCALE_MAX - SCALE_MIN + 1 },
  (_, index) => SCALE_MIN + index,
);

const choiceClass = (selected: boolean) =>
  selected
    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
    : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900';

interface AnswerInputProps {
  criterion: InvestCriterion;
  value: RawAnswer;
  onChange: (value: RawAnswer) => void;
}

export function AnswerInput({ criterion, value, onChange }: AnswerInputProps) {
  if (criterion.kind === 'bool') {
    return (
      <div
        role="group"
        aria-label={`${criterion.label} 응답`}
        className="inline-flex"
      >
        {[
          { label: '예', answer: true },
          { label: '아니오', answer: false },
        ].map(({ label, answer }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={value === answer}
            onClick={() => onChange(value === answer ? null : answer)}
            className={`min-h-11 border px-4 text-sm ${choiceClass(value === answer)} ${
              index === 0 ? 'rounded-l-lg' : '-ml-px rounded-r-lg'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (criterion.kind === 'scale') {
    return (
      <div
        role="group"
        aria-label={`${criterion.label} 척도`}
        className="flex gap-1.5"
      >
        {SCALE_VALUES.map((score) => (
          <button
            key={score}
            type="button"
            aria-label={`${score}점`}
            aria-pressed={value === score}
            onClick={() => onChange(value === score ? null : score)}
            className={`h-11 w-10 rounded-lg border text-sm ${choiceClass(value === score)}`}
          >
            {score}
          </button>
        ))}
      </div>
    );
  }

  const opLabel = criterion.number_op === 'lte' ? '≤' : '≥';
  return (
    <div className="flex items-center gap-2">
      <input
        aria-label={`${criterion.label} 값`}
        inputMode="decimal"
        value={
          typeof value === 'string'
            ? value
            : value === null
              ? ''
              : String(value)
        }
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-24 rounded-lg border border-neutral-300 bg-white px-3 text-right text-sm text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
      />
      <span className="text-xs text-neutral-500">
        {criterion.unit ?? ''} (기준 {opLabel} {criterion.number_target}
        {criterion.unit ?? ''})
      </span>
    </div>
  );
}
