import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createOverviewClient } from '../src/dashboard/overviewClient.js';

const overview = { projects: 2, tasks: { total: 3, todo: 1, inProgress: 1, completed: 1, open: 2, completionRate: 33 },
  recentProjects: [], activity: [], asOf: '2026-11-15T10:00:00.000Z' };

test('overview client reads saved totals from the authenticated overview endpoint', async () => {
  const paths = [];
  const client = createOverviewClient({ request: async (path) => { paths.push(path); return { overview }; } });
  assert.deepEqual(await client.get(), overview);
  assert.deepEqual(paths, ['/overview']);
});

test('empty workspace is valid, but incomplete or malformed responses never turn into zero totals', async () => {
  const empty = { ...overview, projects: 0, tasks: { total: 0, todo: 0, inProgress: 0, completed: 0, open: 0, completionRate: 0 } };
  assert.deepEqual(await createOverviewClient({ request: async () => ({ overview: empty }) }).get(), empty);
  for (const invalid of [null, {}, { overview: { ...overview, projects: -1 } },
    { overview: { ...overview, tasks: {} } }, { overview: { ...overview, tasks: { ...overview.tasks, completionRate: 101 } } },
    { overview: { ...overview, asOf: 'invalid' } }]) {
    await assert.rejects(createOverviewClient({ request: async () => invalid }).get(), /workspace totals/);
  }
});

test('authorization failures recheck the session while other server failures preserve the error', async () => {
  let rechecks = 0;
  let status = 401;
  const client = createOverviewClient({ request: async () => { throw Object.assign(new Error('Overview unavailable'), { status }); }, onUnauthorized: async () => { rechecks++; } });
  await assert.rejects(client.get(), /Overview unavailable/);
  status = 403;
  await assert.rejects(client.get(), /Overview unavailable/);
  assert.equal(rechecks, 2);
  status = 500;
  await assert.rejects(client.get(), /Overview unavailable/);
  assert.equal(rechecks, 2);
});
