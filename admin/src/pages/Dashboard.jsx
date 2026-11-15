import { Link } from 'react-router-dom';
import { CheckSquare, Briefcase, ListTodo, CircleCheck, ChartNoAxesCombined, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { useOverview } from '../dashboard/useOverview.js';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

export default function Dashboard() {
  const { data, loading, refreshing, error, refresh } = useOverview();
  const number = (value) => value === undefined ? '—' : value.toLocaleString();
  const unavailable = !data && !loading;
  const fallback = loading ? 'Loading totals…' : 'Unavailable';
  const stats = [
    { title: 'Case studies', value: number(data?.projects), icon: <Briefcase size={19} />,
      trend: data ? 'Saved projects in your portfolio' : fallback, badge: 'Projects' },
    { title: 'Open tasks', value: number(data?.tasks.open), icon: <ListTodo size={19} />,
      trend: data ? `${number(data.tasks.todo)} to do · ${number(data.tasks.inProgress)} in progress` : fallback, badge: 'To finish' },
    { title: 'Completed tasks', value: number(data?.tasks.completed), icon: <CircleCheck size={19} />,
      trend: data ? `${number(data.tasks.total)} tasks in total` : fallback, badge: 'Completed' },
    { title: 'Task completion', value: data ? `${data.tasks.completionRate}%` : '—', icon: <ChartNoAxesCombined size={19} />,
      trend: data ? data.tasks.total ? 'Completed tasks / all tasks' : 'No tasks yet' : fallback, badge: 'Progress' },
  ];

  return <div className="animate-in space-y-8 pb-4">
    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div>
        <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Your studio at a glance</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Studio <span className="gradient-text">overview.</span></h1>
        <p className="mt-3 max-w-xl text-[13px] leading-6 text-gray-400">Your saved projects, task progress, and latest workspace updates.</p>
      </div>
      <Link to="/projects?new=1" className="btn-primary self-start"><Plus size={17} />New project</Link>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242427] pb-3">
      <div className="flex items-center gap-2 text-xs text-gray-300"><span className="h-1 w-1 rounded-full bg-primary-500" />Workspace totals</div>
      <div className="flex items-center gap-3">
        <span role="status" className="text-[10px] text-gray-500">
          {loading ? 'Loading overview…' : refreshing ? 'Refreshing…' : data ? <>
            {error ? 'Last successful update ' : 'Updated '}<time dateTime={data.asOf}>{new Date(data.asOf).toLocaleTimeString()}</time>
          </> : 'Overview unavailable'}
        </span>
        <button type="button" onClick={refresh} disabled={loading || refreshing} className="btn-secondary !px-3 !py-2 text-xs">
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />Refresh
        </button>
      </div>
    </div>
    {error && <div role="alert" className="rounded-lg border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-300">
      <p>{error}</p>
      {data && <p className="mt-1 text-xs">Showing the last successful update. Refresh to try again.</p>}
    </div>}
    <div aria-busy={loading || refreshing} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
    </div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <section className="admin-card min-w-0 xl:col-span-3">
        <div className="flex items-center justify-between gap-3 border-b border-[#242427] p-5 sm:p-6">
          <div><h2 className="text-sm font-medium text-white">Recent projects</h2><p className="mt-1.5 text-[11px] text-gray-500">Your most recently saved case studies.</p></div>
          <Link to="/projects" className="flex shrink-0 items-center gap-1 text-[11px] text-gray-400 hover:text-primary-400">View all <ArrowUpRight size={14} /></Link>
        </div>
        <div className="divide-y divide-[#242427]">
          {loading && <p role="status" className="p-6 text-xs text-gray-500">Loading projects…</p>}
          {unavailable && <p className="p-6 text-xs text-gray-500">Recent projects are unavailable.</p>}
          {data?.recentProjects.length === 0 && <p className="p-6 text-xs text-gray-500">No projects yet. Create your first case study.</p>}
          {data?.recentProjects.map((project) => (
            <Link key={project._id} to="/projects" className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-white/[.02] sm:gap-4 sm:px-6">
              {project.imageUrl ? <img src={project.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg border border-[#303035] object-cover" />
                : <Briefcase aria-hidden="true" className="h-11 w-11 shrink-0 rounded-lg border border-[#303035] p-3 text-gray-500" />}
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-gray-200 group-hover:text-primary-400">{project.title}</p><p className="mt-1.5 text-[10px] text-gray-500">{number(project.imageCount)} {project.imageCount === 1 ? 'image' : 'images'}</p></div>
              <time dateTime={project.updatedAt} className="hidden text-[10px] text-gray-500 sm:block">{new Date(project.updatedAt).toLocaleDateString()}</time>
              <ArrowUpRight size={15} className="ml-2 shrink-0 text-gray-600 group-hover:text-primary-400" />
            </Link>
          ))}
        </div>
      </section>
      <ActivityFeed activities={data?.activity} loading={loading} unavailable={unavailable} />
    </div>
    <section className="admin-card flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary-500/20 bg-primary-500/10 text-primary-400"><CheckSquare size={20} /></div><div><h2 className="text-sm font-medium text-white">Keep every project moving.</h2><p className="mt-2 text-xs leading-5 text-gray-500">Plan your next steps and track progress across your projects.</p></div></div>
      <Link to="/tasks" className="btn-secondary shrink-0 self-start sm:self-auto">Manage tasks <ArrowUpRight size={15} /></Link>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600"><span>Musdar.dev / Admin workspace</span><span>Refreshes every minute while this page is visible.</span></div>
  </div>;
}
