import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Users } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#121214] border-r border-[#1c1c1f] flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#1c1c1f]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#10b981] rounded flex items-center justify-center font-bold text-white">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Musdar<span className="text-[#10b981]">.dev</span>
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-[#064e3b] text-[#10b981]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1c1c1f]'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-[#1c1c1f]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
            AE
          </div>
          <div>
            <p className="text-sm font-medium text-white">Ali Edris</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
