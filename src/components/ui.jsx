import { useState } from 'react';
import {
  Battery, Bike, Construction, Disc3, Drill, Droplets, Flame, Gauge, Hammer, HardHat, Lightbulb,
  PaintRoller, Shovel, Sprout, Tent, Wrench, Zap, Heart, ShoppingCart, Star, Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoDark from '../assets/logo-dark.webp';
import logoLight from '../assets/logo-light.webp';
import { useStore } from '../context/StoreContext.jsx';
import { finalPrice, money } from '../utils.js';

export const ICONS = {
  drill: Drill, hammer: Hammer, zap: Zap, droplets: Droplets, construction: Construction, sprout: Sprout,
  bike: Bike, tent: Tent, 'disc-3': Disc3, 'paint-roller': PaintRoller, wrench: Wrench, shovel: Shovel,
  lightbulb: Lightbulb, flame: Flame, battery: Battery, gauge: Gauge, 'hard-hat': HardHat, package: Package,
};

// Logo oficial de Mafer: versión con letras claras (fondo oscuro) y oscuras (fondo claro).
export function LogoImg({ variant, className = '' }) {
  // variant: 'auto' sigue el tema; 'dark' fuerza la versión para fondos oscuros.
  if (variant === 'dark') return <img src={logoDark} alt="Mafer Ferretería Industrial" className={`logo-img ${className}`} />;
  return (
    <>
      <img src={logoDark} alt="Mafer Ferretería Industrial" className={`logo-img logo-on-dark ${className}`} />
      <img src={logoLight} alt="" aria-hidden="true" className={`logo-img logo-on-light ${className}`} />
    </>
  );
}

export function Logo({ variant = 'auto' }) {
  return (
    <Link to="/" className="logo" aria-label="Mafer Ferretería — inicio">
      <LogoImg variant={variant} />
    </Link>
  );
}

export function ProductImage({ product, index = 0, className = '' }) {
  const src = product.images?.[index];
  const [failed, setFailed] = useState(null);
  // Si la foto no carga, se muestra el ícono del rubro en lugar de una imagen rota.
  if (src && failed !== src)
    return <img className={`pimg ${className}`} src={src} alt={product.name} loading="lazy" onError={() => setFailed(src)} />;
  const Icon = ICONS[product.art] || Package;
  return (
    <div className={`pimg pimg-art ${className}`} aria-label={product.name} role="img">
      <div className="pimg-glow" />
      <Icon strokeWidth={1.25} />
      <span className="pimg-brand">{product.brand}</span>
    </div>
  );
}

export function Stars({ value = 0, count }) {
  return (
    <span className="stars" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= Math.round(value) ? 'on' : ''} />
      ))}
      {count != null && <small>({count})</small>}
    </span>
  );
}

export function ProductCard({ product }) {
  const { addToCart, toggleFav, isFav, settings } = useStore();
  const fp = finalPrice(product);
  const fav = isFav(product.id);
  const out = product.stock <= 0;
  return (
    <article className="pcard">
      <Link to={`/producto/${product.id}`} className="pcard-media">
        <ProductImage product={product} />
        <div className="pcard-badges">
          {product.discount > 0 && <span className="badge badge-brand">{product.discount}% OFF</span>}
          {out ? <span className="badge badge-muted">Sin stock</span> : product.stock <= 3 && <span className="badge badge-warn">{product.stock === 1 ? "¡Última unidad!" : `¡Últimas ${product.stock}!`}</span>}
        </div>
      </Link>
      <button className={`fav-btn ${fav ? 'on' : ''}`} onClick={() => toggleFav(product.id)} aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
        <Heart size={18} />
      </button>
      <div className="pcard-body">
        <span className="pcard-brand">{product.brand}</span>
        <Link to={`/producto/${product.id}`} className="pcard-title">{product.name}</Link>
        <div className="pcard-price">
          {product.discount > 0 && <s>{money(product.price)}</s>}
          <strong>{money(fp)}</strong>
          <span className="muted small">{settings.installments} cuotas sin interés de {money(fp / settings.installments)}</span>
        </div>
        <button className="btn btn-primary btn-block" disabled={out} onClick={() => addToCart(product.id)}>
          <ShoppingCart size={16} /> {out ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}

export function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon size={34} /></div>
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}

export function QtyInput({ value, onChange, max = 99 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Restar">−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Sumar">+</button>
    </div>
  );
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
