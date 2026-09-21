import { Link } from 'react-router-dom'
import { Heart, ShieldCheck, Star } from 'lucide-react'
import type { Product } from '../data/types'
import { BRAND_MAP } from '../data/categories'
import { GRADE_INFO } from '../data/products'
import { cx, formatINR, percentOff } from '../lib/format'
import { useStore } from '../context/StoreContext'
import DeviceArt from './DeviceArt'

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart, toast, wishlist, toggleWishlist } = useStore()
  const off = percentOff(product.price, product.mrp)
  const wished = wishlist.includes(product.id)
  const grade = GRADE_INFO[product.grade]

  return (
    <div className="card group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="relative block bg-gradient-to-b from-slate-50 to-white p-4">
        <DeviceArt category={product.category} color={product.color} className={cx('mx-auto', compact ? 'h-32' : 'h-40')} />
        {product.badge && (
          <span
            className={cx(
              'chip absolute left-3 top-3',
              product.badge === 'Deal of the day' && 'bg-rose-100 text-rose-700',
              product.badge === 'Bestseller' && 'bg-amber-100 text-amber-800',
              product.badge === 'Limited stock' && 'bg-orange-100 text-orange-700',
              product.badge === 'New arrival' && 'bg-sky-100 text-sky-700',
            )}
          >
            {product.badge}
          </span>
        )}
      </Link>
      <button
        onClick={() => {
          toggleWishlist(product.id)
          toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
        }}
        className={cx(
          'absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:scale-110',
          wished ? 'text-rose-500' : 'text-slate-400',
        )}
        aria-label="Toggle wishlist"
      >
        <Heart className={cx('h-4 w-4', wished && 'fill-current')} />
      </button>

      <div className="flex flex-1 flex-col p-4 pt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{BRAND_MAP[product.brandId]?.name}</p>
          <span className={cx('chip !py-0.5 ring-1', grade.tone)}>{grade.label}</span>
        </div>
        <Link to={`/product/${product.id}`} className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-700">
          {product.name} <span className="font-normal text-slate-500">({product.variant})</span>
        </Link>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-0.5 rounded bg-brand-600 px-1.5 py-0.5 font-semibold text-white">
            {product.rating.toFixed(1)} <Star className="h-3 w-3 fill-current" />
          </span>
          <span>({product.reviews.toLocaleString('en-IN')})</span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-extrabold text-slate-900">{formatINR(product.price)}</span>
          <span className="whitespace-nowrap text-xs text-slate-400 line-through">{formatINR(product.mrp)}</span>
          {off > 0 && <span className="whitespace-nowrap text-xs font-bold text-brand-700">{off}% off</span>}
        </div>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> {product.warrantyMonths}-month warranty · Free delivery
        </p>
        <div className="mt-auto pt-3">
          <button
            onClick={() => {
              addToCart(product.id)
              toast(`${product.name} added to cart`)
            }}
            className="btn-secondary w-full !py-2 group-hover:border-brand-500 group-hover:bg-brand-600 group-hover:text-white"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
