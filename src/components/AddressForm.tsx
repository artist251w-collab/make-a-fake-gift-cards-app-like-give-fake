import { useEffect, useState } from 'react'
import type { Address } from '../data/types'
import { CITIES } from '../data/categories'
import { useStore } from '../context/StoreContext'
import { cx, PICKUP_SLOTS, upcomingDates } from '../lib/format'

export interface ScheduleValue {
  date: string
  slot: string
}

interface Props {
  value: Address
  onChange: (a: Address) => void
  errors: Partial<Record<keyof Address, string>>
  schedule?: ScheduleValue
  onScheduleChange?: (s: ScheduleValue) => void
  scheduleTitle?: string
}

export const emptyAddress = (): Address => ({
  name: '',
  phone: '',
  email: '',
  line1: '',
  city: '',
  pincode: '',
})

export function validateAddress(a: Address): Partial<Record<keyof Address, string>> {
  const errors: Partial<Record<keyof Address, string>> = {}
  if (a.name.trim().length < 2) errors.name = 'Enter your full name'
  if (!/^\d{10}$/.test(a.phone)) errors.phone = 'Enter a valid 10-digit mobile number'
  if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) errors.email = 'Enter a valid email'
  if (a.line1.trim().length < 8) errors.line1 = 'Enter your complete address'
  if (!a.city) errors.city = 'Select your city'
  if (!/^\d{6}$/.test(a.pincode)) errors.pincode = 'Enter a valid 6-digit PIN code'
  return errors
}

export default function AddressForm({ value, onChange, errors, schedule, onScheduleChange, scheduleTitle = 'Pickup slot' }: Props) {
  const { user, city } = useStore()
  const dates = useState(() => upcomingDates(6))[0]

  // Pre-fill from the logged-in user & selected city.
  useEffect(() => {
    if (!value.name && !value.phone && !value.city) {
      onChange({ ...value, name: user?.name ?? '', phone: user?.phone ?? '', city: city })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (k: keyof Address, v: string) => onChange({ ...value, [k]: v })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input className="input" value={value.name} onChange={(e) => set('name', e.target.value)} placeholder="Aarav Sharma" autoComplete="name" />
        </Field>
        <Field label="Mobile number" error={errors.phone}>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">+91</span>
            <input
              className="input rounded-l-none"
              inputMode="numeric"
              value={value.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              autoComplete="tel-national"
            />
          </div>
        </Field>
        <Field label="Email (optional)" error={errors.email} className="sm:col-span-2">
          <input className="input" type="email" value={value.email} onChange={(e) => set('email', e.target.value)} placeholder="aarav@example.com" autoComplete="email" />
        </Field>
        <Field label="Address" error={errors.line1} className="sm:col-span-2">
          <textarea
            className="input min-h-[84px] resize-y"
            value={value.line1}
            onChange={(e) => set('line1', e.target.value)}
            placeholder="Flat / house no., building, street, landmark"
            autoComplete="street-address"
          />
        </Field>
        <Field label="City" error={errors.city}>
          <select className="input" value={value.city} onChange={(e) => set('city', e.target.value)}>
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="PIN code" error={errors.pincode}>
          <input
            className="input"
            inputMode="numeric"
            value={value.pincode}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="560001"
            autoComplete="postal-code"
          />
        </Field>
      </div>

      {schedule && onScheduleChange && (
        <div>
          <p className="label">{scheduleTitle}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {dates.map((d) => (
              <button
                type="button"
                key={d.iso}
                onClick={() => onScheduleChange({ ...schedule, date: d.iso })}
                className={cx(
                  'flex min-w-[5.5rem] flex-col items-center rounded-2xl border-2 px-3 py-2.5 text-sm transition',
                  schedule.date === d.iso ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{d.weekday}</span>
                <span className="font-bold">{d.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PICKUP_SLOTS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => onScheduleChange({ ...schedule, slot: s })}
                className={cx(
                  'rounded-xl border-2 px-3 py-2 text-sm font-medium transition',
                  schedule.slot === s ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
