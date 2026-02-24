import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  Users, 
  Settings, 
  Building2, 
  Layers, 
  Box, 
  CalendarCheck, 
  TrendingUp, 
  Activity,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// ─── Stat Card Component ───────────────────────────────────────────────────────
function StatCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(18,18,22,0.98) 100%)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 16,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ 
          padding: 10, 
          borderRadius: 12, 
          background: `${color}15`, 
          color: color,
          display: "flex"
        }}>
          <Icon size={20} />
        </div>
        {trend && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 4, 
            fontSize: "0.75rem", 
            fontWeight: 600,
            color: trend.positive ? "#4ade80" : "#f87171"
          }}>
            {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f4f4f5", marginTop: 4 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function SystemAdminDashboard() {
  const stats = [
    { label: "Total Bookings", value: "1,284", trend: { value: "12%", positive: true }, icon: CalendarCheck, color: "#6366f1" },
    { label: "Active Resources", value: "142", trend: { value: "4%", positive: true }, icon: Box, color: "#818cf8" },
    { label: "Total Users", value: "856", trend: { value: "2.5%", positive: true }, icon: Users, color: "#4f46e5" },
    { label: "Avg. Utilization", value: "68%", trend: { value: "5%", positive: false }, icon: TrendingUp, color: "#a855f7" },
  ];

  const recentActivity = [
    { id: 1, user: "John Doe", action: "booked Room 101", time: "2 mins ago", status: "confirmed", icon: CheckCircle2, iconColor: "#4ade80" },
    { id: 2, user: "Sarah Smith", action: "cancelled Desk A-12", time: "15 mins ago", status: "cancelled", icon: AlertCircle, iconColor: "#f87171" },
    { id: 3, user: "Mike Ross", action: "joined Waitlist: Parking P5", time: "1 hour ago", status: "pending", icon: Clock, iconColor: "#fbbf24" },
    { id: 4, user: "Admin", action: "created Floor 4 in HQ", time: "3 hours ago", status: "system", icon: CheckCircle2, iconColor: "#6366f1" },
  ];

  const quickActions = [
    { title: "Register User", desc: "Add new employees to the platform", icon: UserPlus, link: "/register", color: "#6366f1" },
    { title: "Add Building", desc: "Expand your office locations", icon: Building2, link: "/system-admin/buildings", color: "#818cf8" },
    { title: "Manage Floors", desc: "Configure floor layouts and maps", icon: Layers, link: "/system-admin/floors", color: "#4f46e5" },
    { title: "System Health", desc: "Monitor API and database status", icon: Activity, link: "#", color: "#a855f7" },
  ];

  return (
    <DashboardLayout title="System Overview">
      <div style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* ── Stats Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 24 }}>
          
          {/* ── Main Content Area ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Quick Actions */}
            <section>
              <h3 style={{ fontSize: "0.875rem", color: "#f4f4f5", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                Quick Actions
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {quickActions.map((action) => (
                  <a 
                    key={action.title}
                    href={action.link}
                    style={{
                      background: "rgba(39,39,42,0.4)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 16,
                      padding: "20px",
                      textDecoration: "none",
                      display: "flex",
                      gap: 16,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                      e.currentTarget.style.background = "rgba(39,39,42,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.background = "rgba(39,39,42,0.4)";
                    }}
                  >
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 12, 
                      background: `${action.color}15`, 
                      color: action.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <action.icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 4px" }}>{action.title}</h4>
                      <p style={{ fontSize: "0.8125rem", color: "#71717a", lineHeight: 1.4 }}>{action.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Hard-coded Performance Chart Placeholder */}
            <div style={{ 
              background: "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(18,18,22,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16,
              padding: "24px",
              minHeight: 240,
              display: "flex",
              flexDirection: "column",
              gap: 20
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5" }}>Booking Analytics</h3>
                <div style={{ fontSize: "0.75rem", color: "#71717a", display: "flex", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} /> Rooms</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7" }} /> Desks</span>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 10 }}>
                {/* Simulated Chart Bars */}
                {[45, 60, 35, 80, 55, 90, 70, 40, 65, 85, 50, 75].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <div style={{ width: "100%", height: `${h}%`, background: "linear-gradient(to top, #6366f1, #a855f7)", borderRadius: "4px 4px 0 0", opacity: 0.8 }} />
                    <span style={{ fontSize: "0.625rem", color: "#52525b" }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Recent Activity */}
            <div style={{ 
              background: "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(18,18,22,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 20
            }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5", display: "flex", alignItems: "center", gap: 8 }}>
                Recent Activity
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {recentActivity.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 12 }}>
                    <div style={{ color: item.iconColor, marginTop: 2 }}><item.icon size={16} /></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <p style={{ fontSize: "0.8125rem", color: "#f4f4f5", lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600 }}>{item.user}</span> {item.action}
                      </p>
                      <span style={{ fontSize: "0.75rem", color: "#52525b", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={10} /> {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ 
                background: "transparent", 
                border: "none", 
                color: "#6366f1", 
                fontSize: "0.8125rem", 
                fontWeight: 500, 
                padding: 0, 
                cursor: "pointer",
                textAlign: "left",
                marginTop: 4
              }}>
                View all activity
              </button>
            </div>

            {/* System Status Card */}
            <div style={{ 
              background: "rgba(39,39,42,0.2)",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "#a1a1aa" }}>API Server</span>
                <span style={{ fontSize: "0.75rem", color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "#a1a1aa" }}>Database</span>
                <span style={{ fontSize: "0.75rem", color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "#a1a1aa" }}>Last Backup</span>
                <span style={{ fontSize: "0.75rem", color: "#71717a" }}>45 mins ago</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
