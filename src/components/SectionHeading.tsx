import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  to?: string
  linkLabel?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ eyebrow, title, subtitle, to, linkLabel = 'View all', align = 'left' }: Props) {
  return (
    <div className={align === 'center' ? 'mb-8 text-center' : 'mb-6 flex items-end justify-between gap-4'}>
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className={`mt-2 text-sm text-slate-500 sm:text-base ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
