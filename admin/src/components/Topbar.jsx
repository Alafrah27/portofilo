import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/projects': return 'Project Management';
      case '/tasks': return 'Tasks list';
      case '/leads': return 'Lead CRM';
      default: return 'Admin Portal';
    }
  };

  return (
    <header className="h-16 bg-[#121214] border-b border-[#1c1c1f] flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-semibold text-white">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#0a0a0b] border border-[#1c1c1f] rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#10b981] w-64"
          />
        </div>
        
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
