import { useState, useRef } from "react";
import { CodeExportSection } from '../../components/CodeExport';

/* ═══════════════════════════════════════════
   FIPS DESIGN SYSTEM — BRAND TOKENS
   ═══════════════════════════════════════════ */
const C = {
  azulProfundo: "var(--color-gov-azul-profundo)", azulEscuro: "var(--color-gov-azul-escuro)", azulClaro: "var(--color-gov-azul-claro)",
  cinzaChumbo: "var(--color-fg-muted)", cinzaEscuro: "var(--color-fg)", cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4", azulCeuClaro: "#D3E3F4",
  amareloOuro: "#FDC24E", amareloEscuro: "#F6921E",
  verdeFloresta: "#00C64C", verdeEscuro: "#00904C",
  danger: "#DC3545", dangerDark: "#C82333", dangerBg: "#FEF2F2",
  neutro: "var(--color-surface-soft)", branco: "#FFFFFF",
  bg: "var(--color-surface-muted)", cardBg: "var(--color-surface)", cardBorder: "var(--color-border)",
  textMuted: "var(--color-fg-muted)", textLight: "var(--color-fg-muted)",
  inputBorder: "var(--color-border)", inputBorderHover: "#93BDE4",
  inputBg: "var(--color-surface)", inputBgDisabled: "var(--color-surface-muted)",
};
const F = { title: "'Saira Expanded', sans-serif", body: "'Open Sans', sans-serif", mono: "'Fira Code', monospace" };

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const icons = {
  pessoa: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  email: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2 6l8 5 8-5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  busca: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke={c} strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  calendario: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M2.5 8h15M7 2v3M13 2v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cadeado: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  telefone: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M3 4.5A1.5 1.5 0 014.5 3h2.2a1 1 0 01.95.68l.8 2.4a1 1 0 01-.36 1.1l-1.2.9a10 10 0 004.9 4.9l.9-1.2a1 1 0 011.1-.36l2.4.8a1 1 0 01.68.95v2.2a1.5 1.5 0 01-1.5 1.5C8.5 16.9 3.1 11.5 3 4.5z" stroke={c} strokeWidth="1.5"/></svg>,
  documento: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M6 2h6l5 5v10a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v5h5M8 11h4M8 14h6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  placa: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.5"/><path d="M6 5v10M14 5v10M2 10h16" stroke={c} strokeWidth="1.2" opacity=".4"/></svg>,
  moeda: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.5"/><text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Open Sans, sans-serif" fill={c}>R$</text></svg>,
  olhoAberto: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5"/></svg>,
  olhoFechado: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" stroke={c} strokeWidth="1.5"/><path d="M4 4l12 12" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  limpar: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  dropdown: (sz=16,c=C.cinzaChumbo) => <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ═══════════════════════════════════════════ JUNCTION LINES ═══════════════════════════════════════════ */
function JunctionLines({ style }: { style?: React.CSSProperties }) {
  return <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity:.12,...style }}><path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 170H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/><path d="M0 20H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round"/></svg>;
}

/* ═══════════════════════════════════════════ DS INPUT ═══════════════════════════════════════════ */
interface DSInputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search" | "url" | "none";
  pattern?: string;
  maxLength?: number;
  required?: boolean;
  error?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helper?: string;
  compact?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  onClear?: () => void;
  showToggle?: boolean;
  size?: "desktop" | "mobile" | "compact";
}

function DSInput({ label, placeholder, icon, iconRight, type="text", inputMode, pattern, maxLength, required, error, errorMsg, disabled, readOnly, helper, compact, value: controlledVal, onChange, onClear, showToggle, size="desktop" }: DSInputProps) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState(controlledVal || "");
  const [showPw, setShowPw] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const sizeMap = { desktop: { h:35, fs:13 }, mobile: { h:42, fs:14 }, compact: { h:30, fs:12 } };
  const resolvedSize = compact ? "compact" : size;
  const { h, fs } = sizeMap[resolvedSize] || sizeMap.desktop;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const borderColor = error ? C.danger : focused ? (isDark ? "#93BDE4" : C.azulProfundo) : C.inputBorder;
  const bgColor = disabled ? C.inputBgDisabled : C.inputBg;
  const shadowColor = focused && !error
    ? `0 0 0 3px ${isDark ? "rgba(147,189,228,0.2)" : C.azulCeuClaro}`
    : error && focused
      ? `0 0 0 3px ${isDark ? "rgba(248,113,113,0.15)" : C.dangerBg}`
      : "none";

  const wrapStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8,
    height: h, padding: "0 12px",
    background: bgColor,
    border: `1.5px solid ${borderColor}`,
    borderRadius: 8,
    transition: "all 0.18s ease",
    boxShadow: shadowColor,
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: F.body, fontSize: fs,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1, border: "none", outline: "none", background: "transparent",
    fontFamily: F.body, fontSize: fs, color: disabled ? C.cinzaChumbo : C.cinzaEscuro,
    cursor: disabled ? "not-allowed" : "text",
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: compact ? 11 : 12, fontWeight: 600, color: C.cinzaEscuro,
    fontFamily: F.body, marginBottom: 1, marginLeft: 7, display: "flex", alignItems: "center", gap: 3,
  };

  const displayVal = val;

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>}
        </label>
      )}
      <div
        style={wrapStyle}
        onClick={() => !disabled && ref.current?.focus()}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0, opacity: disabled ? 0.4 : 0.7 }}>{icon}</span>}
        <input
          ref={ref}
          type={showToggle ? (showPw ? "text" : "password") : type}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={maxLength}
          placeholder={placeholder}
          value={displayVal}
          onChange={(e) => { setVal(e.target.value); onChange?.(e.target.value); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          readOnly={readOnly}
          style={inputStyle}
        />
        {onClear && displayVal && !disabled && (
          <span style={{ display: "flex", cursor: "pointer", opacity: 0.5, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); setVal(""); onClear?.(); }}>
            {icons.limpar(14, C.cinzaChumbo)}
          </span>
        )}
        {showToggle && (
          <span style={{ display: "flex", cursor: "pointer", opacity: 0.6, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); setShowPw(!showPw); }}>
            {showPw ? icons.olhoFechado(16, C.cinzaChumbo) : icons.olhoAberto(16, C.cinzaChumbo)}
          </span>
        )}
        {iconRight && !showToggle && !onClear && <span style={{ display: "flex", flexShrink: 0, opacity: disabled ? 0.4 : 0.7 }}>{iconRight}</span>}
      </div>
      {(helper || (error && errorMsg)) && (
        <span style={{ fontSize: 11, color: error ? C.danger : C.textMuted, marginTop: 3, fontFamily: F.body, lineHeight: 1.3 }}>
          {error ? errorMsg : helper}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ LAYOUT HELPERS ═══════════════════════════════════════════ */
function Section({ number, title, desc, children }: { number: string; title: string; desc: string; children: React.ReactNode }) {
  return <section style={{ marginBottom: 44 }}><div style={{ fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:F.title,marginBottom:6 }}>{number}</div><h2 style={{ fontSize:20,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:F.title,letterSpacing:"0.5px" }}>{title}</h2><p style={{ fontSize:14,color:C.cinzaChumbo,margin:"0 0 20px",lineHeight:1.55,fontFamily:F.body }}>{desc}</p>{children}</section>;
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background:C.cardBg,borderRadius:"12px 12px 12px 24px",border:`1px solid ${C.cardBorder}`,padding:"28px",boxShadow:"0 1px 3px rgba(0,75,155,0.04), 0 4px 14px rgba(0,75,155,0.03)",...style }}>{children}</div>;
}

