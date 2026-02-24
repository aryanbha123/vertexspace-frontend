import React, { useState, useRef, useEffect, useMemo } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  useGetAllResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from "../../../hooks/admin/ResourceApi";
import { useGetAllFloors } from "../../../hooks/admin/FloorApi";
import { useGetAllBuildings } from "../../../hooks/admin/BuildingApi";
import { useGetActiveDepartments } from "../../../hooks/admin/DepartmentApi";
import {
  Plus,
  Pencil,
  Trash2,
  Box,
  Building2,
  Layers,
  Users,
  Loader2,
  Search,
  X,
  AlertTriangle,
  ChevronDown,
  Monitor,
  Coffee,
  Car,
  Settings,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

// ─── Custom Components ─────────────────────────────────────────────────────────

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

function Input({ icon, style, ...props }: any) {
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

function Select({ style, children, ...props }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%",
          background: "rgba(39,39,42,0.8)",
          border: `1px solid ${focused ? "#6366f1" : "#3f3f46"}`,
          borderRadius: 10,
          padding: "10px 34px 10px 14px",
          color: "#f4f4f5",
          fontSize: "0.875rem",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          appearance: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          ...style,
        }}
      >
        {children}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#52525b", pointerEvents: "none" }} />
    </div>
  );
}

function Label({ children, htmlFor }: any) {
  return (
    <label htmlFor={htmlFor} style={{ fontSize: "0.75rem", fontWeight: 500, color: "#a1a1aa", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {children}
    </label>
  );
}

function Badge({ children, variant = "success" }: any) {
  const colors: any = {
    success: { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.2)" },
    warning: { bg: "rgba(234,179,8,0.1)", text: "#facc15", border: "rgba(234,179,8,0.2)" },
    info: { bg: "rgba(99,102,241,0.1)", text: "#818cf8", border: "rgba(99,102,241,0.2)" },
    danger: { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(239,68,68,0.2)" },
  };
  const c = colors[variant] || colors.success;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function Dialog({ open, onClose, title, description, children }: any) {
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
          width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto",
          background: "linear-gradient(160deg, rgba(24,24,27,0.98) 0%, rgba(18,18,22,0.99) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: 18, padding: "28px 28px 24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "dialogIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
          position: "relative", fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ marginBottom: 20, paddingRight: 28 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#f4f4f5", margin: 0, lineHeight: 1.3 }}>{title}</h2>
          {description && <p style={{ fontSize: "0.8125rem", color: "#71717a", marginTop: 5 }}>{description}</p>}
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}><X size={14} /></button>
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const { data: resources, isLoading } = useGetAllResources();
  const { data: floors } = useGetAllFloors();
  const { data: buildings } = useGetAllBuildings();
  const { data: departments } = useGetActiveDepartments();
  
  const createMutation = useCreateResource();
  const deleteMutation = useDeleteResource();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    resourceNumber: "",
    resourceType: "ROOM",
    floorId: "",
    departmentId: "",
    capacity: 1,
    description: "",
    deskMode: "HOT_DESK",
    bookingType: "EXCLUSIVE",
    active: true,
  });

  const updateMutation = useUpdateResource(formData.id || 0);

  const filteredFloors = useMemo(() => {
    if (!selectedBuildingId) return floors || [];
    return floors?.filter((f: any) => f.buildingId.toString() === selectedBuildingId) || [];
  }, [floors, selectedBuildingId]);

  const handleOpenDialog = (res: any = null) => {
    if (res) {
      setEditingResource(res);
      setFormData({
        id: res.id,
        name: res.name || "",
        resourceNumber: res.resourceNumber || "",
        resourceType: res.resourceType || res.type || "ROOM",
        floorId: res.floor?.id?.toString() || res.floorId?.toString() || "",
        departmentId: res.department?.id?.toString() || res.departmentId?.toString() || "",
        capacity: res.capacity || 1,
        description: res.description || "",
        deskMode: res.deskMode || "HOT_DESK",
        bookingType: res.bookingType || "EXCLUSIVE",
        active: res.active ?? true,
      });
      setSelectedBuildingId(res.building?.id?.toString() || res.buildingId?.toString() || "");
    } else {
      setEditingResource(null);
      setFormData({
        id: null,
        name: "",
        resourceNumber: "",
        resourceType: "ROOM",
        floorId: floors?.[0]?.id?.toString() || "",
        departmentId: departments?.[0]?.id?.toString() || "",
        capacity: 1,
        description: "",
        deskMode: "HOT_DESK",
        bookingType: "EXCLUSIVE",
        active: true,
      });
      setSelectedBuildingId(buildings?.[0]?.id?.toString() || "");
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean payload according to resource type
    const payload: any = {
      name: formData.name,
      resourceNumber: formData.resourceNumber,
      resourceType: formData.resourceType,
      buildingId: parseInt(selectedBuildingId),
      capacity: parseInt(formData.capacity.toString()),
      description: formData.description,
      active: formData.active,
    };

    // Department scope and Floor are NOT allowed for PARKING
    if (formData.resourceType !== "PARKING") {
      payload.departmentId = parseInt(formData.departmentId);
      payload.floorId = parseInt(formData.floorId);
      
      // Include floorNumber if available from the selected floor object
      const selectedFloor = floors?.find((f: any) => f.id.toString() === formData.floorId);
      if (selectedFloor) {
        payload.floorNumber = selectedFloor.floorNumber;
      }
    }

    if (formData.resourceType === "DESK") {
      payload.deskMode = formData.deskMode;
    } else if (formData.resourceType === "ROOM") {
      payload.bookingType = formData.bookingType;
    }
    
    const mutation = editingResource ? updateMutation.mutate : createMutation.mutate;
    mutation(payload, {
      onSuccess: () => {
        toast.success(`Resource ${editingResource ? "updated" : "created"} successfully`);
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Operation failed");
      },
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "ROOM": return <Coffee size={16} />;
      case "DESK": return <Monitor size={16} />;
      case "PARKING": return <Car size={16} />;
      default: return <Box size={16} />;
    }
  };

  const filteredResources = resources?.filter((r: any) =>
    (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.resourceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.resourceType || r.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dialogIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: rgba(99,102,241,0.04) !important; }
        .table-row:hover .row-actions { opacity: 1; }
        .row-actions { opacity: 0; transition: opacity 0.15s; }
      `}</style>

      <DashboardLayout title="Resources">
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "'DM Sans', sans-serif" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 380 }}>
              <Input icon={<Search size={15} />} placeholder="Search resources (Name, ID...)" value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="primary" onClick={() => handleOpenDialog()}>
              <Plus size={15} /> Add Resource
            </Button>
          </div>

          <div style={{ background: "linear-gradient(160deg, rgba(18,18,22,0.95) 0%, rgba(14,14,18,0.98) 100%)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
            {!isLoading && filteredResources?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "0.6fr 2fr 1fr 1.2fr 1.2fr 1fr 100px", padding: "12px 20px", background: "rgba(0,0,0,0.25)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["#", "Resource", "Type", "Location", "Department", "Status", ""].map((h) => (
                  <span key={h} style={{ fontSize: "0.68rem", fontWeight: 600, color: "#52525b", letterSpacing: "0.09em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
            )}

            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 14 }}>
                <Loader2 size={36} style={{ color: "#6366f1", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "0.875rem", color: "#52525b" }}>Loading resources...</p>
              </div>
            ) : filteredResources?.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Box size={26} style={{ color: "#52525b" }} /></div>
                <div><p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f4f4f5", margin: "0 0 4px" }}>No resources found</p></div>
              </div>
            ) : (
              <div>
                {filteredResources.map((res: any, i: number) => (
                  <div key={res.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "0.6fr 2fr 1fr 1.2fr 1.2fr 1fr 100px", alignItems: "center", padding: "14px 20px", borderBottom: i < filteredResources.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", animation: `rowIn 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#6366f1" }}>{res.resourceNumber}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" }}>
                        {getResourceIcon(res.resourceType || res.type)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f4f4f5" }}>{res.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "#52525b" }}>Cap: {res.capacity}</span>
                      </div>
                    </div>
                    <div><Badge variant={(res.resourceType || res.type) === "ROOM" ? "info" : "success"}>{res.resourceType || res.type}</Badge></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#71717a" }}><Building2 size={12} /> {res.building?.name || res.buildingName}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#52525b" }}><Layers size={11} /> {res.floor?.name || res.floorName || "N/A"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#71717a" }}><Users size={13} /> {res.department?.name || res.departmentName || "Global"}</div>
                    <div><Badge variant={res.active ? "success" : "danger"}>{res.active ? "Active" : "Inactive"}</Badge></div>
                    <div className="row-actions" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(res)} title="Edit"><Pencil size={14} /></Button>
                      <Button variant="danger" size="icon" onClick={() => setDeleteTarget(res)} title="Delete"><Trash2 size={14} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingResource ? "Edit Resource" : "Add Resource"} description="Define a new physical resource in the office.">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: formData.resourceType === "PARKING" ? "1fr" : "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Building</Label>
                <Select value={selectedBuildingId} onChange={(e: any) => setSelectedBuildingId(e.target.value)}>
                  <option value="" disabled style={{ background: "#18181b" }}>Select Building</option>
                  {buildings?.map((b: any) => <option key={b.id} value={b.id.toString()} style={{ background: "#18181b" }}>{b.name}</option>)}
                </Select>
              </div>
              {formData.resourceType !== "PARKING" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>Floor</Label>
                  <Select value={formData.floorId} onChange={(e: any) => setFormData({ ...formData, floorId: e.target.value })}>
                    <option value="" disabled style={{ background: "#18181b" }}>Select Floor</option>
                    {filteredFloors.map((f: any) => <option key={f.id} value={f.id.toString()} style={{ background: "#18181b" }}>{f.name || f.floorName}</option>)}
                  </Select>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: formData.resourceType === "PARKING" ? "1fr" : "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Resource Type</Label>
                <Select value={formData.resourceType} onChange={(e: any) => setFormData({ ...formData, resourceType: e.target.value })}>
                  <option value="ROOM" style={{ background: "#18181b" }}>ROOM</option>
                  <option value="DESK" style={{ background: "#18181b" }}>DESK</option>
                  <option value="PARKING" style={{ background: "#18181b" }}>PARKING</option>
                </Select>
              </div>
              {formData.resourceType !== "PARKING" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>Department Scope</Label>
                  <Select value={formData.departmentId} onChange={(e: any) => setFormData({ ...formData, departmentId: e.target.value })}>
                    <option value="" disabled style={{ background: "#18181b" }}>Select Department</option>
                    {departments?.map((d: any) => <option key={d.id} value={d.id.toString()} style={{ background: "#18181b" }}>{d.name}</option>)}
                  </Select>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Resource #</Label>
                <Input icon={<Hash size={14} />} value={formData.resourceNumber} onChange={(e: any) => setFormData({ ...formData, resourceNumber: e.target.value })} placeholder="e.g. R-101" required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Display Name</Label>
                <Input value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Zen Room, Corner Desk" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Capacity</Label>
                <Input type="number" min="1" value={formData.capacity} onChange={(e: any) => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
              {formData.resourceType === "DESK" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>Desk Mode</Label>
                  <Select value={formData.deskMode} onChange={(e: any) => setFormData({ ...formData, deskMode: e.target.value })}>
                    <option value="HOT_DESK" style={{ background: "#18181b" }}>HOT_DESK</option>
                    <option value="ASSIGNED" style={{ background: "#18181b" }}>ASSIGNED</option>
                  </Select>
                </div>
              ) : formData.resourceType === "ROOM" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>Booking Type</Label>
                  <Select value={formData.bookingType} onChange={(e: any) => setFormData({ ...formData, bookingType: e.target.value })}>
                    <option value="EXCLUSIVE" style={{ background: "#18181b" }}>EXCLUSIVE</option>
                    <option value="SHARED" style={{ background: "#18181b" }}>SHARED</option>
                  </Select>
                </div>
              ) : <div />}
               <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>Status</Label>
                  <Select value={formData.active.toString()} onChange={(e: any) => setFormData({ ...formData, active: e.target.value === "true" })}>
                    <option value="true" style={{ background: "#18181b" }}>Active</option>
                    <option value="false" style={{ background: "#18181b" }}>Inactive</option>
                  </Select>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Label>Description / Features</Label>
              <Input icon={<Settings size={14} />} value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} placeholder="Projector, Whiteboard, EV Charging..." />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingResource ? "Save Changes" : "Create Resource"}
              </Button>
            </div>
          </form>
        </Dialog>

        {deleteTarget && (
          <div style={{ position: "fixed", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ width: "100%", maxWidth: 360, background: "#18181b", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 18, padding: 24, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 16px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><AlertTriangle size={22} style={{ color: "#f87171" }} /></div>
              <h3 style={{ fontSize: "1rem", color: "#f4f4f5", margin: "0 0 8px" }}>Delete resource?</h3>
              <p style={{ fontSize: "0.8125rem", color: "#71717a", marginBottom: 24 }}>Delete {deleteTarget.name || deleteTarget.resourceNumber}?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button variant="danger" style={{ flex: 1, background: "#ef4444", color: "#fff" }} onClick={() => deleteMutation.mutate(deleteTarget.id, { onSuccess: () => { toast.success("Deleted"); setDeleteTarget(null); } })}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
