import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import LeadTable from '../components/leads/LeadTable';

const Leads = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', type: 'SaaS Development', budget: '$50k - $100k', status: 'new', time: '2 hours ago' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@startup.io', type: 'Mobile App', budget: '$20k - $50k', status: 'contacted', time: '5 hours ago' },
    { id: 3, name: 'Ahmed Al-Farsi', email: 'ahmed@enterprise.sa', type: 'Web Platform', budget: '$100k+', status: 'closed', time: '1 day ago' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#06b6d4]"></span>
            <span className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-[0.3em]">Client Pipeline</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Leads & Inquiries</h2>
          <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">
            Manage your sales funnel and incoming project requests. Convert conversations into successful partnerships.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-[#121214] border border-[#1c1c1f] rounded-2xl px-4 py-3.5 text-gray-500 focus-within:border-[#06b6d4]/50 transition-all w-full sm:w-64">
            <Search size={18} />
            <input type="text" placeholder="Search leads..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-white placeholder-gray-600 w-full" />
          </div>
          <button className="btn-primary w-full xs:w-auto gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold flex justify-center items-center">
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      <LeadTable leads={leads} />
    </div>
  );
};

export default Leads;
