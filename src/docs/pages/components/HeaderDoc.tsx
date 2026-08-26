// @ts-nocheck
import { useEffect, useState } from 'react'
import { BookOpen, Component, Home, LayoutDashboard, Palette } from 'lucide-react'
import { CodeExportSection } from '../../components/CodeExport'
import { DocHeaderSectionNavDemo } from '../../../components/layout/DocHeaderSectionNav'
import { DocHeaderStandardPreview } from '../../../components/layout/DocHeaderStandard'
import { SHELL_HERO_ART_SRC } from '../../../lib/shellHeroArt'

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
}
const Fn = { title: "'Saira Expanded', sans-serif", body: "'Open Sans', sans-serif", mono: "'Fira Code', monospace" }

const Ic = {
  grid: (s = 14, c = C.amareloOuro) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
    </svg>
  ),
}

function JunctionLines({ style }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, ...style }}>
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke={C.branco} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function Section({ n, title, desc, children }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: C.azulClaro,
          fontFamily: Fn.title,
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
          fontFamily: Fn.title,
          letterSpacing: '.5px',
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: C.cinzaChumbo, margin: '0 0 20px', lineHeight: 1.55, fontFamily: Fn.body }}>{desc}</p>
      {children}
    </section>
  )
}

function DSCard({ children, mob: m }) {
  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: '12px 12px 12px 24px',
        border: `1px solid ${C.cardBorder}`,
        padding: m ? 16 : 28,
        boxShadow: '0 1px 3px rgba(0,75,155,.04),0 4px 14px rgba(0,75,155,.03)',
      }}
    >
      {children}
    </div>
  )
}

const gl = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: C.azulClaro,
  fontFamily: Fn.title,
  marginBottom: 4,
  marginTop: 12,
}
const gt = { fontSize: 13, color: C.cinzaEscuro, lineHeight: 1.55, margin: 0, fontFamily: Fn.body }
const gk = {
  fontSize: 11,
  fontFamily: Fn.mono,
  color: C.cinzaChumbo,
  background: C.cardBg,
  padding: '2px 8px',
  borderRadius: 4,
  border: `1px solid ${C.cardBorder}`,
}

/* ── Helper: código copy-paste por variante do Header ── */
const HEADER_FULL_CODE = `// DS-FIPS — Header completo (breadcrumb + busca + ações + section nav) — Copy-paste ready
import { useState } from "react";

const SECTIONS = [
  { label: "Início", icon: "🏠", active: false },
  { label: "Padrões", icon: "📐", active: false },
  { label: "Fundamentos", icon: "🎨", active: false },
  { label: "Componentes", icon: "✨", active: true },
  { label: "Projeto", icon: "📖", active: false },
];

export function AppHeader({
  breadcrumb = ["Componentes", "Header"],
  userName = "Usuário",
  activeSection = "Componentes",
  onSectionChange,
  onToggleDark,
}) {
  const [search, setSearch] = useState("");

  return (
    <header style={{ borderBottom: "1px solid #E2E8F0" }}>
      {/* Top bar: breadcrumb + busca + ações */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "12px 24px", background: "#FFFFFF",
      }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          {breadcrumb.map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: "#7B8C96", fontSize: 12 }}>/</span>}
              <span style={{
                fontSize: i === breadcrumb.length - 1 ? 16 : 13,
                fontWeight: i === breadcrumb.length - 1 ? 700 : 400,
                color: i === breadcrumb.length - 1 ? "#333B41" : "#7B8C96",
                fontFamily: i === breadcrumb.length - 1 ? "'Saira Expanded', sans-serif" : "'Open Sans', sans-serif",
              }}>{item}</span>
            </span>
          ))}
        </nav>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
          borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", minWidth: 200,
        }}>
          <span style={{ fontSize: 14, color: "#7B8C96" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#333B41", fontFamily: "'Open Sans', sans-serif", flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔔</button>
          {onToggleDark && <button onClick={onToggleDark} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌙</button>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#004B9B", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'Saira Expanded', sans-serif" }}>{userName.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#333B41", fontFamily: "'Open Sans', sans-serif" }}>{userName}</span>
          </div>
        </div>
      </div>

      {/* Section nav tabs */}
      <nav style={{
        display: "flex", alignItems: "center", height: 39,
        background: "#FFFFFF", borderTop: "1px solid #F1F5F9",
        position: "relative",
      }}>
        {SECTIONS.map((s, i) => {
          const isActive = s.label === activeSection;
          return (
            <button key={i}
              onClick={() => onSectionChange?.(s.label)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 24px", height: "100%",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                fontFamily: "'Open Sans', sans-serif",
                color: isActive ? "#002A68" : "#7B8C96",
                background: "transparent", border: "none", cursor: "pointer",
                position: "relative",
                transition: "color 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
              {isActive && (
                <span style={{
                  position: "absolute", bottom: -1, left: 0, right: 0,
                  height: 3, background: "#F6921E",
                  borderRadius: "3px 3px 0 0",
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

// Uso:
// <AppHeader
//   breadcrumb={["Componentes", "Button"]}
//   userName="Admin"
//   activeSection="Componentes"
//   onSectionChange={(section) => navigate(section)}
//   onToggleDark={() => toggleDark()}
// />
`;

