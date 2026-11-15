import { useState } from 'react';
import { useAuth } from '../auth/useAuth.js';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, LogOut, X, ArrowUpRight } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const initials = (user?.email || '').slice(0, 2).toUpperCase();
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError('');
    try {
      await logout();
      onClose();
    } catch (error) {
      setSignOutError(error.message);
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
  <aside className="flex h-full flex-col border-r border-[#242427] bg-dark-800">
    <div className="flex h-20 shrink-0 items-center justify-between px-7">
      <Link to="/" onClick={onClose} aria-label="Musdar admin home" className="flex items-center gap-2.5">
        <img src="/musdar-logo.png" alt="" className="h-9 w-9 object-contain brightness-0 invert" />
        <span className="text-xl font-semibold tracking-tight text-white">Musdar<span className="text-primary-500">.dev</span></span>
      </Link>
      <button onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"><X size={18} /></button>
    </div>
    <div className="px-7 pb-8 pt-6">
      <div className="inline-flex items-center gap-2 rounded-md border border-[#303035] bg-dark-700 px-2.5 py-1 text-[10px] tracking-widest text-gray-400"><span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> ADMIN WORKSPACE</div>
    </div>
    <nav aria-label="Main navigation" className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4">
      <p className="px-3 pb-3 text-[10px] font-medium uppercase tracking-[.15em] text-gray-500">Workspace</p>
      {menuItems.map(({ icon: Icon, label, path }) => (
        <NavLink key={path} to={path} end={path === '/'} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-lg border px-3 py-3 text-[13px] transition-colors ${isActive ? 'border-primary-500/20 bg-primary-500/10 text-primary-400' : 'border-transparent text-gray-400 hover:bg-white/[.03] hover:text-white'}`}>
          <Icon size={18} strokeWidth={1.7} />{label}
        </NavLink>
      ))}
    </nav>
    <div className="mx-4 mb-6 mt-8 rounded-xl border border-[#242427] p-4">
      <p className="text-xs font-medium text-white">Your work, out in the world.</p>
      <p className="mt-2 text-[11px] leading-relaxed text-gray-500">Explore the Musdar portfolio.</p>
      <a href={import.meta.env.VITE_WEBSITE_URL || 'https://musdar.com'} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-primary-400 hover:text-white">View website <ArrowUpRight size={15} /></a>
    </div>
    <div className="border-t border-[#242427] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-500/20 bg-primary-500/10 text-xs font-medium text-primary-400">{initials}</div>
        <div className="min-w-0 flex-1"><p title={user?.email} className="truncate text-xs font-medium text-white">{user?.email}</p><p className="mt-1 text-[10px] text-gray-500">Administrator</p></div>
        <button type="button" onClick={handleSignOut} disabled={isSigningOut} aria-label={isSigningOut ? 'Signing out' : 'Sign out'} title={isSigningOut ? 'Signing out…' : 'Sign out'} className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white disabled:opacity-50"><LogOut size={17} /></button>
      </div>
      {signOutError && <p role="alert" className="mt-3 text-[11px] leading-5 text-red-300">{signOutError}</p>}
    </div>
  </aside>
  );
};
export default Sidebar;
