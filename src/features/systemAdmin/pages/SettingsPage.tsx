import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout title="System Settings">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 text-white">Global Configuration</h3>
        <p className="text-zinc-400">Manage system-wide settings, security policies, and integrations.</p>
      </div>
    </DashboardLayout>
  );
}
