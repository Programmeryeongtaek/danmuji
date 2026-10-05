import { InvestStock } from '@/types/invest';

export type StockChoice =
  | { mode: 'existing'; stockId: string }
  | { mode: 'new'; name: string; ticker: string };

const INPUT_CLASS =
  'min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:border-amber-600 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100';

const tabClass = (active: boolean) =>
  `min-h-11 rounded-lg px-4 text-sm ${
    active
      ? 'bg-neutral-900 font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900'
      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
  }`;

interface StockPickerProps {
  stocks: InvestStock[];
  choice: StockChoice;
  onChange: (choice: StockChoice) => void;
}

export function StockPicker({ stocks, choice, onChange }: StockPickerProps) {
  return (
    <section
      aria-labelledby="stock-picker-heading"
      className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2
        id="stock-picker-heading"
        className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
      >
        평가할 종목
      </h2>

      {stocks.length > 0 && (
        <div className="flex gap-1" role="group" aria-label="종목 입력 방식">
          <button
            type="button"
            aria-pressed={choice.mode === 'existing'}
            onClick={() => onChange({ mode: 'existing', stockId: '' })}
            className={tabClass(choice.mode === 'existing')}
          >
            평가했던 종목
          </button>
          <button
            type="button"
            aria-pressed={choice.mode === 'new'}
            onClick={() => onChange({ mode: 'new', name: '', ticker: '' })}
            className={tabClass(choice.mode === 'new')}
          >
            새 종목
          </button>
        </div>
      )}

      {choice.mode === 'existing' ? (
        <select
          aria-label="종목 선택"
          value={choice.stockId}
          onChange={(event) =>
            onChange({ mode: 'existing', stockId: event.target.value })
          }
          className={INPUT_CLASS}
        >
          <option value="">종목을 고르세요</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.name}
              {stock.ticker ? ` (${stock.ticker})` : ''}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            aria-label="종목 이름"
            value={choice.name}
            onChange={(event) =>
              onChange({ ...choice, name: event.target.value })
            }
            placeholder="종목 이름"
            className={`${INPUT_CLASS} min-w-0 flex-1 basis-48`}
          />
          <input
            aria-label="종목 코드 (선택)"
            value={choice.ticker}
            onChange={(event) =>
              onChange({ ...choice, ticker: event.target.value })
            }
            placeholder="종목 코드 (선택)"
            className={`${INPUT_CLASS} w-40`}
          />
        </div>
      )}
    </section>
  );
}
