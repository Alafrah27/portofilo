import { authClient, authStore } from '../auth/authStore.js';

export const TASK_STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Completed' },
];
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function taskPayload(form) {
  const title = form.title.trim();
  if (!title || title.length > 200) throw new Error('Enter a task title of up to 200 characters.');
  if (!TASK_STATUSES.some((item) => item.value === form.status)) throw new Error('Choose a valid status.');
  if (!TASK_PRIORITIES.some((item) => item.value === form.priority)) throw new Error('Choose a valid priority.');
  if (form.dueDate) {
    const date = new Date(`${form.dueDate}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dueDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== form.dueDate) {
      throw new Error('Choose a valid deadline date.');
    }
  }
  return { title, projectId: form.projectId || null, status: form.status, priority: form.priority, dueDate: form.dueDate || null };
}

export function taskForm(task) {
  return { title: task.title, projectId: task.projectId?._id || '', status: task.status, priority: task.priority, dueDate: task.dueDate?.slice(0, 10) || '' };
}

export function formatDeadline(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'No deadline';
}

export function filterTasks(tasks, { status = '', priority = '' } = {}) {
  return tasks.filter((task) => (!status || task.status === status) && (!priority || task.priority === priority));
}

export function createTaskClient({ request, onUnauthorized = async () => {} }) {
  async function send(path, options) {
    try { return await request(path, options); }
    catch (error) {
      if (error.status === 401 || error.status === 403) await onUnauthorized();
      throw error;
    }
  }
  const pathFor = (id) => `/tasks/${encodeURIComponent(id)}`;
  return {
    async list() { return (await send('/tasks')).tasks; },
    async get(id) { return (await send(pathFor(id))).task; },
    async create(form) { return (await send('/tasks', { method: 'POST', body: taskPayload(form) })).task; },
    async update(id, form) { return (await send(pathFor(id), { method: 'PATCH', body: taskPayload(form) })).task; },
    async setStatus(id, status) {
      if (!TASK_STATUSES.some((item) => item.value === status)) throw new Error('Choose a valid status.');
      return (await send(pathFor(id), { method: 'PATCH', body: { status } })).task;
    },
    async remove(id) { await send(pathFor(id), { method: 'DELETE' }); },
  };
}

export const tasksApi = createTaskClient({
  request: (path, options) => authClient.apiRequest(path, options),
  onUnauthorized: () => authStore.checkSession(),
});
