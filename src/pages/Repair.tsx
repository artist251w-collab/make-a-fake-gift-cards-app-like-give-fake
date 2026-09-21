import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Battery, Camera, Clock, Droplets, Loader2, MonitorSmartphone, Plug, Search, ShieldCheck, Speaker, Wrench } from 'lucide-react'
import { BRAND_MAP, CATEGORIES, brandsForCategory, CATEGORY_MAP } from '../data/categories'
import { modelsFor } from '../data/models'
import type { Address, CategoryId, DeviceModel, RepairOrder } from '../data/types'
import { CATEGORY_ICONS } from '../lib/categoryIcons'
import Breadcrumbs from '../components/Breadcrumbs'
import BrandMark from '../components/BrandMark'
import DeviceArt from '../components/DeviceArt'
import Stepper from '../components/Stepper'
import AddressForm, { emptyAddress, validateAddress, type ScheduleValue } from '../components/AddressForm'
import { useStore } from '../context/StoreContext'
import { cx, formatINR, generateOrderId, PICKUP_SLOTS, upcomingDates } from '../lib/format'

const REPAIR_CATEGORIES: CategoryId[] = ['mobile', 'laptop', 'tablet', 'smartwatch']

interface Service {
  id: string
  title: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
  price: (base: number) => number
  time: string
}

const SERVICES: Service[] = [
  { id: 'screen', title: 'Screen replacement', desc: 'Cracked, unresponsive or flickering display', icon: MonitorSmartphone, price: (b) => Math.max(1499, Math.round((b * 0.16) / 100) * 100), time: '60 – 90 min' },
  { id: 'battery', title: 'Battery replacement', desc: 'Drains fast, shuts down or swollen battery', icon: Battery, price: (b) => Math.max(999, Math.round((b * 0.05) / 100) * 100), time: '30 – 45 min' },
  { id: 'charging', title: 'Charging port repair', desc: 'Loose port or not charging', icon: Plug, price: (b) => Math.max(899, Math.round((b * 0.035) / 100) * 100), time: '45 – 60 min' },
  { id: 'camera', title: 'Camera repair', desc: 'Blurry, black screen or focus issues', icon: Camera, price: (b) => Math.max(1299, Math.round((b * 0.06) / 100) * 100), time: '45 – 60 min' },
  { id: 'speaker', title: 'Speaker / mic repair', desc: 'Low volume, crackling or no audio', icon: Speaker, price: (b) => Math.max(799, Math.round((b * 0.03) / 100) * 100), time: '30 – 45 min' },
  { id: 'water', title: 'Water damage diagnosis', desc: 'Full inspection & cleaning, quote before repair', icon: Droplets, price: () => 499, time: '24 hours' },
]

const STEPS = ['Device', 'Model', 'Service', 'Schedule']

