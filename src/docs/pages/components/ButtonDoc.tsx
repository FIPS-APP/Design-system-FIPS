import { useState } from "react";
import { CodeExportSection } from '../../components/CodeExport';

/* ═══════════════════════════════════════════
   FIPS DESIGN SYSTEM — OFFICIAL BRAND TOKENS
   Source: FIPS Brandbook
   ═══════════════════════════════════════════ */

const C = {
  azulProfundo:   "var(--color-gov-azul-profundo)",
  azulEscuro:     "var(--color-gov-azul-escuro)",
  azulClaro:      "var(--color-gov-azul-claro)",
  cinzaChumbo:    "var(--color-fg-muted)",
  cinzaEscuro:    "var(--color-fg)",
  cinzaClaro:     "#C0CCD2",
  azulCeu:        "#93BDE4",
  azulCeuClaro:   "#D3E3F4",
  amareloOuro:    "#FDC24E",
  amareloEscuro:  "#F6921E",
  verdeFloresta:  "#00C64C",
  verdeEscuro:    "#00904C",
  verdeSuave:     "#8BE5AD",
  azulCeuForte:   "#0090D0",
  neutro:         "var(--color-surface-soft)",
  branco:         "#FFFFFF",
  danger:         "#DC3545",
  dangerDark:     "#C82333",
  bg:             "var(--color-surface-muted)",
  cardBg:         "var(--color-surface)",
  cardBorder:     "var(--color-border)",
  textMuted:      "var(--color-fg-muted)",
  textLight:      "var(--color-fg-muted)",
};

const FONTS = {
  title: "'Saira Expanded', 'Saira', sans-serif",
  body:  "'Open Sans', 'Segoe UI', sans-serif",
  mono:  "'Fira Code', 'DM Mono', monospace",
};

function JunctionLines({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.12, ...style }}>
      <path d="M0 60 H100 C120 60 120 60 140 40 L200 40 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 60 H100 C120 60 120 60 140 80 L200 80 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 120 H60 C80 120 80 120 100 100 L160 100 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 120 H60 C80 120 80 120 100 140 L160 140 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 170 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 20 H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

