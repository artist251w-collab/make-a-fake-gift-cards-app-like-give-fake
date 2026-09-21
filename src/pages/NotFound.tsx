import { Link } from 'react-router-dom'
import { Recycle } from 'lucide-react'
import DeviceArt from '../components/DeviceArt'

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <DeviceArt category="mobile" color="#94a3b8" className="h-40 w-40 opacity-70" />
      <h1 className="mt-4 text-3xl font-extrabold text-ink-900">Page not found</h1>
      <p className="mt-2 flex items-center gap-1.5 text-slate-500">The page you're looking for has been recycled <Recycle className="h-4 w-4 text-brand-600" /></p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/sell" className="btn-secondary">Sell a device</Link>
      </div>
    </div>
  )
}
