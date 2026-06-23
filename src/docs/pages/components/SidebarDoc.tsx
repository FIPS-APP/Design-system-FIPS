import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import {
  AppWindow,
  Blocks,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Component,
  FormInput,
  Gauge,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  PanelLeft,
  PanelTop,
  Ruler,
  ScanText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  SwatchBook,
  TableProperties,
  Timer,
  Type,
  type LucideIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { bottomNavItems } from '../../../routes/nav'
import { useFipsTheme } from '../../../hooks/useFipsTheme'

/* ═══════════════════════════════════════════ TOKENS (página — mesmo padrão SelectDoc) ═══════════════════════════════════════════ */
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

const F = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
}

type SidebarTheme = {
  bg: string
  border: string
  iconBgIdle: string
  iconBorderIdle: string
  textMuted: string
  textHover: string
  textActive: string
  accentFrom: string
  accentTo: string
  accentBorderStrong: string
  accentBorderSoft: string
  accentGlow: string
  iconActive: string
  chevron: string
  idleShadow: string
  hoverShadow: string
  activeShadow: string
  tooltipBg: string
  tooltipText: string
}

/* Sidebar theme (DS-FIPS original menu blue) */
const TN_DARK: SidebarTheme = {
  bg: '#002A68',
  border: 'rgba(255,255,255,0.06)',
  iconBgIdle: 'rgba(255,255,255,0.08)',
  iconBorderIdle: '#1a3d6e',
  textMuted: 'rgba(255,255,255,0.75)',
  textHover: 'rgba(255,255,255,0.92)',
  textActive: '#fafafa',
  accentFrom: C.amareloEscuro,
  accentTo: '#FFD37B',
  accentBorderStrong: 'rgba(246,146,30,0.58)',
  accentBorderSoft: 'rgba(253,194,78,0.50)',
  accentGlow: 'rgba(246,146,30,0.42)',
  iconActive: '#002A68',
  chevron: 'rgba(255,255,255,0.55)',
  idleShadow: '0 3px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.45) inset',
  hoverShadow:
    '0 10px 20px -10px rgba(246,146,30,0.55), 0 2px 3px rgba(0,42,104,0.34), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -2px 4px rgba(140,72,0,0.28)',
  activeShadow:
    '0 12px 24px -12px rgba(246,146,30,0.62), 0 2px 4px rgba(0,42,104,0.38), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -3px 6px rgba(120,64,0,0.36)',
  tooltipBg: '#002A68',
  tooltipText: '#fafafa',
}

/* Sidebar theme (Dark Mode — fundo escuro neumórfico) */
const TN_DARKMODE: SidebarTheme = {
  bg: '#1A1A1A',
  border: 'rgba(255,255,255,0.06)',
  iconBgIdle: 'rgba(255,255,255,0.06)',
  iconBorderIdle: '#3f3f46',
  textMuted: 'rgba(255,255,255,0.65)',
  textHover: 'rgba(255,255,255,0.88)',
  textActive: '#fafafa',
  accentFrom: C.amareloEscuro,
  accentTo: '#FFD37B',
  accentBorderStrong: 'rgba(246,146,30,0.58)',
  accentBorderSoft: 'rgba(253,194,78,0.50)',
  accentGlow: 'rgba(246,146,30,0.42)',
  iconActive: '#1A1A1A',
  chevron: 'rgba(255,255,255,0.45)',
  idleShadow: '0 3px 10px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.55) inset',
  hoverShadow:
    '0 10px 20px -10px rgba(246,146,30,0.50), 0 2px 3px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(140,72,0,0.28)',
  activeShadow:
    '0 12px 24px -12px rgba(246,146,30,0.55), 0 2px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -3px 6px rgba(120,64,0,0.36)',
  tooltipBg: '#333B41',
  tooltipText: '#fafafa',
}

