import { motion } from 'framer-motion';
import { Image as ImageIcon, CheckCircle2, Layout, FileText, Eye, Edit3, Trash2 } from 'lucide-react';

const ProjectStatusBadge = ({ status }) => {
  switch(status) {
    case 'completed': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        <CheckCircle2 size={12} /> Completed
      </span>
    );
    case 'development': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
        <Layout size={12} /> In Dev
      </span>
    );
    case 'planning': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <FileText size={12} /> Planning
      </span>
    );
    default: return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-500 border border-gray-500/20">
        {status}
      </span>
    );
  }
};

const ProjectRow = ({ project, index }) => (
  <motion.tr 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="hover:bg-white/[0.02] transition-all group"
  >
    <td className="p-6">
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#121214] border border-[#1c1c1f] flex items-center justify-center text-[#06b6d4] shadow-xl">
            <ImageIcon size={12} />
          </div>
        </div>
        <div>
          <p className="text-base font-bold text-white group-hover:text-[#10b981] transition-colors tracking-tight">{project.title}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-[200px]">{project.subtitle}</p>
        </div>
      </div>
    </td>
    <td className="p-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
          <ImageIcon size={14} className="text-[#06b6d4]" />
          <span>{project.imageCount} Assets attached</span>
        </div>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Updated {project.updatedAt}</p>
      </div>
    </td>
    <td className="p-6">
      <ProjectStatusBadge status={project.status} />
    </td>
    <td className="p-6">
      <div className="flex items-center justify-end gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 border border-transparent hover:border-[#06b6d4]/20 transition-all" title="View Preview">
          <Eye size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#10b981] hover:bg-[#10b981]/10 border border-transparent hover:border-[#10b981]/20 transition-all" title="Edit Content">
          <Edit3 size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all" title="Delete Project">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </motion.tr>
);

const ProjectTable = ({ projects }) => {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#0a0a0b]/50 border-b border-[#1c1c1f]">
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Project Identity</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Activity</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1f]">
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
