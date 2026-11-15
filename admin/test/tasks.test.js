import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTaskClient, taskPayload, taskForm, filterTasks, formatDeadline } from '../src/tasks/taskClient.js';

const form = { title: '  Prepare launch  ', projectId: '', status: 'todo', priority: 'medium', dueDate: '' };

test('task payload trims title, defaults optional fields to null and omits protected fields', () => {
  assert.deepEqual(taskPayload({ ...form, userId: 'ignored', createdAt: 'ignored' }), {
    title: 'Prepare launch', projectId: null, status: 'todo', priority: 'medium', dueDate: null,
  });
  assert.equal(taskPayload({ ...form, dueDate: '2028-02-29', projectId: 'project-id' }).dueDate, '2028-02-29');
});

test('invalid titles, enums, and impossible deadlines are rejected before sending', () => {
  for (const changes of [{ title: ' ' }, { title: 'x'.repeat(201) }, { status: 'bad' }, { priority: 'urgent' }, { dueDate: 'Tomorrow' }, { dueDate: '2026-02-29' }, { dueDate: '2026-02-30' }]) {
    assert.throws(() => taskPayload({ ...form, ...changes }));
  }
});

test('edit form handles populated projects, deleted projects, dates, and cleared deadlines', () => {
  const task = { title: 'Task', projectId: { _id: 'abc', title: 'Project' }, status: 'done', priority: 'low', dueDate: '2028-02-29T00:00:00.000Z' };
  assert.equal(taskForm(task).projectId, 'abc');
  assert.equal(taskForm(task).dueDate, '2028-02-29');
  assert.equal(taskForm({ ...task, projectId: null, dueDate: null }).projectId, '');
  assert.equal(taskForm({ ...task, projectId: null, dueDate: null }).dueDate, '');
  assert.equal(formatDeadline(null), 'No deadline');
  assert.ok(formatDeadline(task.dueDate).includes('29'));
});

test('filters combine status and priority without changing source data', () => {
  const tasks = [{ status: 'todo', priority: 'high' }, { status: 'done', priority: 'high' }, { status: 'done', priority: 'low' }];
  assert.equal(filterTasks(tasks).length, 3);
  assert.equal(filterTasks(tasks, { status: 'done' }).length, 2);
  assert.deepEqual(filterTasks(tasks, { status: 'done', priority: 'high' }), [tasks[1]]);
  assert.equal(filterTasks(tasks, { status: 'todo', priority: 'low' }).length, 0);
  assert.equal(tasks.length, 3);
});

test('task API uses correct methods, returns persisted records and only patches status for quick updates', async () => {
  const calls = [];
  const task = { _id: 'abc', title: 'Task' };
  const client = createTaskClient({ request: async (path, options) => {
    calls.push({ path, options });
    return options?.method === 'DELETE' ? null : path === '/tasks' && !options ? { tasks: [task] } : { task };
  } });
  assert.deepEqual(await client.list(), [task]);
  assert.deepEqual(await client.get('abc'), task);
  assert.deepEqual(await client.create(form), task);
  assert.deepEqual(await client.update('abc', form), task);
  assert.deepEqual(await client.setStatus('abc', 'done'), task);
  await client.remove('abc');
  assert.deepEqual(calls.map(({ path, options }) => [path, options?.method || 'GET']), [
    ['/tasks', 'GET'], ['/tasks/abc', 'GET'], ['/tasks', 'POST'], ['/tasks/abc', 'PATCH'], ['/tasks/abc', 'PATCH'], ['/tasks/abc', 'DELETE'],
  ]);
  assert.deepEqual(calls[4].options.body, { status: 'done' });
  assert.equal(calls[2].options.body.projectId, null);
});

test('invalid forms send no requests and authorization failures recheck the admin session', async () => {
  let calls = 0;
  let checked = 0;
  let status = 403;
  const client = createTaskClient({ request: async () => { calls++; throw Object.assign(new Error('Server error'), { status }); }, onUnauthorized: async () => { checked++; } });
  await assert.rejects(client.create({ ...form, title: '' }));
  await assert.rejects(client.setStatus('abc', 'invalid'));
  assert.equal(calls, 0);
  await assert.rejects(client.list(), /Server error/);
  assert.equal(checked, 1);
  status = 502;
  await assert.rejects(client.remove('abc'), /Server error/);
  assert.equal(checked, 1);
});