function DSButton({ variant = "primary", size = "medium", disabled = false, loading = false, icon, children }: { variant?: string; size?: string; disabled?: boolean; loading?: boolean; icon?: React.ReactNode; children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizeMap: Record<string, { padding: string; fontSize: string; height: string; iconSize: number }> = {
    small:  { padding: "6px 14px", fontSize: "12px", height: "30px", iconSize: 13 },
    medium: { padding: "8px 20px", fontSize: "13px", height: "36px", iconSize: 14 },
    large:  { padding: "10px 28px", fontSize: "14px", height: "42px", iconSize: 16 },
  };

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const variantMap: Record<string, { bg: string; bgH: string; color: string; border: string; underline?: boolean }> = {
    primary:   { bg: isDark ? "#0090D0" : "#004B9B",  bgH: isDark ? "#007AB1" : "#002A68", color: "#FFFFFF", border: "transparent" },
    secondary: { bg: "var(--color-surface-soft)", bgH: "var(--color-surface-muted)", color: C.cinzaEscuro, border: "var(--color-border)" },
    outline:   { bg: "transparent",   bgH: isDark ? "rgba(147,189,228,0.15)" : C.azulCeuClaro, color: isDark ? "#93BDE4" : "#004B9B", border: isDark ? "#93BDE4" : "#004B9B" },
    inverse:   { bg: isDark ? "#333B41" : "#002A68", bgH: isDark ? "#444" : C.cinzaEscuro, color: "#FFFFFF", border: isDark ? "#444" : "#002A68" },
    ghost:     { bg: "transparent",   bgH: isDark ? "rgba(147,189,228,0.12)" : `${C.azulCeuClaro}88`, color: C.cinzaChumbo, border: "transparent" },
    accent:    { bg: C.amareloEscuro, bgH: "#E0820A",        color: C.branco,       border: "transparent" },
    save:      { bg: C.verdeFloresta, bgH: C.verdeEscuro,    color: C.branco,       border: "transparent" },
    danger:    { bg: C.danger,        bgH: C.dangerDark,     color: C.branco,       border: "transparent" },
    link:      { bg: "transparent",   bgH: "transparent",    color: isDark ? "#93BDE4" : "#004B9B", border: "transparent", underline: true },
    ouro:      { bg: C.amareloOuro,   bgH: C.amareloEscuro,  color: C.azulEscuro,   border: "transparent" },
  };

  const v = variantMap[variant] || variantMap.primary;
  const s = sizeMap[size] || sizeMap.medium;

  const btnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px",
    padding: s.padding, height: s.height, fontSize: s.fontSize,
    fontWeight: 600, fontFamily: FONTS.body, borderRadius: "6px",
    border: `1.5px solid ${v.border}`,
    background: disabled ? (isDark ? "#3A3A3A" : C.cinzaClaro) : (hovered && !loading ? v.bgH : v.bg),
    color: disabled ? (isDark ? "#6B6B6B" : C.cinzaChumbo) : v.color,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.18s ease",
    transform: pressed && !disabled && !loading ? "scale(0.97)" : "scale(1)",
    textDecoration: v.underline && hovered ? "underline" : "none",
    opacity: disabled ? 0.55 : 1,
    letterSpacing: "0.01em", whiteSpace: "nowrap", outline: "none",
    boxShadow: hovered && !disabled && !loading && variant !== "ghost" && variant !== "link"
      ? "0 2px 8px rgba(0,75,155,0.18)" : "none",
    ...(hovered && !disabled && !loading && (variant === "accent" || variant === "ouro") ? {
      backgroundImage: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s ease-in-out infinite",
    } : {}),
  };

  return (
    <button
      style={btnStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
    >
      {loading && <Spinner size={s.iconSize} color={disabled ? C.cinzaChumbo : v.color} />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

function Spinner({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "dsSpin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function IconSave({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M13 1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4l-2-3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 1v4h6V1" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><rect x="4" y="9" width="8" height="4" rx="0.5" stroke={color} strokeWidth="1.5"/></svg>);
}
function IconTrash({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}
function IconPlus({ size = 14, color = C.cinzaEscuro }: { size?: number; color?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>);
}
function IconCheck({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (<svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}

function TokenRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontFamily: FONTS.body }}>
      {color && <div style={{ width: 16, height: 16, borderRadius: 4, background: color, border: `1px solid ${C.cardBorder}`, flexShrink: 0 }} />}
      <span style={{ color: C.cinzaChumbo, minWidth: 90 }}>{label}</span>
      <code style={{ background: C.neutro, padding: "2px 8px", borderRadius: 4, fontSize: "11px", fontFamily: FONTS.mono, color: C.cinzaEscuro }}>{value}</code>
    </div>
  );
}

function Section({ number, title, desc, children }: { number: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.azulClaro, fontFamily: FONTS.title, marginBottom: 6 }}>{number}</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: FONTS.title, letterSpacing: "0.5px" }}>{title}</h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: "0 0 20px", lineHeight: 1.55, fontFamily: FONTS.body }}>{desc}</p>
      {children}
    </section>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.cardBg, borderRadius: "12px 12px 12px 24px",
      border: `1px solid ${C.cardBorder}`, padding: "28px",
      boxShadow: "0 1px 3px rgba(0,75,155,0.04), 0 4px 14px rgba(0,75,155,0.03)", ...style,
    }}>{children}</div>
  );
}

function ScenarioCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 20px", padding: "24px", flex: 1, minWidth: 280 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: FONTS.title }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.cinzaChumbo, margin: "0 0 18px", lineHeight: 1.5, fontFamily: FONTS.body }}>{desc}</p>
      <div style={{ background: C.branco, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 32, background: C.cinzaClaro, margin: "0 8px", flexShrink: 0 }} />;
}

/* ═══════════════════════════════════════════
   GUIDE CARD STYLES
   ═══════════════════════════════════════════ */
const guideCard: React.CSSProperties = {
  background: C.cardBg,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: "10px 10px 10px 18px",
  overflow: "hidden",
  transition: "box-shadow 0.2s ease",
};
const guideHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  background: `${C.bg}`,
  borderBottom: `1px solid ${C.cardBorder}`,
};
const guideToken: React.CSSProperties = {
  fontSize: 11,
  fontFamily: FONTS.mono,
  color: C.cinzaChumbo,
  background: C.cardBg,
  padding: "2px 8px",
  borderRadius: 4,
  border: `1px solid ${C.cardBorder}`,
};
const guideBody: React.CSSProperties = {
  padding: "16px 20px 20px",
};
const guideLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: C.azulClaro,
  fontFamily: FONTS.title,
  marginBottom: 4,
  marginTop: 12,
};
const guideText: React.CSSProperties = {
  fontSize: 13,
  color: C.cinzaEscuro,
  lineHeight: 1.55,
  margin: "0 0 0",
  fontFamily: FONTS.body,
};
const guideExemplo: React.CSSProperties = {
  fontSize: 12,
  color: C.cinzaChumbo,
  lineHeight: 1.5,
  margin: 0,
  fontFamily: FONTS.body,
  fontStyle: "italic",
  paddingLeft: 10,
  borderLeft: `2px solid ${C.azulCeuClaro}`,
};

