import { AnswerSnapshot } from '@/types/invest';
import { answerRatio, passesRequired } from './verdict';
import { SCALE_MAX } from './constants';
import { Check, X } from 'lucide-react';

interface AnswerCellProps {
  answer: AnswerSnapshot | undefined;
}

export function AnswerCell({ answer }: AnswerCellProps) {
  if (!answer || answer.value === null) {
    return <span className="text-neutral-400">—</span>;
  }

  if (answer.is_required && !passesRequired(answer)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        <X aria-hidden="true" className="h-4 w-4" />
        필수 미달
      </span>
    );
  }

  if (answer.kind === 'scale') {
    return (
      <span className="text-amber-800 dark:text-amber-300">
        {String(answer.value)} / {SCALE_MAX}
      </span>
    );
  }

  const passed = answerRatio(answer) === 1;
  const text =
    answer.kind === 'bool'
      ? answer.value
        ? '예'
        : '아니오'
      : `${answer.value}${answer.unit ?? ''}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        passed ? 'text-amber-800 dark:text-amber-300' : 'text-neutral-500'
      }`}
    >
      {passed ? (
        <Check aria-label="충족" className="h-4 w-4" />
      ) : (
        <X aria-label="미달" className="h-4 w-4" />
      )}
      {text}
    </span>
  );
}