const gc: React.CSSProperties = { background:C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:"10px 10px 10px 18px", overflow:"hidden" };
const gh: React.CSSProperties = { padding:"16px 20px", background:C.bg, borderBottom:`1px solid ${C.cardBorder}`, display:"flex", alignItems:"center", gap: 12 };
const gb: React.CSSProperties = { padding:"16px 20px 20px" };
const gl: React.CSSProperties = { fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:C.azulClaro,fontFamily:F.title,marginBottom:4,marginTop:12 };
const gt: React.CSSProperties = { fontSize:13,color:C.cinzaEscuro,lineHeight:1.55,margin:0,fontFamily:F.body };
const ge: React.CSSProperties = { fontSize:12,color:C.cinzaChumbo,lineHeight:1.5,margin:0,fontFamily:F.body,fontStyle:"italic",paddingLeft:10,borderLeft:`2px solid ${C.azulCeuClaro}` };
const gk: React.CSSProperties = { fontSize:11,fontFamily:F.mono,color:C.cinzaChumbo,background:C.cardBg,padding:"2px 8px",borderRadius:4,border:`1px solid ${C.cardBorder}` };

function TokenRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:12,fontFamily:F.body }}>{color && <div style={{ width:16,height:16,borderRadius:4,background:color,border:`1px solid ${C.cardBorder}`,flexShrink:0 }}/>}<span style={{ color:C.cinzaChumbo,minWidth:100 }}>{label}</span><code style={{ background:C.neutro,padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:F.mono,color:C.cinzaEscuro }}>{value}</code></div>;
}

const inputExportCode = `// DS-FIPS — Input — Copy-paste ready
import { useState, useRef } from "react";

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
  dangerBg: "#FEF2F2",
  azulCeuClaro: "#D3E3F4",
  cinzaChumbo: "#7B8C96",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "search" | "url" | "none";
  maxLength?: number;
  required?: boolean;
  error?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  readOnly?: boolean;
  helper?: string;
  compact?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  onClear?: () => void;
  showToggle?: boolean;
  size?: "desktop" | "mobile" | "compact";
}

export function Input({
  label, placeholder, icon, iconRight, type = "text", inputMode,
  maxLength, required, error, errorMsg, disabled, readOnly,
  helper, compact, value: controlledVal, onChange, onClear, showToggle, size = "desktop",
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState(controlledVal || "");
  const [showPw, setShowPw] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const sizeMap = { desktop: { h: 35, fs: 13 }, mobile: { h: 42, fs: 14 }, compact: { h: 30, fs: 12 } };
  const resolvedSize = compact ? "compact" : size;
  const { h, fs } = sizeMap[resolvedSize] || sizeMap.desktop;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const borderColor = error ? C.danger : focused ? (isDark ? "#93BDE4" : C.azulProfundo) : C.border;
  const bgColor = disabled ? C.surfaceMuted : C.surface;
  const shadowColor = focused && !error
    ? \`0 0 0 3px \${isDark ? "rgba(147,189,228,0.2)" : C.azulCeuClaro}\`
    : error && focused
      ? \`0 0 0 3px \${isDark ? "rgba(248,113,113,0.15)" : C.dangerBg}\`
      : "none";

  const displayVal = val;

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {label && (
        <label style={{
          fontSize: compact ? 11 : 12, fontWeight: 600, color: C.fg,
          fontFamily: Fn.body, marginBottom: 1, marginLeft: 7,
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {label}
          {required && <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          height: h, padding: "0 12px",
          background: bgColor, border: \`1.5px solid \${borderColor}\`,
          borderRadius: 8, transition: "all 0.18s ease",
          boxShadow: shadowColor,
          cursor: disabled ? "not-allowed" : "text",
          fontFamily: Fn.body, fontSize: fs,
        }}
        onClick={() => !disabled && ref.current?.focus()}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0, opacity: disabled ? 0.4 : 0.7 }}>{icon}</span>}
        <input
          ref={ref}
          type={showToggle ? (showPw ? "text" : "password") : type}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={displayVal}
          onChange={e => { setVal(e.target.value); onChange?.(e.target.value); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          readOnly={readOnly}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: Fn.body, fontSize: fs, color: disabled ? C.fgMuted : C.fg,
            cursor: disabled ? "not-allowed" : "text", minWidth: 0,
          }}
        />
        {onClear && displayVal && !disabled && (
          <span style={{ display: "flex", cursor: "pointer", opacity: 0.5, flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); setVal(""); onClear?.(); }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke={C.fgMuted} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        {showToggle && (
          <span style={{ display: "flex", cursor: "pointer", opacity: 0.6, flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); setShowPw(!showPw); }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" stroke={C.fgMuted} strokeWidth="1.5"/>
              {!showPw && <circle cx="10" cy="10" r="2.5" stroke={C.fgMuted} strokeWidth="1.5"/>}
              {showPw && <path d="M4 4l12 12" stroke={C.fgMuted} strokeWidth="1.5" strokeLinecap="round"/>}
            </svg>
          </span>
        )}
        {iconRight && !showToggle && !onClear && (
          <span style={{ display: "flex", flexShrink: 0, opacity: disabled ? 0.4 : 0.7 }}>{iconRight}</span>
        )}
      </div>
      {(helper || (error && errorMsg)) && (
        <span style={{ fontSize: 11, color: error ? C.danger : C.fgMuted, marginTop: 3, fontFamily: Fn.body, lineHeight: 1.3 }}>
          {error ? errorMsg : helper}
        </span>
      )}
    </div>
  );
}

// Usage:
// <Input label="Nome" placeholder="Nome completo" icon={<PersonIcon />} required />
// <Input label="Busca" placeholder="Buscar..." icon={<SearchIcon />} onClear={() => {}} />
// <Input label="Senha" placeholder="Senha" icon={<LockIcon />} showToggle required />
// <Input label="Email" error errorMsg="Email invalido." value="abc" icon={<MailIcon />} />
// <Input label="Protocolo" readOnly value="FIPS-2026-00482" icon={<DocIcon />} />
`;

