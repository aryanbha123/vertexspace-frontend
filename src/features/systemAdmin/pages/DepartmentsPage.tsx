import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetActiveDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../../hooks/admin/DepartmentApi";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Components ─────────────────────────────────────────────────────────

function Button({ variant = "primary", size = "md", loading, children, style, ...props }: any) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, border: "none", cursor: props.disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderRadius: 10,
    transition: "background 0.15s, transform 0.1s, box-shadow 0.15s, color 0.15s",
    opacity: props.disabled ? 0.55 : 1,
    whiteSpace: "nowrap",
    ...style,
  };
  const sizeStyles: any = {
    sm: { padding: "6px 12px", fontSize: "0.8125rem" },
    md: { padding: "9px 16px", fontSize: "0.875rem" },
    icon: { padding: 8, width: 34, height: 34, borderRadius: 9 },
  };
  const variants: any = {
    primary: { background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "#fff" },
    ghost: { background: "transparent", color: "#a1a1aa" },
    outline: { background: "rgba(39,39,42,0.6)", color: "#a1a1aa", border: "1px solid #3f3f46" },
    danger: { background: "transparent", color: "#a1a1aa" },
  };
  return (
    <button {...props} style={{ ...base, ...sizeStyles[size], ...variants[variant] }}>
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

function Label({ children }: any) {
  return <label style={{ fontSize: "0.75rem", fontWeight: 500, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</label>;
}

function Dialog({ open, onClose, title, description, children }: any) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#18181b", border: "1px solid #27272a", borderRadius: 18, padding: 28, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><X size={18} /></button>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 8px" }}>{title}</h2>
        {description && <p style={{ fontSize: "0.875rem", color: "#71717a", marginBottom: 20 }}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useGetActiveDepartments();
  const createMutation = useCreateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ id: null, name: "", description: "" });

  const updateMutation = useUpdateDepartment(formData.id || 0);

  const handleOpenDialog = (dept: any = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ id: dept.id, name: dept.name, description: dept.description || "" });
    } else {
      setEditingDept(null);
      setFormData({ id: null, name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = editingDept ? updateMutation.mutate : createMutation.mutate;
    mutation(formData, {
      onSuccess: () => {
        toast.success(`Department ${editingDept ? "updated" : "created"}`);
        setIsDialogOpen(false);
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || "Error"),
    });
  };

  const filtered = departments?.filter((d: any) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout title="Departments">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <Input icon={<Search size={15} />} placeholder="Search departments..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} style={{ width: 320 }} />
          <Button onClick={() => handleOpenDialog()}><Plus size={16} /> Add Department</Button>
        </div>

        <div style={{ background: "#121216", border: "1px solid #1e1e24", borderRadius: 16, overflow: "hidden" }}>
          {isLoading ? (
             <div style={{ padding: 60, textAlign: "center" }}><Loader2 style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} /></div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px", padding: "12px 20px", borderBottom: "1px solid #1e1e24", color: "#52525b", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>
                <span>Name</span><span>Description</span><span></span>
              </div>
              {filtered?.map((d: any) => (
                <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px", padding: "16px 20px", alignItems: "center", borderBottom: "1px solid #1e1e24" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}><Users size={14} /></div>
                    <span style={{ color: "#f4f4f5", fontWeight: 500 }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#71717a", fontSize: "0.875rem" }}>{d.description || "—"}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(d)}><Pencil size={14} /></Button>
                    <Button variant="danger" size="icon" onClick={() => setDeleteTarget(d)}><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingDept ? "Edit Department" : "New Department"}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>Department Name</Label>
            <Input value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>Description</Label>
            <Input value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Dialog>

      {deleteTarget && (
        <Dialog open={true} onClose={() => setDeleteTarget(null)} title="Delete Department?" description={`Are you sure you want to delete ${deleteTarget.name}?`}>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" style={{ flex: 1, background: "#ef4444", color: "#fff" }} onClick={() => deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { toast.success("Deleted"); setDeleteTarget(null); } })}>Delete</Button>
          </div>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
