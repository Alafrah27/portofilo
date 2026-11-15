import assert from 'node:assert/strict';
import { before, beforeEach, after, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { getConfig } from '../src/config.js';
import { User } from '../src/model/User.js';
import { Project } from '../src/model/Project.js';
import { Task } from '../src/model/Task.js';
import { parseTaskDate } from '../src/controllers/taskController.js';
import { createSession } from '../src/utils/session.js';

const origin = 'http://localhost:5173';
const config = getConfig({ NODE_ENV: 'test', MONGO_URL: 'mongodb://127.0.0.1:27017/test-placeholder',
  JWT_ACCESS_SECRET: randomBytes(48).toString('hex'), JWT_REFRESH_SECRET: randomBytes(48).toString('hex'), ADMIN_ORIGINS: origin });
let database, app, admin, secondAdmin, cookie, secondCookie, userCookie;

before(async () => {
  database = await MongoMemoryServer.create({ instance: { dbName: 'musdar_tasks_test' } });
  await mongoose.connect(database.getUri());
  await Promise.all([User.init(), Project.init(), Task.init()]);
  const users = await User.create([
    { email: 'tasks-admin@example.test', password: 'test-only-pass', role: 'admin' },
    { email: 'tasks-admin-two@example.test', password: 'test-only-pass', role: 'admin' },
    { email: 'tasks-user@example.test', password: 'test-only-pass' },
  ]);
  [admin, secondAdmin] = users;
  const cookies = [];
  for (const user of users) {
    const session = createSession(user._id, config);
    await User.updateOne({ _id: user._id }, { $set: session.hashes });
    cookies.push(`accessToken=${session.accessToken}`);
  }
  [cookie, secondCookie, userCookie] = cookies;
  app = createApp(config, { imageStore: { async remove() {} } });
}, { timeout: 180000 });

after(async () => { await mongoose.disconnect(); if (database) await database.stop(); });
beforeEach(async () => { await Task.deleteMany({}); await Project.deleteMany({}); });

function task(overrides = {}) { return Task.create({ title: 'Plan next milestone', userId: admin._id, ...overrides }); }
function project() { return Project.create({ title: 'Portfolio project', description: 'Details', userId: admin._id,
  images: [{ url: 'https://example.test/image.png', publicId: 'test/image' }] }); }
function post(body, session = cookie) { return request(app).post('/api/tasks').set('Cookie', session).set('Origin', origin).send(body); }

test('task schema requires title and creator, validates enums and defaults optional fields', async () => {
  for (const value of [{ title: '' }, { title: 'a'.repeat(201) }, { userId: undefined }, { status: 'invalid' }, { priority: 'urgent' }]) {
    await assert.rejects(task(value), (error) => error.name === 'ValidationError');
  }
  const created = await task();
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'medium');
  assert.equal(created.projectId, null);
  assert.equal(created.dueDate, null);
  assert.ok(created.createdAt instanceof Date);
  assert.ok(created.updatedAt instanceof Date);
});

test('all task endpoints require an authenticated admin, including reads', async () => {
  const created = await task();
  for (const [method, path] of [['get', '/api/tasks'], ['get', `/api/tasks/${created._id}`], ['post', '/api/tasks'], ['patch', `/api/tasks/${created._id}`], ['delete', `/api/tasks/${created._id}`]]) {
    const denied = await request(app)[method](path).send({ title: 'Unauthorized' }).expect(401);
    assert.equal(denied.headers['cache-control'], 'no-store');
    await request(app)[method](path).set('Cookie', userCookie).send({ title: 'Unauthorized' }).expect(403);
  }
  assert.equal((await Task.findById(created._id)).title, created.title);
});

test('admin creates a standalone task with defaults and private account data excluded', async () => {
  const response = await post({ title: '  Prepare launch  ' }).expect(201);
  const created = response.body.task;
  assert.equal(created.title, 'Prepare launch');
  assert.equal(created.userId, String(admin._id));
  assert.equal(created.projectId, null);
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'medium');
  assert.equal(created.dueDate, null);
  assert.equal(created.__v, undefined);
  assert.equal(created.password, undefined);
  assert.ok(created.createdAt && created.updatedAt);
  assert.equal(await Task.countDocuments(), 1);
});

test('linked task returns only project identifier and title, plus an exact UTC deadline', async () => {
  const linked = await project();
  const response = await post({ title: 'Finish project', projectId: String(linked._id), status: 'in-progress', priority: 'high', dueDate: '2028-02-29' }).expect(201);
  assert.deepEqual(response.body.task.projectId, { _id: String(linked._id), title: linked.title });
  assert.equal(response.body.task.dueDate, '2028-02-29T00:00:00.000Z');
  const detail = await request(app).get(`/api/tasks/${response.body.task._id}`).set('Cookie', cookie).expect(200);
  assert.deepEqual(detail.body.task, response.body.task);
});

test('list returns newest first and supports validated status and priority filters', async () => {
  const older = await task({ createdAt: new Date('2024-01-01') });
  const newer = await task({ status: 'done', priority: 'high' });
  const response = await request(app).get('/api/tasks').set('Cookie', cookie).expect(200);
  assert.deepEqual(response.body.tasks.map((item) => item._id), [String(newer._id), String(older._id)]);
  const filtered = await request(app).get('/api/tasks?status=done&priority=high').set('Cookie', cookie).expect(200);
  assert.equal(filtered.body.tasks.length, 1);
  assert.equal(filtered.body.tasks[0]._id, String(newer._id));
  for (const query of ['status=bad', 'priority=urgent', 'status=todo&status=done', 'status[$ne]=todo']) {
    await request(app).get('/api/tasks?' + query).set('Cookie', cookie).expect(400);
  }
});

