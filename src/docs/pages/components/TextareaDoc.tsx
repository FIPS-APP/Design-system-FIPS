import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'

/* ═══════════════════════════════════════════ TOKENS ═══════════════════════════════════════════ */
const C = {
  azulProfundo: 'var(--color-gov-azul-profundo)',
  azulEscuro: 'var(--color-gov-azul-escuro)',
  azulClaro: 'var(--color-gov-azul-claro)',
  cinzaChumbo: 'var(--color-fg-muted)',
  cinzaEscuro: 'var(--color-fg)',
  cinzaClaro: '#C0CCD2',
  azulCeu: '#93BDE4',
  azulCeuClaro: '#D3E3F4',
  amareloOuro: '#FDC24E',
  amareloEscuro: '#F6921E',
  verdeFloresta: '#00C64C',
  verdeEscuro: '#00904C',
  danger: '#DC3545',
  dangerBg: '#FEF2F2',
  neutro: 'var(--color-surface-soft)',
  branco: '#FFFFFF',
  bg: 'var(--color-surface-muted)',
  cardBg: 'var(--color-surface)',
  cardBorder: 'var(--color-border)',
  textMuted: 'var(--color-fg-muted)',
  textLight: 'var(--color-fg-muted)',
  inputBorder: 'var(--color-border)',
  inputBg: 'var(--color-surface)',
  inputBgDisabled: 'var(--color-surface-muted)',
  focusRing: 'rgba(147,189,228,0.35)',
}

const F = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
}

/* ═══════════════════════════════════════════ ICONS ═══════════════════════════════════════════ */
const Ic = {
  grid: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
    </svg>
  ),
  alerta: (s = 16, c = C.amareloEscuro) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 2L1.5 17h17L10 2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8v4M10 14v.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  save: (s = 14, c = '#fff') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4l-2-3z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5 1v4h6V1" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="4" y="9" width="8" height="4" rx=".5" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  clipboard: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4" y="3" width="12" height="15" rx="1.5" stroke={c} strokeWidth="1.5" />
      <path
        d="M8 1.5h4a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1v-1a1 1 0 011-1z"
        stroke={c}
        strokeWidth="1.4"
      />
      <path d="M8 9h4M8 12h6" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
}

function JunctionLines({ style }: { style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }} aria-hidden>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 170H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 20H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

/* ═══════════════════════════════════════════ DS TEXTAREA (doc showcase) ═══════════════════════════════════════════ */
function DSTextarea({
  label,
  placeholder,
  rows = 3,
  required,
  error,
  errorMsg,
  disabled,
  readOnly,
  helper,
  compact,
  maxLength,
  autoResize,
  value: valueProp,
  defaultValue,
  onChange,
}: {
  label?: string
  placeholder?: string
  rows?: number
  required?: boolean
  error?: boolean
  errorMsg?: string
  disabled?: boolean
  readOnly?: boolean
  helper?: string
  compact?: boolean
  maxLength?: number
  autoResize?: boolean
  value?: string
  defaultValue?: string
  onChange?: (v: string) => void
}) {
  const [internal, setInternal] = useState(() => valueProp ?? defaultValue ?? '')
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const fs = compact ? 12 : 13
  const controlled = valueProp !== undefined
  const dv = controlled ? valueProp : internal
  const bc = error ? C.danger : focused ? C.azulProfundo : C.inputBorder
  const bg = disabled ? C.inputBgDisabled : C.inputBg
  const sh =
    focused && !error ? `0 0 0 3px ${C.focusRing}` : error && focused ? `0 0 0 3px ${C.dangerBg}` : 'none'
  const charCount = dv.length
  const overLimit = maxLength !== undefined && charCount > maxLength

  useEffect(() => {
    if (valueProp !== undefined) setInternal(valueProp)
  }, [valueProp])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value
      if (!controlled) setInternal(v)
      onChange?.(v)
      if (autoResize && ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height = `${ref.current.scrollHeight}px`
      }
    },
    [autoResize, onChange, controlled],
  )

  useEffect(() => {
    if (!autoResize || !ref.current) return
    const el = ref.current
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [autoResize, dv])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginBottom: 1,
            marginLeft: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {label}
          {required ? (
            <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>
          ) : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={dv}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        style={{
          padding: compact ? '6px 12px' : '10px 14px',
          borderRadius: 8,
          border: `1.5px solid ${bc}`,
          background: bg,
          fontFamily: F.body,
          fontSize: fs,
          color: disabled ? C.cinzaChumbo : C.cinzaEscuro,
          outline: 'none',
          resize: autoResize ? 'none' : disabled || readOnly ? 'none' : 'vertical',
          transition: 'all .18s',
          boxShadow: sh,
          cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
          opacity: disabled ? 0.6 : 1,
          minHeight: autoResize ? (compact ? 30 : 40) : undefined,
          lineHeight: 1.5,
          overflow: autoResize ? 'hidden' : 'auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3,
          marginLeft: 7,
          marginRight: 7,
        }}
      >
        {(helper || (error && errorMsg)) ? (
          <span
            style={{
              fontSize: 11,
              color: error ? C.danger : C.textMuted,
              fontFamily: F.body,
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {error ? errorMsg : helper}
          </span>
        ) : null}
        {maxLength !== undefined ? (
          <span
            style={{
              fontSize: 10,
              fontFamily: F.mono,
              color: overLimit ? C.danger : charCount > maxLength * 0.9 ? C.amareloEscuro : C.textLight,
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            {charCount}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ LAYOUT ═══════════════════════════════════════════ */
function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: C.azulClaro,
          fontFamily: F.title,
          marginBottom: 6,
        }}
      >
        {n}
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: C.cinzaEscuro,
          margin: '0 0 4px',
          fontFamily: F.title,
          letterSpacing: '.5px',
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: '0 0 20px', lineHeight: 1.55, fontFamily: F.body }}>
        {desc}
      </p>
      {children}
    </section>
  )
}

function Card({ children, s, mob: m }: { children: ReactNode; s?: CSSProperties; mob?: boolean }) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '12px 12px 12px 24px',
        border: `1px solid ${C.cardBorder}`,
        padding: m ? 16 : 28,
        boxShadow: '0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)',
        overflow: 'visible',
        ...s,
      }}
    >
      {children}
    </div>
  )
}

