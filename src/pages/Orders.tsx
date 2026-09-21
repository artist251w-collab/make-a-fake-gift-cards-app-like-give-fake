import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Package, ShoppingBag, Tag, Wrench } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import type { AnyOrder } from '../data/types'
import { PRODUCT_MAP } from '../data/products'
import { MODEL_MAP } from '../data/models'
import DeviceArt from '../components/DeviceArt'
import Breadcrumbs from '../components/Breadcrumbs'
import { cx, formatDate, formatINR } from '../lib/format'

type Tab = 'all' | 'sell' | 'buy' | 'repair'

export const statusTone = (status: string) =>
  status === 'Cancelled'
    ? 'bg-rose-100 text-rose-700'
    : ['Payment done', 'Delivered', 'Completed'].includes(status)
      ? 'bg-brand-100 text-brand-800'
      : 'bg-sky-100 text-sky-800'

export default function Orders() {
  const { orders } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const list = orders.filter((o) => tab === 'all' || o.type === tab)

  return (
    <div className="container-x py-8">
      <Breadcrumbs items={[{ label: 'My orders' }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">My orders</h1>
      <p className="text-sm text-slate-500">Track your sell pickups, purchases and repair bookings.</p>

      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {([
          ['all', 'All', Package, orders.length],
          ['sell', 'Sell', Tag, orders.filter((o) => o.type === 'sell').length],
          ['buy', 'Purchases', ShoppingBag, orders.filter((o) => o.type === 'buy').length],
          ['repair', 'Repairs', Wrench, orders.filter((o) => o.type === 'repair').length],
        ] as const).map(([id, label, Icon, count]) => (
          <button key={id} onClick={() => setTab(id)} className={cx('flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition', tab === id ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300')}>
            <Icon className="h-3.5 w-3.5" /> {label} <span className={cx('rounded-full px-1.5 text-[10px]', tab === id ? 'bg-white/20' : 'bg-slate-100')}>{count}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Package className="h-8 w-8" /></span>
          <h2 className="mt-4 text-lg font-bold text-ink-900">No orders yet</h2>
          <p className="mt-1 text-sm text-slate-500">Sell an old device or shop refurbished – your orders will appear here.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/sell" className="btn-primary">Sell a device</Link>
            <Link to="/buy" className="btn-secondary">Shop refurbished</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`} className="card flex items-center gap-4 p-4 transition hover:border-brand-300 hover:shadow-md">
                <OrderThumb order={o} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{o.type === 'sell' ? 'Sell' : o.type === 'buy' ? 'Purchase' : 'Repair'} · {o.id}</span>
                    <span className={cx('chip', statusTone(o.status))}>{o.status}</span>
                  </div>
                  <p className="mt-0.5 truncate font-semibold text-slate-900">{orderTitle(o)}</p>
                  <p className="text-xs text-slate-500">{orderSubtitle(o)}</p>
                </div>
                <div className="text-right">
                  <p className={cx('font-extrabold', o.type === 'sell' ? 'text-brand-700' : 'text-slate-900')}>{o.type === 'sell' ? '+' : ''}{formatINR(orderAmount(o))}</p>
                  <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function OrderThumb({ order, className = 'h-16 w-16' }: { order: AnyOrder; className?: string }) {
  if (order.type === 'sell') {
    const model = MODEL_MAP[order.modelId]
    return <DeviceArt category={order.category} color={model?.color ?? '#64748b'} className={cx(className, 'shrink-0 rounded-xl bg-slate-50')} />
  }
  if (order.type === 'buy') {
    const first = PRODUCT_MAP[order.items[0]?.productId]
    return first ? <DeviceArt category={first.category} color={first.color} className={cx(className, 'shrink-0 rounded-xl bg-slate-50')} /> : null
  }
  return <DeviceArt category={order.category} color="#f59e0b" className={cx(className, 'shrink-0 rounded-xl bg-slate-50')} />
}

export const orderTitle = (o: AnyOrder) =>
  o.type === 'sell'
    ? `${o.modelName} (${o.variantLabel})`
    : o.type === 'buy'
      ? o.items.length === 1 ? `${o.items[0].name} (${o.items[0].variant})` : `${o.items[0].name} + ${o.items.length - 1} more`
      : `${o.modelName} · ${o.service}`

export const orderSubtitle = (o: AnyOrder) =>
  o.type === 'sell'
    ? `Pickup ${formatDate(o.pickupDate)}, ${o.pickupSlot} · ${o.address.city}`
    : o.type === 'buy'
      ? `${o.items.reduce((s, i) => s + i.qty, 0)} item(s) · Delivery by ${formatDate(o.eta)} · ${o.address.city}`
      : `Technician visit ${formatDate(o.pickupDate)}, ${o.pickupSlot} · ${o.address.city}`

export const orderAmount = (o: AnyOrder) => (o.type === 'sell' ? o.price : o.type === 'buy' ? o.total : o.price)
