import { cx } from '../lib/format'

export default function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cx('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm shadow-brand-600/30">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path d="M20 40a12 12 0 1 0 2.2-6.9" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M18 24v10h10" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 22h8v8" fill="none" stroke="#bbf7d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={cx('text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-ink-900')}>
        Re<span className="text-brand-600">Cart</span>
      </span>
    </span>
  )
}
