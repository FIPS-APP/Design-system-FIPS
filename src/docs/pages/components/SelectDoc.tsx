import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, CodePlayground } from '../../components/CodePlayground'

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
  chevron: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 8l4 4 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pessoa: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="6" r="3.5" stroke={c} strokeWidth="1.5" />
      <path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  busca: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke={c} strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  grid: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
    </svg>
  ),
  tag: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2 4a2 2 0 012-2h5.17a2 2 0 011.42.59l7.24 7.24a2 2 0 010 2.83l-5.17 5.17a2 2 0 01-2.83 0L2.59 10.6A2 2 0 012 9.17V4z"
        stroke={c}
        strokeWidth="1.5"
      />
      <circle cx="6.5" cy="6.5" r="1" fill={c} />
    </svg>
  ),
  limpar: (s = 14, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6 6l8 8M14 6l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  check: (s = 12, c = '#fff') => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  placa: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M6 5v10M14 5v10M2 10h16" stroke={c} strokeWidth="1.2" opacity=".4" />
    </svg>
  ),
  edificio: (s = 16, c = C.cinzaChumbo) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="2" width="14" height="16" rx="1.5" stroke={c} strokeWidth="1.5" />
      <path
        d="M7 6h2M11 6h2M7 10h2M11 10h2M8 14h4v4H8z"
        stroke={c}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
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

type SelectOption = string | { value: string; label: string }

