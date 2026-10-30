import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, Truck, MapPin, Store, CreditCard, Landmark, Lock, Copy, Upload, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { ProductImage, Modal } from '../components/ui.jsx';
import { finalPrice, money, quoteAndreani, readFileAsDataURL } from '../utils.js';
import { Timeline } from './Account.jsx';

// Sucursales Andreani simuladas. En producción: API de sucursales de Andreani filtrada por CP.
const andreaniBranches = (cp) => {
  const tuc = cp >= 4000 && cp <= 4199;
  return tuc
    ? [
        { id: 'a1', name: 'Andreani San Miguel de Tucumán Centro', address: '24 de Septiembre 850' },
        { id: 'a2', name: 'Andreani Concepción', address: 'España 1350' },
        { id: 'a3', name: 'Andreani Yerba Buena', address: 'Av. Aconquija 1720' },
      ]
    : [
        { id: 'a4', name: 'Andreani Sucursal Centro', address: 'Av. Principal 1200' },
        { id: 'a5', name: 'Andreani Sucursal Norte', address: 'Belgrano 455' },
      ];
};

const STEPS = ['Datos', 'Entrega', 'Pago'];

export default function Checkout() {
  const { user, cartItems, cartSubtotal, cartWeight, settings, placeOrder } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '', dni: '',
    street: '', number: '', floor: '', city: '', province: 'Tucumán', cp: '',
  });
  const [ship, setShip] = useState('andreani-home');
  const [branch, setBranch] = useState('');
  const [store, setStore] = useState(settings.stores[0].id);
  const [pay, setPay] = useState('mercadopago');
  const [mpOpen, setMpOpen] = useState(false);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const quote = useMemo(() => quoteAndreani(f.cp, cartWeight), [f.cp, cartWeight]);
  if (!cartItems.length) return <Navigate to="/carrito" replace />;

  const free = cartSubtotal >= settings.freeShippingFrom;
  const shippingCost = ship === 'pickup' ? 0 : free ? 0 : quote ? (ship === 'andreani-home' ? quote.home.cost : quote.branch.cost) : 0;
  const transferOff = pay === 'transfer' ? cartSubtotal * (settings.transferDiscount / 100) : 0;
  const total = cartSubtotal - transferOff + shippingCost;

  const canNext = [
    f.name && /\S+@\S+\.\S+/.test(f.email) && f.phone && f.dni,
    ship === 'pickup' ? !!store : quote && (ship === 'andreani-home' ? f.street && f.number && f.city : !!branch),
    true,
  ];

  const shippingInfo = () => {
    if (ship === 'pickup') {
      const s = settings.stores.find((x) => x.id === store);
      return { method: 'pickup', label: `Retiro en ${s.name}`, address: s.address };
    }
    const tracking = `3600${Math.floor(10000000 + Math.random() * 89999999)}`;
    if (ship === 'andreani-home')
      return { method: ship, label: 'Andreani a domicilio', tracking, address: `${f.street} ${f.number}${f.floor ? ` ${f.floor}` : ''}, ${f.city} (${f.cp})` };
    const b = andreaniBranches(+f.cp).find((x) => x.id === branch);
    return { method: ship, label: `Andreani sucursal · ${b.name}`, tracking, address: b.address };
  };

  const finish = (paymentStatus) => {
    const order = placeOrder({
      customer: f.name, email: f.email, phone: f.phone, dni: f.dni,
      items: cartItems.map((c) => ({ id: c.id, name: c.product.name, qty: c.qty, price: finalPrice(c.product) })),
      subtotal: cartSubtotal, discount: transferOff, shippingCost, total,
      shipping: shippingInfo(),
      payment: { method: pay, status: paymentStatus },
      status: paymentStatus === 'approved' ? 'pagado' : 'pendiente',
    });
    nav(`/pedido/${order.id}`, { replace: true });
  };

  return (
    <div className="container section">
      <h1 className="page-title">Finalizar compra</h1>
      <ol className="stepper">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? 'done' : i === step ? 'on' : ''}>
            <button disabled={i > step} onClick={() => setStep(i)}><span>{i < step ? <Check size={14} /> : i + 1}</span>{s}</button>
          </li>
        ))}
      </ol>

      <div className="two-col">
        <div className="card">
          {step === 0 && (
            <>
              <h3>Tus datos</h3>
              {!user && <div className="alert alert-info small">¿Ya tenés cuenta? <Link to="/ingresar?next=/checkout" className="link">Ingresá</Link> para completar tus datos automáticamente. También podés comprar como invitado.</div>}
              <div className="form-grid">
                <label className="field span-2"><span>Nombre y apellido</span><input className="input" value={f.name} onChange={on('name')} /></label>
                <label className="field"><span>Email</span><input className="input" type="email" value={f.email} onChange={on('email')} /></label>
                <label className="field"><span>Teléfono</span><input className="input" value={f.phone} onChange={on('phone')} /></label>
                <label className="field"><span>DNI / CUIT</span><input className="input" value={f.dni} onChange={on('dni')} placeholder="Para la factura y Andreani" /></label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3>¿Cómo querés recibir tu compra?</h3>
              <label className="field" style={{ maxWidth: 260 }}>
                <span>Código postal</span>
                <input className="input" inputMode="numeric" maxLength={4} value={f.cp} placeholder="Ej: 4146" onChange={(e) => setF({ ...f, cp: e.target.value.replace(/\D/g, '') })} />
              </label>
              <div className="options">
                <Option on={ship === 'andreani-home'} onClick={() => setShip('andreani-home')} icon={Truck} title="Andreani a domicilio"
                  sub={quote ? `Llega en ${quote.home.days} días hábiles` : 'Ingresá tu CP para cotizar'}
                  right={quote ? (free ? <b className="text-ok">Gratis</b> : <b>{money(quote.home.cost)}</b>) : null} tag="andreani" />
                <Option on={ship === 'andreani-branch'} onClick={() => setShip('andreani-branch')} icon={MapPin} title="Andreani a sucursal"
                  sub={quote ? `Disponible en ${quote.branch.days} días hábiles` : 'Retirás en una sucursal Andreani'}
                  right={quote ? (free ? <b className="text-ok">Gratis</b> : <b>{money(quote.branch.cost)}</b>) : null} tag="andreani" />
                <Option on={ship === 'pickup'} onClick={() => setShip('pickup')} icon={Store} title="Retiro en sucursal Mafer"
                  sub="Listo en 24 h hábiles" right={<b className="text-ok">Gratis</b>} />
              </div>

              {ship === 'andreani-home' && (
                <div className="form-grid">
                  <label className="field span-2"><span>Calle</span><input className="input" value={f.street} onChange={on('street')} /></label>
                  <label className="field"><span>Número</span><input className="input" value={f.number} onChange={on('number')} /></label>
                  <label className="field"><span>Piso / Depto (opcional)</span><input className="input" value={f.floor} onChange={on('floor')} /></label>
                  <label className="field"><span>Localidad</span><input className="input" value={f.city} onChange={on('city')} /></label>
                  <label className="field"><span>Provincia</span><input className="input" value={f.province} onChange={on('province')} /></label>
                </div>
              )}
              {ship === 'andreani-branch' && quote && (
                <div className="options compact">
                  {andreaniBranches(+f.cp).map((b) => (
                    <Option key={b.id} on={branch === b.id} onClick={() => setBranch(b.id)} icon={MapPin} title={b.name} sub={b.address} />
                  ))}
                </div>
              )}
              {ship === 'pickup' && (
                <div className="options compact">
                  {settings.stores.map((s) => (
                    <Option key={s.id} on={store === s.id} onClick={() => setStore(s.id)} icon={Store} title={s.name} sub={s.address} />
                  ))}
                </div>
              )}
              {ship !== 'pickup' && f.cp.length === 4 && !quote && <div className="alert alert-danger small">Código postal inválido.</div>}
            </>
          )}

          {step === 2 && (
            <>
              <h3>Medio de pago</h3>
              <div className="options">
                <Option on={pay === 'mercadopago'} onClick={() => setPay('mercadopago')} icon={CreditCard} title="Mercado Pago"
                  sub={`Tarjetas de crédito, débito y dinero en cuenta · ${settings.installments} cuotas sin interés`} tag="mp" />
                <Option on={pay === 'transfer'} onClick={() => setPay('transfer')} icon={Landmark} title="Transferencia bancaria"
                  sub="Te mostramos CBU y alias al confirmar. Acreditación en 24 h hábiles."
                  right={<span className="badge badge-ok">{settings.transferDiscount}% OFF</span>} />
              </div>
              {pay === 'transfer' && (
                <div className="alert alert-info small">Ahorrás <b>{money(transferOff)}</b>. Reservamos tu stock por 48 h mientras se acredita la transferencia.</div>
              )}
              <p className="small muted"><Lock size={14} /> Tus datos de pago se procesan de forma segura. Mafer no almacena datos de tarjetas.</p>
            </>
          )}

          <div className="row-between step-actions">
            {step > 0 ? <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Volver</button> : <Link to="/carrito" className="btn btn-ghost">Volver al carrito</Link>}
            {step < 2 ? (
              <button className="btn btn-primary btn-lg" disabled={!canNext[step]} onClick={() => setStep(step + 1)}>Continuar</button>
            ) : pay === 'mercadopago' ? (
              <button className="btn btn-mp btn-lg" onClick={() => setMpOpen(true)}>Pagar con Mercado Pago</button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => finish('pending')}>Confirmar pedido</button>
            )}
          </div>
        </div>

        <aside className="card summary">
          <h3>Tu pedido</h3>
          <div className="summary-items">
            {cartItems.map(({ id, qty, product }) => (
              <div key={id} className="summary-item">
                <div className="thumb-wrap"><ProductImage product={product} className="thumb" /><span>{qty}</span></div>
                <span className="small grow">{product.name}</span>
                <b className="small">{money(finalPrice(product) * qty)}</b>
              </div>
            ))}
          </div>
          <hr />
          <div className="row-between"><span>Subtotal</span><span>{money(cartSubtotal)}</span></div>
          {transferOff > 0 && <div className="row-between text-ok"><span>Desc. transferencia</span><span>−{money(transferOff)}</span></div>}
          <div className="row-between"><span>Envío</span><span>{step < 1 ? '—' : shippingCost ? money(shippingCost) : 'Gratis'}</span></div>
          <hr />
          <div className="row-between"><b>Total</b><b className="big">{money(total)}</b></div>
          {pay === 'mercadopago' && <small className="muted">o {settings.installments} cuotas sin interés de {money(total / settings.installments)}</small>}
          <p className="small muted"><ShieldCheck size={14} /> Compra protegida</p>
        </aside>
      </div>

      {mpOpen && <MercadoPagoMock total={total} installments={settings.installments} onClose={() => setMpOpen(false)} onApprove={() => finish('approved')} />}
    </div>
  );
}

