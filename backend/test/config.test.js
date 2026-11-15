import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomBytes } from 'node:crypto';
import request from 'supertest';
import { getConfig } from '../src/config.js';
import { createApp } from '../src/app.js';

const environment = {
  NODE_ENV: 'production',
  MONGO_URL: 'mongodb://127.0.0.1:27017/test-placeholder',
  JWT_ACCESS_SECRET: randomBytes(48).toString('hex'),
  JWT_REFRESH_SECRET: randomBytes(48).toString('hex'),
};

test('production without admin origins starts with an empty allowlist, never localhost', () => {
  for (const value of [undefined, '', '   ']) {
    assert.deepEqual(getConfig({ ...environment, ADMIN_ORIGINS: value }).adminOrigins, []);
  }
  assert.deepEqual(getConfig({ ...environment, NODE_ENV: 'development' }).adminOrigins,
    ['http://localhost:5173', 'http://127.0.0.1:5173']);
});

test('configured production origins must be exact and explicitly trusted', () => {
  assert.deepEqual(getConfig({ ...environment, ADMIN_ORIGINS: ' https://admin.example.com,https://admin2.example.com ' }).adminOrigins,
    ['https://admin.example.com', 'https://admin2.example.com']);
  for (const value of ['*', ',', 'https://admin.example.com/', 'https://admin.example.com/login', 'not-a-url']) {
    assert.throws(() => getConfig({ ...environment, ADMIN_ORIGINS: value }), /origin/);
  }
});

test('empty production allowlist blocks browser admin requests and write preflights', async () => {
  const app = createApp(getConfig(environment));
  await request(app).get('/health').expect(200, 'Server is running!');
  for (const origin of ['http://localhost:5173', 'https://admin.example.com']) {
    for (const [method, path] of [['post', '/api/auth/login'], ['post', '/api/auth/refresh'],
      ['post', '/api/auth/logout'], ['get', '/api/auth/me'], ['get', '/api/tasks'],
      ['post', '/api/projects'], ['patch', '/api/projects/507f1f77bcf86cd799439011'],
      ['delete', '/api/projects/507f1f77bcf86cd799439011']]) {
      await request(app)[method](path).set('Origin', origin).expect(403);
    }
    await request(app).options('/api/projects').set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST').expect(403);
    const publicPreflight = await request(app).options('/api/projects').set('Origin', origin)
      .set('Access-Control-Request-Method', 'GET').expect(204);
    assert.equal(publicPreflight.headers['access-control-allow-origin'], '*');
    assert.equal(publicPreflight.headers['access-control-allow-credentials'], undefined);
  }
});
