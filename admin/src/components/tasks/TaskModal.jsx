import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckSquare, ChevronDown, Calendar, 
  Flag, Layout, Target, AlertCircle, Clock 
} from 'lucide-react';

const TaskModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    project: 'E-Commerce Platform',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  });

  const priorities = [
    { id: 'low', label: 'Low', icon: <Flag size={14} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'medium', label: 'Medium', icon: <Clock size={14} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'high', label: 'High', icon: <AlertCircle size={14} />, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const statuses = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-[#0a0a0b]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-[#121214] border border-white/5 shadow-2xl rounded-[2.5rem] w-full max-w-lg relative overflow-hidden"
          >
            {/* Header Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent"></div>
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0a0a0b]/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06b6d4]/20 to-[#10b981]/20 flex items-center justify-center text-[#06b6d4] shadow-lg shadow-[#06b6d4]/10 border border-[#06b6d4]/20">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">New Objective</h2>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Operational Deployment</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            <form className="p-8 space-y-8" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              {/* Task Title */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em] ml-1">Objective Descriptor</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    className="admin-input w-full pl-6 pr-6" 
                    placeholder="e.g. Architect Core API Infrastructure" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em] ml-1">Mission Assignment</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#06b6d4]">
                    <Layout size={18} />
                  </div>
                  <select 
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-[#06b6d4]/40 focus:ring-4 focus:ring-[#06b6d4]/5 text-white rounded-[1.5rem] py-4 pl-14 pr-12 text-sm appearance-none cursor-pointer font-bold transition-all"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                  >
                    <option className="bg-[#121214]">E-Commerce Platform</option>
                    <option className="bg-[#121214]">Mobile Banking App</option>
                    <option className="bg-[#121214]">Internal Dashboard</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-white transition-colors">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em] ml-1">Priority Rank</label>
                  <div className="flex flex-wrap gap-3">
                    {priorities.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p.id})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.priority === p.id 
                            ? `${p.bg} ${p.color} border-${p.id === 'medium' ? 'amber' : p.id === 'high' ? 'red' : 'blue'}-500/50 shadow-lg` 
                            : 'bg-white/[0.02] border-white/10 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em] ml-1">Deadline</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#06b6d4] transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. May 15" 
                      className="w-full bg-white/[0.02] border border-white/10 focus:border-[#06b6d4]/40 focus:ring-4 focus:ring-[#06b6d4]/5 text-white rounded-[1.5rem] py-4 pl-14 pr-6 text-sm transition-all placeholder:text-gray-700 font-bold"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="w-full sm:flex-1 px-8 py-5 rounded-[1.5rem] font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all text-[11px] uppercase tracking-[0.2em] border border-white/5"
                >
                  Abort Session
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#06b6d4] to-[#10b981] hover:from-[#0891b2] hover:to-[#059669] text-white px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-[#06b6d4]/20 transition-all transform active:scale-95"
                >
                  Deploy Objective
                </button>
              </div>
            </form>

            {/* Sub-footer Accent */}
            <div className="p-6 bg-[#0a0a0b]/80 border-t border-white/5 text-center">
              <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">Integrated Operational Interface v1.4</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
