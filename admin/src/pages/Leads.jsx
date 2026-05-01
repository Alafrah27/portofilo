import { useState } from 'react';
import { Mail, Plus } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', type: 'SaaS Development', budget: '$50k - $100k', status: 'new' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@startup.io', type: 'Mobile App', budget: '$20k - $50k', status: 'contacted' },
    { id: 3, 단name: 'Ahmed Al-Farsi', email: 'ahmed@enterprise.sa', type: 'Web Platform', budget: '$100k+', status: 'closed' },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new': return <span className="badge badge-purple">New</span>;
      case 'contacted': return <span className="badge badge-blue">Contacted</span>;
      case 'closed': return <span className="badge badge-green">Closed</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Manage incoming leads from Musdar.dev.</p>
        <button className="btn-primary gap-2">
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c1c1f] border-b border-[#2a2a2e]">
                <th className="p-4 text-sm font-medium text-gray-400">Lead Name</th>
                <th className="p-4 text-sm font-medium text-gray-400">Project Type</th>
                <th className="p-4 text-sm font-medium text-gray-400">Est. Budget</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#1c1c1f] hover:bg-[#121214] transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{lead.type}</td>
                  <td className="p-4 text-sm font-medium text-[#10b981]">{lead.budget}</td>
                  <td className="p-4">{getStatusBadge(lead.status)}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 bg-[#1c1c1f] text-gray-400 hover:text-white rounded-md border border-[#2a2a2e] transition-colors inline-flex">
                      <Mail size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
