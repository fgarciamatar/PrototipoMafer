import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, SearchX, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { BRANDS, CATEGORIES } from '../data/products.js';
import { Empty, ProductCard } from '../components/ui.jsx';
import { finalPrice } from '../utils.js';

const SORTS = {
  relevantes: { label: 'Más relevantes', fn: (a, b) => Number(b.featured) - Number(a.featured) },
  menor: { label: 'Menor precio', fn: (a, b) => finalPrice(a) - finalPrice(b) },
  mayor: { label: 'Mayor precio', fn: (a, b) => finalPrice(b) - finalPrice(a) },
  descuento: { label: 'Mayor descuento', fn: (a, b) => b.discount - a.discount },
  nombre: { label: 'Nombre A-Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export default function Catalog() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const cat = params.get('cat') || '';
  const brand = params.get('marca') || '';
  const q = params.get('q') || '';
  const offer = params.get('oferta') === '1';
  const sort = params.get('orden') || 'relevantes';
  const min = Number(params.get('min')) || 0;
  const max = Number(params.get('max')) || 0;
  const inStock = params.get('stock') === '1';

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (v === '' || v === false || v == null) next.delete(k);
    else next.set(k, v === true ? '1' : v);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.toLowerCase();
    return products
      .filter((p) => p.active)
      .filter((p) => !cat || p.category === cat)
      .filter((p) => !brand || p.brand === brand)
      .filter((p) => !offer || p.discount > 0)
      .filter((p) => !inStock || p.stock > 0)
      .filter((p) => !min || finalPrice(p) >= min)
      .filter((p) => !max || finalPrice(p) <= max)
      .filter((p) => !term || `${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(term))
      .sort(SORTS[sort]?.fn || SORTS.relevantes.fn);
  }, [products, cat, brand, offer, inStock, min, max, q, sort]);

  const title = q ? `Resultados para “${q}”` : offer ? 'Ofertas' : CATEGORIES.find((c) => c.id === cat)?.name || brand || 'Productos';
  const chips = [
    cat && { k: 'cat', label: CATEGORIES.find((c) => c.id === cat)?.name },
    brand && { k: 'marca', label: brand },
    offer && { k: 'oferta', label: 'En oferta' },
    inStock && { k: 'stock', label: 'Con stock' },
    q && { k: 'q', label: `“${q}”` },
    (min || max) && { k: 'price', label: 'Rango de precio' },
  ].filter(Boolean);

  return (
    <div className="container section">
      <div className="catalog-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <span className="muted">{list.length} resultados</span>
        </div>
        <div className="catalog-tools">
          <button className="btn btn-outline show-md" onClick={() => setShowFilters(true)}><SlidersHorizontal size={16} /> Filtros</button>
          <select className="input" value={sort} onChange={(e) => set('orden', e.target.value)} aria-label="Ordenar">
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </div>
      </div>
      {chips.length > 0 && (
        <div className="chips">
          {chips.map((c) => (
            <button key={c.k} className="chip" onClick={() => {
              if (c.k === 'price') { const n = new URLSearchParams(params); n.delete('min'); n.delete('max'); setParams(n); } else set(c.k, '');
            }}>{c.label} <X size={14} /></button>
          ))}
          <button className="link small" onClick={() => setParams({})}>Limpiar todo</button>
        </div>
      )}

      <div className="catalog">
        <aside className={`filters ${showFilters ? 'open' : ''}`}>
          <div className="filters-head show-md"><b>Filtros</b><button className="icon-btn" onClick={() => setShowFilters(false)}><X /></button></div>
          <div className="filter-group">
            <h4>Categorías</h4>
            <button className={`filter-opt ${!cat ? 'on' : ''}`} onClick={() => set('cat', '')}>Todas</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`filter-opt ${cat === c.id ? 'on' : ''}`} onClick={() => set('cat', c.id)}>
                {c.name} <small>{products.filter((p) => p.active && p.category === c.id).length}</small>
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h4>Marca</h4>
            <div className="brand-filter">
              {BRANDS.map((b) => (
                <button key={b} className={`chip ${brand === b ? 'chip-on' : ''}`} onClick={() => set('marca', brand === b ? '' : b)}>{b}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h4>Precio</h4>
            <div className="price-range">
              <input className="input" type="number" placeholder="Mín." defaultValue={min || ''} onBlur={(e) => set('min', e.target.value)} />
              <span>–</span>
              <input className="input" type="number" placeholder="Máx." defaultValue={max || ''} onBlur={(e) => set('max', e.target.value)} />
            </div>
          </div>
          <div className="filter-group">
            <label className="switch-row"><input type="checkbox" checked={offer} onChange={(e) => set('oferta', e.target.checked)} /> Solo ofertas</label>
            <label className="switch-row"><input type="checkbox" checked={inStock} onChange={(e) => set('stock', e.target.checked)} /> Solo con stock</label>
          </div>
          <button className="btn btn-primary btn-block show-md" onClick={() => setShowFilters(false)}>Ver {list.length} resultados</button>
        </aside>
        <div>
          {list.length === 0 ? (
            <Empty icon={SearchX} title="No encontramos productos" text="Probá con otra búsqueda o quitá algunos filtros."
              action={<button className="btn btn-primary" onClick={() => setParams({})}>Limpiar filtros</button>} />
          ) : (
            <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
