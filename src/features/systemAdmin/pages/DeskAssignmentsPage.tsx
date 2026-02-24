import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetAllDeskAssignments,
  useCreateDeskAssignment,
  useDeleteDeskAssignment,
  useGetDeskAssignmentsByDepartment,
} from "../../../hooks/admin/DeskAssignmentApi";
import { useGetAssignableDesks, useGetAssignableDesksByDepartment } from "../../../hooks/admin/ResourceApi";
import { useGetAllUsers } from "../../../hooks/user/UserApi";
import { useAuth } from "../../../hooks/useAuth";
import {
  Plus,
  Trash2,
  CalendarCheck,
  User,
  Monitor,
  Loader2,
  Search,
  X,
  AlertTriangle,
  Clock,
  Building2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Components (Reused from other pages for consistency) ──────────────

function Button({ variant = "primary", size = "md", loading, children, style, ...props }: any) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, border: "none", cursor: props.disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderRadius: 10,
    transition: "background 0.15s, transform 0.1s, box-shadow 0.15s, color 0.15s, border-color 0.15s",
    opacity: props.disabled ? 0.55 : 1,
    whiteSpace: "nowrap",
    ...style,
  };
  const sizeStyles: any = {
    sm: { padding: "6px 12px", fontSize: "0.8125rem" },
    md: { padding: "9px 16px", fontSize: "0.875rem" },
    icon: { padding: 8, width: 34, height: 34, borderRadius: 9 },
  };
  const variantStyles: any = {
    primary: { background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "#fff", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" },
    ghost: { background: "transparent", color: "#a1a1aa", border: "1px solid transparent" },
    outline: { background: "rgba(39,39,42,0.6)", color: "#a1a1aa", border: "1px solid #3f3f46" },
    danger: { background: "transparent", color: "#a1a1aa", border: "1px solid transparent" },
  };
  return (
    <button {...props} style={{ ...base, ...sizeStyles[size], ...variantStyles[variant] }}>
      {loading && <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} />}
      {children}
    </button>
  );
}

function Input({ icon, style, ...props }: any) {
  return (
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#52525b", display: "flex" }}>{icon}</span>}
      <input {...props} style={{ width: "100%", background: "rgba(39,39,42,0.8)", border: "1px solid #3f3f46", borderRadius: 10, padding: icon ? "10px 14px 10px 38px" : "10px 14px", color: "#f4f4f5", fontSize: "0.875rem", outline: "none", boxSizing: "border-box", ...style }} />
    </div>
  );
}

