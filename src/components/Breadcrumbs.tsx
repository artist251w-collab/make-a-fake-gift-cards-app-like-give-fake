import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items, light = false }: { items: { label: string; to?: string }[]; light?: boolean }) {
  const base = light ? 'text-white/80' : 'text-slate-500'
  const hover = light ? 'hover:text-white' : 'hover:text-brand-700'
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 text-xs ${base}`}>
      <Link to="/" className={`flex items-center gap-1 ${hover}`}>
        <Home className="h-3.5 w-3.5" /> Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className={`h-3.5 w-3.5 ${light ? 'text-white/50' : 'text-slate-300'}`} />
          {item.to ? (
            <Link to={item.to} className={hover}>{item.label}</Link>
          ) : (
            <span className={`font-medium ${light ? 'text-white' : 'text-slate-800'}`}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
