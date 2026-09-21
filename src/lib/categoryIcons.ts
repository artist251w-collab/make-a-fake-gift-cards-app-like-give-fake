import { Camera, Gamepad2, Headphones, Laptop, Smartphone, Tablet, Watch } from 'lucide-react'
import type { CategoryId } from '../data/types'

export const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  mobile: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  smartwatch: Watch,
  earbuds: Headphones,
  console: Gamepad2,
  camera: Camera,
}
