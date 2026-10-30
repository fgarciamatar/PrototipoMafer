// Fotos reales de productos Lusqtoff (tomadas del catálogo de Mafer).
import imgBanco550 from '../assets/products/amoladora-banco-550.webp';
import imgBanco8 from '../assets/products/amoladora-banco-8.webp';
import imgCepilladora from '../assets/products/cepilladora-1500.webp';
import imgPulverizador from '../assets/products/pulverizador-usb.webp';
import imgInalambrica from '../assets/products/amoladora-inalambrica-115.webp';
import imgTaladro18 from '../assets/products/taladro-bateria-18v.webp';
import imgAmol230 from '../assets/products/amoladora-2200-230.webp';
import imgAmol180 from '../assets/products/amoladora-2200-180.webp';
import imgTermofusora from '../assets/products/termofusora-800.webp';
import imgPistola from '../assets/products/pistola-calor-2000.webp';
import imgPulidora from '../assets/products/pulidora-detailing.webp';
import imgRecta from '../assets/products/amoladora-recta-710.webp';

// Datos de ejemplo. En producción vendrían de la API.

export const CATEGORIES = [
  { id: 'electricas', name: 'Herramientas Eléctricas', icon: 'drill' },
  { id: 'manuales', name: 'Herramientas Manuales', icon: 'hammer' },
  { id: 'generadores', name: 'Generadores', icon: 'zap' },
  { id: 'hidrolavadoras', name: 'Hidrolavadoras', icon: 'droplets' },
  { id: 'construccion', name: 'Construcción', icon: 'construction' },
  { id: 'jardin', name: 'Jardín', icon: 'sprout' },
  { id: 'movilidad', name: 'Movilidad', icon: 'bike' },
  { id: 'hogar', name: 'Hogar y Camping', icon: 'tent' },
];

export const BRANDS = ['Lusqtoff', 'Ingco', 'Ombu', 'Gamma', 'Bremen', 'Stanley'];

let n = 0;
const p = (o) => ({
  id: `p${++n}`,
  sku: `MF-${String(1000 + n)}`,
  discount: 0,
  stock: 10,
  active: true,
  featured: false,
  images: [],
  rating: 4.6,
  reviews: 12,
  weight: 3,
  ...o,
});

