import type { CategoryId, DeviceModel, Variant } from './types'

/** Build storage variants: first entry is the base (adj 0), each subsequent step adds `step` INR */
const storage = (labels: string[], step: number): Variant[] =>
  labels.map((label, i) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label, adj: i * step }))

const v = (entries: [string, number][]): Variant[] =>
  entries.map(([label, adj]) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    adj,
  }))

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const m = (
  brandId: string,
  category: CategoryId,
  name: string,
  basePrice: number,
  variants: Variant[],
  year: number,
  color: string,
): DeviceModel => ({
  id: `${brandId}-${slug(name)}`,
  brandId,
  category,
  name,
  basePrice,
  variants,
  year,
  color,
})

const PHONE_128_256_512 = storage(['128 GB', '256 GB', '512 GB'], 4000)
const PHONE_256_512_1T = storage(['256 GB', '512 GB', '1 TB'], 6000)
const PHONE_128_256 = storage(['128 GB', '256 GB'], 2500)
const PHONE_MID = v([
  ['6 GB / 128 GB', 0],
  ['8 GB / 128 GB', 1000],
  ['8 GB / 256 GB', 2000],
  ['12 GB / 256 GB', 3000],
])
const PHONE_BUDGET = v([
  ['4 GB / 64 GB', 0],
  ['6 GB / 128 GB', 800],
  ['8 GB / 128 GB', 1400],
])

