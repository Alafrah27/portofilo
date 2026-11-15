import { Task, TASK_STATUSES, TASK_PRIORITIES } from '../model/Task.js';
import { Project } from '../model/Project.js';
import { HttpError } from '../utils/errors.js';

const populatedProject = { path: 'projectId', select: 'title' };

function enumValue(name, value, allowed) {
  if (!allowed.includes(value)) throw new HttpError(400, `Invalid task ${name}.`);
  return value;
}

export function parseTaskDate(value) {
  if (value === null) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new HttpError(400, 'Deadline must be YYYY-MM-DD or null.');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new HttpError(400, 'Invalid deadline date.');
  }
  return date;
}

async function fields(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || Object.keys(body).some((key) => !['title', 'projectId', 'status', 'priority', 'dueDate'].includes(key))) {
    throw new HttpError(400, 'Invalid task fields.');
  }
  const data = {};
  if (!partial || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) {
      throw new HttpError(400, 'Task title is required and must be at most 200 characters.');
    }
    data.title = body.title.trim();
  }
  if (Object.hasOwn(body, 'status')) data.status = enumValue('status', body.status, TASK_STATUSES);
  if (Object.hasOwn(body, 'priority')) data.priority = enumValue('priority', body.priority, TASK_PRIORITIES);
  if (Object.hasOwn(body, 'dueDate')) data.dueDate = parseTaskDate(body.dueDate);
  if (Object.hasOwn(body, 'projectId')) {
    if (body.projectId !== null && (typeof body.projectId !== 'string' || !/^[a-f\d]{24}$/i.test(body.projectId)
      || !await Project.exists({ _id: body.projectId }))) {
      throw new HttpError(400, 'Choose an existing project or no project.');
    }
    data.projectId = body.projectId;
  }
  if (partial && !Object.keys(data).length) throw new HttpError(400, 'Provide task fields to update.');
  return data;
}

async function find(id) {
  const task = await Task.findById(id);
  if (!task) throw new HttpError(404, 'Task not found.');
  return task;
}

export const taskController = {
  async list(req, res) {
    if (Object.keys(req.query).some((key) => !['status', 'priority'].includes(key))) {
      throw new HttpError(400, 'Only status and priority filters are supported.');
    }
    const filter = {};
    if (req.query.status !== undefined) filter.status = enumValue('status', req.query.status, TASK_STATUSES);
    if (req.query.priority !== undefined) filter.priority = enumValue('priority', req.query.priority, TASK_PRIORITIES);
    res.json({ tasks: await Task.find(filter).sort({ createdAt: -1, _id: -1 }).populate(populatedProject) });
  },
  async get(req, res) {
    const task = await find(req.params.id);
    await task.populate(populatedProject);
    res.json({ task });
  },
  async create(req, res) {
    const task = await Task.create({ ...await fields(req.body), userId: req.user._id });
    await task.populate(populatedProject);
    res.status(201).json({ task });
  },
  async update(req, res) {
    const data = await fields(req.body, true);
    const task = await find(req.params.id);
    Object.assign(task, data);
    try { await task.save(); }
    catch (error) {
      if (error.name === 'VersionError' || error.name === 'DocumentNotFoundError') {
        throw new HttpError(409, 'Task changed. Reload it and try again.');
      }
      throw error;
    }
    await task.populate(populatedProject);
    res.json({ task });
  },
  async remove(req, res) {
    if (!await Task.findByIdAndDelete(req.params.id)) throw new HttpError(404, 'Task not found.');
    res.status(204).end();
  },
};