export const SEED_PRODUCTS = [
  // ---- Productos reales del catálogo Mafer ----
  p({ name: 'Amoladora de Banco 550 W', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 143499, stock: 8, featured: true, weight: 12, images: [imgBanco550],
    description: 'Amoladora de banco de 550 W con dos piedras para afilar y desbastar. Base firme y protectores de chispas.',
    specs: { Potencia: '550 W', Marca: 'Lusqtoff' } }),
  p({ name: 'Amoladora de Banco 8" 500 W', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 261299, stock: 5, weight: 15, images: [imgBanco8],
    description: 'Amoladora de banco de 8" línea Black Series, con protectores transparentes y apoya piezas regulables.',
    specs: { Potencia: '500 W', Piedras: '8"', Línea: 'Black Series' } }),
  p({ name: 'Cepilladora de Banco 1500 W', brand: 'Lusqtoff', category: 'electricas', art: 'drill', price: 937299, stock: 2, featured: true, weight: 28, images: [imgCepilladora],
    description: 'Cepilladora de banco de 1500 W para calibrar y cepillar madera con terminación profesional.',
    specs: { Potencia: '1500 W', Uso: 'Carpintería' } }),
  p({ name: 'Pulverizador USB 2 L', brand: 'Lusqtoff', category: 'jardin', art: 'droplets', price: 66169, stock: 20, weight: 1, images: [imgPulverizador],
    description: 'Pulverizador eléctrico recargable por USB con depósito de 2 litros y pistola con boquilla regulable.',
    specs: { Capacidad: '2 L', Carga: 'USB' } }),
  p({ name: 'Amoladora Angular Inalámbrica 115 mm (4 1/2")', brand: 'Lusqtoff', category: 'electricas', art: 'battery', price: 428400, stock: 6, featured: true, weight: 2.5, images: [imgInalambrica],
    description: 'Amoladora angular a batería de 115 mm. Libertad total para cortar y desbastar sin cables.',
    specs: { Disco: '115 mm (4 1/2")', Alimentación: 'Batería' } }),
  p({ name: 'Taladro a Batería con Percutor 18 V', brand: 'Lusqtoff', category: 'electricas', art: 'drill', price: 386600, stock: 10, featured: true, weight: 2, images: [imgTaladro18],
    description: 'Taladro percutor inalámbrico de 18 V para perforar madera, metal y mampostería.',
    specs: { Voltaje: '18 V', Función: 'Percutor' } }),
  p({ name: 'Amoladora Angular 2200 W 230 mm (9")', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 382200, stock: 7, weight: 5.5, images: [imgAmol230],
    description: 'Amoladora angular de 9" y 2200 W para cortes y desbastes pesados.',
    specs: { Potencia: '2200 W', Disco: '230 mm (9")' } }),
  p({ name: 'Amoladora Angular 2200 W 180 mm (7")', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 337317, stock: 9, weight: 5.2, images: [imgAmol180],
    description: 'Amoladora angular de 7" y 2200 W con mango lateral para mayor control.',
    specs: { Potencia: '2200 W', Disco: '180 mm (7")' } }),
  p({ name: 'Termofusora 220 V 800 W', brand: 'Lusqtoff', category: 'construccion', art: 'flame', price: 73700, stock: 15, weight: 2.5, images: [imgTermofusora],
    description: 'Termofusora de 800 W para unir caños y accesorios de polipropileno en instalaciones de agua.',
    specs: { Potencia: '800 W', Tensión: '220 V' } }),
  p({ name: 'Pistola de Calor 2000 W', brand: 'Lusqtoff', category: 'electricas', art: 'flame', price: 134900, stock: 12, weight: 1.5, images: [imgPistola],
    description: 'Pistola de calor de 2000 W línea Black Series con maletín y set de boquillas.',
    specs: { Potencia: '2000 W', Incluye: 'Maletín y boquillas' } }),
  p({ name: 'Pulidora Detailing (discontinuada)', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 407900, stock: 0, weight: 3, images: [imgPulidora],
    description: 'Pulidora roto-orbital para detailing automotor. Producto discontinuado.',
    specs: { Uso: 'Detailing automotor' } }),
  p({ name: 'Amoladora Recta 710 W 10 mm', brand: 'Lusqtoff', category: 'electricas', art: 'drill', price: 142665, stock: 8, weight: 1.8, images: [imgRecta],
    description: 'Amoladora recta de 710 W con pinza de 10 mm para trabajos de precisión, matricería y pulido.',
    specs: { Potencia: '710 W', Pinza: '10 mm' } }),

  // ---- Productos de ejemplo ----
  p({ name: 'Sierra Ingletadora de Banco 2000 W', brand: 'Lusqtoff', category: 'electricas', art: 'disc-3', price: 702300, discount: 20, stock: 6, featured: true, weight: 18,
    description: 'Ingletadora de banco de 2000 W con disco de 255 mm, corte a inglete y bisel. Ideal para carpintería y trabajos de precisión.',
    specs: { Potencia: '2000 W', Disco: '255 mm', Velocidad: '4500 RPM', Garantía: '12 meses' } }),
  p({ name: 'Equipo para Pintar Airless Eléctrico 650 W', brand: 'Lusqtoff', category: 'electricas', art: 'paint-roller', price: 533000, discount: 20, stock: 4, weight: 9,
    description: 'Equipo airless de alta presión para pintar paredes, techos y cercos con terminación profesional.',
    specs: { Potencia: '650 W', Presión: '207 bar', Caudal: '1,2 L/min', Garantía: '6 meses' } }),
  p({ name: 'Generador Naftero 950 W 2T', brand: 'Lusqtoff', category: 'generadores', art: 'zap', price: 269000, discount: 20, stock: 9, featured: true, weight: 21,
    description: 'Generador compacto de 2 tiempos, liviano y fácil de transportar. Perfecto para camping y cortes de luz.',
    specs: { Potencia: '950 W', Motor: '2T 63 cc', Tanque: '4,2 L', Autonomía: '5 h' } }),
  p({ name: 'Taladro Percutor 13 mm 850 W', brand: 'Ingco', category: 'electricas', art: 'drill', price: 98500, discount: 15, stock: 25, featured: true, weight: 2.4,
    description: 'Taladro percutor con mandril de 13 mm, velocidad variable y reversa. Incluye mango auxiliar.',
    specs: { Potencia: '850 W', Mandril: '13 mm', Velocidad: '0-3000 RPM', Garantía: '12 meses' } }),
  p({ name: 'Amoladora Angular 115 mm 900 W', brand: 'Ingco', category: 'electricas', art: 'disc-3', price: 74900, stock: 30, weight: 2,
    description: 'Amoladora compacta con traba de eje y protector ajustable. Para corte y desbaste de metal.',
    specs: { Potencia: '900 W', Disco: '115 mm', Velocidad: '11000 RPM', Garantía: '12 meses' } }),
  p({ name: 'Hidrolavadora 1800 W 140 bar', brand: 'Lusqtoff', category: 'hidrolavadoras', art: 'droplets', price: 189900, discount: 10, stock: 12, featured: true, weight: 8,
    description: 'Hidrolavadora con pistola, lanza regulable y depósito de detergente. Para autos, veredas y patios.',
    specs: { Potencia: '1800 W', Presión: '140 bar', Caudal: '6,5 L/min', Manguera: '5 m' } }),
  p({ name: 'Hidrolavadora Industrial 2500 W', brand: 'Gamma', category: 'hidrolavadoras', art: 'droplets', price: 412000, stock: 3, weight: 22,
    description: 'Motor de inducción para uso intensivo. Bomba de bronce y carro con ruedas.',
    specs: { Potencia: '2500 W', Presión: '180 bar', Caudal: '8 L/min', Motor: 'Inducción' } }),
  p({ name: 'Set de Llaves Combinadas 12 piezas', brand: 'Bremen', category: 'manuales', art: 'wrench', price: 45600, stock: 40, weight: 1.6,
    description: 'Llaves combinadas de acero cromo vanadio de 8 a 19 mm con estuche organizador.',
    specs: { Piezas: '12', Medidas: '8 a 19 mm', Material: 'Cr-V', Estuche: 'Sí' } }),
  p({ name: 'Martillo Carpintero Mango Fibra 27 mm', brand: 'Stanley', category: 'manuales', art: 'hammer', price: 21800, discount: 10, stock: 55, weight: 0.8,
    description: 'Cabeza forjada y mango de fibra de vidrio antivibración.',
    specs: { Peso: '450 g', Mango: 'Fibra de vidrio', Uso: 'Carpintería' } }),
  p({ name: 'Hormigonera 130 L 650 W', brand: 'Ombu', category: 'construccion', art: 'construction', price: 685000, discount: 12, stock: 2, featured: true, weight: 55,
    description: 'Hormigonera nacional de 130 litros con corona de fundición y motor monofásico.',
    specs: { Capacidad: '130 L', Motor: '650 W', Origen: 'Argentina', Garantía: '12 meses' } }),
  p({ name: 'Carretilla Reforzada 90 L', brand: 'Ombu', category: 'construccion', art: 'shovel', price: 118000, stock: 15, weight: 17,
    description: 'Batea de chapa reforzada y rueda neumática. Para obra y jardín.',
    specs: { Capacidad: '90 L', Rueda: 'Neumática', Batea: 'Chapa 0,9 mm' } }),
  p({ name: 'Bordeadora Eléctrica 1200 W', brand: 'Gamma', category: 'jardin', art: 'sprout', price: 112500, discount: 15, stock: 18, weight: 5,
    description: 'Bordeadora con manillar regulable y cabezal de tanza automática.',
    specs: { Potencia: '1200 W', Corte: '38 cm', Tanza: '2 mm' } }),
  p({ name: 'Monopatín Eléctrico 350 W', brand: 'Lusqtoff', category: 'movilidad', art: 'bike', price: 589000, discount: 20, stock: 5, weight: 13,
    description: 'Monopatín plegable con autonomía de 25 km, luces LED y freno eléctrico.',
    specs: { Motor: '350 W', Autonomía: '25 km', 'Vel. máx.': '25 km/h', Rodado: '8,5"' } }),
  p({ name: 'Linterna LED Recargable 1000 lm', brand: 'Ingco', category: 'hogar', art: 'lightbulb', price: 32900, stock: 60, weight: 0.4,
    description: 'Linterna de aluminio con 3 modos de luz y carga USB-C.',
    specs: { Flujo: '1000 lm', Batería: '2600 mAh', Carga: 'USB-C' } }),
  p({ name: 'Anafe a Gas Portátil', brand: 'Bremen', category: 'hogar', art: 'flame', price: 41200, discount: 5, stock: 22, weight: 2,
    description: 'Anafe de camping con encendido piezoeléctrico y valija de transporte.',
    specs: { Encendido: 'Piezoeléctrico', Gas: 'Cartucho butano' } }),
  p({ name: 'Atornillador Inalámbrico 20 V + 2 baterías', brand: 'Ingco', category: 'electricas', art: 'battery', price: 156000, discount: 18, stock: 14, featured: true, weight: 2.1,
    description: 'Atornillador/taladro inalámbrico de 20 V con dos baterías de litio y cargador rápido.',
    specs: { Voltaje: '20 V', Baterías: '2 x 2 Ah', Torque: '45 Nm' } }),
  p({ name: 'Compresor de Aire 50 L 2,5 HP', brand: 'Gamma', category: 'construccion', art: 'gauge', price: 398000, stock: 7, weight: 34,
    description: 'Compresor con tanque de 50 litros, manómetro doble y ruedas.',
    specs: { Tanque: '50 L', Motor: '2,5 HP', Presión: '8 bar' } }),
  p({ name: 'Casco de Seguridad con Arnés', brand: 'Stanley', category: 'construccion', art: 'hard-hat', price: 12900, stock: 80, weight: 0.4,
    description: 'Casco certificado con arnés de 6 puntos y ajuste a cremallera.',
    specs: { Norma: 'IRAM 3620', Ajuste: 'Cremallera' } }),
];

