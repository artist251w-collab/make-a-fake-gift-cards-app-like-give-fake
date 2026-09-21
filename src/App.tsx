import { Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SellCategories from './pages/SellCategories'
import SellBrands from './pages/SellBrands'
import SellModels from './pages/SellModels'
import SellQuote from './pages/SellQuote'
import Buy from './pages/Buy'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Repair from './pages/Repair'
import NotFound from './pages/NotFound'

/** Re-mount wizard/detail pages when the URL param changes so per-page state never leaks between items. */
function Keyed({ param, children }: { param: string; children: (key: string) => React.ReactNode }) {
  const params = useParams()
  return <>{children(params[param] ?? '')}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<SellCategories />} />
        <Route path="/sell/:category" element={<SellBrands />} />
        <Route path="/sell/:category/:brandId" element={<SellModels />} />
        <Route path="/sell/:category/:brandId/:modelId" element={<Keyed param="modelId">{(k) => <SellQuote key={k} />}</Keyed>} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/product/:id" element={<Keyed param="id">{(k) => <ProductDetail key={k} />}</Keyed>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/repair" element={<Repair />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
