import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isSidebarOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-dvh overflow-hidden bg-dark-900 font-sans text-gray-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-dark-700 focus:p-3">Skip to content</a>
      {isSidebarOpen && <button aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/75 lg:hidden" />}
      <div id="admin-navigation" className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transition-transform duration-200 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'visible translate-x-0' : 'invisible -translate-x-full lg:visible'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen((open) => !open)} />
        <main id="main-content" key={pathname} className="custom-scrollbar flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1440px]"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};
export default Layout;
