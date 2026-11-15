import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import { Writable } from 'node:stream';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { v2 as cloudinary } from 'cloudinary';
import { createApp } from '../src/app.js';
import { getConfig } from '../src/config.js';
import { User } from '../src/model/User.js';
import { Project } from '../src/model/Project.js';
import { createSession } from '../src/utils/session.js';
import { createProjectImageStore } from '../src/services/projectImages.js';
import { HttpError } from '../src/utils/errors.js';

const origin = 'http://localhost:5173';
const config = getConfig({
  NODE_ENV: 'test', MONGO_URL: 'mongodb://127.0.0.1:27017/test-placeholder',
  JWT_ACCESS_SECRET: randomBytes(48).toString('hex'),
  JWT_REFRESH_SECRET: randomBytes(48).toString('hex'), ADMIN_ORIGINS: origin,
});
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=', 'base64');
let database;
let admin;
let ordinaryUser;
let cookie;
let userCookie;
let app;
let uploaded;
let removed;
let failUploadAt;
let store;

before(async () => {
  database = await MongoMemoryServer.create({ instance: { dbName: 'musdar_projects_test' } });
  await mongoose.connect(database.getUri());
  await Promise.all([User.init(), Project.init()]);
  admin = await User.create({ email: 'projects-admin@example.com', password: 'test-pass123', role: 'admin' });
  ordinaryUser = await User.create({ email: 'projects-user@example.com', password: 'test-pass123' });
  const adminSession = createSession(admin._id, config);
  const userSession = createSession(ordinaryUser._id, config);
  await User.updateOne({ _id: admin._id }, { $set: adminSession.hashes });
  await User.updateOne({ _id: ordinaryUser._id }, { $set: userSession.hashes });
  cookie = `accessToken=${adminSession.accessToken}`;
  userCookie = `accessToken=${userSession.accessToken}`;
}, { timeout: 180000 });

after(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});

beforeEach(async () => {
  await Project.deleteMany({});
  uploaded = [];
  removed = [];
  failUploadAt = 0;
  store = {
    async upload(file) {
      if (failUploadAt === uploaded.length + 1) throw new HttpError(502, 'Image upload failed. Please try again.');
      assert.ok(Buffer.isBuffer(file.buffer));
      const image = { url: `https://res.cloudinary.com/test/image-${uploaded.length}`, publicId: `musdar/projects/${uploaded.length}` };
      uploaded.push(image);
      return image;
    },
    async remove(publicId) { removed.push(publicId); },
  };
  app = createApp(config, { imageStore: store });
});

function create(overrides = {}) {
  return Project.create({ userId: admin._id, title: 'Case study', description: '<p>Project details</p>',
    images: [{ url: 'https://res.cloudinary.com/test/old', publicId: 'old-image' }], ...overrides });
}

function post() {
  return request(app).post('/api/projects').set('Origin', origin).set('Cookie', cookie)
    .field('title', '  New project  ').field('description', '<h3>The story</h3><p>Details.</p>');
}

test('schema requires owner, title, description, nonempty images, and complete image metadata', async () => {
  for (const data of [{ userId: undefined }, { title: '' }, { description: '' }, { images: [] },
    { images: [{ url: 'https://example.com/image' }] },
    { images: [{ url: 'http://example.com/image', publicId: 'bad' }] },
    { images: Array.from({ length: 11 }, () => ({ url: 'https://example.com/image', publicId: 'many' })) }]) {
    await assert.rejects(create(data), (error) => error.name === 'ValidationError');
  }
  const project = await create();
  assert.ok(project.createdAt instanceof Date);
  assert.ok(project.updatedAt instanceof Date);
});

test('public reads remain available in production before admin origins are configured', async () => {
  const project = await create();
  const publicOnlyConfig = getConfig({ NODE_ENV: 'production', MONGO_URL: config.mongoUrl,
    JWT_ACCESS_SECRET: config.accessSecret, JWT_REFRESH_SECRET: config.refreshSecret });
  const publicOnlyApp = createApp(publicOnlyConfig, { imageStore: store });
  for (const path of ['/api/projects', `/api/projects/${project._id}`]) {
    const response = await request(publicOnlyApp).get(path).set('Origin', 'https://portfolio.example').expect(200);
    assert.equal(response.headers['access-control-allow-origin'], '*');
    assert.equal(response.headers['access-control-allow-credentials'], undefined);
    assert.equal(path === '/api/projects' ? response.body.projects[0]._id : response.body.project._id, String(project._id));
  }
});

