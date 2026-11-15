import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../projects/projectClient.js';
import { Users, CheckSquare, Briefcase, TrendingUp, Zap, Rocket, Star, Globe, ArrowUpRight, Plus } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const stats = [
  { title: 'Active accounts', value: '2,481', icon: <Users size={19} />, trend: 'Momentum building', change: '+12.8%' },
  { title: 'Current projects', value: '148', icon: <Briefcase size={19} />, trend: 'On schedule', change: '+8.2%' },
  { title: 'Total revenue', value: '$85.2k', icon: <TrendingUp size={19} />, trend: 'Exceeding targets', change: '+18.6%' },
  { title: 'Studio growth', value: '32%', icon: <Zap size={19} />, trend: 'Steady expansion', change: '+4.1%' },
];
const activities = [
  { id: 1, icon: <Rocket size={17} />, action: 'Nexus is ready for review', detail: 'SaaS project deployed to staging.', time: '14 minutes ago' },
  { id: 2, icon: <Star size={17} />, action: 'Design system updated', detail: 'Sarah finalized version 2.4.', time: '2 hours ago' },
  { id: 3, icon: <Globe size={17} />, action: 'Infrastructure expanded', detail: 'EU-West region is now available.', time: '5 hours ago' },
];
const Dashboard = () => {
  const [projects, setProjects] = useState(null);
  const [projectError, setProjectError] = useState('');
  useEffect(() => {
    let active = true;
    projectsApi.list().then((data) => { if (active) setProjects(data); })
      .catch((error) => { if (active) setProjectError(error.message); });
    return () => { active = false; };
  }, []);
  return (
  <div className="animate-in space-y-8 pb-4">
    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div>
        <p className="eyebrow mb-3"><span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Your studio at a glance</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Studio <span className="gradient-text">overview.</span></h1>
        <p className="mt-3 max-w-xl text-[13px] leading-6 text-gray-400">Welcome back. Here’s what’s happening at Musdar today.</p>
      </div>
      <Link to="/projects?new=1" className="btn-primary self-start"><Plus size={17} />New project</Link>
    </div>
    <div className="flex items-center justify-between gap-3 border-b border-[#242427] pb-3">
      <div className="flex items-center gap-2 text-xs text-gray-300"><span className="h-1 w-1 rounded-full bg-primary-500" />Studio performance</div>
      <span className="rounded-md border border-[#303035] px-2.5 py-1.5 text-[10px] text-gray-500">Projects live · Other metrics demo</span>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => <StatCard key={stat.title} {...(stat.title === 'Current projects' ? { ...stat, value: projects?.length ?? '—', change: 'Live', trend: projectError ? 'Unavailable' : 'Saved case studies' } : stat)} />)}
    </div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <section className="admin-card min-w-0 xl:col-span-3">
        <div className="flex items-center justify-between gap-3 border-b border-[#242427] p-5 sm:p-6">
          <div><h2 className="text-sm font-medium text-white">Recent projects</h2><p className="mt-1.5 text-[11px] text-gray-500">A little progress, every day.</p></div>
          <Link to="/projects" className="flex shrink-0 items-center gap-1 text-[11px] text-gray-400 hover:text-primary-400">View all <ArrowUpRight size={14} /></Link>
        </div>
        <div className="divide-y divide-[#242427]">
          {projectError && <p role="alert" className="p-6 text-xs text-red-300">{projectError} <Link to="/projects" className="underline">Open projects to retry</Link></p>}
          {!projects && !projectError && <p role="status" className="p-6 text-xs text-gray-500">Loading projects…</p>}
          {projects?.length === 0 && <p className="p-6 text-xs text-gray-500">No projects yet. Create your first case study.</p>}
          {projects?.slice(0, 3).map((project) => (
            <Link key={project._id} to="/projects" className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-white/[.02] sm:gap-4 sm:px-6">
              <img src={project.images[0]?.url} alt="" className="h-11 w-11 shrink-0 rounded-lg border border-[#303035] object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-gray-200 group-hover:text-primary-400">{project.title}</p><p className="mt-1.5 text-[10px] text-gray-500">{project.images.length} images</p></div>
              <time dateTime={project.updatedAt} className="hidden text-[10px] text-gray-500 sm:block">{new Date(project.updatedAt).toLocaleDateString()}</time>
              <ArrowUpRight size={15} className="ml-2 shrink-0 text-gray-600 group-hover:text-primary-400" />
            </Link>
          ))}
        </div>
      </section>
      <ActivityFeed activities={activities} />
    </div>
    <section className="admin-card flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary-500/20 bg-primary-500/10 text-primary-400"><CheckSquare size={20} /></div><div><h2 className="text-sm font-medium text-white">Keep every project moving.</h2><p className="mt-2 text-xs leading-5 text-gray-500">Plan your next steps and track progress across your projects.</p></div></div>
      <Link to="/tasks" className="btn-secondary shrink-0 self-start sm:self-auto">Manage tasks <ArrowUpRight size={15} /></Link>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600"><span>Musdar.dev / Admin workspace</span><span>Built for what’s next.</span></div>
  </div>
  );
};
export default Dashboard;