export const SEED_SETTINGS = {
  transferDiscount: 10, // % de descuento por transferencia
  freeShippingFrom: 300000, // envío gratis desde este monto
  installments: 3, // cuotas sin interés
  bank: {
    holder: 'MAFER FERRETERÍA S.R.L.',
    cuit: '30-71234567-8',
    bank: 'Banco Macro',
    cbu: '2850590940090418135201',
    alias: 'MAFER.FERRETERIA',
  },
  stores: [
    { id: 'concepcion', name: 'Sucursal Concepción', address: 'Italia 1720, Concepción, Tucumán' },
    { id: 'alberdi', name: 'Sucursal J.B. Alberdi', address: 'Av. Campero 110, J.B. Alberdi, Tucumán' },
  ],
};

export const SEED_USERS = [
  { id: 'u1', name: 'Administrador Mafer', email: 'admin@mafer.com', password: 'admin123', role: 'admin', phone: '' },
  { id: 'u2', name: 'Cliente Demo', email: 'cliente@demo.com', password: 'demo123', role: 'customer', phone: '3865 123456' },
];

export const SEED_ORDERS = [
  { id: 'MF-24051', userId: 'u2', customer: 'Cliente Demo', email: 'cliente@demo.com', date: '2026-10-21T14:12:00Z',
    items: [{ id: 'p4', name: 'Taladro Percutor 13 mm 850 W', qty: 1, price: 83725 }],
    subtotal: 83725, shippingCost: 0, discount: 0, total: 83725,
    shipping: { method: 'pickup', label: 'Retiro en Sucursal Concepción' },
    payment: { method: 'mercadopago', status: 'approved' }, status: 'entregado' },
  { id: 'MF-24063', userId: 'u2', customer: 'Cliente Demo', email: 'cliente@demo.com', date: '2026-10-27T10:40:00Z',
    items: [{ id: 'p6', name: 'Hidrolavadora 1800 W 140 bar', qty: 1, price: 170910 }],
    subtotal: 170910, shippingCost: 9850, discount: 17091, total: 163669,
    shipping: { method: 'andreani-home', label: 'Andreani a domicilio', tracking: '360002481920', address: 'San Martín 450, San Miguel de Tucumán (4000)' },
    payment: { method: 'transfer', status: 'pending' }, status: 'pendiente' },
  { id: 'MF-24070', userId: null, customer: 'Lucía Fernández', email: 'lucia@mail.com', date: '2026-10-28T18:05:00Z',
    items: [{ id: 'p10', name: 'Hormigonera 130 L 650 W', qty: 1, price: 602800 }],
    subtotal: 602800, shippingCost: 0, discount: 0, total: 602800,
    shipping: { method: 'andreani-home', label: 'Andreani a domicilio', tracking: '360002482117', address: 'Belgrano 120, Monteros (4142)' },
    payment: { method: 'mercadopago', status: 'approved' }, status: 'enviado' },
];

export const SALES_BY_MONTH = [
  { m: 'May', v: 4.2 }, { m: 'Jun', v: 5.1 }, { m: 'Jul', v: 6.8 },
  { m: 'Ago', v: 5.9 }, { m: 'Sep', v: 7.4 }, { m: 'Oct', v: 8.6 },
];
