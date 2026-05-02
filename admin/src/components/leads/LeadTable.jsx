import { motion } from 'framer-motion';
import { Eye, MessageSquare, Trash2 } from 'lucide-react';

const LeadStatusBadge = ({ status }) => {
  switch(status) {
    case 'new': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        ● New Lead
      </span>
    );
    case 'contacted': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
        ● Contacted
      </span>
    );
    case 'closed': return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
        ● Closed
      </span>
    );
    default: return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/20">
        ● {status}
      </span>
    );
  }
};

const LeadAvatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a0a0b] to-[#1c1c1f] border border-white/5 flex items-center justify-center text-xs font-bold text-gray-300 shadow-inner group-hover:border-[#10b981]/30 transition-colors">
      {initials}
    </div>
  );
};

const LeadRow = ({ lead, index }) => (
  <motion.tr 
    key={lead.id} 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="hover:bg-white/[0.02] transition-all group"
  >
    <td className="p-6">
      <div className="flex items-center gap-4">
        <LeadAvatar name={lead.name} />
        <div>
          <p className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors tracking-tight">{lead.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>
        </div>
      </div>
    </td>
    <td className="p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-300 font-medium">{lead.type}</p>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Received {lead.time}</p>
      </div>
    </td>
    <td className="p-6">
      <span className="text-[11px] font-bold text-[#10b981] bg-[#10b981]/5 px-3 py-1.5 rounded-xl border border-[#10b981]/10 uppercase tracking-wider">
        {lead.budget}
      </span>
    </td>
    <td className="p-6"><LeadStatusBadge status={lead.status} /></td>
    <td className="p-6">
      <div className="flex items-center justify-end gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 border border-transparent hover:border-[#06b6d4]/20 transition-all" title="View Details">
          <Eye size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#10b981] hover:bg-[#10b981]/10 border border-transparent hover:border-[#10b981]/20 transition-all" title="Send Message">
          <MessageSquare size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all" title="Archive Lead">
          <Trash2 size={18} />
        </button>
      </div>
    </td>
  </motion.tr>
);

const LeadTable = ({ leads }) => {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#0a0a0b]/50 border-b border-[#1c1c1f]">
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Prospect Details</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Interest</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Budget</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1f]">
            {leads.map((lead, index) => (
              <LeadRow key={lead.id} lead={lead} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
