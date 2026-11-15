import { Briefcase, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusLabels = { todo: 'To do', 'in-progress': 'In progress', done: 'Completed' };

const ActivityFeed = ({ activities = [], loading, unavailable }) => (
  <section className="admin-card min-w-0 xl:col-span-2">
    <div className="border-b border-[#242427] p-5 sm:p-6">
      <h2 className="text-sm font-medium text-white">Recent updates</h2>
      <p className="mt-1.5 text-[11px] text-gray-500">Latest saved changes to projects and tasks.</p>
    </div>
    <div className="space-y-6 p-5 sm:p-6">
      {loading ? <p role="status" className="text-xs text-gray-500">Loading recent updates…</p>
        : unavailable ? <p className="text-xs text-gray-500">Recent updates are unavailable.</p>
        : activities.length === 0 ? <p className="text-xs text-gray-500">No updates yet. Create a project or task to get started.</p>
        : activities.map((activity, index) => (
          <Link key={activity.id} to={activity.kind === 'project' ? '/projects' : '/tasks'} className="group relative flex items-start gap-3">
            {index !== activities.length - 1 && <div aria-hidden="true" className="absolute bottom-[-25px] left-[17px] top-10 w-px bg-[#242427]" />}
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#303035] bg-dark-700 text-gray-400">
              {activity.kind === 'project' ? <Briefcase size={17} /> : <CheckSquare size={17} />}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="truncate text-xs text-gray-200 group-hover:text-primary-400">{activity.title}</p>
              <p className="mt-1.5 text-[10px] leading-5 text-gray-500">
                {activity.kind === 'project' ? 'Project' : 'Task'} {activity.operation}
                {activity.kind === 'task' && ` · ${statusLabels[activity.status]}`}
              </p>
              <time dateTime={activity.at} className="mt-1 block text-[10px] text-gray-600">{new Date(activity.at).toLocaleString()}</time>
            </div>
          </Link>
        ))}
    </div>
  </section>
);
export default ActivityFeed;