interface InputVariant {
  label: string;
  placeholder: string;
  iconName: string;
  type?: string;
  inputMode?: string;
  required?: boolean;
  showToggle?: boolean;
  onClear?: boolean;
  maxLength?: number;
  pattern?: string;
  error?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  helper?: string;
  iconRight?: string;
}

const INPUT_VARIANTS: InputVariant[] = [
  { label: "Nome do cliente", placeholder: "Nome completo", iconName: "pessoa", type: "text", inputMode: "text", required: true, helper: "Campo obrigatório em cadastros." },
  { label: "Email", placeholder: "email@fips.app.br", iconName: "email", type: "email", inputMode: "email" },
  { label: "Busca global", placeholder: "Buscar empresa, CNPJ ou responsável...", iconName: "busca", type: "search", inputMode: "search", onClear: true },
  { label: "Data de vencimento", placeholder: "30/03/2026", iconName: "calendario", type: "text", inputMode: "numeric", pattern: "[0-9/]*" },
  { label: "Telefone", placeholder: "(13) 99999-0000", iconName: "telefone", type: "tel", inputMode: "tel" },
  { label: "CPF / CNPJ", placeholder: "000.000.000-00", iconName: "documento", type: "text", inputMode: "numeric", pattern: "[0-9./-]*" },
  { label: "Placa do veículo", placeholder: "ABC-1D23", iconName: "placa", type: "text", inputMode: "text", maxLength: 8 },
  { label: "Valor estimado", placeholder: "R$ 0,00", iconName: "moeda", type: "text", inputMode: "decimal" },
  { label: "Senha de acesso", placeholder: "Mínimo 8 caracteres", iconName: "cadeado", type: "password", required: true, showToggle: true, helper: "Toggle de visibilidade (olho) à direita." },
  { label: "Matrícula", placeholder: "000000", iconName: "pessoa", type: "text", inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 },
  { label: "Hora prevista", placeholder: "14:30", iconName: "calendario", type: "text", inputMode: "numeric", pattern: "[0-9:]*", maxLength: 5 },
  { label: "Protocolo", placeholder: "—", iconName: "documento", type: "text", readOnly: true, value: "FIPS-2026-00482", helper: "Gerado pelo sistema — somente leitura." },
  { label: "E-mail corporativo", placeholder: "email@fips.app.br", iconName: "email", type: "email", inputMode: "email", error: true, errorMsg: "Formato de e-mail inválido.", value: "joao@" },
  { label: "Ramal interno", placeholder: "4210", iconName: "telefone", type: "text", inputMode: "numeric", maxLength: 4, disabled: true, helper: "Definido pelo RH — não editável." },
];

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function InputDoc() {
  const [searchVal, setSearchVal] = useState("");
  const [emailVal, setEmailVal] = useState("consultoriafiscal");
  const [scenarioNome, setScenarioNome] = useState("");
  const [scenarioEmail, setScenarioEmail] = useState("");

  return (
    <div style={{ minHeight:"100vh", background:"var(--color-surface-muted)", fontFamily:F.body, color:C.cinzaEscuro }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        input::placeholder { color: #7B8C96; }
        input:disabled::placeholder { color: #7B8C96; opacity: 0.5; }
      `}</style>

      {/* ══════ HEADER ══════ */}
      <header style={{ background:`linear-gradient(135deg, ${C.azulProfundo} 0%, ${C.azulEscuro} 100%)`, padding:"48px 40px 44px", position:"relative", overflow:"hidden" }}>
        <JunctionLines style={{ position:"absolute",top:-10,right:-20,width:400,height:250 }}/>
        <JunctionLines style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 200, transform: 'scaleX(-1)' }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:`${C.branco}10`,border:`1px solid ${C.branco}18`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:C.amareloOuro,fontFamily:F.title,marginBottom:16 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro}/><rect x="9" y="1" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill={C.amareloOuro} opacity=".3"/></svg>
            Design System FIPS
          </div>
          <h1 style={{ fontSize:44,fontWeight:700,color:C.branco,margin:"0 0 10px",fontFamily:F.title,letterSpacing:"1px" }}>Input</h1>
          <p style={{ fontSize:16,color:`${C.branco}B0`,lineHeight:1.6,maxWidth:680,margin:0,fontFamily:F.body }}>
            Campos de entrada do DS-FIPS. Todos os inputs seguem o padrão de ícone contextual à esquerda, borda arredondada de 8px e estados visuais claros para foco, erro e bloqueio.
          </p>
          <div style={{ display:"flex",gap:14,marginTop:24,flexWrap:"wrap" }}>
            {[
              { color:C.inputBorder, label:"borda padrão", hex:"#CBD5E1" },
              { color:C.azulProfundo, label:"foco", hex:"#004B9B" },
              { color:C.danger, label:"erro", hex:"#DC3545" },
              { color:C.inputBgDisabled, label:"bloqueado", hex:"#F1F5F9" },
            ].map(t => (
              <div key={t.label} style={{ display:"flex",alignItems:"center",gap:8,background:`${C.branco}08`,border:`1px solid ${C.branco}15`,borderRadius:6,padding:"6px 12px",fontSize:12,color:`${C.branco}90`,fontFamily:F.mono }}>
                <div style={{ width:12,height:12,borderRadius:3,background:t.color,border:`1px solid ${C.branco}20`,flexShrink:0 }}/>
                {t.label}<span style={{ opacity:.5 }}>{t.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════ BODY ══════ */}
      <div style={{ padding:"36px 40px 60px", maxWidth:1100, margin:"0 auto" }}>

        {/* 01 — FORMULÁRIO PADRÃO */}
        <Section number="01" title="Formulário padrão" desc="Padrão oficial para formulários completos e cadastros.">
          <Card>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 20px" }}>
              {INPUT_VARIANTS.map((v, i) => {
                const iconMap: Record<string, () => React.ReactNode> = {
                  pessoa: () => icons.pessoa(), email: () => icons.email(), busca: () => icons.busca(),
                  calendario: () => icons.calendario(), telefone: () => icons.telefone(), documento: () => icons.documento(),
                  placa: () => icons.placa(), moeda: () => icons.moeda(), cadeado: () => icons.cadeado(),
                };
                const iconFn = iconMap[v.iconName] || (() => icons.documento());
                const isSearch = v.onClear;
                return (
                  <DSInput
                    key={i}
                    label={v.label} placeholder={v.placeholder} type={v.type} inputMode={v.inputMode as DSInputProps["inputMode"]}
                    icon={iconFn()} required={v.required} helper={v.helper} maxLength={v.maxLength} pattern={v.pattern}
                    showToggle={v.showToggle} error={v.error} errorMsg={v.errorMsg} readOnly={v.readOnly} disabled={v.disabled}
                    {...(isSearch ? { value: searchVal, onChange: setSearchVal, onClear: () => setSearchVal("") } : v.value !== undefined ? { value: v.value } : {})}
                    iconRight={v.iconName === "calendario" ? icons.calendario(16, C.azulClaro) : undefined}
                  />
                );
              })}
            </div>
          </Card>
        </Section>

        {/* 02 — ANATOMIA DO LABEL */}
        <Section number="02" title="Anatomia do label" desc="Estrutura visual do label, espaçamento, asterisco obrigatório e texto auxiliar. Padrão para todos os inputs do ecossistema.">
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display:"flex", gap:40, flexWrap:"wrap", alignItems:"flex-start" }}>
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ position:"relative", padding:"12px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:C.azulProfundo, flexShrink:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.cinzaEscuro, fontFamily:F.title }}>Label</span>
                    <span style={{ fontSize:10, color:C.textMuted, fontFamily:F.body }}>— Open Sans 600 · 12px</span>
                  </div>
                  <div style={{ marginLeft:5, marginBottom:6, fontSize:12, fontWeight:600, color:C.cinzaEscuro, fontFamily:F.body, display:"flex", alignItems:"center", gap:3 }}>
                    Título <span style={{ color:C.danger, fontWeight:700, fontSize:14 }}>*</span>
                    <span style={{ marginLeft:8, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:C.danger, flexShrink:0 }} />
                      <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.danger, fontFamily:F.title }}>Asterisco obrigatório</span>
                    </span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, marginLeft:5 }}>
                    <div style={{ height:1, width:20, background:C.amareloEscuro }} />
                    <span style={{ fontSize:9, color:C.amareloEscuro, fontFamily:F.mono, fontWeight:600 }}>1px gap</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:C.verdeFloresta, flexShrink:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.verdeFloresta, fontFamily:F.title }}>Campo de entrada</span>
                  </div>
                  <DSInput placeholder="Ex: Consultoria Fiscal" icon={icons.documento()} size="desktop" />
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2, marginLeft:5 }}>
                    <div style={{ height:1, width:20, background:C.amareloEscuro }} />
                    <span style={{ fontSize:9, color:C.amareloEscuro, fontFamily:F.mono, fontWeight:600 }}>1px gap</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:C.azulCeu, flexShrink:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.azulCeu, fontFamily:F.title }}>Texto auxiliar</span>
                    <span style={{ fontSize:10, color:C.textMuted, fontFamily:F.body }}>— Open Sans 400 · 11px</span>
                  </div>
                  <div style={{ marginLeft:5, marginTop:3, fontSize:11, color:C.textMuted, fontFamily:F.body }}>
                    Asterisco vermelho identifica campo obrigatório.
                  </div>
                </div>
              </div>
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ padding:"12px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:C.danger, flexShrink:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:C.danger, fontFamily:F.title }}>Estado de erro</span>
                  </div>
                  <DSInput label="Email" placeholder="email@fips.app.br" icon={icons.email()} required error errorMsg="Formato de email inválido. Verifique e tente novamente." value="consultoriafiscal" size="desktop" />
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
            <div style={{...gc, borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Label (nome do campo)</span></div>
              <div style={gb}>
                <div style={gl}>Tipografia</div>
                <p style={gt}>Open Sans Semibold (600) em 12px. Cor: Cinza Escuro (#333B41). Em modo compacto, 11px.</p>
                <div style={gl}>Posicionamento</div>
                <p style={gt}>Sempre acima do input. Margem esquerda de 5px (alinhado com o conteúdo interno do campo). Espaçamento de 1px entre label e borda superior do input.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt, fontWeight:600}}>Todo input visível deve ter label. Inputs sem label são permitidos apenas em barras de busca e filtros inline compactos.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"Nome do cliente", "Email", "Data de vencimento", "Placa do veículo" — sempre descritivo e objetivo.</p>
              </div>
            </div>

            <div style={{...gc, borderLeft:`4px solid ${C.danger}`}}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Asterisco obrigatório</span><span style={{ color:C.danger, fontSize:18, fontWeight:700 }}>*</span></div>
              <div style={gb}>
                <div style={gl}>Visual</div>
                <p style={gt}>Asterisco vermelho (#DC3545), peso 700, tamanho 14px. Posicionado 3px à direita do texto do label, sem quebra de linha.</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Em todo campo mandatório para submissão do formulário. Se o campo é opcional, não exibir asterisco.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt, fontWeight:600}}>Se mais de 80% dos campos são obrigatórios, considere inverter: marcar os opcionais com "(opcional)" ao invés de asterisco nos obrigatórios.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"Nome *" e "CPF *" no App Visitante são obrigatórios; "Email" é opcional e não leva asterisco.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Texto auxiliar (helper)</span></div>
              <div style={gb}>
                <div style={gl}>Tipografia</div>
                <p style={gt}>Open Sans Regular (400) em 11px. Cor: Cinza Mutado (#64748B). Espaçamento de 1px acima (entre input e texto).</p>
                <div style={gl}>Quando usar</div>
                <p style={gt}>Para orientar o preenchimento: formato esperado, exemplo, regra de negócio. Não usar em todos os campos — só quando agrega valor.</p>
                <div style={gl}>Quando NÃO usar</div>
                <p style={{...gt, color:C.danger}}>Nunca para informações óbvias como "Digite seu nome" abaixo de um campo já rotulado "Nome". Evitar textos longos (máximo 1 linha).</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"Padrão oficial para formulários completos e cadastros." / "Use quando o fluxo não permitir edição."</p>
              </div>
            </div>

            <div style={{...gc, borderLeft:`4px solid ${C.danger}`}}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Mensagem de erro</span></div>
              <div style={gb}>
                <div style={gl}>Tipografia</div>
                <p style={gt}>Open Sans Regular (400) em 11px. Cor: Vermelho (#DC3545). Substitui o helper text quando há erro.</p>
                <div style={gl}>Comportamento</div>
                <p style={gt}>Aparece no mesmo espaço do helper text, substituindo-o. Quando o erro é corrigido, volta a exibir o helper (se houver).</p>
                <div style={gl}>Regra de redação</div>
                <p style={{...gt, fontWeight:600}}>Seja específico: "Formato de email inválido" ao invés de "Campo inválido". Diga o que está errado e como corrigir.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>"CPF inválido. Verifique os dígitos." / "Campo obrigatório." / "Data deve ser futura." / "CNPJ não encontrado na base."</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Espaçamentos</span></div>
              <div style={gb}>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
                  {[
                    { label:"Label → Input", value:"1px", desc:"Espaço entre label e borda do campo" },
                    { label:"Input → Helper", value:"3px", desc:"Espaço entre borda inferior e texto auxiliar" },
                    { label:"Label marginLeft", value:"5px", desc:"Recuo à direita alinhando com conteúdo interno" },
                    { label:"Entre campos", value:"20px", desc:"Espaçamento vertical entre um campo e outro" },
                    { label:"Asterisco gap", value:"3px", desc:"Distância entre texto do label e asterisco" },
                  ].map(s => (
                    <div key={s.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <code style={{ background:C.amareloOuro+"30", color:C.amareloEscuro, padding:"2px 8px", borderRadius:4, fontSize:11, fontFamily:F.mono, fontWeight:600, minWidth:80, textAlign:"center" }}>{s.value}</code>
                      <div>
                        <span style={{ fontSize:12, fontWeight:600, color:C.cinzaEscuro, fontFamily:F.body }}>{s.label}</span>
                        <span style={{ fontSize:11, color:C.textMuted, fontFamily:F.body, marginLeft:6 }}>— {s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Regras de nomenclatura</span></div>
              <div style={gb}>
                <div style={gl}>Boas práticas</div>
                <p style={gt}>Use nomes curtos e descritivos. Substantivos, não verbos. Evitar abreviações ambíguas.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:12 }}>
                  {[
                    { good:"Nome do cliente", bad:"Digite o nome" },
                    { good:"Email", bad:"Endereço de email do usuário" },
                    { good:"CPF / CNPJ", bad:"Documento" },
                    { good:"Data de vencimento", bad:"Vencimento dt." },
                    { good:"Placa do veículo", bad:"Placa (formato Mercosul)" },
                  ].map(r => (
                    <div key={r.good} style={{ display:"flex", gap:12, fontSize:12, fontFamily:F.body }}>
                      <span style={{ color:C.verdeFloresta, fontWeight:600, minWidth:140 }}>✓ {r.good}</span>
                      <span style={{ color:C.danger, opacity:0.7 }}>✗ {r.bad}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 03 — SISTEMA DE ÍCONES */}
        <Section number="03" title="Sistema de ícones" desc="Ícones reforçam o tipo de dado e adicionam ações contextuais ao campo. Regras de posicionamento e uso.">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:16 }}>
            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Ícone à esquerda</span>
                <code style={gk}>contextual</code>
              </div>
              <div style={gb}>
                <div style={gl}>Função</div>
                <p style={gt}>Identifica visualmente o tipo de dado esperado. Sempre presente, reforça a semântica do campo.</p>
                <div style={gl}>Ícones disponíveis</div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
                  {[
                    { fn: icons.pessoa, name:"Pessoa" },{ fn: icons.email, name:"Email" },{ fn: icons.busca, name:"Busca" },
                    { fn: icons.calendario, name:"Data" },{ fn: icons.cadeado, name:"Senha" },{ fn: icons.telefone, name:"Telefone" },
                    { fn: icons.documento, name:"CPF/CNPJ" },{ fn: icons.placa, name:"Placa" },{ fn: icons.moeda, name:"Moeda" },
                  ].map(i => (
                    <div key={i.name} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                      <div style={{ width:36,height:36,borderRadius:8,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center" }}>{i.fn(18,C.azulProfundo)}</div>
                      <span style={{ fontSize:10,color:C.cinzaChumbo }}>{i.name}</span>
                    </div>
                  ))}
                </div>
                <div style={gl}>Regra</div>
                <p style={gt}>Todo input deve ter ícone à esquerda. Sem ícone, o campo perde identidade visual dentro do DS-FIPS.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Ícone à direita</span>
                <code style={gk}>ação</code>
              </div>
              <div style={gb}>
                <div style={gl}>Função</div>
                <p style={gt}>Ação interativa dentro do campo. É clicável e executa uma função (limpar, alternar visibilidade, abrir seletor).</p>
                <div style={gl}>Ações disponíveis</div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:8 }}>
                  {[
                    { fn: icons.limpar, name:"Limpar" },{ fn: icons.olhoAberto, name:"Ver senha" },
                    { fn: icons.olhoFechado, name:"Ocultar" },{ fn: icons.calendario, name:"Picker" },{ fn: icons.dropdown, name:"Dropdown" },
                  ].map(i => (
                    <div key={i.name} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                      <div style={{ width:36,height:36,borderRadius:8,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center" }}>{i.fn(18,C.azulProfundo)}</div>
                      <span style={{ fontSize:10,color:C.cinzaChumbo }}>{i.name}</span>
                    </div>
                  ))}
                </div>
                <div style={gl}>Regra</div>
                <p style={gt}>Máximo 1 ícone de ação à direita. Se o campo tem "limpar", não adicionar outro ícone ao lado.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize:13, fontWeight:700, color:C.cinzaEscuro, fontFamily:F.title }}>Ambos os lados</span>
                <code style={gk}>contextual + ação</code>
              </div>
              <div style={gb}>
                <div style={gl}>Função</div>
                <p style={gt}>Combinação mais completa: ícone de contexto à esquerda + ação à direita. Padrão para campos de busca e senha.</p>
                <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:12 }}>
                  <DSInput placeholder="Buscar empresa..." icon={icons.busca()} value="FIPS Logística" onClear={() => {}} compact />
                  <DSInput placeholder="Senha do certificado" icon={icons.cadeado()} showToggle compact value="minha_senha_123" />
                </div>
                <div style={{...gl, marginTop:16}}>Regra</div>
                <p style={gt}>Esquerda = identidade do campo. Direita = ação. Nunca inverta.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 04 — GUIA DE USO POR TIPO */}
        <Section number="04" title="Guia de uso por tipo" desc="Significado, contexto de aplicação e regras de cada tipo de input no ecossistema FIPS.">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:16 }}>
            {[
              { label:"Texto", icn:icons.pessoa(), ph:"Nome completo", tp:"text", im:"text" as const, desc:"Campo de texto livre para nomes, títulos, descrições.", onde:"Cadastro de visitantes, nome de fornecedores, título de ocorrências, nome de treinamentos.", token:"type=text · inputMode=text" },
              { label:"Email", icn:icons.email(), ph:"email@fips.app.br", tp:"email", im:"email" as const, desc:"Campo validado para endereços de email. Exibe erro se formato inválido.", onde:"Cadastro de colaboradores, contatos de fornecedores, notificações do SSMA.", token:"type=email · inputMode=email" },
              { label:"Senha", icn:icons.cadeado(), ph:"Senha do certificado", tp:"password", desc:"Campo mascarado com toggle de visibilidade (olho). Nunca exibe o valor por padrão.", onde:"Login do portal FIPS, senha de certificado digital no Contpix, autenticação 2FA.", token:"type=password · toggle", toggle:true },
              { label:"Busca Global", icn:icons.busca(), ph:"Buscar empresa, CNPJ...", tp:"search", im:"search" as const, desc:"Campo com busca instantânea e botão limpar (X). Dispara pesquisa ao digitar.", onde:"Busca no App Suprimentos, filtro de empresas no Contpix, pesquisa de OS no Serrat.", token:"type=search · inputMode=search", clear:true },
              { label:"Data", icn:icons.calendario(), ph:"30/03/2026", tp:"text", im:"numeric" as const, desc:"Campo de data com inputMode numérico. Teclado numérico em mobile para digitação rápida.", onde:"Data de vencimento no Contpix, prazo de treinamento SSMA, validade de acesso no App Visitante.", token:"type=text · inputMode=numeric" },
              { label:"Telefone", icn:icons.telefone(), ph:"(13) 99999-0000", tp:"tel", im:"tel" as const, desc:"Campo com máscara para telefone brasileiro. Aceita fixo e celular. Teclado tel em mobile.", onde:"Cadastro de visitantes, contato de fornecedores, emergência SSMA.", token:"type=tel · inputMode=tel" },
              { label:"CPF / CNPJ", icn:icons.documento(), ph:"000.000.000-00", tp:"text", im:"numeric" as const, desc:"Campo com máscara dinâmica (CPF ou CNPJ). inputMode numérico para teclado apenas dígitos.", onde:"Cadastro de fornecedores no Suprimentos, identificação no App Visitante, Contpix.", token:"type=text · inputMode=numeric" },
              { label:"Placa", icn:icons.placa(), ph:"ABC-1D23", tp:"text", im:"text" as const, desc:"Campo para placa de veículo (padrão Mercosul ou antigo). Aceita letras e números, maxLength=8.", onde:"App Acesso Visitante — campo ao lado de 'Tipo de Veículo'. Obrigatório exceto pedestres.", token:"type=text · maxLength=8" },
              { label:"Moeda", icn:icons.moeda(), ph:"R$ 0,00", tp:"text", im:"decimal" as const, desc:"Campo numérico com inputMode decimal. Teclado com ponto/vírgula em mobile para valores monetários.", onde:"Valor estimado em requisições de contratação, orçamento de projetos, custos no Power BI.", token:"type=text · inputMode=decimal" },
            ].map(item => (
              <div key={item.label} style={gc}>
                <div style={{...gh, flexDirection:"column", alignItems:"stretch", gap:10 }}>
                  <DSInput placeholder={item.ph} type={item.tp} inputMode={item.im} icon={item.icn} showToggle={item.toggle} onClear={item.clear ? ()=>{} : undefined} compact />
                </div>
                <div style={gb}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:15,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>{item.label}</span>
                    <code style={gk}>{item.token}</code>
                  </div>
                  <div style={gl}>Significado</div>
                  <p style={gt}>{item.desc}</p>
                  <div style={gl}>Exemplo FIPS</div>
                  <p style={ge}>{item.onde}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 05 — ESTADOS */}
        <Section number="05" title="Estados interativos" desc="Cada estado comunica uma situação diferente ao usuário. Clique nos campos para testar o foco real.">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>PADRÃO</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Título" placeholder="Ex: Consultoria Fiscal" icon={icons.documento()} helper="Estado padrão do campo, aguardando interação." />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Campo sem interação do usuário. Borda cinza neutra, sem destaque.</p>
              </div>
            </div>

            <div style={{...gc, borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>SELECIONADO / EM FOCO</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Título" placeholder="Ex: Consultoria Fiscal" icon={icons.documento()} helper="Clique para ver o estado de foco com anel azul." />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Usuário clicou ou navegou via Tab. Borda azul profundo + anel de foco azul claro. Comunica onde o cursor está.</p>
              </div>
            </div>

            <div style={{...gc, borderLeft:`4px solid ${C.danger}`}}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.danger,fontFamily:F.title }}>ERRO</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Email" placeholder="email@fips.app.br" type="email" inputMode="email" icon={icons.email()} required error errorMsg="Validação visual em vermelho para campo inválido." value={emailVal} onChange={setEmailVal} />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Validação falhou (formato, obrigatório vazio, regra de negócio). Borda vermelha + mensagem de erro abaixo. Mantém até correção.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.cinzaChumbo,fontFamily:F.title }}>BLOQUEADO</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Busca" placeholder="Campo indisponível" icon={icons.busca()} disabled helper="Use quando o fluxo não permitir edição." />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Campo travado por regra de negócio ou permissão. Fundo cinza, cursor not-allowed, ícones com opacidade reduzida.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>OBRIGATÓRIO</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Nome completo" placeholder="Ex: João Silva" icon={icons.pessoa()} required helper="Asterisco vermelho identifica campo obrigatório." />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Campo mandatório para submissão. Asterisco vermelho ao lado do label. Se vazio no submit, entra em estado de erro.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}><span style={{ fontSize:13,fontWeight:700,color:C.cinzaChumbo,fontFamily:F.title }}>SOMENTE LEITURA</span></div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Protocolo" placeholder="" icon={icons.documento()} readOnly value="FIPS-2026-00482" helper="Exibe valor sem permitir edição. Fundo branco, sem cursor." />
                <div style={gl}>Quando ocorre</div>
                <p style={gt}>Valor gerado pelo sistema (protocolo, ID, data de criação). Visível mas não editável. Diferente de bloqueado: fundo branco.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 — TAMANHOS */}
        <Section number="06" title="Tamanhos" desc="Três tamanhos padronizados por contexto de uso. Desktop menor para otimizar espaço, mobile maior para área de toque.">
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:24, flexWrap:"wrap" }}>
              <div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"center" }}>
                <DSInput placeholder="Desktop" icon={icons.pessoa()} size="desktop" />
                <span style={{ fontSize:10,color:C.textLight,fontFamily:F.mono }}>35px</span>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"center" }}>
                <DSInput placeholder="Mobile" icon={icons.pessoa()} size="mobile" />
                <span style={{ fontSize:10,color:C.textLight,fontFamily:F.mono }}>42px</span>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"center" }}>
                <DSInput placeholder="Compacto" icon={icons.pessoa()} compact />
                <span style={{ fontSize:10,color:C.textLight,fontFamily:F.mono }}>30px</span>
              </div>
            </div>
          </Card>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
            <div style={{...gc, borderLeft:`4px solid ${C.azulProfundo}`}}>
              <div style={gh}>
                <span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>Desktop</span>
                <code style={gk}>height: 35px · font: 13px</code>
              </div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Nome do cliente" placeholder="Nome completo" icon={icons.pessoa()} required size="desktop" />
                <div style={{...gl, marginTop:14, color:C.cinzaEscuro}}>★ PADRÃO PARA DESKTOP</div>
                <p style={gt}>Tamanho padrão em telas de computador. Compacto o suficiente para formulários densos, mas confortável para digitação.</p>
                <div style={gl}>Onde usar</div>
                <p style={gt}>Todos os formulários, cadastros e telas de edição em desktop/notebook. É o tamanho default — se não especificar, use este.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Formulários do App Suprimentos, cadastro no Contpix, telas de consulta do SSMA, App Ideias — tudo em desktop.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>Mobile</span>
                <code style={gk}>height: 42px · font: 14px</code>
              </div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Nome do cliente" placeholder="Nome completo" icon={icons.pessoa()} required size="mobile" />
                <div style={{...gl, marginTop:14}}>Significado</div>
                <p style={gt}>Área de toque ampliada para uso em celular e tablet. Fonte maior para melhor legibilidade em telas pequenas.</p>
                <div style={gl}>Onde usar</div>
                <p style={gt}>PWAs, telas responsivas, apps mobile. Ativado automaticamente em viewports abaixo de 768px.</p>
                <div style={gl}>Regra</div>
                <p style={{...gt, fontWeight:600}}>Mínimo 42px de altura em touch — menor que isso causa erros de toque e frustração do usuário.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>App Acesso Visitante no celular dos porteiros; Serrat PWA no tablet dos técnicos de campo; SSMA mobile.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize:13,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title }}>Compacto</span>
                <code style={gk}>height: 30px · font: 12px</code>
              </div>
              <div style={{...gb, display:"flex", flexDirection:"column", gap:8 }}>
                <DSInput label="Buscar" placeholder="Buscar empresa..." icon={icons.busca()} compact />
                <div style={{...gl, marginTop:14}}>Significado</div>
                <p style={gt}>O menor input do sistema. Máxima economia de espaço, para uso pontual em áreas restritas.</p>
                <div style={gl}>Onde usar</div>
                <p style={gt}>Modais, barras de filtro inline, toolbars, popovers. Onde o input é auxiliar, não o foco principal da tela.</p>
                <div style={gl}>Onde NÃO usar</div>
                <p style={{...gt, color:C.danger}}>Nunca em formulários de cadastro principal. Nunca em mobile — muito pequeno para toque. Não usar para campos longos (textarea).</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Filtros nos modais do App Suprimentos; busca rápida no Kanban do App Ideias; campos de filtro em dashboards Power BI.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 07 — MODO COMPACTO DE MODAL */}
        <Section number="07" title="Modo compacto de modal" desc="Composição lado a lado para modais e espaços reduzidos. Inputs compactos com labels inline.">
          <Card style={{ background:C.bg }}>
            <div style={{ background:C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:12, padding:24, maxWidth:520 }}>
              <div style={{ fontSize:14,fontWeight:700,color:C.cinzaEscuro,fontFamily:F.title,marginBottom:16 }}>Modal de certificado</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                <DSInput label="Senha" placeholder="Senha do certificado" icon={icons.cadeado()} showToggle required compact />
                <DSInput label="Buscar empresa" placeholder="Buscar empresa..." icon={icons.busca()} onClear={()=>{}} compact />
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20 }}>
                <span style={{ padding:"6px 14px",fontSize:12,color:C.cinzaChumbo,cursor:"pointer",fontFamily:F.body }}>Cancelar</span>
                <span style={{ padding:"6px 14px",fontSize:12,color:C.branco,background:C.verdeFloresta,borderRadius:6,cursor:"pointer",fontFamily:F.body,fontWeight:600 }}>Salvar</span>
              </div>
            </div>
          </Card>
        </Section>

        {/* 08 — CENÁRIOS DE NEGÓCIO */}
        <Section number="08" title="Cenários de negócio" desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS.">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ background:C.bg, border:`1px solid ${C.cardBorder}`, borderRadius:"10px 10px 10px 20px", padding:24 }}>
              <h3 style={{ fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:F.title }}>Cadastro de visitante</h3>
              <p style={{ fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:F.body }}>App Acesso Visitante — formulário de entrada</p>
              <div style={{ background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:12 }}>
                <DSInput label="Nome" placeholder="Nome completo" type="text" inputMode="text" icon={icons.pessoa()} required value={scenarioNome} onChange={setScenarioNome} compact />
                <DSInput label="Email" placeholder="email@empresa.com" type="email" inputMode="email" icon={icons.email()} value={scenarioEmail} onChange={setScenarioEmail} compact />
                <DSInput label="Placa do veículo" placeholder="ABC-1D23" type="text" inputMode="text" maxLength={8} icon={icons.placa()} compact />
              </div>
            </div>

            <div style={{ background:C.bg, border:`1px solid ${C.cardBorder}`, borderRadius:"10px 10px 10px 20px", padding:24 }}>
              <h3 style={{ fontSize:14,fontWeight:700,color:C.cinzaEscuro,margin:"0 0 4px",fontFamily:F.title }}>Filtro de busca</h3>
              <p style={{ fontSize:12,color:C.cinzaChumbo,margin:"0 0 16px",fontFamily:F.body }}>App Suprimentos — barra de filtros em listagem</p>
              <div style={{ background:C.cardBg,border:`1px solid ${C.cardBorder}`,borderRadius:8,padding:16,display:"flex",gap:12,alignItems:"flex-end" }}>
                <div style={{ flex:1 }}><DSInput placeholder="Buscar fornecedor..." type="search" inputMode="search" icon={icons.busca()} onClear={()=>{}} compact /></div>
                <div style={{ flex:1 }}><DSInput placeholder="CNPJ" type="text" inputMode="numeric" pattern="[0-9./-]*" icon={icons.documento()} compact /></div>
                <span style={{ padding:"7px 16px",fontSize:12,color:C.branco,background:C.azulProfundo,borderRadius:6,cursor:"pointer",fontFamily:F.body,fontWeight:600,whiteSpace:"nowrap",height:34,display:"flex",alignItems:"center" }}>Buscar</span>
              </div>
            </div>
          </div>
        </Section>

        {/* 09 — TOKENS */}
        <Section number="09" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card style={{ display:"flex",gap:48,flexWrap:"wrap" }}>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4 }}>Bordas</span>
              <TokenRow label="Padrão" value="#CBD5E1" color={C.inputBorder}/>
              <TokenRow label="Hover" value="#93BDE4" color={C.inputBorderHover}/>
              <TokenRow label="Foco" value="#004B9B" color={C.azulProfundo}/>
              <TokenRow label="Erro" value="#DC3545" color={C.danger}/>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4 }}>Fundos</span>
              <TokenRow label="Padrão" value="#FFFFFF" color={C.inputBg}/>
              <TokenRow label="Bloqueado" value="#F1F5F9" color={C.inputBgDisabled}/>
              <TokenRow label="Anel de foco" value="#D3E3F4" color={C.azulCeuClaro}/>
              <TokenRow label="Anel de erro" value="#FEF2F2" color={C.dangerBg}/>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4 }}>Tipografia</span>
              <TokenRow label="Label" value="Open Sans 600 12px"/>
              <TokenRow label="Valor" value="Open Sans 400 14px"/>
              <TokenRow label="Placeholder" value="Open Sans 400 14px"/>
              <TokenRow label="Helper" value="Open Sans 400 11px"/>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <span style={{ fontSize:11,fontWeight:700,letterSpacing:"0.5px",color:C.textLight,textTransform:"uppercase",fontFamily:F.title,marginBottom:4 }}>Dimensões</span>
              <TokenRow label="Radius" value="8px"/>
              <TokenRow label="Height desktop" value="35px"/>
              <TokenRow label="Height mobile" value="42px"/>
              <TokenRow label="Height compacto" value="30px"/>
              <TokenRow label="Ícone" value="16px"/>
              <TokenRow label="Anel de foco" value="3px"/>
            </div>
          </Card>
        </Section>

        <Section number="10" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {token:"Borda idle",light:"#CBD5E1",dark:"#3A3A3A"},
                {token:"Borda hover",light:"#93BDE4",dark:"#4A4A4A"},
                {token:"Borda focus",light:"#004B9B",dark:"#93BDE4"},
                {token:"Background",light:"#FFFFFF",dark:"#252525"},
                {token:"Texto",light:"#333B41",dark:"#E2E2E8"},
                {token:"Placeholder",light:"#6B7784",dark:"#A1A1AA"},
                {token:"Ring focus",light:"rgba(211,227,244,1)",dark:"rgba(147,189,228,0.2)"},
                {token:"Bg disabled",light:"#F1F5F9",dark:"#1E1E1E"},
                {token:"Borda erro",light:"#DC3545",dark:"#F87171"},
                {token:"Ring erro",light:"#FEF2F2",dark:"rgba(248,113,113,0.15)"},
                {token:"Ícone opacity",light:"0.7",dark:"0.55"},
                {token:"Label",light:"#333B41",dark:"#E2E2E8"},
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
          label: "Input",
          description: "Input com icone contextual, estados (foco, erro, bloqueado), toggle de senha e botao limpar.",
          code: inputExportCode,
          preview: (
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", maxWidth:480 }}>
              <DSInput label="Nome" placeholder="Digite seu nome" icon={icons.pessoa()} />
              <DSInput label="E-mail" placeholder="email@fips.gov.br" icon={icons.email()} />
              <DSInput label="Senha" placeholder="********" icon={icons.cadeado()} showToggle />
              <DSInput label="Campo com erro" placeholder="Obrigatorio" error errorMsg="Campo obrigatorio" required />
            </div>
          ),
        }]} />

        <div style={{ textAlign:"center",padding:"20px 0 0",borderTop:`1px solid ${C.cardBorder}`,marginTop:20 }}>
          <span style={{ fontSize:12,color:C.cinzaChumbo,letterSpacing:"0.5px",fontFamily:F.title,fontWeight:400 }}>
            DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