export default function Repair() {
  const navigate = useNavigate()
  const { addOrder, toast } = useStore()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<CategoryId | null>(null)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [model, setModel] = useState<DeviceModel | null>(null)
  const [q, setQ] = useState('')
  const [service, setService] = useState<Service | null>(null)
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})
  const [schedule, setSchedule] = useState<ScheduleValue>(() => ({ date: upcomingDates(1)[0].iso, slot: PICKUP_SLOTS[0] }))
  const [placing, setPlacing] = useState(false)

  const models = useMemo(() => {
    if (!category || !brandId) return []
    const all = modelsFor(category, brandId)
    const query = q.trim().toLowerCase()
    return query ? all.filter((m) => m.name.toLowerCase().includes(query)) : all
  }, [category, brandId, q])

  const book = () => {
    const errs = validateAddress(address)
    setErrors(errs)
    if (Object.keys(errs).length || !model || !service || !category) return
    setPlacing(true)
    window.setTimeout(() => {
      const order: RepairOrder = {
        id: generateOrderId('REP'),
        type: 'repair',
        createdAt: new Date().toISOString(),
        category,
        brandName: BRAND_MAP[model.brandId].name,
        modelName: model.name,
        service: service.title,
        price: service.price(model.basePrice),
        address,
        pickupDate: schedule.date,
        pickupSlot: schedule.slot,
        status: 'Technician assigned',
      }
      addOrder(order)
      toast('Repair booked! A technician has been assigned.')
      navigate(`/orders/${order.id}?new=1`)
    }, 900)
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
        <div className="container-x py-10">
          <Breadcrumbs items={[{ label: 'Repair' }]} light />
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="chip bg-white/20 text-white"><Wrench className="h-3.5 w-3.5" /> Doorstep repair</span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Expert repairs at your doorstep</h1>
              <p className="mt-2 max-w-xl text-white/90">Genuine parts, certified technicians and a 6-month warranty on every repair. Most jobs are done in under 90 minutes while you watch.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold">
              <div className="rounded-2xl bg-white/15 p-3"><ShieldCheck className="mx-auto mb-1 h-5 w-5" />6-month warranty</div>
              <div className="rounded-2xl bg-white/15 p-3"><BadgeCheck className="mx-auto mb-1 h-5 w-5" />Genuine parts</div>
              <div className="rounded-2xl bg-white/15 p-3"><Wrench className="mx-auto mb-1 h-5 w-5" />Same-day service</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <Stepper steps={STEPS} current={step} />
        <div className="card mt-6 p-5 sm:p-7 animate-fade-up" key={step}>
          {step === 0 && (
            <>
              <h2 className="text-2xl font-extrabold text-ink-900">What needs fixing?</h2>
              <p className="mt-1 text-sm text-slate-500">Select the device type and brand.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {REPAIR_CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICONS[c]
                  return (
                    <button key={c} data-selected={category === c} onClick={() => { setCategory(c); setBrandId(null) }} className="option-card items-center !py-5">
                      <Icon className="h-6 w-6 text-orange-500" />
                      <span className="text-sm font-semibold text-slate-800">{CATEGORY_MAP[c].name}</span>
                    </button>
                  )
                })}
              </div>
              {category && (
                <>
                  <p className="label mt-6">Brand</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {brandsForCategory(category).map((b) => (
                      <button key={b.id} data-selected={brandId === b.id} onClick={() => setBrandId(b.id)} className="option-card !flex-row items-center gap-3 !py-3">
                        <BrandMark brandId={b.id} size="sm" />
                        <span className="text-sm font-semibold text-slate-800">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {step === 1 && category && brandId && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-ink-900">Select your model</h2>
                  <p className="mt-1 text-sm text-slate-500">{BRAND_MAP[brandId].name} {CATEGORY_MAP[category].name.toLowerCase()}</p>
                </div>
                <div className="relative sm:w-64">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search model" className="input pl-10" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {models.map((m) => (
                  <button key={m.id} data-selected={model?.id === m.id} onClick={() => setModel(m)} className="option-card items-center text-center">
                    <DeviceArt category={m.category} color={m.color} className="h-20 w-20" />
                    <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && model && (
            <>
              <h2 className="text-2xl font-extrabold text-ink-900">Choose a service</h2>
              <p className="mt-1 text-sm text-slate-500">Estimated prices for {model.name}. Final quote confirmed by the technician before work begins.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <button key={s.id} data-selected={service?.id === s.id} onClick={() => setService(s)} className="option-card !flex-row items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"><s.icon className="h-5 w-5" /></span>
                    <span className="flex-1">
                      <span className="block font-semibold text-slate-900">{s.title}</span>
                      <span className="block text-xs text-slate-500">{s.desc}</span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3 w-3" /> {s.time}</span>
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{formatINR(s.price(model.basePrice))}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && model && service && (
            <>
              <h2 className="text-2xl font-extrabold text-ink-900">Schedule technician visit</h2>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-orange-50 p-3 text-sm">
                <DeviceArt category={model.category} color={model.color} className="h-12 w-12" />
                <div className="flex-1"><p className="font-semibold text-slate-900">{model.name} · {service.title}</p><p className="text-xs text-slate-500">Pay after service · 6-month warranty</p></div>
                <p className="font-extrabold text-slate-900">{formatINR(service.price(model.basePrice))}</p>
              </div>
              <div className="mt-5"><AddressForm value={address} onChange={setAddress} errors={errors} schedule={schedule} onScheduleChange={setSchedule} scheduleTitle="Visit slot" /></div>
            </>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 0 && (!category || !brandId)) || (step === 1 && !model) || (step === 2 && !service)}
                className={cx('btn', 'bg-orange-500 text-white hover:bg-orange-600 !px-6')}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={book} disabled={placing} className="btn bg-orange-500 text-white hover:bg-orange-600 !px-6">
                {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />} Book repair
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.filter((c) => REPAIR_CATEGORIES.includes(c.id)).slice(0, 3).map((c) => (
            <div key={c.id} className="card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">{c.short}</p>
              <p className="mt-1 font-bold text-ink-900">{c.name} repair from ₹799</p>
              <p className="mt-1 text-sm text-slate-500">Screen, battery, charging port, camera & more.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