const buttonExportCode = `// DS-FIPS — Button — Copy-paste ready
import { useState } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  azulClaro: "#0090D0",
  fg: "#333B41",
  fgMuted: "#7B8C96",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E2E8F0",
  branco: "#FFFFFF",
  danger: "#DC3545",
  dangerDark: "#C82333",
  verdeFloresta: "#00C64C",
  verdeEscuro: "#00904C",
  amareloOuro: "#FDC24E",
  amareloEscuro: "#F6921E",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  cinzaClaro: "#C0CCD2",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

type ButtonVariant = "primary" | "secondary" | "outline" | "inverse" | "ghost" | "accent" | "ouro" | "save" | "danger" | "link";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = "primary", size = "medium", disabled = false, loading = false, icon, children, onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizeMap: Record<string, { padding: string; fontSize: string; height: string; iconSize: number }> = {
    small:  { padding: "6px 14px", fontSize: "12px", height: "30px", iconSize: 13 },
    medium: { padding: "8px 20px", fontSize: "13px", height: "36px", iconSize: 14 },
    large:  { padding: "10px 28px", fontSize: "14px", height: "42px", iconSize: 16 },
  };

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const variantMap: Record<string, { bg: string; bgH: string; color: string; border: string; underline?: boolean }> = {
    primary:   { bg: isDark ? "#0090D0" : "#004B9B",  bgH: isDark ? "#007AB1" : "#002A68", color: "#FFFFFF", border: "transparent" },
    secondary: { bg: C.surfaceMuted, bgH: C.surfaceMuted, color: C.fg, border: C.border },
    outline:   { bg: "transparent",   bgH: isDark ? "rgba(147,189,228,0.15)" : C.azulCeuClaro, color: isDark ? "#93BDE4" : "#004B9B", border: isDark ? "#93BDE4" : "#004B9B" },
    inverse:   { bg: isDark ? "#333B41" : "#002A68", bgH: isDark ? "#444" : "#333B41", color: "#FFFFFF", border: isDark ? "#444" : "#002A68" },
    ghost:     { bg: "transparent",   bgH: isDark ? "rgba(147,189,228,0.12)" : "rgba(211,227,244,0.5)", color: C.fgMuted, border: "transparent" },
    accent:    { bg: C.amareloEscuro, bgH: "#E0820A",        color: C.branco,       border: "transparent" },
    save:      { bg: C.verdeFloresta, bgH: C.verdeEscuro,    color: C.branco,       border: "transparent" },
    danger:    { bg: C.danger,        bgH: C.dangerDark,     color: C.branco,       border: "transparent" },
    link:      { bg: "transparent",   bgH: "transparent",    color: isDark ? "#93BDE4" : "#004B9B", border: "transparent", underline: true },
    ouro:      { bg: C.amareloOuro,   bgH: C.amareloEscuro,  color: C.azulEscuro,   border: "transparent" },
  };

  const v = variantMap[variant] || variantMap.primary;
  const s = sizeMap[size] || sizeMap.medium;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px",
        padding: s.padding, height: s.height, fontSize: s.fontSize,
        fontWeight: 600, fontFamily: Fn.body, borderRadius: "6px",
        border: \`1.5px solid \${v.border}\`,
        background: disabled ? (isDark ? "#3A3A3A" : C.cinzaClaro) : (hovered && !loading ? v.bgH : v.bg),
        color: disabled ? (isDark ? "#6B6B6B" : C.fgMuted) : v.color,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        transform: pressed && !disabled && !loading ? "scale(0.97)" : "scale(1)",
        textDecoration: v.underline && hovered ? "underline" : "none",
        opacity: disabled ? 0.55 : 1,
        letterSpacing: "0.01em", whiteSpace: "nowrap", outline: "none",
        boxShadow: hovered && !disabled && !loading && variant !== "ghost" && variant !== "link"
          ? "0 2px 8px rgba(0,75,155,0.18)" : "none",
      }}
    >
      {loading && <Spinner size={s.iconSize} color={disabled ? C.fgMuted : v.color} />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}

function Spinner({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "dsSpin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

// Usage:
// <Button variant="primary">Confirmar</Button>
// <Button variant="save" icon={<SaveIcon />}>Salvar</Button>
// <Button variant="danger" size="small">Excluir</Button>
// <Button variant="ghost">Cancelar</Button>
// <Button variant="primary" loading>Carregando</Button>
// <Button variant="primary" disabled>Desabilitado</Button>
`;


