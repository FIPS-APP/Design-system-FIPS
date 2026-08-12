// DS-FIPS — Badge — Copy-paste ready
import React from "react";

const C = {
  azulProfundo: "var(--color-gov-azul-profundo)",
  azulEscuro: "var(--color-gov-azul-escuro)",
  fg: "var(--color-fg)",
  fgMuted: "var(--color-fg-muted)",
  surface: "var(--color-surface)",
  surfaceMuted: "var(--color-surface-muted)",
  border: "var(--color-border)",
  branco: "#FFFFFF",
  verdeEscuro: "#00904C",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  amareloOuro: "#FDC24E",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

const VARIANTS: Record<string, { bg: string; color: string; border: string }> = {
  default:   { bg: C.azulProfundo, color: C.branco, border: "transparent" },
  secondary: { bg: C.surfaceMuted, color: C.fg, border: C.border },
  sucesso:   { bg: "#ECFDF5", color: "#00904C", border: "#A7F3D0" },
  atencao:   { bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74" },
  critico:   { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
  outline:   { bg: "transparent", color: C.fg, border: "#C0CCD2" },
  info:      { bg: C.azulCeuClaro, color: C.azulEscuro, border: C.azulCeu },
  ouro:      { bg: "#FEF9E7", color: "#92400E", border: C.amareloOuro },
};

interface BadgeProps {
  variant?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
  count?: number;
  onRemove?: () => void;
  pill?: boolean;
}

export function Badge({ variant = "default", size = "md", children, icon, dot, dotColor, count, onRemove, pill }: BadgeProps) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const sm: Record<string, { fs: number; px: number; py: number; gap: number; dotSz: number }> = {
    sm: { fs: 10, px: 6, py: 1, gap: 4, dotSz: 5 },
    md: { fs: 11, px: 8, py: 2, gap: 5, dotSz: 6 },
    lg: { fs: 12, px: 10, py: 3, gap: 6, dotSz: 7 },
  };
  const s = sm[size] || sm.md;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      padding: `${s.py}px ${s.px}px`,
      fontSize: s.fs, fontWeight: 600, fontFamily: Fn.body,
      color: v.color, background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: pill ? 999 : 4,
      lineHeight: 1.3, whiteSpace: "nowrap",
      transition: "all .15s",
    }}>
      {dot && <span style={{ width: s.dotSz, height: s.dotSz, borderRadius: "50%", background: dotColor || v.color, flexShrink: 0, opacity: 0.85 }} />}
      {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
      {count !== undefined && (
        <span style={{
          minWidth: s.fs + 4, height: s.fs + 4, borderRadius: 999,
          background: v.color, color: v.bg === "transparent" ? C.branco : v.bg,
          fontSize: s.fs - 1, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", fontFamily: Fn.mono,
        }}>{count > 99 ? "99+" : count}</span>
      )}
      {children}
      {onRemove && (
        <span onClick={onRemove} style={{ display: "flex", cursor: "pointer", opacity: 0.6, marginLeft: 2, transition: "opacity .15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = ".6"}>
          <svg width={size === "sm" ? 8 : 10} height={size === "sm" ? 8 : 10} viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke={v.color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </span>
  );
}

// Usage:
// <Badge variant="sucesso" dot>Ativo</Badge>
// <Badge variant="atencao" dot>Pendente</Badge>
// <Badge variant="critico" icon={<FireIcon />}>Urgente</Badge>
// <Badge variant="info" pill onRemove={() => {}}>Tag</Badge>
// <Badge variant="default" count={5}>Notificacoes</Badge>