/* ═══════════════════════════════════════════ 1. SELECT CUSTOM DROPDOWN ═══════════════════════════════════════════ */
function DSSelect({
  label,
  icon,
  options = [],
  placeholder = 'Selecione',
  required,
  error,
  errorMsg,
  disabled,
  helper,
  compact,
  value: cv,
  onChange,
}: {
  label?: string
  icon?: ReactNode
  options?: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: boolean
  errorMsg?: string
  disabled?: boolean
  helper?: string
  compact?: boolean
  value?: string
  onChange?: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(cv ?? '')
  const [hi, setHi] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)
  const sz = compact ? { h: 30, fs: 12 } : { h: 35, fs: 13 }
  const bc = error ? C.danger : open ? C.azulProfundo : C.inputBorder
  const getL = (v: string) => {
    const o = options.find((x) => (typeof x === 'string' ? x === v : x.value === v))
    return o ? (typeof o === 'string' ? o : o.label) : ''
  }
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  useEffect(() => {
    if (cv !== undefined) setVal(cv)
  }, [cv])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        position: 'relative',
        zIndex: open ? 30 : 1,
      }}
    >
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
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setOpen(!open)
          }
        }}
        onClick={() => !disabled && setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: sz.h,
          padding: '0 12px',
          background: disabled ? C.inputBgDisabled : C.inputBg,
          border: `1.5px solid ${bc}`,
          borderRadius: open ? '8px 8px 0 0' : 8,
          transition: 'all .18s',
          boxShadow: open && !error ? `0 0 0 3px ${C.focusRing}` : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: F.body,
          fontSize: sz.fs,
          opacity: disabled ? 0.6 : 1,
          userSelect: 'none',
        }}
      >
        {icon ? <span style={{ display: 'flex', flexShrink: 0, opacity: 0.55 }}>{icon}</span> : null}
        <span
          style={{
            flex: 1,
            color: val ? C.cinzaEscuro : C.textLight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingLeft: 2,
          }}
        >
          {val ? getL(val) : placeholder}
        </span>
        <span
          style={{
            display: 'flex',
            flexShrink: 0,
            opacity: 0.45,
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          {Ic.chevron(16)}
        </span>
      </div>
      {open && !disabled ? (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 20,
            background: C.inputBg,
            border: `1.5px solid ${C.azulProfundo}`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 6px 20px rgba(0,75,155,.12)',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {options.map((o, i) => {
            const oV = typeof o === 'string' ? o : o.value
            const oL = typeof o === 'string' ? o : o.label
            const sel = oV === val
            return (
              <div
                key={oV}
                role="option"
                aria-selected={sel}
                onClick={() => {
                  setVal(oV)
                  onChange?.(oV)
                  setOpen(false)
                }}
                onMouseEnter={() => setHi(i)}
                onMouseLeave={() => setHi(-1)}
                style={{
                  padding: `${compact ? 6 : 8}px 14px`,
                  paddingLeft: icon ? 38 : 14,
                  fontSize: sz.fs,
                  fontFamily: F.body,
                  color: sel ? C.azulProfundo : C.cinzaEscuro,
                  fontWeight: sel ? 600 : 400,
                  background: sel ? C.azulCeuClaro : i === hi ? C.bg : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {sel ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginLeft: -20, flexShrink: 0 }} aria-hidden>
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 4.5"
                      stroke={C.azulProfundo}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
                {oL}
              </div>
            )
          })}
        </div>
      ) : null}
      {helper || (error && errorMsg) ? (
        <span style={{ fontSize: 11, color: error ? C.danger : C.textMuted, marginTop: 3, marginLeft: 7, fontFamily: F.body }}>
          {error ? errorMsg : helper}
        </span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 2. AUTOCOMPLETE ═══════════════════════════════════════════ */
function DSAutocomplete({
  label,
  icon,
  options = [],
  placeholder = 'Buscar...',
  required,
  helper,
  compact,
}: {
  label?: string
  icon?: ReactNode
  options?: string[]
  placeholder?: string
  required?: boolean
  helper?: string
  compact?: boolean
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const iRef = useRef<HTMLInputElement>(null)
  const wRef = useRef<HTMLDivElement>(null)
  const sz = compact ? { h: 30, fs: 12 } : { h: 35, fs: 13 }
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (wRef.current && !wRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div
      ref={wRef}
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: open ? 30 : 1 }}
    >
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
      <div
        onClick={() => {
          if (!open) {
            setOpen(true)
            setTimeout(() => iRef.current?.focus(), 50)
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: sz.h,
          padding: '0 12px',
          background: C.inputBg,
          border: `1.5px solid ${open ? C.azulProfundo : C.inputBorder}`,
          borderRadius: 8,
          transition: 'all .18s',
          boxShadow: open ? `0 0 0 3px ${C.focusRing}` : 'none',
          cursor: 'pointer',
          fontFamily: F.body,
          fontSize: sz.fs,
        }}
      >
        {icon ? <span style={{ display: 'flex', flexShrink: 0, opacity: 0.55 }}>{icon}</span> : null}
        {selected && !open ? (
          <span style={{ flex: 1, color: C.cinzaEscuro, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selected}
          </span>
        ) : null}
        {(!selected || open) ? (
          <input
            ref={iRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setSelected('')
            }}
            onFocus={() => setOpen(true)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: F.body,
              fontSize: sz.fs,
              color: C.cinzaEscuro,
              minWidth: 0,
            }}
          />
        ) : null}
        {query || selected ? (
          <span
            style={{ display: 'flex', cursor: 'pointer', opacity: 0.45 }}
            onClick={(e) => {
              e.stopPropagation()
              setQuery('')
              setSelected('')
              setOpen(false)
            }}
          >
            {Ic.limpar(14)}
          </span>
        ) : null}
        <span
          style={{
            display: 'flex',
            flexShrink: 0,
            opacity: 0.45,
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          {Ic.chevron(16)}
        </span>
      </div>
      {open && filtered.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: C.inputBg,
            border: `1.5px solid ${C.azulProfundo}`,
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,75,155,.12)',
            zIndex: 10,
            maxHeight: 180,
            overflowY: 'auto',
          }}
        >
          {filtered.map((o) => (
            <div
              key={o}
              onClick={() => {
                setSelected(o)
                setQuery('')
                setOpen(false)
              }}
              style={{
                padding: '8px 14px',
                fontSize: sz.fs,
                fontFamily: F.body,
                color: o === selected ? C.azulProfundo : C.cinzaEscuro,
                fontWeight: o === selected ? 600 : 400,
                background: o === selected ? C.azulCeuClaro : 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.bg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = o === selected ? C.azulCeuClaro : 'transparent'
              }}
            >
              {o}
            </div>
          ))}
        </div>
      ) : null}
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, marginTop: 3, marginLeft: 7, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 3. MULTI-SELECT TAGS ═══════════════════════════════════════════ */
function DSMultiSelect({
  label,
  icon,
  options = [],
  placeholder = 'Selecione...',
  helper,
  compact,
}: {
  label?: string
  icon?: ReactNode
  options?: string[]
  placeholder?: string
  helper?: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState<string[]>([])
  const wRef = useRef<HTMLDivElement>(null)
  const sz = compact ? { fs: 12 } : { fs: 13 }
  const toggle = (v: string) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (wRef.current && !wRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div
      ref={wRef}
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: open ? 30 : 1 }}
    >
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginBottom: 1,
            marginLeft: 7,
          }}
        >
          {label}
        </label>
      ) : null}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minHeight: compact ? 30 : 35,
          padding: '4px 12px',
          background: C.inputBg,
          border: `1.5px solid ${open ? C.azulProfundo : C.inputBorder}`,
          borderRadius: 8,
          boxShadow: open ? `0 0 0 3px ${C.focusRing}` : 'none',
          cursor: 'pointer',
          flexWrap: 'wrap',
        }}
      >
        {icon ? <span style={{ display: 'flex', flexShrink: 0, opacity: 0.55 }}>{icon}</span> : null}
        {sel.length === 0 ? (
          <span style={{ fontSize: sz.fs, color: C.textLight, fontFamily: F.body, flex: 1 }}>{placeholder}</span>
        ) : null}
        {sel.map((s) => (
          <span
            key={s}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              background: C.azulCeuClaro,
              color: C.cinzaEscuro,
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              fontFamily: F.body,
            }}
          >
            {s}
            <span
              style={{ cursor: 'pointer', opacity: 0.6, display: 'flex' }}
              onClick={(e) => {
                e.stopPropagation()
                toggle(s)
              }}
            >
              {Ic.limpar(10, C.azulEscuro)}
            </span>
          </span>
        ))}
        <span
          style={{
            display: 'flex',
            flexShrink: 0,
            opacity: 0.45,
            marginLeft: 'auto',
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          {Ic.chevron(16)}
        </span>
      </div>
      {open ? (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: C.inputBg,
            border: `1.5px solid ${C.azulProfundo}`,
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,75,155,.12)',
            zIndex: 10,
            maxHeight: 180,
            overflowY: 'auto',
          }}
        >
          {options.map((o) => (
            <div
              key={o}
              onClick={() => toggle(o)}
              style={{
                padding: '8px 14px',
                fontSize: sz.fs,
                fontFamily: F.body,
                color: C.cinzaEscuro,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.bg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1.5px solid ${sel.includes(o) ? C.azulProfundo : C.inputBorder}`,
                  background: sel.includes(o) ? C.azulProfundo : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all .15s',
                  flexShrink: 0,
                }}
              >
                {sel.includes(o) ? Ic.check(10) : null}
              </div>
              {o}
            </div>
          ))}
        </div>
      ) : null}
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, marginTop: 3, marginLeft: 7, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 4. CHECKBOX GROUP ═══════════════════════════════════════════ */
function DSCheckboxGroup({
  label,
  options = [],
  helper,
  compact,
  required,
}: {
  label?: string
  options?: string[]
  helper?: string
  compact?: boolean
  required?: boolean
}) {
  const [sel, setSel] = useState<string[]>([])
  const toggle = (v: string) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
  const fs = compact ? 12 : 13

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 6 : 8 }}>
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginLeft: 2,
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
      {options.map((o) => {
        const checked = sel.includes(o)
        return (
          <div
            key={o}
            onClick={() => toggle(o)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: `1.5px solid ${checked ? C.azulProfundo : C.inputBorder}`,
                background: checked ? C.azulProfundo : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .15s',
                flexShrink: 0,
              }}
            >
              {checked ? Ic.check(11) : null}
            </div>
            <span style={{ fontSize: fs, color: C.cinzaEscuro, fontFamily: F.body }}>{o}</span>
          </div>
        )
      })}
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 28, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 5. RADIO GROUP ═══════════════════════════════════════════ */
function DSRadioGroup({
  label,
  options = [],
  helper,
  compact,
  required,
  value: cv,
  onChange,
}: {
  label?: string
  options?: string[]
  helper?: string
  compact?: boolean
  required?: boolean
  value?: string
  onChange?: (v: string) => void
}) {
  const [val, setVal] = useState(cv ?? '')
  const fs = compact ? 12 : 13
  useEffect(() => {
    if (cv !== undefined) setVal(cv)
  }, [cv])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 6 : 8 }}>
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginLeft: 2,
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
      {options.map((o) => {
        const checked = val === o
        return (
          <div
            key={o}
            onClick={() => {
              setVal(o)
              onChange?.(o)
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `1.5px solid ${checked ? C.azulProfundo : C.inputBorder}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .15s',
                flexShrink: 0,
              }}
            >
              {checked ? (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: C.azulProfundo,
                    transition: 'all .15s',
                  }}
                />
              ) : null}
            </div>
            <span style={{ fontSize: fs, color: C.cinzaEscuro, fontFamily: F.body }}>{o}</span>
          </div>
        )
      })}
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 28, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 6. TOGGLE / SWITCH ═══════════════════════════════════════════ */
function DSToggle({
  label,
  helper,
  compact,
  checked: cv,
  onChange,
  disabled,
  status,
}: {
  label?: string
  helper?: string
  compact?: boolean
  checked?: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
  status?: boolean
}) {
  const [on, setOn] = useState(cv ?? false)
  const w = compact ? 36 : 42
  const h = compact ? 20 : 24
  const dot = compact ? 16 : 20
  const bgOn = status ? C.verdeFloresta : C.azulProfundo
  const bgOff = status ? C.danger : C.cinzaClaro
  useEffect(() => {
    if (cv !== undefined) setOn(cv)
  }, [cv])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        onClick={() => {
          if (disabled) return
          const next = !on
          setOn(next)
          onChange?.(next)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div
          style={{
            width: w,
            height: h,
            borderRadius: h,
            background: on ? bgOn : bgOff,
            transition: 'background .2s',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: dot,
              height: dot,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,.2)',
              transition: 'transform .2s',
              transform: on ? `translateX(${w - dot - 4}px)` : 'translateX(0)',
            }}
          />
        </div>
        {label ? (
          <span style={{ fontSize: compact ? 12 : 13, color: C.cinzaEscuro, fontFamily: F.body, fontWeight: 500 }}>
            {label}
          </span>
        ) : null}
        {status ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              fontFamily: F.mono,
              color: on ? C.verdeFloresta : C.danger,
              letterSpacing: '0.5px',
            }}
          >
            {on ? 'ON' : 'OFF'}
          </span>
        ) : null}
      </div>
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: w + 10, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 7. CHIP SELECT ═══════════════════════════════════════════ */
function DSChipSelect({
  label,
  options = [],
  helper,
  compact,
  multiple,
  required,
}: {
  label?: string
  options?: string[]
  helper?: string
  compact?: boolean
  multiple?: boolean
  required?: boolean
}) {
  const [sel, setSel] = useState<string[]>([])
  const toggle = (v: string) => {
    if (multiple) {
      setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
    } else {
      setSel((p) => (p[0] === v ? [] : [v]))
    }
  }
  const fs = compact ? 11 : 12

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginLeft: 2,
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
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = sel.includes(o)
          return (
            <div
              key={o}
              onClick={() => toggle(o)}
              style={{
                padding: compact ? '4px 12px' : '6px 16px',
                borderRadius: 20,
                border: `1.5px solid ${active ? C.azulProfundo : C.inputBorder}`,
                background: active ? C.azulProfundo : 'transparent',
                color: active ? '#FFFFFF' : C.cinzaEscuro,
                fontSize: fs,
                fontFamily: F.body,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all .15s',
                userSelect: 'none',
              }}
            >
              {o}
            </div>
          )
        })}
      </div>
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 7b. CHIP FILTRO (dropdown fechado, uso exclusivo em filtros) ═══════════════════════════════════════════ */
function DSChipFiltro({
  icon,
  label,
  options = [],
  value: cv,
  onChange,
}: {
  icon?: ReactNode
  label: string
  options?: string[]
  value?: string
  onChange?: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(cv ?? options[0] ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', width: 'fit-content' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: C.cinzaEscuro,
          background: C.cardBg,
          border: `1px solid ${open ? C.azulProfundo : C.cardBorder}`,
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: F.body,
          boxShadow: open ? `0 0 0 2px ${C.azulProfundo}1F` : 'none',
          transition: 'all .15s',
        }}
      >
        {icon ? <span style={{ display: 'flex', flexShrink: 0, opacity: 0.6 }}>{icon}</span> : null}
        <span style={{ color: C.cinzaChumbo, flexShrink: 0 }}>{label}:</span>
        <span style={{ fontWeight: 700, color: C.cinzaEscuro, whiteSpace: 'nowrap' }}>{val}</span>
        <span
          style={{
            display: 'flex',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
          }}
        >
          {Ic.chevron(10)}
        </span>
      </button>
      {open ? (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 6px)',
            zIndex: 50,
            minWidth: '100%',
            background: C.cardBg,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: '8px 8px 8px 14px',
            boxShadow: '0 12px 36px rgba(0,42,104,.18),0 2px 8px rgba(0,42,104,.06)',
            padding: '6px 0',
          }}
        >
          {options.map((o) => {
            const active = o === val
            return (
              <div
                key={o}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setVal(o)
                  onChange?.(o)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  color: active ? C.azulProfundo : C.cinzaEscuro,
                  cursor: 'pointer',
                  background: active ? `${C.azulProfundo}10` : 'transparent',
                  whiteSpace: 'nowrap',
                  fontFamily: F.body,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: `1.5px solid ${active ? C.azulProfundo : C.cardBorder}`,
                  }}
                >
                  {active ? (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.azulProfundo }} />
                  ) : null}
                </span>
                <span>{o}</span>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ 8. SEGMENTED CONTROL ═══════════════════════════════════════════ */
