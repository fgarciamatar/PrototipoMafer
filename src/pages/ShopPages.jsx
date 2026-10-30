import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Empty, ProductCard, ProductImage, QtyInput } from '../components/ui.jsx';
import { finalPrice, money } from '../utils.js';

export function Favorites() {
  const { favorites, byId } = useStore();
  const list = favorites.map((id) => byId[id]).filter((p) => p && p.active);
  return (
    <div className="container section">
      <h1 className="page-title">Mis favoritos</h1>
      {list.length === 0 ? (
        <Empty icon={Heart} title="Todavía no guardaste favoritos" text="Tocá el corazón en cualquier producto para guardarlo acá."
          action={<Link className="btn btn-primary" to="/productos">Explorar productos</Link>} />
      ) : (
        <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}

export function Cart() {
  const { cartItems, cartSubtotal, setQty, removeFromCart, settings, toggleFav, isFav } = useStore();
  const nav = useNavigate();
  const savings = cartItems.reduce((s, c) => s + (c.product.price - finalPrice(c.product)) * c.qty, 0);

  if (!cartItems.length)
    return <div className="container section"><Empty icon={ShoppingCart} title="Tu carrito está vacío" action={<Link className="btn btn-primary" to="/productos">Ver productos</Link>} /></div>;

  return (
    <div className="container section">
      <h1 className="page-title">Carrito</h1>
      <div className="two-col">
        <div className="card list-card">
          {cartItems.map(({ id, qty, product }) => (
            <div className="cart-row" key={id}>
              <Link to={`/producto/${id}`}><ProductImage product={product} className="thumb-lg" /></Link>
              <div className="grow">
                <small className="pcard-brand">{product.brand}</small>
                <Link to={`/producto/${id}`} className="cart-row-title">{product.name}</Link>
                <div className="row-gap small">
                  <button className="link" onClick={() => removeFromCart(id)}><Trash2 size={14} /> Eliminar</button>
                  <button className="link" onClick={() => toggleFav(id)}><Heart size={14} /> {isFav(id) ? 'En favoritos' : 'Guardar'}</button>
                </div>
              </div>
              <QtyInput value={qty} max={product.stock} onChange={(v) => setQty(id, v)} />
              <div className="cart-row-price">
                {product.discount > 0 && <s className="muted small">{money(product.price * qty)}</s>}
                <b>{money(finalPrice(product) * qty)}</b>
              </div>
            </div>
          ))}
        </div>
        <aside className="card summary">
          <h3>Resumen</h3>
          <div className="row-between"><span>Productos</span><span>{money(cartSubtotal + savings)}</span></div>
          {savings > 0 && <div className="row-between text-ok"><span>Descuentos</span><span>−{money(savings)}</span></div>}
          <div className="row-between"><span>Envío</span><span className="muted">{cartSubtotal >= settings.freeShippingFrom ? 'Gratis' : 'Se calcula en el checkout'}</span></div>
          <hr />
          <div className="row-between"><b>Total</b><b className="big">{money(cartSubtotal)}</b></div>
          <small className="muted">Por transferencia: <b>{money(cartSubtotal * (1 - settings.transferDiscount / 100))}</b></small>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => nav('/checkout')}>Continuar compra</button>
          <Link to="/productos" className="btn btn-ghost btn-block">Seguir comprando</Link>
          <p className="small muted"><Truck size={14} /> Envío gratis con Andreani en compras desde {money(settings.freeShippingFrom)}</p>
        </aside>
      </div>
    </div>
  );
}
