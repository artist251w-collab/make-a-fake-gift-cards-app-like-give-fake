import { Link } from 'react-router-dom'
import { ArrowRight, Banknote, Lock, Truck } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { MODELS } from '../data/models'
import { CATEGORY_ICONS } from '../lib/categoryIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import DeviceArt from '../components/DeviceArt'
import { formatINR } from '../lib/format'
import { maxPrice } from '../lib/pricing'

export default function SellCategories() {
  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Sell' }]} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">What do you want to sell?</h1>
          <p className="mt-2 text-slate-600">Select a category to get an instant quote. Free pickup, instant payment.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.id]
              const top = MODELS.filter((m) => m.category === c.id).sort((a, b) => maxPrice(b) - maxPrice(a))[0]
              const sample = MODELS.find((m) => m.category === c.id && m.brandId === 'apple') ?? top
              return (
                <Link key={c.id} to={`/sell/${c.id}`} className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <DeviceArt category={c.id} color={sample.color} className="h-20 w-20 -mr-2 -mt-2" />
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-ink-900">{c.name}</h2>
                  <p className="text-sm text-slate-500">{c.tagline}</p>
                  <p className="mt-3 text-xs font-semibold text-brand-700">
                    Get up to {formatINR(maxPrice(top))} <ArrowRight className="inline h-3.5 w-3.5" />
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
        <aside className="space-y-4 lg:pt-16">
          <div className="card p-5">
            <h3 className="font-bold text-ink-900">Why sell on ReCart?</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3"><Banknote className="h-5 w-5 shrink-0 text-brand-600" /> Instant payment via UPI or bank transfer at your doorstep.</li>
              <li className="flex gap-3"><Truck className="h-5 w-5 shrink-0 text-brand-600" /> Free pickup from 12+ cities within 24 hours.</li>
              <li className="flex gap-3"><Lock className="h-5 w-5 shrink-0 text-brand-600" /> Certified data erasure with an emailed certificate.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-600 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-100">Tip</p>
            <p className="mt-1 text-sm">Keep your original box, charger and bill handy – they add up to <span className="font-bold">7% extra</span> to your quote.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
