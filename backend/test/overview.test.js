import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { getConfig } from '../src/config.js';
import { User } from '../src/model/User.js';
import { Project } from '../src/model/Project.js';
import { Task } from '../src/model/Task.js';
import { createSession } from '../src/utils/session.js';

const origin = 'http://localhost:5173';
const config = getConfig({ NODE_ENV: 'test', MONGO_URL: 'mongodb://127.0.0.1:27017/test-placeholder',
  JWT_ACCESS_SECRET: randomBytes(48).toString('hex'), JWT_REFRESH_SECRET: randomBytes(48).toString('hex'), ADMIN_ORIGINS: origin });
let database, app, admin, cookie, userCookie;

before(async () => {
  database = await MongoMemoryServer.create({ instance: { dbName: 'musdar_overview_test' } });
  await mongoose.connect(database.getUri());
  await Promise.all([User.init(), Project.init(), Task.init()]);
  const users = await User.create([
    { email: 'overview-admin@example.test', password: 'test-only-pass', role: 'admin' },
    { email: 'overview-user@example.test', password: 'test-only-pass' },
  ]);
  [admin] = users;
  const cookies = [];
  for (const user of users) {
    const session = createSession(user._id, config);
    await User.updateOne({ _id: user._id }, { $set: session.hashes });
    cookies.push(`accessToken=${session.accessToken}`);
  }
  [cookie, userCookie] = cookies;
  app = createApp(config);
}, { timeout: 180000 });
after(async () => { await mongoose.disconnect(); if (database) await database.stop(); });
beforeEach(async () => { await Project.deleteMany({}); await Task.deleteMany({}); });

const get = () => request(app).get('/api/overview').set('Cookie', cookie).set('Origin', origin);
function project(title, date = '2025-01-01') {
  return Project.create({ title, userId: admin._id, description: 'Private editor story omitted from overview',
    images: [{ url: 'https://example.test/image.png', publicId: 'test/image' }], createdAt: new Date(date), updatedAt: new Date(date) });
}
function task(status, date = '2025-01-01') {
  return Task.create({ title: `${status} task`, userId: admin._id, status, createdAt: new Date(date), updatedAt: new Date(date) });
}

test('overview is private, admin-only, never cached, and rejects untrusted browser origins', async () => {
  const anonymous = await request(app).get('/api/overview').expect(401);
  assert.equal(anonymous.headers['cache-control'], 'no-store');
  await request(app).get('/api/overview').set('Cookie', userCookie).expect(403);
  await request(app).get('/api/overview').set('Cookie', cookie).set('Origin', 'https://untrusted.example').expect(403);
  const response = await get().expect(200);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.headers['access-control-allow-origin'], origin);
  assert.equal(response.headers['access-control-allow-credentials'], 'true');
});

test('empty workspace has real zero counts, a finite completion rate, and no invented activity', async () => {
  const { body: { overview } } = await get().expect(200);
  assert.equal(overview.projects, 0);
  assert.deepEqual(overview.tasks, { total: 0, todo: 0, inProgress: 0, completed: 0, open: 0, completionRate: 0 });
  assert.deepEqual(overview.recentProjects, []);
  assert.deepEqual(overview.activity, []);
  assert.ok(Number.isFinite(Date.parse(overview.asOf)));
});

test('counts and completion rate follow saved task creation, status changes, and deletion', async () => {
  const p = await project('Saved project');
  const todo = await task('todo');
  await task('in-progress');
  await task('done');
  let overview = (await get().expect(200)).body.overview;
  assert.equal(overview.projects, 1);
  assert.deepEqual(overview.tasks, { total: 3, todo: 1, inProgress: 1, completed: 1, open: 2, completionRate: 33 });
  await request(app).patch(`/api/tasks/${todo._id}`).set('Cookie', cookie).set('Origin', origin).send({ status: 'done' }).expect(200);
  overview = (await get().expect(200)).body.overview;
  assert.deepEqual(overview.tasks, { total: 3, todo: 0, inProgress: 1, completed: 2, open: 1, completionRate: 67 });
  await Task.deleteMany({ status: 'in-progress' });
  await Project.deleteOne({ _id: p._id });
  overview = (await get().expect(200)).body.overview;
  assert.equal(overview.projects, 0);
  assert.equal(overview.tasks.total, 2);
  assert.equal(overview.tasks.open, 0);
  assert.equal(overview.tasks.completionRate, 100);
});

test('recent projects and updates sort by latest save, stay bounded, and omit stories and account details', async () => {
  const first = await project('Older project');
  for (let index = 2; index <= 5; index++) await project(`Project ${index}`, `2025-01-0${index}`);
  for (let index = 1; index <= 7; index++) await task('todo', `2025-02-0${index}`);
  await Project.updateOne({ _id: first._id }, { $set: { updatedAt: new Date('2025-03-01') } }, { timestamps: false });
  const { body: { overview } } = await get().expect(200);
  assert.equal(overview.projects, 5);
  assert.equal(overview.tasks.total, 7);
  assert.equal(overview.recentProjects.length, 3);
  assert.equal(overview.recentProjects[0]._id, String(first._id));
  assert.equal(overview.recentProjects[0].imageCount, 1);
  assert.equal(overview.recentProjects[0].imageUrl, 'https://example.test/image.png');
  assert.equal(overview.activity.length, 6);
  assert.equal(overview.activity[0].kind, 'project');
  assert.equal(overview.activity[0].operation, 'updated');
  assert.equal(overview.activity[1].kind, 'task');
  assert.equal(overview.activity[1].operation, 'created');
  for (let index = 1; index < overview.activity.length; index++) assert.ok(overview.activity[index - 1].at >= overview.activity[index].at);
  const serialized = JSON.stringify(overview);
  for (const excluded of ['password', 'accessToken', 'refreshToken', 'userId', 'description', 'email', 'publicId']) assert.equal(serialized.includes(`"${excluded}"`), false);
});

test('database failures return an error instead of successful zero totals', async () => {
  const original = Project.countDocuments;
  const log = console.error;
  Project.countDocuments = () => Promise.reject(new Error('Database unavailable'));
  console.error = () => {};
  try {
    const response = await get().expect(500);
    assert.equal(response.body.overview, undefined);
    assert.equal(response.headers['cache-control'], 'no-store');
  } finally { Project.countDocuments = original; console.error = log; }
});
