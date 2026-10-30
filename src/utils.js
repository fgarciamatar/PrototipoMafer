const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
export const money = (v) => ars.format(Math.round(v * 100) / 100);

export const finalPrice = (p) => Math.round(p.price * (1 - (p.discount || 0) / 100) * 100) / 100;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

export const uid = (prefix = 'id') => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Cotización simulada de Andreani. En producción: API de Andreani (cotizador) desde el backend.
export function quoteAndreani(postalCode, weightKg) {
  const cp = parseInt(postalCode, 10);
  if (!cp || String(postalCode).length !== 4) return null;
  const local = cp >= 4000 && cp <= 4199; // Tucumán
  const region = cp >= 3000 && cp <= 5999; // NOA / Centro
  const base = local ? 6500 : region ? 9800 : 13900;
  const perKg = local ? 180 : region ? 320 : 450;
  const home = Math.round(base + perKg * weightKg);
  return {
    home: { cost: home, days: local ? '1 a 2' : region ? '3 a 5' : '5 a 8' },
    branch: { cost: Math.round(home * 0.72), days: local ? '1 a 2' : region ? '3 a 5' : '5 a 7' },
  };
}

export const ORDER_STATUS = {
  pendiente: { label: 'Pendiente de pago', tone: 'warn' },
  pagado: { label: 'Pagado', tone: 'info' },
  preparando: { label: 'En preparación', tone: 'info' },
  enviado: { label: 'Enviado', tone: 'brand' },
  listo: { label: 'Listo para retirar', tone: 'brand' },
  entregado: { label: 'Entregado', tone: 'ok' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
};

export const readFileAsDataURL = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
