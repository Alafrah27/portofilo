import { Project } from '../model/Project.js';
import { Task } from '../model/Task.js';

export async function getOverview(_req, res) {
  const [projectCount, taskCounts, projects, tasks] = await Promise.all([
    Project.countDocuments(),
    Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Project.find().select('title images createdAt updatedAt').sort({ updatedAt: -1, _id: -1 }).limit(6).lean(),
    Task.find().select('title status createdAt updatedAt').sort({ updatedAt: -1, _id: -1 }).limit(6).lean(),
  ]);
  const counts = Object.fromEntries(taskCounts.map(({ _id, count }) => [_id, count]));
  const total = taskCounts.reduce((sum, item) => sum + item.count, 0);
  const completed = counts.done || 0;
  const activity = [
    ...projects.map((project) => ({ kind: 'project', ...project })),
    ...tasks.map((task) => ({ kind: 'task', ...task })),
  ].map((item) => ({
    id: `${item.kind}-${item._id}`,
    kind: item.kind,
    title: item.title,
    operation: item.updatedAt.getTime() === item.createdAt.getTime() ? 'created' : 'updated',
    status: item.kind === 'task' ? item.status : undefined,
    at: item.updatedAt,
  })).sort((a, b) => b.at - a.at || b.id.localeCompare(a.id)).slice(0, 6);

  res.json({ overview: {
    projects: projectCount,
    tasks: {
      total,
      todo: counts.todo || 0,
      inProgress: counts['in-progress'] || 0,
      completed,
      open: (counts.todo || 0) + (counts['in-progress'] || 0),
      completionRate: total ? Math.round(completed / total * 100) : 0,
    },
    recentProjects: projects.slice(0, 3).map((project) => ({
      _id: project._id,
      title: project.title,
      imageUrl: project.images[0]?.url || null,
      imageCount: project.images.length,
      updatedAt: project.updatedAt,
    })),
    activity,
    asOf: new Date(),
  } });
}
