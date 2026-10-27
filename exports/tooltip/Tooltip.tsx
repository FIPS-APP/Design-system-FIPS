// DS-FIPS — Tooltip — Copy-paste ready
import { useState, useRef } from "react";

const C = {
  azulProfundo: "var(--color-gov-azul-profundo)",
  azulEscuro: "var(--color-gov-azul-escuro)",
  cinzaEscuro: "var(--color-fg)",
  cinzaChumbo: "var(--color-fg-muted)",
  azulCeu: "#93BDE4",
  verdeFlorestaProfundo: "#006D35",
  branco: "#FFFFFF",
  cardBorder: "var(--color-border)",
};

const Fn = {
  body: "'Open Sans', sans-serif",
};

type TooltipVariant = "dark" | "light" | "info" | "atencao" | "erro" | "sucesso";

const TTV: Record<TooltipVariant, { bg: string; color: string; border: string }> = {
  dark: { bg: C.cinzaEscuro, color: C.branco, border: C.cinzaEscuro },
  light: { bg: C.branco, color: C.cinzaEscuro, border: C.cardBorder },
  info: { bg: "#EFF6FF", color: C.azulEscuro, border: C.azulCeu },
  atencao: { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  erro: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  sucesso: { bg: "#ECFDF5", color: C.verdeFlorestaProfundo, border: "#A7F3D0" },
};

export function Tooltip({
  children, text, title: ttl, position = "top",
  variant = "dark", delay = 200, maxW = 240,
}: {
  children: React.ReactNode; text: string; title?: string;
  position?: "top" | "bottom" | "left" | "right";
  variant?: TooltipVariant; delay?: number; maxW?: number;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const v = TTV[variant] || TTV.dark;

  const enter = () => { timer.current = setTimeout(() => setShow(true), delay); };
  const leave = () => { clearTimeout(timer.current!); setShow(false); };

  const arrowSize = 6;
  const posStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: arrowSize + 2 },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: arrowSize + 2 },
    left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: arrowSize + 2 },
    right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: arrowSize + 2 },
  };
  const arrowStyles: Record<string, React.CSSProperties> = {
    top: { bottom: -arrowSize, left: "50%", transform: "translateX(-50%)", borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid ${v.bg}` },
    bottom: { top: -arrowSize, left: "50%", transform: "translateX(-50%)", borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid ${v.bg}` },
    left: { right: -arrowSize, top: "50%", transform: "translateY(-50%)", borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderLeft: `${arrowSize}px solid ${v.bg}` },
    right: { left: -arrowSize, top: "50%", transform: "translateY(-50%)", borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid ${v.bg}` },
  };

  return (
    <span onMouseEnter={enter} onMouseLeave={leave} style={{ position: "relative", display: "inline-flex", cursor: "default" }}>
      {children}
      {show && (
        <span style={{ position: "absolute", ...posStyles[position], zIndex: 50, pointerEvents: "none" }}>
          <span style={{ display: "block", background: v.bg, color: v.color, border: `1px solid ${v.border}`, borderRadius: 6, padding: ttl ? "8px 12px" : "6px 10px", fontSize: 12, fontFamily: Fn.body, lineHeight: 1.4, maxWidth: maxW, boxShadow: "0 4px 12px rgba(0,0,0,.12)", whiteSpace: "normal" }}>
            {ttl && <span style={{ display: "block", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{ttl}</span>}
            {text}
          </span>
          <span style={{ position: "absolute", width: 0, height: 0, ...arrowStyles[position] }} />
        </span>
      )}
    </span>
  );
}

// Usage:
// <Tooltip text="Dica de ajuda aqui." position="top" variant="dark">
//   <button>Hover aqui</button>
// </Tooltip>
// <Tooltip title="Campo CNPJ" text="14 digitos no formato XX.XXX.XXX/XXXX-XX." variant="info">
//   <span>(?)</span>
// </Tooltip>
