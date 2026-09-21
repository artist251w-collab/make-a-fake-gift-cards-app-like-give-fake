import { Check } from 'lucide-react'
import { cx } from '../lib/format'

export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex shrink-0 items-center gap-2">
            <span
              className={cx(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition',
                done && 'bg-brand-600 text-white',
                active && 'bg-ink-900 text-white ring-4 ring-ink-900/10',
                !done && !active && 'bg-slate-200 text-slate-500',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cx('text-xs font-semibold', active ? 'text-ink-900' : done ? 'text-brand-700' : 'text-slate-400')}>
              {label}
            </span>
            {i < steps.length - 1 && <span className={cx('mx-1 h-px w-6 sm:w-10', done ? 'bg-brand-400' : 'bg-slate-200')} />}
          </li>
        )
      })}
    </ol>
  )
}
