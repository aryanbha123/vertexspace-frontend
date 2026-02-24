import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DeptAdminDashboard() {
  return (
    <DashboardLayout title="Department Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-400">Department Overview</h2>
          <p className="text-zinc-400">Manage department-specific resources and users.</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-indigo-500/30 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-400">Reports</h2>
          <p className="text-zinc-400">View performance and activity reports for your department.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