function DSSegmented({
  label,
  options = [],
  helper,
  compact,
  value: cv,
  onChange,
}: {
  label?: string
  options?: string[]
  helper?: string
  compact?: boolean
  value?: string
  onChange?: (v: string) => void
}) {
  const [val, setVal] = useState(cv ?? options[0] ?? '')
  const fs = compact ? 11 : 12
  const h = compact ? 28 : 34
  useEffect(() => {
    if (cv !== undefined) setVal(cv)
  }, [cv])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label ? (
        <label
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: C.cinzaEscuro,
            fontFamily: F.body,
            marginLeft: 2,
          }}
        >
          {label}
        </label>
      ) : null}
      <div
        style={{
          display: 'inline-flex',
          background: C.bg,
          borderRadius: 8,
          padding: 3,
          border: `1px solid ${C.cardBorder}`,
        }}
      >
        {options.map((o) => {
          const active = val === o
          return (
            <div
              key={o}
              onClick={() => {
                setVal(o)
                onChange?.(o)
              }}
              style={{
                padding: `0 ${compact ? 14 : 18}px`,
                height: h,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                background: active ? C.cardBg : 'transparent',
                color: active ? C.azulProfundo : C.cinzaChumbo,
                fontSize: fs,
                fontFamily: F.body,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all .15s',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                userSelect: 'none',
              }}
            >
              {o}
            </div>
          )
        })}
      </div>
      {helper ? (
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>{helper}</span>
      ) : null}
    </div>
  )
}