export const MODELS: DeviceModel[] = [
  // ───────────── Apple phones
  m('apple', 'mobile', 'iPhone 17 Pro Max', 98000, PHONE_256_512_1T, 2025, '#3b5b7c'),
  m('apple', 'mobile', 'iPhone 17 Pro', 88000, PHONE_256_512_1T, 2025, '#c2410c'),
  m('apple', 'mobile', 'iPhone 17', 62000, storage(['256 GB', '512 GB'], 6000), 2025, '#7dd3fc'),
  m('apple', 'mobile', 'iPhone Air', 74000, storage(['256 GB', '512 GB', '1 TB'], 6000), 2025, '#e5e7eb'),
  m('apple', 'mobile', 'iPhone 16 Pro Max', 78000, PHONE_256_512_1T, 2024, '#a8a29e'),
  m('apple', 'mobile', 'iPhone 16 Pro', 70000, PHONE_128_256_512, 2024, '#1c1917'),
  m('apple', 'mobile', 'iPhone 16 Plus', 54000, PHONE_128_256_512, 2024, '#0ea5e9'),
  m('apple', 'mobile', 'iPhone 16', 48500, PHONE_128_256_512, 2024, '#ec4899'),
  m('apple', 'mobile', 'iPhone 16e', 36000, PHONE_128_256_512, 2025, '#f5f5f4'),
  m('apple', 'mobile', 'iPhone 15 Pro Max', 62000, PHONE_256_512_1T, 2023, '#1e3a5f'),
  m('apple', 'mobile', 'iPhone 15 Pro', 54000, PHONE_128_256_512, 2023, '#44403c'),
  m('apple', 'mobile', 'iPhone 15 Plus', 42000, PHONE_128_256_512, 2023, '#fde68a'),
  m('apple', 'mobile', 'iPhone 15', 37000, PHONE_128_256_512, 2023, '#a7f3d0'),
  m('apple', 'mobile', 'iPhone 14 Pro Max', 46000, PHONE_128_256_512, 2022, '#581c87'),
  m('apple', 'mobile', 'iPhone 14 Pro', 40000, PHONE_128_256_512, 2022, '#1f2937'),
  m('apple', 'mobile', 'iPhone 14 Plus', 30000, PHONE_128_256_512, 2022, '#bfdbfe'),
  m('apple', 'mobile', 'iPhone 14', 27000, PHONE_128_256_512, 2022, '#7c3aed'),
  m('apple', 'mobile', 'iPhone 13', 22000, PHONE_128_256_512, 2021, '#f472b6'),
  m('apple', 'mobile', 'iPhone 13 mini', 18000, PHONE_128_256_512, 2021, '#fb7185'),
  m('apple', 'mobile', 'iPhone 12', 15000, storage(['64 GB', '128 GB', '256 GB'], 2000), 2020, '#3b82f6'),
  m('apple', 'mobile', 'iPhone SE (3rd Gen)', 11000, storage(['64 GB', '128 GB', '256 GB'], 1500), 2022, '#ef4444'),
  m('apple', 'mobile', 'iPhone 11', 9000, storage(['64 GB', '128 GB'], 1500), 2019, '#a3e635'),
  m('apple', 'mobile', 'iPhone XR', 6000, storage(['64 GB', '128 GB'], 1000), 2018, '#fb923c'),

  // ───────────── Samsung phones
  m('samsung', 'mobile', 'Galaxy S25 Ultra', 72000, PHONE_256_512_1T, 2025, '#334155'),
  m('samsung', 'mobile', 'Galaxy S25+', 52000, storage(['256 GB', '512 GB'], 5000), 2025, '#a5b4fc'),
  m('samsung', 'mobile', 'Galaxy S25', 44000, storage(['128 GB', '256 GB', '512 GB'], 4000), 2025, '#6ee7b7'),
  m('samsung', 'mobile', 'Galaxy Z Fold 6', 68000, PHONE_256_512_1T, 2024, '#fbbf24'),
  m('samsung', 'mobile', 'Galaxy Z Flip 6', 40000, storage(['256 GB', '512 GB'], 4000), 2024, '#fde047'),
  m('samsung', 'mobile', 'Galaxy S24 Ultra', 52000, PHONE_256_512_1T, 2024, '#78716c'),
  m('samsung', 'mobile', 'Galaxy S24+', 36000, storage(['256 GB', '512 GB'], 4000), 2024, '#c084fc'),
  m('samsung', 'mobile', 'Galaxy S24', 30000, storage(['128 GB', '256 GB', '512 GB'], 3000), 2024, '#fbcfe8'),
  m('samsung', 'mobile', 'Galaxy S23 Ultra', 38000, PHONE_256_512_1T, 2023, '#166534'),
  m('samsung', 'mobile', 'Galaxy S23', 22000, storage(['128 GB', '256 GB'], 3000), 2023, '#f5f5f4'),
  m('samsung', 'mobile', 'Galaxy S23 FE', 17000, storage(['128 GB', '256 GB'], 2500), 2023, '#a78bfa'),
  m('samsung', 'mobile', 'Galaxy A55 5G', 16000, PHONE_MID, 2024, '#93c5fd'),
  m('samsung', 'mobile', 'Galaxy A35 5G', 12000, PHONE_MID, 2024, '#c4b5fd'),
  m('samsung', 'mobile', 'Galaxy M35 5G', 9500, PHONE_MID, 2024, '#0f172a'),
  m('samsung', 'mobile', 'Galaxy A15 5G', 6500, PHONE_BUDGET, 2024, '#60a5fa'),

  // ───────────── OnePlus phones
  m('oneplus', 'mobile', 'OnePlus 13', 42000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 5000]]), 2025, '#0ea5e9'),
  m('oneplus', 'mobile', 'OnePlus 13R', 26000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 3000]]), 2025, '#1e293b'),
  m('oneplus', 'mobile', 'OnePlus 12', 30000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 4000]]), 2024, '#14532d'),
  m('oneplus', 'mobile', 'OnePlus 12R', 20000, v([['8 GB / 128 GB', 0], ['16 GB / 256 GB', 3000]]), 2024, '#1d4ed8'),
  m('oneplus', 'mobile', 'OnePlus 11 5G', 21000, v([['8 GB / 128 GB', 0], ['16 GB / 256 GB', 3000]]), 2023, '#065f46'),
  m('oneplus', 'mobile', 'OnePlus Nord 4', 15000, PHONE_MID, 2024, '#94a3b8'),
  m('oneplus', 'mobile', 'OnePlus Nord CE4', 11000, PHONE_MID, 2024, '#67e8f9'),
  m('oneplus', 'mobile', 'OnePlus Nord CE4 Lite', 8000, PHONE_MID, 2024, '#38bdf8'),

  // ───────────── Xiaomi phones
  m('xiaomi', 'mobile', 'Xiaomi 15', 38000, v([['12 GB / 256 GB', 0], ['12 GB / 512 GB', 3000]]), 2025, '#f5f5f4'),
  m('xiaomi', 'mobile', 'Xiaomi 14', 26000, v([['12 GB / 512 GB', 0]]), 2024, '#0f172a'),
  m('xiaomi', 'mobile', 'Xiaomi 14 CIVI', 20000, v([['8 GB / 256 GB', 0], ['12 GB / 512 GB', 2500]]), 2024, '#fda4af'),
  m('xiaomi', 'mobile', 'Redmi Note 14 Pro+', 15000, PHONE_MID, 2025, '#a16207'),
  m('xiaomi', 'mobile', 'Redmi Note 13 Pro+', 12000, PHONE_MID, 2024, '#7c3aed'),
  m('xiaomi', 'mobile', 'Redmi Note 13 Pro', 9500, PHONE_MID, 2024, '#4c1d95'),
  m('xiaomi', 'mobile', 'Redmi Note 13', 7000, PHONE_MID, 2024, '#fbbf24'),
  m('xiaomi', 'mobile', 'POCO X6 Pro', 11000, PHONE_MID, 2024, '#facc15'),
  m('xiaomi', 'mobile', 'POCO F6', 14000, PHONE_MID, 2024, '#111827'),
  m('xiaomi', 'mobile', 'Redmi 13C', 4000, PHONE_BUDGET, 2023, '#22c55e'),

  // ───────────── Vivo
  m('vivo', 'mobile', 'Vivo X200 Pro', 48000, v([['16 GB / 512 GB', 0]]), 2024, '#1e3a8a'),
  m('vivo', 'mobile', 'Vivo X100 Pro', 34000, v([['16 GB / 512 GB', 0]]), 2024, '#0f172a'),
  m('vivo', 'mobile', 'Vivo X100', 26000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 3000]]), 2024, '#fbbf24'),
  m('vivo', 'mobile', 'Vivo V40 Pro', 20000, v([['8 GB / 256 GB', 0], ['12 GB / 512 GB', 2500]]), 2024, '#a78bfa'),
  m('vivo', 'mobile', 'Vivo V40', 15000, PHONE_MID, 2024, '#c7d2fe'),
  m('vivo', 'mobile', 'Vivo V30', 13000, PHONE_MID, 2024, '#fda4af'),
  m('vivo', 'mobile', 'Vivo T3 Pro', 11000, PHONE_MID, 2024, '#f59e0b'),
  m('vivo', 'mobile', 'Vivo Y200', 7000, PHONE_MID, 2023, '#60a5fa'),

  // ───────────── OPPO
  m('oppo', 'mobile', 'OPPO Find X8 Pro', 50000, v([['16 GB / 512 GB', 0]]), 2024, '#f8fafc'),
  m('oppo', 'mobile', 'OPPO Reno 12 Pro', 20000, v([['12 GB / 256 GB', 0], ['12 GB / 512 GB', 2500]]), 2024, '#b45309'),
  m('oppo', 'mobile', 'OPPO Reno 12', 15000, v([['8 GB / 256 GB', 0], ['12 GB / 256 GB', 1500]]), 2024, '#d1d5db'),
  m('oppo', 'mobile', 'OPPO Reno 11 Pro', 15000, v([['12 GB / 256 GB', 0]]), 2024, '#9ca3af'),
  m('oppo', 'mobile', 'OPPO F27 Pro+', 11000, PHONE_MID, 2024, '#7e22ce'),
  m('oppo', 'mobile', 'OPPO A79 5G', 6500, PHONE_MID, 2023, '#6d28d9'),

  // ───────────── realme
  m('realme', 'mobile', 'realme GT 7 Pro', 34000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 3000]]), 2024, '#ea580c'),
  m('realme', 'mobile', 'realme GT 6', 20000, v([['8 GB / 256 GB', 0], ['12 GB / 256 GB', 1500], ['16 GB / 512 GB', 3500]]), 2024, '#f5f5f4'),
  m('realme', 'mobile', 'realme 13 Pro+', 14000, PHONE_MID, 2024, '#fbbf24'),
  m('realme', 'mobile', 'realme 12 Pro+', 12000, PHONE_MID, 2024, '#1e3a8a'),
  m('realme', 'mobile', 'realme Narzo 70 Pro', 8500, PHONE_MID, 2024, '#65a30d'),
  m('realme', 'mobile', 'realme C67', 5000, PHONE_BUDGET, 2023, '#0f766e'),

  // ───────────── Google
  m('google', 'mobile', 'Pixel 10 Pro', 62000, PHONE_128_256_512, 2025, '#0ea5e9'),
  m('google', 'mobile', 'Pixel 10', 46000, PHONE_128_256, 2025, '#c4b5fd'),
  m('google', 'mobile', 'Pixel 9 Pro XL', 52000, PHONE_128_256_512, 2024, '#f5f5f4'),
  m('google', 'mobile', 'Pixel 9 Pro', 46000, PHONE_128_256_512, 2024, '#fda4af'),
  m('google', 'mobile', 'Pixel 9', 36000, PHONE_128_256, 2024, '#86efac'),
  m('google', 'mobile', 'Pixel 9a', 26000, PHONE_128_256, 2025, '#c084fc'),
  m('google', 'mobile', 'Pixel 8 Pro', 30000, PHONE_128_256_512, 2023, '#0369a1'),
  m('google', 'mobile', 'Pixel 8', 22000, PHONE_128_256, 2023, '#fecaca'),
  m('google', 'mobile', 'Pixel 8a', 17000, PHONE_128_256, 2024, '#a3e635'),
  m('google', 'mobile', 'Pixel 7a', 11000, v([['8 GB / 128 GB', 0]]), 2023, '#38bdf8'),
  m('google', 'mobile', 'Pixel 7', 12000, PHONE_128_256, 2022, '#fef3c7'),

  // ───────────── Motorola
  m('motorola', 'mobile', 'Motorola Razr 50 Ultra', 38000, v([['12 GB / 512 GB', 0]]), 2024, '#be185d'),
  m('motorola', 'mobile', 'Motorola Edge 50 Pro', 15000, v([['8 GB / 256 GB', 0], ['12 GB / 256 GB', 1500]]), 2024, '#7e22ce'),
  m('motorola', 'mobile', 'Motorola Edge 50 Fusion', 11000, PHONE_MID, 2024, '#0f766e'),
  m('motorola', 'mobile', 'Moto G85 5G', 8500, PHONE_MID, 2024, '#4338ca'),
  m('motorola', 'mobile', 'Moto G64 5G', 6500, PHONE_MID, 2024, '#0284c7'),
  m('motorola', 'mobile', 'Moto G34 5G', 4500, PHONE_BUDGET, 2024, '#16a34a'),

  // ───────────── Nothing
  m('nothing', 'mobile', 'Nothing Phone (3)', 40000, v([['12 GB / 256 GB', 0], ['16 GB / 512 GB', 4000]]), 2025, '#f5f5f4'),
  m('nothing', 'mobile', 'Nothing Phone (3a) Pro', 18000, v([['8 GB / 128 GB', 0], ['8 GB / 256 GB', 1500], ['12 GB / 256 GB', 2500]]), 2025, '#d4d4d4'),
  m('nothing', 'mobile', 'Nothing Phone (2a)', 12000, v([['8 GB / 128 GB', 0], ['8 GB / 256 GB', 1200], ['12 GB / 256 GB', 2000]]), 2024, '#111111'),
  m('nothing', 'mobile', 'Nothing Phone (2)', 16000, v([['8 GB / 128 GB', 0], ['12 GB / 256 GB', 2000], ['12 GB / 512 GB', 3500]]), 2023, '#e5e5e5'),
  m('nothing', 'mobile', 'CMF Phone 1', 7000, v([['6 GB / 128 GB', 0], ['8 GB / 128 GB', 800]]), 2024, '#f97316'),

  // ───────────── Apple laptops
  m('apple', 'laptop', 'MacBook Pro 16" (M4 Pro)', 165000, v([['24 GB / 512 GB', 0], ['48 GB / 1 TB', 30000]]), 2024, '#1f2937'),
  m('apple', 'laptop', 'MacBook Pro 14" (M4 Pro)', 130000, v([['24 GB / 512 GB', 0], ['24 GB / 1 TB', 12000]]), 2024, '#0f172a'),
  m('apple', 'laptop', 'MacBook Pro 14" (M4)', 100000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 10000], ['24 GB / 1 TB', 18000]]), 2024, '#d6d3d1'),
  m('apple', 'laptop', 'MacBook Air 15" (M4)', 82000, v([['16 GB / 256 GB', 0], ['16 GB / 512 GB', 8000], ['24 GB / 512 GB', 14000]]), 2025, '#bfdbfe'),
  m('apple', 'laptop', 'MacBook Air 13" (M4)', 68000, v([['16 GB / 256 GB', 0], ['16 GB / 512 GB', 8000], ['24 GB / 512 GB', 14000]]), 2025, '#e0f2fe'),
  m('apple', 'laptop', 'MacBook Air 13" (M3)', 56000, v([['8 GB / 256 GB', 0], ['8 GB / 512 GB', 6000], ['16 GB / 512 GB', 10000]]), 2024, '#1e293b'),
  m('apple', 'laptop', 'MacBook Air 13" (M2)', 44000, v([['8 GB / 256 GB', 0], ['8 GB / 512 GB', 5000], ['16 GB / 512 GB', 9000]]), 2022, '#a8a29e'),
  m('apple', 'laptop', 'MacBook Pro 14" (M3 Pro)', 95000, v([['18 GB / 512 GB', 0], ['18 GB / 1 TB', 10000]]), 2023, '#111827'),
  m('apple', 'laptop', 'MacBook Air 13" (M1)', 30000, v([['8 GB / 256 GB', 0], ['8 GB / 512 GB', 4000], ['16 GB / 512 GB', 7000]]), 2020, '#fbbf24'),

  // ───────────── Dell
  m('dell', 'laptop', 'Dell XPS 14 (9440)', 90000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 15000]]), 2024, '#64748b'),
  m('dell', 'laptop', 'Dell XPS 13 (9340)', 65000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 12000]]), 2024, '#cbd5e1'),
  m('dell', 'laptop', 'Dell XPS 15 (9530)', 70000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 12000]]), 2023, '#334155'),
  m('dell', 'laptop', 'Dell Inspiron 14 Plus', 36000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#0ea5e9'),
  m('dell', 'laptop', 'Dell Inspiron 15 (3530)', 20000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 3000], ['16 GB / 1 TB', 5000]]), 2023, '#1e293b'),
  m('dell', 'laptop', 'Dell Latitude 7440', 42000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 8000]]), 2023, '#475569'),
  m('dell', 'laptop', 'Dell Alienware m16 R2', 95000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#0f172a'),
  m('dell', 'laptop', 'Dell G15 Gaming (5530)', 40000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2023, '#1e40af'),

  // ───────────── HP
  m('hp', 'laptop', 'HP Spectre x360 14', 70000, v([['16 GB / 1 TB', 0], ['32 GB / 2 TB', 14000]]), 2024, '#1e293b'),
  m('hp', 'laptop', 'HP OmniBook X 14', 45000, v([['16 GB / 1 TB', 0]]), 2024, '#f5f5f4'),
  m('hp', 'laptop', 'HP Envy x360 14', 38000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#94a3b8'),
  m('hp', 'laptop', 'HP Pavilion Plus 14', 32000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#0284c7'),
  m('hp', 'laptop', 'HP Pavilion 15', 22000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 3000], ['16 GB / 1 TB', 5000]]), 2023, '#cbd5e1'),
  m('hp', 'laptop', 'HP Victus 15', 32000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 3000], ['16 GB / 1 TB', 5000]]), 2024, '#1d4ed8'),
  m('hp', 'laptop', 'HP OMEN 16', 55000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#0f172a'),
  m('hp', 'laptop', 'HP 15s', 14000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 2500]]), 2023, '#e2e8f0'),

  // ───────────── Lenovo
  m('lenovo', 'laptop', 'ThinkPad X1 Carbon Gen 12', 80000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 14000]]), 2024, '#111827'),
  m('lenovo', 'laptop', 'Yoga Slim 7i Aura Edition', 55000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#d4d4d8'),
  m('lenovo', 'laptop', 'Yoga 7i 2-in-1 (14")', 42000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#64748b'),
  m('lenovo', 'laptop', 'IdeaPad Slim 5 (14")', 30000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#a1a1aa'),
  m('lenovo', 'laptop', 'IdeaPad Slim 3 (15")', 18000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 3000]]), 2023, '#3f3f46'),
  m('lenovo', 'laptop', 'ThinkPad E14 Gen 5', 32000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2023, '#18181b'),
  m('lenovo', 'laptop', 'Legion 5i (16")', 62000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#1e293b'),
  m('lenovo', 'laptop', 'LOQ 15 Gaming', 38000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#334155'),

  // ───────────── ASUS
  m('asus', 'laptop', 'ROG Zephyrus G14 (2024)', 95000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 10000]]), 2024, '#e2e8f0'),
  m('asus', 'laptop', 'ROG Strix G16', 70000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#0f172a'),
  m('asus', 'laptop', 'Zenbook 14 OLED', 42000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000], ['32 GB / 1 TB', 8000]]), 2024, '#1e3a8a'),
  m('asus', 'laptop', 'Zenbook S 16', 60000, v([['24 GB / 1 TB', 0], ['32 GB / 1 TB', 6000]]), 2024, '#57534e'),
  m('asus', 'laptop', 'Vivobook S 15', 34000, v([['16 GB / 1 TB', 0]]), 2024, '#94a3b8'),
  m('asus', 'laptop', 'Vivobook 15', 16000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 2500]]), 2023, '#cbd5e1'),
  m('asus', 'laptop', 'TUF Gaming A15', 38000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#374151'),

  // ───────────── Acer
  m('acer', 'laptop', 'Acer Swift Go 14', 30000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#d4d4d4'),
  m('acer', 'laptop', 'Acer Swift 14 AI', 45000, v([['16 GB / 1 TB', 0]]), 2024, '#a3a3a3'),
  m('acer', 'laptop', 'Acer Aspire 5', 18000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 3000]]), 2023, '#71717a'),
  m('acer', 'laptop', 'Acer Aspire Lite', 12000, v([['8 GB / 512 GB', 0], ['16 GB / 512 GB', 2500]]), 2023, '#a1a1aa'),
  m('acer', 'laptop', 'Acer Nitro V 15', 34000, v([['16 GB / 512 GB', 0], ['16 GB / 1 TB', 4000]]), 2024, '#111827'),
  m('acer', 'laptop', 'Acer Predator Helios Neo 16', 60000, v([['16 GB / 1 TB', 0], ['32 GB / 1 TB', 8000]]), 2024, '#0f172a'),

  // ───────────── Microsoft
  m('microsoft', 'laptop', 'Surface Laptop 7 (13.8")', 60000, v([['16 GB / 512 GB', 0], ['32 GB / 1 TB', 14000]]), 2024, '#0ea5e9'),
  m('microsoft', 'laptop', 'Surface Pro 11', 62000, v([['16 GB / 256 GB', 0], ['16 GB / 512 GB', 6000], ['32 GB / 1 TB', 16000]]), 2024, '#1e293b'),
  m('microsoft', 'laptop', 'Surface Laptop 5 (13.5")', 38000, v([['8 GB / 256 GB', 0], ['16 GB / 512 GB', 8000]]), 2022, '#a8a29e'),
  m('microsoft', 'laptop', 'Surface Laptop Go 3', 28000, v([['8 GB / 256 GB', 0], ['16 GB / 256 GB', 4000]]), 2023, '#f5f5f4'),

  // ───────────── Tablets
  m('apple', 'tablet', 'iPad Pro 13" (M4)', 82000, v([['256 GB Wi-Fi', 0], ['512 GB Wi-Fi', 12000], ['256 GB Cellular', 10000], ['1 TB Wi-Fi', 30000]]), 2024, '#1f2937'),
  m('apple', 'tablet', 'iPad Pro 11" (M4)', 62000, v([['256 GB Wi-Fi', 0], ['512 GB Wi-Fi', 10000], ['256 GB Cellular', 9000]]), 2024, '#d6d3d1'),
  m('apple', 'tablet', 'iPad Air 13" (M2)', 46000, v([['128 GB Wi-Fi', 0], ['256 GB Wi-Fi', 6000], ['128 GB Cellular', 8000]]), 2024, '#bfdbfe'),
  m('apple', 'tablet', 'iPad Air 11" (M2)', 36000, v([['128 GB Wi-Fi', 0], ['256 GB Wi-Fi', 5000], ['128 GB Cellular', 7000]]), 2024, '#c4b5fd'),
  m('apple', 'tablet', 'iPad (11th Gen, A16)', 22000, v([['128 GB Wi-Fi', 0], ['256 GB Wi-Fi', 4000], ['128 GB Cellular', 6000]]), 2025, '#fda4af'),
  m('apple', 'tablet', 'iPad (10th Gen)', 17000, v([['64 GB Wi-Fi', 0], ['256 GB Wi-Fi', 5000], ['64 GB Cellular', 5000]]), 2022, '#fde68a'),
  m('apple', 'tablet', 'iPad mini (A17 Pro)', 30000, v([['128 GB Wi-Fi', 0], ['256 GB Wi-Fi', 5000], ['128 GB Cellular', 7000]]), 2024, '#a78bfa'),
  m('apple', 'tablet', 'iPad Air (5th Gen, M1)', 26000, v([['64 GB Wi-Fi', 0], ['256 GB Wi-Fi', 6000]]), 2022, '#f472b6'),
  m('apple', 'tablet', 'iPad (9th Gen)', 11000, v([['64 GB Wi-Fi', 0], ['256 GB Wi-Fi', 4000]]), 2021, '#9ca3af'),
  m('samsung', 'tablet', 'Galaxy Tab S10 Ultra', 62000, v([['12 GB / 256 GB', 0], ['12 GB / 512 GB', 8000]]), 2024, '#334155'),
  m('samsung', 'tablet', 'Galaxy Tab S9 Ultra', 48000, v([['12 GB / 256 GB', 0], ['12 GB / 512 GB', 7000]]), 2023, '#1e293b'),
  m('samsung', 'tablet', 'Galaxy Tab S9', 30000, v([['8 GB / 128 GB', 0], ['12 GB / 256 GB', 4000]]), 2023, '#d4d4d8'),
  m('samsung', 'tablet', 'Galaxy Tab S9 FE', 17000, v([['6 GB / 128 GB', 0], ['8 GB / 256 GB', 3000]]), 2023, '#a5b4fc'),
  m('samsung', 'tablet', 'Galaxy Tab A9+', 9000, v([['4 GB / 64 GB', 0], ['8 GB / 128 GB', 2000]]), 2023, '#94a3b8'),
  m('lenovo', 'tablet', 'Lenovo Tab P12', 14000, v([['8 GB / 128 GB', 0], ['8 GB / 256 GB', 2000]]), 2023, '#64748b'),
  m('lenovo', 'tablet', 'Lenovo Tab M11', 7000, v([['4 GB / 128 GB', 0], ['8 GB / 128 GB', 1200]]), 2024, '#a1a1aa'),
  m('xiaomi', 'tablet', 'Xiaomi Pad 6', 14000, v([['6 GB / 128 GB', 0], ['8 GB / 256 GB', 2500]]), 2023, '#fbbf24'),
  m('xiaomi', 'tablet', 'Redmi Pad Pro', 11000, v([['6 GB / 128 GB', 0], ['8 GB / 256 GB', 2000]]), 2024, '#38bdf8'),
  m('oneplus', 'tablet', 'OnePlus Pad 2', 22000, v([['8 GB / 128 GB', 0], ['12 GB / 256 GB', 3000]]), 2024, '#0ea5e9'),
  m('oneplus', 'tablet', 'OnePlus Pad Go', 9000, v([['8 GB / 128 GB', 0], ['8 GB / 256 GB', 1500]]), 2023, '#065f46'),

  // ───────────── Smartwatches
  m('apple', 'smartwatch', 'Apple Watch Ultra 2', 42000, v([['49 mm Titanium', 0]]), 2024, '#fb923c'),
  m('apple', 'smartwatch', 'Apple Watch Series 10', 24000, v([['42 mm GPS', 0], ['46 mm GPS', 2500], ['42 mm Cellular', 6000], ['46 mm Cellular', 8000]]), 2024, '#1f2937'),
  m('apple', 'smartwatch', 'Apple Watch Series 9', 17000, v([['41 mm GPS', 0], ['45 mm GPS', 2000], ['41 mm Cellular', 5000], ['45 mm Cellular', 6500]]), 2023, '#fda4af'),
  m('apple', 'smartwatch', 'Apple Watch SE (2nd Gen)', 11000, v([['40 mm GPS', 0], ['44 mm GPS', 1500], ['44 mm Cellular', 4000]]), 2023, '#e5e7eb'),
  m('apple', 'smartwatch', 'Apple Watch Series 8', 12000, v([['41 mm GPS', 0], ['45 mm GPS', 1500], ['45 mm Cellular', 4000]]), 2022, '#ef4444'),
  m('apple', 'smartwatch', 'Apple Watch Ultra', 28000, v([['49 mm Titanium', 0]]), 2022, '#78716c'),
  m('samsung', 'smartwatch', 'Galaxy Watch Ultra', 28000, v([['47 mm LTE', 0]]), 2024, '#f5f5f4'),
  m('samsung', 'smartwatch', 'Galaxy Watch 7', 13000, v([['40 mm BT', 0], ['44 mm BT', 1500], ['44 mm LTE', 4000]]), 2024, '#86efac'),
  m('samsung', 'smartwatch', 'Galaxy Watch 6 Classic', 12000, v([['43 mm BT', 0], ['47 mm BT', 1500], ['47 mm LTE', 4000]]), 2023, '#1e293b'),
  m('samsung', 'smartwatch', 'Galaxy Watch 6', 9000, v([['40 mm BT', 0], ['44 mm BT', 1200], ['44 mm LTE', 3000]]), 2023, '#fbbf24'),
  m('samsung', 'smartwatch', 'Galaxy Watch FE', 6000, v([['40 mm BT', 0]]), 2024, '#f472b6'),
  m('garmin', 'smartwatch', 'Garmin Fenix 8', 60000, v([['47 mm AMOLED', 0], ['51 mm AMOLED', 6000]]), 2024, '#1e293b'),
  m('garmin', 'smartwatch', 'Garmin Forerunner 265', 22000, v([['Standard', 0], ['265S', 0]]), 2023, '#facc15'),
  m('garmin', 'smartwatch', 'Garmin Venu 3', 24000, v([['Venu 3', 0], ['Venu 3S', 0]]), 2023, '#e2e8f0'),
  m('garmin', 'smartwatch', 'Garmin Vivoactive 5', 14000, v([['Standard', 0]]), 2023, '#fb7185'),
  m('noise', 'smartwatch', 'Noise ColorFit Pro 5 Max', 2200, v([['Standard', 0]]), 2024, '#0f172a'),
  m('noise', 'smartwatch', 'NoiseFit Diva 2', 1800, v([['Standard', 0]]), 2024, '#fbcfe8'),
  m('noise', 'smartwatch', 'Noise Luna Ring', 6000, v([['Size 6-13', 0]]), 2024, '#d4d4d8'),
  m('boat', 'smartwatch', 'boAt Lunar Pro LTE', 3200, v([['Standard', 0]]), 2024, '#111827'),
  m('boat', 'smartwatch', 'boAt Wave Sigma 3', 1200, v([['Standard', 0]]), 2024, '#22d3ee'),
  m('fitbit', 'smartwatch', 'Fitbit Charge 6', 6500, v([['Standard', 0]]), 2023, '#4c1d95'),
  m('fitbit', 'smartwatch', 'Fitbit Versa 4', 7500, v([['Standard', 0]]), 2022, '#f9a8d4'),
  m('fitbit', 'smartwatch', 'Fitbit Sense 2', 9000, v([['Standard', 0]]), 2022, '#a5b4fc'),

  // ───────────── Earbuds & headphones
  m('apple', 'earbuds', 'AirPods Pro 2 (USB-C)', 11000, v([['Standard', 0]]), 2023, '#f5f5f4'),
  m('apple', 'earbuds', 'AirPods 4 (ANC)', 8500, v([['ANC', 0]]), 2024, '#ffffff'),
  m('apple', 'earbuds', 'AirPods 4', 6000, v([['Standard', 0]]), 2024, '#fafafa'),
  m('apple', 'earbuds', 'AirPods Max', 28000, v([['Lightning', 0], ['USB-C', 6000]]), 2024, '#7dd3fc'),
  m('apple', 'earbuds', 'AirPods (3rd Gen)', 5000, v([['Standard', 0]]), 2021, '#f5f5f4'),
  m('samsung', 'earbuds', 'Galaxy Buds 3 Pro', 9000, v([['Standard', 0]]), 2024, '#e5e7eb'),
  m('samsung', 'earbuds', 'Galaxy Buds 3', 6000, v([['Standard', 0]]), 2024, '#d4d4d8'),
  m('samsung', 'earbuds', 'Galaxy Buds 2 Pro', 5500, v([['Standard', 0]]), 2022, '#a78bfa'),
  m('samsung', 'earbuds', 'Galaxy Buds FE', 2800, v([['Standard', 0]]), 2023, '#a3a3a3'),
  m('sony', 'earbuds', 'Sony WH-1000XM6', 22000, v([['Standard', 0]]), 2025, '#1e293b'),
  m('sony', 'earbuds', 'Sony WH-1000XM5', 15000, v([['Standard', 0]]), 2022, '#0f172a'),
  m('sony', 'earbuds', 'Sony WF-1000XM5', 12000, v([['Standard', 0]]), 2023, '#111827'),
  m('sony', 'earbuds', 'Sony WH-CH720N', 4500, v([['Standard', 0]]), 2023, '#3b82f6'),
  m('sony', 'earbuds', 'Sony LinkBuds S', 6000, v([['Standard', 0]]), 2022, '#a8a29e'),
  m('bose', 'earbuds', 'Bose QuietComfort Ultra Headphones', 20000, v([['Standard', 0]]), 2023, '#1e293b'),
  m('bose', 'earbuds', 'Bose QuietComfort Ultra Earbuds', 12000, v([['Standard', 0]]), 2023, '#111827'),
  m('bose', 'earbuds', 'Bose QuietComfort 45', 11000, v([['Standard', 0]]), 2021, '#f5f5f4'),
  m('oneplus', 'earbuds', 'OnePlus Buds Pro 3', 5500, v([['Standard', 0]]), 2024, '#1e3a8a'),
  m('oneplus', 'earbuds', 'OnePlus Buds 3', 3200, v([['Standard', 0]]), 2024, '#0ea5e9'),
  m('oneplus', 'earbuds', 'OnePlus Nord Buds 3 Pro', 1800, v([['Standard', 0]]), 2024, '#64748b'),
  m('boat', 'earbuds', 'boAt Nirvana Ion ANC', 1500, v([['Standard', 0]]), 2024, '#111827'),
  m('boat', 'earbuds', 'boAt Airdopes 800', 1400, v([['Standard', 0]]), 2024, '#22c55e'),
  m('boat', 'earbuds', 'boAt Rockerz 550', 900, v([['Standard', 0]]), 2020, '#ef4444'),
  m('google', 'earbuds', 'Pixel Buds Pro 2', 9000, v([['Standard', 0]]), 2024, '#fda4af'),
  m('google', 'earbuds', 'Pixel Buds Pro', 6000, v([['Standard', 0]]), 2022, '#86efac'),
  m('nothing', 'earbuds', 'Nothing Ear (2024)', 5000, v([['Standard', 0]]), 2024, '#f5f5f4'),
  m('nothing', 'earbuds', 'Nothing Ear (a)', 3500, v([['Standard', 0]]), 2024, '#facc15'),
  m('nothing', 'earbuds', 'Nothing Headphone (1)', 12000, v([['Standard', 0]]), 2025, '#e5e5e5'),

  // ───────────── Consoles
  m('sony', 'console', 'PlayStation 5 Pro', 48000, v([['2 TB Digital', 0]]), 2024, '#f5f5f4'),
  m('sony', 'console', 'PlayStation 5 Slim', 30000, v([['1 TB Disc', 0], ['1 TB Digital', -4000]]), 2023, '#ffffff'),
  m('sony', 'console', 'PlayStation 5', 26000, v([['825 GB Disc', 0], ['825 GB Digital', -4000]]), 2020, '#f8fafc'),
  m('sony', 'console', 'PlayStation 4 Pro', 11000, v([['1 TB', 0]]), 2016, '#1e293b'),
  m('sony', 'console', 'PlayStation 4 Slim', 8000, v([['500 GB', 0], ['1 TB', 1000]]), 2016, '#0f172a'),
  m('sony', 'console', 'PlayStation Portal', 10000, v([['Standard', 0]]), 2023, '#e5e7eb'),
  m('microsoft', 'console', 'Xbox Series X', 28000, v([['1 TB', 0], ['2 TB Galaxy Black', 6000]]), 2020, '#111827'),
  m('microsoft', 'console', 'Xbox Series S', 15000, v([['512 GB', 0], ['1 TB Carbon Black', 3000]]), 2020, '#f5f5f4'),
  m('microsoft', 'console', 'Xbox One X', 9000, v([['1 TB', 0]]), 2017, '#1f2937'),
  m('nintendo', 'console', 'Nintendo Switch 2', 32000, v([['256 GB', 0]]), 2025, '#ef4444'),
  m('nintendo', 'console', 'Nintendo Switch OLED', 16000, v([['64 GB', 0]]), 2021, '#f5f5f4'),
  m('nintendo', 'console', 'Nintendo Switch', 11000, v([['32 GB', 0]]), 2017, '#3b82f6'),
  m('nintendo', 'console', 'Nintendo Switch Lite', 8000, v([['32 GB', 0]]), 2019, '#facc15'),

  // ───────────── Cameras
  m('canon', 'camera', 'Canon EOS R5 Mark II', 260000, v([['Body only', 0], ['with 24-105mm', 60000]]), 2024, '#1e293b'),
  m('canon', 'camera', 'Canon EOS R6 Mark II', 130000, v([['Body only', 0], ['with 24-105mm', 40000]]), 2022, '#0f172a'),
  m('canon', 'camera', 'Canon EOS R8', 85000, v([['Body only', 0], ['with 24-50mm', 12000]]), 2023, '#111827'),
  m('canon', 'camera', 'Canon EOS R50', 40000, v([['with 18-45mm', 0], ['Dual lens kit', 10000]]), 2023, '#f5f5f4'),
  m('canon', 'camera', 'Canon EOS R10', 48000, v([['with 18-45mm', 0], ['with 18-150mm', 14000]]), 2022, '#1f2937'),
  m('canon', 'camera', 'Canon EOS 200D II', 28000, v([['with 18-55mm', 0], ['Dual lens kit', 6000]]), 2019, '#0f172a'),
  m('canon', 'camera', 'Canon EOS 1500D', 16000, v([['with 18-55mm', 0]]), 2018, '#111827'),
  m('nikon', 'camera', 'Nikon Z8', 220000, v([['Body only', 0], ['with 24-120mm', 55000]]), 2023, '#1e293b'),
  m('nikon', 'camera', 'Nikon Z6 III', 150000, v([['Body only', 0], ['with 24-120mm', 50000]]), 2024, '#0f172a'),
  m('nikon', 'camera', 'Nikon Z5', 60000, v([['Body only', 0], ['with 24-50mm', 12000]]), 2020, '#111827'),
  m('nikon', 'camera', 'Nikon Z50 II', 55000, v([['with 16-50mm', 0], ['Dual lens kit', 14000]]), 2024, '#1f2937'),
  m('nikon', 'camera', 'Nikon Z fc', 45000, v([['with 16-50mm', 0], ['with 28mm', 4000]]), 2021, '#d6d3d1'),
  m('nikon', 'camera', 'Nikon D5600', 26000, v([['with 18-55mm', 0], ['Dual lens kit', 6000]]), 2016, '#0f172a'),
  m('sony', 'camera', 'Sony A7 IV', 130000, v([['Body only', 0], ['with 28-70mm', 20000]]), 2021, '#1e293b'),
  m('sony', 'camera', 'Sony A7C II', 115000, v([['Body only', 0], ['with 28-60mm', 18000]]), 2023, '#0f172a'),
  m('sony', 'camera', 'Sony A7 III', 75000, v([['Body only', 0], ['with 28-70mm', 12000]]), 2018, '#111827'),
  m('sony', 'camera', 'Sony A6700', 75000, v([['Body only', 0], ['with 16-50mm', 8000], ['with 18-135mm', 25000]]), 2023, '#1f2937'),
  m('sony', 'camera', 'Sony A6400', 45000, v([['Body only', 0], ['with 16-50mm', 6000]]), 2019, '#0f172a'),
  m('sony', 'camera', 'Sony ZV-E10 II', 48000, v([['Body only', 0], ['with 16-50mm', 6000]]), 2024, '#f5f5f4'),
  m('sony', 'camera', 'Sony ZV-1 II', 32000, v([['Standard', 0]]), 2023, '#111827'),
  m('fujifilm', 'camera', 'Fujifilm X100VI', 120000, v([['Standard', 0]]), 2024, '#d6d3d1'),
  m('fujifilm', 'camera', 'Fujifilm X-T5', 100000, v([['Body only', 0], ['with 18-55mm', 25000]]), 2022, '#1e293b'),
  m('fujifilm', 'camera', 'Fujifilm X-T50', 85000, v([['Body only', 0], ['with 15-45mm', 8000]]), 2024, '#a8a29e'),
  m('fujifilm', 'camera', 'Fujifilm X-S20', 70000, v([['Body only', 0], ['with 15-45mm', 8000]]), 2023, '#0f172a'),
  m('fujifilm', 'camera', 'Fujifilm X-T30 II', 45000, v([['Body only', 0], ['with 15-45mm', 6000]]), 2021, '#78716c'),
  m('gopro', 'camera', 'GoPro HERO13 Black', 22000, v([['Standard', 0], ['Creator Edition', 6000]]), 2024, '#111827'),
  m('gopro', 'camera', 'GoPro HERO12 Black', 17000, v([['Standard', 0], ['Creator Edition', 5000]]), 2023, '#1f2937'),
  m('gopro', 'camera', 'GoPro HERO11 Black', 13000, v([['Standard', 0]]), 2022, '#0f172a'),
  m('gopro', 'camera', 'GoPro HERO (2024)', 9000, v([['Standard', 0]]), 2024, '#38bdf8'),
]

export const MODEL_MAP = Object.fromEntries(MODELS.map((mo) => [mo.id, mo])) as Record<string, DeviceModel>

export const modelsFor = (category: CategoryId, brandId: string) =>
  MODELS.filter((mo) => mo.category === category && mo.brandId === brandId)

/** Fuzzy search across all sellable models */
export const searchModels = (query: string, limit = 8) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/)
  return MODELS.map((mo) => {
    const name = mo.name.toLowerCase()
    const hay = `${mo.brandId} ${name} ${mo.category}`
    const matched = tokens.every((t) => hay.includes(t))
    // Rank: exact name match > name starts with query > name contains query > other matches
    const rank = name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : 3
    return { model: mo, matched, rank }
  })
    .filter((r) => r.matched)
    .sort((a, b) => a.rank - b.rank || a.model.name.length - b.model.name.length || b.model.basePrice - a.model.basePrice)
    .slice(0, limit)
    .map((r) => r.model)
}
