import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AuthError, createAuthClient } from '../src/auth/authClient.js';
import { createProjectClient, projectForm, validateImages } from '../src/projects/projectClient.js';

const admin = { id: 'admin-id', email: 'admin@example.test', role: 'admin' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const image = () => new File(['image-content'], 'cover.png', { type: 'image/png' });
const data = () => ({ title: ' Portfolio ', description: '<h3>Story</h3><p>Details</p>', files: [image()] });

test('project form sends only required text and repeated image files', () => {
  const body = projectForm({ ...data(), files: [image(), image()], status: 'planning', userId: 'ignored' });
  assert.deepEqual([...body.keys()], ['title', 'description', 'images', 'images']);
  assert.equal(body.get('title'), 'Portfolio');
  assert.equal(body.get('description'), '<h3>Story</h3><p>Details</p>');
  assert.equal(body.getAll('images').length, 2);
});

test('create requires story and images; text-only editing omits images to preserve gallery', () => {
  for (const description of ['', ' ', '<p></p>', '<p>&nbsp;</p>', '<p><br></p>']) {
    assert.throws(() => projectForm({ ...data(), description }), /story/);
  }
  assert.throws(() => projectForm({ ...data(), title: ' ' }), /name/);
  assert.throws(() => projectForm({ ...data(), title: 'x'.repeat(201) }), /name/);
  assert.throws(() => projectForm({ ...data(), description: 'x'.repeat(100001) }), /story/);
  assert.throws(() => projectForm({ ...data(), files: [] }), /at least one/);
  const edit = projectForm({ ...data(), files: [] }, { editing: true });
  assert.equal(edit.has('images'), false);
});

test('optional live website URLs are validated, trimmed, preserved when omitted, and explicitly cleared', () => {
  const withWebsite = projectForm({ ...data(), websiteUrl: '  https://flourandfirewood.netlify.app/  ' });
  assert.equal(withWebsite.get('websiteUrl'), 'https://flourandfirewood.netlify.app/');
  assert.equal(withWebsite.getAll('images').length, 1);
  assert.equal(projectForm({ ...data(), websiteUrl: '' }, { editing: true }).get('websiteUrl'), '');
  assert.equal(projectForm(data(), { editing: true }).has('websiteUrl'), false);
  for (const websiteUrl of [null, 123, 'javascript:alert(1)', 'data:text/html,test', 'ftp://example.com/file', 'invalid',
    '/relative', 'https://user:password@example.com/', `https://example.com/${'a'.repeat(2048)}`]) {
    assert.throws(() => projectForm({ ...data(), websiteUrl }), /website URL/);
  }
});

test('client validates exact image count, size boundaries, and accepted formats', () => {
  validateImages(Array.from({ length: 10 }, image));
  assert.throws(() => validateImages(Array.from({ length: 11 }, image)), /10/);
  validateImages([{ type: 'image/jpeg', size: 5 * 1024 * 1024 }, { type: 'image/webp', size: 1 }]);
  assert.throws(() => validateImages([{ type: 'image/png', size: 5 * 1024 * 1024 + 1 }]), /5MB/);
  assert.throws(() => validateImages([{ type: 'image/svg+xml', size: 10 }]), /JPEG/);
});

test('project client uses list/get/create/PATCH/delete endpoints and returns saved records', async () => {
  const calls = [];
  const project = { _id: 'abc', title: 'Portfolio', images: [] };
  const client = createProjectClient({ request: async (path, options) => {
    calls.push({ path, options });
    return options?.method === 'DELETE' ? null : path === '/projects' && !options ? { projects: [project] } : { project };
  } });
  assert.deepEqual(await client.list(), [project]);
  assert.deepEqual(await client.get('abc'), project);
  assert.deepEqual(await client.create(data()), project);
  assert.deepEqual(await client.update('abc', { ...data(), files: [] }), project);
  await client.remove('abc');
  assert.deepEqual(calls.map(({ path, options }) => [path, options?.method || 'GET']), [
    ['/projects', 'GET'], ['/projects/abc', 'GET'], ['/projects', 'POST'], ['/projects/abc', 'PATCH'], ['/projects/abc', 'DELETE'],
  ]);
  assert.equal(calls[3].options.body.has('images'), false);
  assert.equal(calls[2].options.timeoutMs, 180000);
});

test('invalid forms send no requests; authorization errors recheck session and server errors remain visible', async () => {
  let calls = 0;
  let checks = 0;
  let status = 403;
  const client = createProjectClient({ request: async () => { calls++; throw new AuthError('API error', status); }, onUnauthorized: async () => { checks++; } });
  await assert.rejects(client.create({ ...data(), files: [] }), /image/);
  assert.equal(calls, 0);
  await assert.rejects(client.remove('abc'), /API error/);
  assert.equal(checks, 1);
  status = 502;
  await assert.rejects(client.update('abc', data()), (error) => error.status === 502);
  assert.equal(checks, 1);
});

test('authenticated multipart requests include cookies and let browser set the boundary', async () => {
  const body = projectForm(data());
  const client = createAuthClient({ fetchImpl: async (url, options) => {
    if (url.endsWith('/me')) return json({ user: admin });
    assert.equal(url, '/api/projects');
    assert.equal(options.credentials, 'include');
    assert.equal(options.method, 'POST');
    assert.equal(options.body, body);
    assert.equal(options.headers, undefined);
    return json({ project: { _id: 'saved' } }, 201);
  } });
  assert.equal((await client.apiRequest('/projects', { method: 'POST', body })).project._id, 'saved');
});

test('project requests share refresh rotation with session checks', async () => {
  let expired = true;
  let refreshes = 0;
  const client = createAuthClient({ fetchImpl: async (url) => {
    if (url.endsWith('/me')) return expired ? json({}, 401) : json({ user: admin });
    if (url.endsWith('/refresh')) { refreshes++; expired = false; return json({ user: admin }); }
    return json({ projects: [] });
  } });
  await Promise.all([client.getSession(), client.apiRequest('/projects'), client.apiRequest('/projects')]);
  assert.equal(refreshes, 1);
});

test('only unauthorized requests retry once; server failures never repeat project writes', async () => {
  for (const status of [401, 403, 502]) {
    let writes = 0;
    const client = createAuthClient({ fetchImpl: async (url) => {
      if (url.endsWith('/me')) return json({ user: admin });
      writes++;
      return json({ error: { message: 'Rejected' } }, status);
    } });
    await assert.rejects(client.apiRequest('/projects', { method: 'POST', body: projectForm(data()) }), /Rejected/);
    assert.equal(writes, status === 401 ? 2 : 1);
  }
});
