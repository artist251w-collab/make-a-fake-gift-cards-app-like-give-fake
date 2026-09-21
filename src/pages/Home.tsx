import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ClipboardCheck,
  IndianRupee,
  Leaf,
  Lock,
  Quote,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
} from 'lucide-react'
import { CATEGORIES, BRANDS, BRAND_MAP } from '../data/categories'
import { MODEL_MAP } from '../data/models'
import { PRODUCTS } from '../data/products'
import { formatINR } from '../lib/format'
import { maxPrice } from '../lib/pricing'
import { CATEGORY_ICONS } from '../lib/categoryIcons'
import DeviceArt from '../components/DeviceArt'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import BrandMark from '../components/BrandMark'

const TRENDING = [
  'apple-iphone-15',
  'apple-iphone-14',
  'samsung-galaxy-s24-ultra',
  'oneplus-oneplus-12',
  'apple-macbook-air-13-m2',
  'google-pixel-8',
  'apple-ipad-10th-gen',
  'sony-playstation-5-slim',
  'apple-apple-watch-series-9',
  'apple-airpods-pro-2-usb-c',
]

const TESTIMONIALS = [
  {
    name: 'Priya Nair',
    city: 'Bengaluru',
    text: 'Sold my iPhone 13 in under 24 hours. The executive checked the phone at my doorstep and the UPI payment hit my account before he even left!',
    rating: 5,
    device: 'Sold iPhone 13 · ₹22,400',
  },
  {
    name: 'Rohit Verma',
    city: 'Delhi NCR',
    text: 'Bought a refurbished MacBook Air M1 in Superb condition. Honestly could not tell it from new. Six-month warranty gave me peace of mind.',
    rating: 5,
    device: 'Bought MacBook Air M1',
  },
  {
    name: 'Sneha Kulkarni',
    city: 'Pune',
    text: 'Got ₹3,000 more than the exchange offer on a big e-commerce site for my Galaxy S22. The price quoted online was exactly what I was paid.',
    rating: 4,
    device: 'Sold Galaxy S22 · ₹17,900',
  },
]

