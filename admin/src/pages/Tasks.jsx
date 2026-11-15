import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';
import TaskDeleteDialog from '../components/tasks/TaskDeleteDialog';
import { tasksApi, taskForm, filterTasks, TASK_STATUSES, TASK_PRIORITIES } from '../tasks/taskClient.js';
import { projectsApi } from '../projects/projectClient.js';

const initialForm = { title: '', projectId: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectsError, setProjectsError] = useState('');
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    tasksApi.list().then((data) => { if (active) setTasks(data); })
      .catch((failure) => { if (active) setError(failure.message); })
      .finally(() => { if (active) setLoading(false); });
    projectsApi.list().then((data) => { if (active) setProjects(data); })
      .catch((failure) => { if (active) setProjectsError(failure.message); })
      .finally(() => { if (active) setProjectsLoading(false); });
    return () => { active = false; };
  }, []);

  async function reload() {
    if (busy.current) return;
    setLoading(true);
    setError('');
    try { setTasks(await tasksApi.list()); }
    catch (failure) { setError(failure.message); }
    finally { setLoading(false); }
  }

  async function reloadProjects() {
    setProjectsLoading(true);
    setProjectsError('');
    try { setProjects(await projectsApi.list()); }
    catch (failure) { setProjectsError(failure.message); }
    finally { setProjectsLoading(false); }
  }

  function close() { if (!busy.current) { setIsModalOpen(false); setFormError(''); } }

  function create() {
    if (busy.current) return;
    setSelected(null);
    setFormData(initialForm);
    setFormError('');
    setIsModalOpen(true);
  }

  async function edit(task) {
    if (busy.current) return;
    busy.current = true;
    setPendingId(task._id);
    setError('');
    setMessage('');
    try {
      const latest = await tasksApi.get(task._id);
      setSelected(latest);
      setFormData(taskForm(latest));
      setFormError('');
      setIsModalOpen(true);
    } catch (failure) { setError(failure.message); }
    finally { busy.current = false; setPendingId(null); }
  }

  async function save(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    setFormError('');
    try {
      const task = selected ? await tasksApi.update(selected._id, formData) : await tasksApi.create(formData);
      setTasks((current) => selected ? current.map((item) => item._id === task._id ? task : item) : [task, ...current]);
      if (!selected) setFilters({ status: '', priority: '' });
      setMessage(selected ? 'Task updated.' : 'Task created.');
      setIsModalOpen(false);
    } catch (failure) { setFormError(failure.message); }
    finally { busy.current = false; setSaving(false); }
  }

  async function setStatus(task, status) {
    if (busy.current || status === task.status) return;
    busy.current = true;
    setPendingId(task._id);
    setError('');
    setMessage('');
    try {
      const updated = await tasksApi.setStatus(task._id, status);
      setTasks((current) => current.map((item) => item._id === updated._id ? updated : item));
      setMessage('Task status updated.');
    } catch (failure) { setError(failure.message); }
    finally { busy.current = false; setPendingId(null); }
  }

  async function confirmDelete() {
    if (busy.current || !deleteTarget) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError('');
    try {
      await tasksApi.remove(deleteTarget._id);
      setTasks((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      setMessage('Task deleted.');
    } catch (failure) { setDeleteError(failure.message); }
    finally { busy.current = false; setDeleting(false); }
  }

  const visibleTasks = filterTasks(tasks, filters);
  return <div className="space-y-8 animate-in">
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div><div className="eyebrow mb-3"><span className="h-[2px] w-8 bg-accent-500" /><span>Make things happen</span></div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your <span className="gradient-text">tasks.</span></h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">Plan your next steps and keep your projects moving.</p></div>
      <button type="button" disabled={loading || !!pendingId} onClick={create} className="btn-primary"><Plus size={18} />New Task</button>
    </div>
    <div className="flex flex-wrap items-end gap-4">
      <div><label htmlFor="filter-task-status" className="mb-2 block text-xs text-gray-400">Filter by status</label><select id="filter-task-status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="admin-input text-xs"><option value="">All statuses</option>{TASK_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
      <div><label htmlFor="filter-task-priority" className="mb-2 block text-xs text-gray-400">Filter by priority</label><select id="filter-task-priority" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} className="admin-input text-xs"><option value="">All priorities</option>{TASK_PRIORITIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
      {(filters.status || filters.priority) && <button type="button" onClick={() => setFilters({ status: '', priority: '' })} className="btn-secondary text-xs">Clear filters</button>}
    </div>
    {message && <p role="status" className="text-sm text-primary-400">{message}</p>}
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-300"><span>{error}</span><button type="button" disabled={loading || !!pendingId} onClick={reload} className="btn-secondary">Retry</button></div>}
    {loading ? <p role="status" className="py-12 text-center text-sm text-gray-400">Loading tasks…</p> : (!error || tasks.length > 0) && <TaskTable tasks={visibleTasks} pendingId={pendingId} onEdit={edit} onStatusChange={setStatus} onDelete={(task) => { setDeleteTarget(task); setDeleteError(''); }} filtered={!!(filters.status || filters.priority)} />}
    {!loading && !error && <p className="text-xs text-gray-500">Showing {visibleTasks.length} of {tasks.length} tasks</p>}
    <TaskModal key={`${isModalOpen}-${selected?._id || 'new'}`} isOpen={isModalOpen} editing={!!selected} onClose={close}
      formData={formData} setFormData={setFormData} onSave={save} saving={saving} error={formError}
      projects={projects} currentProject={selected?.projectId} projectsLoading={projectsLoading} projectsError={projectsError} onProjectsRetry={reloadProjects} />
    <TaskDeleteDialog task={deleteTarget} deleting={deleting} error={deleteError} onConfirm={confirmDelete} onClose={() => { if (!busy.current) setDeleteTarget(null); }} />
  </div>;
}