const HEADER_DOC_DEMO_TABS = [
  { id: 'start', label: 'Início', active: false, icon: Home },
  { id: 'patterns', label: 'Padrões', active: false, icon: LayoutDashboard },
  { id: 'foundations', label: 'Fundamentos', active: false, icon: Palette },
  { id: 'components', label: 'Componentes', active: true, icon: Component },
  { id: 'meta', label: 'Projeto', active: false, icon: BookOpen },
]

export default function HeaderDoc() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const mob = w < 640

  return (
    <div
      style={{
        minHeight: '100vh',
        background: "var(--color-surface-muted)",
        fontFamily: Fn.body,
        color: C.cinzaEscuro,
      }}
    >
      <style>{`
`}</style>

      <header
        style={{
          background: `linear-gradient(135deg,${C.azulProfundo} 0%,${C.azulEscuro} 100%)`,
          padding: mob ? '32px 20px' : '48px 40px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <JunctionLines style={{ position: 'absolute', top: -10, right: -20, width: mob ? 250 : 400, height: 250 }} />
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
              fontFamily: Fn.title,
              marginBottom: 16,
            }}
          >
            {Ic.grid(14, C.amareloOuro)} Design System FIPS
          </div>
          <h1 style={{ fontSize: mob ? 30 : 44, fontWeight: 700, color: C.branco, margin: '0 0 10px', fontFamily: Fn.title }}>Header</h1>
          <p style={{ fontSize: 16, color: `${C.branco}B0`, lineHeight: 1.6, maxWidth: 720, margin: 0, fontFamily: Fn.body }}>
            Barra superior do shell de documentação: contexto da seção, título da página, busca e ações. Fundo com imagem + gradientes (mesmo padrão do Application Shell), faixas em vidro e tipografia clara sobre o hero.
          </p>
        </div>
      </header>

      <div style={{ padding: mob ? '24px 16px 40px' : '36px 40px 60px', maxWidth: 1100, margin: "0 auto" }}>
        <Section
          n="01"
          title="Finalidade"
          desc="O header ancora o usuário na hierarquia (grupo → página), oferece atalho de busca quando houver e mantém navegação rápida entre grandes áreas do DS. O conteúdo do header permanece legível sobre imagem e overlays; em viewport estreita o menu mobile substitui parte da linha de utilitários."
        >
          <DSCard mob={mob}>
            <p style={gt}>
              Use este padrão em todas as áreas internas do produto que sigam o shell da documentação, para consistência com <code style={gk}>DocLayout</code>. O corpo da página segue em <code style={gk}>--color-surface-muted</code>; o header empilha imagem, gradientes e camadas semitransparentes com blur.
            </p>
          </DSCard>
        </Section>

        <Section
          n="02"
          title="Anatomia"
          desc="Da esquerda para a direita: controle de menu (mobile), ícone de painel, coluna de título (eyebrow + badge opcional + H2), busca (md+), botões neumórficos (notificações, tutorial) e chip de conta (sm+)."
        >
          <DSCard mob={mob}>
            <div style={gl}>Header completo</div>
            <p style={{ ...gt, marginBottom: 16 }}>
              Preview real do header padrão DS-FIPS com breadcrumb, busca, notificações, dark mode e avatar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <DocHeaderStandardPreview
                groupLabel="Componentes"
                pageTitle="Header"
                sectionNav={<DocHeaderSectionNavDemo tabs={HEADER_DOC_DEMO_TABS} />}
                withCardChrome={false}
              />
            </div>
          </DSCard>
        </Section>

        <Section
          n="03"
          title="Tokens e comportamento"
          desc="Sticky com blur; faixas do header com bordas claras sobre o hero; tabs ativas em branco com traço âmbar (accent)."
        >
          <DSCard mob={mob}>
            <ul style={{ margin: 0, paddingLeft: 20, fontFamily: Fn.body, fontSize: 13, color: C.cinzaEscuro, lineHeight: 1.65 }}>
              <li>
                <code style={gk}>sticky top-0 z-20</code> — permanece visível ao rolar o conteúdo.
              </li>
              <li>
                Arte <code style={gk}>{SHELL_HERO_ART_SRC}</code> + lavagem em <code style={gk}>#002A68</code> / <code style={gk}>#004B9B</code> (tokens em <code style={gk}>docHeaderChrome.ts</code>, alinhados ao sidebar).
              </li>
              <li>
                Faixas com blur; bordas <code style={gk}>white/6–8%</code> e vidro <code style={gk}>white/8–16%</code> como no <code style={gk}>DocsNeuSidebar</code>.
              </li>
              <li>
                Título: <code style={gk}>font-heading</code> + <code style={gk}>text-lg font-semibold</code>.
              </li>
            </ul>
          </DSCard>
        </Section>

        <Section
          n="04"
          title="Espaçamentos da barra de tabs"
          desc="Medidas obrigatórias da faixa de navegação por seções (SectionNav). Referência: Governança TI v1.1.1."
        >
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                { label: 'Altura da nav', value: '39px', token: 'navHeightPx' },
                { label: 'Padding vertical (tab)', value: '8px', token: 'paddingYPx' },
                { label: 'Padding horizontal (tab)', value: '24px', token: 'paddingXPx' },
                { label: 'Font size', value: '13px', token: 'fontSizePx' },
                { label: 'Gap ícone–label', value: '7px', token: 'iconGapPx' },
                { label: 'Tamanho do ícone', value: '14px', token: 'iconSizePx' },
                { label: 'Altura do indicador', value: '3px', token: 'indicatorHeightPx' },
                { label: 'Cor do indicador', value: '#F6921E', token: 'accentHex' },
                { label: 'Border-bottom da nav', value: '2px', token: 'borderBottomPx' },
                { label: 'Padding externo (wrapper)', value: '0px top, 0px bottom', token: 'pt-0 pb-0' },
              ].map((item) => (
                <div key={item.token} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,background:C.bg}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background: item.value.startsWith('#') ? item.value : C.amareloEscuro,flexShrink:0}} />
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.cinzaEscuro,fontFamily:Fn.body}}>{item.label}</div>
                    <div style={{fontSize:11,fontFamily:Fn.mono,color:C.cinzaChumbo}}>
                      {item.value} — <code style={{...gk,padding:'1px 5px',fontSize:10}}>{item.token}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{...gt,fontSize:11,color:C.textMuted,marginTop:12}}>
              Tokens definidos em <code style={gk}>docHeaderChrome.ts</code> → objeto <code style={gk}>docHeaderTabsUnderlineMd</code>.
              O wrapper da nav usa <code style={gk}>pt-0 pb-0</code> sem padding extra — a altura visual total é exatamente <strong>39px</strong>.
            </p>
          </div>
        </Section>

        <Section
          n="05"
          title="Implementação de referência"
          desc="Implementação canônica em layout + shell; evite divergências de espaçamento (px-4 py-3 / sm:px-6) e de hierarquia de título."
        >
          <DSCard mob={mob}>
            <p style={gt}>
              Shell: <code style={gk}>src/app/DocLayout.tsx</code>. Pré-visualização e fundo hero:{' '}
              <code style={gk}>src/components/layout/DocHeaderStandard.tsx</code>; botão de ícone neumórfico:{' '}
              <code style={gk}>DocHeaderNeuIconButton.tsx</code>.
            </p>
          </DSCard>
        </Section>

        <Section
          n="06"
          title="Modo Dark"
          desc="Tokens e comportamento do componente no tema escuro. Consistência visual garantida em ambos os modos."
        >
          <div style={{background:C.cardBg,borderRadius:"10px 10px 10px 18px",border:`1px solid ${C.cardBorder}`,padding:mob?16:24}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
              {[
                {token:"Header bg",light:"linear-gradient(#004B9B,#002A68)",dark:"linear-gradient(#0F1923,#0A1119)"},
                {token:"Header border",light:"rgba(255,255,255,0.08)",dark:"rgba(255,255,255,0.06)"},
                {token:"Title text",light:"#FFFFFF",dark:"#D1D9E0"},
                {token:"Eyebrow text",light:"#FDC24E",dark:"#FDC24E"},
                {token:"Muted text",light:"rgba(255,255,255,0.69)",dark:"rgba(255,255,255,0.55)"},
                {token:"Icon button bg",light:"rgba(255,255,255,0.12)",dark:"rgba(255,255,255,0.08)"},
                {token:"Tab active",light:"#FFFFFF",dark:"#D1D9E0"},
                {token:"Tab inactive",light:"rgba(255,255,255,0.55)",dark:"rgba(255,255,255,0.4)"},
                {token:"Tab accent",light:"#FDC24E",dark:"#F6921E"},
                {token:"Search bg",light:"rgba(255,255,255,0.1)",dark:"rgba(255,255,255,0.06)"},
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
          </div>
        </Section>

        <CodeExportSection items={[{
          label:"DocHeader",
          description:"Header padrão DS-FIPS com breadcrumb, busca, notificações, dark mode toggle e user chip. Clique no header acima para copiar.",
          code: HEADER_FULL_CODE,
        }]}/>
      </div>
    </div>
  )
}
