const ActivityFeed = ({ activities }) => (
  <section className="admin-card xl:col-span-2">
    <div className="flex items-center justify-between border-b border-[#242427] p-5 sm:p-6">
      <div><h2 className="text-sm font-medium text-white">Activity</h2><p className="mt-1.5 text-[11px] text-gray-500">The latest from your workspace.</p></div>
      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
    </div>
    <div className="space-y-6 p-5 sm:p-6">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative flex items-start gap-3">
          {index !== activities.length - 1 && <div className="absolute bottom-[-25px] left-[17px] top-10 w-px bg-[#242427]" />}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#303035] bg-dark-700 text-gray-400">{activity.icon}</div>
          <div className="pt-0.5"><p className="text-xs text-gray-200">{activity.action}</p><p className="mt-1.5 text-[10px] leading-5 text-gray-500">{activity.detail}</p><p className="mt-1 text-[10px] text-gray-600">{activity.time}</p></div>
        </div>
      ))}
    </div>
  </section>
);
export default ActivityFeed;
