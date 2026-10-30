import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, MapPin, ShieldCheck, Landmark, CreditCard, ChevronRight, PackageX } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { CATEGORIES } from '../data/products.js';
import { Empty, ProductCard, ProductImage, QtyInput, Stars } from '../components/ui.jsx';
import { finalPrice, money, quoteAndreani } from '../utils.js';

export default function ProductDetail() {
  const { id } = useParams();
  const { byId, products, addToCart, toggleFav, isFav, settings } = useStore();
  const nav = useNavigate();
  const p = byId[id];
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [cp, setCp] = useState('');
  const [quote, setQuote] = useState(null);

  if (!p || !p.active)
    return <div className="container section"><Empty icon={PackageX} title="Producto no disponible" action={<Link to="/productos" className="btn btn-primary">Ver catálogo</Link>} /></div>;

  const fp = finalPrice(p);
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const related = products.filter((x) => x.active && x.category === p.category && x.id !== p.id).slice(0, 4);
  const imgs = p.images?.length ? p.images : [null];
  const freeShip = fp * qty >= settings.freeShippingFrom;

  const calc = (e) => {
    e.preventDefault();
    setQuote(quoteAndreani(cp, (p.weight || 1) * qty) || 'error');
  };

  return (
    <div className="container section">
      <nav className="crumbs small">
        <Link to="/">Inicio</Link><ChevronRight size={14} />
        <Link to={`/productos?cat=${p.category}`}>{cat?.name}</Link><ChevronRight size={14} />
        <span className="muted">{p.name}</span>
      </nav>

      <div className="pdp">
        <div className="gallery">
          <div className="gallery-main">
            {p.discount > 0 && <span className="badge badge-brand badge-float">{p.discount}% OFF</span>}
            <ProductImage product={p} index={img} />
          </div>
          {imgs.length > 1 && (
            <div className="gallery-thumbs">
              {imgs.map((_, i) => (
                <button key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Imagen ${i + 1}`}>
                  <ProductImage product={p} index={i} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <span className="pcard-brand">{p.brand} · SKU {p.sku}</span>
          <h1>{p.name}</h1>
          <Stars value={p.rating} count={p.reviews} />

          <div className="pdp-price">
            {p.discount > 0 && <s className="muted">{money(p.price)}</s>}
            <div className="row-gap"><strong>{money(fp)}</strong>{p.discount > 0 && <span className="badge badge-ok">Ahorrás {money(p.price - fp)}</span>}</div>
            <div className="pay-hints">
              <span><CreditCard size={16} /> <b>{settings.installments} cuotas sin interés</b> de {money(fp / settings.installments)}</span>
              <span><Landmark size={16} /> <b>{money(fp * (1 - settings.transferDiscount / 100))}</b> por transferencia ({settings.transferDiscount}% OFF)</span>
            </div>
          </div>

          <div className={`stock ${p.stock > 3 ? 'ok' : p.stock > 0 ? 'low' : 'out'}`}>
            {p.stock > 3 ? `Stock disponible (${p.stock} u.)` : p.stock > 0 ? `¡Quedan solo ${p.stock}!` : 'Sin stock'}
          </div>

          <div className="buy-row">
            <QtyInput value={qty} max={p.stock} onChange={(v) => setQty(Math.max(1, v))} />
            <button className="btn btn-primary btn-lg grow" disabled={p.stock <= 0} onClick={() => addToCart(p.id, qty)}>
              <ShoppingCart size={18} /> Agregar al carrito
            </button>
            <button className={`btn btn-outline btn-lg fav-lg ${isFav(p.id) ? 'on' : ''}`} onClick={() => toggleFav(p.id)} aria-label="Favorito">
              <Heart size={18} />
            </button>
          </div>
          <button className="btn btn-dark btn-block btn-lg" disabled={p.stock <= 0} onClick={() => { addToCart(p.id, qty, { open: false }); nav('/checkout'); }}>
            Comprar ahora
          </button>

          <div className="ship-box">
            <div className="ship-box-head"><Truck size={18} /> <b>Calculá el envío con Andreani</b></div>
            <form onSubmit={calc} className="row-gap">
              <input className="input" inputMode="numeric" maxLength={4} placeholder="Código postal (ej: 4146)" value={cp} onChange={(e) => setCp(e.target.value.replace(/\D/g, ''))} />
              <button className="btn btn-outline" type="submit">Calcular</button>
            </form>
            {quote === 'error' && <small className="text-danger">Ingresá un código postal válido de 4 dígitos.</small>}
            {quote && quote !== 'error' && (
              <div className="ship-options">
                <div><span>Andreani a domicilio <small className="muted">· {quote.home.days} días hábiles</small></span><b>{freeShip ? 'Gratis' : money(quote.home.cost)}</b></div>
                <div><span>Andreani a sucursal <small className="muted">· {quote.branch.days} días hábiles</small></span><b>{freeShip ? 'Gratis' : money(quote.branch.cost)}</b></div>
              </div>
            )}
            <div className="ship-options">
              {settings.stores.map((s) => (
                <div key={s.id}><span><MapPin size={14} /> Retiro en {s.name}</span><b className="text-ok">Gratis</b></div>
              ))}
            </div>
          </div>
          <p className="small muted"><ShieldCheck size={14} /> Garantía oficial {p.brand}. Factura A y B.</p>
        </div>
      </div>

      <div className="pdp-details">
        <div className="card">
          <h3>Descripción</h3>
          <p>{p.description}</p>
        </div>
        {p.specs && Object.keys(p.specs).length > 0 && (
          <div className="card">
            <h3>Especificaciones</h3>
            <table className="specs"><tbody>
              {Object.entries(p.specs).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
            </tbody></table>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>También te puede interesar</h2></div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
