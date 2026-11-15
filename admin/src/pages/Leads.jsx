import { useState } from 'react';
import { Search } from 'lucide-react';
import LeadTable from '../components/leads/LeadTable';

const leads = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', type: 'SaaS Development', budget: '$50k - $100k', status: 'new', time: '2 hours ago' },
  { id: 2, name: 'Michael Chen', email: 'm.chen@startup.io', type: 'Mobile App', budget: '$20k - $50k', status: 'contacted', time: '5 hours ago' },
  { id: 3, name: 'Ahmed Al-Farsi', email: 'ahmed@enterprise.sa', type: 'Web Platform', budget: '$100k+', status: 'closed', time: '1 day ago' },
];
const Leads = () => {
  const [search, setSearch] = useState('');
  const filteredLeads = leads.filter((lead) => `${lead.name} ${lead.email} ${lead.type}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="animate-in space-y-8">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div><p className="eyebrow mb-3">The next opportunity</p><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Leads <span className="gradient-text">& inquiries.</span></h1><p className="mt-3 max-w-lg text-[13px] leading-6 text-gray-400">Turn new conversations into lasting partnerships.</p></div>
        <div className="flex w-full items-center gap-3 rounded-lg border border-[#303035] bg-dark-700 px-4 py-3 xl:w-64"><Search size={17} className="shrink-0 text-gray-500" /><input type="search" aria-label="Search leads" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads..." className="min-w-0 w-full bg-transparent text-xs text-white placeholder:text-gray-500" /></div>
      </div>
      <LeadTable leads={filteredLeads} />
      {filteredLeads.length === 0 && <p className="py-6 text-center text-sm text-gray-400">No inquiries match your search.</p>}
      <p className="text-xs text-gray-500">Showing {filteredLeads.length} of {leads.length} inquiries · Demo workspace</p>
    </div>
  );
};
export default Leads;
