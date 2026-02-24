import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bell,
  User as UserIcon,
  ShieldCheck,
  Building2,
  ChevronRight,
  Menu,
  X,
  Layers,
  Package,
  MousePointer2,
  CalendarCheck,
  ListOrdered,
  BarChart3,
  History,
  PlayCircle,
  Briefcase
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  url: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 68;

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout, isSystemAdmin, isDeptAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications] = useState(3);
  const [hovered, setHovered] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getAdminNavigation = (): NavSection[] => [
    {
      section: "Dashboard",
      items: [
        { title: "Overview", icon: LayoutDashboard, url: "/system-admin" },
      ]
    },
    {
      section: "Management",
      items: [
        { title: "Buildings", icon: Building2, url: "/system-admin/buildings" },
        { title: "Floors", icon: Layers, url: "/system-admin/floors" },
        { title: "Departments", icon: Briefcase, url: "/system-admin/departments" },
        { title: "Resources", icon: Package, url: "/system-admin/resources" },
      ]
    },
    {
      section: "Desk Administration",
      items: [
        { title: "Desk Modes", icon: MousePointer2, url: "/system-admin/desk-modes" },
        { title: "Desk Assignments", icon: CalendarCheck, url: "/system-admin/desk-assignments" },
      ]
    },
    {
      section: "Bookings",
      items: [
        { title: "All Bookings", icon: CalendarCheck, url: "/system-admin/bookings" },
        { title: "Waitlists", icon: ListOrdered, url: "/system-admin/waitlists" },
      ]
    },
    {
      section: "Insights",
      items: [
        { title: "Reports", icon: BarChart3, url: "/system-admin/reports" },
        { title: "Job History", icon: History, url: "/system-admin/job-history" },
        { title: "Run Batch Jobs", icon: PlayCircle, url: "/system-admin/batch-jobs" },
      ]
    },
    {
      section: "System",
      items: [
        { title: "Users", icon: Users, url: "/register" },
        { title: "Settings", icon: Settings, url: "/system-admin/settings" },
      ]
    }
  ];

  const getDeptNavigation = (): NavSection[] => [
    {
      section: "Dashboard",
      items: [
        { title: "Overview", icon: LayoutDashboard, url: "/dept-admin" },
      ]
    },
    {
      section: "Management",
      items: [
        { title: "Buildings", icon: Building2, url: "/system-admin/buildings" },
        { title: "Floors", icon: Layers, url: "/system-admin/floors" },
        { title: "Resources", icon: Package, url: "/system-admin/resources" },
      ]
    },
    {
      section: "Desk Administration",
      items: [
        { title: "Desk Assignments", icon: CalendarCheck, url: "/system-admin/desk-assignments" },
      ]
    },
    {
      section: "Bookings",
      items: [
        { title: "Department Bookings", icon: CalendarCheck, url: "/system-admin/bookings" },
        { title: "Waitlists", icon: ListOrdered, url: "/system-admin/waitlists" },
      ]
    }
  ];

  const getUserNavigation = (): NavSection[] => [
    {
      section: "Personal",
      items: [
        { title: "My Dashboard", icon: LayoutDashboard, url: "/dashboard" },
        { title: "My Bookings", icon: CalendarCheck, url: "/dashboard/bookings" },
        { title: "My Waitlist", icon: ListOrdered, url: "/dashboard/waitlist" },
      ]
    },
    {
      section: "Workspace",
      items: [
        { title: "Book a Space", icon: Package, url: "/dashboard/discover" },
        { title: "Find Best Slots", icon: Clock, url: "/dashboard/best-slots" },
      ]
    }
  ];

  const navigation = isSystemAdmin 
    ? getAdminNavigation() 
    : isDeptAdmin 
      ? getDeptNavigation() 
      : getUserNavigation();

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: collapsed && !mobile ? "20px 0" : "20px 20px", display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed && !mobile ? "center" : "flex-start", borderBottom: "1px solid rgba(99,102,241,0.12)", minHeight: 72 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4f46e5, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
          <ShieldCheck size={18} color="white" />
        </div>
        {(!collapsed || mobile) && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.05rem", color: "#f4f4f5", lineHeight: 1, whiteSpace: "nowrap" }}>VertexSpace</div>
            <div style={{ fontSize: "0.65rem", color: "#818cf8", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginTop: 4 }}>{user?.role?.replace("_", " ")}</div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: collapsed && !mobile ? "12px 0" : "12px 10px", overflowY: "auto" }}>
        {navigation.map((section) => (
          <div key={section.section} style={{ marginBottom: 16 }}>
            {(!collapsed || mobile) && (
              <div style={{ padding: "0 14px 8px", fontSize: "0.65rem", color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                {section.section}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.url;
              const isHov = hovered === item.title;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onMouseEnter={() => setHovered(item.title)}
                  onMouseLeave={() => setHovered(null)}
                  title={collapsed && !mobile ? item.title : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: collapsed && !mobile ? "13px 0" : "10px 14px",
                    justifyContent: collapsed && !mobile ? "center" : "flex-start",
                    borderRadius: 10,
                    marginBottom: 2,
                    textDecoration: "none",
                    position: "relative",
                    transition: "background 0.18s, transform 0.15s",
                    background: isActive
                      ? "linear-gradient(90deg, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 100%)"
                      : isHov
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                  }}
                >
                  {isActive && (
                    <div style={{ position: "absolute", left: collapsed && !mobile ? -2 : 0, top: "20%", bottom: "20%", width: 3, borderRadius: 3, background: "linear-gradient(180deg, #6366f1, #a5b4fc)" }} />
                  )}
                  <item.icon size={18} style={{ color: isActive ? "#818cf8" : isHov ? "#a1a1aa" : "#71717a", flexShrink: 0, transition: "color 0.15s" }} />
                  {(!collapsed || mobile) && (
                    <span style={{ fontSize: "0.875rem", fontWeight: isActive ? 500 : 400, color: isActive ? "#f4f4f5" : isHov ? "#d4d4d8" : "#a1a1aa", transition: "color 0.15s", flex: 1, whiteSpace: "nowrap" }}>
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {(!collapsed || mobile) && (
        <div style={{ margin: "0 10px 10px", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #3730a3, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#f4f4f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize: "0.7rem", color: "#71717a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
          </div>
        </div>
      )}

      <div style={{ padding: collapsed && !mobile ? "0 0 16px" : "0 10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
        <button onClick={() => logout()} onMouseEnter={() => setHovered("logout")} onMouseLeave={() => setHovered(null)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: collapsed && !mobile ? "12px 0" : "11px 14px", justifyContent: collapsed && !mobile ? "center" : "flex-start", borderRadius: 10, border: "none", cursor: "pointer", background: hovered === "logout" ? "rgba(239,68,68,0.1)" : "transparent", transition: "background 0.18s", fontFamily: "'DM Sans', sans-serif" }}>
          <LogOut size={18} style={{ color: hovered === "logout" ? "#f87171" : "#71717a", transition: "color 0.15s", flexShrink: 0 }} />
          {(!collapsed || mobile) && (
            <span style={{ fontSize: "0.875rem", color: hovered === "logout" ? "#f87171" : "#71717a", transition: "color 0.15s", fontWeight: 400 }}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#09090b", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
        <aside style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH, flexShrink: 0, background: "linear-gradient(180deg, rgba(18,18,22,0.98) 0%, rgba(14,14,18,0.99) 100%)", borderRight: "1px solid rgba(99,102,241,0.1)", display: "flex", flexDirection: "column", transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)", overflow: "hidden", position: "sticky", top: 0, height: "100vh", zIndex: 40 }}>
          <SidebarContent />
          <button onClick={() => setCollapsed(!collapsed)} style={{ position: "absolute", bottom: 80, right: collapsed ? "50%" : 12, transform: collapsed ? "translateX(50%)" : "none", width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1), background 0.15s", color: "#71717a" }}>
            <ChevronRight size={14} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", color: "#71717a" }} />
          </button>
        </aside>

        {mobileOpen && (
          <div ref={overlayRef} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, backdropFilter: "blur(4px)" }}>
            <div style={{ width: SIDEBAR_WIDTH, height: "100%", background: "linear-gradient(180deg, rgba(18,18,22,0.99) 0%, rgba(14,14,18,1) 100%)", borderRight: "1px solid rgba(99,102,241,0.1)" }}>
              <SidebarContent mobile />
            </div>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 20, left: SIDEBAR_WIDTH + 12, width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
              <X size={16} />
            </button>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(9,9,11,0.8)", borderBottom: "1px solid rgba(99,102,241,0.08)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => setMobileOpen(true)} style={{ display: "none", width: 36, height: 36, borderRadius: 9, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}><Menu size={16} /></button>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ fontSize: "1rem", fontWeight: 500, color: "#f4f4f5", letterSpacing: "-0.01em", lineHeight: 1 }}>{title}</h1>
                <span style={{ fontSize: "0.7rem", color: "#52525b", marginTop: 3 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>
                <Bell size={16} />
                {notifications > 0 && <span style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a5b4fc)", border: "2px solid #09090b", boxShadow: "0 0 6px rgba(99,102,241,0.6)" }} />}
              </button>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)", margin: "0 6px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px 5px 5px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #3730a3, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 600, color: "#fff", flexShrink: 0 }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#f4f4f5", lineHeight: 1 }}>{user?.firstName}</div>
                  <div style={{ fontSize: "0.68rem", color: "#71717a", marginTop: 2, lineHeight: 1 }}>{user?.role?.replace("_", " ")}</div>
                </div>
              </div>
            </div>
          </header>
          <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
