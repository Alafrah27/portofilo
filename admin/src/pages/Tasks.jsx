import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design database schema', project: 'E-Commerce Platform', status: 'done', priority: 'high', dueDate: 'Today' },
    { id: 2, title: 'Setup authentication', project: 'Mobile Banking App', status: 'in-progress', priority: 'high', dueDate: 'Tomorrow' },
    { id: 3, title: 'Create dashboard mockups', project: 'Internal Dashboard', status: 'todo', priority: 'medium', dueDate: 'May 5' },
    { id: 4, title: 'Write API documentation', project: 'E-Commerce Platform', status: 'todo', priority: 'low', dueDate: 'May 8' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#06b6d4]"></span>
            <span className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-[0.3em]">Operational Flow</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Task Engine</h2>
          <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">
            Track development progress and manage daily operations. Stay on top of every milestone and deadline.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="w-14 h-14 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white bg-[#121214] border border-[#1c1c1f] transition-all shrink-0">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex-1 sm:flex-none gap-2.5 shadow-2xl shadow-[#06b6d4]/10 hover:shadow-[#06b6d4]/20 px-8 py-3.5 rounded-2xl text-sm font-bold bg-[#06b6d4] hover:bg-[#0891b2] border-none flex justify-center items-center"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <TaskTable tasks={tasks} />

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Tasks;
