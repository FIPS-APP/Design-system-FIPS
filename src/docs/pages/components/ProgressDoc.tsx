import { useState, useEffect } from "react";
import { CodeExportSection } from '../../components/CodeExport';
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground';

/* ═══════════════════════════════════════════
   FIPS DESIGN SYSTEM — BRAND TOKENS
   ═══════════════════════════════════════════ */
const C = {
  azulProfundo:"var(--color-gov-azul-profundo)", azulEscuro:"var(--color-gov-azul-escuro)", azulClaro:"var(--color-gov-azul-claro)",
  cinzaChumbo:"var(--color-fg-muted)", cinzaEscuro:"var(--color-fg)", cinzaClaro:"#C0CCD2",
  azulCeu:"#93BDE4", azulCeuClaro:"#D3E3F4",
  amareloOuro:"#FDC24E", amareloEscuro:"#F6921E",
  verdeFloresta:"#00C64C", verdeEscuro:"#00904C",
  danger:"#DC3545", dangerBg:"#FEF2F2",
  neutro:"var(--color-surface-soft)", branco:"#FFFFFF",
  bg:"var(--color-surface-muted)", cardBg:"var(--color-surface)", cardBorder:"var(--color-border)",
  textMuted:"var(--color-fg-muted)", textLight:"var(--color-fg-muted)",
  trilho:"#E2E8F0",
};
const F = { title:"'Saira Expanded',sans-serif", body:"'Open Sans',sans-serif", mono:"'Fira Code',monospace" };

/* Cor automatica por faixa de % */
function autoColor(v: number) {
  if (v >= 100) return C.verdeEscuro;
  if (v >= 90)  return C.verdeFloresta;
  if (v >= 60)  return C.amareloOuro;
  if (v >= 30)  return C.amareloEscuro;
  if (v >= 1)   return C.danger;
  return C.trilho;
}

/* ═══════════════════════════════════════════ JUNCTION LINES ═══════════════════════════════════════════ */
function JunctionLines({style}: {style?: React.CSSProperties}){
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{opacity:.12,...style}}>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 170H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
      <path d="M0 20H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS BAR — LINEAR
   ═══════════════════════════════════════════ */
function ProgressBar({ value = 0, label, helper, size = "md", color, showPercent = true, indeterminate = false, animated = true }: {
  value?: number; label?: string; helper?: string; size?: "sm"|"md"|"lg"; color?: string; showPercent?: boolean; indeterminate?: boolean; animated?: boolean;
}) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (!indeterminate && animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else {
      setAnimVal(value);
    }
  }, [value, indeterminate, animated]);

  const sizeMap = { sm: { h: 4, r: 2 }, md: { h: 8, r: 4 }, lg: { h: 12, r: 6 } };
  const s = sizeMap[size] || sizeMap.md;

  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && <span style={{ fontSize: 13, fontWeight: 600, color: C.cinzaEscuro, fontFamily: F.body }}>{label}</span>}
          {showPercent && !indeterminate && <span style={{ fontSize: 12, fontWeight: 600, color: C.cinzaChumbo, fontFamily: F.mono }}>{Math.round(animVal)}%</span>}
          {indeterminate && <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>Processando...</span>}
        </div>
      )}
      <div style={{ width: "100%", height: s.h, borderRadius: s.r, background: C.trilho, overflow: "hidden", position: "relative" }}>
        {indeterminate ? (
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "40%", borderRadius: s.r, background: barColor, animation: "dsIndeterminate 1.5s ease-in-out infinite" }} />
        ) : (
          <div style={{ height: "100%", width: `${animVal}%`, borderRadius: s.r, background: barColor, transition: animated ? "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none" }} />
        )}
      </div>
      {helper && <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>{helper}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS RING — CIRCULAR
   ═══════════════════════════════════════════ */
function ProgressRing({ value = 0, size = 80, strokeWidth = 6, color, label, animated = true }: {
  value?: number; size?: number; strokeWidth?: number; color?: string; label?: string; animated?: boolean;
}) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else { setAnimVal(value); }
  }, [value, animated]);

  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animVal / 100) * circ;
  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.trilho} strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={barColor} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: animated ? "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" : "none" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.mono }}>{Math.round(animVal)}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: C.cinzaEscuro, fontFamily: F.body, textAlign: "center" }}>{label}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS STEPS — WIZARD
   ═══════════════════════════════════════════ */
