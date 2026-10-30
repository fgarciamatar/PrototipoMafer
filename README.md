# Mafer Ferretería — Prototipo ecommerce (frontend)

Prototipo en React + Vite. Todo corre en el navegador: los datos se guardan en `localStorage` y las integraciones (Andreani, Mercado Pago) están simuladas.

## Cómo correrlo

```bash
npm install
npm run dev          # desarrollo en http://localhost:5173
npm run build        # build de producción en dist/
npm run build:single # un único index.html autocontenido en dist-single/
```

## Cuentas de prueba

| Rol     | Email             | Contraseña |
|---------|-------------------|------------|
| Admin   | admin@mafer.com   | admin123   |
| Cliente | cliente@demo.com  | demo123    |

## Funcionalidades

**Tienda**
- Inicio con hero, categorías, ofertas, destacados y marcas.
- Catálogo con búsqueda, filtros (categoría, marca, precio, ofertas, stock) y orden.
- Ficha de producto con galería, cuotas, precio por transferencia y cotizador de envío Andreani por código postal.
- Carrito lateral con barra de envío gratis, página de carrito y favoritos.
- Login, registro y "Mi cuenta" con historial de pedidos y seguimiento.
- Modo claro / oscuro.

**Checkout (3 pasos)**
- Datos del cliente (compra como invitado o logueado).
- Entrega: Andreani a domicilio, Andreani a sucursal o retiro gratis en las sucursales Mafer (Concepción y J.B. Alberdi).
- Pago: Mercado Pago (simulación de Checkout Pro con cuotas) o transferencia bancaria con descuento, CBU/alias copiables y subida de comprobante.

**Administración (`/admin`)**
- Resumen con ventas, pedidos, stock bajo.
- Productos: alta, edición, baja, ocultar/destacar, edición rápida de precio, descuento y stock directo en la tabla, fotos (subir/arrastrar, URL, elegir principal), especificaciones.
- Ofertas y precios: descuentos masivos por categoría o marca, y aumentos/bajas de precios por %.
- Pedidos: filtro por estado, detalle, cambiar estado, confirmar transferencias, ver comprobante.
- Configuración: % de descuento por transferencia, envío gratis, cuotas, datos bancarios.

## Para pasar a producción

- **Backend/API**: productos, usuarios, pedidos y autenticación (JWT) reemplazando `src/context/StoreContext.jsx`.
- **Mercado Pago**: crear la preferencia en el backend (Checkout Pro o Bricks) y procesar webhooks de pago.
- **Andreani**: cotizador, sucursales y generación de etiquetas/seguimiento desde el backend con las credenciales de la cuenta.
- **Imágenes**: subirlas a un storage (S3, Cloudinary) en lugar de guardarlas en el navegador.

## Estructura

```
src/
  admin/       Panel de administración y formulario de producto
  components/  Header, footer, carrito lateral, tarjetas, logo y UI común
  context/     Estado global (carrito, favoritos, sesión, productos, pedidos)
  data/        Datos de ejemplo
  pages/       Inicio, catálogo, producto, carrito, checkout, login, cuenta
  styles.css   Estilos y tokens de color (claro / oscuro)
```

## Deploy en Vercel

1. En Vercel: **Add New → Project** e importar este repositorio.
2. Vercel detecta Vite solo. Si pregunta: Build Command `npm run build`, Output Directory `dist`.
3. **Deploy**. No hace falta configurar variables de entorno.

La app usa rutas con `#` (por ejemplo `/#/productos`), así que funciona en cualquier hosting estático sin reglas extra.