function Option({ on, onClick, icon: Icon, title, sub, right, tag }) {
  return (
    <button type="button" className={`option ${on ? 'on' : ''}`} onClick={onClick}>
      <span className="radio" />
      <span className="option-icon"><Icon size={20} /></span>
      <span className="grow">
        <b>{title} {tag === 'andreani' && <span className="tag-andreani">andreani</span>}{tag === 'mp' && <span className="tag-mp">mercado pago</span>}</b>
        {sub && <small className="muted">{sub}</small>}
      </span>
      {right}
    </button>
  );
}

// Simulación de Checkout Pro. En producción: el backend crea la preferencia y se redirige a init_point.
function MercadoPagoMock({ total, installments, onClose, onApprove }) {
  const [stage, setStage] = useState('form');
  const [inst, setInst] = useState(1);
  const pay = (e) => {
    e.preventDefault();
    setStage('processing');
    setTimeout(onApprove, 1600);
  };
  return (
    <Modal title="Mercado Pago" onClose={stage === 'processing' ? () => {} : onClose}>
      <div className="mp">
        <div className="mp-head">
          <div className="mp-logo">mercado<b>pago</b></div>
          <small>Pagás a <b>Mafer Ferretería</b></small>
          <strong>{money(total)}</strong>
        </div>
        {stage === 'form' ? (
          <form onSubmit={pay} className="mp-form">
            <label className="field"><span>Número de tarjeta</span><input className="input" required defaultValue="4509 9535 6623 3704" /></label>
            <div className="form-grid">
              <label className="field"><span>Vencimiento</span><input className="input" required defaultValue="11/30" /></label>
              <label className="field"><span>CVV</span><input className="input" required defaultValue="123" /></label>
            </div>
            <label className="field"><span>Titular</span><input className="input" required defaultValue="APRO" /></label>
            <label className="field">
              <span>Cuotas</span>
              <select className="input" value={inst} onChange={(e) => setInst(+e.target.value)}>
                <option value={1}>1 pago de {money(total)}</option>
                <option value={installments}>{installments} cuotas sin interés de {money(total / installments)}</option>
              </select>
            </label>
            <button className="btn btn-mp btn-block btn-lg">Pagar</button>
            <small className="muted center">Simulación de pago · datos de tarjeta de prueba</small>
          </form>
        ) : (
          <div className="mp-processing"><div className="spinner" /> Procesando pago…</div>
        )}
      </div>
    </Modal>
  );
}

