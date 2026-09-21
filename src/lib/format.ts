const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatINR = (amount: number) => inr.format(Math.round(amount))

export const formatCompactINR = (amount: number) => {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1).replace(/\.0$/, '')} Cr`
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(1).replace(/\.0$/, '')} L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return formatINR(amount)
}

export const percentOff = (price: number, mrp: number) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export const generateOrderId = (prefix: string) => {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5)
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `${prefix}-${stamp}${rand}`
}

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

/** Returns the next `count` dates (as ISO yyyy-mm-dd) starting tomorrow */
export const upcomingDates = (count = 5) => {
  const out: { iso: string; label: string; weekday: string }[] = []
  const d = new Date()
  for (let i = 1; i <= count; i++) {
    const day = new Date(d)
    day.setDate(d.getDate() + i)
    out.push({
      iso: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      weekday: i === 1 ? 'Tomorrow' : day.toLocaleDateString('en-IN', { weekday: 'short' }),
    })
  }
  return out
}

export const PICKUP_SLOTS = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM', '6 PM – 9 PM']
