import type { Brand, Category, CategoryId } from './types'

const commonIssues = {
  battery: { id: 'battery', label: 'Battery drains fast', deduct: 0.06 },
  speaker: { id: 'speaker', label: 'Speaker not working', deduct: 0.05 },
  mic: { id: 'mic', label: 'Microphone issue', deduct: 0.05 },
  wifi: { id: 'wifi', label: 'Wi-Fi / Bluetooth issue', deduct: 0.06 },
  charging: { id: 'charging', label: 'Charging port faulty', deduct: 0.08 },
  buttons: { id: 'buttons', label: 'Buttons not working', deduct: 0.04 },
  heating: { id: 'heating', label: 'Overheating', deduct: 0.1 },
}

export const CATEGORIES: Category[] = [
  {
    id: 'mobile',
    name: 'Mobile Phones',
    short: 'Phones',
    tagline: 'Sell your old phone for the best price',
    coreCheck: 'Are calls and the touch screen working properly?',
    variantLabel: 'Storage',
    issues: [
      commonIssues.battery,
      { id: 'camera', label: 'Camera not working', deduct: 0.08 },
      commonIssues.speaker,
      commonIssues.mic,
      commonIssues.wifi,
      { id: 'biometric', label: 'Face ID / Fingerprint issue', deduct: 0.07 },
      commonIssues.charging,
      commonIssues.buttons,
      commonIssues.heating,
    ],
  },
  {
    id: 'laptop',
    name: 'Laptops',
    short: 'Laptops',
    tagline: 'Turn your old laptop into instant cash',
    coreCheck: 'Are the keyboard and trackpad working properly?',
    variantLabel: 'Configuration',
    issues: [
      commonIssues.battery,
      { id: 'keys', label: 'Some keys not working', deduct: 0.07 },
      { id: 'webcam', label: 'Webcam not working', deduct: 0.04 },
      commonIssues.speaker,
      commonIssues.wifi,
      { id: 'ports', label: 'USB / HDMI ports faulty', deduct: 0.06 },
      { id: 'hinge', label: 'Loose or broken hinge', deduct: 0.1 },
      commonIssues.heating,
    ],
  },
  {
    id: 'tablet',
    name: 'Tablets',
    short: 'Tablets',
    tagline: 'Get instant money for your tablet',
    coreCheck: 'Is the touch screen working properly?',
    variantLabel: 'Storage',
    issues: [
      commonIssues.battery,
      { id: 'camera', label: 'Camera not working', deduct: 0.06 },
      commonIssues.speaker,
      commonIssues.wifi,
      { id: 'biometric', label: 'Face ID / Fingerprint issue', deduct: 0.06 },
      commonIssues.charging,
      commonIssues.buttons,
    ],
  },
  {
    id: 'smartwatch',
    name: 'Smartwatches',
    short: 'Watches',
    tagline: 'Upgrade your wrist, sell the old one',
    coreCheck: 'Is the touch screen and crown working properly?',
    variantLabel: 'Size / Connectivity',
    issues: [
      commonIssues.battery,
      { id: 'sensors', label: 'Heart-rate / sensors faulty', deduct: 0.1 },
      { id: 'strap', label: 'Strap missing or damaged', deduct: 0.05 },
      commonIssues.wifi,
      commonIssues.charging,
    ],
  },
  {
    id: 'earbuds',
    name: 'Earbuds & Headphones',
    short: 'Audio',
    tagline: 'Sell used earbuds and headphones',
    coreCheck: 'Do both sides play audio properly?',
    variantLabel: 'Edition',
    issues: [
      commonIssues.battery,
      { id: 'anc', label: 'Noise cancellation not working', deduct: 0.1 },
      { id: 'onebud', label: 'One side not working', deduct: 0.25 },
      commonIssues.mic,
      { id: 'case', label: 'Charging case faulty', deduct: 0.15 },
    ],
  },
  {
    id: 'console',
    name: 'Gaming Consoles',
    short: 'Consoles',
    tagline: 'Level up – sell your old console',
    coreCheck: 'Are the controllers and all ports working?',
    variantLabel: 'Edition',
    issues: [
      { id: 'drive', label: 'Disc drive not reading', deduct: 0.12 },
      { id: 'controller', label: 'Controller drift / faulty', deduct: 0.08 },
      { id: 'hdmi', label: 'HDMI port faulty', deduct: 0.12 },
      commonIssues.wifi,
      commonIssues.heating,
    ],
  },
  {
    id: 'camera',
    name: 'Cameras',
    short: 'Cameras',
    tagline: 'Sell DSLR, mirrorless & action cameras',
    coreCheck: 'Are the shutter, autofocus and display working?',
    variantLabel: 'Kit',
    issues: [
      { id: 'sensor', label: 'Dust / spots on sensor', deduct: 0.08 },
      { id: 'lens', label: 'Lens scratches or fungus', deduct: 0.12 },
      { id: 'flash', label: 'Flash not working', deduct: 0.04 },
      commonIssues.battery,
      { id: 'lcd', label: 'LCD / viewfinder issue', deduct: 0.1 },
    ],
  },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>

export const BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple', color: '#1f2937', categories: ['mobile', 'laptop', 'tablet', 'smartwatch', 'earbuds'] },
  { id: 'samsung', name: 'Samsung', color: '#1428a0', categories: ['mobile', 'tablet', 'smartwatch', 'earbuds'] },
  { id: 'oneplus', name: 'OnePlus', color: '#eb0029', categories: ['mobile', 'tablet', 'earbuds'] },
  { id: 'xiaomi', name: 'Xiaomi', color: '#ff6900', categories: ['mobile', 'tablet'] },
  { id: 'vivo', name: 'Vivo', color: '#415fff', categories: ['mobile'] },
  { id: 'oppo', name: 'OPPO', color: '#0a7d3d', categories: ['mobile'] },
  { id: 'realme', name: 'realme', color: '#f9c400', categories: ['mobile'] },
  { id: 'google', name: 'Google', color: '#4285f4', categories: ['mobile', 'earbuds'] },
  { id: 'motorola', name: 'Motorola', color: '#5c92fa', categories: ['mobile'] },
  { id: 'nothing', name: 'Nothing', color: '#111111', categories: ['mobile', 'earbuds'] },
  { id: 'dell', name: 'Dell', color: '#007db8', categories: ['laptop'] },
  { id: 'hp', name: 'HP', color: '#0096d6', categories: ['laptop'] },
  { id: 'lenovo', name: 'Lenovo', color: '#e2231a', categories: ['laptop', 'tablet'] },
  { id: 'asus', name: 'ASUS', color: '#00539b', categories: ['laptop'] },
  { id: 'acer', name: 'Acer', color: '#83b81a', categories: ['laptop'] },
  { id: 'microsoft', name: 'Microsoft', color: '#737373', categories: ['laptop', 'console'] },
  { id: 'garmin', name: 'Garmin', color: '#007cc3', categories: ['smartwatch'] },
  { id: 'noise', name: 'Noise', color: '#e11d48', categories: ['smartwatch'] },
  { id: 'boat', name: 'boAt', color: '#e21e26', categories: ['smartwatch', 'earbuds'] },
  { id: 'fitbit', name: 'Fitbit', color: '#00b0b9', categories: ['smartwatch'] },
  { id: 'sony', name: 'Sony', color: '#000000', categories: ['earbuds', 'console', 'camera'] },
  { id: 'bose', name: 'Bose', color: '#222222', categories: ['earbuds'] },
  { id: 'nintendo', name: 'Nintendo', color: '#e4000f', categories: ['console'] },
  { id: 'canon', name: 'Canon', color: '#bc0024', categories: ['camera'] },
  { id: 'nikon', name: 'Nikon', color: '#ffe100', categories: ['camera'] },
  { id: 'fujifilm', name: 'Fujifilm', color: '#00a651', categories: ['camera'] },
  { id: 'gopro', name: 'GoPro', color: '#00aeef', categories: ['camera'] },
]

export const BRAND_MAP = Object.fromEntries(BRANDS.map((b) => [b.id, b])) as Record<string, Brand>

export const brandsForCategory = (category: CategoryId) =>
  BRANDS.filter((b) => b.categories.includes(category))

export const CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Kochi',
]
