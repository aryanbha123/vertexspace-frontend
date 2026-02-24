import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetAllBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from "../../../hooks/admin/BuildingApi";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Loader2,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Button ─────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "ghost" | "outline" | "danger";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "icon";
  loading?: boolean;
}

function Button({ variant = "primary", size = "md", loading, children, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, border: "none", cursor: props.disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderRadius: 10,
    transition: "background 0.15s, transform 0.1s, box-shadow 0.15s, color 0.15s, border-color 0.15s",
    opacity: props.disabled ? 0.55 : 1,
    whiteSpace: "nowrap",
    ...style,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "0.8125rem" },
    md: { padding: "9px 16px", fontSize: "0.875rem" },
    icon: { padding: 8, width: 34, height: 34, borderRadius: 9 },
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "#fff", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" },
    ghost: { background: "transparent", color: "#a1a1aa", border: "1px solid transparent" },
    outline: { background: "rgba(39,39,42,0.6)", color: "#a1a1aa", border: "1px solid #3f3f46" },
    danger: { background: "transparent", color: "#a1a1aa", border: "1px solid transparent" },
  };

  return (
    <button
      {...props}
      style={{ ...base, ...sizeStyles[size], ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (props.disabled) return;
        const el = e.currentTarget;
        if (variant === "primary") { el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"; }
        if (variant === "ghost") { el.style.background = "rgba(255,255,255,0.06)"; el.style.color = "#f4f4f5"; }
        if (variant === "outline") { el.style.borderColor = "#52525b"; el.style.color = "#f4f4f5"; }
        if (variant === "danger") { el.style.background = "rgba(239,68,68,0.1)"; el.style.color = "#f87171"; }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (props.disabled) return;
        const el = e.currentTarget;
        if (variant === "primary") { el.style.transform = ""; el.style.boxShadow = "0 2px 8px rgba(99,102,241,0.3)"; }
        if (variant === "ghost") { el.style.background = "transparent"; el.style.color = "#a1a1aa"; }
        if (variant === "outline") { el.style.borderColor = "#3f3f46"; el.style.color = "#a1a1aa"; }
        if (variant === "danger") { el.style.background = "transparent"; el.style.color = "#a1a1aa"; }
        props.onMouseLeave?.(e);
      }}
    >
      {loading && <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} />}
      {children}
    </button>
  );
}

// ─── Custom Input ──────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Input({ icon, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#52525b", pointerEvents: "none", display: "flex" }}>
          {icon}
        </span>
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%",
          background: "rgba(39,39,42,0.8)",
          border: `1px solid ${focused ? "#6366f1" : "#3f3f46"}`,
          borderRadius: 10,
          padding: icon ? "10px 14px 10px 38px" : "10px 14px",
          color: "#f4f4f5",
          fontSize: "0.875rem",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
          ...style,
        }}
      />
    </div>
  );
}

// ─── Custom Label ──────────────────────────────────────────────────────────────
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} style={{ fontSize: "0.75rem", fontWeight: 500, color: "#a1a1aa", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {children}
    </label>
  );
}

// ─── Custom Badge ──────────────────────────────────────────────────────────────
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500,
      background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
      {children}
    </span>
  );
}

// ─── Custom Dialog ─────────────────────────────────────────────────────────────
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "overlayIn 0.2s ease both",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 440,
          background: "linear-gradient(160deg, rgba(24,24,27,0.98) 0%, rgba(18,18,22,0.99) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: 18,
          padding: "28px 28px 24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
          animation: "dialogIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
          position: "relative",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20, paddingRight: 28 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#f4f4f5", margin: 0, lineHeight: 1.3 }}>{title}</h2>
          {description && <p style={{ fontSize: "0.8125rem", color: "#71717a", marginTop: 5 }}>{description}</p>}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f4f4f5"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#71717a"; }}
        >
          <X size={14} />
        </button>

        {children}
      </div>
    </div>
  );
}

// ─── Confirm Dialog ─────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  buildingName?: string;
}