const VARIANT_MAP: { variant: string; label: string }[] = [
  { variant: "primary", label: "Primário" },
  { variant: "secondary", label: "Secundário" },
  { variant: "outline", label: "Contorno" },
  { variant: "inverse", label: "Inverso" },
  { variant: "ghost", label: "Fantasma" },
  { variant: "accent", label: "Destaque" },
  { variant: "ouro", label: "Realce" },
  { variant: "save", label: "Salvar" },
  { variant: "danger", label: "Perigo" },
  { variant: "link", label: "Link" },
];

export default function DSFIPSButtons() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface-muted)", fontFamily: FONTS.body, color: C.cinzaEscuro }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        @keyframes dsSpin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background: `linear-gradient(135deg, ${C.azulProfundo} 0%, ${C.azulEscuro} 100%)`, padding: "48px 40px 44px", position: "relative", overflow: "hidden" }}>
        <JunctionLines style={{ position: "absolute", top: -10, right: -20, width: 400, height: 250 }} />
        <JunctionLines style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 200, transform: 'scaleX(-1)' }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.branco}10`, border: `1px solid ${C.branco}18`, borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C.amareloOuro, fontFamily: FONTS.title, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro}/><rect x="9" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity="0.3"/></svg>
            Design System FIPS
          </div>

          <h1 style={{ fontSize: 44, fontWeight: 700, color: C.branco, margin: "0 0 10px", fontFamily: FONTS.title, letterSpacing: "1px" }}>Button</h1>
          <p style={{ fontSize: 16, color: `${C.branco}B0`, lineHeight: 1.6, maxWidth: 680, margin: 0, fontFamily: FONTS.body }}>
            Catálogo visual de ações, estados e composições reais do DS-FIPS. A variante verde{" "}
            <code style={{ background: `${C.branco}15`, padding: "1px 6px", borderRadius: 4, fontSize: 14, fontFamily: FONTS.mono }}>success</code>{" "}
            é o padrão oficial para salvar e gravar.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { color: C.azulProfundo, label: "primário",  hex: "#004B9B" },
              { color: C.amareloEscuro, label: "destaque",  hex: "#F6921E" },
              { color: C.verdeFloresta, label: "sucesso", hex: "#00C64C" },
              { color: C.danger,        label: "perigo",  hex: "#DC3545" },
              { color: C.azulEscuro,    label: "inverso", hex: "#002A68" },
              { color: C.amareloOuro,   label: "realce",    hex: "#FDC24E" },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.branco}08`, border: `1px solid ${C.branco}15`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: `${C.branco}90`, fontFamily: FONTS.mono }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: t.color, border: `1px solid ${C.branco}20`, flexShrink: 0 }} />
                {t.label}
                <span style={{ opacity: 0.5 }}>{t.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ padding: "36px 40px 60px", maxWidth: 1100, margin: "0 auto" }}>

        <Section number="01" title="Variantes do sistema" desc="Cada variante comunica uma intenção diferente.">
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              {VARIANT_MAP.map(({ variant, label }) => (
                <DSButton key={variant} variant={variant}>{label}</DSButton>
              ))}
            </div>
          </Card>
        </Section>

        {/* 02 — GUIA DE USO */}
        <Section number="02" title="Guia de uso por variante" desc="Significado, contexto de aplicação e regras de uso de cada variante do sistema de botões.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>

            {/* PRIMARY */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="primary">Primário</DSButton>
                <code style={guideToken}>#004B9B</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação principal da tela. Representa a tarefa mais importante que o usuário deve executar naquele contexto.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Apenas 1 por tela ou modal. Usado em "Confirmar", "Continuar", "Buscar", "Aplicar filtro".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>Botão "Buscar" na tela de consulta do App Suprimentos; "Confirmar" no fluxo de aprovação de requisições.</p>
              </div>
            </div>

            {/* SECONDARY */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="secondary">Secundário</DSButton>
                <code style={guideToken}>#F1F5F9</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação alternativa ou complementar. Menor hierarquia visual que o primário, mas ainda visível.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Ao lado do botão primário como segunda opção. "Voltar", "Limpar filtros", "Editar", "Duplicar".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Limpar filtros" ao lado de "Buscar" na listagem de ocorrências; "Editar" em cards de registros.</p>
              </div>
            </div>

            {/* OUTLINE */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="outline">Contorno</DSButton>
                <code style={guideToken}>border #004B9B</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação visível mas não prioritária. Variante "leve" do primário — mesma identidade, menos peso visual.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Quando há múltiplas ações na tela e você precisa de hierarquia sem competir com o primário. "Detalhes", "Visualizar", "Expandir".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Ver detalhes" em linhas de tabela do Power BI embeddado; "Expandir" em cards do App Ideias.</p>
              </div>
            </div>

            {/* INVERSE */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="inverse">Inverso</DSButton>
                <code style={guideToken}>#002A68</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação institucional ou de destaque em contextos escuros. Transmite seriedade e peso da marca FIPS.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Em headers, banners, seções hero ou fundos claros onde o azul escuro cria contraste forte. "Saiba mais", "Acessar sistema".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Acessar plataforma" no portal FIPS; CTAs em comunicações internas e apresentações institucionais.</p>
              </div>
            </div>

            {/* GHOST */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="ghost">Fantasma</DSButton>
                <code style={guideToken}>transparent</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação terciária, discreta. Aparece apenas quando necessário sem poluir visualmente a interface.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Para "Cancelar" em modais, ações de suporte como "Salvar rascunho", "Fechar", "Pular". Nunca como ação principal.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Cancelar" nos modais do App Ocorrências; "Salvar rascunho" em formulários longos do SSMA.</p>
              </div>
            </div>

            {/* ACCENT */}
            <div style={guideCard}>
              <div style={{...guideHeader, gap: 8}}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <DSButton variant="accent">Escalar</DSButton>
                  <DSButton variant="accent">Enviar</DSButton>
                </div>
                <code style={guideToken}>#F6921E</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Ação que exige atenção especial ou representa um passo de escalação. Cor quente que atrai o olhar sem significar "sucesso". Possui efeito shimmer no hover para reforçar destaque visual.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Para fluxos de escalação, envio, ou ações que mudam o status sem confirmar sucesso. "Enviar para aprovação", "Escalar", "Notificar gestor", "Reabrir".</p>
                <div style={guideLabel}>Quando NÃO usar</div>
                <p style={{...guideText, color: C.danger}}>Nunca para "Aprovar" ou "Salvar" — essas são ações de sucesso/persistência e devem usar o verde (save). O laranja indica transição, não conclusão.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Enviar para aprovação" no fluxo de requisição de contratação; "Escalar ocorrência" no App Ocorrências; "Notificar gestor" no SSMA.</p>
              </div>
            </div>

            {/* REALCE */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="ouro">Realce</DSButton>
                <code style={guideToken}>#FDC24E</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Destaque informativo ou promocional. Cor quente e suave que chama atenção sem transmitir urgência nem sucesso. Possui efeito shimmer no hover para reforçar destaque visual.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Para realçar informações, badges de conquista, ações promocionais, upgrades ou destaques visuais. "Ver benefícios", "Resgatar", "Destacar", "Premium".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Resgatar Fipcoins" no App Ideias; badges de conquista e gamificação; realce em dashboards de indicadores e KPIs.</p>
              </div>
            </div>

            {/* SAVE / SUCCESS / APROVAR */}
            <div style={{...guideCard, borderLeft: `4px solid ${C.verdeFloresta}`}}>
              <div style={{...guideHeader, gap: 8}}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <DSButton variant="save" icon={<IconSave />}>Salvar</DSButton>
                  <DSButton variant="save" icon={<IconCheck />}>Aprovar</DSButton>
                </div>
                <code style={guideToken}>#00C64C</code>
              </div>
              <div style={guideBody}>
                <div style={{...guideLabel, color: C.verdeFloresta}}>★ PADRÃO OFICIAL DE PERSISTÊNCIA E APROVAÇÃO</div>
                <p style={guideText}>Ação de salvar, gravar, aprovar ou persistir dados com sucesso. Verde transmite confiança de que a operação será concluída com segurança.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Sempre que a ação grava dados ou confirma positivamente. "Salvar", "Gravar", "Aprovar", "Salvar alterações", "Salvar e fechar", "Confirmar aprovação". É o padrão oficial do DS-FIPS.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Gravar" em todos os formulários do ecossistema FIPS; "Aprovar requisição" nos fluxos de aprovação; "Salvar alterações" no App Suprimentos, Contpix e Serrat; rodapé de modais de edição.</p>
              </div>
            </div>

            {/* DANGER */}
            <div style={{...guideCard, borderLeft: `4px solid ${C.danger}`}}>
              <div style={guideHeader}>
                <DSButton variant="danger" icon={<IconTrash />}>Excluir</DSButton>
                <code style={guideToken}>#DC3545</code>
              </div>
              <div style={guideBody}>
                <div style={{...guideLabel, color: C.danger}}>⚠ AÇÃO DESTRUTIVA / IRREVERSÍVEL</div>
                <p style={guideText}>Ação perigosa que remove, exclui ou reverte dados de forma permanente. Vermelho alerta para consequências graves.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Exclusões, cancelamentos definitivos, revogações. Sempre em modal de confirmação, nunca diretamente em listagens. "Excluir", "Remover", "Revogar acesso".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Confirmar exclusão" em modal de confirmação do App Ocorrências; "Remover registro" no SSMA; "Revogar acesso" no App Acesso Visitante.</p>
              </div>
            </div>

            {/* LINK */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <DSButton variant="link">Link</DSButton>
                <code style={guideToken}>#004B9B underline</code>
              </div>
              <div style={guideBody}>
                <div style={guideLabel}>Significado</div>
                <p style={guideText}>Navegação inline sem peso visual. Parece um link de texto mas se comporta como botão com área de clique adequada.</p>
                <div style={guideLabel}>Quando usar</div>
                <p style={guideText}>Para navegação secundária dentro de textos, tabelas ou listas. "Ver todos", "Saiba mais", "Abrir em nova aba", "Termos de uso".</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Ver histórico completo" em cards de timeline; "Abrir OS" em listagens do Serrat; links de ajuda e documentação.</p>
              </div>
            </div>

          </div>
        </Section>

        <Section number="03" title="Tamanhos" desc="Três tamanhos padronizados. Cada um é projetado para um contexto de uso específico no ecossistema FIPS.">
          {/* Preview row */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
              {["small", "medium", "large"].map((sz) => (
                <div key={sz} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                  <DSButton variant="primary" size={sz}>{sz.charAt(0).toUpperCase() + sz.slice(1)}</DSButton>
                  <span style={{ fontSize: 10, color: C.textLight, fontFamily: FONTS.mono }}>{sz === "small" ? "30px" : sz === "medium" ? "36px" : "42px"}</span>
                </div>
              ))}
              <Divider />
              {["small", "medium", "large"].map((sz) => (
                <div key={`s-${sz}`} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                  <DSButton variant="save" size={sz}>{sz.charAt(0).toUpperCase() + sz.slice(1)}</DSButton>
                  <span style={{ fontSize: 10, color: C.textLight, fontFamily: FONTS.mono }}>{sz === "small" ? "30px" : sz === "medium" ? "36px" : "42px"}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Guide cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>

            {/* SMALL */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DSButton variant="primary" size="small">Small</DSButton>
                  <DSButton variant="save" size="small" icon={<IconSave size={12} />}>Gravar</DSButton>
                  <DSButton variant="danger" size="small" icon={<IconTrash size={12} />}>Excluir</DSButton>
                </div>
              </div>
              <div style={guideBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.cinzaEscuro, fontFamily: FONTS.title }}>Small</span>
                  <code style={guideToken}>height: 30px · font: 12px</code>
                </div>
                <div style={{...guideLabel, marginTop: 14}}>Significado</div>
                <p style={guideText}>O menor botão do sistema. Compacto e discreto, projetado para áreas com pouco espaço vertical.</p>
                <div style={guideLabel}>Onde usar</div>
                <p style={guideText}>Linhas de tabela, barras de ação em listagens, ações inline em cards compactos, filtros e toolbars. Ideal quando há muitos botões em uma mesma linha.</p>
                <div style={guideLabel}>Onde NÃO usar</div>
                <p style={{...guideText, color: C.danger}}>Nunca como ação principal isolada em telas ou modais — fica perdido visualmente. Não usar em CTAs de destaque.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>Botões de ação nas linhas de tabela do App Suprimentos ("Editar", "Excluir"); barra de filtros rápidos no Power BI; ações inline no Kanban do App Ideias.</p>
              </div>
            </div>

            {/* MEDIUM */}
            <div style={{...guideCard, borderLeft: `4px solid ${C.azulProfundo}`}}>
              <div style={guideHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DSButton variant="primary" size="medium">Medium</DSButton>
                  <DSButton variant="save" size="medium" icon={<IconSave />}>Gravar</DSButton>
                  <DSButton variant="ghost" size="medium">Cancelar</DSButton>
                </div>
              </div>
              <div style={guideBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.cinzaEscuro, fontFamily: FONTS.title }}>Medium</span>
                  <code style={guideToken}>height: 36px · font: 13px</code>
                </div>
                <div style={{...guideLabel, marginTop: 14, color: C.cinzaEscuro}}>★ TAMANHO PADRÃO DO SISTEMA</div>
                <p style={guideText}>O tamanho default. Equilibra presença visual com economia de espaço. Se não souber qual escolher, use Medium.</p>
                <div style={guideLabel}>Onde usar</div>
                <p style={guideText}>Formulários, rodapé de modais, barras de ação de páginas, cards de detalhe, toolbars de edição. É o tamanho para 90% dos casos do ecossistema FIPS.</p>
                <div style={guideLabel}>Regra de ouro</div>
                <p style={{...guideText, fontWeight: 600}}>Na dúvida, sempre Medium. Só mude para Small (tabelas) ou Large (destaque) quando houver justificativa clara.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Gravar" e "Cancelar" no rodapé de modais de todos os apps; "Buscar" em telas de consulta; "Salvar alterações" em formulários do SSMA e Contpix.</p>
              </div>
            </div>

            {/* LARGE */}
            <div style={guideCard}>
              <div style={guideHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DSButton variant="primary" size="large">Large</DSButton>
                  <DSButton variant="save" size="large" icon={<IconCheck size={16} />}>Aprovar</DSButton>
                </div>
              </div>
              <div style={guideBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.cinzaEscuro, fontFamily: FONTS.title }}>Large</span>
                  <code style={guideToken}>height: 42px · font: 14px</code>
                </div>
                <div style={{...guideLabel, marginTop: 14}}>Significado</div>
                <p style={guideText}>O maior botão. Presença forte e impossível de ignorar. Reservado para ações de máxima importância.</p>
                <div style={guideLabel}>Onde usar</div>
                <p style={guideText}>CTAs de destaque, telas de login, onboarding, ações finais de fluxos críticos (aprovar, salvar, finalizar). Máximo 1-2 por tela.</p>
                <div style={guideLabel}>Onde NÃO usar</div>
                <p style={{...guideText, color: C.danger}}>Nunca em tabelas ou listagens — ocupa muito espaço. Não usar para ações secundárias. Evitar múltiplos Large na mesma área.</p>
                <div style={guideLabel}>Exemplo FIPS</div>
                <p style={guideExemplo}>"Entrar" na tela de login do portal FIPS; "Submeter ideia" no App Ideias; "Aprovar requisição" (verde) em fluxos finais de aprovação; "Iniciar treinamento" no SSMA.</p>
              </div>
            </div>

          </div>
        </Section>

        <Section number="04" title="Estados" desc="Estados interativos e funcionais. O loading aplica spinner inline e desabilita a ação.">
          <Card>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { label: "Padrão",  props: { variant: "primary" },  text: "Confirmar" },
                { label: "Hover ↗",  props: { variant: "primary" },  text: "Passe o mouse" },
                { label: "Desabilitado", props: { variant: "primary", disabled: true }, text: "Desabilitado" },
                { label: "Carregando",  props: { variant: "primary", loading: true },  text: "Carregando" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title }}>{item.label}</span>
                  <DSButton {...item.props}>{item.text}</DSButton>
                </div>
              ))}
              <Divider />
              {[
                { label: "Desabilitado", props: { variant: "save", disabled: true }, text: "Gravar" },
                { label: "Carregando",  props: { variant: "save", loading: true },  text: "Gravando" },
              ].map((item) => (
                <div key={`s-${item.label}`} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title }}>{item.label}</span>
                  <DSButton {...item.props}>{item.text}</DSButton>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section number="05" title="Composições com ícone" desc="Ícones reforçam a semântica da ação. Posicionados à esquerda do label, tamanho proporcional ao size.">
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <DSButton variant="save" icon={<IconSave />}>Gravar</DSButton>
              <DSButton variant="save" icon={<IconCheck />}>Salvar alterações</DSButton>
              <DSButton variant="secondary" icon={<IconPlus />}>Novo registro</DSButton>
              <DSButton variant="danger" icon={<IconTrash />}>Excluir</DSButton>
              <Divider />
              <DSButton variant="primary" size="small" icon={<IconSave size={12} />}>Gravar</DSButton>
              <DSButton variant="danger" size="small" icon={<IconTrash size={12} />}>Excluir</DSButton>
              <DSButton variant="save" size="large" icon={<IconCheck size={16} />}>Aprovar</DSButton>
              <DSButton variant="accent" size="large">Escalar</DSButton>
            </div>
          </Card>
        </Section>

        <Section number="06" title="Cenários de negócio" desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS.">
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <ScenarioCard title="Barra de ação" desc="Combinações usadas em listagens e formulários operacionais.">
              <DSButton variant="ghost" size="small">Salvar rascunho</DSButton>
              <DSButton variant="save" size="small" icon={<IconCheck size={12} />}>Salvar alterações</DSButton>
              <div style={{ marginLeft: "auto" }}><DSButton variant="accent" size="small">Enviar para aprovação</DSButton></div>
            </ScenarioCard>
            <ScenarioCard title="Rodapé de modal" desc="Cancelar neutro; persistência fica verde para reforçar a ação.">
              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <DSButton variant="ghost" size="small">Cancelar</DSButton>
                <DSButton variant="save" size="small" icon={<IconSave size={12} />}>Salvar</DSButton>
              </div>
            </ScenarioCard>
            <ScenarioCard title="Confirmação destrutiva" desc="Modal de exclusão — ação perigosa em vermelho, cancelar sempre neutro.">
              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <DSButton variant="ghost" size="small">Cancelar</DSButton>
                <DSButton variant="danger" size="small" icon={<IconTrash size={12} />}>Confirmar exclusão</DSButton>
              </div>
            </ScenarioCard>
          </div>
        </Section>

        <Section number="07" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title, marginBottom: 4 }}>Cores primárias</span>
              <TokenRow label="Azul Profundo" value="#004B9B" color={C.azulProfundo} />
              <TokenRow label="Azul Escuro"   value="#002A68" color={C.azulEscuro} />
              <TokenRow label="Cinza Chumbo"  value="#7B8C96" color={C.cinzaChumbo} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title, marginBottom: 4 }}>Cores secundárias</span>
              <TokenRow label="Realce"          value="#FDC24E" color={C.amareloOuro} />
              <TokenRow label="Amarelo Escuro" value="#F6921E" color={C.amareloEscuro} />
              <TokenRow label="Verde Floresta" value="#00C64C" color={C.verdeFloresta} />
              <TokenRow label="Azul Céu"       value="#93BDE4" color={C.azulCeu} />
              <TokenRow label="Perigo"          value="#DC3545" color={C.danger} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title, marginBottom: 4 }}>Tipografia</span>
              <TokenRow label="Títulos" value="Saira Expanded" />
              <TokenRow label="Corpo"   value="Open Sans" />
              <TokenRow label="Código"  value="Fira Code" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: C.textLight, textTransform: "uppercase", fontFamily: FONTS.title, marginBottom: 4 }}>Dimensões</span>
              <TokenRow label="Radius"     value="6px" />
              <TokenRow label="Height SM"  value="30px" />
              <TokenRow label="Height MD"  value="36px" />
              <TokenRow label="Height LG"  value="42px" />
              <TokenRow label="Transition" value="0.18s ease" />
            </div>
          </Card>
        </Section>

        <Section number="08" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {token:"Primary bg",light:"#004B9B",dark:"#1A6FC4"},
                {token:"Primary hover",light:"#002A68",dark:"#2080D6"},
                {token:"Primary text",light:"#FFFFFF",dark:"#FFFFFF"},
                {token:"Outline border",light:"#004B9B",dark:"#93BDE4"},
                {token:"Outline hover bg",light:"#D3E3F4",dark:"rgba(147,189,228,0.15)"},
                {token:"Secondary bg",light:"#F1F5F9",dark:"#2A2A2A"},
                {token:"Secondary text",light:"#333B41",dark:"#E2E2E8"},
                {token:"Ghost hover",light:"rgba(211,227,244,0.53)",dark:"rgba(147,189,228,0.12)"},
                {token:"Save bg",light:"#00C64C",dark:"#00A83E"},
                {token:"Danger bg",light:"#DC3545",dark:"#E04050"},
                {token:"Disabled bg",light:"#C0CCD2",dark:"#3A3A3A"},
                {token:"Disabled text",light:"#7B8C96",dark:"#6B6B6B"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:`1px solid ${C.cardBorder}`,background:C.bg}}>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    <span style={{width:16,height:16,borderRadius:4,background:r.light,border:"1px solid rgba(0,0,0,0.1)"}}/>
                    <span style={{width:16,height:16,borderRadius:4,background:r.dark,border:"1px solid rgba(255,255,255,0.1)"}}/>
                  </div>
                  <div>
                    <span style={{fontSize:12,fontWeight:600,color:C.cinzaEscuro,display:"block"}}>{r.token}</span>
                    <span style={{fontSize:10,fontFamily:"'Fira Code',monospace",color:C.cinzaChumbo}}>{r.light} → {r.dark}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <CodeExportSection items={[{
          label: "Button (completo)",
          description: "Componente completo com todas as variantes, tamanhos e estados.",
          code: buttonExportCode,
        }]} />

        <div style={{ textAlign: "center", padding: "20px 0 0", borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: "0.5px", fontFamily: FONTS.title, fontWeight: 400 }}>
            DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
