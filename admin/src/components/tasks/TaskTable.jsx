import { motion } from 'framer-motion';
import { Calendar, Layout, Edit3, Trash2, AlertCircle, Clock, Flag } from 'lucide-react';

const TaskStatusBadge = ({ status }) => {
  switch(status) {
    case 'done': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
        ● Completed
      </span>
    );
    case 'in-progress': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
        ● In Progress
      </span>
    );
    case 'todo': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">
        ● To Do
      </span>
    );
    default: return <span className="badge badge-gray">{status}</span>;
  }
};

const TaskPriorityBadge = ({ priority }) => {
  switch(priority) {
    case 'high': return (
      <span className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold uppercase tracking-wider">
        <AlertCircle size={14} /> High
      </span>
    );
    case 'medium': return (
      <span className="flex items-center gap-1.5 text-amber-500 text-[11px] font-bold uppercase tracking-wider">
        <Clock size={14} /> Medium
      </span>
    );
    case 'low': return (
      <span className="flex items-center gap-1.5 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
        <Flag size={14} /> Low
      </span>
    );
    default: return <span className="text-gray-400">{priority}</span>;
  }
};

const TaskRow = ({ task, index }) => (
  <motion.tr 
    key={task.id} 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="hover:bg-white/[0.02] transition-all group"
  >
    <td className="p-6">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-10 rounded-full transition-all duration-500 ${task.status === 'done' ? 'bg-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-[#1c1c1f]'}`} />
        <div>
          <p className="text-sm font-bold text-white group-hover:text-[#06b6d4] transition-colors tracking-tight">{task.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Calendar size={12} className="text-gray-600" />
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Due {task.dueDate}</p>
          </div>
        </div>
      </div>
    </td>
    <td className="p-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 w-fit group-hover:border-[#06b6d4]/20 group-hover:text-gray-300 transition-all">
        <Layout size={14} className="text-[#06b6d4]" />
        {task.project}
      </div>
    </td>
    <td className="p-6"><TaskPriorityBadge priority={task.priority} /></td>
    <td className="p-6"><TaskStatusBadge status={task.status} /></td>
    <td className="p-6">
      <div className="flex items-center justify-end gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 border border-transparent hover:border-[#06b6d4]/20 transition-all">
          <Edit3 size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </motion.tr>
);

const TaskTable = ({ tasks }) => {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#0a0a0b]/50 border-b border-[#1c1c1f]">
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Task Objective</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Linked Project</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Priority</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1f]">
            {tasks.map((task, index) => (
              <TaskRow key={task.id} task={task} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