const gc: CSSProperties = {
  background: C.cardBg,
  border: `1px solid ${C.cardBorder}`,
  borderRadius: '10px 10px 10px 18px',
  overflow: 'hidden',
}
const gh: CSSProperties = {
  padding: '16px 20px',
  background: C.bg,
  borderBottom: `1px solid ${C.cardBorder}`,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}
const gb: CSSProperties = { padding: '16px 20px 20px' }
const gl: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: C.azulClaro,
  fontFamily: F.title,
  marginBottom: 4,
  marginTop: 12,
}
const gt: CSSProperties = { fontSize: 13, color: C.cinzaEscuro, lineHeight: 1.55, margin: 0, fontFamily: F.body }
const ge: CSSProperties = {
  fontSize: 12,
  color: C.cinzaChumbo,
  lineHeight: 1.5,
  margin: 0,
  fontFamily: F.body,
  fontStyle: 'italic',
  paddingLeft: 10,
  borderLeft: `2px solid ${C.azulCeuClaro}`,
}
const gk: CSSProperties = {
  fontSize: 11,
  fontFamily: F.mono,
  color: C.cinzaChumbo,
  background: C.cardBg,
  padding: '2px 8px',
  borderRadius: 4,
  border: `1px solid ${C.cardBorder}`,
}

function TokenRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontFamily: F.body }}>
      {color ? (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: color,
            border: `1px solid ${C.cardBorder}`,
            flexShrink: 0,
          }}
        />
      ) : null}
      <span style={{ color: C.cinzaChumbo, minWidth: 120 }}>{label}</span>
      <code style={{ background: C.neutro, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: F.mono, color: C.cinzaEscuro }}>
        {value}
      </code>
    </div>
  )
}

function DotLabel({ color, label, badge }: { color: string; label: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color,
          fontFamily: F.title,
          letterSpacing: '.5px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {badge ? <code style={gk}>{badge}</code> : null}
    </div>
  )
}

const guideItems = [
  {
    name: 'Padrão (resize)',
    c: C.azulProfundo,
    badge: '★ padrão',
    desc: 'Textarea com resize manual vertical. O usuário arrasta o canto para expandir.',
    when: 'Observações, descrições, contexto adicional. Quando o tamanho do texto é imprevisível.',
    not: 'Campos curtos de 1 linha — usar Input. Texto formatado com negrito/itálico — usar rich text editor externo.',
    ex: "'Observação' em formulários; 'Descrição' no App Ocorrências; 'Contexto' em modais de triagem.",
  },
  {
    name: 'Com contador',
    c: C.amareloEscuro,
    badge: 'maxLength',
    desc: 'Textarea com contador de caracteres em tempo real. Fica amarelo em 90% e vermelho acima do limite.',
    when: 'Justificativas com limite, comentários curtos, campos com regra de tamanho (ex: 200 caracteres).',
    not: 'Textos livres sem limite — usar Padrão. Campos com limite muito alto (5000+) — contador não agrega.',
    ex: "'Justificativa' em aprovações (max 500); 'Comentário' em ocorrências (max 300); 'Motivo' em rejeições.",
  },
  {
    name: 'Auto-resize',
    c: C.verdeFloresta,
    badge: 'cresce ao digitar',
    desc: 'Textarea que cresce automaticamente conforme o conteúdo. Sem barra de scroll, sem resize manual.',
    when: 'Descrições livres onde o visual importa (App Ideias), campos de chat, composições inline.',
    not: 'Formulários com espaço limitado — pode crescer demais. Modais compactos — usar Padrão com rows fixo.',
    ex: "'Descrição da ideia' no App Ideias; campos de comentário tipo chat; 'Detalhes' em formulários expansíveis.",
  },
  {
    name: 'Somente leitura',
    c: C.cinzaChumbo,
    badge: 'readOnly',
    desc: 'Textarea que exibe conteúdo sem permitir edição. Fundo branco, sem cursor de texto, sem resize.',
    when: 'Exibição de histórico, texto gerado pelo sistema, campo que já foi submetido e não pode mais ser editado.',
    not: 'Se o campo pode ser editado — usar variante Padrão. Se é só texto estático — usar parágrafo, não textarea.',
    ex: "'Observação original' em histórico de ocorrência; 'Descrição do protocolo' gerado pelo sistema.",
  },
]

