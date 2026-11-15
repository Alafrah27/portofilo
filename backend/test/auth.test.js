import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { getConfig } from '../src/config.js';
import { User, validPassword } from '../src/model/User.js';
import { createAdmin } from '../src/services/createAdmin.js';
import { ACCESS_SECONDS, AUDIENCE, hashToken, ISSUER, REFRESH_SECONDS } from '../src/utils/session.js';

const password = 'Correct horse battery 42!';
const origin = 'http://localhost:5173';
const environment = {
  NODE_ENV: 'test', MONGO_URL: 'mongodb://127.0.0.1:27017/test-placeholder',
  JWT_ACCESS_SECRET: randomBytes(48).toString('hex'),
  JWT_REFRESH_SECRET: randomBytes(48).toString('hex'),
  ADMIN_ORIGINS: origin,
};
let config;
let database;
let app;
let admin;
let ordinaryUser;

before(async () => {
  database = await MongoMemoryServer.create({ instance: { dbName: 'musdar_auth_test' } });
  config = getConfig({ ...environment, MONGO_URL: database.getUri() });
  await mongoose.connect(config.mongoUrl);
  await User.init();
}, { timeout: 180000 });

after(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  [admin, ordinaryUser] = await Promise.all([
    User.create({ email: 'admin@example.com', password, role: 'admin' }),
    User.create({ email: 'user@example.com', password }),
  ]);
  app = createApp(config);
});

function cookieHeader(response) {
  return response.headers['set-cookie'].map((cookie) => cookie.split(';')[0]).join('; ');
}

function tokenCookie(response, name) {
  return response.headers['set-cookie'].find((cookie) => cookie.startsWith(`${name}=`)).split(';')[0].slice(name.length + 1);
}

function login(email = admin.email, secret = password, target = app) {
  return request(target).post('/api/auth/login').set('Origin', origin).send({ email, password: secret });
}

function signedToken(type, options = {}, claims = {}) {
  return jwt.sign({ tokenType: type, ...claims }, type === 'access' ? config.accessSecret : config.refreshSecret, {
    algorithm: 'HS256', subject: String(admin._id), jwtid: randomBytes(16).toString('hex'),
    issuer: ISSUER, audience: AUDIENCE, expiresIn: 60, ...options,
  });
}

test('password policy accepts six characters and rejects fewer than six or more than 72 UTF-8 bytes', () => {
  assert.equal(validPassword('Ab123!'), true);
  assert.equal(validPassword('Ab12!'), false);
  assert.equal(validPassword('é'.repeat(6)), true);
  assert.equal(validPassword('é'.repeat(37)), false);
});

test('schema defaults, unique normalized email, password hashing, and credential privacy', async () => {
  assert.equal(ordinaryUser.role, 'user');
  const normalized = await User.create({ email: '  NORMALIZED@Example.com  ', password });
  assert.equal(normalized.email, 'normalized@example.com');
  await assert.rejects(User.create({ email: 'NORMALIZED@example.com', password }), (error) => error.code === 11000);
  await assert.rejects(User.create({ email: 'bad@example.com', password: 'short' }));
  await assert.rejects(User.create({ email: 'long@example.com', password: 'é'.repeat(37) }));
  await assert.rejects(User.create({ email: 'role@example.com', password, role: 'superadmin' }));
  const selected = await User.findById(admin._id).select('+password +accessToken +refreshToken');
  assert.notEqual(selected.password, password);
  assert.equal(bcrypt.getRounds(selected.password), 12);
  assert.equal(await bcrypt.compare(password, selected.password), true);
  const previousHash = selected.password;
  selected.email = 'changed@example.com';
  await selected.save();
  assert.equal(selected.password, previousHash);
  for (const key of ['password', 'accessToken', 'refreshToken']) {
    assert.equal(Object.hasOwn(selected.toJSON(), key), false);
    assert.equal(Object.hasOwn(selected.toObject(), key), false);
    assert.equal((await User.findById(admin._id))[key], undefined);
  }
});

test('admin login sets HttpOnly cookies and stores only token hashes', async () => {
  const response = await login('  ADMIN@EXAMPLE.COM  ').expect(200);
  assert.deepEqual(response.body, { user: { id: String(admin._id), email: admin.email, role: 'admin' } });
  assert.equal(response.headers['cache-control'], 'no-store');
  for (const cookie of response.headers['set-cookie']) {
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    assert.doesNotMatch(cookie, /; Secure/);
  }
  assert.match(response.headers['set-cookie'][0], /Path=\/api;/);
  assert.match(response.headers['set-cookie'][1], /Path=\/api\/auth;/);
  const stored = await User.findById(admin._id).select('+accessToken +refreshToken');
  for (const [field, secret, ttl] of [['accessToken', config.accessSecret, ACCESS_SECONDS], ['refreshToken', config.refreshSecret, REFRESH_SECONDS]]) {
    const raw = tokenCookie(response, field);
    assert.equal(stored[field], hashToken(raw));
    const payload = jwt.verify(raw, secret);
    assert.equal(payload.exp - payload.iat, ttl);
    assert.equal(payload.sub, String(admin._id));
  }
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(response)).expect(200, response.body);
});

