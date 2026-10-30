import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { LogoImg } from '../components/ui.jsx';

export default function Auth() {
  const { login, register, toast } = useStore();
  const nav = useNavigate();
  const loc = useLocation();
  const redirect = new URLSearchParams(loc.search).get('next');
  const [mode, setMode] = useState('login');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError('');
    let res;
    if (mode === 'login') res = login(f.email, f.password);
    else {
      if (f.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
      if (f.password !== f.confirm) return setError('Las contraseñas no coinciden');
      res = register(f);
    }
    if (res.error) return setError(res.error);
    nav(redirect || (res.user.role === 'admin' ? '/admin' : '/'));
  };

  const demo = (email, password) => setF({ ...f, email, password });

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <LogoImg variant="dark" className="logo-auth" />
        <h2>Bienvenido a <span className="accent">Mafer</span></h2>
        <p>Guardá tus favoritos, seguí tus envíos de Andreani y comprá más rápido.</p>
        <ul>
          <li>✓ Historial de pedidos y seguimiento</li>
          <li>✓ Direcciones guardadas</li>
          <li>✓ Ofertas exclusivas para clientes</li>
        </ul>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => { setMode('login'); setError(''); }}>Iniciar sesión</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => { setMode('register'); setError(''); }}>Crear cuenta</button>
        </div>
        {mode === 'register' && (
          <>
            <Field icon={User} label="Nombre y apellido"><input required value={f.name} onChange={on('name')} autoComplete="name" /></Field>
            <Field icon={Phone} label="Teléfono"><input value={f.phone} onChange={on('phone')} autoComplete="tel" placeholder="3865 000000" /></Field>
          </>
        )}
        <Field icon={Mail} label="Email"><input required type="email" value={f.email} onChange={on('email')} autoComplete="email" /></Field>
        <Field icon={Lock} label="Contraseña">
          <input required type={show ? 'text' : 'password'} value={f.password} onChange={on('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          <button type="button" className="icon-btn sm" onClick={() => setShow(!show)} aria-label="Mostrar contraseña">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </Field>
        {mode === 'register' && (
          <Field icon={Lock} label="Repetir contraseña"><input required type={show ? 'text' : 'password'} value={f.confirm} onChange={on('confirm')} autoComplete="new-password" /></Field>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary btn-block btn-lg" type="submit">{mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</button>
        {mode === 'login' && <button type="button" className="link small center">¿Olvidaste tu contraseña?</button>}
        <div className="divider"><span>o</span></div>
        <button type="button" className="btn btn-outline btn-block" onClick={() => toast('Login con Google: disponible al conectar el backend (OAuth)', 'info')}>
          <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continuar con Google
        </button>
        <div className="demo-box small">
          <b>Cuentas de prueba</b>
          <button type="button" className="link" onClick={() => demo('admin@mafer.com', 'admin123')}>Admin: admin@mafer.com / admin123</button>
          <button type="button" className="link" onClick={() => demo('cliente@demo.com', 'demo123')}>Cliente: cliente@demo.com / demo123</button>
        </div>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-icon"><Icon size={16} />{children}</div>
    </label>
  );
}