test('public list and get work without login from any website; newest projects come first', async () => {
  const older = await create({ createdAt: new Date('2024-01-01') });
  const newer = await create();
  const response = await request(app).get('/api/projects').set('Origin', 'https://public-website.example').expect(200);
  assert.equal(response.headers['access-control-allow-origin'], '*');
  assert.equal(response.headers['access-control-allow-credentials'], undefined);
  assert.deepEqual(response.body.projects.map((project) => project._id), [String(newer._id), String(older._id)]);
  const detail = await request(app).get(`/api/projects/${older._id}`).set('Origin', 'https://another-site.example').expect(200);
  assert.equal(detail.body.project.userId, String(admin._id));
  assert.equal(detail.body.project.__v, undefined);
  assert.equal(detail.body.project.password, undefined);
  assert.equal(detail.body.project.email, undefined);
  const adminRead = await request(app).get('/api/projects').set('Origin', origin).set('Cookie', cookie).expect(200);
  assert.equal(adminRead.headers['access-control-allow-origin'], origin);
  assert.equal(adminRead.headers['access-control-allow-credentials'], 'true');
  await request(app).options('/api/projects').set('Origin', 'https://public-website.example')
    .set('Access-Control-Request-Method', 'GET').expect(204);
});

test('empty list, malformed IDs, and missing projects return predictable responses', async () => {
  assert.deepEqual((await request(app).get('/api/projects').expect(200)).body, { projects: [] });
  await request(app).get('/api/projects/invalid').expect(400);
  const missing = String(new mongoose.Types.ObjectId());
  await request(app).get(`/api/projects/${missing}`).expect(404);
  await request(app).patch(`/api/projects/${missing}`).set('Cookie', cookie).send({ title: 'Changed' }).expect(404);
  await request(app).delete(`/api/projects/${missing}`).set('Cookie', cookie).expect(404);
});

test('create, update, and delete require an authenticated admin before uploads', async () => {
  const project = await create();
  for (const [method, path] of [['post', '/api/projects'], ['patch', `/api/projects/${project._id}`], ['delete', `/api/projects/${project._id}`]]) {
    await request(app)[method](path).send({}).expect(401);
    await request(app)[method](path).set('Cookie', userCookie).send({}).expect(403);
  }
  assert.equal(uploaded.length, 0);
  assert.equal(await Project.countDocuments(), 1);
});

test('admin creates a project with uploaded images and server-assigned owner', async () => {
  const response = await post().attach('images', png, { filename: 'one.png', contentType: 'image/png' })
    .attach('images', png, { filename: 'two.png', contentType: 'image/png' }).expect(201);
  const project = response.body.project;
  assert.equal(project.title, 'New project');
  assert.equal(project.userId, String(admin._id));
  assert.deepEqual(project.images, uploaded);
  assert.ok(project.createdAt);
  assert.ok(project.updatedAt);
  assert.equal(await Project.countDocuments(), 1);
});

test('required fields and unknown fields are rejected before Cloudinary uploads', async () => {
  await post().expect(400);
  await request(app).post('/api/projects').set('Cookie', cookie).field('title', 'Title')
    .attach('images', png, 'image.png').expect(400);
  for (const fields of [{ title: ' ' }, { title: 'a'.repeat(201) }, { description: '' }, { userId: String(ordinaryUser._id) }, { images: [] }, { title: { $ne: null } }]) {
    const project = await create();
    await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie).send(fields).expect(400);
  }
  await request(app).post('/api/projects').set('Cookie', cookie).send({ title: 'Title', description: 'Description', images: ['https://example.com/image'] }).expect(400);
  assert.equal(uploaded.length, 0);
});

test('live website URLs round-trip with ten-image multipart uploads and preserve the gallery on URL-only edits', async () => {
  let submission = post().field('websiteUrl', '  https://flourandfirewood.netlify.app/  ');
  for (let index = 0; index < 10; index++) submission = submission.attach('images', png, { filename: `${index}.png`, contentType: 'image/png' });
  const created = (await submission.expect(201)).body.project;
  assert.equal(created.websiteUrl, 'https://flourandfirewood.netlify.app/');
  assert.equal(created.images.length, 10);
  const path = `/api/projects/${created._id}`;
  assert.equal((await request(app).get(path).expect(200)).body.project.websiteUrl, created.websiteUrl);
  const updated = (await request(app).patch(path).set('Cookie', cookie).send({ websiteUrl: 'https://example.com/live' }).expect(200)).body.project;
  assert.equal(updated.websiteUrl, 'https://example.com/live');
  assert.deepEqual(updated.images, created.images);
  const renamed = (await request(app).patch(path).set('Cookie', cookie).send({ title: 'Renamed' }).expect(200)).body.project;
  assert.equal(renamed.websiteUrl, updated.websiteUrl);
  const cleared = (await request(app).patch(path).set('Cookie', cookie).send({ websiteUrl: '' }).expect(200)).body.project;
  assert.equal(cleared.websiteUrl, '');
  assert.deepEqual(cleared.images, created.images);
  assert.deepEqual(removed, []);
});