/* ═══════════════════════════════════════════ LAYOUT (mesmo padrão que ProgressDoc) ═══════════════════════════════════════════ */
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
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: '0 0 20px', lineHeight: 1.55, fontFamily: F.body }}>{desc}</p>
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
const gt: CSSProperties = {
  fontSize: 13,
  color: C.cinzaEscuro,
  lineHeight: 1.55,
  margin: 0,
  fontFamily: F.body,
}
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
      <span style={{ color: C.cinzaChumbo, minWidth: 110 }}>{label}</span>
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
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {badge ? <code style={gk}>{badge}</code> : null}
    </div>
  )
}
/* ═══════════════════════════════════════════ EXPORT CODE ═══════════════════════════════════════════ */
const selectExportCode = `// DS-FIPS — Select (Custom Dropdown) — Copy-paste ready
import { useState, useEffect, useRef } from "react";

const C = {
  azulProfundo: "#004B9B",
  azulEscuro: "#002A68",
  cinzaChumbo: "#7B8C96",
  cinzaEscuro: "#333B41",
  azulCeuClaro: "#D3E3F4",
  danger: "#DC3545",
  bg: "#F8FAFC",
  cardBg: "#FFFFFF",
  textMuted: "#7B8C96",
  textLight: "#7B8C96",
  inputBorder: "#CBD5E1",
  inputBg: "#FFFFFF",
  inputBgDisabled: "#F8FAFC",
  focusRing: "rgba(147,189,228,0.35)",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

type SelectOption = string | { value: string; label: string };

export function DSSelect({
  label, icon, options = [], placeholder = "Selecione",
  required, error, errorMsg, disabled, helper, compact,
  value: cv, onChange,
}: {
  label?: string; icon?: React.ReactNode; options?: SelectOption[];
  placeholder?: string; required?: boolean; error?: boolean;
  errorMsg?: string; disabled?: boolean; helper?: string;
  compact?: boolean; value?: string; onChange?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(cv ?? "");
  const [hi, setHi] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const sz = compact ? { h: 30, fs: 12 } : { h: 35, fs: 13 };
  const bc = error ? C.danger : open ? C.azulProfundo : C.inputBorder;
  const getL = (v: string) => {
    const o = options.find((x) => (typeof x === "string" ? x === v : x.value === v));
    return o ? (typeof o === "string" ? o : o.label) : "";
  };
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  useEffect(() => { if (cv !== undefined) setVal(cv); }, [cv]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: open ? 30 : 1 }}>
      {label && (
        <label style={{ fontSize: compact ? 11 : 12, fontWeight: 600, color: C.cinzaEscuro, fontFamily: Fn.body, marginBottom: 1, marginLeft: 7, display: "flex", alignItems: "center", gap: 3 }}>
          {label}{required && <span style={{ color: C.danger, fontWeight: 700, fontSize: 14 }}>*</span>}
        </label>
      )}
      <div role="button" tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen(!open); } }}
        onClick={() => !disabled && setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, height: sz.h, padding: "0 12px", background: disabled ? C.inputBgDisabled : C.inputBg, border: \`1.5px solid \${bc}\`, borderRadius: open ? "8px 8px 0 0" : 8, transition: "all .18s", boxShadow: open && !error ? \`0 0 0 3px \${C.focusRing}\` : "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: Fn.body, fontSize: sz.fs, opacity: disabled ? 0.6 : 1, userSelect: "none" }}>
        {icon && <span style={{ display: "flex", flexShrink: 0, opacity: 0.55 }}>{icon}</span>}
        <span style={{ flex: 1, color: val ? C.cinzaEscuro : C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 2 }}>
          {val ? getL(val) : placeholder}
        </span>
        <span style={{ display: "flex", flexShrink: 0, opacity: 0.45, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke={C.cinzaChumbo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
      {open && !disabled && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, background: C.inputBg, border: \`1.5px solid \${C.azulProfundo}\`, borderTop: "none", borderRadius: "0 0 8px 8px", boxShadow: "0 6px 20px rgba(0,75,155,.12)", maxHeight: 200, overflowY: "auto" }}>
          {options.map((o, i) => {
            const oV = typeof o === "string" ? o : o.value;
            const oL = typeof o === "string" ? o : o.label;
            const sel = oV === val;
            return (
              <div key={oV} role="option" aria-selected={sel}
                onClick={() => { setVal(oV); onChange?.(oV); setOpen(false); }}
                onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}
                style={{ padding: \`\${compact ? 6 : 8}px 14px\`, fontSize: sz.fs, fontFamily: Fn.body, color: sel ? C.azulProfundo : C.cinzaEscuro, fontWeight: sel ? 600 : 400, background: sel ? C.azulCeuClaro : i === hi ? C.bg : "transparent", cursor: "pointer" }}>
                {oL}
              </div>
            );
          })}
        </div>
      )}
      {(helper || (error && errorMsg)) && (
        <span style={{ fontSize: 11, color: error ? C.danger : C.textMuted, marginTop: 3, marginLeft: 7, fontFamily: Fn.body }}>
          {error ? errorMsg : helper}
        </span>
      )}
    </div>
  );
}

// Usage:
// <DSSelect label="Departamento" options={["Operações","Logística","TI"]} required />
// <DSSelect label="Status" options={[{value:"a",label:"Ativo"},{value:"i",label:"Inativo"}]} compact />
`;

