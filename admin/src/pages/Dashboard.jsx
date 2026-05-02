import { motion } from 'framer-motion';
import { 
  Zap, Users, Briefcase, FileText, Sparkles, TrendingUp,
  Activity, ArrowUpRight, Plus, Rocket, Star, Globe
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const stats = [
    { 
      id: 1, 
      title: 'Active Accounts', 
      value: '2,481', 
      icon: <Users size={28} />, 
      trend: 'Momentum building', 
      color: '#10b981', 
      bg: 'bg-[#10b981]/10' 
    },
    { 
      id: 2, 
      title: 'Current Missions', 
      value: '148', 
      icon: <Briefcase size={28} />, 
      trend: 'On schedule', 
      color: '#06b6d4', 
      bg: 'bg-[#06b6d4]/10' 
    },
    { 
      id: 3, 
      title: 'Total Revenue', 
      value: '$85.2k', 
      icon: <TrendingUp size={28} />, 
      trend: 'Exceeding targets', 
      color: '#f59e0b', 
      bg: 'bg-amber-500/10' 
    },
    { 
      id: 4, 
      title: 'Studio Growth', 
      value: '32%', 
      icon: <Zap size={28} />, 
      trend: 'Stable expansion', 
      color: '#8b5cf6', 
      bg: 'bg-purple-500/10' 
    },
  ];

  const activities = [
    { id: 1, icon: <Rocket size={20} />, action: 'New SaaS Project "Nexus" deployed to staging.', time: '14 MINUTES AGO' },
    { id: 2, icon: <Star size={20} />, action: 'Design system update v2.4 finalized by Sarah.', time: '2 HOURS AGO' },
    { id: 3, icon: <Globe size={20} />, action: 'Cloud infrastructure expanded to EU-West region.', time: '5 HOURS AGO' },
  ];

  return (
    <div className="space-y-12 animate-in pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#10b981]/20">Status: Operational</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter italic leading-[0.9]">
            Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4] px-1">Overview.</span>
          </h1>
          <p className="text-gray-500 mt-6 text-base font-medium leading-relaxed max-w-lg">
            Track your agency's performance through a high-fidelity lens. From real-time pulses to strategic metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 rounded-2xl bg-[#121214] border border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:border-white/10 transition-all active:scale-95">Download PDF</button>
          <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[#10b981]/20 hover:scale-105 active:scale-95 transition-all">New Project</button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} {...stat} delay={index} />
        ))}
      </div>

      {/* Secondary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <ActivityFeed activities={activities} />

        {/* Big Integration Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 admin-card p-12 bg-gradient-to-br from-[#10b981]/5 to-transparent border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent"></div>
          <div className="w-24 h-24 rounded-[2.5rem] bg-[#10b981]/10 flex items-center justify-center text-[#10b981] mb-10 shadow-2xl shadow-[#10b981]/10 group-hover:scale-110 transition-transform duration-700">
            <Sparkles size={48} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Expand Your World</h3>
            <p className="text-sm text-gray-500 mt-4 max-w-[300px] mx-auto font-medium leading-relaxed">
              Connect with the tools you love and create a seamless workflow tailored to your agency's unique needs.
            </p>
          </div>
          <button className="mt-10 btn-primary px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] relative z-10 active:scale-95 transition-transform">
            View Marketplace
          </button>
          
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#06b6d4]/20 transition-all"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
