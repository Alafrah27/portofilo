import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  X,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Studio', path: '/' },
    { icon: <Briefcase size={22} />, label: 'Projects', path: '/projects' },
    { icon: <CheckSquare size={22} />, label: 'Tasks', path: '/tasks' },
    { icon: <Users size={22} />, label: 'Leads', path: '/leads' },
  ];

  const bottomItems = [
    { icon: <Settings size={22} />, label: 'Preferences', path: '/settings' },
    { icon: <LogOut size={22} />, label: 'Sign Out', path: '/login' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => window.innerWidth < 1024 && onClose()}
      className={({ isActive }) => `
        flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative
        ${isActive 
          ? 'bg-gradient-to-r from-[#10b981]/10 to-[#06b6d4]/10 text-white shadow-xl shadow-[#10b981]/5 border border-[#10b981]/10' 
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'}
      `}
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? 'text-[#10b981]' : 'group-hover:text-gray-300'} transition-colors`}>
            {item.icon}
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          {isActive && (
            <motion.div 
              layoutId="active-pill"
              className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-[#10b981] to-[#06b6d4] rounded-r-full"
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
      <aside className="h-full bg-[#050505] border-r border-white/5 flex flex-col">
        {/* Logo Section */}
        <div className="p-10 relative">
          <div className="absolute top-10 left-10 w-12 h-12 bg-[#10b981]/20 rounded-full blur-2xl opacity-50"></div>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter">Musdar <span className="text-[#10b981]">.</span></h1>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-1">Creative Studio</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-3 custom-scrollbar overflow-y-auto py-4">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
          
          <div className="pt-8 px-6">
            <div className="h-[1px] bg-white/5 w-full"></div>
          </div>

          <div className="pt-8 space-y-3">
            <p className="px-6 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4">Account Control</p>
            {bottomItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>
        </nav>

        {/* Human Profile Section */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group hover:border-[#10b981]/20 transition-all duration-500 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10b981]/20 to-[#06b6d4]/20 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
              <span className="text-xs font-black text-[#10b981]">AM</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-white uppercase tracking-wider">Ali Musdar</p>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">Creative Director</p>
            </div>
          </div>
        </div>
      </aside>
  );
};

export default Sidebar;
