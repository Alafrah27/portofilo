import { AuthError, createAuthClient } from './authClient.js';

export function createAuthStore(client) {
  let state = { status: 'loading', user: null, error: null };
  let generation = 0;
  let pending = null;
  let mutation = false;
  const listeners = new Set();

  function publish(next) {
    state = next;
    listeners.forEach((listener) => listener());
  }
  function authenticated(user) {
    if (!user || user.role !== 'admin') throw new AuthError('Administrator access is required.', 403);
    return { status: 'authenticated', user, error: null };
  }

  const store = {
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    checkSession() {
      if (mutation) return Promise.resolve(state);
      if (pending?.generation === generation) return pending.promise;
      const current = generation;
      const promise = Promise.resolve().then(() => client.getSession()).then((user) => {
        if (current === generation) publish(authenticated(user));
      }).catch((error) => {
        if (current !== generation) return;
        const unauthorized = error.status === 401 || error.status === 403;
        publish({ status: unauthorized ? 'anonymous' : 'error', user: null, error: unauthorized ? null : error.message });
      }).finally(() => {
        if (pending?.promise === promise) pending = null;
      });
      pending = { generation: current, promise };
      return promise;
    },
    async login(credentials) {
      const current = ++generation;
      mutation = true;
      try {
        const user = await client.login(credentials);
        if (current === generation) publish(authenticated(user));
      } catch (error) {
        if (current === generation) publish({ status: 'anonymous', user: null, error: null });
        throw error;
      } finally {
        if (current === generation) mutation = false;
      }
    },
    async logout() {
      const current = ++generation;
      mutation = true;
      try {
        await client.logout();
        if (current === generation) publish({ status: 'anonymous', user: null, error: null });
      } finally {
        if (current === generation) mutation = false;
      }
    },
  };
  return store;
}

export function getReturnPath(from) {
  const pathname = typeof from?.pathname === 'string' ? from.pathname : '/';
  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('\\') || pathname === '/login') return '/';
  const search = typeof from?.search === 'string' && from.search.startsWith('?') ? from.search : '';
  const hash = typeof from?.hash === 'string' && from.hash.startsWith('#') ? from.hash : '';
  return pathname + search + hash;
}

export const authClient = createAuthClient({ baseUrl: import.meta.env?.VITE_API_BASE_URL || '/api' });
export const authStore = createAuthStore(authClient);
