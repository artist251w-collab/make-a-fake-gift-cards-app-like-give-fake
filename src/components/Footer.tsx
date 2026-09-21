import { Link } from 'react-router-dom'
import { Facebook, Instagram, Recycle, Twitter, Youtube } from 'lucide-react'
import Logo from './Logo'
import { CATEGORIES } from '../data/categories'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            India's trusted re-commerce marketplace. Sell your old gadgets for instant cash or buy
            certified refurbished devices with warranty.
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-brand-300 hover:text-brand-600" aria-label="Social link">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Sell</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/sell/${c.id}`} className="hover:text-brand-700">Sell old {c.short.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Buy</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/buy?category=${c.id}`} className="hover:text-brand-700">Refurbished {c.short.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/repair" className="hover:text-brand-700">Repair services</Link></li>
            <li><Link to="/orders" className="hover:text-brand-700">Track your order</Link></li>
            <li><a href="#how-it-works" className="hover:text-brand-700">How it works</a></li>
            <li><a href="#" className="hover:text-brand-700">Warranty policy</a></li>
            <li><a href="#" className="hover:text-brand-700">Privacy & data wipe</a></li>
            <li><a href="#" className="hover:text-brand-700">Contact us</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ReCart Technologies. Demo project – not affiliated with any brand.</p>
          <p className="flex items-center gap-1">Made with <Recycle className="h-3.5 w-3.5 text-brand-600" /> for a greener planet · 25,00,000+ devices given a second life</p>
        </div>
      </div>
    </footer>
  )
}