function ConfirmDialog({ open, onClose, onConfirm, loading, buildingName }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 110,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "overlayIn 0.2s ease both",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 360,
          background: "linear-gradient(160deg, rgba(24,24,27,0.99) 0%, rgba(18,18,22,1) 100%)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 18, padding: "28px 24px 24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "dialogIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
          fontFamily: "'DM Sans', sans-serif", textAlign: "center",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: "50%", margin: "0 auto 16px",
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AlertTriangle size={22} style={{ color: "#f87171" }} />
        </div>
        <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 8px" }}>Delete building?</h3>
        <p style={{ fontSize: "0.8125rem", color: "#71717a", margin: "0 0 24px", lineHeight: 1.5 }}>
          <strong style={{ color: "#a1a1aa" }}>{buildingName}</strong> will be permanently removed. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 16px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg,#dc2626,#ef4444)",
              color: "#fff", fontSize: "0.875rem", fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading && <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BuildingsPage() {
  const { data: buildings, isLoading } = useGetAllBuildings();
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", address: "", description: "" });

  const handleOpenDialog = (building: any = null) => {
    if (building) {
      setEditingBuilding(building);
      setFormData({ name: building.name, address: building.address, description: building.description || "" });
    } else {
      setEditingBuilding(null);
      setFormData({ name: "", address: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = editingBuilding ? updateMutation.mutate : createMutation.mutate;
    mutation({ data: formData, id: editingBuilding?.id }, {
      onSuccess: () => {
        toast.success(`Building ${editingBuilding ? "updated" : "created"} successfully`);
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Operation failed");
      },
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success("Building deleted successfully"); setDeleteTarget(null); },
      onError: () => { toast.error("Delete failed"); },
    });
  };

  const filteredBuildings = buildings?.filter((b: any) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dialogIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: rgba(99,102,241,0.04) !important; }
        .table-row:hover .row-actions { opacity: 1; }
        .row-actions { opacity: 0; transition: opacity 0.15s; }
      `}</style>

      <DashboardLayout title="Buildings">
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>

          {/* ── Toolbar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 380 }}>
              <Input
                icon={<Search size={15} />}
                placeholder="Search buildings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button variant="primary" onClick={() => handleOpenDialog()}>
              <Plus size={15} />
              Add Building
            </Button>
          </div>

          {/* ── Table card ── */}
          <div style={{
            background: "linear-gradient(160deg, rgba(18,18,22,0.95) 0%, rgba(14,14,18,0.98) 100%)",
            border: "1px solid rgba(99,102,241,0.1)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {/* Table header */}
            {!isLoading && filteredBuildings?.length > 0 && (
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 2.5fr 1fr 100px",
                padding: "12px 20px",
                background: "rgba(0,0,0,0.25)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                {["Building Name", "Address", "Status", ""].map((h) => (
                  <span key={h} style={{ fontSize: "0.68rem", fontWeight: 600, color: "#52525b", letterSpacing: "0.09em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
            )}

            {/* States */}
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 14 }}>
                <Loader2 size={36} style={{ color: "#6366f1", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "0.875rem", color: "#52525b" }}>Loading buildings...</p>
              </div>
            ) : filteredBuildings?.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={26} style={{ color: "#52525b" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 4px" }}>No buildings found</p>
                  <p style={{ fontSize: "0.8125rem", color: "#71717a", margin: 0 }}>
                    {searchTerm ? "Try a different search term." : "Get started by adding your first building."}
                  </p>
                </div>
                {!searchTerm && (
                  <Button variant="primary" onClick={() => handleOpenDialog()}>
                    <Plus size={14} />
                    Add Building
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {filteredBuildings.map((building: any, i: number) => (
                  <div
                    key={building.id}
                    className="table-row"
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 2.5fr 1fr 100px",
                      alignItems: "center",
                      padding: "14px 20px",
                      borderBottom: i < filteredBuildings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      animation: `rowIn 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
                    }}
                  >
                    {/* Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Building2 size={16} style={{ color: "#818cf8" }} />
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f4f4f5" }}>{building.name}</span>
                    </div>

                    {/* Address */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <MapPin size={13} style={{ color: "#52525b", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.8125rem", color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {building.address}
                      </span>
                    </div>

                    {/* Badge */}
                    <Badge>Active</Badge>

                    {/* Actions */}
                    <div className="row-actions" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(building)} title="Edit">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="danger" size="icon" onClick={() => setDeleteTarget(building)} title="Delete">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer row count */}
            {!isLoading && filteredBuildings?.length > 0 && (
              <div style={{
                padding: "10px 20px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "0.75rem", color: "#52525b" }}>
                  {filteredBuildings.length} building{filteredBuildings.length !== 1 ? "s" : ""}
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Create / Edit Dialog ── */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title={editingBuilding ? "Edit Building" : "Add Building"}
          description="Fill in the details below. Click save when you're done."
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label htmlFor="name">Building Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="HQ — Silicon Valley" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Innovation Way" required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label htmlFor="description">Description <span style={{ color: "#52525b", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span></Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Main headquarters building" />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={isPending} disabled={isPending}>
                {editingBuilding ? "Update Building" : "Create Building"}
              </Button>
            </div>
          </form>
        </Dialog>

        {/* ── Delete Confirm ── */}
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteMutation.isPending}
          buildingName={deleteTarget?.name}
        />
      </DashboardLayout>
    </>
  );
}