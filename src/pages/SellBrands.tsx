import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { brandsForCategory, CATEGORY_MAP } from '../data/categories'
import { MODELS } from '../data/models'
import type { CategoryId } from '../data/types'
import Breadcrumbs from '../components/Breadcrumbs'
import BrandMark from '../components/BrandMark'
import DeviceArt from '../components/DeviceArt'
import { formatINR } from '../lib/format'
import { maxPrice } from '../lib/pricing'

export default function SellBrands() {
  const { category } = useParams()
  const cat = category ? CATEGORY_MAP[category as CategoryId] : undefined
  if (!cat) return <Navigate to="/sell" replace />

  const brands = brandsForCategory(cat.id)
  const popular = MODELS.filter((m) => m.category === cat.id).sort((a, b) => b.year - a.year || maxPrice(b) - maxPrice(a)).slice(0, 8)

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Sell', to: '/sell' }, { label: cat.name }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">Sell old {cat.name.toLowerCase()}</h1>
      <p className="mt-2 text-slate-600">Select a brand to continue.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {brands.map((b) => {
          const count = MODELS.filter((m) => m.category === cat.id && m.brandId === b.id).length
          return (
            <Link key={b.id} to={`/sell/${cat.id}/${b.id}`} className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
              <BrandMark brandId={b.id} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-800">{b.name}</span>
                <span className="block text-xs text-slate-500">{count} models</span>
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          )
        })}
      </div>

      <h2 className="mt-14 text-xl font-bold text-ink-900">Popular {cat.short.toLowerCase()} right now</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {popular.map((mo) => (
          <Link key={mo.id} to={`/sell/${mo.category}/${mo.brandId}/${mo.id}`} className="card flex items-center gap-3 p-3 transition hover:border-brand-300 hover:shadow-md">
            <DeviceArt category={mo.category} color={mo.color} className="h-16 w-16 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-800">{mo.name}</span>
              <span className="block text-xs font-bold text-brand-700">Up to {formatINR(maxPrice(mo))}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
