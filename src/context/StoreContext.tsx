import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AnyOrder, CartItem } from '../data/types'
import { PRODUCT_MAP } from '../data/products'

export interface User {
  name: string
  phone: string
}

interface Toast {
  id: number
  message: string
  tone: 'success' | 'info' | 'error'
}

interface StoreValue {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (productId: string, qty?: number) => void
  removeFromCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void
  orders: AnyOrder[]
  addOrder: (order: AnyOrder) => void
  cancelOrder: (id: string) => void
  user: User | null
  login: (user: User) => void
  logout: () => void
  city: string
  setCity: (city: string) => void
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  toasts: Toast[]
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const StoreContext = createContext<StoreValue | null>(null)

const KEYS = {
  cart: 'recart.cart',
  orders: 'recart.orders',
  user: 'recart.user',
  city: 'recart.city',
  wishlist: 'recart.wishlist',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota errors */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistentState<CartItem[]>(KEYS.cart, [])
  const [orders, setOrders] = usePersistentState<AnyOrder[]>(KEYS.orders, [])
  const [user, setUser] = usePersistentState<User | null>(KEYS.user, null)
  const [city, setCity] = usePersistentState<string>(KEYS.city, 'Bengaluru')
  const [wishlist, setWishlist] = usePersistentState<string[]>(KEYS.wishlist, [])
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, message, tone }])
      window.setTimeout(() => dismissToast(id), 3200)
    },
    [dismissToast],
  )

  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((c) => {
        const existing = c.find((i) => i.productId === productId)
        const stock = PRODUCT_MAP[productId]?.stock ?? 99
        if (existing) {
          return c.map((i) =>
            i.productId === productId ? { ...i, qty: Math.min(stock, i.qty + qty) } : i,
          )
        }
        return [...c, { productId, qty: Math.min(stock, qty) }]
      })
    },
    [setCart],
  )

  const removeFromCart = useCallback(
    (productId: string) => setCart((c) => c.filter((i) => i.productId !== productId)),
    [setCart],
  )

  const setQty = useCallback(
    (productId: string, qty: number) => {
      setCart((c) =>
        qty <= 0
          ? c.filter((i) => i.productId !== productId)
          : c.map((i) => (i.productId === productId ? { ...i, qty } : i)),
      )
    },
    [setCart],
  )

  const clearCart = useCallback(() => setCart([]), [setCart])

  const addOrder = useCallback((order: AnyOrder) => setOrders((o) => [order, ...o]), [setOrders])

  const cancelOrder = useCallback(
    (id: string) =>
      setOrders((o) => o.map((ord) => (ord.id === id ? ({ ...ord, status: 'Cancelled' } as AnyOrder) : ord))),
    [setOrders],
  )

  const toggleWishlist = useCallback(
    (productId: string) =>
      setWishlist((w) => (w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId])),
    [setWishlist],
  )

  const login = useCallback((u: User) => setUser(u), [setUser])
  const logout = useCallback(() => setUser(null), [setUser])

  const { cartCount, cartTotal } = useMemo(() => {
    let count = 0
    let total = 0
    for (const item of cart) {
      const product = PRODUCT_MAP[item.productId]
      if (!product) continue
      count += item.qty
      total += product.price * item.qty
    }
    return { cartCount: count, cartTotal: total }
  }, [cart])

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      orders,
      addOrder,
      cancelOrder,
      user,
      login,
      logout,
      city,
      setCity,
      wishlist,
      toggleWishlist,
      toasts,
      toast,
      dismissToast,
    }),
    [
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      orders,
      addOrder,
      cancelOrder,
      user,
      login,
      logout,
      city,
      setCity,
      wishlist,
      toggleWishlist,
      toasts,
      toast,
      dismissToast,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
