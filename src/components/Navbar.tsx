import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Smartphone,
  Tag,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { CATEGORY_MAP, CITIES, BRAND_MAP } from '../data/categories'
import { searchModels } from '../data/models'
import { PRODUCTS } from '../data/products'
import { cx, formatINR } from '../lib/format'
import { maxPrice } from '../lib/pricing'
import LoginModal from './LoginModal'
import Logo from './Logo'

export default function Navbar() {
  const { cartCount, user, logout, city, setCity, wishlist } = useStore()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
    setCityOpen(false)
    setUserMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const sellHits = useMemo(() => searchModels(query, 5), [query])
  const buyHits = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const tokens = q.split(/\s+/)
    return PRODUCTS.filter((p) => {
      const hay = `${BRAND_MAP[p.brandId]?.name} ${p.name} ${p.variant} ${p.category}`.toLowerCase()
      return tokens.every((t) => hay.includes(t))
    }).slice(0, 4)
  }, [query])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    navigate(`/buy?q=${encodeURIComponent(query.trim())}`)
  }

  const navLink = ({ isActive }: { isActive: boolean }) =>
    cx(
      'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition',
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
    )

  const searchBox = (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search iPhone 15, MacBook Air, PS5…"
          className="input rounded-full bg-slate-100 py-2.5 pl-10 pr-4 focus:bg-white"
          aria-label="Search devices"
        />
      </form>
      {open && query.trim() && (sellHits.length > 0 || buyHits.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-pop">
          {sellHits.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sell your device
              </p>
              {sellHits.map((mo) => (
                <Link
                  key={mo.id}
                  to={`/sell/${mo.category}/${mo.brandId}/${mo.id}`}
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Tag className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-800">{mo.name}</span>
                    <span className="block text-xs text-slate-500">
                      {BRAND_MAP[mo.brandId]?.name} · {CATEGORY_MAP[mo.category].name}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-brand-700">
                    Up to {formatINR(maxPrice(mo))}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {buyHits.length > 0 && (
            <div className="border-t border-slate-100 p-2">
              <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Buy refurbished
              </p>
              {buyHits.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <ShoppingCart className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-800">
                      {p.name} <span className="text-slate-400">· {p.variant}</span>
                    </span>
                    <span className="block text-xs text-slate-500">{p.grade} condition</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-800">{formatINR(p.price)}</span>
                </Link>
              ))}
            </div>
          )}
          <button
            onClick={submit}
            className="block w-full border-t border-slate-100 px-4 py-2.5 text-left text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            See all results for “{query.trim()}”
          </button>
        </div>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="container-x flex min-h-16 flex-wrap items-center gap-x-3 py-2 md:flex-nowrap md:py-0 lg:gap-x-5">
        <button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMenuOpen((m) => !m)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="ReCart home">
          <Logo />
        </Link>

        {/* City selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCityOpen((c) => !c)}
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <MapPin className="h-4 w-4 text-brand-600" />
            <span className="max-w-[7rem] truncate">{city}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          {cityOpen && (
            <div className="absolute left-0 top-full mt-1 grid w-72 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-pop">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c)
                    setCityOpen(false)
                  }}
                  className={cx(
                    'rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100',
                    c === city ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-700',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="order-last w-full pb-3 md:order-none md:w-auto md:flex-1 md:pb-0">{searchBox}</div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/sell" className={navLink}>
            <Tag className="h-4 w-4" /> Sell
          </NavLink>
          <NavLink to="/buy" className={navLink}>
            <Smartphone className="h-4 w-4" /> Buy
          </NavLink>
          <NavLink to="/repair" className={navLink}>
            <Wrench className="h-4 w-4" /> Repair
          </NavLink>
          <NavLink to="/orders" className={navLink}>
            <Package className="h-4 w-4" /> Orders
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/buy?wishlist=1"
            className="relative hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:block"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserMenu((u) => !u)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[6rem] truncate sm:block">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button onClick={() => setLoginOpen(true)} className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
                <User className="h-4 w-4" /> Login
              </button>
            )}
            {!user && (
              <button onClick={() => setLoginOpen(true)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 sm:hidden" aria-label="Login">
                <User className="h-5 w-5" />
              </button>
            )}
            {userMenu && user && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-pop">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">+91 {user.phone}</p>
                </div>
                <Link to="/orders" className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  My orders
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setUserMenu(false)
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white p-3 lg:hidden animate-fade-up">
          <div className="grid grid-cols-2 gap-2">
            <NavLink to="/sell" className={navLink}>
              <Tag className="h-4 w-4" /> Sell
            </NavLink>
            <NavLink to="/buy" className={navLink}>
              <Smartphone className="h-4 w-4" /> Buy
            </NavLink>
            <NavLink to="/repair" className={navLink}>
              <Wrench className="h-4 w-4" /> Repair
            </NavLink>
            <NavLink to="/orders" className={navLink}>
              <Package className="h-4 w-4" /> Orders
            </NavLink>
          </div>
          <div className="mt-3 flex items-center gap-2 px-1">
            <MapPin className="h-4 w-4 text-brand-600" />
            <select value={city} onChange={(e) => setCity(e.target.value)} className="input !w-auto flex-1 !py-2">
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  )
}
