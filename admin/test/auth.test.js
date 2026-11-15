import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AuthError, createAuthClient } from '../src/auth/authClient.js';
import { createAuthStore, getReturnPath } from '../src/auth/authStore.js';

const admin = { id: 'admin-id', email: 'admin@example.com', role: 'admin' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};

test('session verification includes credentials and returns only public admin fields', async () => {
  const client = createAuthClient({ fetchImpl: async (url, options) => {
    assert.equal(url, '/api/auth/me');
    assert.equal(options.credentials, 'include');
    assert.equal(options.cache, 'no-store');
    return json({ user: { ...admin, ignored: 'not returned' } });
  } });
  assert.deepEqual(await client.getSession(), admin);
});

test('expired access uses the refresh endpoint once for concurrent callers', async () => {
  let refreshes = 0;
  const rotation = deferred();
  const client = createAuthClient({ fetchImpl: async (url) => {
    if (url.endsWith('/me')) return json({ error: { message: 'Expired' } }, 401);
    refreshes += 1;
    return rotation.promise;
  } });
  const first = client.getSession();
  const second = client.getSession();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(refreshes, 1);
  rotation.resolve(json({ user: admin }));
  assert.deepEqual(await first, admin);
  assert.deepEqual(await second, admin);
});

test('forbidden sessions and non-admin payloads never refresh or grant access', async () => {
  for (const response of [() => json({ error: { message: 'Admins only' } }, 403), () => json({ user: { ...admin, role: 'user' } })]) {
    let calls = 0;
    const client = createAuthClient({ fetchImpl: async () => { calls += 1; return response(); } });
    await assert.rejects(client.getSession(), (error) => error.status === 403);
    assert.equal(calls, 1);
  }
});

test('missing refresh sessions reject authentication', async () => {
  const client = createAuthClient({ fetchImpl: async () => json({ error: { message: 'No session' } }, 401) });
  await assert.rejects(client.getSession(), (error) => error.status === 401);
});

test('login sends only email and password and rejects non-admin success responses', async () => {
  const client = createAuthClient({ baseUrl: 'https://api.example.com/api/', fetchImpl: async (url, options) => {
    if (url.endsWith('/me')) return json({ user: admin });
    assert.equal(url, 'https://api.example.com/api/auth/login');
    assert.equal(options.method, 'POST');
    assert.equal(options.credentials, 'include');
    assert.deepEqual(JSON.parse(options.body), { email: 'admin@example.com', password: 'test-only-password' });
    return json({ user: admin });
  } });
  assert.deepEqual(await client.login({ email: ' admin@example.com ', password: 'test-only-password', role: 'admin' }), admin);
  const forbidden = createAuthClient({ fetchImpl: async () => json({ user: { ...admin, role: 'user' } }) });
  await assert.rejects(forbidden.login({ email: 'test@example.com', password: 'test-only-password' }), (error) => error.status === 403);
});

test('network errors, timeouts, and non-JSON errors have safe messages', async () => {
  const offline = createAuthClient({ fetchImpl: async () => { throw new TypeError('private diagnostic'); } });
  await assert.rejects(offline.getSession(), (error) => error.status === 0 && !error.message.includes('private diagnostic'));
  const html = createAuthClient({ fetchImpl: async () => new Response('<html>server error</html>', { status: 502 }) });
  await assert.rejects(html.getSession(), (error) => error.status === 502 && !error.message.includes('<html>'));
  const timeout = createAuthClient({ timeoutMs: 5, fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')));
  }) });
  await assert.rejects(timeout.getSession(), /too long/);
});

test('logout waits for refresh to finish before clearing the current session', async () => {
  const rotation = deferred();
  const order = [];
  const client = createAuthClient({ fetchImpl: async (url) => {
    if (url.endsWith('/me')) return json({}, 401);
    if (url.endsWith('/refresh')) { order.push('refresh'); return rotation.promise; }
    order.push('logout');
    return new Response(null, { status: 204 });
  } });
  const session = client.getSession();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const logout = client.logout();
  assert.deepEqual(order, ['refresh']);
  rotation.resolve(json({ user: admin }));
  await Promise.all([session, logout]);
  assert.deepEqual(order, ['refresh', 'logout']);
});

test('a pending unauthorized check cannot refresh after logout starts', async () => {
  const me = deferred();
  const calls = [];
  const client = createAuthClient({ fetchImpl: async (url) => {
    calls.push(url);
    return url.endsWith('/me') ? me.promise : new Response(null, { status: 204 });
  } });
  const session = client.getSession();
  const rejected = assert.rejects(session, (error) => error.status === 401);
  const logout = client.logout();
  me.resolve(json({}, 401));
  await rejected;
  await logout;
  assert.equal(calls.some((url) => url.endsWith('/refresh')), false);
});

