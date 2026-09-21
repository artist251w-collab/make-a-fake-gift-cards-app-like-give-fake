import { useEffect, useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

interface Props {
  open: boolean
  onClose: () => void
}

const DEMO_OTP = '1234'

export default function LoginModal({ open, onClose }: Props) {
  const { login, toast } = useStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setStep('phone')
      setOtp('')
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(phone)) return setError('Enter a valid 10-digit mobile number')
    if (name.trim().length < 2) return setError('Please tell us your name')
    setError('')
    setStep('otp')
  }

  const verify = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp !== DEMO_OTP) return setError(`Incorrect OTP. Use ${DEMO_OTP} for this demo.`)
    login({ name: name.trim(), phone })
    toast(`Welcome, ${name.trim().split(' ')[0]}!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl animate-pop sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="login-title" className="text-xl font-bold text-ink-900">
              {step === 'phone' ? 'Login or Sign up' : 'Verify OTP'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 'phone'
                ? 'Track orders, save addresses & get faster payouts.'
                : `We sent a 4-digit code to +91 ${phone}`}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'phone' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-name">Your name</label>
              <input id="login-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" />
            </div>
            <div>
              <label className="label" htmlFor="login-phone">Mobile number</label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">+91</span>
                <input
                  id="login-phone"
                  className="input rounded-l-none"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                />
              </div>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button className="btn-primary w-full">Send OTP</button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Your number is never shared with buyers or sellers.
            </p>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-otp">Enter OTP</label>
              <input
                id="login-otp"
                className="input text-center text-2xl font-bold tracking-[0.6em]"
                inputMode="numeric"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
              />
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Demo mode: use OTP <span className="font-bold">{DEMO_OTP}</span>
              </p>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button className="btn-primary w-full">Verify & continue</button>
            <button type="button" onClick={() => setStep('phone')} className="btn-ghost w-full">
              Change number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
