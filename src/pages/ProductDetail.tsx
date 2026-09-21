import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Star, Truck, Zap } from 'lucide-react'
import { BRAND_MAP, CATEGORY_MAP } from '../data/categories'
import { GRADE_INFO, PRODUCT_MAP, PRODUCTS } from '../data/products'
import type { Grade } from '../data/types'
import Breadcrumbs from '../components/Breadcrumbs'
import DeviceArt from '../components/DeviceArt'
import ProductCard from '../components/ProductCard'
import { useStore } from '../context/StoreContext'
import { cx, formatINR, percentOff } from '../lib/format'

const CHECKS = [
  'Display & touch', 'Battery health', 'Cameras & flash', 'Speakers & mic', 'Charging port', 'Buttons & sensors',
  'Wi-Fi / Bluetooth / GPS', 'Biometrics', 'SIM & network', 'Water damage indicator', 'Factory reset & data wipe', 'IMEI / serial blacklist check',
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toast, wishlist, toggleWishlist, city } = useStore()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'specs' | 'grade' | 'warranty'>('specs')

  const product = id ? PRODUCT_MAP[id] : undefined
  if (!product) return <Navigate to="/buy" replace />

  const brand = BRAND_MAP[product.brandId]
  const cat = CATEGORY_MAP[product.category]
  const off = percentOff(product.price, product.mrp)
  const wished = wishlist.includes(product.id)
  const siblings = PRODUCTS.filter((p) => p.name === product.name && p.id !== product.id)
  const similar = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  const delivery = new Date()
  delivery.setDate(delivery.getDate() + 3)

  const add = () => {
    addToCart(product.id, qty)
    toast(`${product.name} added to cart`)
  }
  const buyNow = () => {
    addToCart(product.id, qty)
    navigate('/checkout')
  }

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Buy', to: '/buy' }, { label: cat.name, to: `/buy?category=${cat.id}` }, { label: product.name }]} />

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card relative overflow-hidden bg-gradient-to-b from-slate-50 to-white p-8">
            <span className={cx('chip absolute left-4 top-4 ring-1', GRADE_INFO[product.grade].tone)}>{product.grade} condition</span>
            <button onClick={() => { toggleWishlist(product.id); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', 'info') }} className={cx('absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm', wished ? 'text-rose-500' : 'text-slate-400')} aria-label="Wishlist">
              <Heart className={cx('h-5 w-5', wished && 'fill-current')} />
            </button>
            <DeviceArt category={product.category} color={product.color} backdrop className="mx-auto h-80 w-80 max-w-full" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-600">
            <div className="card p-3"><BadgeCheck className="mx-auto mb-1 h-5 w-5 text-brand-600" />32-point quality check</div>
            <div className="card p-3"><ShieldCheck className="mx-auto mb-1 h-5 w-5 text-brand-600" />{product.warrantyMonths}-month warranty</div>
            <div className="card p-3"><RotateCcw className="mx-auto mb-1 h-5 w-5 text-brand-600" />7-day replacement</div>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{brand?.name}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {product.name} <span className="font-medium text-slate-500">({product.variant}, {product.colorName})</span>
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-0.5 rounded bg-brand-600 px-1.5 py-0.5 text-xs font-semibold text-white">{product.rating.toFixed(1)} <Star className="h-3 w-3 fill-current" /></span>
            <span className="text-slate-500">{product.reviews.toLocaleString('en-IN')} ratings</span>
            {product.stock <= 6 && <span className="chip bg-orange-100 text-orange-700">Only {product.stock} left</span>}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-4xl font-extrabold text-ink-900">{formatINR(product.price)}</span>
            <span className="pb-1 text-base text-slate-400 line-through">{formatINR(product.mrp)}</span>
            <span className="pb-1 text-base font-bold text-brand-700">{off}% off</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Inclusive of all taxes · No-cost EMI from {formatINR(Math.ceil(product.price / 6))}/month</p>

          {siblings.length > 0 && (
            <div className="mt-5">
              <p className="label">Other options</p>
              <div className="flex flex-wrap gap-2">
                {[product, ...siblings].map((s) => (
                  <Link key={s.id} to={`/product/${s.id}`} className={cx('rounded-xl border-2 px-3 py-2 text-xs font-semibold', s.id === product.id ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-700 hover:border-slate-300')}>
                    {s.variant} · {s.grade}
                    <span className="block text-[11px] font-normal text-slate-500">{formatINR(s.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-700"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> {h}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={add} className="btn-secondary flex-1 !py-3"><ShoppingCart className="h-4 w-4" /> Add to cart</button>
            <button onClick={buyNow} className="btn-primary flex-1 !py-3">Buy now</button>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-slate-800"><Truck className="h-4 w-4 text-brand-600" /> Free delivery to {city}</p>
            <p className="mt-1 text-slate-600">Get it by <span className="font-semibold text-slate-800">{delivery.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span> · Cash on delivery available</p>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex gap-1 border-b border-slate-200">
              {([['specs', 'Specifications'], ['grade', 'Condition guide'], ['warranty', 'Warranty & checks']] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={cx('-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition', tab === k ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>{l}</button>
              ))}
            </div>
            <div className="pt-5">
              {tab === 'specs' && (
                <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[40%_60%] px-4 py-2.5 text-sm">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="font-medium text-slate-800">{v}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-[40%_60%] px-4 py-2.5 text-sm">
                    <dt className="text-slate-500">Colour</dt>
                    <dd className="flex items-center gap-2 font-medium text-slate-800"><span className="h-4 w-4 rounded-full border border-slate-200" style={{ background: product.color }} /> {product.colorName}</dd>
                  </div>
                  <div className="grid grid-cols-[40%_60%] px-4 py-2.5 text-sm">
                    <dt className="text-slate-500">In the box</dt>
                    <dd className="font-medium text-slate-800">Device, charging cable, SIM tool (where applicable), warranty card</dd>
                  </div>
                </dl>
              )}
              {tab === 'grade' && (
                <div className="space-y-3">
                  {(Object.keys(GRADE_INFO) as Grade[]).map((g) => (
                    <div key={g} className={cx('rounded-2xl border-2 p-4', g === product.grade ? 'border-brand-600 bg-brand-50' : 'border-slate-200')}>
                      <div className="flex items-center justify-between">
                        <span className={cx('chip ring-1', GRADE_INFO[g].tone)}>{g}</span>
                        {g === product.grade && <span className="text-xs font-bold text-brand-700">This device</span>}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{GRADE_INFO[g].description}</p>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">All grades are 100% functional and pass the same 32-point inspection. Grades only describe cosmetic condition.</p>
                </div>
              )}
              {tab === 'warranty' && (
                <div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4"><ShieldCheck className="h-5 w-5 text-brand-600" /><p className="mt-2 text-sm font-semibold">{product.warrantyMonths}-month warranty</p><p className="text-xs text-slate-500">Covers all manufacturing & functional defects.</p></div>
                    <div className="rounded-2xl bg-slate-50 p-4"><RotateCcw className="h-5 w-5 text-brand-600" /><p className="mt-2 text-sm font-semibold">7-day replacement</p><p className="text-xs text-slate-500">Not happy? Get a replacement or full refund.</p></div>
                    <div className="rounded-2xl bg-slate-50 p-4"><BadgeCheck className="h-5 w-5 text-brand-600" /><p className="mt-2 text-sm font-semibold">Certified refurbished</p><p className="text-xs text-slate-500">Restored by ReCart-certified technicians.</p></div>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-slate-800">32-point quality check includes</p>
                  <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-slate-600 sm:grid-cols-3">
                    {CHECKS.map((c) => (
                      <li key={c} className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-brand-600" /> {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">Similar devices</h2>
            <Link to={`/buy?category=${product.category}`} className="text-sm font-semibold text-brand-700 hover:underline">View all {cat.short.toLowerCase()}</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
