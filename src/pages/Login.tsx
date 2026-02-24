import { useState, useRef, useEffect } from "react";
import { useLogin } from "../hooks/user/UserApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({ email: "", password: "" });

  // Subtle particle / grid background
  useEffect(() => {
    setMounted(true);
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

    const dots: { x: number; y: number; vx: number; vy: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.05,
      });
    }

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

      // Draw connections
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFilledFields((prev) => ({ ...prev, [name]: value.length > 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        navigate("/");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          font-family: 'DM Sans', sans-serif;
        }

        .login-card {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-title {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          animation: titleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes titleIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .field-wrap {
          position: relative;
          animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .field-wrap:nth-child(1) { animation-delay: 0.4s; }
        .field-wrap:nth-child(2) { animation-delay: 0.5s; }

        @keyframes fieldIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
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
        }

        .field-label.active {
          top: 10px;
          transform: translateY(0);
          font-size: 0.7rem;
          color: #818cf8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .field-input {
          width: 100%;
          background: rgba(39, 39, 42, 0.8);
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
          background: rgba(39, 39, 42, 1);
        }

        .field-input:focus {
          border-color: #6366f1;
          background: rgba(30, 27, 75, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12), 0 1px 2px rgba(0,0,0,0.4);
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

        .field-input:focus + .field-label + .field-line,
        .field-input:focus ~ .field-line {
          transform: scaleX(1);
        }

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
          animation: btnIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }

        @keyframes btnIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
          background-position: right center;
        }

        .submit-btn:not(:disabled):active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0s;
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #3f3f46, transparent);
        }
        .divider-text {
          font-size: 0.7rem;
          color: #52525b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-link {
          text-align: center;
          font-size: 0.8125rem;
          color: #71717a;
          animation: fieldIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
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

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }
      `}</style>

      <div
        className="login-root"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Ambient glow orbs */}
        <div
          className="glow-orb"
          style={{
            width: 400,
            height: 400,
            background: "rgba(99,102,241,0.08)",
            top: "10%",
            left: "20%",
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: 300,
            height: 300,
            background: "rgba(165,180,252,0.06)",
            bottom: "15%",
            right: "15%",
          }}
        />

        {/* Card */}
        <div
          className="login-card"
          style={{
            position: "relative",
            width: 400,
            background:
              "linear-gradient(160deg, rgba(24,24,27,0.95) 0%, rgba(18,18,22,0.98) 100%)",
            borderRadius: 20,
            padding: "40px 36px",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.06) inset",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background:
                "radial-gradient(circle at top right, rgba(99,102,241,0.15) 0%, transparent 70%)",
              borderRadius: "0 20px 0 0",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #4f46e5, #818cf8)",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                animation: "cardIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h1 className="login-title" style={{ margin: 0, fontSize: "1.75rem", color: "#f4f4f5" }}>
              Welcome back
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: "0.875rem", color: "#71717a" }}>
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Email */}
            <div className="field-wrap">
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
              <label
                className={`field-label ${focusedField === "email" || filledFields.email ? "active" : ""}`}
              >
                Email address
              </label>
              <div className="field-line" />
            </div>

            {/* Password */}
            <div className="field-wrap">
              <input
                className="field-input"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <label
                className={`field-label ${focusedField === "password" || filledFields.password ? "active" : ""}`}
              >
                Password
              </label>
              <div className="field-line" />
            </div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: -4, animation: "fieldIn 0.5s 0.52s both" }}>
              <a
                href="/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  color: "#818cf8",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#818cf8")}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              className="submit-btn"
              type="submit"
              disabled={isPending}
              style={{ marginTop: 6 }}
            >
              {isPending ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 24 }}>
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>
            <p className="footer-link" style={{ marginTop: 16 }}>
              Don't have an account?{" "}
              <a href="/register">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}