/* ═══════════════════════════════════════════ EXPORT CODE ═══════════════════════════════════════════ */
const textareaExportCode = `// DS-FIPS — Textarea — Copy-paste ready
import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  azulProfundo: "#004B9B",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  cinzaClaro: "#C0CCD2",
  amareloEscuro: "#F6921E",
  danger: "#DC3545",
  dangerBg: "#FEF2F2",
  textMuted: "#7B8C96",
  textLight: "#7B8C96",
  inputBorder: "#E2E8F0",
  inputBg: "#FFFFFF",
  inputBgDisabled: "#F8FAFC",
  focusRing: "rgba(147,189,228,0.35)",
};

const Fn = {
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

export function DSTextarea({
  label, placeholder, rows = 3, required, error, errorMsg,
  disabled, readOnly, helper, compact, maxLength, autoResize,
  value: valueProp, defaultValue, onChange,
}: {
  label?: string; placeholder?: string; rows?: number;
  required?: boolean; error?: boolean; errorMsg?: string;
  disabled?: boolean; readOnly?: boolean; helper?: string;
  compact?: boolean; maxLength?: number; autoResize?: boolean;
  value?: string; defaultValue?: string; onChange?: (v: string) => void;
}) {
  const [internal, setInternal] = useState(() => valueProp ?? defaultValue ?? "");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fs = compact ? 12 : 13;
  const controlled = valueProp !== undefined;
  const dv = controlled ? valueProp : internal;
  const bc = error ? C.danger : focused ? C.azulProfundo : C.inputBorder;
  const bg = disabled ? C.inputBgDisabled : C.inputBg;
  const sh = focused && !error ? \`0 0 0 3px \${C.focusRing}\` : error && focused ? \`0 0 0 3px \${C.dangerBg}\` : "none";
  const charCount = dv.length;
  const overLimit = maxLength !== undefined && charCount > maxLength;

  useEffect(() => { if (valueProp !== undefined) setInternal(valueProp); }, [valueProp]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (!controlled) setInternal(v);
    onChange?.(v);
    if (autoResize && ref.current) { ref.current.style.height = "auto"; ref.current.style.height = \`\${ref.current.scrollHeight}px\`; }
  }, [autoResize, onChange, controlled]);

  useEffect(() => {
    if (!autoResize || !ref.current) return;
    const el = ref.current;
    el.style.height = "auto";
    el.style.height = \`\${el.scrollHeight}px\`;
  }, [autoResize, dv]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {label && (
        <label style={{ fontSize: compact ? 11 : 12, fontWeight: 600, color: C.cinzaEscuro, fontFamily: Fn.body, marginBottom: 1, marginLeft: 7, display: "flex", alignItems: "center", gap: 3 }}>
          {label}{required && <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>}
        </label>
      )}
      <textarea ref={ref} placeholder={placeholder} value={dv} onChange={handleChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        disabled={disabled} readOnly={readOnly} rows={rows}
        style={{ padding: compact ? "6px 12px" : "10px 14px", borderRadius: 8, border: \`1.5px solid \${bc}\`, background: bg, fontFamily: Fn.body, fontSize: fs, color: disabled ? C.cinzaChumbo : C.cinzaEscuro, outline: "none", resize: autoResize ? "none" : disabled || readOnly ? "none" : "vertical", transition: "all .18s", boxShadow: sh, cursor: disabled ? "not-allowed" : readOnly ? "default" : "text", opacity: disabled ? 0.6 : 1, minHeight: autoResize ? (compact ? 30 : 40) : undefined, lineHeight: 1.5, overflow: autoResize ? "hidden" : "auto", width: "100%", boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3, marginLeft: 7, marginRight: 7 }}>
        {(helper || (error && errorMsg)) && (
          <span style={{ fontSize: 11, color: error ? C.danger : C.textMuted, fontFamily: Fn.body, lineHeight: 1.3, flex: 1 }}>
            {error ? errorMsg : helper}
          </span>
        )}
        {maxLength !== undefined && (
          <span style={{ fontSize: 10, fontFamily: Fn.mono, color: overLimit ? C.danger : charCount > maxLength * 0.9 ? C.amareloEscuro : C.textLight, flexShrink: 0, marginLeft: 8 }}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

// Usage:
// <DSTextarea label="Observacao" placeholder="Descreva..." rows={4} required />
// <DSTextarea label="Justificativa" maxLength={200} helper="Min 20 caracteres." />
// <DSTextarea label="Descricao" autoResize />
`;

