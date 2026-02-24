import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-white">System Reports</h3>
        <p className="text-zinc-400">Generate utilization, occupancy, and attendance reports.</p>
      </div>
    </DashboardLayout>
  );
}
