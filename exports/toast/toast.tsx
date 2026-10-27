// DS-FIPS — Toast Notification — Copy-paste ready
import { useState, useEffect, useRef } from "react";

const C = {
  azulProfundo: "var(--color-gov-azul-profundo)",
  azulEscuro: "var(--color-gov-azul-escuro)",
  cinzaChumbo: "var(--color-fg-muted)",
  cinzaEscuro: "var(--color-fg)",
  verdeFloresta: "#00C64C",
  verdeFlorestaProfundo: "#006D35",
  amareloEscuro: "#F6921E",
  danger: "#DC3545",
  branco: "#FFFFFF",
  bg: "var(--color-surface-muted)",
  cardBorder: "var(--color-border)",
};

const Fn = {
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

type ToastVariant = "sucesso" | "erro" | "atencao" | "info" | "neutro";

const TV: Record<ToastVariant, { bg: string; border: string; color: string; accent: string }> = {
  sucesso: { bg: "#ECFDF5", border: "#A7F3D0", color: C.verdeFlorestaProfundo, accent: C.verdeFloresta },
  erro: { bg: "#FEF2F2", border: "#FECACA", color: "#B91C1C", accent: C.danger },
  atencao: { bg: "#FFF7ED", border: "#FDBA74", color: "#C2410C", accent: C.amareloEscuro },
  info: { bg: "#D3E3F4", border: "#93BDE4", color: C.azulEscuro, accent: C.azulProfundo },
  neutro: { bg: C.bg, border: C.cardBorder, color: C.cinzaEscuro, accent: C.cinzaChumbo },
};

interface ToastItem {
  id: number; variant: ToastVariant; title?: string;
  message?: string; actionLabel?: string; duration?: number;
}

function Toast({ id, variant, title, message, actionLabel, duration, onClose }: ToastItem & { onClose: (id: number) => void }) {
  const v = TV[variant] || TV.info;
  const [out, setOut] = useState(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration) { timerId.current = setTimeout(() => { setOut(true); setTimeout(() => onClose(id), 300); }, duration); }
    return () => { if (timerId.current) clearTimeout(timerId.current); };
  }, [duration, id, onClose]);

  const dismiss = () => { setOut(true); setTimeout(() => onClose(id), 300); };

  return (
    <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 10, borderLeft: `4px solid ${v.accent}`, padding: "12px 16px", width: 360, maxWidth: "calc(100vw - 32px)", boxShadow: "0 4px 20px rgba(0,0,0,.1)", display: "flex", gap: 12, alignItems: "center", position: "relative", overflow: "hidden", opacity: out ? 0 : 1, transform: out ? "translateX(110%)" : "translateX(0)", transition: "all .3s ease" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13, fontWeight: 700, color: v.color, fontFamily: Fn.body, marginBottom: 2 }}>{title}</div>}
        {message && <div style={{ fontSize: 12, color: v.color, fontFamily: Fn.body, opacity: 0.85, lineHeight: 1.4 }}>{message}</div>}
        {actionLabel && <button onClick={dismiss} style={{ marginTop: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: v.accent, background: "transparent", border: `1px solid ${v.accent}`, borderRadius: 4, cursor: "pointer", fontFamily: Fn.body }}>{actionLabel}</button>}
      </div>
      <span onClick={dismiss} style={{ display: "flex", cursor: "pointer", opacity: 0.5, flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={v.color} strokeWidth="1.8" strokeLinecap="round"/></svg>
      </span>
      {duration && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3 }}><div style={{ height: 3, background: v.accent, opacity: 0.35, animation: `toastTimer ${duration}ms linear forwards` }} /></div>}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const add = (t: Omit<ToastItem, "id">) => { const id = ++nextId.current; setToasts((prev) => [{ ...t, id }, ...prev].slice(0, 5)); };
  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const ToastContainer = () => (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      <style>{`@keyframes toastTimer{from{width:100%}to{width:0%}}`}</style>
      {toasts.map((t) => <div key={t.id} style={{ pointerEvents: "auto" }}><Toast {...t} onClose={remove} /></div>)}
    </div>
  );
  return { addToast: add, ToastContainer };
}

// Usage:
// function App() {
//   const { addToast, ToastContainer } = useToast();
//   return (
//     <>
//       <ToastContainer />
//       <button onClick={() => addToast({ variant: "sucesso", title: "Salvo!", message: "Registro salvo.", duration: 5000 })}>
//         Salvar
//       </button>
//     </>
//   );
// }
