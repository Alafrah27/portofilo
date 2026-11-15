import { useEffect, useRef } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../tasks/taskClient.js';

export default function TaskModal({ isOpen, editing, onClose, formData, setFormData, onSave, saving, error,
  projects, currentProject, projectsLoading, projectsError, onProjectsRetry }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => {
    if (isOpen) { dialogRef.current?.showModal(); titleRef.current?.focus(); }
    else dialogRef.current?.close();
  }, [isOpen]);
  function change(key, value) { setFormData((current) => ({ ...current, [key]: value })); }
  return <dialog ref={dialogRef} aria-labelledby="task-dialog-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
    className="custom-scrollbar fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-[#29292d] bg-[#090909] p-0 text-gray-300 backdrop:bg-black/80">
    {isOpen && <form onSubmit={onSave} aria-busy={saving}>
      <header className="flex items-center justify-between gap-4 px-6 pt-6"><h2 id="task-dialog-title" className="text-lg font-semibold text-white">{editing ? 'Edit task' : 'New task'}</h2>
        <button type="button" disabled={saving} onClick={onClose} aria-label="Close task dialog" className="rounded-md p-1.5 text-gray-500 hover:text-white"><X size={18} /></button></header>
      <fieldset disabled={saving} className="space-y-5 border-0 p-6">
        {error && <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/5 p-3 text-sm text-red-300">{error}</p>}
        <div><label htmlFor="task-name" className="mb-2 block text-xs text-gray-300">Task title <span className="text-primary-400">*</span></label><input ref={titleRef} id="task-name" required maxLength={200} placeholder="What needs to be done?" value={formData.title} onChange={(event) => change('title', event.target.value)} className="admin-input w-full" /></div>
        <div><label htmlFor="task-project" className="mb-2 block text-xs text-gray-300">Project <span className="text-gray-500">(optional)</span></label>
          <select id="task-project" value={formData.projectId} disabled={projectsLoading} onChange={(event) => change('projectId', event.target.value)} className="admin-input w-full">
            <option value="">No project</option>
            {currentProject && !projects.some((project) => project._id === currentProject._id) && <option value={currentProject._id}>{currentProject.title}</option>}
            {projects.map((project) => <option key={project._id} value={project._id}>{project.title}</option>)}
          </select>
          {projectsLoading && <p role="status" className="mt-2 text-xs text-gray-500">Loading projects…</p>}
          {projectsError && <div className="mt-2 text-xs leading-5 text-amber-300"><p>Projects could not be loaded. You can create a task without a project.</p><button type="button" disabled={projectsLoading} onClick={onProjectsRetry} className="mt-1 text-primary-400">Retry projects</button></div>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label htmlFor="task-status" className="mb-2 block text-xs text-gray-300">Status</label><select id="task-status" value={formData.status} onChange={(event) => change('status', event.target.value)} className="admin-input w-full text-xs">{TASK_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div><label htmlFor="task-priority" className="mb-2 block text-xs text-gray-300">Priority</label><select id="task-priority" value={formData.priority} onChange={(event) => change('priority', event.target.value)} className="admin-input w-full text-xs">{TASK_PRIORITIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        </div>
        <div><label htmlFor="task-deadline" className="mb-2 block text-xs text-gray-300">Deadline <span className="text-gray-500">(optional)</span></label><input id="task-deadline" type="date" value={formData.dueDate} onChange={(event) => change('dueDate', event.target.value)} className="admin-input w-full" /></div>
      </fieldset>
      <footer className="flex justify-end gap-3 px-6 pb-6"><button type="button" disabled={saving} onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{editing ? <Save size={16} /> : <Plus size={16} />}{saving ? 'Saving…' : editing ? 'Save changes' : 'Create task'}</button></footer>
    </form>}
  </dialog>;
}