function ProgressSteps({ steps = [], current = 0, compact = false }: {
  steps?: string[]; current?: number; compact?: boolean;
}) {
  const dotSz = compact ? 22 : 28;
  const checkSz = compact ? 11 : 14;
  const numSz = compact ? 10 : 12;
  const lblSz = compact ? 9 : 11;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", overflowX: "auto" }}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const dotColor = done ? C.verdeEscuro : active ? C.azulProfundo : C.trilho;
        const textColor = done ? C.verdeEscuro : active ? C.azulProfundo : C.textLight;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none", minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: compact ? 44 : 60, flexShrink: 0 }}>
              <div style={{ width: dotSz, height: dotSz, borderRadius: "50%", background: dotColor, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s", border: active ? `2px solid ${C.azulProfundo}` : "2px solid transparent" }}>
                {done ? (
                  <svg width={checkSz} height={checkSz} viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={C.branco} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span style={{ fontSize: numSz, fontWeight: 700, color: active ? C.branco : C.cinzaChumbo, fontFamily: F.mono }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: lblSz, fontWeight: active ? 700 : 500, color: textColor, fontFamily: F.body, textAlign: "center", lineHeight: 1.2, maxWidth: compact ? 50 : 80, wordBreak: "break-word" }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, minWidth: 12, background: done ? C.verdeEscuro : C.trilho, margin: "0 4px", marginBottom: compact ? 16 : 20, transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MICRO PROGRESS — INLINE BADGE
   ═══════════════════════════════════════════ */
function MicroProgress({ value = 0, width = 60 }: { value?: number; width?: number }) {
  const color = autoColor(value);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <div style={{ width, height: 4, borderRadius: 2, background: C.trilho, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, borderRadius: 2, background: color, transition: "width .5s ease" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, fontFamily: F.mono }}>{value}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.azulClaro, fontFamily: F.title, marginBottom: 6 }}>{n}</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.title, letterSpacing: ".5px" }}>{title}</h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: "0 0 20px", lineHeight: 1.55, fontFamily: F.body }}>{desc}</p>
      {children}
    </section>
  );
}

function Card({ children, s, mob: m }: { children: React.ReactNode; s?: React.CSSProperties; mob?: boolean }) {
  return (
    <div style={{ background: C.cardBg, borderRadius: "12px 12px 12px 24px", border: `1px solid ${C.cardBorder}`, padding: m ? 16 : 28, boxShadow: "0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)", ...s }}>
      {children}
    </div>
  );
}

const gc: React.CSSProperties = { background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 18px", overflow: "hidden" };
const gh: React.CSSProperties = { padding: "16px 20px", background: C.bg, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 12 };
const gb: React.CSSProperties = { padding: "16px 20px 20px" };
const gl: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: C.azulClaro, fontFamily: F.title, marginBottom: 4, marginTop: 12 };
const gt: React.CSSProperties = { fontSize: 13, color: C.cinzaEscuro, lineHeight: 1.55, margin: 0, fontFamily: F.body };
const ge: React.CSSProperties = { fontSize: 12, color: C.cinzaChumbo, lineHeight: 1.5, margin: 0, fontFamily: F.body, fontStyle: "italic", paddingLeft: 10, borderLeft: `2px solid ${C.azulCeuClaro}` };
const gk: React.CSSProperties = { fontSize: 11, fontFamily: F.mono, color: C.cinzaChumbo, background: C.cardBg, padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.cardBorder}` };

function TokenRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontFamily: F.body }}>
      {color && <div style={{ width: 16, height: 16, borderRadius: 4, background: color, border: `1px solid ${C.cardBorder}`, flexShrink: 0 }} />}
      <span style={{ color: C.cinzaChumbo, minWidth: 110 }}>{label}</span>
      <code style={{ background: C.neutro, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontFamily: F.mono, color: C.cinzaEscuro }}>{value}</code>
    </div>
  );
}

const progressExportCode = `// DS-FIPS — Progress — Copy-paste ready
import { useState, useEffect } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  fg: "#333B41",
  fgMuted: "#7B8C96",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E2E8F0",
  branco: "#FFFFFF",
  danger: "#DC3545",
  verdeFloresta: "#00C64C",
  verdeEscuro: "#00904C",
  amareloOuro: "#FDC24E",
  amareloEscuro: "#F6921E",
  trilho: "#E2E8F0",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

function autoColor(v: number) {
  if (v >= 100) return C.verdeEscuro;
  if (v >= 90)  return C.verdeFloresta;
  if (v >= 60)  return C.amareloOuro;
  if (v >= 30)  return C.amareloEscuro;
  if (v >= 1)   return C.danger;
  return C.trilho;
}