const Ic = {
  grid: (s = 14, c = C.amareloOuro) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.4" />
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

/* ═══════════════════════════════════════════ Sidebar DS-FIPS — Demo interativa ═══════════════════════════════════════════ */

export interface SidebarBadges {
  financeiroPendente: number
  notaPendente: number
  producaoEmAndamento: number
  estoqueAbaixoMinimo: number
}

function useDemoSidebarBadges(): SidebarBadges {
  return useMemo(
    () => ({
      financeiroPendente: 3,
      notaPendente: 5,
      producaoEmAndamento: 2,
      estoqueAbaixoMinimo: 0,
    }),
    [],
  )
}

type MenuItem = {
  icon: LucideIcon
  label: string
  href?: string
  badge?: keyof SidebarBadges
  children?: MenuItem[]
  perfis?: string[]
}

const MENU: MenuItem[] = [
  { icon: Sparkles, label: 'Visão geral', href: '/docs' },
  { icon: ShieldCheck, label: 'Governança', href: '/docs/governance' },
  {
    icon: LayoutDashboard,
    label: 'PADRÕES',
    children: [
      { icon: PanelLeft, label: 'Application Shell', href: '/docs/patterns/application-shell' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/docs/patterns/dashboard' },
      { icon: TableProperties, label: 'Data Listing', href: '/docs/patterns/data-listing' },
      { icon: FormInput, label: 'Form Workspace', href: '/docs/patterns/form-workspace' },
      { icon: ScanText, label: 'Modal Workflow', href: '/docs/patterns/modal-workflow' },
      { icon: MonitorSmartphone, label: 'Hero', href: '/docs/patterns/hero' },
    ],
  },
  {
    icon: Palette,
    label: 'FUNDAMENTOS',
    children: [
      { icon: Palette, label: 'Cores', href: '/docs/foundations/colors' },
      { icon: Type, label: 'Tipografia', href: '/docs/foundations/typography' },
      { icon: Ruler, label: 'Espaçamento', href: '/docs/foundations/spacing' },
      { icon: SwatchBook, label: 'Raios', href: '/docs/foundations/radius' },
      { icon: Layers3, label: 'Sombras', href: '/docs/foundations/shadows' },
      { icon: MousePointer2, label: 'Iconografia', href: '/docs/foundations/icons' },
    ],
  },
  {
    icon: Component,
    label: 'COMPONENTES',
    children: [
      { icon: Component, label: 'Button', href: '/docs/components/button' },
      { icon: FormInput, label: 'Field', href: '/docs/components/field' },
      { icon: FormInput, label: 'Input', href: '/docs/components/input' },
      { icon: Gauge, label: 'Progress', href: '/docs/components/progress' },
      { icon: SearchCheck, label: 'Select', href: '/docs/components/select' },
      { icon: AppWindow, label: 'Textarea', href: '/docs/components/textarea' },
      { icon: Blocks, label: 'Badge', href: '/docs/components/badge' },
      { icon: LayoutTemplate, label: 'Card', href: '/docs/components/card' },
      { icon: BookOpen, label: 'Tabs', href: '/docs/components/tabs' },
      { icon: TableProperties, label: 'Table', href: '/docs/components/table' },
      { icon: ScanText, label: 'Modal (Dialog)', href: '/docs/components/dialog' },
      { icon: PanelLeft, label: 'Drawer', href: '/docs/components/drawer' },
      { icon: PanelTop, label: 'Header', href: '/docs/components/header' },
      { icon: PanelLeft, label: 'Sidebar', href: '/docs/components/sidebar' },
      { icon: Sparkles, label: 'Toast', href: '/docs/components/toast' },
      { icon: MousePointer2, label: 'Tooltip', href: '/docs/components/tooltip' },
    ],
  },
]

const SIDEBAR_WIDTH = 256
const SIDEBAR_COLLAPSED_WIDTH = 68

const SidebarCtx = createContext<{ collapsed: boolean }>({
  collapsed: false,
})

/** Bloco 36×36 do sidebar: gradiente 3D, specular e shimmer (idle/hover/active ou sempre “aceso” no menu automático). */
function SidebarNeuIcon36({
  theme,
  children,
  isActive = false,
  shimmerLoop = false,
  hovered = false,
}: {
  theme: SidebarTheme
  children: ReactNode
  isActive?: boolean
  shimmerLoop?: boolean
  hovered?: boolean
}) {
  const lit = isActive
  const shimmerHover = hovered && !isActive && !shimmerLoop
  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${isActive || shimmerHover ? theme.accentBorderStrong : theme.iconBorderIdle}`,
        background: lit || shimmerHover
          ? `linear-gradient(145deg, ${theme.accentTo} 0%, #f7ad45 34%, ${theme.accentFrom} 64%, #cf730d 100%)`
          : theme === TN_DARKMODE
            ? 'linear-gradient(160deg, #303036 0%, #222226 55%, #1c1c20 100%)'
            : 'linear-gradient(160deg, #0e4d8a 0%, #0a3a6e 55%, #072d58 100%)',
        boxShadow: isActive ? theme.activeShadow : shimmerHover ? theme.hoverShadow : theme.idleShadow,
        transform: shimmerHover ? 'translateY(-1px)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 1,
          left: 2,
          right: 2,
          height: '44%',
          borderRadius: 8,
          background: lit || shimmerHover ? 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.02))' : 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
          transform: lit || shimmerHover ? 'translateX(0)' : 'translateX(-100%)',
          animation: shimmerLoop
            ? 'sidebarNeuShimmerLoop 2.8s ease-in-out infinite'
            : lit || shimmerHover
              ? 'sidebarNeuShimmer 0.5s ease forwards'
              : 'none',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

function getBadgeTone(item: MenuItem, dark: boolean): { bg: string; color: string; shadow: string; border: string } {
  if (item.badge === 'financeiroPendente') {
    return dark
      ? { bg: 'rgba(246,146,30,0.14)', color: '#FDC24E', shadow: 'rgba(246,146,30,0.25)', border: 'rgba(246,146,30,0.28)' }
      : { bg: C.amareloEscuro, color: '#FFFFFF', shadow: 'rgba(246,146,30,0.45)', border: 'rgba(253,194,78,0.6)' }
  }
  if (item.badge === 'notaPendente') {
    return dark
      ? { bg: 'rgba(147,189,228,0.14)', color: '#93BDE4', shadow: 'rgba(147,189,228,0.25)', border: 'rgba(147,189,228,0.28)' }
      : { bg: C.azulProfundo, color: '#FFFFFF', shadow: 'rgba(0,75,155,0.45)', border: 'rgba(147,189,228,0.5)' }
  }
  if (item.badge === 'producaoEmAndamento') {
    return dark
      ? { bg: 'rgba(0,198,76,0.14)', color: '#8BE5AD', shadow: 'rgba(0,198,76,0.25)', border: 'rgba(0,198,76,0.28)' }
      : { bg: C.verdeFloresta, color: '#FFFFFF', shadow: 'rgba(0,198,76,0.42)', border: 'rgba(167,243,208,0.55)' }
  }
  return dark
    ? { bg: 'rgba(239,68,68,0.14)', color: '#FCA5A5', shadow: 'rgba(239,68,68,0.25)', border: 'rgba(239,68,68,0.28)' }
    : { bg: C.danger, color: '#FFFFFF', shadow: 'rgba(220,53,69,0.45)', border: 'rgba(254,202,202,0.55)' }
}

function SidebarItem({
  item,
  badges,
  collapsed,
  depth,
  location,
  onNavigate,
  theme,
}: {
  item: MenuItem
  badges: SidebarBadges
  collapsed: boolean
  depth: number
  location: string
  onNavigate: (href: string) => void
  theme: SidebarTheme
}) {
  const { dark } = useFipsTheme()
  const [hovered, setHovered] = useState(false)
  const hasChildren = !!item.children?.length
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some((c) => c.href === location)
  })

  useEffect(() => {
    if (hasChildren) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intencional: espelhar URL nos accordions
      setOpen(item.children!.some((c) => c.href === location))
    }
  }, [location, hasChildren, item.children])

  const badgeCount = item.badge ? badges[item.badge] : 0
  const isActive = item.href === location || (!!hasChildren && item.children!.some((c) => c.href === location))

  const Icon = item.icon

  // ── Cabeçalho de categoria (grupo de nível 0) — padrão unificado FIPS ──
  // Tipografia do Governança BI (10.5 / 600 / 0.08em / uppercase) + colapso do
  // Suprimentos (separador, chevron e animação). No rail vira ícones soltos.
  if (hasChildren && depth === 0) {
    if (collapsed) {
      return (
        <div>
          <div aria-hidden style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 14px 4px' }} />
          {item.children!.map((child) => (
            <SidebarItem
              key={child.href ?? child.label}
              item={child}
              badges={badges}
              collapsed
              depth={0}
              location={location}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </div>
      )
    }
    return (
      <div style={{ marginTop: 6 }}>
        <div aria-hidden style={{ borderTop: `1px solid ${theme.border}`, margin: '0 14px 2px' }} />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-expanded={open}
          className="group flex cursor-pointer items-center"
          style={{
            width: 'calc(100% - 16px)',
            margin: '0 8px',
            padding: '6px 12px',
            gap: 8,
            borderRadius: 8,
            border: 'none',
            background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
            transition: 'background 0.15s ease',
          }}
        >
          <Icon
            size={14}
            strokeWidth={2}
            aria-hidden
            style={{
              flexShrink: 0,
              color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.15s ease',
            }}
          />
          <span
            style={{
              flex: 1,
              textAlign: 'left',
              fontFamily: F.body,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isActive ? 'rgba(255,255,255,0.62)' : hovered ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.15s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {item.label}
          </span>
          <span style={{ display: 'flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
            {open ? <ChevronDown size={14} color={theme.chevron} aria-hidden /> : <ChevronRight size={14} color={theme.chevron} aria-hidden />}
          </span>
        </button>
        <div
          style={{
            maxHeight: open ? 2000 : 0,
            opacity: open ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.22s ease, opacity 0.18s ease',
          }}
        >
          {item.children!.map((child) => (
            <SidebarItem
              key={child.href ?? child.label}
              item={child}
              badges={badges}
              collapsed={false}
              depth={depth + 1}
              location={location}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </div>
      </div>
    )
  }

  const row = (
    <div
      role={item.href && !hasChildren ? 'link' : 'button'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (hasChildren && !collapsed) setOpen((o) => !o)
          else if (item.href && !hasChildren) onNavigate(item.href)
          else if (hasChildren && collapsed && item.children?.[0]?.href) onNavigate(item.children[0].href!)
        }
      }}
      className="group relative flex cursor-pointer items-center"
      style={{
        padding: collapsed ? '6px 0' : depth > 0 ? '6px 12px 6px 28px' : '6px 12px',
        margin: collapsed ? '1px auto' : '1px 8px',
        borderRadius: 8,
        transition: 'background 0.15s ease',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 12,
        width: collapsed ? 52 : undefined,
        maxWidth: collapsed ? 52 : '100%',
        minWidth: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (hasChildren) {
          if (!collapsed) setOpen((o) => !o)
          else if (item.children?.[0]?.href) onNavigate(item.children[0].href)
        } else if (item.href) onNavigate(item.href)
      }}
    >
      <SidebarNeuIcon36 theme={theme} isActive={isActive} hovered={hovered}>
        <Icon
          size={17}
          strokeWidth={1.9}
          style={{
            color: isActive || hovered ? theme.iconActive : theme.textMuted,
            transition: 'color 0.2s ease',
          }}
          aria-hidden
        />
      </SidebarNeuIcon36>

      {!collapsed ? (
        <span
          style={{
            fontSize: 13,
            fontWeight: isActive ? 500 : 400,
            letterSpacing: '0.01em',
            flex: 1,
            color: isActive ? theme.textActive : hovered ? theme.textHover : theme.textMuted,
            transition: 'color 0.15s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          {item.label}
        </span>
      ) : null}

      {badgeCount > 0 ? (
        <span
          className="flex items-center justify-center rounded-full font-bold"
          style={
            collapsed
              ? {
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  fontSize: 9,
                  color: getBadgeTone(item, dark).color,
                  background: getBadgeTone(item, dark).bg,
                  boxShadow: `0 0 0 1px ${getBadgeTone(item, dark).border}, 0 8px 18px -10px ${getBadgeTone(item, dark).shadow}`,
                  animation: 'sidebarAlertPulse 2.2s ease-in-out infinite',
                }
              : {
                  marginLeft: 'auto',
                  minWidth: 20,
                  height: 20,
                  padding: '0 6px',
                  fontSize: 10,
                  color: getBadgeTone(item, dark).color,
                  background: getBadgeTone(item, dark).bg,
                  boxShadow: `0 0 0 1px ${getBadgeTone(item, dark).border}, 0 8px 18px -10px ${getBadgeTone(item, dark).shadow}`,
                  animation: 'sidebarAlertPulse 2.2s ease-in-out infinite',
                }
          }
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}

      {hasChildren && !collapsed ? (
        <span style={{ display: 'flex', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          {open ? <ChevronDown size={14} color={theme.chevron} aria-hidden /> : <ChevronRight size={14} color={theme.chevron} aria-hidden />}
        </span>
      ) : null}

      {collapsed && hovered ? (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 8px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: theme.tooltipBg,
            color: theme.tooltipText,
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 50,
            border: `1px solid ${theme.iconBorderIdle}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          {item.label}
        </div>
      ) : null}
    </div>
  )

  return (
    <div>
      {row}
      {hasChildren && !collapsed ? (
        <div
          style={{
            maxHeight: open ? 2000 : 0,
            opacity: Math.min(1, open ? 1 : 0),
            overflow: 'hidden',
            transition: 'max-height 0.22s ease, opacity 0.18s ease',
          }}
        >
          {item.children!.map((child) => (
            <SidebarItem
              key={child.href ?? child.label}
              item={child}
              badges={badges}
              collapsed={false}
              depth={depth + 1}
              location={location}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function SidebarDemo({
  location,
  onNavigate,
  autoCollapse,
  collapseSeconds,
  onAutoCollapseChange,
  onCollapseSecondsChange,
  menuBehaviorOpen,
  onMenuBehaviorOpenChange,
  onSidebarPointerEnter,
  onSidebarPointerLeave,
  themeOverride,
}: {
  location: string
  onNavigate: (href: string) => void
  autoCollapse: boolean
  collapseSeconds: number
  onAutoCollapseChange: (v: boolean) => void
  onCollapseSecondsChange: (next: number) => void
  menuBehaviorOpen: boolean
  onMenuBehaviorOpenChange: (open: boolean) => void
  onSidebarPointerEnter: () => void
  onSidebarPointerLeave: () => void
  themeOverride?: SidebarTheme
}) {
  const badges = useDemoSidebarBadges()
  const { collapsed } = useContext(SidebarCtx)
  const theme = themeOverride ?? TN_DARK
  const filteredMenu = MENU
  const [menuTriggerHovered, setMenuTriggerHovered] = useState(false)

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  const rangePct = ((collapseSeconds - 1) / 29) * 100

  return (
    <aside
      className="flex flex-col"
      onPointerEnter={onSidebarPointerEnter}
      onPointerLeave={onSidebarPointerLeave}
      style={{
        width,
        flexShrink: 0,
        backgroundColor: theme.bg,
        borderRight: `1px solid ${theme.border}`,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        minHeight: 380,
        overflowX: 'visible',
        position: 'relative',
        fontFamily: F.body,
      }}
    >
      <div
        className="flex items-center justify-center overflow-hidden px-4"
        style={{
          borderBottom: `1px solid ${theme.border}`,
          height: collapsed ? 56 : 68,
          paddingLeft: collapsed ? 12 : 16,
          paddingRight: collapsed ? 12 : 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 14,
            minWidth: 0,
            width: collapsed ? 'auto' : '100%',
          }}
        >
          <img
            src={collapsed ? '/appfips-mark-collapsed.png' : '/appfips-logo.png'}
            alt="App FIPS"
            style={
              collapsed
                ? {
                    width: 36,
                    height: 36,
                    objectFit: 'contain',
                    flexShrink: 0,
                    backgroundColor: 'transparent',
                    background: 'none',
                    display: 'block',
                  }
                : {
                    height: 52,
                    width: 'auto',
                    maxWidth: 148,
                    minWidth: 72,
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    flexShrink: 0,
                    backgroundColor: 'transparent',
                    background: 'none',
                    display: 'block',
                  }
            }
          />
          {!collapsed ? (
            <span
              style={{
                fontFamily: F.title,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.2,
                color: theme.textActive,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Design System
            </span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto py-3" aria-label="Menu lateral demo" style={{ overflowX: 'clip' }}>
        {filteredMenu.map((item) => (
          <SidebarItem
            key={item.href ?? item.label}
            item={item}
            badges={badges}
            collapsed={collapsed}
            depth={0}
            location={location}
            onNavigate={onNavigate}
            theme={theme}
          />
        ))}
        <div style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 8px 0', paddingTop: 8 }}>
          {bottomNavItems.map((bn) => (
            <SidebarItem
              key={bn.to}
              item={{ icon: bn.icon ?? BookOpen, label: bn.label, href: bn.to }}
              badges={badges}
              collapsed={collapsed}
              depth={0}
              location={location}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </div>
      </nav>

      <div
        style={{
          borderTop: `1px solid ${theme.border}`,
          padding: '8px 8px 12px',
        }}
      >
        <button
          type="button"
          onClick={() => onMenuBehaviorOpenChange(true)}
          onMouseEnter={() => setMenuTriggerHovered(true)}
          onMouseLeave={() => setMenuTriggerHovered(false)}
          aria-expanded={menuBehaviorOpen}
          aria-haspopup="dialog"
          id="sidebar-menu-behavior-trigger"
          style={{
            display: 'flex',
            width: collapsed ? 52 : '100%',
            maxWidth: collapsed ? 52 : '100%',
            minWidth: 0,
            margin: collapsed ? '1px auto' : '1px 8px',
            marginBottom: 8,
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 12,
            padding: collapsed ? '6px 0' : '6px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, flexShrink: 0, color: menuTriggerHovered ? theme.accentFrom : theme.chevron, transition: 'color 0.2s ease' }}>
            <Timer size={17} aria-hidden />
          </span>
          {!collapsed ? (
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.01em',
                flex: 1,
                color: menuTriggerHovered ? theme.accentFrom : theme.chevron,
                fontFamily: F.body,
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.15s ease',
              }}
            >
              Modo menu
            </span>
          ) : null}
        </button>

        <Dialog open={menuBehaviorOpen} onOpenChange={onMenuBehaviorOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comportamento do menu</DialogTitle>
              <DialogDescription className="sr-only">
                Ajustes de fechamento automático do menu lateral neste exemplo interativo.
              </DialogDescription>
            </DialogHeader>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ fontSize: 14, fontFamily: F.body, color: 'var(--color-fg)' }}>Fechar automaticamente</span>
              <button
                type="button"
                role="switch"
                aria-checked={autoCollapse}
                onClick={() => onAutoCollapseChange(!autoCollapse)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: `1px solid ${autoCollapse ? C.azulProfundo : C.cardBorder}`,
                  background: autoCollapse ? C.azulProfundo : C.neutro,
                  padding: 2,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: C.branco,
                    transform: autoCollapse ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,42,104,0.2)',
                  }}
                />
              </button>
            </div>

            <div style={{ opacity: autoCollapse ? 1 : 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontFamily: F.body, color: 'var(--color-fg-muted)' }}>Tempo para fechar</span>
                <span style={{ fontSize: 14, fontFamily: F.body, fontWeight: 700, color: C.cinzaEscuro }}>{collapseSeconds}s</span>
              </div>
              <input
                type="range"
                className="sidebar-menu-behavior-range"
                min={1}
                max={30}
                step={1}
                value={collapseSeconds}
                disabled={!autoCollapse}
                onChange={(e) => onCollapseSecondsChange(Number(e.target.value))}
                style={{
                  display: 'block',
                  width: '100%',
                  background: `linear-gradient(to right, ${C.azulProfundo} 0%, ${C.azulProfundo} ${rangePct}%, ${C.azulCeuClaro} ${rangePct}%, ${C.azulCeuClaro} 100%)`,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  fontSize: 11,
                  fontFamily: F.body,
                  color: C.textMuted,
                }}
              >
                <span>1s</span>
                <span>30s</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center rounded-lg py-2 transition-colors"
          style={{
            color: theme.chevron,
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : 8,
            gap: collapsed ? 0 : 12,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.accentFrom
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.chevron
          }}
        >
          <LogOut size={17} aria-hidden />
          {!collapsed ? <span style={{ fontSize: 13, fontWeight: 400, fontFamily: F.body }}>Sair</span> : null}
        </button>
      </div>
    </aside>
  )
}

/* ── Helper: código copy-paste por variante do Sidebar ── */
function sidebarCode(variant: 'light' | 'dark'): string {
  const bg = variant === 'dark' ? '#1A1A1A' : '#002A68';
  const borderIdle = variant === 'dark' ? '#3f3f46' : '#1a3d6e';
  const tileBg = variant === 'dark'
    ? 'linear-gradient(160deg, #303036 0%, #222226 55%, #1c1c20 100%)'
    : 'linear-gradient(160deg, #0e4d8a 0%, #0a3a6e 55%, #072d58 100%)';
  const label = variant === 'dark' ? 'Sidebar Dark Mode' : 'Sidebar DS-FIPS (azul)';
  return `// DS-FIPS — ${label} — Copy-paste ready
// Requer: React 18+, lucide-react, Saira Expanded + Open Sans
// CSS vars: --color-surface, --color-fg, --color-border, --color-fg-muted
import { useState, type ReactNode } from "react";

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 68;

const theme = {
  bg: "${bg}",
  border: "rgba(255,255,255,0.06)",
  iconBgIdle: "rgba(255,255,255,0.08)",
  iconBorderIdle: "${borderIdle}",
  textMuted: "rgba(255,255,255,0.75)",
  textHover: "rgba(255,255,255,0.92)",
  textActive: "#fafafa",
  accentFrom: "#F6921E",
  accentTo: "#FFD37B",
  accentBorderStrong: "rgba(246,146,30,0.58)",
  iconActive: "${bg}",
  chevron: "rgba(255,255,255,0.55)",
};

function SidebarNeuIcon({ children, isActive = false, hovered = false }: { children: ReactNode; isActive?: boolean; hovered?: boolean }) {
  const lit = isActive || (hovered && !isActive);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      border: \`1px solid \${lit ? theme.accentBorderStrong : theme.iconBorderIdle}\`,
      background: lit
        ? \`linear-gradient(145deg, \${theme.accentTo} 0%, #f7ad45 34%, \${theme.accentFrom} 64%, #cf730d 100%)\`
        : "${tileBg}",
      boxShadow: isActive
        ? "0 12px 24px -12px rgba(246,146,30,0.62), 0 2px 4px rgba(0,42,104,0.38)"
        : "0 1px 2px rgba(0,42,104,0.3)",
      transform: hovered && !isActive ? "translateY(-1px)" : "none",
      transition: "all 0.25s ease",
    }}>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

export function Sidebar({ items = [], activeHref = "/", collapsed = false, onNavigate, logo }: {
  items: { label: string; emoji?: string; href?: string; icon?: ReactNode }[];
  activeHref: string;
  collapsed?: boolean;
  onNavigate?: (href: string) => void;
  logo?: ReactNode;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <aside style={{
      width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      height: "100vh", background: theme.bg, display: "flex", flexDirection: "column",
      borderRight: \`1px solid \${theme.border}\`, transition: "width 0.25s ease", overflow: "hidden",
    }}>
      {logo && <div style={{ padding: collapsed ? "16px 0" : "16px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10, borderBottom: \`1px solid \${theme.border}\` }}>{logo}</div>}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {items.map((item, i) => {
          const isActive = item.href === activeHref;
          const hovered = hoveredIdx === i;
          return (
            <div key={i}
              onClick={() => item.href && onNavigate?.(item.href)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: "flex", alignItems: "center", gap: collapsed ? 0 : 12,
                padding: collapsed ? "6px 0" : "6px 12px",
                margin: collapsed ? "1px auto" : "1px 8px",
                borderRadius: 8, cursor: "pointer",
                justifyContent: collapsed ? "center" : "flex-start",
                width: collapsed ? 52 : undefined,
              }}
            >
              <SidebarNeuIcon isActive={isActive} hovered={hovered}>
                {item.icon || <span style={{ color: isActive ? theme.iconActive : theme.textMuted, fontSize: 17 }}>{item.emoji || "📄"}</span>}
              </SidebarNeuIcon>
              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? theme.textActive : hovered ? theme.textHover : theme.textMuted,
                  fontFamily: "'Open Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// Uso:
// const items = [
//   { label: "Dashboard", emoji: "📊", href: "/dashboard" },
//   { label: "Coleta", emoji: "🚚", href: "/coleta" },
//   { label: "Produção", emoji: "🏭", href: "/producao" },
// ];
// <Sidebar items={items} activeHref="/dashboard" onNavigate={(href) => navigate(href)} />
`;
}

/* ═══════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
function SidebarDarkPlayground({ mob }: { mob: boolean }) {
  const [demoPath2, setDemoPath2] = useState('/')
  const [collapsed2, setCollapsed2] = useState(false)
  const [autoCollapse2, setAutoCollapse2] = useState(false)
  const [collapseSeconds2, setCollapseSeconds2] = useState(3)
  const [menuBehaviorOpen2, setMenuBehaviorOpen2] = useState(false)
  const collapseTimer2 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarPtrRef2 = useRef(false)
  const menuOpenRef2 = useRef(false)
  const skipEffect2 = useRef(true)

  const clearTimer2 = useCallback(() => {
    if (collapseTimer2.current) { clearTimeout(collapseTimer2.current); collapseTimer2.current = null }
  }, [])

  const scheduleLeave2 = useCallback(() => {
    clearTimer2()
    if (!autoCollapse2) return
    collapseTimer2.current = setTimeout(() => setCollapsed2(true), collapseSeconds2 * 1000)
  }, [autoCollapse2, collapseSeconds2, clearTimer2])

  const handleEnter2 = useCallback(() => { sidebarPtrRef2.current = true; clearTimer2(); setCollapsed2(false) }, [clearTimer2])
  const handleLeave2 = useCallback(() => { sidebarPtrRef2.current = false; if (menuOpenRef2.current) return; scheduleLeave2() }, [scheduleLeave2])

  const onMenuOpen2 = useCallback((open: boolean) => {
    menuOpenRef2.current = open; setMenuBehaviorOpen2(open)
    if (open) clearTimer2()
    else queueMicrotask(() => { if (!sidebarPtrRef2.current) scheduleLeave2() })
  }, [clearTimer2, scheduleLeave2])

  useEffect(() => {
    if (skipEffect2.current) { skipEffect2.current = false; return }
    if (sidebarPtrRef2.current || menuBehaviorOpen2) return
    clearTimer2(); scheduleLeave2()
  }, [collapseSeconds2, autoCollapse2, menuBehaviorOpen2, clearTimer2, scheduleLeave2])

  useEffect(() => () => clearTimer2(), [clearTimer2])
  useEffect(() => { if (!autoCollapse2) clearTimer2() }, [autoCollapse2, clearTimer2])

  return (
    <Section
      n="02"
      title="Playground interativo — Dark Mode"
      desc="Mesma sidebar com tema escuro: fundo #1A1A1A, tiles neumórficos adaptados, accent laranja mantido. Clique para copiar o código dark."
    >
      <Card mob={mob}>
        <Copyable
          label="Sidebar Dark Mode"
          code={sidebarCode('dark')}
          preview={
            <div style={{ height: 300, overflow: 'hidden', borderRadius: 10, border: '1px solid #3f3f46' }}>
              <SidebarDemo
                location="/"
                onNavigate={() => {}}
                themeOverride={TN_DARKMODE}
                autoCollapse={false}
                collapseSeconds={5}
                onAutoCollapseChange={() => {}}
                onCollapseSecondsChange={() => {}}
                menuBehaviorOpen={false}
                onMenuBehaviorOpenChange={() => {}}
                onSidebarPointerEnter={() => {}}
                onSidebarPointerLeave={() => {}}
              />
            </div>
          }
        >
        <SidebarCtx.Provider value={{ collapsed: collapsed2 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: mob ? 'column' : 'row',
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 12,
              overflow: 'visible',
              background: '#1A1A1A',
            }}
          >
            <SidebarDemo
              location={demoPath2}
              onNavigate={setDemoPath2}
              autoCollapse={autoCollapse2}
              collapseSeconds={collapseSeconds2}
              onAutoCollapseChange={setAutoCollapse2}
              onCollapseSecondsChange={setCollapseSeconds2}
              menuBehaviorOpen={menuBehaviorOpen2}
              onMenuBehaviorOpenChange={onMenuOpen2}
              onSidebarPointerEnter={handleEnter2}
              onSidebarPointerLeave={handleLeave2}
              themeOverride={TN_DARKMODE}
            />
            <div style={{ flex: 1, padding: mob ? 16 : 24, minHeight: 200, fontFamily: F.body }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#E2E2E8', fontFamily: F.title }}>Área de conteúdo (demo dark)</p>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#A1A1AA', lineHeight: 1.55 }}>
                Rota simulada:{' '}
                <code style={{ background: '#252525', padding: '2px 8px', borderRadius: 4, fontFamily: F.mono, fontSize: 12, color: '#E2E2E8' }}>
                  {demoPath2 || '—'}
                </code>
              </p>
              <p style={{ margin: '12px 0 0', fontSize: 12, color: '#A1A1AA', lineHeight: 1.5 }}>
                Versão dark mode do sidebar: fundo <code style={{ ...gk, background: '#252525', color: '#E2E2E8' }}>#1A1A1A</code>, tiles neumórficos com sombras adaptadas, bordas <code style={{ ...gk, background: '#252525', color: '#E2E2E8' }}>#3f3f46</code> e tooltip cinza escuro.
              </p>
            </div>
          </div>
        </SidebarCtx.Provider>
        </Copyable>
      </Card>
    </Section>
  )
}

export default function SidebarDoc() {
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

  const tokenGrid = mob ? '1fr' : tab ? '1fr 1fr' : 'repeat(2, 1fr)'
  const tokenGap = mob ? 24 : xl ? 32 : 24

  const [demoPath, setDemoPath] = useState('/')
  const [collapsed, setCollapsed] = useState(false)
  const [autoCollapse, setAutoCollapse] = useState(false)
  const [collapseSeconds, setCollapseSeconds] = useState(3)
  const [menuBehaviorOpen, setMenuBehaviorOpen] = useState(false)
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarPointerInsideRef = useRef(false)
  const menuBehaviorOpenRef = useRef(false)
  const skipCollapseSettingsEffect = useRef(true)

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }
  }, [])

  /** Não usar `collapsed` aqui: após expandir, pointerleave pode rodar antes do re-render e abortava o timer. */
  /** Só recolhe após sair do painel se “Fechar automaticamente” estiver ligado (com o atraso em segundos). */
  const scheduleLeaveCollapse = useCallback(() => {
    clearCollapseTimer()
    if (!autoCollapse) return
    collapseTimer.current = setTimeout(() => {
      setCollapsed(true)
    }, collapseSeconds * 1000)
  }, [autoCollapse, collapseSeconds, clearCollapseTimer])

  const handleSidebarPointerEnter = useCallback(() => {
    sidebarPointerInsideRef.current = true
    clearCollapseTimer()
    setCollapsed(false)
  }, [clearCollapseTimer])

  const handleSidebarPointerLeave = useCallback(() => {
    sidebarPointerInsideRef.current = false
    if (menuBehaviorOpenRef.current) return
    scheduleLeaveCollapse()
  }, [scheduleLeaveCollapse])

  const onMenuBehaviorOpenChange = useCallback(
    (open: boolean) => {
      menuBehaviorOpenRef.current = open
      setMenuBehaviorOpen(open)
      if (open) {
        clearCollapseTimer()
      } else {
        queueMicrotask(() => {
          if (!sidebarPointerInsideRef.current) {
            scheduleLeaveCollapse()
          }
        })
      }
    },
    [clearCollapseTimer, scheduleLeaveCollapse],
  )

  useEffect(() => {
    if (skipCollapseSettingsEffect.current) {
      skipCollapseSettingsEffect.current = false
      return
    }
    if (sidebarPointerInsideRef.current || menuBehaviorOpen) return
    clearCollapseTimer()
    scheduleLeaveCollapse()
  }, [collapseSeconds, autoCollapse, menuBehaviorOpen, clearCollapseTimer, scheduleLeaveCollapse])

  useEffect(() => () => clearCollapseTimer(), [clearCollapseTimer])

  useEffect(() => {
    if (!autoCollapse) clearCollapseTimer()
  }, [autoCollapse, clearCollapseTimer])

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
        @keyframes sidebarNeuShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sidebarNeuShimmerLoop {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sidebarAlertPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          45% { transform: scale(1.08); filter: brightness(1.08); }
        }
        .sidebar-menu-behavior-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
        }
        .sidebar-menu-behavior-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${C.branco};
          cursor: pointer;
          border: 2px solid ${C.azulProfundo};
          box-shadow: 0 1px 4px rgba(0,75,155,0.22);
        }
        .sidebar-menu-behavior-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${C.branco};
          cursor: pointer;
          border: 2px solid ${C.azulProfundo};
          box-shadow: 0 1px 4px rgba(0,75,155,0.22);
        }
        .sidebar-menu-behavior-range::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: ${C.azulCeuClaro};
        }
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
            Sidebar
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
            Navegação lateral do DS-FIPS com tile neumórfico 3D, shimmer, auto-colapso configurável e estado ativo por rota. Interaja com a demo abaixo.
          </p>
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
          title="Playground interativo"
          desc="Navegue pelos itens: rota ativa simulada, submenus, badges, tooltip no colapsado e Modo menu. Clique em qualquer sidebar para copiar o código."
        >
          <Card mob={mob}>
            <Copyable
              label="Sidebar DS-FIPS (azul)"
              code={sidebarCode('light')}
              preview={
                <div style={{ height: 300, overflow: 'hidden', borderRadius: 10, border: `1px solid ${C.cardBorder}` }}>
                  <SidebarDemo
                    location="/"
                    onNavigate={() => {}}
                    autoCollapse={false}
                    collapseSeconds={5}
                    onAutoCollapseChange={() => {}}
                    onCollapseSecondsChange={() => {}}
                    menuBehaviorOpen={false}
                    onMenuBehaviorOpenChange={() => {}}
                    onSidebarPointerEnter={() => {}}
                    onSidebarPointerLeave={() => {}}
                  />
                </div>
              }
            >
            <SidebarCtx.Provider value={{ collapsed }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: mob ? 'column' : 'row',
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: 12,
                  overflow: 'visible',
                  background: C.bg,
                }}
              >
                <SidebarDemo
                  location={demoPath}
                  onNavigate={setDemoPath}
                  autoCollapse={autoCollapse}
                  collapseSeconds={collapseSeconds}
                  onAutoCollapseChange={setAutoCollapse}
                  onCollapseSecondsChange={setCollapseSeconds}
                  menuBehaviorOpen={menuBehaviorOpen}
                  onMenuBehaviorOpenChange={onMenuBehaviorOpenChange}
                  onSidebarPointerEnter={handleSidebarPointerEnter}
                  onSidebarPointerLeave={handleSidebarPointerLeave}
                />
                <div style={{ flex: 1, padding: mob ? 16 : 24, minHeight: 200, fontFamily: F.body }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Área de conteúdo (demo)</p>
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: C.cinzaChumbo, lineHeight: 1.55 }}>
                    Rota simulada:{' '}
                    <code style={{ background: C.neutro, padding: '2px 8px', borderRadius: 4, fontFamily: F.mono, fontSize: 12 }}>
                      {demoPath || '—'}
                    </code>
                  </p>
                  <p style={{ margin: '12px 0 0', fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
                    No app real, substitua <code style={gk}>onNavigate</code> por <code style={gk}>react-router</code>{' '}
                    <code style={gk}>NavLink</code> ou cliente de rota equivalente. Badges podem vir de hook com fetch, como no arquivo
                    original <code style={gk}>useSidebarBadges.ts</code>.
                  </p>
                  <p style={{ margin: '12px 0 0', fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
                    A demo <strong>começa com o menu expandido</strong>. “Fechar automaticamente” inicia <strong>desligado</strong>: com o
                    switch desligado, o painel <strong>não recolhe</strong> ao você sair com o ponteiro. Para colapsar com atraso, abra Menu
                    automático, <strong>ative o switch</strong>, escolha os segundos, feche o modal e saia do painel azul; o tempo conta a
                    partir daí. Com o modal aberto, o timer não dispara ao sair da sidebar até fechar o Dialog.
                  </p>
                </div>
              </div>
            </SidebarCtx.Provider>
            </Copyable>
          </Card>
        </Section>

        <SidebarDarkPlayground mob={mob} />

        <Section
          n="03"
          title="Arquitetura funcional do Sidebar"
          desc="Modelo de arquitetura oficial do Sidebar DS-FIPS: camadas de responsabilidade, estados, efeitos visuais e integração com o Dialog padrão do design system."
        >
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div style={{ ...gc, borderLeft: `4px solid ${C.azulProfundo}` }}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Camadas de responsabilidade</span>
                <code style={gk}>domain + state + view</code>
              </div>
              <div style={gb}>
                <div style={gl}>Camada 1 — Domínio do menu</div>
                <p style={gt}>Fonte única para grupos/itens, rotas, ícones, badges e metadados (permissão, feature flag, prioridade).</p>
                <div style={gl}>Camada 2 — Motor de estado</div>
                <p style={gt}>Controla collapsed/expanded, submenus abertos, item ativo e regras de auto-fechamento sem depender da camada visual.</p>
                <div style={gl}>Camada 3 — SidebarNeuIcon36</div>
                <p style={gt}>Componente visual reutilizado por todos os itens e pelo trigger do Modo menu. Gerencia gradiente 3D, specular highlight e shimmer via props (isActive, hovered, shimmerLoop).</p>
                <div style={gl}>Camada 4 — Integração app</div>
                <p style={gt}>
                  Conecta roteador, permissões e telemetria (analytics/eventos) sem acoplar regra de negócio ao JSX do item. O header da
                  sidebar trata marca e título como lockup separado dos tiles 36×36 dos itens (wordmark expandido vs símbolo colapsado).
                </p>
              </div>
            </div>

            <div style={{ ...gc, borderLeft: `4px solid ${C.amareloEscuro}` }}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Estados visuais do tile 36×36</span>
                <code style={gk}>SidebarNeuIcon36</code>
              </div>
              <div style={gb}>
                <div style={gl}>Idle</div>
                <p style={gt}>Fundo azul escuro com gradiente 3D sutil. Borda rgba(255,255,255,0.16). Sombra leve. Ícone cor muted.</p>
                <div style={gl}>Hover</div>
                <p style={gt}>Fundo muda para gradiente laranja 3D (accentTo {'→'} accentFrom). Specular highlight no topo. Shimmer branco sweep 0.5s. Elevação -1px. Borda accentBorderStrong. Ícone muda para azul escuro (iconActive).</p>
                <div style={gl}>Ativo (por rota)</div>
                <p style={gt}>Mesmo visual do hover, mas sem elevação. Estado permanente enquanto rota estiver ativa. Shimmer dispara uma vez.</p>
                <div style={gl}>Modo menu aberto</div>
                <p style={gt}>isActive + shimmerLoop (2.8s infinito). Ícone azul escuro. Label ativo. Shimmer branco em loop contínuo.</p>
              </div>
            </div>
          </div>

          <Card mob={mob} s={{ marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr 1fr', gap: 14 }}>
              {[
                {
                  t: 'Shimmer padrão',
                  d: 'Faixa branca translúcida (rgba 255,255,255,0.25) passando sobre fundo laranja 3D. Direção 135deg, 0.5s ease.',
                },
                {
                  t: 'Modal padrão DS',
                  d: 'Modo menu usa Dialog do DS-FIPS (max-w-lg, rounded-2xl, overlay com blur, botão X, gap-5, p-6/sm:p-8).',
                },
                {
                  t: 'Acessibilidade',
                  d: 'Tab/Enter/Espaço nos itens, role=switch no toggle, aria-expanded no trigger, foco gerenciado pelo Dialog (Radix).',
                },
                {
                  t: 'Governança',
                  d: 'Alteração de ícone/label/rota passa pela fonte única de menu. Tokens registrados no catálogo DS antes de uso.',
                },
              ].map((x) => (
                <div key={x.t} style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: '12px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>{x.t}</span>
                  <p style={{ margin: '6px 0 0', ...gt, fontSize: 12 }}>{x.d}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section
          n="04"
          title="Blueprint de implementação em produção"
          desc="Passo a passo para implantar Sidebar DS-FIPS em aplicações reais, incluindo auto-colapso, shimmer e modal de configuração."
        >
          <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div style={{ ...gc, borderLeft: `4px solid ${C.verdeFloresta}` }}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Fluxo de implantação</span>
                <code style={gk}>do zero ao release</code>
              </div>
              <div style={gb}>
                <div style={gl}>1) Contrato de dados</div>
                <p style={gt}>Tipo de item com id estável, href, label, icon (Lucide), badgeKey, permissions, featureFlag e children opcionais.</p>
                <div style={gl}>2) Motor de visibilidade</div>
                <p style={gt}>Pipeline: permissions + feature flags + config de menu + ordenação por prioridade.</p>
                <div style={gl}>3) Estado ativo por rota</div>
                <p style={gt}>Derivar de useLocation/usePathname. Nunca por clique local. Submenu abre se ancestral estiver ativo.</p>
                <div style={gl}>4) Hover = affordance visual</div>
                <p style={gt}>No hover: fundo laranja 3D + shimmer branco + elevação + borda laranja. Não altera estado ativo.</p>
                <div style={gl}>5) Auto-colapso</div>
                <p style={gt}>
                  Sidebar nasce expandida. Só recolhe após pointerleave se o usuário ligar “Fechar automaticamente” e definir 1–30s no modal;
                  com o switch desligado, permanece expandida ao sair do painel. Configuração via Dialog padrão DS.
                </p>
                <div style={gl}>6) Telemetria</div>
                <p style={gt}>Emitir eventos de clique, abertura de submenu, abertura de Dialog e alteração de auto-close.</p>
              </div>
            </div>

            <div style={{ ...gc, borderLeft: `4px solid ${C.danger}` }}>
              <div style={gh}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.cinzaEscuro, fontFamily: F.title }}>Riscos e anti-patterns</span>
                <code style={gk}>production traps</code>
              </div>
              <div style={gb}>
                <p style={gt}>- Shimmer transparente ou de cor errada (deve ser branco sobre fundo laranja, não laranja sobre fundo azul).</p>
                <p style={gt}>- Estado ativo derivado de clique local sem sincronizar com URL real.</p>
                <p style={gt}>- Todos os ícones ficarem "acesos" ao mesmo tempo (ativo por hover em vez de por rota).</p>
                <p style={gt}>- Modal de configuração fora do padrão DS (tamanho, overlay, arredondamento ou foco diferentes).</p>
                <p style={gt}>- Permissão aplicada só no front sem fallback de backend.</p>
                <p style={gt}>- Badge sem limite visual (99+) quebrando grid e alinhamento.</p>
                <p style={gt}>- Token em linha sem registrar no catálogo do DS.</p>
              </div>
            </div>
          </div>

          <Card mob={mob} s={{ marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ ...gl, marginTop: 0 }}>QA funcional (obrigatório)</span>
                <p style={gt}>- Rota ativa reflete 100% a URL atual, inclusive filhos de submenu.</p>
                <p style={gt}>- Hover: fundo laranja + shimmer branco + elevação. Remove ao sair.</p>
                <p style={gt}>- Colapsado preserva navegação por teclado e tooltip de label.</p>
                <p style={gt}>
                  - Auto-close: com o switch ligado, o timer inicia ao sair do painel ou ao fechar o Dialog com o ponteiro fora; slider
                  reaplica o atraso; com o switch desligado, não há recolha ao sair.
                </p>
                <p style={gt}>- Badges atualizam sem salto de layout e sem perda de clique no item.</p>
              </div>
              <div>
                <span style={{ ...gl, marginTop: 0 }}>QA visual e operacional</span>
                <p style={gt}>- Contraste dos estados cumpre AA no modo expandido e colapsado.</p>
                <p style={gt}>- Tile 36×36 com gradiente 3D, specular e shimmer branco idêntico em todos os itens e no Modo menu.</p>
                <p style={gt}>- Dialog de Modo menu usa max-w-lg, rounded-2xl, overlay, botão X (padrão DS).</p>
                <p style={gt}>- Sem overflow horizontal no container principal e no nav rolável.</p>
                <p style={gt}>
                  - Marca no header: wordmark legível expandido (altura ~52px, largura proporcional); ícone compacto colapsado (36×36),
                  fundos PNG transparentes.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        <Section
          n="04"
          title="Sistema de tokens e governança visual"
          desc="Mapa completo de tokens para Sidebar DS-FIPS: aparência, estados, shimmer, modal, dimensões e regras de evolução."
        >
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
                Superfície (idle)
              </span>
              <TokenRow label="Sidebar bg" value="#002A68" color="#002A68" />
              <TokenRow label="Border divider" value="rgba(255,255,255,0.06)" />
              <TokenRow label="Icon idle bg" value="gradient 145deg sutil azul" />
              <TokenRow label="Icon idle border" value="rgba(255,255,255,0.16)" />
              <TokenRow label="Nav clipping" value="overflow-x: clip" />
              <TokenRow label="Tooltip bg" value="#002A68" color="#002A68" />
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
                Hover e ativo
              </span>
              <TokenRow label="Tile bg (hover/active)" value="gradient 145deg laranja 3D" color="#F6921E" />
              <TokenRow label="Specular highlight" value="rgba(255,255,255,0.42) topo" />
              <TokenRow label="Shimmer" value="branco rgba(255,255,255,0.25)" />
              <TokenRow label="Glow (hover)" value="rgba(246,146,30,0.42)" />
              <TokenRow label="Border (hover/active)" value="rgba(246,146,30,0.58)" />
              <TokenRow label="Icon fg (hover/active)" value="#002A68" color="#002A68" />
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
                Dimensões e layout
              </span>
              <TokenRow label="Expanded width" value="256px" />
              <TokenRow label="Collapsed width" value="68px" />
              <TokenRow label="Header height" value="68px exp. · 56px col." />
              <TokenRow label="Header wordmark (exp.)" value="PNG alt. 52px · max-w 148px" />
              <TokenRow label="Header mark (col.)" value="PNG 36×36 (appfips-mark-collapsed.png)" />
              <TokenRow label="Header title" value="Saira Expanded 16px 700" />
              <TokenRow label="Icon block" value="36×36 · radius 10" />
              <TokenRow label="Row radius" value="8px" />
              <TokenRow label="Row padding" value="6px 12px" />
              <TokenRow label="Badge size" value="20px (default, 99+)" />
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
                Motion e modal
              </span>
              <TokenRow label="Shimmer sweep" value="0.5s ease forwards" />
              <TokenRow label="Shimmer loop" value="2.8s ease-in-out infinite" />
              <TokenRow label="Shimmer path" value="translateX(-100%) {'→'} (100%)" />
              <TokenRow label="Collapse width" value="0.25s cubic-bezier(0.4,0,0.2,1)" />
              <TokenRow label="Submenu expand" value="max-height 0.22s + opacity 0.18s" />
              <TokenRow label="Dialog (Menu auto)" value="max-w-lg, rounded-2xl, p-6/sm:p-8" />
              <TokenRow label="Label font" value="Open Sans 13px 400/500" />
            </div>
          </Card>

          <Card mob={mob} s={{ marginTop: 16 }}>
            <span style={{ ...gl, marginTop: 0 }}>Matriz de contraste (mínimo recomendado)</span>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr', gap: 12 }}>
              <p style={gt}>• Texto inativo no fundo azul: opacidade {'>='} 0.72</p>
              <p style={gt}>• Texto ativo no fundo azul: branco sólido</p>
              <p style={gt}>• Ícone sobre laranja (hover/ativo): azul escuro #002A68</p>
              <p style={gt}>• Shimmer sobre laranja: branco 25% opacidade</p>
              <p style={gt}>• Badge crítico: branco no texto, sombra controlada</p>
              <p style={gt}>• Tooltip colapsado: contraste AA mínimo</p>
            </div>
          </Card>

          <Card mob={mob} s={{ marginTop: 16 }}>
            <span style={{ ...gl, marginTop: 0 }}>Governança de evolução</span>
            <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
              <p style={gt}>• Qualquer novo token deve entrar no catálogo DS antes de uso em componente.</p>
              <p style={gt}>• Mudança de cor/motion exige captura visual antes/depois em cenários expandido e colapsado.</p>
              <p style={gt}>• Alteração de comportamento (timer, colapso, shimmer) exige teste com teclado e mouse.</p>
              <p style={gt}>• Novos itens de menu precisam id estável para analytics e controle de visibilidade.</p>
            </div>
          </Card>
        </Section>

        <CodePlayground />

        <CodeExportSection items={[{
          label:"Sidebar Neumorphic",
          description:"Sidebar DS-FIPS com ícones neumorphic, shimmer sweep, submenus, badges e tooltips",
          code:`// ═══════════════════════════════════════════
// DS-FIPS — Sidebar Neumorphic — Copy-paste ready
// Requer: React 18+, lucide-react, Saira Expanded + Open Sans
// CSS vars: --color-surface, --color-fg, --color-border, --color-fg-muted
// ═══════════════════════════════════════════
import { useState, useEffect, type ReactNode } from "react";

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 68;

const theme = {
  bg: "#002A68",
  border: "rgba(255,255,255,0.06)",
  iconBgIdle: "rgba(255,255,255,0.08)",
  iconBorderIdle: "rgba(255,255,255,0.16)",
  textMuted: "rgba(255,255,255,0.75)",
  textHover: "rgba(255,255,255,0.92)",
  textActive: "#fafafa",
  accentFrom: "#F6921E",
  accentTo: "#FFD37B",
  accentBorderStrong: "rgba(246,146,30,0.58)",
  iconActive: "#002A68",
  chevron: "rgba(255,255,255,0.55)",
  tooltipBg: "#002A68",
  tooltipText: "#fafafa",
};

function SidebarNeuIcon({ children, isActive = false, hovered = false }) {
  const lit = isActive;
  const shimmerHover = hovered && !isActive;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      border: \`1px solid \${isActive || shimmerHover ? theme.accentBorderStrong : theme.iconBorderIdle}\`,
      background: lit || shimmerHover
        ? \`linear-gradient(145deg, \${theme.accentTo} 0%, #f7ad45 34%, \${theme.accentFrom} 64%, #cf730d 100%)\`
        : "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 56%, rgba(0,24,58,0.18) 100%)",
      boxShadow: isActive
        ? "0 12px 24px -12px rgba(246,146,30,0.62), 0 2px 4px rgba(0,42,104,0.38)"
        : "0 1px 2px rgba(0,42,104,0.3)",
      transform: shimmerHover ? "translateY(-1px)" : "none",
      transition: "all 0.25s ease",
    }}>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

export function Sidebar({ items = [], activeHref = "/", collapsed = false, onNavigate, logo }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <aside style={{
      width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      height: "100vh", background: theme.bg, display: "flex", flexDirection: "column",
      borderRight: \`1px solid \${theme.border}\`, transition: "width 0.25s ease", overflow: "hidden",
    }}>
      {/* Logo */}
      {logo && <div style={{ padding: collapsed ? "16px 0" : "16px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10, borderBottom: \`1px solid \${theme.border}\` }}>{logo}</div>}
      {/* Menu items */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {items.map((item, i) => {
          const isActive = item.href === activeHref;
          const hovered = hoveredIdx === i;
          return (
            <div key={i}
              onClick={() => item.href && onNavigate?.(item.href)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: "flex", alignItems: "center", gap: collapsed ? 0 : 12,
                padding: collapsed ? "6px 0" : "6px 12px",
                margin: collapsed ? "1px auto" : "1px 8px",
                borderRadius: 8, cursor: "pointer",
                justifyContent: collapsed ? "center" : "flex-start",
                width: collapsed ? 52 : undefined,
                transition: "background 0.15s ease",
              }}
            >
              <SidebarNeuIcon isActive={isActive} hovered={hovered}>
                {item.icon || <span style={{ color: isActive ? theme.iconActive : theme.textMuted, fontSize: 17 }}>{item.emoji || "📄"}</span>}
              </SidebarNeuIcon>
              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? theme.textActive : hovered ? theme.textHover : theme.textMuted,
                  fontFamily: "'Open Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  transition: "color 0.15s ease",
                }}>{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// USO:
// const items = [
//   { label: "Dashboard", emoji: "📊", href: "/dashboard" },
//   { label: "Coleta", emoji: "🚚", href: "/coleta" },
//   { label: "Produção", emoji: "🏭", href: "/producao" },
// ];
// <Sidebar items={items} activeHref="/dashboard" onNavigate={(href) => navigate(href)} />`
        }]}/>

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: `1px solid ${C.cardBorder}`, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: C.cinzaChumbo, letterSpacing: '0.5px', fontFamily: F.title, fontWeight: 400 }}>
            DS-FIPS v2.0 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
