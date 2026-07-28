import { useState, useEffect, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { PlaygroundProvider, CodePlayground } from '../../components/CodePlayground'
import { CodeExportSection } from '../../components/CodeExport'
import { fipsPalette, semanticColors, darkSemanticColors } from '../../../tokens/colors'

const C = { azulProfundo: 'var(--color-gov-azul-profundo)', azulEscuro: 'var(--color-gov-azul-escuro)', azulCeuClaro: '#D3E3F4', amareloOuro: '#FDC24E', cinzaChumbo: 'var(--color-fg-muted)', cinzaEscuro: 'var(--color-fg)', branco: '#FFFFFF', bg: 'var(--color-surface-muted)', cardBg: 'var(--color-surface)', cardBorder: 'var(--color-border)', textLight: 'var(--color-fg-muted)' }
const Fn = { title: "'Saira Expanded', sans-serif", body: "'Open Sans', sans-serif" }

function JunctionLines({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }}>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

const Ic = {
  grid: (s = 14, c = C.amareloOuro) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" /><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" /><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" /><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" /></svg>,
}

function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-gov-azul-claro)', fontFamily: Fn.title, marginBottom: 6 }}>{n}</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: Fn.title, letterSpacing: '0.5px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: '0 0 20px', lineHeight: 1.55, fontFamily: Fn.body }}>{desc}</p>
      {children}
    </section>
  )
}

