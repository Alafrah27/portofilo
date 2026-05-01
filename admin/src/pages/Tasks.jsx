import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design database schema', project: 'E-Commerce Platform', status: 'done', priority: 'high' },
    { id: 2, title: 'Setup authentication', project: 'Mobile Banking App', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Create dashboard mockups', project: 'Internal Dashboard', status: 'todo', priority: 'medium' },
    { id: 4, title: 'Write API documentation', project: 'E-Commerce Platform', status: 'todo', priority: 'low' },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'done': return <span className="badge badge-green">Done</span>;
      case 'in-progress': return <span className="badge badge-blue">In Progress</span>;
      case 'todo': return <span className="badge badge-gray">To Do</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="text-red-400 font-medium text-sm">High</span>;
      case 'medium': return <span className="text-yellow-400 font-medium text-sm">Medium</span>;
      case 'low': return <span className="text-green-400 font-medium text-sm">Low</span>;
      default: return <span className="text-gray-400 font-medium text-sm">{priority}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Track and manage project tasks.</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary gap-2"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c1c1f] border-b border-[#2a2a2e]">
                <th className="p-4 text-sm font-medium text-gray-400">Task Title</th>
                <th className="p-4 text-sm font-medium text-gray-400">Project</th>
                <th className="p-4 text-sm font-medium text-gray-400">Priority</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-[#1c1c1f] hover:bg-[#121214] transition-colors">
                  <td className="p-4 text-sm font-semibold text-white">{task.title}</td>
                  <td className="p-4 text-sm text-gray-300">{task.project}</td>
                  <td className="p-4">{getPriorityBadge(task.priority)}</td>
                  <td className="p-4">{getStatusBadge(task.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple UI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="admin-card w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Add New Task</h2>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
                <input type="text" className="admin-input" placeholder="e.g. Implement Login" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign to Project</label>
                <select className="admin-input">
                  <option>E-Commerce Platform</option>
                  <option>Mobile Banking App</option>
                  <option>Internal Dashboard</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                  <select className="admin-input">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select className="admin-input">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
