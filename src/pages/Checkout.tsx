import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Loader2, Lock, Smartphone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { PRODUCT_MAP } from '../data/products'
import type { Address, BuyOrder } from '../data/types'
import AddressForm, { emptyAddress, validateAddress } from '../components/AddressForm'
import DeviceArt from '../components/DeviceArt'
import Breadcrumbs from '../components/Breadcrumbs'
import { cx, formatINR, generateOrderId } from '../lib/format'
import { cartDiscount, DELIVERY_FEE } from './Cart'

export default function Checkout() {
  const { cart, cartTotal, clearCart, addOrder, toast } = useStore()
  const navigate = useNavigate()
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})
  const [payment, setPayment] = useState<BuyOrder['payment']>('upi')
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [payError, setPayError] = useState('')
  const [placing, setPlacing] = useState(false)

  const items = cart.map((i) => ({ ...i, product: PRODUCT_MAP[i.productId] })).filter((i) => i.product)
  if (items.length === 0 && !placing) return <Navigate to="/cart" replace />

  const discount = cartDiscount(cartTotal)
  const total = cartTotal - discount + DELIVERY_FEE

  const place = () => {
    const errs = validateAddress(address)
    setErrors(errs)
    let pe = ''
    if (payment === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi)) pe = 'Enter a valid UPI ID (e.g. name@upi)'
    if (payment === 'card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) pe = 'Enter a valid 16-digit card number'
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) pe = 'Expiry must be MM/YY'
      else if (!/^\d{3}$/.test(card.cvv)) pe = 'Enter the 3-digit CVV'
    }
    setPayError(pe)
    if (Object.keys(errs).length || pe) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setPlacing(true)
    const eta = new Date()
    eta.setDate(eta.getDate() + 3)
    window.setTimeout(() => {
      const order: BuyOrder = {
        id: generateOrderId('ORD'),
        type: 'buy',
        createdAt: new Date().toISOString(),
        items: items.map((i) => ({ productId: i.product.id, name: i.product.name, variant: i.product.variant, price: i.product.price, qty: i.qty, grade: i.product.grade })),
        subtotal: cartTotal,
        discount,
        delivery: DELIVERY_FEE,
        total,
        address,
        payment,
        status: 'Confirmed',
        eta: eta.toISOString(),
      }
      addOrder(order)
      clearCart()
      toast('Order placed successfully!')
      navigate(`/orders/${order.id}?new=1`)
    }, 1200)
  }

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink-900">1. Delivery address</h2>
            <div className="mt-4"><AddressForm value={address} onChange={setAddress} errors={errors} /></div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink-900">2. Payment method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { id: 'upi' as const, title: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
                { id: 'card' as const, title: 'Card', desc: 'Credit / debit, EMI', icon: CreditCard },
                { id: 'cod' as const, title: 'Cash on delivery', desc: 'Pay when it arrives', icon: Banknote },
              ].map((p) => (
                <button key={p.id} type="button" data-selected={payment === p.id} onClick={() => { setPayment(p.id); setPayError('') }} className="option-card !flex-row items-center gap-3">
                  <p.icon className="h-5 w-5 text-brand-600" />
                  <span><span className="block text-sm font-semibold text-slate-900">{p.title}</span><span className="block text-xs text-slate-500">{p.desc}</span></span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              {payment === 'upi' && (
                <div className="sm:max-w-sm">
                  <label className="label">UPI ID</label>
                  <input className="input" value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="yourname@upi" />
                </div>
              )}
              {payment === 'card' && (
                <div className="grid gap-3 sm:max-w-md sm:grid-cols-[1fr_100px_80px]">
                  <div className="sm:col-span-3">
                    <label className="label">Card number</label>
                    <input className="input" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="sm:col-start-1">
                    <label className="label">Name on card</label>
                    <input className="input" placeholder="AARAV SHARMA" />
                  </div>
                  <div>
                    <label className="label">Expiry</label>
                    <input className="input" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.replace(/[^\d]/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/') })} placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="label">CVV</label>
                    <input className="input" inputMode="numeric" type="password" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} placeholder="•••" />
                  </div>
                </div>
              )}
              {payment === 'cod' && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">A ₹49 handling fee is waived for your first COD order. Please keep exact change ready.</p>}
              {payError && <p className="mt-2 text-sm text-rose-600">{payError}</p>}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="font-bold text-ink-900">Order summary</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <DeviceArt category={product.category} color={product.color} className="h-14 w-14 shrink-0 rounded-lg bg-slate-50" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.variant} · {product.grade} · Qty {qty}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatINR(product.price * qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd>{formatINR(cartTotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between"><dt className="text-slate-600">Cart offer</dt><dd className="text-brand-700">− {formatINR(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-slate-600">Delivery</dt><dd className="text-brand-700">FREE</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold"><dt>To pay</dt><dd>{formatINR(total)}</dd></div>
            </dl>
            <button onClick={place} disabled={placing} className={cx('btn-primary mt-5 w-full !py-3')}>
              {placing ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : payment === 'cod' ? 'Place order' : `Pay ${formatINR(total)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500"><Lock className="h-3.5 w-3.5 text-brand-600" /> 256-bit encrypted · Demo checkout, no real payment</p>
            <Link to="/cart" className="mt-2 block text-center text-xs font-semibold text-brand-700 hover:underline">Edit cart</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
