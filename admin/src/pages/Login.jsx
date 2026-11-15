import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/useAuth.js';
import { getReturnPath } from '../auth/authStore.js';
import SessionLoading from '../auth/SessionLoading.jsx';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { status, user, error, login, checkSession } = useAuth();
  const location = useLocation();
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://musdar.com';

  if (status === 'loading') return <SessionLoading />;
  if (status === 'authenticated' && user?.role === 'admin') return <Navigate to={getReturnPath(location.state?.from)} replace />;

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    const form = new FormData(event.currentTarget);
    setLoginError('');
    setIsLoading(true);
    try {
      await login({ email: String(form.get('email') || ''), password: String(form.get('password') || '') });
    } catch (failure) {
      setLoginError(failure.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-dark-900 px-5 py-10 font-sans">
      <a href={websiteUrl} aria-label="Musdar website" className="mb-10 flex items-center gap-3">
        <img src="/musdar-logo.png" alt="" className="h-11 w-11 object-contain brightness-0 invert" />
        <span className="text-2xl font-semibold tracking-tight text-white">Musdar<span className="text-primary-500">.dev</span></span>
      </a>
      <div className="admin-card w-full max-w-md p-7 sm:p-10">
        <p className="eyebrow mb-3">Admin workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome <span className="gradient-text">back.</span></h1>
        <p className="mt-3 text-xs leading-6 text-gray-400">Sign in with your administrator account.</p>
        <form className="mt-8 space-y-5" onSubmit={handleLogin} aria-busy={isLoading}>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs text-gray-300">Email</label>
            <div className="relative"><Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" /><input id="email" name="email" type="email" autoComplete="username" required disabled={isLoading} placeholder="you@example.com" className="admin-input w-full pl-11 disabled:opacity-60" /></div>
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-xs text-gray-300">Password</label>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required minLength={6} maxLength={72} disabled={isLoading} placeholder="Enter your password" className="admin-input w-full pl-11 pr-12 disabled:opacity-60" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((show) => !show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </div>
          {(loginError || error) && <div role="alert" className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs leading-5 text-red-300">{loginError || error}</div>}
          <button type="submit" disabled={isLoading} className="btn-primary mt-2 w-full">{isLoading ? 'Signing in…' : <>Enter workspace <ArrowRight size={16} /></>}</button>
        </form>
        {status === 'error' && <button type="button" onClick={() => { setLoginError(''); void checkSession(); }} className="mt-4 text-xs text-primary-400 hover:text-white">Retry connection</button>}
      </div>
      <a href={websiteUrl} className="mt-7 flex items-center gap-2 text-xs text-gray-500 hover:text-primary-400"><ArrowLeft size={14} /> Return to website</a>
    </div>
  );
};
export default Login;
