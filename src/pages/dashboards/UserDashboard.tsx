import DashboardLayout from "../../components/layout/DashboardLayout";

export default function UserDashboard() {
  return (
    <DashboardLayout title="User Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-400">My Profile</h2>
          <p className="text-zinc-400">View and edit your profile information.</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-400">My Requests</h2>
          <p className="text-zinc-400">Track your current requests and their status.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
