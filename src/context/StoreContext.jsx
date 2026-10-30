import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_ORDERS, SEED_PRODUCTS, SEED_SETTINGS, SEED_USERS } from '../data/products.js';
import { finalPrice, uid } from '../utils.js';

const StoreContext = createContext(null);
const KEY = 'mafer-store-v2'; // se cambia al modificar los datos de ejemplo

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialTheme = () => {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export function StoreProvider({ children }) {
  const saved = load();
  const [products, setProducts] = useState(saved?.products ?? SEED_PRODUCTS);
  const [users, setUsers] = useState(saved?.users ?? SEED_USERS);
  const [orders, setOrders] = useState(saved?.orders ?? SEED_ORDERS);
  const [settings, setSettings] = useState(saved?.settings ?? SEED_SETTINGS);
  const [cart, setCart] = useState(saved?.cart ?? []); // [{id, qty}]
  const [favorites, setFavorites] = useState(saved?.favorites ?? []);
  const [userId, setUserId] = useState(saved?.userId ?? null);
  const [theme, setTheme] = useState(saved?.theme ?? initialTheme());
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ products, users, orders, settings, cart, favorites, userId, theme }));
    } catch {
      /* almacenamiento lleno o bloqueado: el prototipo sigue funcionando en memoria */
    }
  }, [products, users, orders, settings, cart, favorites, userId, theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toast = useCallback((msg, tone = 'ok') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const user = users.find((u) => u.id === userId) || null;
  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const cartItems = cart
    .map((c) => ({ ...c, product: byId[c.id] }))
    .filter((c) => c.product && c.product.active);
  const cartCount = cartItems.reduce((s, c) => s + c.qty, 0);
  const cartSubtotal = cartItems.reduce((s, c) => s + finalPrice(c.product) * c.qty, 0);
  const cartWeight = cartItems.reduce((s, c) => s + (c.product.weight || 1) * c.qty, 0);

  const api = {
    products, settings, orders, users, user, theme, toasts, favorites, cartOpen,
    cartItems, cartCount, cartSubtotal, cartWeight, byId,
    toast,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    setCartOpen,

    addToCart(id, qty = 1, { open = true } = {}) {
      const p = byId[id];
      if (!p || p.stock <= 0) return toast('Producto sin stock', 'danger');
      setCart((c) => {
        const found = c.find((x) => x.id === id);
        if (found) return c.map((x) => (x.id === id ? { ...x, qty: Math.min(p.stock, x.qty + qty) } : x));
        return [...c, { id, qty: Math.min(p.stock, qty) }];
      });
      toast('Agregado al carrito');
      if (open) setCartOpen(true);
    },
    setQty(id, qty) {
      const p = byId[id];
      if (qty <= 0) return setCart((c) => c.filter((x) => x.id !== id));
      setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.min(p?.stock ?? qty, qty) } : x)));
    },
    removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
    clearCart: () => setCart([]),

    isFav: (id) => favorites.includes(id),
    toggleFav(id) {
      const had = favorites.includes(id);
      setFavorites((f) => (had ? f.filter((x) => x !== id) : [...f, id]));
      toast(had ? 'Quitado de favoritos' : 'Guardado en favoritos', had ? 'info' : 'ok');
    },

    // Autenticación simulada. En producción: backend con JWT / OAuth.
    login(email, password) {
      const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
      if (!u) return { error: 'Email o contraseña incorrectos' };
      setUserId(u.id);
      toast(`¡Hola, ${u.name.split(' ')[0]}!`);
      return { user: u };
    },
    register({ name, email, password, phone }) {
      if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
        return { error: 'Ya existe una cuenta con ese email' };
      const u = { id: uid('u'), name, email: email.trim(), password, phone, role: 'customer' };
      setUsers((us) => [...us, u]);
      setUserId(u.id);
      toast('¡Cuenta creada! Bienvenido/a a Mafer');
      return { user: u };
    },
    logout() {
      setUserId(null);
      toast('Sesión cerrada', 'info');
    },
    updateProfile(patch) {
      setUsers((us) => us.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
      toast('Datos actualizados');
    },

    placeOrder(order) {
      const id = `MF-${24071 + orders.length}`;
      const full = { ...order, id, userId, date: new Date().toISOString() };
      setOrders((o) => [full, ...o]);
      // descuenta stock
      setProducts((ps) =>
        ps.map((p) => {
          const it = order.items.find((i) => i.id === p.id);
          return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
        })
      );
      setCart([]);
      return full;
    },

    // ---- Administración ----
    saveProduct(prod) {
      setProducts((ps) => {
        if (prod.id && ps.some((p) => p.id === prod.id)) return ps.map((p) => (p.id === prod.id ? prod : p));
        return [{ ...prod, id: uid('p'), rating: 0, reviews: 0 }, ...ps];
      });
      toast(prod.id ? 'Producto actualizado' : 'Producto creado');
    },
    updateProduct: (id, patch) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    deleteProduct(id) {
      setProducts((ps) => ps.filter((p) => p.id !== id));
      setCart((c) => c.filter((x) => x.id !== id));
      toast('Producto eliminado', 'info');
    },
    bulkUpdate(ids, fn) {
      const set = new Set(ids);
      setProducts((ps) => ps.map((p) => (set.has(p.id) ? fn(p) : p)));
    },
    updateOrder: (id, patch) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    saveSettings(s) {
      setSettings(s);
      toast('Configuración guardada');
    },
    resetDemo() {
      setProducts(SEED_PRODUCTS);
      setUsers(SEED_USERS);
      setOrders(SEED_ORDERS);
      setSettings(SEED_SETTINGS);
      setCart([]);
      setFavorites([]);
      toast('Datos de demo restaurados', 'info');
    },
  };

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
