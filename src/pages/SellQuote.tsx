import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BadgeCheck,
  Building2,
  Check,
  CircleOff,
  Info,
  Loader2,
  Lock,
  Smartphone,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react'
import { BRAND_MAP, CATEGORY_MAP } from '../data/categories'
import { MODEL_MAP } from '../data/models'
import type { Accessory, Address, CategoryId, ConditionAnswers, SellOrder } from '../data/types'
import Breadcrumbs from '../components/Breadcrumbs'
import DeviceArt from '../components/DeviceArt'
import Stepper from '../components/Stepper'
import AddressForm, { emptyAddress, validateAddress, type ScheduleValue } from '../components/AddressForm'
import { useStore } from '../context/StoreContext'
import { cx, formatINR, generateOrderId, PICKUP_SLOTS, upcomingDates } from '../lib/format'
import {
  ACCESSORY_OPTIONS,
  AGE_OPTIONS,
  BODY_OPTIONS,
  computeQuote,
  emptyAnswers,
  maxPrice,
  SCREEN_OPTIONS,
} from '../lib/pricing'

const STEPS = ['Variant', 'Basics', 'Screen', 'Body', 'Issues', 'Extras', 'Quote', 'Pickup']

export default function SellQuote() {
  const { category, brandId, modelId } = useParams()
  const navigate = useNavigate()
  const { addOrder, toast } = useStore()

  const cat = category ? CATEGORY_MAP[category as CategoryId] : undefined
  const brand = brandId ? BRAND_MAP[brandId] : undefined
  const model = modelId ? MODEL_MAP[modelId] : undefined

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<ConditionAnswers>(() => emptyAnswers(model?.variants[0]?.id ?? ''))
  const [calculating, setCalculating] = useState(false)
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})
  const [schedule, setSchedule] = useState<ScheduleValue>(() => ({ date: upcomingDates(1)[0].iso, slot: PICKUP_SLOTS[0] }))
  const [payment, setPayment] = useState<SellOrder['payment']>('upi')
  const [paymentDetail, setPaymentDetail] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (step === 6) {
      setCalculating(true)
      const t = window.setTimeout(() => setCalculating(false), 900)
      return () => window.clearTimeout(t)
    }
  }, [step])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const quote = useMemo(() => (model && cat ? computeQuote(model, cat, answers) : null), [model, cat, answers])

  if (!cat || !brand || !model || model.category !== cat.id || model.brandId !== brand.id) {
    return <Navigate to="/sell" replace />
  }

  const variant = model.variants.find((v) => v.id === answers.variantId) ?? model.variants[0]
  const set = <K extends keyof ConditionAnswers>(k: K, v: ConditionAnswers[K]) => setAnswers((a) => ({ ...a, [k]: v }))

  const canContinue = (() => {
    switch (step) {
      case 0: return !!answers.variantId
      case 1: return answers.powersOn !== null && (answers.powersOn === false || answers.corePass !== null)
      case 2: return !!answers.screen
      case 3: return !!answers.body
      case 4: return true
      case 5: return !!answers.age
      default: return true
    }
  })()

  const next = () => {
    if (step === 1 && answers.powersOn === false) return setStep(6)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => {
    if (step === 6 && answers.powersOn === false) return setStep(1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const toggleIssue = (id: string) =>
    set('issues', answers.issues.includes(id) ? answers.issues.filter((x) => x !== id) : [...answers.issues, id])
  const toggleAccessory = (id: Accessory) =>
    set('accessories', answers.accessories.includes(id) ? answers.accessories.filter((x) => x !== id) : [...answers.accessories, id])

  const placeOrder = () => {
    const errs = validateAddress(address)
    setErrors(errs)
    let payErr = ''
    if (payment === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(paymentDetail)) payErr = 'Enter a valid UPI ID (e.g. name@upi)'
    if (payment === 'bank' && !/^\d{9,18}$/.test(paymentDetail)) payErr = 'Enter a valid account number'
    setPaymentError(payErr)
    if (Object.keys(errs).length || payErr || !quote) return

    setPlacing(true)
    window.setTimeout(() => {
      const order: SellOrder = {
        id: generateOrderId('SELL'),
        type: 'sell',
        createdAt: new Date().toISOString(),
        modelId: model.id,
        modelName: model.name,
        brandName: brand.name,
        category: cat.id,
        variantLabel: variant.label,
        price: quote.price,
        quoteLines: quote.lines,
        address,
        pickupDate: schedule.date,
        pickupSlot: schedule.slot,
        payment,
        paymentDetail: payment === 'wallet' ? `+91 ${address.phone}` : paymentDetail,
        status: 'Pickup scheduled',
      }
      addOrder(order)
      toast('Pickup scheduled! Our executive will call you before arriving.')
      navigate(`/orders/${order.id}?new=1`)
    }, 900)
  }

  return (
    <div className="container-x py-8">
      <Breadcrumbs
        items={[
          { label: 'Sell', to: '/sell' },
          { label: cat.name, to: `/sell/${cat.id}` },
          { label: brand.name, to: `/sell/${cat.id}/${brand.id}` },
          { label: model.name },
        ]}
      />

      <div className="mt-5">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ───────── Step content */}
        <div className="card p-5 sm:p-7 animate-fade-up" key={step}>
          {step === 0 && (
            <StepShell title={`Select ${cat.variantLabel.toLowerCase()}`} subtitle={`Which ${model.name} do you have?`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {model.variants.map((v) => (
                  <button key={v.id} data-selected={answers.variantId === v.id} onClick={() => set('variantId', v.id)} className="option-card">
                    <span className="font-semibold text-slate-900">{v.label}</span>
                    <span className="text-xs text-slate-500">Up to {formatINR(model.basePrice + v.adj)}</span>
                    <SelectedTick selected={answers.variantId === v.id} />
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Basic checks" subtitle="Tell us whether the device works.">
              <YesNo
                label="Does the device switch on?"
                value={answers.powersOn}
                onChange={(v) => setAnswers((a) => ({ ...a, powersOn: v, corePass: v ? a.corePass : null }))}
              />
              {answers.powersOn && (
                <div className="mt-6">
                  <YesNo label={cat.coreCheck} value={answers.corePass} onChange={(v) => set('corePass', v)} />
                </div>
              )}
              {answers.powersOn === false && (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" /> Devices that don't switch on are bought for recycling value only. You can still schedule a free pickup.
                </p>
              )}
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Screen condition" subtitle="Check the display closely under bright light.">
              <div className="grid gap-3 sm:grid-cols-2">
                {SCREEN_OPTIONS.map((o) => (
                  <button key={o.id} data-selected={answers.screen === o.id} onClick={() => set('screen', o.id)} className="option-card">
                    <ConditionIcon level={SCREEN_OPTIONS.indexOf(o)} />
                    <span className="mt-1 font-semibold text-slate-900">{o.title}</span>
                    <span className="text-xs text-slate-500">{o.description}</span>
                    <SelectedTick selected={answers.screen === o.id} />
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Body condition" subtitle="Look at the frame, back panel and corners.">
              <div className="grid gap-3 sm:grid-cols-2">
                {BODY_OPTIONS.map((o) => (
                  <button key={o.id} data-selected={answers.body === o.id} onClick={() => set('body', o.id)} className="option-card">
                    <ConditionIcon level={BODY_OPTIONS.indexOf(o)} />
                    <span className="mt-1 font-semibold text-slate-900">{o.title}</span>
                    <span className="text-xs text-slate-500">{o.description}</span>
                    <SelectedTick selected={answers.body === o.id} />
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="Functional issues" subtitle="Select everything that applies. Honest answers avoid deductions at pickup.">
              <div className="grid gap-3 sm:grid-cols-2">
                <button data-selected={answers.issues.length === 0} onClick={() => set('issues', [])} className="option-card sm:col-span-2 !flex-row items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><BadgeCheck className="h-5 w-5" /></span>
                  <span className="font-semibold text-slate-900">No issues – everything works perfectly</span>
                  <SelectedTick selected={answers.issues.length === 0} />
                </button>
                {cat.issues.map((i) => {
                  const on = answers.issues.includes(i.id)
                  return (
                    <button key={i.id} data-selected={on} onClick={() => toggleIssue(i.id)} className="option-card !flex-row items-center gap-3">
                      <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl', on ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500')}><CircleOff className="h-5 w-5" /></span>
                      <span className="flex-1 text-sm font-semibold text-slate-900">{i.label}</span>
                      <span className="text-xs font-semibold text-rose-500">-{Math.round(i.deduct * 100)}%</span>
                    </button>
                  )
                })}
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell title="Accessories & age" subtitle="Original accessories and a valid bill fetch you a higher price.">
              <p className="label">What do you have with the device?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {ACCESSORY_OPTIONS.map((a) => {
                  const on = answers.accessories.includes(a.id)
                  return (
                    <button key={a.id} data-selected={on} onClick={() => toggleAccessory(a.id)} className="option-card">
                      <span className="font-semibold text-slate-900">{a.title}</span>
                      <span className="text-xs text-slate-500">{a.description}</span>
                      <span className="mt-1 text-xs font-semibold text-brand-700">+{Math.round(a.deduct * 100)}%</span>
                      <SelectedTick selected={on} />
                    </button>
                  )
                })}
              </div>
              <p className="label mt-6">How old is the device?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {AGE_OPTIONS.map((o) => (
                  <button key={o.id} data-selected={answers.age === o.id} onClick={() => set('age', o.id)} className="option-card">
                    <span className="font-semibold text-slate-900">{o.title}</span>
                    <span className="text-xs text-slate-500">{o.description}</span>
                    <SelectedTick selected={answers.age === o.id} />
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 6 && quote && (
            calculating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
                <p className="mt-4 font-semibold text-slate-800">Calculating the best price for your {model.name}…</p>
                <p className="text-sm text-slate-500">Comparing 40+ marketplaces</p>
              </div>
            ) : (
              <div className="animate-pop">
                <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-500 p-6 text-white sm:p-8">
                  <p className="flex items-center gap-2 text-sm font-semibold text-brand-100"><Sparkles className="h-4 w-4" /> Your instant quote</p>
                  <p className="mt-2 text-5xl font-extrabold tracking-tight">{formatINR(quote.price)}</p>
                  <p className="mt-2 text-sm text-brand-50">
                    {model.name} · {variant.label} · Condition: <span className="font-bold">{quote.gradeLabel}</span>
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-white/15 px-3 py-1">Price valid for 7 days</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">Free pickup</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">Instant payment</span>
                  </div>
                </div>

                <h3 className="mt-6 font-bold text-ink-900">Price breakdown</h3>
                <ul className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  {quote.lines.map((l, i) => (
                    <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className={cx(l.kind === 'base' ? 'font-semibold text-slate-900' : 'text-slate-600')}>{l.label}</span>
                      <span className={cx('font-semibold', l.kind === 'base' && 'text-slate-900', l.kind === 'minus' && 'text-rose-600', l.kind === 'plus' && 'text-brand-700')}>
                        {l.kind === 'minus' ? '− ' : ''}{formatINR(Math.abs(l.amount))}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800">
                    <span>Final offer</span>
                    <span>{formatINR(quote.price)}</span>
                  </li>
                </ul>
                <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> The final price is confirmed after a quick physical verification at pickup. If the device matches your answers, you're paid exactly this amount.
                </p>
              </div>
            )
          )}

          {step === 7 && quote && (
            <StepShell title="Schedule free pickup" subtitle="Tell us where and when to collect the device.">
              <AddressForm value={address} onChange={setAddress} errors={errors} schedule={schedule} onScheduleChange={setSchedule} />
              <div className="mt-6">
                <p className="label">How would you like to get paid?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: 'upi' as const, title: 'UPI', desc: 'Instant, at pickup', icon: Smartphone },
                    { id: 'bank' as const, title: 'Bank transfer', desc: 'IMPS within 2 hours', icon: Building2 },
                    { id: 'wallet' as const, title: 'ReCart wallet', desc: '+2% bonus on purchases', icon: Wallet },
                  ].map((p) => (
                    <button key={p.id} type="button" data-selected={payment === p.id} onClick={() => { setPayment(p.id); setPaymentDetail(''); setPaymentError('') }} className="option-card !flex-row items-center gap-3">
                      <p.icon className="h-5 w-5 text-brand-600" />
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{p.title}</span>
                        <span className="block text-xs text-slate-500">{p.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {payment !== 'wallet' && (
                  <div className="mt-3">
                    <label className="label">{payment === 'upi' ? 'UPI ID' : 'Bank account number'}</label>
                    <input className="input" value={paymentDetail} onChange={(e) => setPaymentDetail(e.target.value)} placeholder={payment === 'upi' ? 'yourname@upi' : '0123456789012'} />
                    {paymentError && <p className="mt-1 text-xs text-rose-600">{paymentError}</p>}
                  </div>
                )}
              </div>
            </StepShell>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            {step > 0 ? (
              <button onClick={back} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</button>
            ) : (
              <Link to={`/sell/${cat.id}/${brand.id}`} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Change model</Link>
            )}
            {step < 6 && (
              <button onClick={next} disabled={!canContinue} className="btn-primary !px-6">
                {step === 5 ? 'Get quote' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {step === 6 && !calculating && (
              <button onClick={() => setStep(7)} className="btn-primary !px-6">
                Sell now for {formatINR(quote?.price ?? 0)} <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {step === 7 && (
              <button onClick={placeOrder} disabled={placing} className="btn-primary !px-6">
                {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />} Confirm pickup
              </button>
            )}
          </div>
        </div>

        {/* ───────── Summary sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <DeviceArt category={model.category} color={model.color} className="h-24 w-24 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{brand.name}</p>
                <h2 className="truncate text-lg font-bold text-ink-900">{model.name}</h2>
                <p className="text-sm text-slate-500">{variant.label}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              {step >= 6 && quote && !calculating ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your offer</p>
                  <p className="text-3xl font-extrabold text-brand-700">{formatINR(quote.price)}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Get up to</p>
                  <p className="text-3xl font-extrabold text-ink-900">{formatINR(maxPrice(model))}</p>
                  <p className="text-xs text-slate-500">for a device in perfect condition</p>
                </>
              )}
            </div>
            {step > 0 && step < 6 && (
              <dl className="mt-4 space-y-1.5 text-xs text-slate-600">
                {answers.powersOn !== null && <Row k="Switches on" v={answers.powersOn ? 'Yes' : 'No'} />}
                {answers.corePass !== null && <Row k="Core functions" v={answers.corePass ? 'Working' : 'Faulty'} />}
                {answers.screen && <Row k="Screen" v={SCREEN_OPTIONS.find((o) => o.id === answers.screen)!.title} />}
                {answers.body && <Row k="Body" v={BODY_OPTIONS.find((o) => o.id === answers.body)!.title} />}
                {step > 4 && <Row k="Issues" v={answers.issues.length ? `${answers.issues.length} reported` : 'None'} />}
              </dl>
            )}
          </div>
          <div className="card p-5 text-sm text-slate-600">
            <ul className="space-y-3">
              <li className="flex gap-3"><Truck className="h-5 w-5 shrink-0 text-brand-600" /> Free doorstep pickup within 24 hours</li>
              <li className="flex gap-3"><Banknote className="h-5 w-5 shrink-0 text-brand-600" /> Payment before the executive leaves</li>
              <li className="flex gap-3"><Lock className="h-5 w-5 shrink-0 text-brand-600" /> Certified data wipe, guaranteed</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>{k}</dt>
      <dd className="font-semibold text-slate-800">{v}</dd>
    </div>
  )
}

function SelectedTick({ selected }: { selected: boolean }) {
  if (!selected) return null
  return (
    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
      <Check className="h-3 w-3" />
    </span>
  )
}

function YesNo({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div>
      <p className="font-semibold text-slate-900">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-sm">
        {[true, false].map((v) => (
          <button key={String(v)} data-selected={value === v} onClick={() => onChange(v)} className="option-card !items-center !py-3">
            <span className="font-semibold text-slate-900">{v ? 'Yes' : 'No'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Little illustrative icon for the condition tiers – draws a screen with increasing damage. */
function ConditionIcon({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10">
      <rect x="10" y="4" width="28" height="40" rx="5" fill="#e2e8f0" stroke="#94a3b8" />
      <rect x="13" y="8" width="22" height="32" rx="3" fill={['#bbf7d0', '#bae6fd', '#fde68a', '#fecaca'][level]} />
      {level >= 1 && <path d="M16 14l6 6" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />}
      {level >= 2 && (
        <>
          <path d="M28 12l-4 9" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M18 30l8 5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {level >= 3 && <path d="M14 36l6-9 3 4 5-10 4 6" stroke="#dc2626" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}
