import { Bell, Search, Menu, Command } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="h-24 px-8 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3.5 text-gray-400 hover:text-white bg-white/[0.03] border border-white/10 rounded-[1.5rem] transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>
        
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Operational Status: <span className="text-gray-300">Optimal</span></span>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md ml-8 relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#10b981] transition-colors pointer-events-none">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search your studio..." 
            className="w-full bg-white/[0.02] border border-white/10 rounded-[1.5rem] py-3.5 pl-14 pr-12 text-[13px] text-white placeholder-gray-700 focus:outline-none focus:border-[#10b981]/30 focus:ring-4 focus:ring-[#10b981]/5 transition-all shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/[0.05] border border-white/10 rounded-lg text-[9px] font-black text-gray-500 flex items-center gap-1">
            <Command size={10} /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <button className="w-12 h-12 rounded-[1.5rem] flex items-center justify-center text-gray-500 hover:text-[#10b981] bg-white/[0.03] border border-white/10 transition-all hover:bg-[#10b981]/5 group-hover:scale-105 active:scale-95 relative shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-[#10b981] rounded-full border-2 border-[#050505] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
          </button>
        </div>
        
        <div className="h-10 w-[1px] bg-white/5 mx-2"></div>
        
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-white uppercase tracking-wider group-hover:text-[#10b981] transition-colors">Ali Musdar</p>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">Primary Director</p>
          </div>
          <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-br from-[#10b981] to-[#06b6d4] p-[1.5px] group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full bg-[#050505] rounded-[1.3rem] flex items-center justify-center">
              <span className="text-xs font-black text-white">AM</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
