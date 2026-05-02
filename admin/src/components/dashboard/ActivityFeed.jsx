import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="admin-card p-10 bg-gradient-to-br from-white/[0.02] to-transparent border-white/5"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4] border border-[#06b6d4]/20 shadow-lg">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Pulse</h2>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Real-time Activity</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      
      <div className="space-y-8">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="flex items-start gap-6 relative group cursor-pointer">
            {idx !== activities.length - 1 && (
              <div className="absolute left-[23px] top-12 bottom-[-32px] w-[1px] bg-white/5"></div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0 flex items-center justify-center text-gray-500 group-hover:text-[#10b981] group-hover:border-[#10b981]/30 group-hover:bg-[#10b981]/5 transition-all duration-500">
              {activity.icon}
            </div>
            <div className="pt-1.5">
              <p className="text-sm text-gray-400 font-medium leading-relaxed group-hover:text-white transition-colors">{activity.action}</p>
              <p className="text-[10px] text-gray-600 font-black mt-2 uppercase tracking-[0.2em]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
