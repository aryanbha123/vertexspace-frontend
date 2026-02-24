import { NavLink, useLocation } from "react-router-dom";
// import { useAppStore } from "@/lib/store";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Clock,
  Monitor,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/resources", icon: Building2, label: "Resources" },
  { to: "/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/best-slots", icon: Clock, label: "Best Slots" },
  { to: "/desk-admin", icon: Monitor, label: "Desk Admin" },
];

export default function Sidebar() {
  //   const { currentUser, logout } = useAppStore();
  const currentUser = {
    name:"Aryan bhandari"
  };
  const logout = () => {};
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
          V
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-accent-foreground tracking-tight">
            VertexSpace
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        {currentUser && !collapsed && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                {/* {currentUser.role.replace("_", " ")} */}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors text-xs"
          >
            {collapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center px-2 py-2 rounded-md text-sidebar-muted hover:text-destructive hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
