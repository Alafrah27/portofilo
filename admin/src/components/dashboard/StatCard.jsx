import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, color, bg, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.8 }}
      className="admin-card p-10 flex flex-col relative overflow-hidden group hover:border-white/10 transition-all border-white/5"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }}></div>
      
      <div className="flex justify-between items-start mb-8">
        <div className={`w-14 h-14 ${bg} rounded-[1.5rem] flex items-center justify-center text-white border border-white/5 shadow-xl`}>
          <div style={{ color: color }}>{icon}</div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
          <TrendingUp size={12} className="text-[#10b981]" /> +12%
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-5xl font-black text-white mb-4 tracking-tighter italic">{value}</p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
