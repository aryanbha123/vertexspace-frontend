
import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function JobHistoryPage() {
  return (
    <DashboardLayout title="Job History">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-white">Background Job History</h3>
        <p className="text-zinc-400">Review the status and logs of background system processes.</p>
      </div>
    </DashboardLayout>
  );
}