test('store starts loading and shares an initial session check', async () => {
  const check = deferred();
  let calls = 0;
  const store = createAuthStore({ getSession() { calls += 1; return check.promise; } });
  assert.equal(store.getSnapshot().status, 'loading');
  const first = store.checkSession();
  const second = store.checkSession();
  assert.equal(first, second);
  check.resolve(admin);
  await first;
  assert.equal(calls, 1);
  assert.deepEqual(store.getSnapshot(), { status: 'authenticated', user: admin, error: null });
});

test('unauthorized, forbidden, missing-user, and non-admin states deny access', async () => {
  for (const value of [new AuthError('No session', 401), new AuthError('Forbidden', 403), { ...admin, role: 'user' }, null]) {
    const store = createAuthStore({ async getSession() { if (value instanceof Error) throw value; return value; } });
    await store.checkSession();
    assert.equal(store.getSnapshot().status, 'anonymous');
    assert.equal(store.getSnapshot().user, null);
  }
});

test('server outages deny access and allow a successful retry', async () => {
  let online = false;
  const store = createAuthStore({ async getSession() { if (!online) throw new AuthError('Server unavailable'); return admin; } });
  await store.checkSession();
  assert.equal(store.getSnapshot().status, 'error');
  assert.equal(store.getSnapshot().user, null);
  online = true;
  await store.checkSession();
  assert.equal(store.getSnapshot().status, 'authenticated');
});

test('role changes invalidate an already authenticated session', async () => {
  let allowed = true;
  const store = createAuthStore({ async getSession() { if (!allowed) throw new AuthError('Forbidden', 403); return admin; } });
  await store.checkSession();
  allowed = false;
  await store.checkSession();
  assert.equal(store.getSnapshot().status, 'anonymous');
});

test('logout prevents a pending session check from restoring dashboard access', async () => {
  const pending = deferred();
  const store = createAuthStore({ getSession: () => pending.promise, logout: async () => {} });
  const check = store.checkSession();
  await store.logout();
  pending.resolve(admin);
  await check;
  assert.equal(store.getSnapshot().status, 'anonymous');
  assert.equal(store.getSnapshot().user, null);
});

test('a late initial check cannot overwrite a successful login', async () => {
  const pending = deferred();
  const store = createAuthStore({ getSession: () => pending.promise, login: async () => admin });
  const initial = store.checkSession();
  await store.login({ email: admin.email, password: 'test-only-password' });
  pending.reject(new AuthError('Missing session', 401));
  await initial;
  assert.equal(store.getSnapshot().status, 'authenticated');
});

test('failed logout is visible to the caller and does not claim the server session ended', async () => {
  const store = createAuthStore({ getSession: async () => admin, logout: async () => { throw new AuthError('Offline'); } });
  await store.checkSession();
  await assert.rejects(store.logout(), /Offline/);
  assert.equal(store.getSnapshot().status, 'authenticated');
});

test('return destinations preserve internal paths and reject external redirects', () => {
  assert.equal(getReturnPath({ pathname: '/projects', search: '?new=1', hash: '#details' }), '/projects?new=1#details');
  for (const pathname of ['https://example.com', '//example.com', '/\\example.com', '/login']) {
    assert.equal(getReturnPath({ pathname }), '/');
  }
  assert.equal(getReturnPath(null), '/');
});

test('login waits for earlier session checks before setting new session cookies', async () => {
  const initial = deferred();
  const calls = [];
  let checked = false;
  const client = createAuthClient({ fetchImpl: async (url) => {
    calls.push(url);
    if (url.endsWith('/login')) return json({ user: admin });
    if (!checked) { checked = true; return initial.promise; }
    return json({ user: admin });
  } });
  const oldCheck = client.getSession();
  const rejected = assert.rejects(oldCheck, (error) => error.status === 401);
  const login = client.login({ email: admin.email, password: 'test-only-password' });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(calls, ['/api/auth/me']);
  initial.resolve(json({}, 401));
  await rejected;
  assert.deepEqual(await login, admin);
  assert.deepEqual(calls, ['/api/auth/me', '/api/auth/login', '/api/auth/me']);
});

test('login requires cookies to establish the same administrator session', async () => {
  const missing = createAuthClient({ fetchImpl: async (url) => url.endsWith('/login') ? json({ user: admin }) : json({}, 401) });
  await assert.rejects(missing.login({ email: admin.email, password: 'test-only-password' }), (error) => error.status === 401);
  const mismatch = createAuthClient({ fetchImpl: async (url) => json({ user: url.endsWith('/login') ? admin : { ...admin, id: 'other-admin' } }) });
  await assert.rejects(mismatch.login({ email: admin.email, password: 'test-only-password' }), (error) => error.status === 401);
});
