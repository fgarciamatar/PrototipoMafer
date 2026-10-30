import { useEffect } from 'react';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Header, Footer, CartDrawer, Toasts } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import { Cart, Favorites } from './pages/ShopPages.jsx';
import Auth from './pages/Auth.jsx';
import Account from './pages/Account.jsx';
import Checkout, { OrderConfirmation } from './pages/Checkout.jsx';
import { AdminLayout, Dashboard, AdminProducts, AdminOffers, AdminOrders, AdminSettings } from './admin/Admin.jsx';

function ShopLayout() {
  return (
    <>
      <Header />
      <main className="site-main"><Outlet /></main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido/:id" element={<OrderConfirmation />} />
          <Route path="/ingresar" element={<Auth />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="*" element={<div className="container section empty"><h2>Página no encontrada</h2><Link to="/" className="btn btn-primary">Volver al inicio</Link></div>} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="ofertas" element={<AdminOffers />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="config" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toasts />
    </>
  );
}
