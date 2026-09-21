import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { Banknote, CheckCircle2, Download, MapPin, Package, Phone, Truck, XCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import type { AnyOrder } from '../data/types'
import { PRODUCT_MAP } from '../data/products'
import Breadcrumbs from '../components/Breadcrumbs'
import DeviceArt from '../components/DeviceArt'
import { cx, formatDate, formatDateTime, formatINR } from '../lib/format'
import { OrderThumb, orderAmount, orderTitle, statusTone } from './Orders'

const TIMELINES: Record<AnyOrder['type'], string[]> = {
  sell: ['Pickup scheduled', 'Picked up', 'Payment done'],
  buy: ['Confirmed', 'Shipped', 'Delivered'],
  repair: ['Technician assigned', 'In repair', 'Completed'],
}

export default function OrderDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { orders, cancelOrder, toast } = useStore()
  const order = orders.find((o) => o.id === id)
  if (!order) return <Navigate to="/orders" replace />

  const isNew = params.get('new') === '1'
  const timeline = TIMELINES[order.type]
  const stage = order.status === 'Cancelled' ? -1 : timeline.indexOf(order.status)
  const cancellable = order.status === timeline[0]

  const cancel = () => {
    if (window.confirm('Cancel this order?')) {
      cancelOrder(order.id)
      toast('Order cancelled', 'info')
    }
  }

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'My orders', to: '/orders' }, { label: order.id }]} />

      {isNew && order.status !== 'Cancelled' && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 animate-pop">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
          <div>
            <p className="font-bold text-brand-900">
              {order.type === 'sell' ? 'Pickup scheduled!' : order.type === 'buy' ? 'Order placed successfully!' : 'Repair booked!'}
            </p>
            <p className="text-sm text-brand-800">
              {order.type === 'sell'
                ? `Our executive will arrive on ${formatDate(order.pickupDate)} between ${order.pickupSlot}. Keep the device charged and remove your SIM & memory card.`
                : order.type === 'buy'
                  ? `Your order will be delivered by ${formatDate(order.eta)}. We've sent the details to +91 ${order.address.phone}.`
                  : `A technician will visit on ${formatDate(order.pickupDate)} between ${order.pickupSlot}.`}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <OrderThumb order={order} className="h-20 w-20" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{order.type === 'sell' ? 'Sell order' : order.type === 'buy' ? 'Purchase' : 'Repair booking'} · {order.id}</p>
                  <h1 className="text-xl font-extrabold text-ink-900">{orderTitle(order)}</h1>
                  <p className="text-xs text-slate-500">Placed on {formatDateTime(order.createdAt)}</p>
                </div>
              </div>
              <span className={cx('chip !text-sm', statusTone(order.status))}>{order.status}</span>
            </div>

            {/* Timeline */}
            <ol className="mt-6 grid grid-cols-3 gap-2">
              {timeline.map((label, i) => {
                const done = stage >= i
                return (
                  <li key={label} className="relative">
                    <div className={cx('h-1.5 rounded-full', done ? 'bg-brand-600' : 'bg-slate-200')} />
                    <p className={cx('mt-2 text-xs font-semibold', done ? 'text-brand-800' : 'text-slate-400')}>{label}</p>
                  </li>
                )
              })}
            </ol>
            {order.status === 'Cancelled' && (
              <p className="mt-3 flex items-center gap-2 text-sm text-rose-600"><XCircle className="h-4 w-4" /> This order was cancelled.</p>
            )}
          </div>

          {order.type === 'buy' && (
            <div className="card p-5 sm:p-6">
              <h2 className="font-bold text-ink-900">Items</h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {order.items.map((it) => {
                  const p = PRODUCT_MAP[it.productId]
                  return (
                    <li key={it.productId} className="flex items-center gap-3 py-3">
                      {p && <DeviceArt category={p.category} color={p.color} className="h-14 w-14 shrink-0 rounded-lg bg-slate-50" />}
                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${it.productId}`} className="block truncate text-sm font-semibold text-slate-800 hover:text-brand-700">{it.name}</Link>
                        <p className="text-xs text-slate-500">{it.variant} · {it.grade} · Qty {it.qty}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatINR(it.price * it.qty)}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {order.type === 'sell' && (
            <div className="card p-5 sm:p-6">
              <h2 className="font-bold text-ink-900">Quote breakdown</h2>
              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {order.quoteLines.map((l, i) => (
                  <li key={i} className="flex justify-between py-2">
                    <span className={l.kind === 'base' ? 'font-semibold text-slate-900' : 'text-slate-600'}>{l.label}</span>
                    <span className={cx('font-semibold', l.kind === 'minus' ? 'text-rose-600' : 'text-slate-900')}>{l.kind === 'minus' ? '− ' : ''}{formatINR(Math.abs(l.amount))}</span>
                  </li>
                ))}
                <li className="flex justify-between py-2 text-base font-extrabold text-brand-800"><span>You receive</span><span>{formatINR(order.price)}</span></li>
              </ul>
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-semibold">Before pickup</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  <li>Back up your data and sign out of iCloud / Google account.</li>
                  <li>Remove SIM card, memory card and any screen lock.</li>
                  <li>Keep the device, accessories and ID proof ready.</li>
                </ul>
              </div>
            </div>
          )}

          {order.type === 'repair' && (
            <div className="card p-5 sm:p-6">
              <h2 className="font-bold text-ink-900">Service details</h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-slate-500">Device</dt><dd className="font-semibold">{order.brandName} {order.modelName}</dd></div>
                <div><dt className="text-slate-500">Service</dt><dd className="font-semibold">{order.service}</dd></div>
                <div><dt className="text-slate-500">Estimated cost</dt><dd className="font-semibold">{formatINR(order.price)}</dd></div>
                <div><dt className="text-slate-500">Warranty</dt><dd className="font-semibold">6 months on parts & labour</dd></div>
              </dl>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-ink-900"><MapPin className="h-4 w-4 text-brand-600" /> {order.type === 'buy' ? 'Delivery address' : 'Pickup address'}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-800">{order.address.name}</p>
            <p className="text-sm text-slate-600">{order.address.line1}</p>
            <p className="text-sm text-slate-600">{order.address.city} – {order.address.pincode}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><Phone className="h-3.5 w-3.5" /> +91 {order.address.phone}</p>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-ink-900">
              {order.type === 'buy' ? <Package className="h-4 w-4 text-brand-600" /> : <Truck className="h-4 w-4 text-brand-600" />}
              {order.type === 'buy' ? 'Delivery' : order.type === 'sell' ? 'Pickup slot' : 'Technician visit'}
            </h2>
            {order.type === 'buy' ? (
              <p className="mt-2 text-sm text-slate-700">Expected by <span className="font-semibold">{formatDate(order.eta)}</span></p>
            ) : (
              <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">{formatDate(order.pickupDate)}</span> · {order.pickupSlot}</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-ink-900"><Banknote className="h-4 w-4 text-brand-600" /> Payment</h2>
            {order.type === 'sell' ? (
              <p className="mt-2 text-sm text-slate-700">
                {order.payment === 'upi' ? 'UPI' : order.payment === 'bank' ? 'Bank transfer' : 'ReCart wallet'} · <span className="font-mono text-xs">{order.paymentDetail}</span>
                <span className="mt-1 block text-lg font-extrabold text-brand-700">+ {formatINR(order.price)}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-700">
                {order.type === 'buy' ? (order.payment === 'upi' ? 'Paid via UPI' : order.payment === 'card' ? 'Paid by card' : 'Cash on delivery') : 'Pay after service'}
                <span className="mt-1 block text-lg font-extrabold text-slate-900">{formatINR(orderAmount(order))}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => toast('Invoice download will be available once the order is completed.', 'info')} className="btn-secondary"><Download className="h-4 w-4" /> Download invoice</button>
            {cancellable && <button onClick={cancel} className="btn-ghost text-rose-600 hover:bg-rose-50">Cancel order</button>}
            <Link to="/orders" className="btn-ghost">Back to orders</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