export default function Home() {
  const deals = PRODUCTS.filter((p) => p.badge === 'Deal of the day' || p.badge === 'Bestseller').slice(0, 8)
  const trending = TRENDING.map((id) => MODEL_MAP[id]).filter(Boolean)

  return (
    <div>
      {/* ───────── Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-emerald-50">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <span className="chip bg-white text-brand-700 ring-1 ring-brand-200">
              <Leaf className="h-3.5 w-3.5" /> India's #1 re-commerce platform
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Sell your old phone.
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                Get paid instantly.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
              Get the best price for your used phones, laptops, tablets and more. Free doorstep pickup,
              instant payment and a certified data wipe – or shop certified refurbished devices with warranty.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/sell" className="btn-primary !px-6 !py-3 !text-base">
                Sell now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/buy" className="btn-secondary !px-6 !py-3 !text-base">
                Buy refurbished
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ['25 L+', 'Devices sold'],
                ['₹1,800 Cr+', 'Paid to sellers'],
                ['4.7 ★', 'Customer rating'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xl font-extrabold text-ink-900 sm:text-2xl">{v}</dt>
                  <dd className="text-xs font-medium text-slate-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative grid grid-cols-3 items-end gap-4">
              <div className="animate-float" style={{ animationDelay: '0.4s' }}>
                <div className="card p-3">
                  <DeviceArt category="smartwatch" color="#fb923c" className="h-32 w-full" />
                  <p className="mt-1 text-center text-xs font-semibold text-slate-700">Apple Watch</p>
                  <p className="text-center text-xs font-bold text-brand-700">Up to ₹24,000</p>
                </div>
              </div>
              <div className="animate-float">
                <div className="card p-3 ring-4 ring-brand-500/10">
                  <DeviceArt category="mobile" color="#3b5b7c" className="h-48 w-full" />
                  <p className="mt-1 text-center text-xs font-semibold text-slate-700">iPhone 17 Pro Max</p>
                  <p className="text-center text-sm font-extrabold text-brand-700">Up to ₹1,10,000</p>
                </div>
              </div>
              <div className="animate-float" style={{ animationDelay: '0.8s' }}>
                <div className="card p-3">
                  <DeviceArt category="laptop" color="#1e293b" className="h-32 w-full" />
                  <p className="mt-1 text-center text-xs font-semibold text-slate-700">MacBook Air</p>
                  <p className="text-center text-xs font-bold text-brand-700">Up to ₹82,000</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                <Banknote className="h-4 w-4 text-brand-400" /> ₹22,400 paid to Priya in Bengaluru · 2 min ago
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-brand-100/80 bg-white/70 backdrop-blur">
          <div className="container-x grid grid-cols-2 gap-4 py-4 text-xs font-semibold text-slate-700 sm:grid-cols-4 sm:text-sm">
            <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-brand-600" /> Best price guaranteed</span>
            <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-600" /> Free doorstep pickup</span>
            <span className="flex items-center gap-2"><Banknote className="h-4 w-4 text-brand-600" /> Instant UPI payment</span>
            <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand-600" /> Certified data wipe</span>
          </div>
        </div>
      </section>

      {/* ───────── Sell categories */}
      <section className="container-x py-14">
        <SectionHeading eyebrow="Sell" title="What would you like to sell?" subtitle="Pick a category to get an instant quote in under 60 seconds." to="/sell" linkLabel="All categories" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id]
            return (
              <Link key={c.id} to={`/sell/${c.id}`} className="card group flex flex-col items-center gap-2 p-5 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">{c.short}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ───────── How it works */}
      <section id="how-it-works" className="bg-ink-900 py-16 text-white">
        <div className="container-x">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">How it works</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Sell in 3 simple steps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ClipboardCheck, title: 'Check price', text: 'Select your device and answer a few questions about its condition to get an instant, transparent quote.' },
              { icon: Truck, title: 'Schedule pickup', text: 'Choose a convenient slot. Our executive verifies the device at your doorstep – no hidden deductions.' },
              { icon: Banknote, title: 'Get paid instantly', text: 'Receive payment via UPI or bank transfer on the spot, along with a data-wipe certificate.' },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="absolute right-5 top-4 text-5xl font-black text-white/5">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Deals */}
      <section className="container-x py-14">
        <SectionHeading eyebrow="Buy refurbished" title="Top deals on certified devices" subtitle="32-point quality check · 6-month warranty · 7-day easy replacement" to="/buy" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link to="/buy" className="btn-secondary">View all products</Link>
        </div>
      </section>

      {/* ───────── Why us */}
      <section className="bg-white py-16">
        <div className="container-x">
          <SectionHeading eyebrow="Why ReCart" title="Trusted by 25 lakh+ happy customers" align="center" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: IndianRupee, title: 'Best price guaranteed', text: 'Our AI pricing engine benchmarks 40+ marketplaces so you always get the highest payout.' },
              { icon: BadgeCheck, title: 'No last-minute haggling', text: 'The price quoted online is the price you get if the device matches your answers.' },
              { icon: ShieldCheck, title: 'Warranty on every purchase', text: 'Refurbished devices come with a 6-month warranty and a 7-day no-questions replacement.' },
              { icon: Lock, title: 'Your data stays private', text: 'Every device is wiped with a certified erasure tool and you get a certificate by email.' },
            ].map((b) => (
              <div key={b.title} className="rounded-3xl bg-slate-50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-ink-900">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Trending sell */}
      <section className="container-x py-14">
        <SectionHeading eyebrow="Trending" title="Popular devices people are selling" subtitle="Tap a device to check what yours is worth today." to="/sell" linkLabel="Sell another device" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {trending.map((mo) => (
            <Link key={mo.id} to={`/sell/${mo.category}/${mo.brandId}/${mo.id}`} className="card group flex items-center gap-3 p-3 transition hover:border-brand-300 hover:shadow-md">
              <DeviceArt category={mo.category} color={mo.color} className="h-14 w-14 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-800">{mo.name}</span>
                <span className="block text-xs text-slate-500">{BRAND_MAP[mo.brandId]?.name}</span>
                <span className="block text-xs font-bold text-brand-700">Up to {formatINR(maxPrice(mo))}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── Repair banner */}
      <section className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="chip bg-white/20 text-white"><Wrench className="h-3.5 w-3.5" /> New</span>
              <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">Don't want to sell? Repair it at home.</h3>
              <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">Screen, battery and more – genuine parts, doorstep service, 6-month repair warranty. Starting at ₹999.</p>
            </div>
            <Link to="/repair" className="btn bg-white text-orange-600 hover:bg-orange-50 !px-6 !py-3">
              Book a repair <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Brands */}
      <section className="container-x py-14">
        <SectionHeading eyebrow="Brands" title="We buy & sell all major brands" align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {BRANDS.slice(0, 18).map((b) => (
            <Link key={b.id} to={`/sell/${b.categories[0]}/${b.id}`} className="card flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:shadow-md">
              <BrandMark brandId={b.id} size="sm" /> {b.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── Testimonials */}
      <section className="bg-brand-50/60 py-16">
        <div className="container-x">
          <SectionHeading eyebrow="Reviews" title="What our customers say" align="center" />
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card relative p-6">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">“{t.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{t.name[0]}</span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.city} · {t.device}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA */}
      <section className="container-x pt-16">
        <div className="rounded-3xl bg-ink-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to turn that drawer of old gadgets into cash?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">It takes less than a minute to get a quote and we pick up from 12+ cities across India.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/sell" className="btn-primary !px-6 !py-3 !text-base">Get instant quote</Link>
            <Link to="/buy" className="btn bg-white/10 text-white hover:bg-white/20 !px-6 !py-3 !text-base">Shop refurbished</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
