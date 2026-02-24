import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function BatchJobsPage() {
  return (
    <DashboardLayout title="Run Batch Jobs">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-white">Manual Batch Operations</h3>
        <p className="text-zinc-400">Trigger manual system updates and data synchronization jobs.</p>
      </div>
    </DashboardLayout>
  );
}
