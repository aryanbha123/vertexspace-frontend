import { useState, useRef, useEffect } from "react";
import { useGetAllDepartments } from "../hooks/shared/SharedApi";
import { useMe, useRegister } from "../hooks/user/UserApi";
import { toast } from "sonner";

export default function Register() {
  const { data: departments } = useGetAllDepartments();
  const { data: me } = useMe();
  const { mutate, isPending } = useRegister();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Record<string, boolean>>({});
  const [selectValue, setSelectValue] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.05,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${d.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "departmentId" ? Number(value) : value });
    setFilledFields((prev) => ({ ...prev, [name]: value.length > 0 }));
    if (name === "departmentId") setSelectValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast.success("Account created successfully");
        setForm({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          departmentId: 0,
        });
        setFilledFields({});
        setSelectValue("");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Registration failed");
      }
    });
  };

  const fields = [
    { name: "firstName", label: "First name", type: "text", col: 1 },
    { name: "lastName", label: "Last name", type: "text", col: 2 },
    { name: "email", label: "Email address", type: "email", col: "full" },
    { name: "password", label: "Password", type: "password", col: "full" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .reg-root { font-family: 'DM Sans', sans-serif; }

        .reg-card {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .reg-title {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-wrap {
          position: relative;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .field-wrap[data-delay="1"] { animation-delay: 0.35s; }
        .field-wrap[data-delay="2"] { animation-delay: 0.42s; }
        .field-wrap[data-delay="3"] { animation-delay: 0.49s; }
        .field-wrap[data-delay="4"] { animation-delay: 0.56s; }
        .field-wrap[data-delay="5"] { animation-delay: 0.63s; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .field-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          color: #71717a;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .field-label.active {
          top: 10px;
          transform: translateY(0);
          font-size: 0.68rem;
          color: #818cf8;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .field-input {
          width: 100%;
          background: rgba(39,39,42,0.8);
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 22px 16px 8px;
          color: #f4f4f5;
          font-size: 0.9375rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .field-input:hover {
          border-color: #52525b;
          background: rgba(39,39,42,1);
        }

        .field-input:focus {
          border-color: #6366f1;
          background: rgba(30,27,75,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 1px 2px rgba(0,0,0,0.4);
        }

        .field-line {
          position: absolute;
          bottom: 0;
          left: 10px;
          right: 10px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #a5b4fc);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .field-input:focus ~ .field-line { transform: scaleX(1); }

        /* Select styling */
        .select-wrap {
          position: relative;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.63s both;
        }

        .select-label {
          position: absolute;
          left: 16px;
          font-size: 0.68rem;
          color: #818cf8;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
          top: 10px;
          pointer-events: none;
          z-index: 1;
        }

        .select-placeholder-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          color: #71717a;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .select-placeholder-label.active {
          top: 10px;
          transform: translateY(0);
          font-size: 0.68rem;
          color: #818cf8;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .field-select {
          width: 100%;
          appearance: none;
          background: rgba(39,39,42,0.8);
          border: 1px solid #3f3f46;
          border-radius: 10px;
          padding: 22px 40px 8px 16px;
          color: #f4f4f5;
          font-size: 0.9375rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .field-select:hover {
          border-color: #52525b;
          background: rgba(39,39,42,1);
        }

        .field-select:focus {
          border-color: #6366f1;
          background: rgba(30,27,75,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 1px 2px rgba(0,0,0,0.4);
        }

        .field-select option {
          background: #18181b;
          color: #f4f4f5;
        }

        .select-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #71717a;
          transition: color 0.2s, transform 0.2s;
        }

        .select-wrap:focus-within .select-arrow {
          color: #818cf8;
          transform: translateY(-50%) rotate(180deg);
        }

        .select-line {
          position: absolute;
          bottom: 0;
          left: 10px;
          right: 10px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #a5b4fc);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .select-wrap:focus-within .select-line { transform: scaleX(1); }

        .submit-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
          background-size: 200% 200%;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 13px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background-position 0.4s;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          background-position: right center;
        }

        .submit-btn:not(:disabled):active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }

        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          transform: translateX(-100%);
        }

        .submit-btn:not(:disabled):hover::before {
          animation: shimmer 0.6s ease forwards;
        }

        @keyframes shimmer {
          to { transform: translateX(100%); }
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .footer-link {
          text-align: center;
          font-size: 0.8125rem;
          color: #71717a;
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both;
        }

        .footer-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          transition: color 0.2s;
        }

        .footer-link a::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 1px;
          background: #818cf8;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer-link a:hover { color: #a5b4fc; }
        .footer-link a:hover::after { transform: scaleX(1); }

        .step-pill {
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }
      `}</style>

      <div
        className="reg-root"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          position: "relative",
          overflow: "hidden",
          padding: "24px 0",
        }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        <div className="glow-orb" style={{ width: 400, height: 400, background: "rgba(99,102,241,0.08)", top: "5%", left: "15%" }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: "rgba(165,180,252,0.06)", bottom: "10%", right: "10%" }} />

        <div
          className="reg-card"
          style={{
            position: "relative",
            width: 460,
            background: "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(18,18,22,0.98) 100%)",
            borderRadius: 20,
            padding: "40px 36px",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.06) inset",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Corner glow */}
          <div style={{
            position: "absolute", top: 0, right: 0, width: 100, height: 100,
            background: "radial-gradient(circle at top right, rgba(99,102,241,0.15) 0%, transparent 70%)",
            borderRadius: "0 20px 0 0", pointerEvents: "none",
          }} />

          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <div
              className="step-pill"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 20, padding: "4px 12px", marginBottom: 14,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span style={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                New account
              </span>
            </div>

            <h1 className="reg-title" style={{ margin: 0, fontSize: "1.75rem", color: "#f4f4f5" }}>
              Create account
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "0.875rem", color: "#71717a" }}>
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* First + Last name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["firstName", "lastName"].map((name, i) => (
                <div className="field-wrap" key={name} data-delay={i + 1}>
                  <input
                    className="field-input"
                    name={name}
                    type="text"
                    required
                    autoComplete={name === "firstName" ? "given-name" : "family-name"}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                  />
                  <label className={`field-label ${focusedField === name || filledFields[name] ? "active" : ""}`}>
                    {name === "firstName" ? "First name" : "Last name"}
                  </label>
                  <div className="field-line" />
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="field-wrap" data-delay="3">
              <input
                className="field-input"
                name="email"
                type="email"
                required
                autoComplete="email"
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
              <label className={`field-label ${focusedField === "email" || filledFields.email ? "active" : ""}`}>
                Email address
              </label>
              <div className="field-line" />
            </div>

            {/* Password */}
            <div className="field-wrap" data-delay="4">
              <input
                className="field-input"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <label className={`field-label ${focusedField === "password" || filledFields.password ? "active" : ""}`}>
                Password
              </label>
              <div className="field-line" />
            </div>

            {/* Department Select */}
            <div className="select-wrap" data-delay="5">
              <select
                className="field-select"
                name="departmentId"
                onChange={handleChange}
                defaultValue=""
                required
                onFocus={() => setFocusedField("departmentId")}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled style={{ color: "#71717a" }} />
                {departments?.map((dept: { id: number; name: string }) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              <label className={`select-placeholder-label ${focusedField === "departmentId" || selectValue ? "active" : ""}`}>
                Department
              </label>

              {/* Chevron */}
              <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="select-line" />
            </div>

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={isPending} style={{ marginTop: 4 }}>
              {isPending ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #3f3f46, transparent)" }} />
              <span style={{ fontSize: "0.7rem", color: "#52525b", letterSpacing: "0.08em", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #3f3f46, transparent)" }} />
            </div>
            <p className="footer-link">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}