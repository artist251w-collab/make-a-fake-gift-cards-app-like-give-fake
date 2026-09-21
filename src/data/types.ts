export type CategoryId =
  | 'mobile'
  | 'laptop'
  | 'tablet'
  | 'smartwatch'
  | 'earbuds'
  | 'console'
  | 'camera'

export interface Category {
  id: CategoryId
  name: string
  short: string
  tagline: string
  /** Label used for the second "core check" question in the sell flow */
  coreCheck: string
  /** Label of the storage/RAM style variant */
  variantLabel: string
  /** Functional issues that can be selected while selling this category */
  issues: Issue[]
}

export interface Issue {
  id: string
  label: string
  /** deduction as a fraction of the base price */
  deduct: number
}

export interface Brand {
  id: string
  name: string
  /** hex color used for the brand mark */
  color: string
  categories: CategoryId[]
}

export interface Variant {
  id: string
  label: string
  /** absolute price adjustment (INR) on top of the base price */
  adj: number
}

export interface DeviceModel {
  id: string
  brandId: string
  category: CategoryId
  name: string
  /** best-case resale price for the base variant (INR) */
  basePrice: number
  variants: Variant[]
  year: number
  /** hex color used for the device artwork */
  color: string
}

export type Grade = 'Superb' | 'Good' | 'Fair'

export interface Product {
  id: string
  name: string
  brandId: string
  category: CategoryId
  variant: string
  color: string
  colorName: string
  grade: Grade
  price: number
  mrp: number
  rating: number
  reviews: number
  highlights: string[]
  specs: Record<string, string>
  stock: number
  badge?: 'Bestseller' | 'Deal of the day' | 'Limited stock' | 'New arrival'
  warrantyMonths: number
}

export type ScreenCondition = 'flawless' | 'minor' | 'heavy' | 'cracked'
export type BodyCondition = 'flawless' | 'minor' | 'major' | 'broken'
export type DeviceAge = 'lt3' | '3to6' | '6to11' | 'gt11'
export type Accessory = 'box' | 'charger' | 'bill'

export interface ConditionAnswers {
  variantId: string
  powersOn: boolean | null
  corePass: boolean | null
  screen: ScreenCondition | null
  body: BodyCondition | null
  issues: string[]
  accessories: Accessory[]
  age: DeviceAge | null
}

export interface QuoteLine {
  label: string
  amount: number
  kind: 'base' | 'plus' | 'minus'
}

export interface Quote {
  price: number
  base: number
  lines: QuoteLine[]
  gradeLabel: string
}

export interface Address {
  name: string
  phone: string
  email: string
  line1: string
  city: string
  pincode: string
}

export interface SellOrder {
  id: string
  type: 'sell'
  createdAt: string
  modelId: string
  modelName: string
  brandName: string
  category: CategoryId
  variantLabel: string
  price: number
  quoteLines: QuoteLine[]
  address: Address
  pickupDate: string
  pickupSlot: string
  payment: 'upi' | 'bank' | 'wallet'
  paymentDetail: string
  status: 'Pickup scheduled' | 'Picked up' | 'Payment done' | 'Cancelled'
}

export interface CartItem {
  productId: string
  qty: number
}

export interface BuyOrder {
  id: string
  type: 'buy'
  createdAt: string
  items: { productId: string; name: string; variant: string; price: number; qty: number; grade: Grade }[]
  subtotal: number
  discount: number
  delivery: number
  total: number
  address: Address
  payment: 'upi' | 'card' | 'cod'
  status: 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  eta: string
}

export interface RepairOrder {
  id: string
  type: 'repair'
  createdAt: string
  category: CategoryId
  brandName: string
  modelName: string
  service: string
  price: number
  address: Address
  pickupDate: string
  pickupSlot: string
  status: 'Technician assigned' | 'In repair' | 'Completed' | 'Cancelled'
}

export type AnyOrder = SellOrder | BuyOrder | RepairOrder
