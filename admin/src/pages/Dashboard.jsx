import { Briefcase, CheckSquare, Users, Activity } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Projects', value: '12', icon: <Briefcase size={24} className="text-[#10b981]" />, trend: '+2 this month' },
    { title: 'Active Tasks', value: '34', icon: <CheckSquare size={24} className="text-[#06b6d4]" />, trend: '12 due soon' },
    { title: 'New Leads', value: '8', icon: <Users size={24} className="text-[#8b5cf6]" />, trend: '+3 this week' },
  ];

  const recentActivity = [
    { id: 1, action: 'Project "E-Commerce App" marked as Completed', time: '2 hours ago', type: 'project' },
    { id: 2, action: 'New lead received from Sarah Jenkins', time: '4 hours ago', type: 'lead' },
    { id: 3, action: 'Task "API Integration" moved to In Progress', time: '5 hours ago', type: 'task' },
    { id: 4, action: 'Client meeting scheduled for Project Alpha', time: '1 day ago', type: 'event' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="admin-card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1c1c1f] rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={20} className="text-[#10b981]" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#1c1c1f] last:border-0 last:pb-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#10b981]"></div>
              <div>
                <p className="text-sm text-gray-300">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