test('unsafe, malformed, oversized, and non-string website URLs are rejected without uploading images or changing data', async () => {
  const project = await create({ websiteUrl: 'https://example.com/' });
  for (const websiteUrl of ['javascript:alert(1)', 'data:text/html,test', 'ftp://example.com/file', '/relative', 'invalid',
    'https://user:password@example.com/', `https://example.com/${'a'.repeat(2048)}`]) {
    await post().field('websiteUrl', websiteUrl).attach('images', png, { filename: 'image.png', contentType: 'image/png' }).expect(400);
    await assert.rejects(create({ websiteUrl }), (error) => error.name === 'ValidationError');
  }
  for (const websiteUrl of [null, 123, [], { $ne: null }]) {
    await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie).send({ websiteUrl }).expect(400);
  }
  assert.equal((await Project.findById(project._id)).websiteUrl, 'https://example.com/');
  assert.equal(uploaded.length, 0);
});

test('Multer rejects unsupported files, oversized images, excess images, and wrong upload fields', async () => {
  await post().attach('images', Buffer.from('document'), { filename: 'file.txt', contentType: 'text/plain' }).expect(400);
  await post().attach('images', Buffer.alloc(5 * 1024 * 1024 + 1), { filename: 'large.png', contentType: 'image/png' }).expect(413);
  let many = post();
  for (let index = 0; index < 11; index++) many = many.attach('images', png, { filename: `${index}.png`, contentType: 'image/png' });
  await many.expect(400);
  await post().attach('file', png, { filename: 'wrong.png', contentType: 'image/png' }).expect(400);
  await request(app).post('/api/projects').set('Cookie', cookie).set('Content-Type', 'multipart/form-data').send('malformed').expect(400);
  assert.equal(uploaded.length, 0);
  assert.equal(await Project.countDocuments(), 0);
});

test('text-only updates preserve owner and existing images, and reject empty updates', async () => {
  const project = await create({ updatedAt: new Date('2024-01-01') });
  const result = await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie).send({ title: '  Updated  ' }).expect(200);
  assert.equal(result.body.project.title, 'Updated');
  assert.equal(result.body.project.userId, String(admin._id));
  assert.equal(result.body.project.images[0].publicId, 'old-image');
  assert.ok(new Date(result.body.project.updatedAt) > project.updatedAt);
  assert.deepEqual(removed, []);
  await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie).send({}).expect(400);
});

test('multipart updates replace all images, then remove the old Cloudinary assets', async () => {
  const project = await create();
  const result = await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie)
    .attach('images', png, { filename: 'replacement.webp', contentType: 'image/webp' }).expect(200);
  assert.deepEqual(result.body.project.images, uploaded);
  assert.deepEqual(removed, ['old-image']);
  assert.equal((await Project.findById(project._id)).images[0].publicId, uploaded[0].publicId);
});

test('partial upload failure cleans new assets and keeps the original project unchanged', async () => {
  const project = await create();
  failUploadAt = 2;
  await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie).field('title', 'Should not save')
    .attach('images', png, { filename: 'one.png', contentType: 'image/png' })
    .attach('images', png, { filename: 'two.png', contentType: 'image/png' }).expect(502);
  assert.deepEqual(removed, [uploaded[0].publicId]);
  const unchanged = await Project.findById(project._id);
  assert.equal(unchanged.title, 'Case study');
  assert.equal(unchanged.images[0].publicId, 'old-image');
});

test('database failure after upload cleans new assets', async (context) => {
  context.mock.method(Project, 'create', async () => { throw new HttpError(503, 'Database unavailable.'); });
  await post().attach('images', png, { filename: 'one.png', contentType: 'image/png' }).expect(503);
  assert.deepEqual(removed, [uploaded[0].publicId]);
  assert.equal(await Project.countDocuments(), 0);
});

test('concurrent changes return conflict and clean only the losing upload', async (context) => {
  const project = await create();
  const upload = store.upload;
  context.mock.method(store, 'upload', async (file) => {
    await Project.updateOne({ _id: project._id }, { $inc: { __v: 1 }, $set: { title: 'Concurrent edit' } });
    return upload(file);
  });
  await request(app).patch(`/api/projects/${project._id}`).set('Cookie', cookie)
    .attach('images', png, { filename: 'one.png', contentType: 'image/png' }).expect(409);
  assert.deepEqual(removed, [uploaded[0].publicId]);
  assert.equal((await Project.findById(project._id)).title, 'Concurrent edit');
});