test('production cookies are Secure', async () => {
  const response = await login(admin.email, password, createApp({ ...config, nodeEnv: 'production' })).expect(200);
  assert.ok(response.headers['set-cookie'].every((cookie) => cookie.includes('; Secure')));
});

test('ordinary users cannot login or grant themselves admin privileges', async () => {
  const response = await request(app).post('/api/auth/login').send({ email: ordinaryUser.email, password, role: 'admin' }).expect(403);
  assert.equal(response.headers['set-cookie'], undefined);
  const stored = await User.findById(ordinaryUser._id).select('+accessToken +refreshToken');
  assert.equal(stored.role, 'user');
  assert.equal(stored.accessToken, null);
  assert.equal(stored.refreshToken, null);
});

test('unknown email and incorrect password return identical credential errors', async () => {
  const unknown = await login('unknown@example.com').expect(401);
  const incorrect = await login(admin.email, 'incorrect password').expect(401);
  assert.deepEqual(unknown.body, incorrect.body);
  assert.equal(unknown.headers['set-cookie'], undefined);
});

test('authentication rejects missing, expired, tampered, wrong-type, and invalid-claim tokens', async () => {
  await request(app).get('/api/auth/me').expect(401);
  const response = await login().expect(200);
  const access = tokenCookie(response, 'accessToken');
  const invalid = [
    `${access.slice(0, -5)}abcde`, signedToken('access', { expiresIn: -1 }),
    signedToken('access', {}, { tokenType: 'refresh' }),
    signedToken('access', { algorithm: 'HS384' }), signedToken('access', { audience: 'wrong' }),
    signedToken('access', { issuer: 'wrong' }), signedToken('access', { subject: 'not-an-object-id' }),
    tokenCookie(response, 'refreshToken'),
  ];
  for (const token of invalid) {
    await request(app).get('/api/auth/me').set('Cookie', `accessToken=${token}`).expect(401);
  }
  await request(app).get('/api/auth/me').set('Authorization', `Bearer ${access}`).expect(401);
});

test('refresh rotates both cookies and rejects old access and refresh tokens', async () => {
  const first = await login().expect(200);
  const rotated = await request(app).post('/api/auth/refresh').set('Cookie', cookieHeader(first)).expect(200);
  assert.notEqual(tokenCookie(rotated, 'accessToken'), tokenCookie(first, 'accessToken'));
  assert.notEqual(tokenCookie(rotated, 'refreshToken'), tokenCookie(first, 'refreshToken'));
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(first)).expect(401);
  await request(app).post('/api/auth/refresh').set('Cookie', cookieHeader(first)).expect(401);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(rotated)).expect(200);
});

test('expired access clears only its cookie and preserves the ability to refresh', async () => {
  const first = await login().expect(200);
  const expired = signedToken('access', { expiresIn: -1 });
  const response = await request(app).get('/api/auth/me')
    .set('Cookie', `accessToken=${expired}; refreshToken=${tokenCookie(first, 'refreshToken')}`).expect(401);
  assert.equal(response.headers['set-cookie'].length, 1);
  assert.match(response.headers['set-cookie'][0], /^accessToken=;/);
  const refreshed = await request(app).post('/api/auth/refresh')
    .set('Cookie', `refreshToken=${tokenCookie(first, 'refreshToken')}`).expect(200);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(refreshed)).expect(200);
});

test('refresh rejects missing, expired, tampered, and wrong-type cookies', async () => {
  const response = await login().expect(200);
  await request(app).post('/api/auth/refresh').expect(401);
  for (const token of [signedToken('refresh', { expiresIn: -1 }), 'tampered', tokenCookie(response, 'accessToken'), signedToken('refresh', {}, { tokenType: 'access' })]) {
    await request(app).post('/api/auth/refresh').set('Cookie', `refreshToken=${token}`).expect(401);
  }
});

test('only one simultaneous refresh succeeds', async () => {
  const first = await login().expect(200);
  const responses = await Promise.all([1, 2].map(() => request(app).post('/api/auth/refresh').set('Cookie', cookieHeader(first))));
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 401]);
  const winner = responses.find((response) => response.status === 200);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(winner)).expect(200);
});

test('a new login replaces the old session, and stale logout does not revoke the new one', async () => {
  const first = await login().expect(200);
  const second = await login().expect(200);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(first)).expect(401);
  await request(app).post('/api/auth/logout').set('Cookie', cookieHeader(first)).expect(204);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(second)).expect(200);
});

test('logout revokes both tokens, clears cookie paths, and is idempotent', async () => {
  const response = await login().expect(200);
  const logout = await request(app).post('/api/auth/logout').set('Cookie', cookieHeader(response)).expect(204);
  assert.equal(logout.headers['set-cookie'].length, 2);
  assert.ok(logout.headers['set-cookie'].every((cookie) => cookie.includes('Expires=Thu, 01 Jan 1970')));
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(response)).expect(401);
  await request(app).post('/api/auth/refresh').set('Cookie', cookieHeader(response)).expect(401);
  await request(app).post('/api/auth/logout').expect(204);
  const stored = await User.findById(admin._id).select('+accessToken +refreshToken');
  assert.equal(stored.accessToken, null);
  assert.equal(stored.refreshToken, null);
});

