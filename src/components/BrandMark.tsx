import { BRAND_MAP } from '../data/categories'
import { cx } from '../lib/format'

interface Props {
  brandId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-xl',
}

/** Renders a brand "logo" as a coloured monogram badge. */
export default function BrandMark({ brandId, size = 'md', className }: Props) {
  const brand = BRAND_MAP[brandId]
  if (!brand) return null
  const initials = brand.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase()
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-2xl font-extrabold tracking-tight text-white shadow-inner',
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${brand.color}, ${brand.color}cc)`,
        textShadow: '0 1px 1px rgba(0,0,0,0.25)',
      }}
      aria-label={brand.name}
    >
      {initials}
    </span>
  )
}
