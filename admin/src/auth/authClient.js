export class AuthError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export function createAuthClient({ baseUrl = '/api', fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  const base = baseUrl.replace(/\/+$/, '');
  let refreshPromise = null;
  let sessionPromise = null;
  let sessionVersion = 0;
  let mutationVersion = 0;

  async function request(path, { method = 'GET', body, timeoutMs: requestTimeout = timeoutMs } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeout);
    const multipart = typeof FormData !== 'undefined' && body instanceof FormData;
    try {
      const response = await fetchImpl(base + path, {
        method,
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal,
        ...(body === undefined ? {} : multipart ? { body } : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
      });
      const data = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok) {
        const message = typeof data?.error?.message === 'string'
          ? data.error.message : 'Unable to complete the request.';
        throw new AuthError(message, response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(controller.signal.aborted
        ? 'The server took too long to respond. Please try again.'
        : 'Unable to reach the server. Please try again.');
    } finally {
      clearTimeout(timeout);
    }
  }

  function readAdmin(data) {
    const user = data?.user;
    if (!user || user.role !== 'admin' || typeof user.id !== 'string' || typeof user.email !== 'string') {
      throw new AuthError('Administrator access is required.', 403);
    }
    return { id: user.id, email: user.email, role: user.role };
  }

  function refresh() {
    if (!refreshPromise) {
      refreshPromise = request('/auth/refresh', { method: 'POST' }).then((data) => {
        sessionVersion += 1;
        return readAdmin(data);
      }).finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
  }

  async function verifySession() {
    const version = sessionVersion;
    const mutation = mutationVersion;
    try {
      return readAdmin(await request('/auth/me'));
    } catch (error) {
      if (error.status !== 401 || mutation !== mutationVersion) throw error;
      if (version !== sessionVersion) return readAdmin(await request('/auth/me'));
      return refresh();
    }
  }

  function getSession() {
      if (!sessionPromise) {
        sessionPromise = verifySession().finally(() => { sessionPromise = null; });
      }
      return sessionPromise;
  }

  return {
    getSession,
    async apiRequest(path, options) {
      const mutation = mutationVersion;
      await getSession();
      if (mutation !== mutationVersion) throw new AuthError('Your session changed. Please try again.', 401);
      try {
        return await request(path, options);
      } catch (error) {
        if (error.status !== 401 || mutation !== mutationVersion) throw error;
        await getSession();
        if (mutation !== mutationVersion) throw error;
        return request(path, options);
      }
    },
    async login({ email, password }) {
      mutationVersion += 1;
      if (sessionPromise) await sessionPromise.catch(() => {});
      const data = await request('/auth/login', { method: 'POST', body: { email: email.trim(), password } });
      sessionVersion += 1;
      const signedIn = readAdmin(data);
      const verified = readAdmin(await request('/auth/me'));
      if (signedIn.id !== verified.id) throw new AuthError('Your sign-in session could not be verified. Please try again.', 401);
      return verified;
    },
    async logout() {
      mutationVersion += 1;
      // Let earlier session checks finish before revoking the current cookie pair.
      if (sessionPromise) await sessionPromise.catch(() => {});
      await request('/auth/logout', { method: 'POST' });
      sessionVersion += 1;
    },
  };
}
