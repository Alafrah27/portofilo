const StatCard = ({ title, value, icon, trend, badge }) => (
  <div className="admin-card p-5">
    <div className="mb-5 flex items-center justify-between">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#303035] bg-dark-700 text-gray-400">{icon}</span>
      {badge && <span className="text-[10px] text-primary-400">{badge}</span>}
    </div>
    <h2 className="text-[11px] text-gray-400">{title}</h2>
    <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
    <p className="mt-3 text-[10px] text-gray-500">{trend}</p>
  </div>
);
export default StatCard;
