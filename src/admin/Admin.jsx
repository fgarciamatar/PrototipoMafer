import { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, BadgePercent, ReceiptText, Settings, Store, Sun, Moon, Plus, Search, Pencil,
  Trash2, TrendingUp, AlertTriangle, DollarSign, ShoppingBag, Eye, EyeOff, Star, LogOut,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { BRANDS, CATEGORIES, SALES_BY_MONTH } from '../data/products.js';
import { Logo, ProductImage, Modal } from '../components/ui.jsx';
import { ORDER_STATUS, finalPrice, formatDate, money } from '../utils.js';
import { StatusBadge } from '../pages/Account.jsx';
import ProductForm from './ProductForm.jsx';

export function AdminLayout() {
  const { user, theme, toggleTheme, logout } = useStore();
  if (!user) return <Navigate to="/ingresar?next=/admin" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  const links = [
    ['/admin', LayoutDashboard, 'Resumen', true],
    ['/admin/productos', Boxes, 'Productos'],
    ['/admin/ofertas', BadgePercent, 'Ofertas y precios'],
    ['/admin/pedidos', ReceiptText, 'Pedidos'],
    ['/admin/config', Settings, 'Configuración'],
  ];
  return (
    <div className="admin">
      <aside className="admin-side">
        <Logo />
        <span className="admin-label">ADMINISTRACIÓN</span>
        <nav>
          {links.map(([to, Icon, label, end]) => (
            <NavLink key={to} to={to} end={end}><Icon size={18} /> <span>{label}</span></NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <Link to="/"><Store size={18} /> <span>Ver tienda</span></Link>
          <button onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} <span>Tema {theme === 'dark' ? 'claro' : 'oscuro'}</span></button>
          <button onClick={logout}><LogOut size={18} /> <span>Salir</span></button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}

export function Dashboard() {
  const { orders, products } = useStore();
  const revenue = orders.filter((o) => o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pendiente').length;
  const low = products.filter((p) => p.stock <= 3);
  const maxV = Math.max(...SALES_BY_MONTH.map((x) => x.v));

  return (
    <>
      <div className="admin-head"><h1>Resumen</h1><Link to="/admin/productos?nuevo=1" className="btn btn-primary"><Plus size={16} /> Nuevo producto</Link></div>
      <div className="kpis">
        <Kpi icon={DollarSign} label="Ventas del mes" value={money(revenue)} delta="+16% vs. sep." />
        <Kpi icon={ShoppingBag} label="Pedidos" value={orders.length} delta={`${pending} pendientes de pago`} />
        <Kpi icon={Boxes} label="Productos activos" value={products.filter((p) => p.active).length} delta={`${products.filter((p) => p.discount > 0).length} en oferta`} />
        <Kpi icon={AlertTriangle} label="Stock bajo" value={low.length} delta="3 unidades o menos" warn={low.length > 0} />
      </div>
      <div className="admin-grid">
        <div className="card">
          <div className="row-between"><h3>Ventas (millones $)</h3><TrendingUp size={18} className="text-ok" /></div>
          <div className="bars">
            {SALES_BY_MONTH.map((x, i) => (
              <div key={x.m} className="bar-col" title={`${x.m}: $${x.v}M`}>
                <small>{x.v}</small>
                <div className={`bar-fill ${i === SALES_BY_MONTH.length - 1 ? 'cur' : ''}`} style={{ height: `${(x.v / maxV) * 100}%` }} />
                <span>{x.m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Stock bajo</h3>
          {low.length === 0 ? <p className="muted small">Todo en orden 👌</p> : (
            <ul className="mini-list">
              {low.map((p) => (
                <li key={p.id}><ProductImage product={p} className="thumb" /><span className="grow small">{p.name}</span><span className={`badge ${p.stock ? 'badge-warn' : 'badge-danger'}`}>{p.stock} u.</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="card">
        <div className="row-between"><h3>Últimos pedidos</h3><Link to="/admin/pedidos" className="link small">Ver todos</Link></div>
        <OrdersTable orders={orders.slice(0, 5)} />
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, delta, warn }) {
  return (
    <div className={`card kpi ${warn ? 'kpi-warn' : ''}`}>
      <span className="kpi-icon"><Icon size={20} /></span>
      <small className="muted">{label}</small>
      <b>{value}</b>
      <small className="muted">{delta}</small>
    </div>
  );
}

export function AdminProducts() {
  const { products, updateProduct, deleteProduct } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [editing, setEditing] = useState(() => (location.hash.includes('nuevo=1') ? {} : null));
  const [confirmDel, setConfirmDel] = useState(null);

  const list = useMemo(() => {
    const t = q.toLowerCase();
    return products.filter((p) => (!cat || p.category === cat) && (!t || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(t)));
  }, [products, q, cat]);

  return (
    <>
      <div className="admin-head">
        <h1>Productos <small className="muted">({products.length})</small></h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}><Plus size={16} /> Nuevo producto</button>
      </div>
      <div className="toolbar">
        <div className="input-icon grow"><Search size={16} /><input placeholder="Buscar por nombre, SKU o marca" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="card table-card">
        <table className="table">
          <thead><tr><th>Producto</th><th>Precio lista</th><th>Desc.</th><th>Precio final</th><th>Stock</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'dim'}>
                <td>
                  <div className="cell-prod">
                    <ProductImage product={p} className="thumb" />
                    <div><b className="small">{p.name}</b><small className="muted">{p.sku} · {p.brand}</small></div>
                  </div>
                </td>
                <td><InlineNumber value={p.price} prefix="$" onSave={(v) => updateProduct(p.id, { price: v })} /></td>
                <td><InlineNumber value={p.discount} suffix="%" max={90} onSave={(v) => updateProduct(p.id, { discount: v })} /></td>
                <td><b>{money(finalPrice(p))}</b></td>
                <td><InlineNumber value={p.stock} onSave={(v) => updateProduct(p.id, { stock: v })} warn={p.stock <= 3} /></td>
                <td>
                  <div className="row-gap">
                    <button className={`icon-btn sm ${p.active ? 'text-ok' : ''}`} title={p.active ? 'Visible en tienda' : 'Oculto'} onClick={() => updateProduct(p.id, { active: !p.active })}>{p.active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                    <button className={`icon-btn sm ${p.featured ? 'text-brand' : ''}`} title="Destacado" onClick={() => updateProduct(p.id, { featured: !p.featured })}><Star size={16} /></button>
                  </div>
                </td>
                <td>
                  <div className="row-gap">
                    <button className="icon-btn sm" onClick={() => setEditing(p)} aria-label="Editar"><Pencil size={16} /></button>
                    <button className="icon-btn sm text-danger" onClick={() => setConfirmDel(p)} aria-label="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted center" style={{ padding: 24 }}>Sin resultados</p>}
      </div>
      <p className="small muted">Tip: hacé clic en un precio, descuento o stock para editarlo directamente.</p>
      {editing && <ProductForm product={editing} onClose={() => setEditing(null)} />}
      {confirmDel && (
        <Modal title="Eliminar producto" onClose={() => setConfirmDel(null)}>
          <p>¿Seguro que querés eliminar <b>{confirmDel.name}</b>? Esta acción no se puede deshacer. Si solo querés ocultarlo, usá el ícono del ojo.</p>
          <div className="row-gap end">
            <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={() => { deleteProduct(confirmDel.id); setConfirmDel(null); }}>Eliminar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function InlineNumber({ value, onSave, prefix = '', suffix = '', max, warn }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState(value);
  const commit = () => {
    setEdit(false);
    let n = Math.max(0, Number(v) || 0);
    if (max != null) n = Math.min(max, n);
    if (n !== value) onSave(n);
  };
  if (edit)
    return <input className="input input-inline" type="number" autoFocus value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEdit(false); }} />;
  return (
    <button className={`inline-val ${warn ? 'text-warn' : ''}`} onClick={() => { setV(value); setEdit(true); }}>
      {prefix === '$' ? money(value) : `${prefix}${value}${suffix}`}
    </button>
  );
}

export function AdminOffers() {
  const { products, bulkUpdate, toast } = useStore();
  const [scope, setScope] = useState({ type: 'category', value: CATEGORIES[0].id });
  const [discount, setDiscount] = useState(15);
  const [inc, setInc] = useState(8);
  const [incScope, setIncScope] = useState({ type: 'all', value: '' });

  const match = (s) => (p) => s.type === 'all' || (s.type === 'category' ? p.category === s.value : p.brand === s.value);
  const targets = products.filter(match(scope));
  const incTargets = products.filter(match(incScope));
  const onOffer = products.filter((p) => p.discount > 0);

  return (
    <>
      <div className="admin-head"><h1>Ofertas y precios</h1></div>
      <div className="admin-grid">
        <div className="card">
          <h3><BadgePercent size={18} /> Aplicar oferta masiva</h3>
          <p className="small muted">Aplicá un descuento a toda una categoría o marca.</p>
          <ScopePicker scope={scope} setScope={setScope} />
          <label className="field"><span>Descuento: <b>{discount}%</b></span><input type="range" min={0} max={60} step={5} value={discount} onChange={(e) => setDiscount(+e.target.value)} /></label>
          <div className="row-gap">
            <button className="btn btn-primary" onClick={() => { bulkUpdate(targets.map((p) => p.id), (p) => ({ ...p, discount })); toast(`${discount}% aplicado a ${targets.length} productos`); }}>Aplicar a {targets.length} productos</button>
            <button className="btn btn-ghost" onClick={() => { bulkUpdate(targets.map((p) => p.id), (p) => ({ ...p, discount: 0 })); toast('Ofertas quitadas', 'info'); }}>Quitar ofertas</button>
          </div>
        </div>
        <div className="card">
          <h3><TrendingUp size={18} /> Actualización de precios</h3>
          <p className="small muted">Ajustá precios de lista por porcentaje (ej. aumento de proveedor).</p>
          <ScopePicker scope={incScope} setScope={setIncScope} allowAll />
          <label className="field"><span>Ajuste (%)</span><input className="input" type="number" value={inc} onChange={(e) => setInc(+e.target.value)} /></label>
          <button className="btn btn-dark" onClick={() => {
            bulkUpdate(incTargets.map((p) => p.id), (p) => ({ ...p, price: Math.round(p.price * (1 + inc / 100)) }));
            toast(`Precios ${inc >= 0 ? 'aumentados' : 'reducidos'} ${Math.abs(inc)}% en ${incTargets.length} productos`);
          }}>{inc >= 0 ? 'Aumentar' : 'Reducir'} {Math.abs(inc)}% a {incTargets.length} productos</button>
        </div>
      </div>
      <div className="card table-card">
        <h3 style={{ padding: '16px 16px 0' }}>Productos en oferta ({onOffer.length})</h3>
        <table className="table">
          <thead><tr><th>Producto</th><th>Antes</th><th>Desc.</th><th>Ahora</th><th /></tr></thead>
          <tbody>
            {onOffer.map((p) => (
              <tr key={p.id}>
                <td><div className="cell-prod"><ProductImage product={p} className="thumb" /><b className="small">{p.name}</b></div></td>
                <td><s className="muted">{money(p.price)}</s></td>
                <td><span className="badge badge-brand">{p.discount}% OFF</span></td>
                <td><b>{money(finalPrice(p))}</b></td>
                <td><button className="link small" onClick={() => bulkUpdate([p.id], (x) => ({ ...x, discount: 0 }))}>Quitar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ScopePicker({ scope, setScope, allowAll }) {
  return (
    <div className="form-grid">
      <label className="field"><span>Aplicar a</span>
        <select className="input" value={scope.type} onChange={(e) => {
          const type = e.target.value;
          setScope({ type, value: type === 'category' ? CATEGORIES[0].id : type === 'brand' ? BRANDS[0] : '' });
        }}>
          {allowAll && <option value="all">Todo el catálogo</option>}
          <option value="category">Categoría</option>
          <option value="brand">Marca</option>
        </select>
      </label>
      {scope.type !== 'all' && (
        <label className="field"><span>{scope.type === 'category' ? 'Categoría' : 'Marca'}</span>
          <select className="input" value={scope.value} onChange={(e) => setScope({ ...scope, value: e.target.value })}>
            {scope.type === 'category' ? CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>) : BRANDS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}

function OrdersTable({ orders, onOpen }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Pago</th><th>Envío</th><th>Total</th><th>Estado</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} onClick={() => onOpen?.(o)} className={onOpen ? 'clickable' : ''}>
              <td><b>{o.id}</b></td>
              <td>{o.customer}</td>
              <td className="small">{formatDate(o.date)}</td>
              <td className="small">{o.payment.method === 'transfer' ? 'Transferencia' : 'Mercado Pago'}{o.payment.receipt && ' 📎'}</td>
              <td className="small">{o.shipping.method === 'pickup' ? 'Retiro' : 'Andreani'}</td>
              <td><b>{money(o.total)}</b></td>
              <td><StatusBadge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminOrders() {
  const { orders, updateOrder, toast } = useStore();
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(null);
  const list = orders.filter((o) => !filter || o.status === filter);
  const cur = open && orders.find((o) => o.id === open);

  return (
    <>
      <div className="admin-head"><h1>Pedidos</h1></div>
      <div className="chips">
        <button className={`chip ${!filter ? 'chip-on' : ''}`} onClick={() => setFilter('')}>Todos ({orders.length})</button>
        {Object.entries(ORDER_STATUS).map(([k, s]) => {
          const n = orders.filter((o) => o.status === k).length;
          return n ? <button key={k} className={`chip ${filter === k ? 'chip-on' : ''}`} onClick={() => setFilter(k)}>{s.label} ({n})</button> : null;
        })}
      </div>
      <div className="card table-card"><OrdersTable orders={list} onOpen={(o) => setOpen(o.id)} /></div>
      {cur && (
        <Modal title={`Pedido ${cur.id}`} onClose={() => setOpen(null)} wide>
          <div className="order-detail">
            <div>
              <h4>Cliente</h4>
              <p className="small">{cur.customer}<br />{cur.email}{cur.phone && <><br />{cur.phone}</>}{cur.dni && <><br />DNI/CUIT {cur.dni}</>}</p>
              <h4>Entrega</h4>
              <p className="small">{cur.shipping.label}{cur.shipping.address && <><br />{cur.shipping.address}</>}{cur.shipping.tracking && <><br />Andreani N° <b>{cur.shipping.tracking}</b></>}</p>
              <h4>Pago</h4>
              <p className="small">{cur.payment.method === 'transfer' ? 'Transferencia bancaria' : 'Mercado Pago'} · {cur.payment.status === 'approved' ? 'Acreditado' : 'Pendiente'}</p>
              {cur.payment.receipt && (
                <div className="receipt">
                  {cur.payment.receipt.data ? <img src={cur.payment.receipt.data} alt="Comprobante" /> : <span>📎 {cur.payment.receipt.name}</span>}
                </div>
              )}
              {cur.payment.method === 'transfer' && cur.payment.status !== 'approved' && (
                <button className="btn btn-primary btn-sm" onClick={() => { updateOrder(cur.id, { payment: { ...cur.payment, status: 'approved' }, status: 'pagado' }); toast('Transferencia confirmada'); }}>Confirmar transferencia</button>
              )}
            </div>
            <div>
              <h4>Productos</h4>
              <ul className="order-items">
                {cur.items.map((it) => <li key={it.id}><span>{it.qty} × {it.name}</span><span>{money(it.price * it.qty)}</span></li>)}
              </ul>
              <div className="row-between small"><span>Envío</span><span>{cur.shippingCost ? money(cur.shippingCost) : 'Gratis'}</span></div>
              {cur.discount > 0 && <div className="row-between small text-ok"><span>Descuento</span><span>−{money(cur.discount)}</span></div>}
              <div className="row-between"><b>Total</b><b>{money(cur.total)}</b></div>
              <label className="field" style={{ marginTop: 16 }}><span>Estado del pedido</span>
                <select className="input" value={cur.status} onChange={(e) => { updateOrder(cur.id, { status: e.target.value }); toast('Estado actualizado'); }}>
                  {Object.entries(ORDER_STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
              </label>
              {cur.shipping.method !== 'pickup' && (
                <button className="btn btn-outline btn-sm" onClick={() => toast('Etiqueta Andreani generada (simulación)', 'info')}>Imprimir etiqueta Andreani</button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export function AdminSettings() {
  const { settings, saveSettings, resetDemo } = useStore();
  const [s, setS] = useState(settings);
  const bank = (k) => (e) => setS({ ...s, bank: { ...s.bank, [k]: e.target.value } });
  return (
    <>
      <div className="admin-head"><h1>Configuración</h1></div>
      <form className="admin-grid" onSubmit={(e) => { e.preventDefault(); saveSettings(s); }}>
        <div className="card">
          <h3>Ventas</h3>
          <label className="field"><span>Descuento por transferencia (%)</span><input className="input" type="number" value={s.transferDiscount} onChange={(e) => setS({ ...s, transferDiscount: +e.target.value })} /></label>
          <label className="field"><span>Envío gratis desde ($)</span><input className="input" type="number" value={s.freeShippingFrom} onChange={(e) => setS({ ...s, freeShippingFrom: +e.target.value })} /></label>
          <label className="field"><span>Cuotas sin interés</span><input className="input" type="number" value={s.installments} onChange={(e) => setS({ ...s, installments: Math.max(1, +e.target.value) })} /></label>
        </div>
        <div className="card">
          <h3>Datos bancarios (transferencia)</h3>
          {[['holder', 'Titular'], ['cuit', 'CUIT'], ['bank', 'Banco'], ['cbu', 'CBU'], ['alias', 'Alias']].map(([k, l]) => (
            <label className="field" key={k}><span>{l}</span><input className="input" value={s.bank[k]} onChange={bank(k)} /></label>
          ))}
        </div>
        <div className="card">
          <h3>Integraciones</h3>
          <div className="integration"><span className="tag-mp">mercado pago</span><span className="grow small">Checkout Pro · credenciales de producción</span><span className="badge badge-ok">Conectado</span></div>
          <div className="integration"><span className="tag-andreani">andreani</span><span className="grow small">Cotizador, sucursales y etiquetas</span><span className="badge badge-ok">Conectado</span></div>
          <p className="small muted">En el prototipo las integraciones están simuladas. Las credenciales se cargan del lado del servidor.</p>
        </div>
        <div className="card">
          <h3>Demo</h3>
          <p className="small muted">Restaurá productos, pedidos y usuarios de ejemplo.</p>
          <button type="button" className="btn btn-outline" onClick={resetDemo}>Restaurar datos de demo</button>
        </div>
        <div className="span-all"><button className="btn btn-primary btn-lg">Guardar configuración</button></div>
      </form>
    </>
  );
}
