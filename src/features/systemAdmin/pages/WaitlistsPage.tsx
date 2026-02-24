import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetAllWaitlistEntries,
} from "../../../hooks/admin/WaitlistApi";
import {
  Clock,
  Loader2,
  Search,
  User,
  Box,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";

// ─── Custom Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isOffered = status === "OFFERED";
  const isAccepted = status === "ACCEPTED";
  
  let bg = "rgba(255,255,255,0.05)";
  let text = "#a1a1aa";
  let border = "rgba(255,255,255,0.1)";

  if (isOffered) {
    bg = "rgba(234,179,8,0.1)";
    text = "#facc15";
    border = "rgba(234,179,8,0.2)";
  } else if (isAccepted) {
    bg = "rgba(34,197,94,0.1)";
    text = "#4ade80";
    border = "rgba(34,197,94,0.2)";
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500,
      background: bg, color: text, border: `1px solid ${border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: text, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WaitlistsPage() {
  const { data: entries, isLoading } = useGetAllWaitlistEntries();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries?.filter((e: any) =>
    e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.resourceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString([], { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <DashboardLayout title="System Waitlists">
      <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", maxWidth: 400, flex: 1 }}>
            <input 
              placeholder="Search by user or resource..." 
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
          
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ 
              background: "rgba(39,39,42,0.6)", 
              border: "1px solid #3f3f46", 
              color: "#a1a1aa", 
              padding: "8px 16px", 
              borderRadius: 10, 
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div style={{ background: "#121216", border: "1px solid #1e1e24", borderRadius: 16, overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: 60, textAlign: "center" }}><Loader2 style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} /></div>
          ) : filteredEntries?.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#52525b" }}>No active waitlist entries.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1e24", color: "#52525b", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px" }}>Joined At</th>
                    <th style={{ padding: "12px 20px" }}>User</th>
                    <th style={{ padding: "12px 20px" }}>Resource</th>
                    <th style={{ padding: "12px 20px" }}>Requested Slot</th>
                    <th style={{ padding: "12px 20px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries?.map((e: any) => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #1e1e24", color: "#f4f4f5", fontSize: "0.875rem" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#71717a" }}>
                          <Clock size={14} />
                          <span>{formatDateTime(e.createdAtUtc)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}><User size={14} /></div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 500 }}>{e.user?.firstName} {e.user?.lastName}</span>
                            <span style={{ fontSize: "0.75rem", color: "#52525b" }}>{e.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Box size={14} style={{ color: "#71717a" }} />
                          <span>{e.resource?.resourceNumber} ({e.resource?.name})</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.75rem", color: "#71717a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={12} />
                            <span>{formatDateTime(e.startUtc)}</span>
                            <ArrowRight size={12} />
                            <span>{formatDateTime(e.endUtc)}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <StatusBadge status={e.offer ? e.offer.status : "WAITING"} />
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
