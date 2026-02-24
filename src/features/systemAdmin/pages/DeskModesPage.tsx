import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetResourcesByType,
  useChangeDeskMode,
} from "../../../hooks/admin/ResourceApi";
import {
  Monitor,
  Loader2,
  Search,
  Building2,
  Layers,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Badge ──────────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: "ASSIGNED" | "HOT_DESK" }) {
  const isAssigned = mode === "ASSIGNED";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500,
      background: isAssigned ? "rgba(99,102,241,0.1)" : "rgba(34,197,94,0.1)", 
      color: isAssigned ? "#818cf8" : "#4ade80", 
      border: `1px solid ${isAssigned ? "rgba(99,102,241,0.2)" : "rgba(34,197,94,0.2)"}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isAssigned ? "#818cf8" : "#4ade80", flexShrink: 0 }} />
      {mode?.replace("_", " ") || "UNKNOWN"}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DeskModesPage() {
  const { data: desks, isLoading } = useGetResourcesByType("DESK");
  const changeModeMutation = useChangeDeskMode();
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDesks = desks?.filter((d: any) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.resourceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.building?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModeToggle = (deskId: number, currentMode: "ASSIGNED" | "HOT_DESK") => {
    const newMode = currentMode === "ASSIGNED" ? "HOT_DESK" : "ASSIGNED";
    
    changeModeMutation.mutate({ deskId, newMode }, {
      onSuccess: () => {
        toast.success(`Desk mode updated to ${newMode.replace("_", " ")}`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update desk mode");
      }
    });
  };

  return (
    <DashboardLayout title="Desk Mode Management">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ 
          background: "rgba(99,102,241,0.05)", 
          border: "1px solid rgba(99,102,241,0.1)", 
          borderRadius: 12, 
          padding: "16px 20px",
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}>
          <HelpCircle size={20} style={{ color: "#818cf8", marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 4px" }}>About Desk Modes</h4>
            <p style={{ fontSize: "0.8125rem", color: "#a1a1aa", lineHeight: 1.5 }}>
              <strong style={{ color: "#818cf8" }}>ASSIGNED:</strong> Fixed desks managed by Department Admins for permanent seating. Not bookable by users.<br />
              <strong style={{ color: "#4ade80" }}>HOT DESK:</strong> Flexible desks bookable by any employee through the dashboard.
            </p>
          </div>
        </div>

        <div style={{ position: "relative", maxWidth: 400 }}>
          <input 
            placeholder="Search desks by number or building..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: "100%", 
              background: "rgba(39,39,42,0.8)", 
              border: "1px solid #3f3f46", 
              borderRadius: 10, 
              padding: "10px 14px 10px 38px", 
              color: "#f4f4f5", 
              fontSize: "0.875rem",
              outline: "none"
            }} 
          />
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
        </div>

        <div style={{ background: "#121216", border: "1px solid #1e1e24", borderRadius: 16, overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: 60, textAlign: "center" }}><Loader2 style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} /></div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1e24", color: "#52525b", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px" }}>Desk</th>
                    <th style={{ padding: "12px 20px" }}>Location</th>
                    <th style={{ padding: "12px 20px" }}>Current Mode</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesks?.map((d: any) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #1e1e24", color: "#f4f4f5", fontSize: "0.875rem" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}><Monitor size={14} /></div>
                          <span style={{ fontWeight: 500 }}>{d.resourceNumber} {d.name && `(${d.name})`}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "0.75rem", color: "#71717a" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building2 size={10} /> {d.building?.name}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Layers size={10} /> Floor {d.floor?.floorNumber}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <ModeBadge mode={d.deskMode} />
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <button 
                          onClick={() => handleModeToggle(d.id, d.deskMode)}
                          disabled={changeModeMutation.isPending}
                          style={{
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            color: "#818cf8",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            cursor: changeModeMutation.isPending ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            opacity: changeModeMutation.isPending ? 0.5 : 1
                          }}
                        >
                          {changeModeMutation.isPending ? "Updating..." : `Switch to ${d.deskMode === "ASSIGNED" ? "Hot Desk" : "Assigned"}`}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
