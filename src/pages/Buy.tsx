import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, SlidersHorizontal, X } from 'lucide-react'
import { BRAND_MAP, BRANDS, CATEGORIES, CATEGORY_MAP } from '../data/categories'
import { GRADE_INFO, PRODUCTS } from '../data/products'
import type { CategoryId, Grade } from '../data/types'
import ProductCard from '../components/ProductCard'
import Breadcrumbs from '../components/Breadcrumbs'
import { useStore } from '../context/StoreContext'
import { cx, formatINR } from '../lib/format'

const SORTS = [
  { id: 'popular', label: 'Popularity' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount' },
  { id: 'rating', label: 'Top rated' },
]

const PRICE_BUCKETS = [
  { id: 'lt20', label: 'Under ₹20,000', min: 0, max: 20000 },
  { id: '20to40', label: '₹20,000 – ₹40,000', min: 20000, max: 40000 },
  { id: '40to70', label: '₹40,000 – ₹70,000', min: 40000, max: 70000 },
  { id: 'gt70', label: 'Above ₹70,000', min: 70000, max: Infinity },
]

export default function Buy() {
  const [params, setParams] = useSearchParams()
  const { wishlist } = useStore()
  const [mobileFilters, setMobileFilters] = useState(false)

  const category = (params.get('category') as CategoryId | null) ?? ''
  const brand = params.get('brand') ?? ''
  const grades = params.getAll('grade') as Grade[]
  const price = params.get('price') ?? ''
  const sort = params.get('sort') ?? 'popular'
  const q = params.get('q') ?? ''
  const wishlistOnly = params.get('wishlist') === '1'

  const update = (patch: Record<string, string | string[] | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      next.delete(k)
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x))
      else if (v) next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  const toggleGrade = (g: Grade) => update({ grade: grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g] })

  const results = useMemo(() => {
    let list = PRODUCTS.slice()
    if (wishlistOnly) list = list.filter((p) => wishlist.includes(p.id))
    if (category) list = list.filter((p) => p.category === category)
    if (brand) list = list.filter((p) => p.brandId === brand)
    if (grades.length) list = list.filter((p) => grades.includes(p.grade))
    const bucket = PRICE_BUCKETS.find((b) => b.id === price)
    if (bucket) list = list.filter((p) => p.price >= bucket.min && p.price < bucket.max)
    if (q.trim()) {
      const tokens = q.toLowerCase().split(/\s+/)
      list = list.filter((p) => {
        const hay = `${BRAND_MAP[p.brandId]?.name} ${p.name} ${p.variant} ${p.category} ${CATEGORY_MAP[p.category].name} ${p.colorName}`.toLowerCase()
        return tokens.every((t) => hay.includes(t))
      })
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'discount': list.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp); break
      case 'rating': list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break
      default: list.sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)
    }
    return list
  }, [category, brand, grades, price, sort, q, wishlistOnly, wishlist])

  const availableBrands = BRANDS.filter((b) => PRODUCTS.some((p) => p.brandId === b.id && (!category || p.category === category)))
  const activeCount = [category, brand, price, q, wishlistOnly ? '1' : ''].filter(Boolean).length + grades.length
  const title = wishlistOnly
    ? 'Your wishlist'
    : q
      ? `Results for “${q}”`
      : category
        ? `Refurbished ${CATEGORY_MAP[category].name.toLowerCase()}`
        : 'Certified refurbished devices'

  const Filters = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        <FilterOption active={!category} onClick={() => update({ category: null, brand: null })}>All categories</FilterOption>
        {CATEGORIES.map((c) => (
          <FilterOption key={c.id} active={category === c.id} onClick={() => update({ category: c.id, brand: null })}>
            {c.name} <span className="text-slate-400">({PRODUCTS.filter((p) => p.category === c.id).length})</span>
          </FilterOption>
        ))}
      </FilterGroup>
      <FilterGroup title="Brand">
        <FilterOption active={!brand} onClick={() => update({ brand: null })}>All brands</FilterOption>
        {availableBrands.map((b) => (
          <FilterOption key={b.id} active={brand === b.id} onClick={() => update({ brand: b.id })}>{b.name}</FilterOption>
        ))}
      </FilterGroup>
      <FilterGroup title="Condition">
        {(Object.keys(GRADE_INFO) as Grade[]).map((g) => (
          <label key={g} className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
            <input type="checkbox" checked={grades.includes(g)} onChange={() => toggleGrade(g)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-600" />
            <span>
              <span className="font-medium text-slate-800">{g}</span>
              <span className="block text-xs text-slate-500">{GRADE_INFO[g].description}</span>
            </span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        <FilterOption active={!price} onClick={() => update({ price: null })}>Any price</FilterOption>
        {PRICE_BUCKETS.map((b) => (
          <FilterOption key={b.id} active={price === b.id} onClick={() => update({ price: b.id })}>{b.label}</FilterOption>
        ))}
      </FilterGroup>
    </div>
  )

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Buy refurbished', to: '/buy' }, ...(category ? [{ label: CATEGORY_MAP[category].name }] : [])]} />

      {/* Category pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Pill active={!category && !wishlistOnly} onClick={() => update({ category: null, brand: null, wishlist: null })}>All</Pill>
        {CATEGORIES.map((c) => (
          <Pill key={c.id} active={category === c.id} onClick={() => update({ category: c.id, brand: null, wishlist: null })}>{c.short}</Pill>
        ))}
        <Pill active={wishlistOnly} onClick={() => update({ wishlist: wishlistOnly ? null : '1' })}>
          <Heart className={cx('h-3.5 w-3.5', wishlistOnly && 'fill-current')} /> Wishlist ({wishlist.length})
        </Pill>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
          <p className="text-sm text-slate-500">{results.length} {results.length === 1 ? 'device' : 'devices'} · 6-month warranty · Free delivery</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileFilters(true)} className="btn-secondary !py-2 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[10px] text-white">{activeCount}</span>}
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:inline">Sort by</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="input !w-auto !py-2">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {q && <ActiveChip onClear={() => update({ q: null })}>“{q}”</ActiveChip>}
          {category && <ActiveChip onClear={() => update({ category: null, brand: null })}>{CATEGORY_MAP[category].name}</ActiveChip>}
          {brand && <ActiveChip onClear={() => update({ brand: null })}>{BRAND_MAP[brand]?.name}</ActiveChip>}
          {grades.map((g) => <ActiveChip key={g} onClear={() => toggleGrade(g)}>{g}</ActiveChip>)}
          {price && <ActiveChip onClear={() => update({ price: null })}>{PRICE_BUCKETS.find((b) => b.id === price)?.label}</ActiveChip>}
          {wishlistOnly && <ActiveChip onClear={() => update({ wishlist: null })}>Wishlist</ActiveChip>}
          <button onClick={() => setParams({}, { replace: true })} className="text-xs font-semibold text-brand-700 hover:underline">Clear all</button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-4">{Filters}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="card flex flex-col items-center p-12 text-center">
              <p className="text-lg font-semibold text-slate-800">No devices found</p>
              <p className="mt-1 text-sm text-slate-500">Try removing some filters or search for a different model.</p>
              <button onClick={() => setParams({}, { replace: true })} className="btn-primary mt-5">Clear filters</button>
              {q && (
                <Link to="/sell" className="mt-3 text-sm font-semibold text-brand-700 hover:underline">Looking to sell “{q}” instead?</Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-dashed border-brand-300 bg-brand-50/60 p-6 text-center">
            <p className="font-semibold text-ink-900">Have an old device? Get up to {formatINR(110000)} for it.</p>
            <p className="mt-1 text-sm text-slate-600">Sell it on ReCart and use the money towards your refurbished upgrade.</p>
            <Link to="/sell" className="btn-primary mt-4">Check price</Link>
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 lg:hidden" onClick={() => setMobileFilters(false)}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setMobileFilters(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            {Filters}
            <button onClick={() => setMobileFilters(false)} className="btn-primary mt-6 w-full">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function FilterOption({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cx('block w-full rounded-lg px-2 py-1.5 text-left text-sm transition', active ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-700 hover:bg-slate-50')}>
      {children}
    </button>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cx('flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition', active ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300')}>
      {children}
    </button>
  )
}

function ActiveChip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="chip bg-slate-100 text-slate-700">
      {children}
      <button onClick={onClear} className="ml-0.5 rounded-full p-0.5 hover:bg-slate-200" aria-label="Remove filter"><X className="h-3 w-3" /></button>
    </span>
  )
}