/* ═══════════════════════════════════════════ COPYABLE CODE GEN ═══════════════════════════════════════════ */
function textareaVariantCode(opts: {
  label?: string
  placeholder?: string
  rows?: number
  required?: boolean
  maxLength?: number
  autoResize?: boolean
  helper?: string
  compact?: boolean
  error?: boolean
  errorMsg?: string
  disabled?: boolean
  readOnly?: boolean
  value?: string
  defaultValue?: string
}): string {
  const props: string[] = []
  if (opts.label) props.push(`label="${opts.label}"`)
  if (opts.placeholder) props.push(`placeholder="${opts.placeholder}"`)
  if (opts.rows && opts.rows !== 3) props.push(`rows={${opts.rows}}`)
  if (opts.required) props.push('required')
  if (opts.maxLength) props.push(`maxLength={${opts.maxLength}}`)
  if (opts.autoResize) props.push('autoResize')
  if (opts.helper) props.push(`helper="${opts.helper}"`)
  if (opts.compact) props.push('compact')
  if (opts.error) props.push('error')
  if (opts.errorMsg) props.push(`errorMsg="${opts.errorMsg}"`)
  if (opts.disabled) props.push('disabled')
  if (opts.readOnly) props.push('readOnly')
  if (opts.value) props.push(`value="${opts.value}"`)
  if (opts.defaultValue) props.push(`defaultValue="${opts.defaultValue}"`)

  return `// DS-FIPS — Textarea "${opts.label || 'Textarea'}" — Copy-paste ready
import { DSTextarea } from "@design-system-fips/textarea";

<DSTextarea
  ${props.join('\n  ')}
/>`
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
export default function TextareaDoc() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const mob = w < 640
  const tab = w < 900
  const xl = w >= 1400
  const xxl = w >= 1800

  const vitrineCols = mob ? '1fr' : tab ? '1fr 1fr' : '1fr 1fr 1fr'
  const statesCols = mob ? '1fr' : xl ? '1fr 1fr 1fr' : '1fr 1fr'
  const guideCols = mob ? '1fr' : xl ? '1fr 1fr 1fr 1fr' : '1fr 1fr'
  const scenarioCols = mob ? '1fr' : xl ? '1fr 1fr 1fr 1fr' : '1fr 1fr'
  const counterCols = mob ? '1fr' : tab ? '1fr 1fr' : '1fr 1fr 1fr'
  const tokenCols = mob ? '1fr' : tab ? '1fr 1fr' : xl ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr'

  return (
    <PlaygroundProvider>
    <div
      style={{
        minHeight: '100vh',
        background: "var(--color-surface-muted)",
        fontFamily: F.body,
        color: C.cinzaEscuro,
      }}
    >
      <style>{`
textarea::placeholder{color:${C.textLight}}
        textarea:disabled::placeholder{color:${C.cinzaClaro}}
      `}</style>

      <header
        style={{
          background: `linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,
          padding: mob ? '32px 20px 30px' : xl ? '56px 56px 52px' : '48px 40px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: mob ? 250 : 400, height: 250 }} />
        <JunctionLines style={{ position: 'absolute', bottom: -40, left: -60, width: 300, height: 200, transform: 'scaleX(-1)' }} />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: `${C.branco}10`,
              border: `1px solid ${C.branco}18`,
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: C.amareloOuro,
              fontFamily: F.title,
              marginBottom: 16,
            }}
          >
            {Ic.grid(14, C.amareloOuro)} Design System FIPS
          </div>
          <h1 style={{ fontSize: mob ? 30 : 44, fontWeight: 700, color: C.branco, margin: '0 0 10px', fontFamily: F.title, letterSpacing: '1px' }}>
            Textarea
          </h1>
          <p style={{ fontSize: 16, color: `${C.branco}B0`, lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: F.body }}>
            Área de texto expandível para descrições, observações e justificativas. Suporta resize manual, auto-resize e contador de
            caracteres.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { l: 'padrão', c: C.azulProfundo },
              { l: 'contador', c: C.amareloEscuro },
              { l: 'auto-resize', c: C.verdeFloresta },
              { l: 'estados', c: C.danger },
            ].map((t) => (
              <div
                key={t.l}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: `${C.branco}08`,
                  border: `1px solid ${C.branco}15`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  color: `${C.branco}90`,
                  fontFamily: F.mono,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: t.c,
                    border: `1px solid ${C.branco}20`,
                    flexShrink: 0,
                  }}
                />
                {t.l}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div
        style={{
          padding: mob ? '24px 16px 40px' : xl ? '44px 56px 60px' : '36px 40px 60px',
          maxWidth: xxl ? 1600 : xl ? 1320 : 1100,
          margin: '0 auto',
        }}
      >
        <Section
          n="01"
          title="Tipos de textarea"
          desc="Todas as variantes em um só lugar. Clique em qualquer textarea para copiar o código. Digite nos campos para testar — resize, auto-resize e contador funcionam em tempo real."
        >
          <Card mob={mob}>
            <div style={{ display: 'grid', gridTemplateColumns: vitrineCols, gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DotLabel color={C.azulProfundo} label="Padrão" badge="resize manual" />
                <Copyable
                  label="Textarea Padrão"
                  code={textareaVariantCode({ label: 'Observação', placeholder: 'Descreva o contexto da solicitação, premissas e pontos de atenção...', rows: 4, required: true, helper: 'Use para detalhes que não cabem nos campos estruturados.' })}
                  preview={<DSTextarea label="Observação" placeholder="Descreva o contexto da solicitação, premissas e pontos de atenção..." rows={4} required helper="Use para detalhes que não cabem nos campos estruturados." />}
                >
                  <DSTextarea
                    label="Observação"
                    placeholder="Descreva o contexto da solicitação, premissas e pontos de atenção..."
                    rows={4}
                    required
                    helper="Use para detalhes que não cabem nos campos estruturados."
                  />
                </Copyable>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DotLabel color={C.amareloEscuro} label="Com contador" badge="maxLength" />
                <Copyable
                  label="Textarea com Contador"
                  code={textareaVariantCode({ label: 'Justificativa', placeholder: 'Descreva a justificativa da aprovação ou rejeição...', rows: 4, maxLength: 200, helper: 'Mínimo 20 caracteres para submissão.' })}
                  preview={<DSTextarea label="Justificativa" placeholder="Descreva a justificativa da aprovação ou rejeição..." rows={4} maxLength={200} helper="Mínimo 20 caracteres para submissão." />}
                >
                  <DSTextarea
                    label="Justificativa"
                    placeholder="Descreva a justificativa da aprovação ou rejeição..."
                    rows={4}
                    maxLength={200}
                    helper="Mínimo 20 caracteres para submissão."
                  />
                </Copyable>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <DotLabel color={C.verdeFloresta} label="Auto-resize" badge="cresce ao digitar" />
                <Copyable
                  label="Textarea Auto-resize"
                  code={textareaVariantCode({ label: 'Descrição da ideia', placeholder: 'Escreva livremente... o campo cresce conforme você digita.', autoResize: true, helper: 'Altura se ajusta automaticamente ao conteúdo.' })}
                  preview={<DSTextarea label="Descrição da ideia" placeholder="Escreva livremente... o campo cresce conforme você digita." autoResize helper="Altura se ajusta automaticamente ao conteúdo." />}
                >
                  <DSTextarea
                    label="Descrição da ideia"
                    placeholder="Escreva livremente... o campo cresce conforme você digita."
                    autoResize
                    helper="Altura se ajusta automaticamente ao conteúdo."
                  />
                </Copyable>
              </div>
            </div>
          </Card>
        </Section>

        <Section n="02" title="Anatomia do textarea" desc="Estrutura visual: label, área de texto, placeholder, helper, resize handle e contador de caracteres.">
          <Card mob={mob}>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.azulProfundo }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: C.cinzaEscuro,
                      fontFamily: F.title,
                    }}
                  >
                    Label
                  </span>
                </div>
                <div
                  style={{
                    marginLeft: 7,
                    marginBottom: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.cinzaEscuro,
                    fontFamily: F.body,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span style={{ opacity: 0.55 }}>{Ic.clipboard(14)}</span>
                  Observação <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>
                  <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.amareloOuro }} />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: C.amareloOuro,
                        fontFamily: F.title,
                      }}
                    >
                      Ícone no label
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '3px 0 4px', marginLeft: 7 }}>
                  <div style={{ height: 1, width: 20, background: C.amareloEscuro }} />
                  <span style={{ fontSize: 9, color: C.amareloEscuro, fontFamily: F.mono, fontWeight: 600 }}>1px</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.verdeFloresta }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: C.verdeFloresta,
                      fontFamily: F.title,
                    }}
                  >
                    Área de texto
                  </span>
                  <span style={{ fontSize: 10, color: C.textMuted }}>— resize handle no canto inferior-direito</span>
                </div>
                <DSTextarea placeholder="Descreva o contexto..." rows={3} maxLength={300} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.azulCeu }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: C.azulCeu,
                      fontFamily: F.title,
                    }}
                  >
                    Helper + Contador
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 250 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Espaçamentos</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  {[
                    { l: 'Label → Textarea', v: '1px' },
                    { l: 'Padding padrão', v: '10px 14px' },
                    { l: 'Padding compacto', v: '6px 12px' },
                    { l: 'Textarea → Helper', v: '3px' },
                    { l: 'Label marginLeft', v: '7px' },
                    { l: 'Line height', v: '1.5' },
                    { l: 'Border radius', v: '8px' },
                    { l: 'Min rows padrão', v: '3 linhas' },
                    { l: 'Min rows compacto', v: '2 linhas' },
                  ].map((s) => (
                    <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <code
                        style={{
                          background: `${C.amareloOuro}30`,
                          color: C.amareloEscuro,
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontFamily: F.mono,
                          fontWeight: 600,
                          minWidth: 75,
                          textAlign: 'center',
                        }}
                      >
                        {s.v}
                      </code>
                      <span style={{ fontSize: 12, color: C.cinzaEscuro, fontFamily: F.body }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section n="03" title="Guia de uso por tipo" desc="Significado, regras e exemplos FIPS para cada variante de textarea.">
          <div style={{ display: 'grid', gridTemplateColumns: guideCols, gap: 16 }}>
            {guideItems.map((t) => (
              <div key={t.name} style={{ ...gc, borderLeft: `4px solid ${t.c}` }}>
                <div style={gh}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>{t.name}</span>
                  <code style={gk}>{t.badge}</code>
                </div>
                <div style={gb}>
                  <p style={gt}>{t.desc}</p>
                  <div style={gl}>Quando usar</div>
                  <p style={gt}>{t.when}</p>
                  <div style={{ ...gl, color: C.danger }}>Quando NÃO usar</div>
                  <p style={{ ...gt, color: C.cinzaChumbo }}>{t.not}</p>
                  <div style={gl}>Exemplo FIPS</div>
                  <p style={ge}>{t.ex}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="Estados" desc="Cada estado comunica uma situação diferente. Clique nos campos para testar o foco real.">
          <div style={{ display: 'grid', gridTemplateColumns: statesCols, gap: 16 }}>
            {(
              [
                {
                  t: 'Padrão',
                  d: 'Campo aguardando interação. Borda cinza neutra.',
                  comp: <DSTextarea label="Descrição" placeholder="Detalhes e pontos de atenção..." rows={2} compact />,
                },
                {
                  t: 'Obrigatório',
                  d: 'Asterisco vermelho. Erro no submit se vazio.',
                  comp: <DSTextarea label="Observação" placeholder="Campo obrigatório..." rows={2} required compact />,
                  accent: 'warning' as const,
                },
                {
                  t: 'Em foco',
                  d: 'Borda azul + anel. Clique para testar.',
                  comp: <DSTextarea label="Descrição" placeholder="Clique aqui para ver o foco..." rows={2} compact />,
                },
                {
                  t: 'Com valor',
                  d: 'Texto preenchido em preto. Resize ativo.',
                  comp: (
                    <DSTextarea
                      label="Observação"
                      defaultValue="Detalhes principais do atendimento e pontos de atenção necessários para a equipe de campo."
                      rows={2}
                      compact
                    />
                  ),
                },
                {
                  t: 'Erro',
                  d: 'Borda vermelha + mensagem substituindo helper.',
                  comp: (
                    <DSTextarea
                      label="Justificativa"
                      rows={2}
                      required
                      error
                      errorMsg="Campo obrigatório. Mínimo de 20 caracteres."
                      compact
                    />
                  ),
                  accent: 'danger' as const,
                },
                {
                  t: 'Bloqueado',
                  d: 'Fundo cinza, cursor not-allowed, opacidade 60%.',
                  comp: (
                    <DSTextarea label="Descrição" value="Processo finalizado. Não é possível editar." rows={2} disabled compact />
                  ),
                },
              ] satisfies ReadonlyArray<{
                t: string
                d: string
                comp: ReactNode
                accent?: 'warning' | 'danger'
              }>
            ).map((s) => (
              <div
                key={s.t}
                style={{
                  ...gc,
                  ...(s.accent === 'danger'
                    ? { borderLeft: `4px solid ${C.danger}` }
                    : s.accent === 'warning'
                      ? { borderLeft: `4px solid ${C.amareloEscuro}` }
                      : {}),
                }}
              >
                <div style={gh}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: s.accent === 'danger' ? C.danger : C.azulEscuro,
                      fontFamily: F.title,
                    }}
                  >
                    {s.t}
                  </span>
                </div>
                <div style={{ ...gb, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.comp}
                  <p style={{ ...gt, fontSize: 12, color: C.cinzaChumbo, marginTop: 4 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section n="05" title="Tamanhos e linhas" desc="Controle de densidade por compact + número de rows. Desktop padrão vs Compacto para modais.">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div style={{ ...gc, borderLeft: `4px solid ${C.azulProfundo}` }}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Padrão</span>
                <code style={gk}>padding: 10px 14px</code>
              </div>
              <div style={{ ...gb, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DSTextarea label="3 linhas (padrão)" placeholder="Observações gerais..." rows={3} />
                <DSTextarea label="5 linhas" placeholder="Descrição detalhada do contexto..." rows={5} />
                <div style={{ ...gl, marginTop: 10, color: C.cinzaEscuro }}>&#9733; TAMANHO PADRÃO</div>
                <p style={gt}>Para formulários de cadastro, telas de detalhe. Padding confortável, font 13px.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Formulários do App Ocorrências, Suprimentos, SSMA — telas de edição desktop.</p>
              </div>
            </div>

            <div style={gc}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Compacto</span>
                <code style={gk}>padding: 6px 12px</code>
              </div>
              <div style={{ ...gb, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DSTextarea label="2 linhas (modal)" placeholder="Detalhes, contexto, links..." rows={2} compact />
                <DSTextarea label="4 linhas" placeholder="Justificativa completa..." rows={4} compact maxLength={300} />
                <div style={gl}>Onde usar</div>
                <p style={gt}>Modais, drawers, filtros avançados. Padding reduzido, font 12px. Menor pegada visual.</p>
                <div style={{ ...gl, color: C.danger }}>Onde NÃO usar</div>
                <p style={{ ...gt, color: C.cinzaChumbo }}>Formulários principais de cadastro — muito pequeno para textos longos.</p>
                <div style={gl}>Exemplo FIPS</div>
                <p style={ge}>Modais do App Suprimentos; filtros do Kanban; observação em triagem de ocorrências.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section n="06" title="Quando usar textarea" desc="Regras para decidir entre Input (1 linha) e Textarea (múltiplas linhas).">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: '#FFF7ED',
                border: '1px solid #FDBA74',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              {Ic.alerta(20, C.amareloEscuro)}
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 8px', fontFamily: F.body }}>
                  Input vs Textarea — regra de decisão
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { r: 'Texto curto, 1 linha (nome, email, número)', v: '→ Input', c: C.azulProfundo },
                    { r: 'Texto livre, 2+ linhas (observação, descrição)', v: '→ Textarea padrão', c: C.azulProfundo },
                    { r: 'Texto com limite de caracteres', v: '→ Textarea + contador', c: C.amareloEscuro },
                    { r: 'Texto livre sem limite que cresce dinamicamente', v: '→ Textarea auto-resize', c: C.verdeFloresta },
                    { r: 'Texto exibido sem edição', v: '→ Textarea readOnly', c: C.cinzaChumbo },
                    { r: 'Texto formatado (negrito, links, listas)', v: '→ Rich text editor (fora do DS)', c: C.danger },
                  ].map((i) => (
                    <div key={i.r} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontFamily: F.body }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: i.c, flexShrink: 0 }} />
                      <span style={{ color: C.cinzaChumbo, flex: 1 }}>{i.r}</span>
                      <span style={{ fontWeight: 700, color: i.c, whiteSpace: 'nowrap' }}>{i.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                background: `${C.azulCeuClaro}40`,
                border: `1px solid ${C.azulCeuClaro}`,
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: C.azulProfundo,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <span style={{ color: C.branco, fontSize: 12, fontWeight: 700 }}>i</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.body }}>
                  Rows recomendados por contexto
                </p>
                <p style={{ fontSize: 13, color: C.cinzaChumbo, margin: 0, lineHeight: 1.5, fontFamily: F.body }}>
                  Observação rápida: <strong>2–3 rows</strong>. Descrição detalhada: <strong>4–5 rows</strong>. Justificativa/parecer:{' '}
                  <strong>3–4 rows + contador</strong>. Texto livre criativo: <strong>auto-resize</strong>.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section n="07" title="Cenários de negócio" desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS.">
          <div style={{ display: 'grid', gridTemplateColumns: scenarioCols, gap: 16 }}>
            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px 10px 10px 20px', padding: mob ? 16 : 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Modal de triagem</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>App Ocorrências — observação em modal compacto</p>
              <div
                style={{
                  background: C.cardBg,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 8,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <DSTextarea label="Observação" placeholder="Contexto adicional para triagem..." rows={3} compact required />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    style={{
                      padding: '6px 16px',
                      fontSize: 12,
                      background: 'transparent',
                      border: `1px solid ${C.inputBorder}`,
                      borderRadius: 6,
                      color: C.cinzaChumbo,
                      cursor: 'pointer',
                      fontFamily: F.body,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '6px 16px',
                      fontSize: 12,
                      background: C.verdeFloresta,
                      border: 'none',
                      borderRadius: 6,
                      color: C.branco,
                      cursor: 'pointer',
                      fontFamily: F.body,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {Ic.save(12)} Salvar
                  </button>
                </div>
              </div>
            </div>

            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px 10px 10px 20px', padding: mob ? 16 : 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>
                Justificativa de aprovação
              </h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>App Suprimentos — parecer do gestor</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16 }}>
                <DSTextarea
                  label="Parecer do gestor"
                  placeholder="Justifique a aprovação ou rejeição desta requisição..."
                  rows={4}
                  required
                  maxLength={500}
                  helper="Obrigatório para aprovar ou rejeitar."
                />
              </div>
            </div>

            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px 10px 10px 20px', padding: mob ? 16 : 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Descrição de ideia</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>App Ideias — submissão de ideia (Fipcoins)</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16 }}>
                <DSTextarea
                  label="Descreva sua ideia"
                  placeholder="Escreva livremente sua ideia para melhorar processos, segurança ou eficiência na FIPS..."
                  autoResize
                  required
                  helper="Quanto mais detalhes, melhor a avaliação."
                />
              </div>
            </div>

            <div style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px 10px 10px 20px', padding: mob ? 16 : 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Histórico de ocorrência</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>App Ocorrências — registro original</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16 }}>
                <DSTextarea
                  label="Observação original"
                  value="Identificado vazamento de óleo na junção 47-B durante inspeção de rotina. Equipe de manutenção acionada às 14:30. Área isolada conforme protocolo SSMA."
                  rows={3}
                  readOnly
                />
              </div>
            </div>
          </div>
        </Section>

        <Section n="08" title="Contador de caracteres" desc="Comportamento visual do contador conforme o limite é atingido.">
          <Card mob={mob}>
            <div style={{ display: 'grid', gridTemplateColumns: counterCols, gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.cinzaEscuro, marginBottom: 8, fontFamily: F.body }}>
                  Abaixo de 90% — cinza neutro
                </p>
                <DSTextarea placeholder="Digite algo..." rows={2} maxLength={100} defaultValue="Texto curto." compact />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.amareloEscuro, marginBottom: 8, fontFamily: F.body }}>
                  90%+ — amarelo (atenção)
                </p>
                <DSTextarea
                  placeholder="Digite algo..."
                  rows={2}
                  maxLength={100}
                  defaultValue="Este texto está se aproximando do limite máximo de caracteres permitidos. Quase lá!"
                  compact
                />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.danger, marginBottom: 8, fontFamily: F.body }}>
                  Acima do limite — vermelho (erro)
                </p>
                <DSTextarea
                  placeholder="Digite algo..."
                  rows={2}
                  maxLength={50}
                  defaultValue="Este texto ultrapassou o limite máximo de caracteres permitidos pelo campo e precisa ser reduzido."
                  compact
                />
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { range: '0–89%', color: C.textLight, desc: 'Neutro — sem alerta' },
                { range: '90–100%', color: C.amareloEscuro, desc: 'Atenção — próximo do limite' },
                { range: '>100%', color: C.danger, desc: 'Erro — acima do permitido' },
              ].map((f) => (
                <div key={f.range} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: F.body }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: f.color }} />
                  <code style={gk}>{f.range}</code>
                  <span style={{ color: C.cinzaChumbo }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section n="09" title="Tokens de referência" desc="Valores de design utilizados neste componente — direto do Brandbook FIPS.">
          <Card mob={mob} s={{ display: 'flex', gap: mob ? 24 : 48, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gridTemplateColumns: tokenCols, gap: mob ? 24 : 32, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.5px',
                    color: C.textLight,
                    textTransform: 'uppercase',
                    fontFamily: F.title,
                    marginBottom: 4,
                  }}
                >
                  Bordas & fundos
                </span>
                <TokenRow label="Borda padrão" value="#CBD5E1" color={C.inputBorder} />
                <TokenRow label="Borda foco" value="#004B9B" color={C.azulProfundo} />
                <TokenRow label="Borda erro" value="#DC3545" color={C.danger} />
                <TokenRow label="Anel de foco" value="3px rgba(...)" color={C.azulCeu} />
                <TokenRow label="Fundo bloqueado" value="#F1F5F9" color="#F1F5F9" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.5px',
                    color: C.textLight,
                    textTransform: 'uppercase',
                    fontFamily: F.title,
                    marginBottom: 4,
                  }}
                >
                  Dimensões
                </span>
                <TokenRow label="Border radius" value="8px" />
                <TokenRow label="Padding padrão" value="10px 14px" />
                <TokenRow label="Padding compacto" value="6px 12px" />
                <TokenRow label="Min rows padrão" value="3" />
                <TokenRow label="Min rows compacto" value="2" />
                <TokenRow label="Resize" value="vertical (padrão)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.5px',
                    color: C.textLight,
                    textTransform: 'uppercase',
                    fontFamily: F.title,
                    marginBottom: 4,
                  }}
                >
                  Tipografia
                </span>
                <TokenRow label="Label" value="Open Sans 600 12px" />
                <TokenRow label="Texto" value="Open Sans 400 13px" />
                <TokenRow label="Placeholder" value="Open Sans 400 13px" />
                <TokenRow label="Helper" value="Open Sans 400 11px" />
                <TokenRow label="Contador" value="Fira Code 10px" />
                <TokenRow label="Line height" value="1.5" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.5px',
                    color: C.textLight,
                    textTransform: 'uppercase',
                    fontFamily: F.title,
                    marginBottom: 4,
                  }}
                >
                  Contador
                </span>
                <TokenRow label="< 90%" value="#94A3B8" color={C.textLight} />
                <TokenRow label="90–100%" value="#F6921E" color={C.amareloEscuro} />
                <TokenRow label="> 100%" value="#DC3545" color={C.danger} />
                <TokenRow label="Posição" value="flex-end, abaixo" />
                <TokenRow label="Font" value="Fira Code 600 10px" />
              </div>
            </div>
          </Card>
        </Section>

        <Section n="10" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
          <Card mob={mob}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Borda idle",light:"#CBD5E1",dark:"#3A3A3A"},
                {token:"Borda hover",light:"#93BDE4",dark:"#4A4A4A"},
                {token:"Borda focus",light:"#004B9B",dark:"#93BDE4"},
                {token:"Background",light:"#FFFFFF",dark:"#252525"},
                {token:"Texto",light:"#333B41",dark:"#E2E2E8"},
                {token:"Placeholder",light:"#6B7784",dark:"#A1A1AA"},
                {token:"Ring focus",light:"rgba(147,189,228,0.35)",dark:"rgba(147,189,228,0.2)"},
                {token:"Bg disabled",light:"#F1F5F9",dark:"#1E1E1E"},
                {token:"Borda erro",light:"#DC3545",dark:"#F87171"},
                {token:"Contador < 90%",light:"#94A3B8",dark:"#71717A"},
                {token:"Contador 90–100%",light:"#F6921E",dark:"#FBBF24"},
                {token:"Contador > 100%",light:"#DC3545",dark:"#F87171"},
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
          label: "Textarea",
          description: "Area de texto com resize, auto-resize, contador de caracteres e estados (error, disabled, readOnly).",
          code: textareaExportCode,
        }]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '.5px', fontFamily: F.title, fontWeight: 400 }}>
            DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
