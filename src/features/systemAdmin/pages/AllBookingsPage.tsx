import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetAllBookings,
  useCancelBooking,
} from "../../../hooks/admin/BookingApi";
import {
  Calendar,
  Clock,
  User,
  Box,
  Trash2,
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Badge ──────────────────────────────────────────────────────────────
function BookingStatusBadge({ status }: { status: string }) {
  const isConfirmed = status === "CONFIRMED";
  const isCancelled = status === "CANCELLED";
  
  let bg = "rgba(255,255,255,0.05)";
  let text = "#a1a1aa";
  let border = "rgba(255,255,255,0.1)";
  let Icon = AlertCircle;

  if (isConfirmed) {
    bg = "rgba(34,197,94,0.1)";
    text = "#4ade80";
    border = "rgba(34,197,94,0.2)";
    Icon = CheckCircle2;
  } else if (isCancelled) {
    bg = "rgba(239,68,68,0.1)";
    text = "#f87171";
    border = "rgba(239,68,68,0.2)";
    Icon = XCircle;
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500,
      background: bg, color: text, border: `1px solid ${border}`,
    }}>
      <Icon size={12} />
      {status}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AllBookingsPage() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const cancelMutation = useCancelBooking();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredBookings = bookings?.filter((b: any) => {
    const matchesSearch = 
      b.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.resource?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.resource?.resourceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCancel = (id: number) => {
    toast.promise(
      new Promise((resolve, reject) => {
        cancelMutation.mutate(id, {
          onSuccess: resolve,
          onError: reject
        });
      }),
      {
        loading: 'Cancelling booking...',
        success: 'Booking cancelled successfully',
        error: (err) => err?.response?.data?.message || 'Failed to cancel booking',
      }
    );
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString([], { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <DashboardLayout title="Global Bookings">
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
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ 
                background: "rgba(39,39,42,0.6)", 
                border: "1px solid #3f3f46", 
                color: "#a1a1aa", 
                padding: "8px 12px", 
                borderRadius: 10, 
                fontSize: "0.875rem",
                outline: "none"
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={{ background: "#121216", border: "1px solid #1e1e24", borderRadius: 16, overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: 60, textAlign: "center" }}><Loader2 style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} /></div>
          ) : filteredBookings?.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#52525b" }}>No bookings found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1e24", color: "#52525b", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px" }}>User</th>
                    <th style={{ padding: "12px 20px" }}>Resource</th>
                    <th style={{ padding: "12px 20px" }}>Schedule</th>
                    <th style={{ padding: "12px 20px" }}>Status</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings?.map((b: any) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #1e1e24", color: "#f4f4f5", fontSize: "0.875rem" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}><User size={14} /></div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 500 }}>{b.user?.firstName} {b.user?.lastName}</span>
                            <span style={{ fontSize: "0.75rem", color: "#52525b" }}>{b.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Box size={14} style={{ color: "#71717a" }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>{b.resource?.resourceNumber} ({b.resource?.name})</span>
                            <span style={{ fontSize: "0.72rem", color: "#52525b" }}>{b.resource?.resourceType}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.75rem", color: "#71717a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={12} />
                            <span>{formatDateTime(b.startUtc)} - {formatDateTime(b.endUtc)}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        {b.status === "CONFIRMED" && (
                          <button 
                            onClick={() => handleCancel(b.id)}
                            style={{ 
                              background: "none", 
                              border: "none", 
                              color: "#f87171", 
                              cursor: "pointer",
                              padding: 4,
                              borderRadius: 6,
                              transition: "background 0.2s"
                            }}
                            title="Cancel Booking"
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