test('delete removes project and Cloudinary images', async () => {
  const project = await create();
  await request(app).delete(`/api/projects/${project._id}`).set('Cookie', cookie).expect(204);
  assert.equal(await Project.findById(project._id), null);
  assert.deepEqual(removed, ['old-image']);
});

test('cleanup failures are reported without undoing a successful database operation', async (context) => {
  const messages = [];
  context.mock.method(console, 'error', (...args) => messages.push(args));
  context.mock.method(store, 'remove', async () => { throw new Error('Unavailable'); });
  const project = await create();
  await request(app).delete(`/api/projects/${project._id}`).set('Cookie', cookie).expect(204);
  assert.equal(await Project.findById(project._id), null);
  assert.equal(messages.length, 1);
});

test('untrusted origins cannot write or preflight writes, while admin origins support PATCH and DELETE', async () => {
  const project = await create();
  for (const [method, path] of [['post', '/api/projects'], ['patch', `/api/projects/${project._id}`], ['delete', `/api/projects/${project._id}`]]) {
    await request(app)[method](path).set('Origin', 'https://untrusted.example').set('Cookie', cookie).send({ title: 'Changed' }).expect(403);
    await request(app)[method](path).set('Sec-Fetch-Site', 'cross-site').set('Cookie', cookie).send({ title: 'Changed' }).expect(403);
    await request(app).options(path).set('Origin', 'https://untrusted.example').set('Access-Control-Request-Method', method.toUpperCase()).expect(403);
  }
  for (const method of ['PATCH', 'DELETE']) {
    const result = await request(app).options(`/api/projects/${project._id}`).set('Origin', origin).set('Access-Control-Request-Method', method).expect(204);
    assert.ok(result.headers['access-control-allow-methods'].includes(method));
    assert.equal(result.headers['access-control-allow-credentials'], 'true');
  }
  assert.equal(uploaded.length, 0);
});

test('missing Cloudinary configuration returns 503 on upload without preventing public reads or auth', async () => {
  app = createApp(config);
  await request(app).get('/api/projects').expect(200);
  await request(app).get('/api/auth/me').set('Cookie', cookie).expect(200);
  await post().attach('images', png, { filename: 'one.png', contentType: 'image/png' }).expect(503);
  assert.equal(await Project.countDocuments(), 0);
});

test('Cloudinary adapter streams uploads with format restrictions and removes assets by public ID', async (context) => {
  const credentials = { cloudName: 'fake-cloud', apiKey: 'fake-key', apiSecret: 'fake-secret' };
  let received;
  let content;
  context.mock.method(cloudinary.uploader, 'upload_stream', (options, callback) => {
    received = options;
    return new Writable({ write(chunk, _encoding, done) { content = chunk; done(); },
      final(done) { callback(null, { secure_url: 'https://res.cloudinary.com/fake/image', public_id: 'folder/one' }); done(); } });
  });
  let destroyed;
  context.mock.method(cloudinary.uploader, 'destroy', async (...args) => { destroyed = args; return { result: 'ok' }; });
  const adapter = createProjectImageStore({ cloudinary: credentials });
  assert.deepEqual(await adapter.upload({ buffer: png }), { url: 'https://res.cloudinary.com/fake/image', publicId: 'folder/one' });
  assert.deepEqual(content, png);
  assert.deepEqual(received.allowed_formats, ['jpg', 'jpeg', 'png', 'webp']);
  assert.equal(received.api_secret, credentials.apiSecret);
  await adapter.remove('folder/one');
  assert.equal(destroyed[0], 'folder/one');
  assert.equal(destroyed[1].invalidate, true);
});

test('Cloudinary adapter hides provider errors and never returns credentials', async (context) => {
  const adapter = createProjectImageStore({ cloudinary: { cloudName: 'fake', apiKey: 'fake', apiSecret: 'private-value' } });
  let status = 400;
  context.mock.method(cloudinary.uploader, 'upload_stream', (_options, callback) => {
    return new Writable({ write(_chunk, _encoding, done) { done(); },
      final(done) { callback({ http_code: status, message: 'private-value' }); done(); } });
  });
  await assert.rejects(adapter.upload({ buffer: png }), (error) => error.status === 400 && !error.message.includes('private-value'));
  status = 500;
  await assert.rejects(adapter.upload({ buffer: png }), (error) => error.status === 502 && !error.message.includes('private-value'));
});
