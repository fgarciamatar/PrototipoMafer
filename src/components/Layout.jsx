import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart, ShoppingCart, User, Search, Sun, Moon, Menu, X, MapPin, Clock, Phone, Instagram,
  Truck, CreditCard, Landmark, ShieldCheck, LogOut, LayoutDashboard, Trash2, Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { CATEGORIES } from '../data/products.js';
import { finalPrice, money } from '../utils.js';
import { Empty, Logo, ProductImage, QtyInput } from './ui.jsx';

export function Header() {
  const { cartCount, favorites, user, theme, toggleTheme, setCartOpen, logout } = useStore();
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    setMenu(false);
    setUserMenu(false);
  }, [loc.pathname, loc.search]);

  const submit = (e) => {
    e.preventDefault();
    nav(`/productos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Truck size={14} /> Envíos a todo el país con <b>Andreani</b></span>
          <span className="hide-sm"><CreditCard size={14} /> 3 cuotas sin interés con <b>Mercado Pago</b></span>
          <span className="hide-sm"><Landmark size={14} /> 10% OFF pagando por transferencia</span>
        </div>
      </div>
      <div className="container header-main">
        <button className="icon-btn show-md" onClick={() => setMenu(true)} aria-label="Abrir menú"><Menu /></button>
        <Logo />
        <form className="search" onSubmit={submit} role="search">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscá taladros, generadores, marcas…" aria-label="Buscar productos" />
          <button className="btn btn-primary btn-sm" type="submit">Buscar</button>
        </form>
        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Cambiar tema" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/favoritos" className="icon-btn" aria-label="Favoritos">
            <Heart size={20} />
            {favorites.length > 0 && <span className="dot">{favorites.length}</span>}
          </Link>
          <div className="user-wrap">
            {user ? (
              <button className="icon-btn user-btn" onClick={() => setUserMenu((v) => !v)} aria-label="Mi cuenta">
                <span className="avatar">{user.name[0]}</span>
                <span className="hide-sm">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <Link to="/ingresar" className="icon-btn user-btn" aria-label="Ingresar">
                <User size={20} /> <span className="hide-sm">Ingresar</span>
              </Link>
            )}
            {userMenu && user && (
              <div className="dropdown">
                <div className="dropdown-head"><b>{user.name}</b><small className="muted">{user.email}</small></div>
                {user.role === 'admin' && <Link to="/admin"><LayoutDashboard size={16} /> Panel de administración</Link>}
                <Link to="/cuenta"><Package size={16} /> Mis pedidos</Link>
                <Link to="/favoritos"><Heart size={16} /> Favoritos</Link>
                <button onClick={logout}><LogOut size={16} /> Cerrar sesión</button>
              </div>
            )}
          </div>
          <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)} aria-label="Carrito">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="dot">{cartCount}</span>}
          </button>
        </div>
      </div>
      <nav className="catnav">
        <div className="container catnav-inner">
          {[['', 'Todos'], ['oferta=1', 'Ofertas', 'hot'], ...CATEGORIES.map((c) => [`cat=${c.id}`, c.name])].map(([qs, label, cls]) => {
            const on = loc.pathname === '/productos' && loc.search.replace(/^\?/, '') === qs;
            return <Link key={label} to={`/productos${qs ? `?${qs}` : ''}`} className={`${cls || ''} ${on ? 'active' : ''}`}>{label}</Link>;
          })}
        </div>
      </nav>

      {/* El menú se monta en <body>: dentro de la cabecera (que usa backdrop-filter) quedaría recortado. */}
      {menu && createPortal(

        <div className="drawer-backdrop" onClick={() => setMenu(false)}>
          <aside className="drawer drawer-left" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head"><Logo /><button className="icon-btn" onClick={() => setMenu(false)} aria-label="Cerrar"><X /></button></div>
            <div className="drawer-links">
              <Link to="/productos">Todos los productos</Link>
              <Link to="/productos?oferta=1" className="hot">Ofertas</Link>
              {CATEGORIES.map((c) => <Link key={c.id} to={`/productos?cat=${c.id}`}>{c.name}</Link>)}
              <hr />
              {user ? <Link to="/cuenta">Mi cuenta</Link> : <Link to="/ingresar">Ingresar / Registrarme</Link>}
              {user?.role === 'admin' && <Link to="/admin">Panel de administración</Link>}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartSubtotal, setQty, removeFromCart, settings } = useStore();
  const nav = useNavigate();
  if (!cartOpen) return null;
  const missing = settings.freeShippingFrom - cartSubtotal;
  const pct = Math.min(100, (cartSubtotal / settings.freeShippingFrom) * 100);
  const go = (to) => { setCartOpen(false); nav(to); };

  return (
    <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Carrito">
        <div className="drawer-head">
          <h3>Tu carrito</h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Cerrar"><X /></button>
        </div>
        {cartItems.length === 0 ? (
          <Empty icon={ShoppingCart} title="Tu carrito está vacío" text="Sumá herramientas y equipos para tu próximo proyecto."
            action={<button className="btn btn-primary" onClick={() => go('/productos')}>Ver productos</button>} />
        ) : (
          <>
            <div className="ship-progress">
              {missing > 0 ? <span>Te faltan <b>{money(missing)}</b> para el <b>envío gratis</b></span> : <span><Truck size={15} /> ¡Tenés <b>envío gratis</b> con Andreani!</span>}
              <div className="bar"><div style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="drawer-items">
              {cartItems.map(({ id, qty, product }) => (
                <div className="cart-line" key={id}>
                  <ProductImage product={product} className="thumb" />
                  <div className="cart-line-info">
                    <span className="small">{product.name}</span>
                    <b>{money(finalPrice(product) * qty)}</b>
                    <div className="row-between">
                      <QtyInput value={qty} max={product.stock} onChange={(v) => setQty(id, v)} />
                      <button className="icon-btn sm" onClick={() => removeFromCart(id)} aria-label="Quitar"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="row-between"><span>Subtotal</span><b className="big">{money(cartSubtotal)}</b></div>
              <small className="muted">o {money(cartSubtotal * (1 - settings.transferDiscount / 100))} por transferencia</small>
              <button className="btn btn-primary btn-block btn-lg" onClick={() => go('/checkout')}>Iniciar compra</button>
              <button className="btn btn-ghost btn-block" onClick={() => go('/carrito')}>Ver carrito completo</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.msg}</div>)}
    </div>
  );
}

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="site-footer">
      <div className="container trust">
        <div><Truck /><div><b>Envíos con Andreani</b><small>A domicilio o sucursal en todo el país</small></div></div>
        <div><CreditCard /><div><b>Mercado Pago</b><small>Tarjetas, débito y cuotas sin interés</small></div></div>
        <div><Landmark /><div><b>Transferencia</b><small>{settings.transferDiscount}% de descuento extra</small></div></div>
        <div><ShieldCheck /><div><b>Compra protegida</b><small>Garantía oficial de cada marca</small></div></div>
      </div>
      <div className="container footer-grid">
        <div>
          <Logo variant="dark" />
          <p className="muted small" style={{ marginTop: 12 }}>Soluciones para cada proyecto. Herramientas, construcción y hogar.</p>
        </div>
        <div>
          <h4>Sucursales</h4>
          {settings.stores.map((s) => <p key={s.id} className="small"><MapPin size={14} /> {s.address}</p>)}
        </div>
        <div>
          <h4>Horarios</h4>
          <p className="small"><Clock size={14} /> Lun a Vie 8:00–13:00 / 16:30–20:30</p>
          <p className="small"><Clock size={14} /> Sáb 8:30–13:00</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <p className="small"><Phone size={14} /> 3865 000000</p>
          <p className="small"><Instagram size={14} /> @mafer_ferreteria</p>
        </div>
      </div>
      <div className="container footer-bottom small muted">© {new Date().getFullYear()} Mafer Ferretería Industrial · Prototipo</div>
    </footer>
  );
}