export function OrderConfirmation() {
  const { id } = useParams();
  const { orders, settings, updateOrder, toast } = useStore();
  const o = orders.find((x) => x.id === id);
  const [copied, setCopied] = useState('');
  if (!o) return <Navigate to="/" replace />;
  const transfer = o.payment.method === 'transfer';
  const copy = (k, v) => {
    try { navigator.clipboard?.writeText(v); } catch { /* sin portapapeles */ }
    setCopied(k);
    setTimeout(() => setCopied(''), 1500);
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = file.type.startsWith('image/') ? await readFileAsDataURL(file) : null;
    updateOrder(o.id, { payment: { ...o.payment, receipt: { name: file.name, data } } });
    toast('Comprobante enviado. ¡Gracias!');
  };

  return (
    <div className="container section confirm">
      <div className={`confirm-icon ${transfer && o.payment.status === 'pending' ? 'warn' : ''}`}>
        {transfer && o.payment.status === 'pending' ? <Clock size={40} /> : <CheckCircle2 size={40} />}
      </div>
      <h1>{transfer ? '¡Pedido reservado!' : '¡Pago aprobado!'}</h1>
      <p className="muted">Pedido <b>{o.id}</b> · Te enviamos el detalle a {o.email}</p>

      {transfer && (
        <div className="card bank">
          <h3><Landmark size={18} /> Datos para la transferencia</h3>
          <p className="small muted">Transferí <b>{money(o.total)}</b> y subí el comprobante. Reservamos tu stock por 48 h.</p>
          {[
            ['Titular', settings.bank.holder], ['CUIT', settings.bank.cuit], ['Banco', settings.bank.bank],
            ['CBU', settings.bank.cbu], ['Alias', settings.bank.alias], ['Monto', money(o.total)],
          ].map(([k, v]) => (
            <div className="bank-row" key={k}>
              <span className="muted">{k}</span><b>{v}</b>
              {['CBU', 'Alias'].includes(k) && <button className="icon-btn sm" onClick={() => copy(k, v)} aria-label={`Copiar ${k}`}>{copied === k ? <Check size={16} /> : <Copy size={16} />}</button>}
            </div>
          ))}
          <label className="upload">
            <input type="file" accept="image/*,application/pdf" onChange={upload} hidden />
            <Upload size={18} /> {o.payment.receipt ? `Comprobante: ${o.payment.receipt.name}` : 'Subir comprobante'}
          </label>
        </div>
      )}

      <div className="card">
        <Timeline order={o} />
        <div className="row-between small wrap" style={{ marginTop: 12 }}>
          <span><Truck size={14} /> {o.shipping.label}{o.shipping.address ? ` · ${o.shipping.address}` : ''}</span>
          {o.shipping.tracking && <span>N° seguimiento Andreani: <b>{o.shipping.tracking}</b></span>}
        </div>
      </div>
      <div className="row-gap center-row">
        <Link to="/cuenta" className="btn btn-outline">Ver mis pedidos</Link>
        <Link to="/productos" className="btn btn-primary">Seguir comprando</Link>
      </div>
    </div>
  );
}
