import { Image as ImageIcon, Eye, Edit3, Trash2 } from 'lucide-react';

export default function ProjectTable({ projects, onPreview, onEdit, onDelete, opening }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead><tr className="border-b border-[#242427]">
            {['Project', 'Images', 'Updated', 'Actions'].map((heading) => <th key={heading} className={`p-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider ${heading === 'Actions' ? 'text-right' : ''}`}>{heading}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-[#242427]">
            {projects.map((project) => (
              <tr key={project._id} className="group hover:bg-white/[.02]">
                <td className="p-5"><div className="flex items-center gap-4">
                  <img src={project.images[0]?.url} alt="" className="h-14 w-16 shrink-0 rounded-lg border border-[#29292d] object-cover" />
                  <button type="button" onClick={() => onPreview(project)} disabled={!!opening} className="max-w-xs text-left text-sm font-medium text-white hover:text-primary-400">{project.title}</button>
                </div></td>
                <td className="p-5"><span className="flex items-center gap-2 text-xs text-gray-400"><ImageIcon size={14} className="text-accent-500" />{project.images.length}</span></td>
                <td className="p-5 text-xs text-gray-500"><time dateTime={project.updatedAt}>{new Date(project.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</time></td>
                <td className="p-5"><div className="flex items-center justify-end gap-1">
                  <button type="button" disabled={!!opening} onClick={() => onPreview(project)} aria-label={`Preview ${project.title}`} title="Preview project" className="rounded-lg p-2.5 text-gray-500 hover:bg-accent-500/10 hover:text-accent-500"><Eye size={18} /></button>
                  <button type="button" disabled={!!opening} onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`} title="Edit project" className="rounded-lg p-2.5 text-gray-500 hover:bg-primary-500/10 hover:text-primary-400"><Edit3 size={18} /></button>
                  <button type="button" disabled={!!opening} onClick={() => onDelete(project)} aria-label={`Delete ${project.title}`} title="Delete project" className="rounded-lg p-2.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={18} /></button>
                </div>{opening === project._id && <p role="status" className="mt-1 text-right text-[10px] text-gray-500">Loading…</p>}</td>
              </tr>
            ))}
            {!projects.length && <tr><td colSpan={4} className="p-12 text-center"><p className="text-sm text-gray-300">No projects yet.</p><p className="mt-2 text-xs text-gray-500">Create your first case study to get started.</p></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
