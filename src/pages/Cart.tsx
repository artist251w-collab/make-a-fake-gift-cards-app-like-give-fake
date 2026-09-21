import { Link } from 'react-router-dom'
import { ArrowRight, Minus, PartyPopper, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PRODUCT_MAP, GRADE_INFO } from '../data/products'
import { BRAND_MAP } from '../data/categories'
import DeviceArt from '../components/DeviceArt'
import Breadcrumbs from '../components/Breadcrumbs'
import { cx, formatINR } from '../lib/format'

export const DELIVERY_FEE = 0
export const cartDiscount = (subtotal: number) => (subtotal >= 50000 ? 1500 : subtotal >= 20000 ? 500 : 0)

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, toast } = useStore()
  const items = cart.map((i) => ({ ...i, product: PRODUCT_MAP[i.productId] })).filter((i) => i.product)
  const discount = cartDiscount(cartTotal)
  const mrpTotal = items.reduce((s, i) => s + i.product.mrp * i.qty, 0)

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <div className="card mx-auto max-w-md p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600"><ShoppingBag className="h-8 w-8" /></span>
          <h1 className="mt-4 text-xl font-bold text-ink-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-slate-500">Browse certified refurbished devices with 6-month warranty.</p>
          <Link to="/buy" className="btn-primary mt-6">Start shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Cart' }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">Shopping cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="card flex gap-4 p-4">
              <Link to={`/product/${product.id}`} className="shrink-0 rounded-xl bg-slate-50 p-2">
                <DeviceArt category={product.category} color={product.color} className="h-24 w-24" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{BRAND_MAP[product.brandId]?.name}</p>
                <Link to={`/product/${product.id}`} className="block truncate font-semibold text-slate-900 hover:text-brand-700">{product.name}</Link>
                <p className="text-xs text-slate-500">{product.variant} · {product.colorName}</p>
                <span className={cx('chip mt-1.5 ring-1', GRADE_INFO[product.grade].tone)}>{product.grade}</span>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-xl border border-slate-200">
                    <button onClick={() => setQty(product.id, qty - 1)} className="p-2 text-slate-600 hover:bg-slate-50" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, Math.min(product.stock, qty + 1))} className="p-2 text-slate-600 hover:bg-slate-50" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900">{formatINR(product.price * qty)}</p>
                    <p className="text-xs text-slate-400 line-through">{formatINR(product.mrp * qty)}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => { removeFromCart(product.id); toast('Removed from cart', 'info') }} className="self-start rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Price details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Price ({items.reduce((s, i) => s + i.qty, 0)} items)</dt><dd>{formatINR(mrpTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Refurbished savings</dt><dd className="text-brand-700">− {formatINR(mrpTotal - cartTotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between"><dt className="text-slate-600">Cart offer</dt><dd className="text-brand-700">− {formatINR(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-slate-600">Delivery</dt><dd className="text-brand-700">{DELIVERY_FEE === 0 ? 'FREE' : formatINR(DELIVERY_FEE)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold"><dt>Total</dt><dd>{formatINR(cartTotal - discount + DELIVERY_FEE)}</dd></div>
            </dl>
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800"><PartyPopper className="h-3.5 w-3.5" /> You save {formatINR(mrpTotal - cartTotal + discount)} on this order</p>
            {discount === 0 && cartTotal < 20000 && <p className="mt-2 text-xs text-slate-500">Add {formatINR(20000 - cartTotal)} more to unlock ₹500 off.</p>}
            <Link to="/checkout" className="btn-primary mt-5 w-full !py-3">Proceed to checkout <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Safe & secure payments · 7-day replacement</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
