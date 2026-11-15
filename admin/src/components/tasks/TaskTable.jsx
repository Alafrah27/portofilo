import { Calendar, Edit3, Trash2 } from 'lucide-react';
import { TASK_STATUSES, formatDeadline } from '../../tasks/taskClient.js';

const priorityColors = { high: 'text-red-400', medium: 'text-amber-400', low: 'text-sky-400' };

export default function TaskTable({ tasks, onEdit, onDelete, onStatusChange, pendingId, filtered }) {
  return <div className="admin-card overflow-hidden"><div className="custom-scrollbar overflow-x-auto">
    <table className="min-w-[800px] w-full border-collapse text-left">
      <thead><tr className="border-b border-[#242427]">{['Task', 'Project', 'Priority', 'Status', 'Actions'].map((title) => <th key={title} className={`p-5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 ${title === 'Actions' ? 'text-right' : ''}`}>{title}</th>)}</tr></thead>
      <tbody className="divide-y divide-[#242427]">{tasks.map((task) => <tr key={task._id} className="hover:bg-white/[.02]">
        <td className="p-5"><p className="max-w-xs text-sm font-medium text-white">{task.title}</p><p className="mt-2 flex items-center gap-2 text-[11px] text-gray-500"><Calendar size={12} />{formatDeadline(task.dueDate)}</p></td>
        <td className="p-5 text-xs text-gray-400">{task.projectId?.title || 'No project'}</td>
        <td className={`p-5 text-xs capitalize ${priorityColors[task.priority]}`}>{task.priority}</td>
        <td className="p-5"><select aria-label={`Status for ${task.title}`} disabled={!!pendingId} value={task.status} onChange={(event) => onStatusChange(task, event.target.value)} className="admin-input py-3 text-xs">{TASK_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>{pendingId === task._id && <p role="status" className="mt-1 text-[10px] text-gray-500">Loading…</p>}</td>
        <td className="p-5"><div className="flex justify-end gap-1"><button type="button" disabled={!!pendingId} onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} className="rounded-lg p-2.5 text-gray-500 hover:bg-primary-500/10 hover:text-primary-400"><Edit3 size={18} /></button><button type="button" disabled={!!pendingId} onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} className="rounded-lg p-2.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={18} /></button></div></td>
      </tr>)}
      {!tasks.length && <tr><td colSpan={5} className="p-12 text-center text-sm text-gray-400">{filtered ? 'No tasks match these filters.' : 'No tasks yet. Create your first task.'}</td></tr>}
      </tbody>
    </table>
  </div></div>;
}
