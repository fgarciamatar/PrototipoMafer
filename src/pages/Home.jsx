import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Truck, CreditCard, Landmark, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { BRANDS, CATEGORIES } from '../data/products.js';
import { ICONS, ProductCard, ProductImage } from '../components/ui.jsx';
import { finalPrice, money } from '../utils.js';

export default function Home() {
  const { products, settings } = useStore();
  const active = products.filter((p) => p.active);
  const offers = active.filter((p) => p.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 8);
  // Destacados primero, completados con otros productos para llenar dos filas.
  const featured = [...active.filter((p) => p.featured), ...active.filter((p) => !p.featured)].slice(0, 10);
  const hero = active.find((p) => p.featured && p.images?.length) || active[0];

  return (
    <>
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><BadgePercent size={16} /> Semana de la herramienta · hasta 20% OFF</span>
            <h1>Soluciones para <span className="accent">cada proyecto</span></h1>
            <p>Herramientas eléctricas, construcción y hogar de las mejores marcas. Comprá online y recibí con Andreani o retirá en nuestras sucursales de Tucumán.</p>
            <div className="hero-cta">
              <Link to="/productos?oferta=1" className="btn btn-primary btn-lg">Ver ofertas <ArrowRight size={18} /></Link>
              <Link to="/productos" className="btn btn-outline btn-lg">Explorar catálogo</Link>
            </div>
            <div className="hero-stats">
              <div><b>+2.500</b><small>clientes</small></div>
              <div><b>2</b><small>sucursales</small></div>
              <div><b>{settings.installments}</b><small>cuotas sin interés</small></div>
            </div>
          </div>
          {hero && (
            <Link to={`/producto/${hero.id}`} className="hero-card">
              {hero.discount > 0 ? <span className="badge badge-brand">{hero.discount}% OFF</span> : <span className="badge badge-brand">Nuevo</span>}
              <ProductImage product={hero} />
              <div className="hero-card-info">
                <small>{hero.brand}</small>
                <b>{hero.name}</b>
                <div>{hero.discount > 0 && <s className="muted">{money(hero.price)}</s>} <strong>{money(finalPrice(hero))}</strong></div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="container section">
        <div className="perks">
          <div><Truck /><span><b>Envío gratis</b> desde {money(settings.freeShippingFrom)}</span></div>
          <div><CreditCard /><span><b>{settings.installments} cuotas</b> sin interés con Mercado Pago</span></div>
          <div><Landmark /><span><b>{settings.transferDiscount}% OFF</b> pagando por transferencia</span></div>
          <div><MapPin /><span><b>Retiro gratis</b> en Concepción y J.B. Alberdi</span></div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head"><h2>Categorías</h2><Link to="/productos" className="link">Ver todo <ArrowRight size={16} /></Link></div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon];
            const count = active.filter((p) => p.category === c.id).length;
            return (
              <Link key={c.id} to={`/productos?cat=${c.id}`} className="cat-tile">
                <span className="cat-ring"><Icon size={26} /></span>
                <b>{c.name}</b>
                <small className="muted">{count} productos</small>
              </Link>
            );
          })}
        </div>
      </section>

      {offers.length > 0 && (
        <section className="container section">
          <div className="section-head"><h2><span className="accent">Ofertas</span> imperdibles</h2><Link to="/productos?oferta=1" className="link">Ver todas <ArrowRight size={16} /></Link></div>
          <div className="scroller">{offers.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <section className="container section">
        <div className="promo-banner">
          <div>
            <h3>¿Comprás para tu obra o empresa?</h3>
            <p>Pedí presupuesto mayorista y aprovechá precios especiales por volumen.</p>
          </div>
          <a className="btn btn-dark btn-lg" href="#/productos">Pedir presupuesto</a>
        </div>
      </section>

      <section className="container section">
        <div className="section-head"><h2>Destacados</h2></div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="container section">
        <div className="section-head"><h2>Marcas oficiales</h2></div>
        <div className="brands">
          {BRANDS.map((b) => <Link key={b} to={`/productos?marca=${b}`} className="brand-chip">{b}</Link>)}
        </div>
      </section>
    </>
  );
}
