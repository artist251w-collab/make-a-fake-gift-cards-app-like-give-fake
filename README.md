# ReCart – Sell old gadgets & buy refurbished (a Cashify-style re-commerce site)

ReCart is a Cashify-like marketplace for **selling pre-owned gadgets for instant cash** and **buying certified
refurbished devices**. It is a single-page React app with a realistic, fully working front-end – no backend
required (cart, orders and login are persisted in `localStorage`).

> Demo project. Not affiliated with Cashify or any device brand. Prices are illustrative (INR).

## Features

**Sell (instant quote wizard)**
- Category → Brand → Model → Variant selection (260+ models across phones, laptops, tablets, watches,
  earbuds, consoles and cameras)
- 8-step condition questionnaire: powers on, core checks, screen, body, functional issues,
  accessories & age
- Transparent pricing engine with a line-by-line **price breakdown** (deductions/adjustments always add up)
- Free doorstep pickup scheduling (date + slot), payout via UPI / bank / wallet
- Order confirmation with status timeline & pre-pickup checklist

**Buy (refurbished store)**
- 50+ products with condition grades (Superb / Good / Fair), MRP vs. price, ratings, specs
- Filters (category, brand, grade, price), sorting, search, wishlist
- Product page with condition guide, warranty & 32-point check info, similar devices
- Cart with cart-level offers, checkout (UPI / card / COD) and order tracking

**Also**
- Repair booking flow (doorstep repair with estimated prices)
- Global search with instant "Sell" & "Buy" suggestions
- OTP login simulation (use OTP `1234`), city selector, toasts, responsive mobile layout
- All device artwork is generated with SVG – no external images needed

## Tech stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router v7](https://reactrouter.com)
- [lucide-react](https://lucide.dev) icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run typecheck  # tsc only
```

## Project structure

```
src/
├── components/     # Navbar, Footer, ProductCard, DeviceArt (SVG device renderer), forms, etc.
├── context/        # StoreContext – cart, orders, wishlist, user, city (localStorage-backed)
├── data/           # Catalog: categories & brands, sellable models, refurbished products, types
├── lib/            # Pricing engine (computeQuote), formatting helpers, category icons
└── pages/          # Home, Sell flow, Buy, ProductDetail, Cart, Checkout, Orders, Repair, 404
```

### Pricing engine (`src/lib/pricing.ts`)

Every model has a best-case `basePrice` per variant. The quote applies:

| Factor | Effect |
| --- | --- |
| Doesn't switch on | Salvage value (12% of base) |
| Core functions faulty | ×0.55 |
| Screen: minor / heavy / cracked | ×0.92 / ×0.80 / ×0.55 |
| Body: minor / major / broken | ×0.94 / ×0.85 / ×0.65 |
| Functional issues | −3% to −25% of base each |
| Age: 3–6 / 6–11 / 11+ months | ×0.97 / ×0.93 / ×0.88 |
| Missing box / charger / bill | −2% / −2% / −3% of base |
| Floor | Never below 18% of base for a working device |
