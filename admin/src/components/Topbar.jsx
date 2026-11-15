import { Menu, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const pageTitles = { '/': 'Overview', '/projects': 'Projects', '/tasks': 'Tasks' };
const Topbar = ({ onMenuClick, isSidebarOpen }) => {
  const { pathname } = useLocation();
  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-[#242427] bg-dark-900 px-5 sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-3 text-xs">
        <button onClick={onMenuClick} aria-label="Open navigation" aria-expanded={isSidebarOpen} aria-controls="admin-navigation" className="rounded-lg border border-[#303035] p-2 text-gray-400 hover:text-white lg:hidden"><Menu size={20} /></button>
        <Link to="/" className="hidden text-gray-500 hover:text-gray-300 sm:block">Workspace</Link>
        <ChevronRight size={13} className="hidden text-gray-600 sm:block" />
        <span className="truncate text-gray-300">{pageTitles[pathname]}</span>
      </div>
      <div className="flex shrink-0 items-center gap-5">
        <span className="hidden items-center gap-2 text-[11px] text-gray-500 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-primary-500" />All systems operational</span>
        <Link to="/projects" className="flex items-center gap-2 rounded-lg border border-[#303035] px-3 py-2 text-[11px] text-gray-300 transition-colors hover:border-primary-500/50 hover:text-white">Manage projects <ArrowUpRight size={14} /></Link>
      </div>
    </header>
  );
};
export default Topbar;