function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [hex])
  return (
    <button
      onClick={copy}
      title={copied ? 'Copiado!' : `Copiar ${hex}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: 6, border: 'none',
        background: copied ? '#00C64C18' : 'transparent',
        cursor: 'pointer', padding: 0, flexShrink: 0,
        transition: 'all 0.15s ease',
      }}
    >
      {copied
        ? <Check size={13} color="#00C64C" strokeWidth={2.5} />
        : <Copy size={13} color="#7B8C96" strokeWidth={1.8} />
      }
    </button>
  )
}

const swatches = Object.entries(fipsPalette) as [string, string][]
const semantic = Object.entries(semanticColors) as [string, string][]

export default function ColorsPage() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h) }, [])
  const mob = w < 640

  return (
    <PlaygroundProvider>
    <div style={{ minHeight: '100vh', background: "var(--color-surface-muted)", fontFamily: Fn.body, color: C.cinzaEscuro }}>

      <header style={{ background: `linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)`, padding: mob ? '32px 20px' : '48px 40px 44px', position: 'relative', overflow: 'hidden' }}>
        <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: mob ? 250 : 400, height: 250 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${C.branco}10`, border: `1px solid ${C.branco}18`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.amareloOuro, fontFamily: Fn.title, marginBottom: 16 }}>{Ic.grid(14, C.amareloOuro)} Design System FIPS</div>
          <h1 style={{ fontSize: mob ? 30 : 44, fontWeight: 700, color: C.branco, margin: '0 0 10px', fontFamily: Fn.title }}>Cores</h1>
          <p style={{ fontSize: 16, color: `${C.branco}B0`, lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: Fn.body }}>Paleta oficial extraída do Brandbook FIPS: azul profundo, cinza chumbo, secundárias (céu, ouro, floresta) e neutros. Ajuste sempre com a equipe de marca antes de alterar valores.</p>
        </div>
      </header>

      <div style={{ padding: mob ? '24px 16px 40px' : '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

        <Section n="01" title="Paleta principal" desc="Cores primárias e secundárias do Brandbook FIPS.">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {swatches.map(([name, hex]) => {
              const displayName = name.replace(/([a-z])([A-Z])/g, '$1 $2')
              return (
              <div key={name} style={{ background: C.cardBg, borderRadius: '10px 10px 10px 18px', border: `1px solid ${C.cardBorder}`, overflow: 'hidden' }}>
                <div style={{ height: 96, width: '100%', background: hex }} />
                <div style={{ padding: '12px 16px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.cinzaEscuro, margin: '0 0 4px', fontFamily: Fn.title, textTransform: 'capitalize' }}>
                    {displayName}
                  </p>
                  <p style={{ fontSize: 12, fontFamily: "'Fira Code', monospace", color: C.cinzaChumbo, margin: 0, textTransform: 'uppercase' }}>{hex}</p>
                </div>
              </div>
              )
            })}
          </div>
        </Section>

        <Section n="02" title="Tokens semânticos (UI)" desc="Cores mapeadas para estados e elementos de interface.">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
            {semantic.map(([name, hex]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: `1px solid ${C.cardBorder}`, background: C.cardBg }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: hex, border: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.cinzaEscuro, margin: '0 0 2px', fontFamily: Fn.title, textTransform: 'capitalize' }}>
                    {String(name).replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </p>
                  <p style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: C.cinzaChumbo, margin: 0 }}>{hex}</p>
                </div>
                <CopyHex hex={hex} />
              </div>
            ))}
          </div>
        </Section>

        <Section n="03" title="Paleta Dark Mode" desc="Tokens semânticos do modo escuro. Estas cores são aplicadas automaticamente quando o tema dark está ativo. Use como referência ao estilizar componentes para ambos os modos.">
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
            {(Object.entries(darkSemanticColors) as [string, string][]).map(([name, hex]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: `1px solid ${C.cardBorder}`, background: C.cardBg }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: hex, border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.cinzaEscuro, margin: '0 0 2px', fontFamily: Fn.title }}>
                    {String(name).replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </p>
                  <p style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: C.cinzaChumbo, margin: 0 }}>{hex}</p>
                </div>
                <CopyHex hex={hex} />
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="Mapeamento Light → Dark" desc="Referência rápida de como cada token semântico muda entre os modos. Use esta tabela ao implementar componentes dark-aware.">
          <div style={{ background: C.cardBg, borderRadius: '10px 10px 10px 18px', border: `1px solid ${C.cardBorder}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: Fn.body, fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: Fn.title, fontWeight: 600, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: C.cinzaChumbo }}>Token</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: Fn.title, fontWeight: 600, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: C.cinzaChumbo }}>Light</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: Fn.title, fontWeight: 600, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: C.cinzaChumbo }}>Dark</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { token: 'surface', light: '#FFFFFF', dark: '#222222' },
                  { token: 'surface-muted', light: '#F5F8FC', dark: '#1A1A1A' },
                  { token: 'border', light: '#D7E0EA', dark: '#2E2E2E' },
                  { token: 'foreground', light: '#333B41', dark: '#E2E2E8' },
                  { token: 'fg-muted', light: '#6B7784', dark: '#A1A1AA' },
                  { token: 'primary', light: '#004B9B', dark: '#93BDE4' },
                  { token: 'accent', light: '#FDC24E', dark: '#FDC24E' },
                  { token: 'success', light: '#00C64C', dark: '#8BE5AD' },
                  { token: 'danger', light: '#EF4444', dark: '#FCA5A5' },
                  { token: 'input-border', light: '#D7E0EA', dark: '#3A3A3A' },
                  { token: 'input-focus', light: '#004B9B', dark: '#93BDE4' },
                  { token: 'badge-success-bg', light: 'rgba(0,198,76,0.14)', dark: 'rgba(0,198,76,0.14)' },
                  { token: 'badge-warning-bg', light: 'rgba(246,146,30,0.14)', dark: 'rgba(246,146,30,0.14)' },
                  { token: 'badge-danger-bg', light: 'rgba(239,68,68,0.14)', dark: 'rgba(239,68,68,0.14)' },
                ].map((r) => (
                  <tr key={r.token} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                    <td style={{ padding: '8px 16px', fontFamily: "'Fira Code', monospace", fontWeight: 600, color: C.cinzaEscuro }}>{r.token}</td>
                    <td style={{ padding: '8px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, borderRadius: 4, background: r.light, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                        <code style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: C.cinzaChumbo }}>{r.light}</code>
                      </span>
                    </td>
                    <td style={{ padding: '8px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, borderRadius: 4, background: r.dark, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                        <code style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: C.cinzaChumbo }}>{r.dark}</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <CodePlayground />

        {/* CodeExportSection removido — cores são tokens, não componentes */}
        {false && <CodeExportSection items={[
          {
            label: 'Paleta FIPS — CSS Variables',
            description: 'Todas as CSS variables de cor do DS-FIPS para light e dark mode.',
            code: `/* ═══════════════════════════════════════════
   FIPS Color Palette — CSS Custom Properties
   Cole no :root do seu projeto
   ═══════════════════════════════════════════ */

:root {
  /* ── Governamentais ── */
  --color-gov-azul-profundo: #004B9B;
  --color-gov-azul-escuro: #002A68;
  --color-gov-azul-claro: #658EC9;
  --color-gov-verde-escuro: #00904C;
  --color-gov-gradient-from: #002A68;
  --color-gov-gradient-to: #004B9B;

  /* ── Primarias ── */
  --color-primary: #004B9B;
  --color-secondary: #0090D0;
  --color-accent: #F6921E;
  --color-accent-strong: #F6921E;

  /* ── Semanticas (light) ── */
  --color-success: #00C64C;
  --color-success-strong: #00904C;
  --color-danger: #DC3545;
  --color-warning: #F6921E;

  /* ── Superficies (light) ── */
  --color-surface: #FFFFFF;
  --color-surface-muted: #F3F6FB;
  --color-surface-soft: #EDF2F7;
  --color-border: #D7E0EA;
  --color-border-strong: #C0CCD2;

  /* ── Foreground (light) ── */
  --color-fg: #333B41;
  --color-fg-muted: #6B7784;

  /* ── Neutras ── */
  --color-fips-yellow-400: #FDC24E;
  --color-fips-yellow-600: #F6921E;
  --color-fips-orange-100: rgba(246,146,30,0.12);
  --color-fips-blue-200: #93BDE4;
}

/* ── Dark mode overrides ── */
.dark, [data-theme="dark"] {
  --color-surface: #1A1A1A;
  --color-surface-muted: #121212;
  --color-surface-soft: #222222;
  --color-border: #2E2E2E;
  --color-border-strong: #3A3A3A;
  --color-fg: #E2E2E8;
  --color-fg-muted: #A1A1AA;
  --color-primary: #93BDE4;
  --color-success: #8BE5AD;
}`,
          },
          {
            label: 'Paleta FIPS — JS/TS Object',
            description: 'Objeto JavaScript com todas as cores da paleta FIPS.',
            code: `/* FIPS Color Palette — JS/TS Object */

export const fipsColors = {
  gov: {
    azulProfundo: '#004B9B',
    azulEscuro: '#002A68',
    azulClaro: '#658EC9',
    verdeEscuro: '#00904C',
    gradientFrom: '#002A68',
    gradientTo: '#004B9B',
  },
  primary: '#004B9B',
  secondary: '#0090D0',
  accent: '#F6921E',
  success: '#00C64C',
  danger: '#DC3545',
  warning: '#F6921E',
  neutral: {
    white: '#FFFFFF',
    surface: '#F3F6FB',
    border: '#D7E0EA',
    fg: '#333B41',
    fgMuted: '#6B7784',
  },
  dark: {
    surface: '#1A1A1A',
    surfaceMuted: '#121212',
    border: '#2E2E2E',
    fg: '#E2E2E8',
    fgMuted: '#A1A1AA',
  },
  fips: {
    yellow400: '#FDC24E',
    yellow600: '#F6921E',
    blue200: '#93BDE4',
    blue800: '#004B9B',
  },
} as const`,
          },
        ]} />}

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '0.5px', fontFamily: Fn.title, fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