/* ═══════════════════════════════════════════ MAIN (padrão ProgressDoc: mob / tab / xl / xxl) ═══════════════════════════════════════════ */
export default function SelectDoc() {
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
  const vitrineGap = mob ? 20 : xl ? 32 : 28
  const guideGrid = mob ? '1fr' : xl ? '1fr 1fr 1fr 1fr' : '1fr 1fr'
  const tokenGrid = mob ? '1fr' : tab ? '1fr 1fr' : xl ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr'
  const tokenGap = mob ? 24 : xl ? 32 : 24

  const guideItems = [
    {
      name: 'Select',
      c: C.azulProfundo,
      badge: '★ padrão',
      desc: 'Dropdown custom com lista fechada. Mais usado do sistema.',
      when: '3 a 15 opções fixas. Status, departamento, segmento, tipo de veículo.',
      not: 'Acima de 15 opções (usar Autocomplete). Seleção múltipla (usar Multi-select).',
      ex: "'Status' em filtros; 'Tipo de Veículo' no App Visitante; 'Segmento' no cadastro.",
    },
    {
      name: 'Autocomplete',
      c: C.azulCeu,
      badge: 'busca',
      desc: 'Input com busca + dropdown filtrado. Para listas longas ou dados dinâmicos.',
      when: '15+ opções, dados do banco, busca de entidades (fornecedor, cliente, colaborador).',
      not: 'Menos de 10 opções fixas — select nativo é mais rápido.',
      ex: "'Fornecedor' no Suprimentos; 'Empresa' no Contpix; 'Responsável' com 50+ pessoas.",
    },
    {
      name: 'Multi-select',
      c: C.amareloEscuro,
      badge: 'tags',
      desc: 'Seleção de múltiplos valores com tags removíveis e checkboxes.',
      when: 'Permissões, categorias, filtros múltiplos, associação N:N.',
      not: 'Quando só 1 valor pode ser escolhido — use Select ou Radio.',
      ex: "'Permissões' no controle de acesso; 'Tipos de carga' em filtros; 'Tags' no App Ideias.",
    },
    {
      name: 'Checkbox',
      c: C.verdeFloresta,
      badge: 'múltipla',
      desc: 'Lista visível de opções com checkmark. Todas as opções aparentes na tela.',
      when: '2 a 8 opções que devem ficar visíveis. Termos/consentimento. Filtros compactos.',
      not: 'Mais de 8 opções — usar Multi-select. Opção única — usar Radio.',
      ex: "'Notificações' (email, SMS, push); aceite de termos; filtros de relatório Power BI.",
    },
    {
      name: 'Radio',
      c: C.danger,
      badge: 'exclusiva',
      desc: 'Lista visível de opções mutuamente exclusivas. Só 1 pode estar selecionado.',
      when: '2 a 6 opções exclusivas que devem ficar visíveis. Prioridade, tipo, frequência.',
      not: 'Mais de 6 opções — usar Select. Binário sim/não — usar Toggle.',
      ex: "'Prioridade' em ocorrências; 'Tipo de acesso' (interno/externo); 'Frequência' no SSMA.",
    },
    {
      name: 'Toggle',
      c: C.cinzaEscuro,
      badge: 'on/off',
      desc: 'Switch binário liga/desliga. Dois modos: Padrão (azul/cinza) para preferências, e Status (verde ON / vermelho OFF) para indicadores operacionais.',
      when: 'Ativação/desativação de recurso. Preferências sim/não. Status operacional (prop status). Habilitar/desabilitar campo.',
      not: 'Mais de 2 opções — usar Radio ou Select. Ação irreversível — usar botão com confirmação.',
      ex: "'Notificações ativas' (padrão); 'Sistema operante' (status verde/vermelho); 'Alerta de emergência' no SSMA.",
    },
    {
      name: 'Chip Select',
      c: C.amareloOuro,
      badge: 'visual',
      desc: 'Botões visuais tipo pílula para seleção rápida. Alto impacto visual.',
      when: '2 a 6 opções curtas. Turnos, categorias visuais, filtros rápidos em dashboards.',
      not: 'Textos longos — não cabem em chips. Muitas opções — usar Select.',
      ex: "'Turno' (Manhã/Tarde/Noite); 'Tipo' em filtros rápidos; categorias do App Ideias.",
    },
    {
      name: 'Chip Filtro',
      c: C.azulEscuro,
      badge: 'uso: filtros',
      desc: 'Botão fechado "Rótulo: Valor" que abre um dropdown com radio. Visual de chip, comportamento de Select.',
      when: 'Barra de filtros de listagem/toolbar. 2 a 8 opções, uma selecionada por vez.',
      not: 'Dentro de formulário — usar Select. Múltiplas opções visíveis ao mesmo tempo — usar Chip Select.',
      ex: "'Departamento' e 'Segmento' nos Filtros avançados; toolbar do Data Listing.",
    },
    {
      name: 'Segmented',
      c: C.azulClaro,
      badge: 'tabs',
      desc: 'Barra de controle tipo tabs para alternar modos. Parecido com tab bar.',
      when: '2 a 4 modos de visualização ou filtro. Lista/Kanban/Grid. Dia/Semana/Mês.',
      not: 'Mais de 4 opções — vira confuso. Seleção de dados — não é para isso.',
      ex: "'Visualização' (Lista/Kanban/Grid); 'Período' (Dia/Semana/Mês); modo do dashboard.",
    },
  ] as const

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
        @import url('https://fonts.googleapis.com/css2?family=Saira+Expanded:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap');
        input::placeholder{color:${C.textLight}}
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
          <h1
            style={{
              fontSize: mob ? 30 : 44,
              fontWeight: 700,
              color: C.branco,
              margin: '0 0 10px',
              fontFamily: F.title,
              letterSpacing: '1px',
            }}
          >
            Select
          </h1>
          <p
            style={{
              fontSize: 16,
              color: `${C.branco}B0`,
              lineHeight: 1.6,
              maxWidth: 700,
              margin: 0,
              fontFamily: F.body,
            }}
          >
            Todos os tipos de seleção do DS-FIPS: dropdowns, busca, multi-select, checkbox, radio, toggle, chips e segmented control.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { l: 'dropdown', c: C.azulProfundo },
              { l: 'autocomplete', c: C.azulCeu },
              { l: 'multi', c: C.amareloEscuro },
              { l: 'checkbox', c: C.verdeFloresta },
              { l: 'radio', c: C.danger },
              { l: 'toggle', c: C.cinzaEscuro },
              { l: 'chips', c: C.amareloOuro },
              { l: 'segmented', c: C.azulClaro },
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
          title="Tipos de seleção"
          desc="9 componentes de seleção para cobrir qualquer cenário."
        >
          <Card mob={mob}>
            <div style={{ display: 'grid', gridTemplateColumns: vitrineCols, gap: vitrineGap, overflow: 'visible' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'visible' }}>
                <DotLabel color={C.azulProfundo} label="Select" badge="dropdown" />
                <DSSelect
                  label="Departamento"
                  icon={Ic.edificio()}
                  options={['Operações', 'Logística', 'TI', 'SSMA', 'Financeiro', 'RH']}
                  required
                />
                <DotLabel color={C.azulCeu} label="Autocomplete" badge="15+ opções" />
                <DSAutocomplete
                  label="Fornecedor"
                  icon={Ic.busca()}
                  options={[
                    'FIPS Logística',
                    'MRS Logística',
                    'VLI Multimodal',
                    'Rumo S.A.',
                    'Porto de Santos',
                    'ALL Logística',
                    'Brado',
                    'Hidrovias do Brasil',
                  ]}
                  compact
                />
                <DotLabel color={C.amareloEscuro} label="Multi-select" badge="tags" />
                <DSMultiSelect label="Permissões" icon={Ic.tag()} options={['Visualizar', 'Editar', 'Excluir', 'Aprovar', 'Exportar']} compact />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <DotLabel color={C.verdeFloresta} label="Checkbox" badge="múltipla" />
                <DSCheckboxGroup
                  label="Notificações"
                  options={['Email', 'SMS', 'Push', 'WhatsApp']}
                  helper="Selecione uma ou mais opções."
                />
                <div style={{ marginTop: 6 }} />
                <DotLabel color={C.danger} label="Radio" badge="exclusiva" />
                <DSRadioGroup
                  label="Prioridade"
                  options={['Baixa', 'Média', 'Alta', 'Urgente']}
                  value="Média"
                  helper="Apenas uma opção."
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <DotLabel color={C.cinzaEscuro} label="Toggle" badge="on/off" />
                <DSToggle label="Notificações ativas" checked />
                <DSToggle label="Modo escuro" />
                <DSToggle label="Sistema operante" checked status />
                <DSToggle label="Bloqueio de acesso" status />
                <DSToggle label="Campo bloqueado" disabled />
                <div style={{ marginTop: 6 }} />
                <DotLabel color={C.amareloOuro} label="Chip Select" badge="visual" />
                <DSChipSelect label="Turno" options={['Manhã', 'Tarde', 'Noite']} />
                <div style={{ marginTop: 6 }} />
                <DotLabel color={C.azulEscuro} label="Chip Filtro" badge="uso: filtros" />
                <DSChipFiltro
                  icon={Ic.edificio(14)}
                  label="Departamento"
                  options={['Todos', 'Operações', 'Logística', 'TI', 'SSMA', 'RH']}
                  value="Todos"
                />
                <div style={{ marginTop: 6 }} />
                <DotLabel color={C.azulClaro} label="Segmented" badge="tabs" />
                <DSSegmented label="Visualização" options={['Lista', 'Kanban', 'Grid']} />
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: '14px 18px',
                background: `${C.amareloOuro}15`,
                borderRadius: 8,
                border: `1px solid ${C.amareloOuro}40`,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: C.amareloEscuro, fontFamily: F.body }}>Quando usar:</span>
              {[
                { r: '3–15 opções', v: 'Select', c: C.azulProfundo },
                { r: '15+ ou busca', v: 'Autocomplete', c: C.azulCeu },
                { r: 'N opções simultâneas', v: 'Multi-select', c: C.amareloEscuro },
                { r: 'Lista visível c/ multi', v: 'Checkbox', c: C.verdeFloresta },
                { r: 'Lista visível exclusiva', v: 'Radio', c: C.danger },
                { r: 'Sim/Não binário', v: 'Toggle', c: C.cinzaEscuro },
                { r: 'Poucas opções visuais', v: 'Chips', c: C.amareloOuro },
                { r: 'Barra de filtros/toolbar', v: 'Chip Filtro', c: C.azulEscuro },
                { r: '2–4 modos de view', v: 'Segmented', c: C.azulClaro },
              ].map((i) => (
                <span
                  key={i.r}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontFamily: F.body,
                    background: C.cardBg,
                    padding: '3px 8px',
                    borderRadius: 5,
                    border: `1px solid ${C.cardBorder}`,
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: i.c }} />
                  <span style={{ color: C.cinzaChumbo }}>{i.r}</span>
                  <span style={{ fontWeight: 700, color: i.c }}>→ {i.v}</span>
                </span>
              ))}
            </div>
          </Card>
        </Section>

        <Section n="02" title="Guia de uso por tipo" desc="Significado, regras e exemplos FIPS para cada componente de seleção.">
          <div style={{ display: 'grid', gridTemplateColumns: guideGrid, gap: 16 }}>
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

        <Section
          n="03"
          title="Cenários de negócio"
          desc="Composições reais aplicadas em contextos operacionais do ecossistema FIPS."
        >
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '10px 10px 10px 20px',
                padding: mob ? 16 : 24,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>App Acesso Visitante</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>Tipo de veículo + toggle condicional</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DSSelect
                  label="Tipo de veículo"
                  icon={Ic.placa()}
                  options={[
                    'A pé',
                    'Bicicleta',
                    'Moto',
                    'Carro',
                    'Van/Furgão',
                    'Pickup',
                    'Caminhão Leve',
                    'Caminhão Pesado',
                    'Cavalo Mecânico',
                  ]}
                  required
                  compact
                />
                <DSToggle label="Entrada com carga" compact />
              </div>
            </div>

            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '10px 10px 10px 20px',
                padding: mob ? 16 : 24,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Filtros do Suprimentos</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>Segmented + Select + Chips</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DSSegmented options={['Todos', 'Pendentes', 'Aprovados']} compact />
                <DSSelect label="Segmento" icon={Ic.tag()} options={['Todos', 'Grãos', 'Contêiner', 'Granel']} compact value="Todos" />
                <DSChipSelect label="Prioridade" options={['Baixa', 'Média', 'Alta', 'Urgente']} compact />
              </div>
            </div>

            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '10px 10px 10px 20px',
                padding: mob ? 16 : 24,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Configuração SSMA</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>Checkboxes + Radio + Toggle</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <DSCheckboxGroup label="Alertas" options={['Email', 'SMS', 'Push']} compact />
                <DSRadioGroup label="Frequência" options={['Diário', 'Semanal', 'Mensal']} value="Semanal" compact />
                <DSToggle label="Alerta de emergência" checked compact status />
              </div>
            </div>

            <div
              style={{
                background: C.bg,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: '10px 10px 10px 20px',
                padding: mob ? 16 : 24,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: F.title }}>Controle de acesso</h3>
              <p style={{ fontSize: 12, color: C.cinzaChumbo, margin: '0 0 16px' }}>Autocomplete + Multi-select</p>
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <DSAutocomplete
                  label="Colaborador"
                  icon={Ic.pessoa()}
                  options={['Diogo Paiva', 'Carlos Santos', 'Ana Costa', 'Felipe Nunes', 'Maria Lima']}
                  compact
                  required
                />
                <DSMultiSelect label="Permissões" icon={Ic.tag()} options={['Visualizar', 'Editar', 'Excluir', 'Aprovar', 'Admin']} compact />
              </div>
            </div>
          </div>
        </Section>

        <Section n="04" title="Tokens de referência" desc="Valores de design utilizados nos componentes de seleção.">
          <Card
            mob={mob}
            s={{
              display: 'grid',
              gridTemplateColumns: tokenGrid,
              gap: tokenGap,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: C.textLight,
                  textTransform: 'uppercase',
                  fontFamily: F.title,
                  marginBottom: 4,
                }}
              >
                Cores
              </span>
              <TokenRow label="Selecionado" value="#004B9B" color={C.azulProfundo} />
              <TokenRow label="Hover" value="#F2F4F8" color={C.bg} />
              <TokenRow label="Tag multi" value="#D3E3F4" color={C.azulCeuClaro} />
              <TokenRow label="Toggle on" value="#004B9B" color={C.azulProfundo} />
              <TokenRow label="Toggle off" value="#C0CCD2" color={C.cinzaClaro} />
              <TokenRow label="Status on" value="#00C64C" color={C.verdeFloresta} />
              <TokenRow label="Status off" value="#DC3545" color={C.danger} />
              <TokenRow label="Chip ativo" value="#004B9B" color={C.azulProfundo} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: C.textLight,
                  textTransform: 'uppercase',
                  fontFamily: F.title,
                  marginBottom: 4,
                }}
              >
                Dimensões
              </span>
              <TokenRow label="Select height" value="35px / 30px" />
              <TokenRow label="Checkbox/Radio" value="18 × 18px" />
              <TokenRow label="Toggle" value="42 × 24px" />
              <TokenRow label="Toggle compact" value="36 × 20px" />
              <TokenRow label="Chip radius" value="20px (pill)" />
              <TokenRow label="Segmented h" value="34px / 28px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: C.textLight,
                  textTransform: 'uppercase',
                  fontFamily: F.title,
                  marginBottom: 4,
                }}
              >
                Dropdown
              </span>
              <TokenRow label="Max height" value="200px" />
              <TokenRow label="Sombra" value="0 6px 20px" />
              <TokenRow label="Borda aberto" value="#004B9B" />
              <TokenRow label="Radius" value="8px" />
              <TokenRow label="Anel de foco" value="3px rgba(...)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: C.textLight,
                  textTransform: 'uppercase',
                  fontFamily: F.title,
                  marginBottom: 4,
                }}
              >
                Tipografia
              </span>
              <TokenRow label="Label" value="Open Sans 600 12px" />
              <TokenRow label="Opção" value="Open Sans 400 13px" />
              <TokenRow label="Tag" value="Open Sans 600 11px" />
              <TokenRow label="Chip" value="Open Sans 400 12px" />
              <TokenRow label="Helper" value="Open Sans 400 11px" />
            </div>
          </Card>
        </Section>

        <Section n="05" title="Modo Dark" desc="Comportamento e tokens do componente no tema escuro. O DS-FIPS garante consistência visual em ambos os modos — claro e escuro.">
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
                {token:"Dropdown bg",light:"#FFFFFF",dark:"#2A2A2A"},
                {token:"Option hover",light:"#F2F4F8",dark:"#333333"},
                {token:"Option selected",light:"#D3E3F4",dark:"rgba(147,189,228,0.2)"},
                {token:"Checkbox checked",light:"#004B9B",dark:"#93BDE4"},
                {token:"Toggle on",light:"#004B9B",dark:"#1A6FC4"},
                {token:"Toggle off",light:"#C0CCD2",dark:"#4A4A4A"},
                {token:"Chip active",light:"#004B9B",dark:"#93BDE4"},
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
          label: "Select (Custom Dropdown)",
          description: "Dropdown customizado com lista fechada, ícone, estados e variantes compact/error/disabled.",
          code: selectExportCode,
        }]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '0.5px', fontFamily: F.title, fontWeight: 400 }}>
            DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