test('invalid payloads, protected fields, invalid links and impossible dates are rejected', async () => {
  for (const body of [{}, [], { title: ' ' }, { title: { $ne: null } }, { title: 'a'.repeat(201) },
    { title: 'Task', userId: String(secondAdmin._id) }, { title: 'Task', createdAt: '2024-01-01' },
    { title: 'Task', status: 'archived' }, { title: 'Task', priority: 'urgent' }, { title: 'Task', projectId: 'bad' },
    { title: 'Task', projectId: String(new mongoose.Types.ObjectId()) }, { title: 'Task', projectId: { $ne: null } },
    { title: 'Task', dueDate: 'Tomorrow' }, { title: 'Task', dueDate: '2026-02-30' }, { title: 'Task', dueDate: '2026-10-26T12:00:00Z' }]) {
    await post(body).expect(400);
  }
  assert.equal(await Task.countDocuments(), 0);
});

test('task updates preserve untouched fields and creator; optional project and deadline can be cleared', async () => {
  const linked = await project();
  const created = await task({ projectId: linked._id, priority: 'high', dueDate: new Date('2028-02-29'), updatedAt: new Date('2024-01-01') });
  const changed = await request(app).patch(`/api/tasks/${created._id}`).set('Cookie', cookie).send({ status: 'done' }).expect(200);
  assert.equal(changed.body.task.status, 'done');
  assert.equal(changed.body.task.priority, 'high');
  assert.equal(changed.body.task.projectId._id, String(linked._id));
  assert.ok(new Date(changed.body.task.updatedAt) > created.updatedAt);
  const cleared = await request(app).patch(`/api/tasks/${created._id}`).set('Cookie', secondCookie).send({ title: 'Changed by another admin', projectId: null, dueDate: null }).expect(200);
  assert.equal(cleared.body.task.userId, String(admin._id));
  assert.equal(cleared.body.task.projectId, null);
  assert.equal(cleared.body.task.dueDate, null);
  await request(app).patch(`/api/tasks/${created._id}`).set('Cookie', cookie).send({}).expect(400);
  await request(app).patch(`/api/tasks/${created._id}`).set('Cookie', cookie).send({ userId: String(secondAdmin._id) }).expect(400);
});

test('all admins share access and can delete tasks created by another admin', async () => {
  const created = await task();
  const response = await request(app).get('/api/tasks').set('Cookie', secondCookie).expect(200);
  assert.equal(response.body.tasks.length, 1);
  await request(app).delete(`/api/tasks/${created._id}`).set('Cookie', secondCookie).expect(204);
  assert.equal(await Task.countDocuments(), 0);
});

test('deleted projects leave tasks intact and are represented as no project', async () => {
  const linked = await project();
  const created = await task({ projectId: linked._id });
  await request(app).delete(`/api/projects/${linked._id}`).set('Cookie', cookie).expect(204);
  const response = await request(app).get(`/api/tasks/${created._id}`).set('Cookie', cookie).expect(200);
  assert.equal(response.body.task.projectId, null);
  await request(app).patch(`/api/tasks/${created._id}`).set('Cookie', cookie).send({ status: 'done' }).expect(200);
  assert.equal(await Task.countDocuments(), 1);
});

test('malformed IDs, missing tasks, invalid JSON, and oversized bodies return proper status codes', async () => {
  for (const method of ['get', 'patch', 'delete']) {
    let operation = request(app)[method]('/api/tasks/invalid').set('Cookie', cookie);
    if (method === 'patch') operation = operation.send({ title: 'Valid' });
    await operation.expect(400);
    operation = request(app)[method](`/api/tasks/${new mongoose.Types.ObjectId()}`).set('Cookie', cookie);
    if (method === 'patch') operation = operation.send({ title: 'Valid' });
    await operation.expect(404);
  }
  await request(app).post('/api/tasks').set('Cookie', cookie).set('Content-Type', 'application/json').send('{').expect(400);
  await post({ title: 'x'.repeat(11000) }).expect(413);
});

test('task writes reject untrusted and cross-site origins; private reads do not get public CORS', async () => {
  const created = await task();
  for (const [method, path] of [['post', '/api/tasks'], ['patch', `/api/tasks/${created._id}`], ['delete', `/api/tasks/${created._id}`]]) {
    await request(app)[method](path).set('Cookie', cookie).set('Origin', 'https://untrusted.example').send({ title: 'Not allowed' }).expect(403);
    await request(app)[method](path).set('Cookie', cookie).set('Sec-Fetch-Site', 'cross-site').send({ title: 'Not allowed' }).expect(403);
  }
  await request(app).get('/api/tasks').set('Origin', 'https://public-site.example').expect(403);
  const allowed = await request(app).get('/api/tasks').set('Origin', origin).set('Cookie', cookie).expect(200);
  assert.equal(allowed.headers['access-control-allow-origin'], origin);
  assert.equal(allowed.headers['access-control-allow-credentials'], 'true');
});

test('date parser accepts leap days and null but rejects invalid calendar dates', () => {
  assert.equal(parseTaskDate(null), null);
  assert.equal(parseTaskDate('2028-02-29').toISOString(), '2028-02-29T00:00:00.000Z');
  for (const value of ['', '2026-02-29', '2026-04-31', '2026-13-01', {}, 123]) assert.throws(() => parseTaskDate(value), (error) => error.status === 400);
});
