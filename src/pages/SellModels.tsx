import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { BRAND_MAP, CATEGORY_MAP } from '../data/categories'
import { modelsFor } from '../data/models'
import type { CategoryId } from '../data/types'
import Breadcrumbs from '../components/Breadcrumbs'
import BrandMark from '../components/BrandMark'
import DeviceArt from '../components/DeviceArt'
import { formatINR } from '../lib/format'
import { maxPrice } from '../lib/pricing'

export default function SellModels() {
  const { category, brandId } = useParams()
  const cat = category ? CATEGORY_MAP[category as CategoryId] : undefined
  const brand = brandId ? BRAND_MAP[brandId] : undefined
  const [q, setQ] = useState('')

  const models = useMemo(() => {
    if (!cat || !brand) return []
    const all = modelsFor(cat.id, brand.id)
    const query = q.trim().toLowerCase()
    return (query ? all.filter((m) => m.name.toLowerCase().includes(query)) : all).sort((a, b) => b.year - a.year || maxPrice(b) - maxPrice(a))
  }, [cat, brand, q])

  if (!cat || !brand) return <Navigate to="/sell" replace />

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Sell', to: '/sell' }, { label: cat.name, to: `/sell/${cat.id}` }, { label: brand.name }]} />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark brandId={brand.id} size="lg" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Sell old {brand.name} {cat.short.toLowerCase()}</h1>
            <p className="text-sm text-slate-600">Select your exact model to get a quote.</p>
          </div>
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${brand.name} models`} className="input pl-10" />
        </div>
      </div>

      {models.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-slate-500">No models match “{q}”.</div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {models.map((mo) => (
            <Link key={mo.id} to={`/sell/${cat.id}/${brand.id}/${mo.id}`} className="card group flex flex-col items-center p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg">
              <DeviceArt category={mo.category} color={mo.color} className="h-28 w-28" />
              <span className="mt-2 text-sm font-semibold text-slate-800 group-hover:text-brand-700">{mo.name}</span>
              <span className="text-xs text-slate-400">{mo.year}</span>
              <span className="mt-2 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">Up to {formatINR(maxPrice(mo))}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
