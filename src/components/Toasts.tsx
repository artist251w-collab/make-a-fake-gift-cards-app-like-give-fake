import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { cx } from '../lib/format'

export default function Toasts() {
  const { toasts, dismissToast } = useStore()
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            'pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl animate-pop',
            t.tone === 'success' && 'border-brand-200 bg-white text-slate-800',
            t.tone === 'info' && 'border-sky-200 bg-white text-slate-800',
            t.tone === 'error' && 'border-rose-200 bg-white text-slate-800',
          )}
          role="status"
        >
          {t.tone === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />}
          {t.tone === 'info' && <Info className="h-5 w-5 shrink-0 text-sky-600" />}
          {t.tone === 'error' && <XCircle className="h-5 w-5 shrink-0 text-rose-600" />}
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
