import { useState } from 'react';
import { ImagePlus, Trash2, Star, Link2, Plus, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { BRANDS, CATEGORIES } from '../data/products.js';
import { ICONS, Modal } from '../components/ui.jsx';
import { money, readFileAsDataURL } from '../utils.js';

const EMPTY = {
  name: '', brand: BRANDS[0], category: CATEGORIES[0].id, art: 'package', price: 0, discount: 0, stock: 0,
  sku: '', description: '', specs: {}, images: [], active: true, featured: false, weight: 1,
};

export default function ProductForm({ product, onClose }) {
  const { saveProduct, toast } = useStore();
  const [f, setF] = useState({ ...EMPTY, ...product, specs: { ...(product.specs || {}) }, images: [...(product.images || [])] });
  const [url, setUrl] = useState('');
  const [drag, setDrag] = useState(false);
  const isNew = !product.id;
  const on = (k, num) => (e) => setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value });
  const specs = Object.entries(f.specs);

  const addFiles = async (files) => {
    const imgs = [...files].filter((x) => x.type.startsWith('image/'));
    if (imgs.some((x) => x.size > 2_000_000)) toast('Algunas imágenes superan 2 MB; usá imágenes optimizadas', 'warn');
    const data = await Promise.all(imgs.map(readFileAsDataURL));
    setF((cur) => ({ ...cur, images: [...cur.images, ...data] }));
  };
  const setMain = (i) => setF({ ...f, images: [f.images[i], ...f.images.filter((_, j) => j !== i)] });
  const removeImg = (i) => setF({ ...f, images: f.images.filter((_, j) => j !== i) });
  const setSpec = (oldKey, key, val) => {
    const entries = specs.map(([k, v]) => (k === oldKey ? [key, val] : [k, v]));
    setF({ ...f, specs: Object.fromEntries(entries) });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || f.price <= 0) return toast('Completá nombre y precio', 'danger');
    const clean = Object.fromEntries(specs.filter(([k]) => k.trim()));
    saveProduct({ ...f, specs: clean, sku: f.sku || `MF-${Math.floor(2000 + Math.random() * 7000)}` });
    onClose();
  };

  const final = f.price * (1 - f.discount / 100);

  return (
    <Modal title={isNew ? 'Nuevo producto' : 'Editar producto'} onClose={onClose} wide>
      <form onSubmit={submit} className="pform">
        <div className="pform-main">
          <label className="field"><span>Nombre *</span><input className="input" required value={f.name} onChange={on('name')} placeholder="Ej: Taladro Percutor 13 mm 850 W" /></label>
          <div className="form-grid">
            <label className="field"><span>Categoría</span>
              <select className="input" value={f.category} onChange={on('category')}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </label>
            <label className="field"><span>Marca</span>
              <input className="input" list="brands" value={f.brand} onChange={on('brand')} />
              <datalist id="brands">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
            </label>
            <label className="field"><span>Precio de lista *</span><input className="input" type="number" min={0} required value={f.price} onChange={on('price', true)} /></label>
            <label className="field"><span>Descuento (%)</span><input className="input" type="number" min={0} max={90} value={f.discount} onChange={on('discount', true)} /></label>
            <label className="field"><span>Stock</span><input className="input" type="number" min={0} value={f.stock} onChange={on('stock', true)} /></label>
            <label className="field"><span>Peso (kg) · para Andreani</span><input className="input" type="number" min={0} step="0.1" value={f.weight} onChange={on('weight', true)} /></label>
            <label className="field"><span>SKU</span><input className="input" value={f.sku} onChange={on('sku')} placeholder="Automático" /></label>
            <div className="field"><span>Precio final</span><div className="final-price">{money(final)}{f.discount > 0 && <span className="badge badge-brand">{f.discount}% OFF</span>}</div></div>
          </div>
          <label className="field"><span>Descripción</span><textarea className="input" rows={4} value={f.description} onChange={on('description')} /></label>

          <div className="field">
            <span>Especificaciones</span>
            {specs.map(([k, v], i) => (
              <div className="spec-row" key={i}>
                <input className="input" placeholder="Ej: Potencia" value={k} onChange={(e) => setSpec(k, e.target.value, v)} />
                <input className="input" placeholder="Ej: 850 W" value={v} onChange={(e) => setSpec(k, k, e.target.value)} />
                <button type="button" className="icon-btn sm" onClick={() => setF({ ...f, specs: Object.fromEntries(specs.filter(([kk]) => kk !== k)) })} aria-label="Quitar"><X size={16} /></button>
              </div>
            ))}
            <button type="button" className="link small" onClick={() => setF({ ...f, specs: { ...f.specs, [`Nueva ${specs.length + 1}`]: '' } })}><Plus size={14} /> Agregar especificación</button>
          </div>
          <div className="row-gap">
            <label className="switch-row"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Visible en la tienda</label>
            <label className="switch-row"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Destacado en inicio</label>
          </div>
        </div>

        <div className="pform-side">
          <span className="field-label">Fotos</span>
          <label
            className={`dropzone ${drag ? 'drag' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          >
            <input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            <ImagePlus size={28} />
            <b>Arrastrá o hacé clic para subir</b>
            <small className="muted">JPG, PNG o WEBP · hasta 2 MB</small>
          </label>
          <div className="row-gap">
            <div className="input-icon grow"><Link2 size={16} /><input placeholder="o pegá una URL de imagen" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { if (url.trim()) { setF({ ...f, images: [...f.images, url.trim()] }); setUrl(''); } }}>Agregar</button>
          </div>
          <div className="img-grid">
            {f.images.map((src, i) => (
              <div key={i} className={`img-tile ${i === 0 ? 'main' : ''}`}>
                <img src={src} alt="" />
                {i === 0 && <span className="badge badge-brand">Principal</span>}
                <div className="img-actions">
                  {i > 0 && <button type="button" onClick={() => setMain(i)} title="Usar como principal"><Star size={14} /></button>}
                  <button type="button" onClick={() => removeImg(i)} title="Eliminar"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          {f.images.length === 0 && (
            <div className="field">
              <span>Ícono provisorio (sin fotos)</span>
              <div className="art-picker">
                {Object.entries(ICONS).map(([k, Icon]) => (
                  <button type="button" key={k} className={f.art === k ? 'on' : ''} onClick={() => setF({ ...f, art: k })} aria-label={k}><Icon size={18} /></button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pform-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary">{isNew ? 'Crear producto' : 'Guardar cambios'}</button>
        </div>
      </form>
    </Modal>
  );
}