function Select({ children, ...props }: any) {
  return (
    <select {...props} style={{ width: "100%", background: "rgba(39,39,42,0.8)", border: "1px solid #3f3f46", borderRadius: 10, padding: "10px 14px", color: "#f4f4f5", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}>
      {children}
    </select>
  );
}

function Label({ children }: any) {
  return <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</label>;
}

function Dialog({ open, onClose, title, description, children }: any) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#18181b", border: "1px solid #27272a", borderRadius: 18, padding: 28, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><X size={18} /></button>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 8px" }}>{title}</h2>
        {description && <p style={{ fontSize: "0.875rem", color: "#71717a", marginBottom: 20 }}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DeskAssignmentsPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "SYSTEM_ADMIN";
  const isDeptAdmin = currentUser?.role === "DEPARTMENT_ADMIN";

  // Fetch data based on role
  const assignmentsQuery = isAdmin 
    ? useGetAllDeskAssignments() 
    : useGetDeskAssignmentsByDepartment(currentUser?.departmentId || 0);
  
  const desksQuery = isAdmin
    ? useGetAssignableDesks()
    : useGetAssignableDesksByDepartment(currentUser?.departmentId || 0);

  const usersQuery = useGetAllUsers();
  const createMutation = useCreateDeskAssignment();
  const deleteMutation = useDeleteDeskAssignment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    deskId: "",
    userId: "",
    startUtc: "",
    endUtc: "",
  });

  const handleOpenDialog = () => {
    setFormData({
      deskId: desksQuery.data?.[0]?.id?.toString() || "",
      userId: usersQuery.data?.[0]?.id?.toString() || "",
      startUtc: new Date().toISOString().slice(0, 16),
      endUtc: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      deskId: parseInt(formData.deskId),
      userId: parseInt(formData.userId),
      startUtc: new Date(formData.startUtc).toISOString(),
      endUtc: formData.endUtc ? new Date(formData.endUtc).toISOString() : null,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Desk assigned successfully");
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Operation failed");
      },
    });
  };

  const filteredAssignments = assignmentsQuery.data?.filter((a: any) =>
    a.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.deskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.resourceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "Indefinite";
    return new Date(isoString).toLocaleString();
  };

  return (
    <DashboardLayout title="Desk Assignments">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Input 
            icon={<Search size={15} />} 
            placeholder="Search assignments (User, Desk...)" 
            value={searchTerm} 
            onChange={(e: any) => setSearchTerm(e.target.value)} 
            style={{ width: 320 }} 
          />
          <Button onClick={handleOpenDialog}>
            <Plus size={16} /> Assign Desk
          </Button>
        </div>

        <div style={{ background: "#121216", border: "1px solid #1e1e24", borderRadius: 16, overflow: "hidden" }}>
          {assignmentsQuery.isLoading ? (
            <div style={{ padding: 60, textAlign: "center" }}><Loader2 style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} /></div>
          ) : filteredAssignments?.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "#52525b" }}>No assignments found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1e24", color: "#52525b", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", textAlign: "left" }}>
                    <th style={{ padding: "12px 20px" }}>User</th>
                    <th style={{ padding: "12px 20px" }}>Desk</th>
                    <th style={{ padding: "12px 20px" }}>Location</th>
                    <th style={{ padding: "12px 20px" }}>Period</th>
                    <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments?.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #1e1e24", color: "#f4f4f5", fontSize: "0.875rem" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}><User size={14} /></div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 500 }}>{a.user?.firstName} {a.user?.lastName}</span>
                            <span style={{ fontSize: "0.75rem", color: "#52525b" }}>{a.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Monitor size={14} style={{ color: "#71717a" }} />
                          <span>{a.resource?.resourceNumber} ({a.resource?.name})</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "0.75rem", color: "#71717a" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building2 size={10} /> {a.resource?.building?.name}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Layers size={10} /> Floor {a.resource?.floor?.floorNumber}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "0.75rem", color: "#71717a" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {formatDate(a.startUtc)}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {formatDate(a.endUtc)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <Button variant="danger" size="icon" onClick={() => setDeleteTarget(a)}><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        title="Assign Permanent Desk"
        description="Select a desk and a user to create a long-term assignment."
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>Select Desk (Assigned Mode Only)</Label>
            <Select 
              value={formData.deskId} 
              onChange={(e: any) => setFormData({ ...formData, deskId: e.target.value })} 
              required
            >
              <option value="">Select a desk</option>
              {desksQuery.data?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.resourceNumber} - {d.name} ({d.building?.name})
                </option>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>Select User</Label>
            <Select 
              value={formData.userId} 
              onChange={(e: any) => setFormData({ ...formData, userId: e.target.value })} 
              required
            >
              <option value="">Select a user</option>
              {usersQuery.data?.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </Select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>Start Date (UTC)</Label>
              <Input 
                type="datetime-local" 
                value={formData.startUtc} 
                onChange={(e: any) => setFormData({ ...formData, startUtc: e.target.value })} 
                required 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>End Date (Optional, UTC)</Label>
              <Input 
                type="datetime-local" 
                value={formData.endUtc} 
                onChange={(e: any) => setFormData({ ...formData, endUtc: e.target.value })} 
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Confirm Assignment</Button>
          </div>
        </form>
      </Dialog>

      {deleteTarget && (
        <Dialog 
          open={true} 
          onClose={() => setDeleteTarget(null)} 
          title="Remove Assignment?" 
          description={`Revoke desk assignment for ${deleteTarget.user?.firstName} ${deleteTarget.user?.lastName}?`}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button 
              variant="danger" 
              style={{ flex: 1, background: "#ef4444", color: "#fff" }} 
              onClick={() => deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { toast.success("Assignment removed"); setDeleteTarget(null); } })}
              loading={deleteMutation.isPending}
            >
              Remove
            </Button>
          </div>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