test('logout works using the refresh cookie when the access token is expired', async () => {
  const response = await login().expect(200);
  const cookies = `accessToken=${signedToken('access', { expiresIn: -1 })}; refreshToken=${tokenCookie(response, 'refreshToken')}`;
  await request(app).post('/api/auth/logout').set('Cookie', cookies).expect(204);
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(response)).expect(401);
});

test('database role demotion blocks access and refresh immediately', async () => {
  const response = await login().expect(200);
  await User.updateOne({ _id: admin._id }, { $set: { role: 'user' } });
  await request(app).get('/api/auth/me').set('Cookie', cookieHeader(response)).expect(403);
  await request(app).post('/api/auth/refresh').set('Cookie', cookieHeader(response)).expect(403);
  const stored = await User.findById(admin._id).select('+accessToken +refreshToken');
  assert.equal(stored.accessToken, null);
  assert.equal(stored.refreshToken, null);
});

test('malformed requests, operator injection, oversized JSON, and nonexistent routes are handled', async () => {
  for (const body of [{}, { email: { $ne: null }, password }, { email: admin.email, password: {} }]) {
    await request(app).post('/api/auth/login').send(body).expect(400);
  }
  await request(app).post('/api/auth/login').type('json').send('{').expect(400);
  await request(app).post('/api/auth/login').send({ data: 'x'.repeat(11000) }).expect(413);
  await request(app).post('/api/auth/register').send({ email: 'new@example.com', password, role: 'admin' }).expect(404);
  await request(app).get('/health').expect(200, 'Server is running!');
});

test('credentialed CORS and auth-origin middleware reject untrusted browser requests', async () => {
  const allowed = await login().expect(200);
  assert.equal(allowed.headers['access-control-allow-origin'], origin);
  assert.equal(allowed.headers['access-control-allow-credentials'], 'true');
  await request(app).options('/api/auth/login').set('Origin', origin).set('Access-Control-Request-Method', 'POST').expect(204);
  for (const path of ['login', 'refresh', 'logout']) {
    await request(app).post(`/api/auth/${path}`).set('Origin', 'https://untrusted.example').send({ email: admin.email, password }).expect(403);
    await request(app).post(`/api/auth/${path}`).set('Sec-Fetch-Site', 'cross-site').send({ email: admin.email, password }).expect(403);
  }
});

test('login limits attempts to ten requests per fifteen minutes', async () => {
  for (let i = 0; i < 10; i++) await request(app).post('/api/auth/login').send({}).expect(400);
  const limited = await request(app).post('/api/auth/login').send({}).expect(429);
  assert.match(limited.body.error.message, /Too many login attempts/);
  assert.ok(limited.headers['retry-after']);
});

test('admin provisioning hashes credentials and never overwrites or promotes existing users', async () => {
  const created = await createAdmin({ email: '  NEWADMIN@EXAMPLE.COM  ', password: 'Ab123!' });
  assert.equal(created.role, 'admin');
  assert.equal(created.email, 'newadmin@example.com');
  const stored = await User.findById(created._id).select('+password');
  assert.equal(await bcrypt.compare('Ab123!', stored.password), true);
  await assert.rejects(createAdmin({ email: ordinaryUser.email, password }), /already exists/);
  assert.equal((await User.findById(ordinaryUser._id)).role, 'user');
  await assert.rejects(createAdmin({ email: 'invalid', password }), /valid email/);
  await assert.rejects(createAdmin({ email: 'short@example.com', password: 'short' }), /Password/);
  const results = await Promise.allSettled([1, 2].map(() => createAdmin({ email: 'race@example.com', password })));
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
  assert.equal(await User.countDocuments({ email: 'race@example.com' }), 1);
});

test('configuration rejects missing or identical secrets and invalid origins', () => {
  assert.throws(() => getConfig({ ...environment, JWT_ACCESS_SECRET: '' }), /JWT_ACCESS_SECRET/);
  assert.throws(() => getConfig({ ...environment, JWT_REFRESH_SECRET: environment.JWT_ACCESS_SECRET }), /different/);
  assert.throws(() => getConfig({ ...environment, ADMIN_ORIGINS: 'https://example.com/path' }), /origins/);
  assert.throws(() => getConfig({ ...environment, NODE_ENV: 'production', ADMIN_ORIGINS: '' }), /ADMIN_ORIGINS/);
  assert.throws(() => getConfig({ ...environment, MONGO_URL: '' }), /MONGO_URL/);
  assert.throws(() => getConfig({ ...environment, MONGO_DB_NAME: 'admin' }), /application database/);
});

test('admin CLI refuses noninteractive password input without printing credentials', async () => {
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['src/scripts/create-admin.js'], { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (data) => { output += data; });
    child.stderr.on('data', (data) => { output += data; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, output }));
    child.stdin.end(password);
  });
  assert.equal(result.code, 1);
  assert.match(result.output, /interactive terminal/);
  assert.equal(result.output.includes(password), false);
});