interface ProgressBarProps {
  value?: number;
  label?: string;
  helper?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  showPercent?: boolean;
  indeterminate?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value = 0, label, helper, size = "md", color,
  showPercent = true, indeterminate = false, animated = true,
}: ProgressBarProps) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (!indeterminate && animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else { setAnimVal(value); }
  }, [value, indeterminate, animated]);

  const sizeMap = { sm: { h: 4, r: 2 }, md: { h: 8, r: 4 }, lg: { h: 12, r: 6 } };
  const s = sizeMap[size] || sizeMap.md;
  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && <span style={{ fontSize: 13, fontWeight: 600, color: C.fg, fontFamily: Fn.body }}>{label}</span>}
          {showPercent && !indeterminate && <span style={{ fontSize: 12, fontWeight: 600, color: C.fgMuted, fontFamily: Fn.mono }}>{Math.round(animVal)}%</span>}
          {indeterminate && <span style={{ fontSize: 11, color: C.fgMuted, fontFamily: Fn.body }}>Processando...</span>}
        </div>
      )}
      <div style={{ width: "100%", height: s.h, borderRadius: s.r, background: C.trilho, overflow: "hidden", position: "relative" }}>
        {indeterminate ? (
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "40%", borderRadius: s.r, background: barColor, animation: "dsIndeterminate 1.5s ease-in-out infinite" }} />
        ) : (
          <div style={{ height: "100%", width: \`\${animVal}%\`, borderRadius: s.r, background: barColor, transition: animated ? "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none" }} />
        )}
      </div>
      {helper && <span style={{ fontSize: 11, color: C.fgMuted, fontFamily: Fn.body }}>{helper}</span>}
    </div>
  );
}

interface ProgressRingProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  animated?: boolean;
}

export function ProgressRing({ value = 0, size = 80, strokeWidth = 6, color, label, animated = true }: ProgressRingProps) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else { setAnimVal(value); }
  }, [value, animated]);

  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animVal / 100) * circ;
  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.trilho} strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={barColor} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: animated ? "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" : "none" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 700, color: C.fg, fontFamily: Fn.mono }}>{Math.round(animVal)}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: C.fg, fontFamily: Fn.body, textAlign: "center" }}>{label}</span>}
    </div>
  );
}

// Inject this style for indeterminate animation:
// @keyframes dsIndeterminate { 0% { left: -40%; } 100% { left: 100%; } }

// Usage:
// <ProgressBar value={68} label="Conferencia" helper="Maior parte ja preenchida." />
// <ProgressBar value={100} label="Finalizado" color="#00904C" />
// <ProgressBar indeterminate label="Processando..." />
// <ProgressRing value={92} size={80} label="SLA" />
`;

/* ═══════════════════════════════════════════ CODE HELPERS ═══════════════════════════════════════════ */

function progressBarCode(value: number, label: string, opts?: { size?: string; color?: string; helper?: string; indeterminate?: boolean }): string {
  const props: string[] = [];
  if (opts?.indeterminate) {
    props.push(`indeterminate`);
  } else {
    props.push(`value={${value}}`);
  }
  props.push(`label="${label}"`);
  if (opts?.helper) props.push(`helper="${opts.helper}"`);
  if (opts?.size && opts.size !== "md") props.push(`size="${opts.size}"`);
  if (opts?.color) props.push(`color="${opts.color}"`);

  return `// DS-FIPS — ProgressBar "${label}" — Copy-paste ready
import { useState, useEffect } from "react";

function autoColor(v: number) {
  if (v >= 100) return "#00904C";
  if (v >= 90)  return "#00C64C";
  if (v >= 60)  return "#FDC24E";
  if (v >= 30)  return "#F6921E";
  if (v >= 1)   return "#DC3545";
  return "#E2E8F0";
}

export function ProgressBar({ value = 0, label, helper, size = "md", color, showPercent = true, indeterminate = false, animated = true }: {
  value?: number; label?: string; helper?: string; size?: "sm"|"md"|"lg"; color?: string; showPercent?: boolean; indeterminate?: boolean; animated?: boolean;
}) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (!indeterminate && animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else { setAnimVal(value); }
  }, [value, indeterminate, animated]);

  const sizeMap = { sm: { h: 4, r: 2 }, md: { h: 8, r: 4 }, lg: { h: 12, r: 6 } };
  const s = sizeMap[size] || sizeMap.md;
  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {label && <span style={{ fontSize: 13, fontWeight: 600, color: "#333B41", fontFamily: "'Open Sans',sans-serif" }}>{label}</span>}
          {showPercent && !indeterminate && <span style={{ fontSize: 12, fontWeight: 600, color: "#7B8C96", fontFamily: "'Fira Code',monospace" }}>{Math.round(animVal)}%</span>}
        </div>
      )}
      <div style={{ width: "100%", height: s.h, borderRadius: s.r, background: "#E2E8F0", overflow: "hidden", position: "relative" }}>
        {indeterminate ? (
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "40%", borderRadius: s.r, background: barColor, animation: "dsIndeterminate 1.5s ease-in-out infinite" }} />
        ) : (
          <div style={{ height: "100%", width: \`\${animVal}%\`, borderRadius: s.r, background: barColor, transition: animated ? "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none" }} />
        )}
      </div>
      {helper && <span style={{ fontSize: 11, color: "#7B8C96", fontFamily: "'Open Sans',sans-serif" }}>{helper}</span>}
    </div>
  );
}

// Usage:
<ProgressBar ${props.join(" ")} />`;
}

function progressRingCode(value: number, label: string, opts?: { size?: number; strokeWidth?: number; color?: string }): string {
  const props: string[] = [`value={${value}}`];
  if (opts?.size && opts.size !== 80) props.push(`size={${opts.size}}`);
  if (opts?.strokeWidth && opts.strokeWidth !== 6) props.push(`strokeWidth={${opts.strokeWidth}}`);
  if (opts?.color) props.push(`color="${opts.color}"`);
  if (label) props.push(`label="${label}"`);

  return `// DS-FIPS — ProgressRing "${label}" — Copy-paste ready
import { useState, useEffect } from "react";

function autoColor(v: number) {
  if (v >= 100) return "#00904C";
  if (v >= 90)  return "#00C64C";
  if (v >= 60)  return "#FDC24E";
  if (v >= 30)  return "#F6921E";
  if (v >= 1)   return "#DC3545";
  return "#E2E8F0";
}

export function ProgressRing({ value = 0, size = 80, strokeWidth = 6, color, label, animated = true }: {
  value?: number; size?: number; strokeWidth?: number; color?: string; label?: string; animated?: boolean;
}) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setAnimVal(value), 100);
      return () => clearTimeout(t);
    } else { setAnimVal(value); }
  }, [value, animated]);

  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animVal / 100) * circ;
  const barColor = color || autoColor(animVal);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={barColor} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: animated ? "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" : "none" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 700, color: "#333B41", fontFamily: "'Fira Code',monospace" }}>{Math.round(animVal)}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 12, fontWeight: 600, color: "#333B41", fontFamily: "'Open Sans',sans-serif", textAlign: "center" }}>{label}</span>}
    </div>
  );
}

// Usage:
<ProgressRing ${props.join(" ")} />`;
}

function progressStepsCode(steps: string[], current: number): string {
  const stepsStr = `["${steps.join('", "')}"]`;
  return `// DS-FIPS — ProgressSteps — Copy-paste ready
import React from "react";

export function ProgressSteps({ steps = [], current = 0 }: { steps?: string[]; current?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const dotColor = done ? "#00904C" : active ? "#004B9B" : "#E2E8F0";
        const textColor = done ? "#00904C" : active ? "#004B9B" : "#7B8C96";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 60, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: dotColor, display: "flex", alignItems: "center", justifyContent: "center", border: active ? "2px solid #004B9B" : "2px solid transparent" }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#fff" : "#7B8C96", fontFamily: "'Fira Code',monospace" }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: textColor, fontFamily: "'Open Sans',sans-serif", textAlign: "center" }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, minWidth: 12, background: done ? "#00904C" : "#E2E8F0", margin: "0 4px", marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Usage:
<ProgressSteps steps={${stepsStr}} current={${current}} />`;
}

function microProgressCode(value: number, width?: number): string {
  const wProp = width && width !== 60 ? ` width={${width}}` : '';
  return `// DS-FIPS — MicroProgress — Copy-paste ready
import React from "react";

function autoColor(v: number) {
  if (v >= 100) return "#00904C";
  if (v >= 90)  return "#00C64C";
  if (v >= 60)  return "#FDC24E";
  if (v >= 30)  return "#F6921E";
  if (v >= 1)   return "#DC3545";
  return "#E2E8F0";
}

export function MicroProgress({ value = 0, width = 60 }: { value?: number; width?: number }) {
  const color = autoColor(value);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <div style={{ width, height: 4, borderRadius: 2, background: "#E2E8F0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: \`\${value}%\`, borderRadius: 2, background: color, transition: "width .5s ease" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color, fontFamily: "'Fira Code',monospace" }}>{value}%</span>
    </div>
  );
}

// Usage:
<MicroProgress value={${value}}${wProp} />`;
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function ProgressDoc() {
  const [demoVal, setDemoVal] = useState(55);
  const [stepIdx, setStepIdx] = useState(2);

  // Responsive hook
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const mob = w < 640;
  const tab = w < 900;
  const xl = w >= 1400;
  const xxl = w >= 1800;

  return (
    <PlaygroundProvider>
    <div style={{ minHeight: "100vh", background: "var(--color-surface-muted)", fontFamily: F.body, color: C.cinzaEscuro }}>
      <style>{`
@keyframes dsIndeterminate {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: ${C.trilho}; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${C.azulProfundo}; cursor: pointer; border: 2px solid ${C.branco}; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
      `}</style>

      {/* HEADER */}
      <header style={{ background: `linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`, padding: mob ? "32px 20px 30px" : xl ? "56px 56px 52px" : "48px 40px 44px", position: "relative", overflow: "hidden" }}>
        <JunctionLines style={{ position: "absolute", top: -10, right: -20, width: mob ? 250 : 400, height: 250 }} />
        <JunctionLines style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 200, transform: 'scaleX(-1)' }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.branco}10`, border: `1px solid ${C.branco}18`, borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C.amareloOuro, fontFamily: F.title, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro} /><rect x="9" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".5" /><rect x="1" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".5" /><rect x="9" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".3" /></svg>
            Design System FIPS
          </div>
          <h1 style={{ fontSize: mob ? 30 : 44, fontWeight: 700, color: C.branco, margin: "0 0 10px", fontFamily: F.title, letterSpacing: "1px" }}>Progress</h1>
          <p style={{ fontSize: 16, color: `${C.branco}B0`, lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: F.body }}>
            Barra de progresso para workflows, checklists e indicadores de preenchimento. Mantém hierarquia visual leve, com trilho suave e preenchimento institucional.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { l: "linear", c: C.azulProfundo }, { l: "circular", c: C.azulCeu },
              { l: "steps", c: C.verdeEscuro }, { l: "micro", c: C.amareloEscuro },
            ].map(t => (
              <div key={t.l} style={{ display: "flex", alignItems: "center", gap: 8, background: `${C.branco}08`, border: `1px solid ${C.branco}15`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: `${C.branco}90`, fontFamily: F.mono }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: t.c, border: `1px solid ${C.branco}20`, flexShrink: 0 }} />{t.l}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ padding: mob ? "24px 16px 40px" : xl ? "44px 56px 60px" : "36px 40px 60px", maxWidth: xxl ? 1600 : xl ? 1320 : 1100, margin: "0 auto" }}>

        {/* 01 — PLAYGROUND */}
        <Section n="01" title="Playground interativo" desc="Arraste o slider para testar a barra de progresso em tempo real com todas as variantes sincronizadas.">
          <Card mob={mob}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.cinzaChumbo, fontFamily: F.body, minWidth: 60 }}>Valor:</span>
                <input type="range" min="0" max="100" value={demoVal} onChange={e => setDemoVal(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.mono, minWidth: 50, textAlign: "right" }}>{demoVal}%</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : xl ? "1fr 240px" : "1fr 200px", gap: mob ? 20 : xl ? 48 : 32, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <ProgressBar value={demoVal} label="Linear grande" size="lg" />
                <ProgressBar value={demoVal} label="Linear médio" size="md" />
                <ProgressBar value={demoVal} label="Linear pequeno" size="sm" />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ProgressRing value={demoVal} size={mob ? 72 : 100} strokeWidth={mob ? 6 : 8} />
              </div>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 24, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.cinzaChumbo }}>Micro inline:</span>
              <MicroProgress value={demoVal} />
              <MicroProgress value={demoVal} width={100} />
            </div>
          </Card>
        </Section>

        {/* 02 — VARIANTES */}
        <Section n="02" title="Variantes do sistema" desc="Quatro variantes de progresso para contextos diferentes. Clique em qualquer demo para copiar o código pronto para uso.">
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : xl ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 16 }}>
            {/* LINEAR */}
            <div style={{ ...gc, borderLeft: `4px solid ${C.azulProfundo}` }}>
              <div style={gh}><span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Linear (barra)</span><code style={gk}>&#9733; padrão</code></div>
              <div style={gb}>
                <Copyable label="ProgressBar Linear" code={progressBarCode(68, "Conferência", { helper: "Maior parte do fluxo já preenchida." })} preview={<ProgressBar value={68} label="Conferência" helper="Maior parte do fluxo já preenchida." />}>
                  <ProgressBar value={68} label="Conferência" helper="Maior parte do fluxo já preenchida." />
                </Copyable>
                <div style={{ ...gl, marginTop: 14, color: C.cinzaEscuro }}>&#9733; VARIANTE PADRÃO</div>
                <p style={gt}>Barra horizontal com trilho, preenchimento animado, label e porcentagem. A mais versátil e usada.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Indicadores de preenchimento, progresso de upload, status de workflow, checklists de cadastro.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Preenchimento de cadastro no App Visitante; progresso de requisição no Suprimentos; indicador de completude no SSMA.</p>
              </div>
            </div>

            {/* CIRCULAR */}
            <div style={gc}>
              <div style={gh}><span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Circular (ring)</span><code style={gk}>dashboards</code></div>
              <div style={{ ...gb, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  <Copyable label="ProgressRing Preparação" code={progressRingCode(22, "Preparação", { size: 64, strokeWidth: 5 })} preview={<ProgressRing value={22} size={64} strokeWidth={5} label="Preparação" />}>
                    <ProgressRing value={22} size={64} strokeWidth={5} label="Preparação" />
                  </Copyable>
                  <Copyable label="ProgressRing Finalizado" code={progressRingCode(100, "Finalizado", { size: 64, strokeWidth: 5 })} preview={<ProgressRing value={100} size={64} strokeWidth={5} label="Finalizado" />}>
                    <ProgressRing value={100} size={64} strokeWidth={5} label="Finalizado" />
                  </Copyable>
                </div>
                <div style={gl}>Significado</div>
                <p style={gt}>Ring compacto com porcentagem centralizada. Forte impacto visual em espaço pequeno.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Dashboards, cards de KPI, indicadores em cabeçalhos. Ideal para comparar múltiplos indicadores lado a lado.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Dashboard de metas no Power BI; card de performance OKR; indicador de SLA no App Ocorrências.</p>
              </div>
            </div>

            {/* STEPS */}
            <div style={gc}>
              <div style={gh}><span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Steps (wizard)</span><code style={gk}>fluxos multi-etapa</code></div>
              <div style={gb}>
                <Copyable label="ProgressSteps Wizard" code={progressStepsCode(["Dados", "Revisão", "Aprovação", "Concluído"], 2)} preview={<ProgressSteps steps={["Dados", "Revisão", "Aprovação", "Concluído"]} current={2} />}>
                  <ProgressSteps compact={mob} steps={["Dados", "Revisão", "Aprovação", "Concluído"]} current={2} />
                </Copyable>
                <div style={{ ...gl, marginTop: 16 }}>Significado</div>
                <p style={gt}>Navegação por etapas com indicador de etapa atual, concluídas (check verde) e pendentes.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Fluxos de cadastro multi-step, wizards de configuração, processos de aprovação com etapas definidas.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Fluxo de requisição de contratação (4 etapas); onboarding de visitante; wizard de configuração de alerta no SSMA.</p>
              </div>
            </div>

            {/* MICRO */}
            <div style={gc}>
              <div style={gh}><span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Micro (inline)</span><code style={gk}>tabelas e cards</code></div>
              <div style={gb}>
                <Copyable label="MicroProgress Inline" code={microProgressCode(85)} preview={<MicroProgress value={85} />}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: C.cinzaEscuro }}>Requisição #4021</span>
                    <MicroProgress value={30} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: C.cinzaEscuro }}>Requisição #4022</span>
                    <MicroProgress value={85} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: C.cinzaEscuro }}>Requisição #4023</span>
                    <MicroProgress value={100} />
                  </div>
                </div>
                </Copyable>
                <div style={{ ...gl, marginTop: 14 }}>Significado</div>
                <p style={gt}>Mini barra com porcentagem inline. Mínimo impacto visual, máxima densidade de informação.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Linhas de tabela, cards de listagem, badges em listas. Onde espaço é limitado mas progresso importa.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Coluna "Progresso" em tabelas do App Suprimentos; cards de requisição no Kanban do App Ideias.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 03 — ESTADOS */}
        <Section n="03" title="Estados" desc="Cada estado comunica uma etapa diferente do progresso. As barras animam automaticamente ao carregar.">
          <Card mob={mob}>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : xl ? "1fr 1fr 1fr" : "1fr 1fr", gap: "24px 32px" }}>
              <ProgressBar value={0} label="Vazio" helper="Nenhum campo preenchido. Processo não iniciado." size="md" />
              <ProgressBar value={22} label="Preparação" helper="Campos essenciais ainda pendentes." size="md" />
              <ProgressBar value={68} label="Conferência" helper="Maior parte do fluxo já preenchida." size="md" />
              <ProgressBar value={100} label="Finalizado" helper="Entregável pronto para revisão final." size="md" color={C.verdeEscuro} />
              <ProgressBar value={45} label="Atenção" helper="Prazo se aproximando. Ação necessária." size="md" color={C.amareloEscuro} />
              <ProgressBar value={30} label="Erro / bloqueado" helper="Processo travado. Intervenção manual necessária." size="md" color={C.danger} />
              <div style={{ gridColumn: mob ? "span 1" : xl ? "span 3" : "span 2" }}>
                <ProgressBar indeterminate label="Indeterminado" helper="Processando... tempo estimado desconhecido." size="md" />
              </div>
            </div>
          </Card>
        </Section>

        {/* 04 — CORES CONTEXTUAIS */}
        <Section n="04" title="Faixas de cor automática" desc="A cor do preenchimento muda automaticamente com base na porcentagem. Progressão: Vermelho → Laranja → Amarelo → Verde.">
          <Card mob={mob} s={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", height: 40, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.cardBorder}` }}>
                {[
                  { w: "29%", c: C.danger, l: "1–29%" },
                  { w: "30%", c: C.amareloEscuro, l: "30–59%" },
                  { w: "30%", c: C.amareloOuro, l: "60–89%" },
                  { w: "10%", c: C.verdeFloresta, l: "90–99%" },
                  { w: "1%", c: C.verdeEscuro, l: "100%" },
                ].map((f, i) => (
                  <div key={i} style={{ width: f.w, background: f.c, display: "flex", alignItems: "center", justifyContent: "center", borderRight: i < 4 ? `2px solid ${C.branco}` : "none" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.branco, fontFamily: F.mono, textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>{f.l}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: C.danger, fontFamily: F.mono, fontWeight: 600 }}>Crítico</span>
                <span style={{ fontSize: 10, color: C.amareloEscuro, fontFamily: F.mono, fontWeight: 600 }}>Em progresso</span>
                <span style={{ fontSize: 10, color: C.amareloOuro, fontFamily: F.mono, fontWeight: 600 }}>Bom andamento</span>
                <span style={{ fontSize: 10, color: C.verdeFloresta, fontFamily: F.mono, fontWeight: 600 }}>Quase lá</span>
                <span style={{ fontSize: 10, color: C.verdeEscuro, fontFamily: F.mono, fontWeight: 600 }}>Completo</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3, 1fr)" : "1fr 1fr 1fr 1fr 1fr", gap: 12 }}>
              {[10, 45, 75, 95, 100].map(v => (
                <div key={v} style={{ textAlign: "center" }}>
                  <ProgressRing value={v} size={mob ? 44 : 56} strokeWidth={mob ? 4 : 5} animated={false} />
                  <div style={{ marginTop: 6 }}><MicroProgress value={v} width={50} /></div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: xl ? 16 : 12 }}>
            {[
              { range: "1–29%", pv: 15, color: C.danger, hex: "#DC3545", name: "Vermelho", desc: "Processo no início ou em estado crítico. Pouco progresso, ação urgente.", ex: "Cadastro com 1 de 8 campos; requisição recém-criada." },
              { range: "30–59%", pv: 45, color: C.amareloEscuro, hex: "#F6921E", name: "Laranja", desc: "Em andamento, mas ainda longe do fim. Progresso parcial, atenção necessária.", ex: "Metade dos campos preenchidos; workflow aguardando análise." },
              { range: "60–89%", pv: 75, color: C.amareloOuro, hex: "#FDC24E", name: "Amarelo Ouro", desc: "Bom andamento. Maior parte concluída, falta pouco para finalizar.", ex: "Formulário quase completo; aprovação em fase final." },
              { range: "90–99%", pv: 95, color: C.verdeFloresta, hex: "#00C64C", name: "Verde Floresta", desc: "Quase lá. Faltam detalhes mínimos para completar.", ex: "Falta 1 campo opcional; revisão final pendente." },
              { range: "100%", pv: 100, color: C.verdeEscuro, hex: "#00904C", name: "Verde Escuro", desc: "Completo. Meta atingida, processo finalizado com sucesso.", ex: "Cadastro completo; requisição aprovada; checklist finalizado." },
            ].map(f => (
              <div key={f.range} style={{ ...gc, borderTop: `4px solid ${f.color}` }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: f.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>{f.name}</span>
                  </div>
                  <code style={{ ...gk, display: "inline-block", marginBottom: 8 }}>{f.range} · {f.hex}</code>
                  <ProgressBar value={f.pv} color={f.color} showPercent={false} size="sm" animated={false} />
                  <p style={{ ...gt, marginTop: 8, fontSize: 12 }}>{f.desc}</p>
                  <div style={{ ...gl, marginTop: 8 }}>Exemplo FIPS</div>
                  <p style={ge}>{f.ex}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, background: `${C.azulCeuClaro}40`, border: `1px solid ${C.azulCeuClaro}`, borderRadius: 12, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.azulProfundo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <span style={{ color: C.branco, fontSize: 12, fontWeight: 700 }}>i</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.body }}>Cor automática é o padrão. Override manual é permitido.</p>
              <p style={{ fontSize: 13, color: C.cinzaChumbo, margin: 0, lineHeight: 1.5, fontFamily: F.body }}>
                A função <code style={{ background: C.neutro, padding: "1px 6px", borderRadius: 4, fontSize: 12, fontFamily: F.mono }}>autoColor(valor)</code> aplica a cor automaticamente. Para casos especiais (erro de sistema, bloqueio manual), use o prop <code style={{ background: C.neutro, padding: "1px 6px", borderRadius: 4, fontSize: 12, fontFamily: F.mono }}>color</code> para forçar uma cor específica.
              </p>
            </div>
          </div>
        </Section>

        {/* 05 — TAMANHOS */}
        <Section n="05" title="Tamanhos" desc="Três alturas de trilho para diferentes contextos de uso.">
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: xl ? 20 : 16 }}>
            {[
              { size: "sm" as const, h: "4px", name: "Pequeno", desc: "Tabelas, cards, barras de status discretas. Mínimo impacto visual.", ex: "Coluna de progresso em tabelas do Suprimentos." },
              { size: "md" as const, h: "8px", name: "Médio", desc: "Formulários, workflows, dashboards. Equilíbrio entre visibilidade e espaço.", ex: "Indicador de preenchimento em cadastros. ★ Padrão.", accent: true },
              { size: "lg" as const, h: "12px", name: "Grande", desc: "Destaque em dashboards, painéis de status, telas de upload.", ex: "Painel de status operacional do PCX; upload de documentos." },
            ].map(s => (
              <div key={s.name} style={{ ...gc, ...(s.accent ? { borderLeft: `4px solid ${C.azulProfundo}` } : {}) }}>
                <div style={gh}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>{s.name}</span>
                  <code style={gk}>height: {s.h}</code>
                </div>
                <div style={gb}>
                  <ProgressBar value={68} size={s.size} label="Conferência" />
                  <div style={{ ...gl, marginTop: 14 }}>{s.accent ? "★ TAMANHO PADRÃO" : "Significado"}</div>
                  <p style={gt}>{s.desc}</p>
                  <div style={gl}>Exemplo FIPS</div>
                  <p style={ge}>{s.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 06 — STEPS INTERATIVO */}
        <Section n="06" title="Steps interativo" desc="Clique nos botões para navegar entre etapas do wizard. Cada etapa concluída ganha check verde.">
          <Card mob={mob}>
            <ProgressSteps compact={mob} steps={["Identificação", "Dados do veículo", "Revisão", "Aprovação", "Concluído"]} current={stepIdx} />
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "center" }}>
              <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} style={{ padding: "7px 18px", fontSize: 13, border: `1.5px solid ${C.cardBorder}`, borderRadius: 6, background: "transparent", color: C.cinzaChumbo, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>Voltar</button>
              <button onClick={() => setStepIdx(Math.min(4, stepIdx + 1))} style={{ padding: "7px 18px", fontSize: 13, border: "none", borderRadius: 6, background: C.azulProfundo, color: C.branco, cursor: "pointer", fontFamily: F.body, fontWeight: 600 }}>Avançar</button>
            </div>
          </Card>
        </Section>

        {/* 07 — CENÁRIOS DE NEGÓCIO */}
        <Section n="07" title="Cenários de negócio" desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS.">
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : xl ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: xl ? 20 : 16 }}>
            {/* Workflow de aprovação */}
            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 20px", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.title }}>Workflow de aprovação</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "0 0 16px", fontFamily: F.body }}>App Suprimentos — fluxo de requisição</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <ProgressSteps compact={mob} steps={["Solicitação", "Análise", "Aprovação", "Compra"]} current={1} />
                <ProgressBar value={35} label="Progresso geral" helper="Aguardando análise do gestor." size="sm" />
              </div>
            </div>

            {/* Dashboard de KPIs */}
            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 20px", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.title }}>Dashboard de KPIs</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "0 0 16px", fontFamily: F.body }}>Power BI — indicadores operacionais</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: "flex", justifyContent: "space-around" }}>
                <ProgressRing value={92} size={mob ? 56 : 72} strokeWidth={6} label="SLA" />
                <ProgressRing value={67} size={mob ? 56 : 72} strokeWidth={6} label="OKR Q2" />
                <ProgressRing value={41} size={mob ? 56 : 72} strokeWidth={6} label="Treinamento" color={C.amareloEscuro} />
              </div>
            </div>

            {/* Listagem com micro */}
            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 20px", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.title }}>Tabela com micro progress</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "0 0 16px", fontFamily: F.body }}>App Ocorrências — listagem de registros</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, overflow: "hidden" }}>
                {[
                  { id: "#OC-2041", status: "Em análise", pct: 25 },
                  { id: "#OC-2042", status: "Em correção", pct: 60 },
                  { id: "#OC-2043", status: "Finalizado", pct: 100 },
                ].map((r, i) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: i < 2 ? `1px solid ${C.cardBorder}` : "none", gap: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.cinzaEscuro, fontFamily: F.mono, minWidth: 80 }}>{r.id}</span>
                    <span style={{ fontSize: 12, color: C.cinzaChumbo, flex: 1 }}>{r.status}</span>
                    <MicroProgress value={r.pct} width={70} />
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist de cadastro */}
            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "10px 10px 10px 20px", padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: "0 0 4px", fontFamily: F.title }}>Checklist de preenchimento</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: "0 0 16px", fontFamily: F.body }}>App Visitante — completude do cadastro</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <ProgressBar value={75} label="Cadastro do visitante" helper="Faltam: placa do veículo, empresa." size="md" />
                {[
                  { done: true, t: "Nome completo" }, { done: true, t: "CPF" }, { done: true, t: "Tipo de veículo" },
                  { done: false, t: "Placa do veículo" }, { done: false, t: "Empresa" },
                ].map(item => (
                  <div key={item.t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: F.body }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: item.done ? C.verdeEscuro : C.trilho, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.done && <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={C.branco} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <span style={{ color: item.done ? C.cinzaEscuro : C.textMuted, textDecoration: item.done ? "line-through" : "none" }}>{item.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 08 — TOKENS */}
        <Section n="08" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card mob={mob} s={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : xl ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", gap: mob ? 24 : xl ? 32 : 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", color: C.textLight, textTransform: "uppercase", fontFamily: F.title, marginBottom: 4 }}>Cores</span>
              <TokenRow label="Padrão" value="#004B9B" color={C.azulProfundo} />
              <TokenRow label="Quase lá (90–99%)" value="#00C64C" color={C.verdeFloresta} />
              <TokenRow label="Completo (100%)" value="#00904C" color={C.verdeEscuro} />
              <TokenRow label="Atenção" value="#F6921E" color={C.amareloEscuro} />
              <TokenRow label="Erro" value="#DC3545" color={C.danger} />
              <TokenRow label="Trilho" value="#E2E8F0" color={C.trilho} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", color: C.textLight, textTransform: "uppercase", fontFamily: F.title, marginBottom: 4 }}>Dimensões barra</span>
              <TokenRow label="Pequeno (SM)" value="4px" />
              <TokenRow label="Médio (MD) ★" value="8px" />
              <TokenRow label="Grande (LG)" value="12px" />
              <TokenRow label="Border radius" value="50% da altura" />
              <TokenRow label="Animação" value="0.8s cubic-bezier" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", color: C.textLight, textTransform: "uppercase", fontFamily: F.title, marginBottom: 4 }}>Dimensões ring</span>
              <TokenRow label="Tamanho padrão" value="80px" />
              <TokenRow label="Stroke" value="6px" />
              <TokenRow label="Font %" value="22% do diâmetro" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", color: C.textLight, textTransform: "uppercase", fontFamily: F.title, marginBottom: 4 }}>Tipografia</span>
              <TokenRow label="Label" value="Open Sans 600 13px" />
              <TokenRow label="Porcentagem" value="Fira Code 600 12px" />
              <TokenRow label="Helper" value="Open Sans 400 11px" />
              <TokenRow label="Step label" value="Open Sans 500 11px" />
            </div>
          </Card>
        </Section>

        <Section n="09" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Trilho bg",light:"#E2E8F0",dark:"#333333"},
                {token:"Fill padrão",light:"#004B9B",dark:"#1A6FC4"},
                {token:"Fill sucesso",light:"#00C64C",dark:"#00A83E"},
                {token:"Fill completo",light:"#00904C",dark:"#00C64C"},
                {token:"Fill atenção",light:"#F6921E",dark:"#FBBF24"},
                {token:"Fill erro",light:"#DC3545",dark:"#F87171"},
                {token:"Texto %",light:"#333B41",dark:"#E2E2E8"},
                {token:"Texto label",light:"#333B41",dark:"#E2E2E8"},
                {token:"Texto helper",light:"#64748B",dark:"#A1A1AA"},
                {token:"Step done",light:"#00904C",dark:"#00C64C"},
                {token:"Step active",light:"#004B9B",dark:"#93BDE4"},
                {token:"Step pending",light:"#E2E8F0",dark:"#3A3A3A"},
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

        <CodePlayground />

        <CodeExportSection items={[{
          label: "Progress",
          description: "ProgressBar linear com tamanhos e cores automaticas, e ProgressRing circular com animacao.",
          code: progressExportCode,
        }]} />

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "20px 0 0", borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: ".5px", fontFamily: F.title, fontWeight: 400 }}>
            DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  );
}
