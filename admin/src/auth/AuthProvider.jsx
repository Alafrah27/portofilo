import { useEffect, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './authContext.js';
import { authStore } from './authStore.js';

export default function AuthProvider({ children }) {
  const snapshot = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const { pathname } = useLocation();

  useEffect(() => { void authStore.checkSession(); }, [pathname]);

  useEffect(() => {
    const recheck = () => {
      if (document.visibilityState === 'visible' && authStore.getSnapshot().status === 'authenticated') {
        void authStore.checkSession();
      }
    };
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);
    const timer = window.setInterval(recheck, 60000);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
      window.clearInterval(timer);
    };
  }, []);

  return <AuthContext.Provider value={{
    ...snapshot, login: authStore.login, logout: authStore.logout, checkSession: authStore.checkSession,
  }}>{children}</AuthContext.Provider>;
}
