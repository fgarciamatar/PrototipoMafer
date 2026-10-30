import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Circle, User } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Empty } from '../components/ui.jsx';
import { ORDER_STATUS, formatDate, money } from '../utils.js';

const STEPS_SHIP = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado'];
const STEPS_PICKUP = ['pendiente', 'pagado', 'preparando', 'listo', 'entregado'];

export function StatusBadge({ status }) {
  const s = ORDER_STATUS[status] || { label: status, tone: 'muted' };
  return <span className={`badge badge-${s.tone}`}>{s.label}</span>;
}

export function Timeline({ order }) {
  if (order.status === 'cancelado') return <StatusBadge status="cancelado" />;
  const steps = order.shipping.method === 'pickup' ? STEPS_PICKUP : STEPS_SHIP;
  const cur = steps.indexOf(order.status);
  return (
    <ol className="timeline">
      {steps.map((s, i) => (
        <li key={s} className={i <= cur ? 'done' : ''}>
          {i <= cur ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          <span>{ORDER_STATUS[s].label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Account() {
  const { user, orders, updateProfile } = useStore();
  const [tab, setTab] = useState('pedidos');
  const [f, setF] = useState(user ? { name: user.name, phone: user.phone || '' } : {});
  if (!user) return <Navigate to="/ingresar?next=/cuenta" replace />;
  const mine = orders.filter((o) => o.userId === user.id || o.email === user.email);

  return (
    <div className="container section">
      <h1 className="page-title">Hola, {user.name.split(' ')[0]} 👋</h1>
      <div className="tabs tabs-inline">
        <button className={tab === 'pedidos' ? 'on' : ''} onClick={() => setTab('pedidos')}><Package size={16} /> Mis pedidos</button>
        <button className={tab === 'datos' ? 'on' : ''} onClick={() => setTab('datos')}><User size={16} /> Mis datos</button>
      </div>
      {tab === 'pedidos' && (mine.length === 0 ? (
        <Empty icon={Package} title="Todavía no hiciste pedidos" action={<Link className="btn btn-primary" to="/productos">Empezar a comprar</Link>} />
      ) : (
        <div className="orders">
          {mine.map((o) => (
            <div className="card order-card" key={o.id}>
              <div className="row-between wrap">
                <div><b>Pedido {o.id}</b> <span className="muted small">· {formatDate(o.date)}</span></div>
                <StatusBadge status={o.status} />
              </div>
              <ul className="order-items">
                {o.items.map((it) => <li key={it.id}><span>{it.qty} × {it.name}</span><span>{money(it.price * it.qty)}</span></li>)}
              </ul>
              <Timeline order={o} />
              <div className="row-between wrap small">
                <span className="muted">
                  <Truck size={14} /> {o.shipping.label}
                  {o.shipping.tracking && <> · Seguimiento Andreani: <b>{o.shipping.tracking}</b></>}
                </span>
                <b>Total {money(o.total)}</b>
              </div>
              {o.payment.method === 'transfer' && o.payment.status === 'pending' && (
                <div className="alert alert-warn small">Estamos esperando la acreditación de tu transferencia. Si ya la hiciste, la validamos en menos de 24 h hábiles.</div>
              )}
            </div>
          ))}
        </div>
      ))}
      {tab === 'datos' && (
        <form className="card form-narrow" onSubmit={(e) => { e.preventDefault(); updateProfile(f); }}>
          <label className="field"><span>Nombre</span><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="field"><span>Email</span><input className="input" value={user.email} disabled /></label>
          <label className="field"><span>Teléfono</span><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
          <button className="btn btn-primary">Guardar cambios</button>
        </form>
      )}
    </div>
  );
}
