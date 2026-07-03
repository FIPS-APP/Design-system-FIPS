import { useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { useFipsTheme } from '../../../hooks/useFipsTheme'
import {
  AppWindow,
  Bell,
  BookOpen,
  Briefcase,
  Check,
  ChevronDown,
  FilePlus,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  PanelLeft,
  Settings,
  Shield,
  Sparkles,
  SunMoon,
  Timer,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  ArrowUpFromLine,
} from 'lucide-react'
import { RuleCards } from '../../components/RuleCards'
import { Badge } from '../../../components/ui/badge'
import { DocHeaderSectionNavDemo } from '../../../components/layout/DocHeaderSectionNav'
import { DocHeaderNeuIconButton } from '../../../components/layout/DocHeaderNeuIconButton'
import { UserChip } from '../../../components/layout/UserChip'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { cn } from '../../../lib/cn'

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

type ShellItem = {
  icon: LucideIcon
  label: string
  active?: boolean
}

type ShellGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: ShellItem[]
}

type MetricCard = {
  label: string
  value: string
  icon: LucideIcon
  border: string
  iconBg: string
  iconColor: string
}

const HOME_BACKGROUND = '/backgrounds/app-shell-home-trains.png'

const primaryItems: ShellItem[] = [
  { icon: Home, label: 'Home', active: true },
  { icon: FilePlus, label: 'Menu 1' },
  { icon: FileText, label: 'Menu 2' },
  { icon: FolderOpen, label: 'Menu 3' },
]

const groupedItems: ShellGroup[] = [
  {
    id: 'categoria-a',
    label: 'Categoria A',
    icon: Shield,
    items: [
      { icon: LayoutDashboard, label: 'Submenu 1' },
      { icon: AppWindow, label: 'Submenu 2' },
      { icon: Wrench, label: 'Submenu 3' },
    ],
  },
  {
    id: 'categoria-b',
    label: 'Categoria B',
    icon: LayoutDashboard,
    items: [
      { icon: FileText, label: 'Submenu 4' },
      { icon: FolderOpen, label: 'Submenu 5' },
      { icon: Sparkles, label: 'Submenu 6' },
    ],
  },
  {
    id: 'categoria-c',
    label: 'Categoria C',
    icon: Briefcase,
    items: [
      { icon: AppWindow, label: 'Submenu 7' },
      { icon: Settings, label: 'Submenu 8' },
    ],
  },
]

const shellSectionTabs: Array<{ id: string; label: string; active: boolean; icon: LucideIcon }> = [
  { id: 'start', label: 'Início', active: false, icon: Home },
  { id: 'patterns', label: 'Padrões', active: true, icon: LayoutDashboard },
  { id: 'foundations', label: 'Fundamentos', active: false, icon: Settings },
  { id: 'components', label: 'Componentes', active: false, icon: AppWindow },
  { id: 'meta', label: 'Projeto', active: false, icon: BookOpen },
]

const heroCards: MetricCard[] = [
  {
    label: 'Indicador 1',
    value: '08',
    icon: LayoutDashboard,
    border: 'border-l-[#2c74ff]',
    iconBg: 'bg-[#eaf1ff]',
    iconColor: 'text-[#2c74ff]',
  },
  {
    label: 'Indicador 2',
    value: '12',
    icon: Sparkles,
    border: 'border-l-[#00c64c]',
    iconBg: 'bg-[#e8fbef]',
    iconColor: 'text-[#00a843]',
  },
  {
    label: 'Indicador 3',
    value: '04',
    icon: FileText,
    border: 'border-l-[#a855f7]',
    iconBg: 'bg-[#f4eafe]',
    iconColor: 'text-[#9333ea]',
  },
  {
    label: 'Indicador 4',
    value: '19',
    icon: Menu,
    border: 'border-l-[var(--color-accent-strong)]',
    iconBg: 'bg-[#fff2df]',
    iconColor: 'text-[var(--color-accent-strong)]',
  },
]

const contentHighlights: Array<{
  icon: LucideIcon
  label: string
  caption: string
  iconBg: string
  iconColor: string
}> = [
  { icon: LayoutDashboard, label: 'Bloco visual 1', caption: 'Área de conteúdo do módulo', iconBg: 'bg-[#eaf1ff]', iconColor: 'text-[#2c74ff]' },
  { icon: FileText, label: 'Bloco visual 2', caption: 'Listagens, formulários ou cards', iconBg: 'bg-[#f4eafe]', iconColor: 'text-[#9333ea]' },
  { icon: Sparkles, label: 'Bloco visual 3', caption: 'Destaques e ações rápidas', iconBg: 'bg-[#e8fbef]', iconColor: 'text-[#00a843]' },
]

const complementRows = ['Linha visual 1', 'Linha visual 2', 'Linha visual 3']

const secondaryNotes = [
  'Hierarquia forte entre menu, hero e conteúdo.',
  'Texto claro sobre o fundo azul com imagem visível.',
  'Mockups específicos para desktop, tablet e celular.',
]

function MockupFrame({
  viewport,
  label,
  hint,
  className,
  children,
}: {
  viewport: ViewportMode
  label: string
  hint: string
  className?: string
  children: ReactNode
}) {
  const { dark } = useFipsTheme()
  const shellClasses =
    viewport === 'desktop'
      ? 'rounded-[38px] border border-[#16345f] bg-[#081426] p-3'
      : viewport === 'tablet'
        ? 'mx-auto w-full max-w-[860px] rounded-[44px] border border-[#16345f] bg-[#081426] p-3.5'
        : 'mx-auto w-full max-w-[360px] rounded-[42px] border border-[#16345f] bg-[#081426] p-2.5'

  const screenClasses =
    viewport === 'desktop'
      ? 'rounded-[28px]'
      : viewport === 'tablet'
        ? 'rounded-[34px]'
        : 'rounded-[30px]'

  const topLabel = viewport === 'desktop' ? label : `${label} Mockup`

  return (
    <div className={cn('space-y-3', className)}>
      <div className={cn('relative overflow-hidden shadow-[0_30px_80px_rgba(3,15,40,0.35)]', shellClasses)}>
        {viewport === 'desktop' ? (
          <div className="mb-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.18]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.12]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white/[0.45] uppercase">
              {topLabel}
            </span>
          </div>
        ) : null}

        {viewport === 'tablet' ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
            <span className="h-1.5 w-16 rounded-full bg-white/[0.15]" />
          </div>
        ) : null}

        {viewport === 'mobile' ? (
          <div className="pointer-events-none absolute inset-x-0 top-2.5 flex justify-center">
            <span className="h-5 w-28 rounded-full bg-[#06101d]" />
          </div>
        ) : null}

        <div className={cn('overflow-hidden', dark ? 'bg-[#1A1A1A]' : 'bg-[#eef4fb]', screenClasses, viewport !== 'desktop' && 'mt-4')}>
          {children}
        </div>
      </div>

      <div className="space-y-1 px-1">
        <p className="text-sm font-semibold text-[var(--color-fg)]">{label}</p>
        <p className="text-sm text-[var(--color-fg-muted)]">{hint}</p>
      </div>
    </div>
  )
}

/* ─── Neumorphic icon tile (mesmo padrão DocsNeuSidebar) ─── */
const NEU_LIGHT = {
  borderIdle: '#1a3d6e',
  borderAccent: 'rgba(246,146,30,0.58)',
  bgIdle: 'linear-gradient(160deg, #0e4d8a 0%, #0a3a6e 55%, #072d58 100%)',
  bgAccent: 'linear-gradient(145deg, #FFD37B 0%, #f7ad45 34%, #F6921E 64%, #cf730d 100%)',
  shadowIdle: '0 3px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.45) inset',
  shadowHover: '0 10px 20px -10px rgba(246,146,30,0.55), 0 2px 3px rgba(0,42,104,0.34), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -2px 4px rgba(140,72,0,0.28)',
  shadowActive: '0 12px 24px -12px rgba(246,146,30,0.62), 0 2px 4px rgba(0,42,104,0.38), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -3px 6px rgba(120,64,0,0.36)',
  iconIdle: 'rgba(255,255,255,0.75)',
  iconActive: '#002A68',
  textMuted: 'rgba(255,255,255,0.75)',
  textHover: 'rgba(255,255,255,0.92)',
  textActive: '#fafafa',
} as const

const NEU_DARK = {
  borderIdle: '#3f3f46',
  borderAccent: 'rgba(246,146,30,0.58)',
  bgIdle: 'linear-gradient(160deg, #303036 0%, #222226 55%, #1c1c20 100%)',
  bgAccent: 'linear-gradient(145deg, #FFD37B 0%, #f7ad45 34%, #F6921E 64%, #cf730d 100%)',
  shadowIdle: '0 3px 10px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.55) inset',
  shadowHover: '0 10px 20px -10px rgba(246,146,30,0.50), 0 2px 3px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(140,72,0,0.28)',
  shadowActive: '0 12px 24px -12px rgba(246,146,30,0.55), 0 2px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -3px 6px rgba(120,64,0,0.36)',
  iconIdle: 'rgba(255,255,255,0.65)',
  iconActive: '#1A1A1A',
  textMuted: 'rgba(255,255,255,0.65)',
  textHover: 'rgba(255,255,255,0.88)',
  textActive: '#fafafa',
} as const

function ShellNeuIcon({ children, isActive, hovered }: { children: ReactNode; isActive: boolean; hovered: boolean }) {
  const { dark } = useFipsTheme()
  const NEU = dark ? NEU_DARK : NEU_LIGHT
  const lit = isActive || hovered
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${lit ? NEU.borderAccent : NEU.borderIdle}`,
        background: lit ? NEU.bgAccent : NEU.bgIdle,
        boxShadow: isActive ? NEU.shadowActive : hovered ? NEU.shadowHover : NEU.shadowIdle,
        transform: hovered && !isActive ? 'translateY(-1px)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 1, left: 2, right: 2, height: '44%', borderRadius: 8,
          background: lit ? 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.02))' : 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
          transform: lit ? 'translateX(0)' : 'translateX(-100%)',
          animation: lit ? 'docsSidebarNeuShimmer 0.5s ease forwards' : 'none',
          pointerEvents: 'none',
        }}
      />
      <div className="relative z-[1] flex items-center justify-center">{children}</div>
    </div>
  )
}

function ShellNavItem({
  item,
  collapsed,
  indented = false,
}: {
  item: ShellItem
  collapsed: boolean
  indented?: boolean
}) {
  const { dark } = useFipsTheme()
  const NEU = dark ? NEU_DARK : NEU_LIGHT
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon
  const isActive = !!item.active

  return (
    <button
      type="button"
      className={cn(
        'relative flex w-full items-center rounded-lg transition-all duration-200',
        collapsed ? 'justify-center py-1.5' : 'py-1.5',
        indented && !collapsed ? 'pl-7 pr-3' : !collapsed ? 'px-3' : '',
      )}
      style={{ gap: collapsed ? 0 : 12 }}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ShellNeuIcon isActive={isActive} hovered={hovered}>
        <Icon
          className="h-[17px] w-[17px]"
          strokeWidth={1.9}
          style={{ color: isActive || hovered ? NEU.iconActive : NEU.iconIdle, transition: 'color 0.2s ease' }}
          aria-hidden
        />
      </ShellNeuIcon>
      {!collapsed ? (
        <span
          className="truncate text-left"
          style={{
            fontSize: 13,
            fontWeight: isActive ? 500 : 400,
            letterSpacing: '0.01em',
            color: isActive ? NEU.textActive : hovered ? NEU.textHover : NEU.textMuted,
            transition: 'color 0.15s ease',
          }}
        >
          {item.label}
        </span>
      ) : null}
    </button>
  )
}

function ShellMenuAutoButton({ collapsed }: { collapsed: boolean }) {
  const { dark } = useFipsTheme()
  const NEU = dark ? NEU_DARK : NEU_LIGHT
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      className="flex w-full items-center rounded-lg"
      style={{
        width: collapsed ? 52 : '100%',
        maxWidth: collapsed ? 52 : '100%',
        margin: collapsed ? '1px auto' : '1px 8px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 12,
        padding: collapsed ? '6px 0' : '6px 12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ShellNeuIcon isActive={false} hovered={hovered}>
        <Timer
          className="h-[17px] w-[17px]"
          strokeWidth={1.9}
          style={{ color: hovered ? NEU.iconActive : NEU.iconIdle, transition: 'color 0.2s ease' }}
          aria-hidden
        />
      </ShellNeuIcon>
      {!collapsed ? (
        <>
          <span
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: hovered ? NEU.textHover : NEU.textMuted,
              transition: 'color 0.15s ease',
              textAlign: 'left',
              whiteSpace: 'nowrap',
            }}
          >
            Modo menu
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.4)' }}>
            Manual
          </span>
        </>
      ) : null}
    </button>
  )
}

function ShellSidebar({
  collapsed,
  drawer = false,
  expandedGroups,
  onToggleGroup,
}: {
  collapsed: boolean
  drawer?: boolean
  expandedGroups: Set<string>
  onToggleGroup: (groupId: string) => void
  onToggleSidebar?: () => void
}) {
  const { dark } = useFipsTheme()
  return (
    <aside
      className={cn(
        'flex h-full flex-col text-white',
        dark ? 'bg-[#1A1A1A] shadow-[4px_0_24px_rgba(0,0,0,0.4)]' : 'bg-[#002a68] shadow-[4px_0_24px_rgba(0,26,64,0.28)]',
        drawer ? 'w-[252px]' : collapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          height: collapsed ? 56 : 59,
          paddingLeft: collapsed ? 12 : 16,
          paddingRight: collapsed ? 12 : 16,
        }}
      >
        <div
          className="flex items-center"
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 2,
            minWidth: 0,
            width: collapsed ? 'auto' : '100%',
          }}
        >
          <img
            src={collapsed ? '/appfips-mark-collapsed.png' : '/appfips-logo.png'}
            alt="App FIPS"
            style={
              collapsed
                ? { width: 36, height: 36, objectFit: 'contain', flexShrink: 0, display: 'block' }
                : { height: 52, width: 'auto', maxWidth: 100, minWidth: 60, objectFit: 'contain', objectPosition: 'left center', flexShrink: 0, display: 'block' }
            }
          />
          {!collapsed ? (
            <span
              style={{
                fontFamily: "'Saira Expanded', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.2,
                color: '#fafafa',
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

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <ShellNavItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </div>

        {groupedItems.map((group) => {
          const GroupIcon = group.icon
          const isExpanded = expandedGroups.has(group.id)

          if (collapsed) {
            return (
              <div key={group.id}>
                <div className="mx-3 my-2 border-t border-white/[0.06]" />
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <ShellNavItem key={item.label} item={item} collapsed />
                  ))}
                </div>
              </div>
            )
          }

          return (
            <div key={group.id} className="mt-2">
              <div className="mx-3 mb-1 border-t border-white/[0.06]" />
              <button
                type="button"
                onClick={() => onToggleGroup(group.id)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-white/[0.4] transition-all duration-200 hover:bg-white/[0.05] hover:text-white/[0.6]"
              >
                <span className="flex shrink-0 opacity-70">
                  <GroupIcon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex-1 text-left text-[11px] font-bold uppercase tracking-widest">
                  {group.label}
                </span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 opacity-50 transition-transform duration-200',
                    isExpanded ? '' : '-rotate-90',
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  isExpanded ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
                )}
              >
                <div className="mt-0.5 space-y-1">
                  {group.items.map((item) => (
                    <ShellNavItem key={item.label} item={item} collapsed={false} indented />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 8px 12px' }}>
        <ShellMenuAutoButton collapsed={collapsed} />

        <div className="border-t border-white/[0.06] px-2 pt-2 mt-2">
          <div className={cn('flex items-center gap-2 py-2 text-white/[0.5]', collapsed ? 'justify-center' : 'justify-start', !collapsed && 'px-1')}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {!collapsed ? <span className="text-xs">UI v1.2</span> : null}
          </div>
        </div>
      </div>
    </aside>
  )
}

function HeroMetricCard({ metric }: { metric: MetricCard }) {
  const { dark } = useFipsTheme()
  const Icon = metric.icon

  return (
    <Card className={cn('border-l-4 backdrop-blur-sm', dark ? 'bg-[#222222] shadow-[0_16px_40px_rgba(0,0,0,0.3)]' : 'bg-white/[0.96] shadow-[0_16px_40px_rgba(6,37,74,0.14)]', metric.border)}>
      <CardContent className="flex items-center justify-between gap-2.5 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-[var(--color-fg-muted)]">{metric.label}</p>
          <p className="mt-0.5 text-2xl font-semibold text-[var(--color-primary)]">{metric.value}</p>
        </div>
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', dark ? 'bg-white/[0.06]' : metric.iconBg, metric.iconColor)}>
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </div>
      </CardContent>
    </Card>
  )
}

function ShellCanvas({
  viewport,
  desktopCollapsed,
  mobileDrawerOpen,
  expandedGroups,
  onToggleGroup,
  onToggleDesktopSidebar,
  onToggleMobileDrawer,
}: {
  viewport: ViewportMode
  desktopCollapsed: boolean
  mobileDrawerOpen: boolean
  expandedGroups: Set<string>
  onToggleGroup: (groupId: string) => void
  onToggleDesktopSidebar: () => void
  onToggleMobileDrawer: () => void
}) {
  const { dark } = useFipsTheme()
  const isDesktop = viewport === 'desktop'
  const isTablet = viewport === 'tablet'
  const isMobile = viewport === 'mobile'
  const showPersistentSidebar = !isMobile
  const sidebarCollapsed = isTablet || desktopCollapsed

  return (
    <div className={cn('relative flex h-full overflow-hidden', dark ? 'bg-[#1A1A1A]' : 'bg-[#eef4fb]')}>
      {showPersistentSidebar ? (
        <ShellSidebar
          collapsed={sidebarCollapsed}
          expandedGroups={expandedGroups}
          onToggleGroup={onToggleGroup}
          onToggleSidebar={isDesktop ? onToggleDesktopSidebar : undefined}
        />
      ) : null}

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header — bloco separado estilo Tecnopano */}
        <header className={cn('z-20 flex shrink-0 items-center gap-3 border-b px-4 py-2.5', dark ? 'border-[#2E2E2E] bg-[#252525]' : 'border-[#e5e5e5] bg-[#f5f5f5]')}>
          {isMobile ? (
            <DocHeaderNeuIconButton ariaLabel="Abrir menu" dark={dark} onClick={onToggleMobileDrawer}>
              <Menu className="h-[17px] w-[17px]" aria-hidden strokeWidth={1.9} />
            </DocHeaderNeuIconButton>
          ) : null}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {!isMobile ? (
              <DocHeaderNeuIconButton ariaLabel="Recolher menu" dark={dark} onClick={isDesktop ? onToggleDesktopSidebar : undefined}>
                <PanelLeft className={cn('h-[17px] w-[17px] transition-transform duration-200', isDesktop && desktopCollapsed && 'rotate-180')} aria-hidden strokeWidth={1.9} />
              </DocHeaderNeuIconButton>
            ) : null}
            <div className="flex items-center gap-1.5 text-sm">
              <span className={dark ? 'text-[#A1A1AA]' : 'text-neutral-400'}>Padrões</span>
              <span className={dark ? 'text-[#3a3a3a]' : 'text-neutral-300'}>/</span>
              <span className={cn('font-semibold', dark ? 'text-[#E2E2E8]' : 'text-neutral-800')}>Home</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {[Bell, ...(isMobile ? [] : [GraduationCap, SunMoon])].map((Icon, i) => (
              <DocHeaderNeuIconButton key={i} ariaLabel={['Notificações', 'Tutorial', 'Tema'][i] ?? 'Ação'} dark={dark}>
                <Icon className="h-[17px] w-[17px]" aria-hidden strokeWidth={1.9} />
              </DocHeaderNeuIconButton>
            ))}
            <div className={cn('mx-0.5 h-6 w-px shrink-0', dark ? 'bg-[#3a3a3a]' : 'bg-neutral-300', isMobile && 'hidden')} />
            <UserChip variant="docHeader" dark={dark} />
          </div>
        </header>

        {!isMobile ? (
          <div className="z-20 shrink-0">
            <DocHeaderSectionNavDemo tabs={shellSectionTabs} dark={dark} />
          </div>
        ) : null}

        <div className="relative overflow-hidden">
          {/* Fundo institucional — padrão FIPS real (igual HomePage): imagem full-bleed + overlay azul + vinheta */}
          <div className="absolute inset-0">
            <img
              src={HOME_BACKGROUND}
              alt=""
              aria-hidden
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
              draggable={false}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#002A68]/60 via-[#002A68]/45 to-[#002A68]/60" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />
          </div>

          <section
            className={cn(
              'relative z-10',
              isDesktop ? 'px-8 pb-16 pt-16' : isTablet ? 'px-6 pb-14 pt-14' : 'px-4 pb-10 pt-10',
            )}
          >
            <div className={cn('mx-auto max-w-4xl', isMobile ? 'text-left' : 'text-center')}>
              <Badge className="border-0 bg-[rgba(246,146,30,0.95)] px-4 py-1.5 text-white shadow-[0_12px_28px_rgba(246,146,30,0.28)]">
                Padrão Home
              </Badge>

              <h2
                className={cn(
                  'mt-6 font-heading font-semibold text-white',
                  isDesktop ? 'text-4xl' : isTablet ? 'text-3xl' : 'text-2xl leading-snug',
                )}
              >
                Home do <span className="text-[var(--color-accent)]">Aplicativo FIPS</span>
              </h2>

              <p
                className={cn(
                  'mt-4 max-w-2xl text-white/[0.8]',
                  isMobile ? 'text-sm leading-6' : 'mx-auto text-base leading-7',
                )}
              >
                Uma estrutura base para menus, ações e áreas de conteúdo com arte institucional,
                degradê azul e leitura clara mesmo com imagem forte no fundo.
              </p>

              <div className={cn('mt-7 flex gap-3', isMobile ? 'flex-col' : 'justify-center')}>
                <Button variant="accent" size="sm">
                  Ação Primária
                </Button>
                <Button variant="inverseOutline" size="sm">
                  Ação Secundária
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div className={cn('relative z-20', isDesktop ? '-mt-7 px-6 pb-4' : isTablet ? '-mt-6 px-5 pb-4' : '-mt-3 px-4 pb-4')}>
          <div className={cn('grid gap-3', isDesktop ? 'grid-cols-4' : isTablet ? 'grid-cols-2' : 'grid-cols-1')}>
            {heroCards.map((metric) => (
              <HeroMetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        <div className={cn('no-scrollbar flex-1 overflow-auto', isDesktop ? 'px-6 pb-6 pt-2' : isTablet ? 'px-5 pb-5 pt-2' : 'px-4 pb-5 pt-2')}>
          <div className={cn('grid gap-4', isDesktop ? 'lg:grid-cols-[minmax(0,1.45fr)_0.92fr]' : 'grid-cols-1')}>
            <Card className="border-[var(--color-border)] shadow-[0_24px_60px_rgba(6,37,74,0.08)]">
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">Área principal</p>
                  <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                    Depois do hero, o conteúdo volta para superfícies claras e respira melhor em qualquer largura.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {contentHighlights.map((block) => {
                    const BlockIcon = block.icon
                    return (
                      <div
                        key={block.label}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3 transition-colors hover:border-[var(--color-primary)]/30"
                      >
                        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', dark ? 'bg-white/[0.06]' : block.iconBg, block.iconColor)}>
                          <BlockIcon className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-fg)]">{block.label}</p>
                          <p className="truncate text-xs leading-5 text-[var(--color-fg-muted)]">{block.caption}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className={cn('grid gap-3', isMobile ? 'grid-cols-1' : 'sm:grid-cols-2')}>
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(0,75,155,0.92),rgba(0,144,208,0.82))] p-5 text-white shadow-[0_18px_36px_rgba(0,75,155,0.22)]">
                    <p className="text-xs font-semibold tracking-[0.14em] text-white/[0.66] uppercase">
                      Destaque
                    </p>
                    <p className="mt-3 text-lg font-semibold">Bloco principal com ênfase visual</p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.78]">
                      Ideal para introdução, CTA ou resumo do estado da tela.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-fg-muted)] uppercase">
                      Complemento
                    </p>
                    <div className="mt-3 space-y-2.5">
                      {complementRows.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 rounded-2xl bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-strong)]" aria-hidden />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="self-start border-[var(--color-border)] shadow-[0_24px_60px_rgba(6,37,74,0.08)]">
              <CardContent>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-success)]/12 text-[var(--color-success)]">
                    <ListChecks className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">Notas visuais</p>
                </div>
                <div className="divide-y divide-[var(--color-border)]/60">
                  {secondaryNotes.map((item) => (
                    <div key={item} className="flex items-start gap-3 py-3 last:pb-0">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/14 text-[var(--color-success)]">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                      </span>
                      <p className="text-sm leading-6 text-[var(--color-fg)]">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isMobile && mobileDrawerOpen ? (
        <>
          <button
            type="button"
            className="absolute inset-0 z-30 bg-[#041327]/48 backdrop-blur-[1px]"
            aria-label="Fechar menu"
            onClick={onToggleMobileDrawer}
          />
          <div className="absolute inset-y-0 left-0 z-40">
            <ShellSidebar
              collapsed={false}
              drawer
              expandedGroups={expandedGroups}
              onToggleGroup={onToggleGroup}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

/* ── Helper: código copy-paste-ready para o Playground ── */
function shellCode(variant: 'desktop' | 'tablet' | 'mobile') {
  if (variant === 'mobile') return `// DS-FIPS — Application Shell Mobile — Copy-paste ready
import { useState } from 'react'

export function AppShellMobile() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuItems = [
    { label: 'Home', active: true },
    { label: 'Requisicoes' },
    { label: 'Cadastros' },
    { label: 'Relatorios' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F3F6FB' }}>
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(4,19,39,0.48)', zIndex: 30 }} />
          <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 252, background: '#002A68', color: '#fff', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 59, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Saira Expanded', sans-serif", fontWeight: 700, fontSize: 16, color: '#fafafa' }}>App FIPS</span>
            </div>
            <nav style={{ flex: 1, padding: '12px 8px' }}>
              {menuItems.map(item => (
                <div key={item.label} style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 4, background: item.active ? 'rgba(246,146,30,0.15)' : 'transparent', color: item.active ? '#FDC24E' : 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: item.active ? 600 : 400, cursor: 'pointer' }}>
                  {item.label}
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
      <header style={{ height: 48, padding: '0 16px', borderBottom: '1px solid #E2E8F0', background: '#F5F5F5', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>&#9776;</button>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#333B41' }}>Home</span>
      </header>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(0,19,56,0.92) 0%, rgba(0,63,138,0.82) 44%, rgba(0,144,208,0.58) 100%)' }} />
        <div style={{ position: 'relative', padding: '40px 16px', textAlign: 'left' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#fff', fontFamily: "'Saira Expanded', sans-serif", margin: 0 }}>
            Home do <span style={{ color: '#F6921E' }}>Aplicativo FIPS</span>
          </h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <p style={{ color: '#7B8C96', fontSize: 14 }}>Conteudo da pagina aqui.</p>
      </div>
    </div>
  )
}`

  return `// DS-FIPS — Application Shell ${variant === 'tablet' ? 'Tablet' : 'Desktop'} — Copy-paste ready
import { useState } from 'react'

export function AppShell${variant === 'tablet' ? 'Tablet' : 'Desktop'}() {
  const [collapsed, setCollapsed] = useState(${variant === 'tablet' ? 'true' : 'false'})

  const menuItems = [
    { label: 'Home', active: true },
    { label: 'Requisicoes' },
    { label: 'Cadastros' },
    { label: 'Relatorios' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F3F6FB' }}>
      <aside style={{
        width: ${variant === 'tablet' ? '76' : 'collapsed ? 76 : 256'},
        background: '#002A68', color: '#fff',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}>
        <div style={{ height: 59, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Saira Expanded', sans-serif", fontWeight: 700, fontSize: ${variant === 'tablet' ? '0' : 'collapsed ? 0 : 16'}, color: '#fafafa', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            ${variant === 'tablet' ? '' : '{!collapsed && "App FIPS"}'}
          </span>
        </div>
        <nav style={{ flex: 1, overflow: 'auto', padding: '12px 8px' }}>
          {menuItems.map(item => (
            <div key={item.label} style={{
              padding: ${variant === 'tablet' ? "'10px 0'" : "'10px 12px'"},
              borderRadius: 8, marginBottom: 4,
              background: item.active ? 'rgba(246,146,30,0.15)' : 'transparent',
              color: item.active ? '#FDC24E' : 'rgba(255,255,255,0.75)',
              fontSize: 13, fontWeight: item.active ? 600 : 400,
              textAlign: ${variant === 'tablet' ? "'center'" : "'left'"},
              cursor: 'pointer',
            }}>
              ${variant === 'tablet' ? "item.label.charAt(0)" : "item.label"}
            </div>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 48, padding: '0 16px', borderBottom: '1px solid #E2E8F0', background: '#F5F5F5', display: 'flex', alignItems: 'center', gap: 12 }}>
          ${variant === 'tablet' ? '' : '<button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 }}>&#9776;</button>'}
          <span style={{ fontSize: 14, color: '#7B8C96' }}>Padroes</span>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#333B41' }}>Home</span>
        </header>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(0,19,56,0.92) 0%, rgba(0,63,138,0.82) 44%, rgba(0,144,208,0.58) 100%)' }} />
          <div style={{ position: 'relative', padding: '64px 32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: "'Saira Expanded', sans-serif", margin: 0 }}>
              Home do <span style={{ color: '#F6921E' }}>Aplicativo FIPS</span>
            </h2>
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <p style={{ color: '#7B8C96', fontSize: 14 }}>Conteudo da pagina aqui.</p>
        </div>
      </div>
    </div>
  )
}`
}

function shellPreview(variant: 'desktop' | 'tablet' | 'mobile') {
  const labels: Record<string, string> = {
    desktop: 'Desktop — sidebar + hero + cards',
    tablet: 'Tablet — rail + hero compacto',
    mobile: 'Mobile — drawer + hero empilhado',
  }
  return (
    <div style={{ padding: 12, textAlign: 'center' }}>
      <div style={{ background: 'linear-gradient(135deg, #002A68, #004B9B)', borderRadius: 8, padding: '16px 12px', color: '#fff', fontSize: 11, fontFamily: "'Saira Expanded', sans-serif" }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: '#FDC24E', marginBottom: 4 }}>App Shell</div>
        <strong>{labels[variant]}</strong>
      </div>
    </div>
  )
}

export default function ApplicationShellDemo() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(groupedItems.map((group) => group.id)))

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((previous) => {
      const next = new Set(previous)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <PlaygroundProvider>
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-muted)', fontFamily: "'Open Sans', sans-serif", color: 'var(--color-fg)' }}>
      {/* HEADER HERO */}
      <header style={{ background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)', padding: '48px 40px 44px', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.12, position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}>
          <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#FDC24E', fontFamily: "'Saira Expanded', sans-serif", marginBottom: 16 }}>
            <LayoutDashboard size={14} color="#FDC24E" /> Design System FIPS
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', margin: '0 0 10px', fontFamily: "'Saira Expanded', sans-serif" }}>Application Shell</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.69)', lineHeight: 1.6, maxWidth: 700, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>
            Shell base para produtos FIPS com foco em impacto visual: fundo institucional contínuo, sidebar aprovada e família completa de mockups responsivos.
          </p>
        </div>
      </header>

      <div style={{ padding: '36px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>

      <RuleCards cards={[
        { icon: <ShieldCheck size={20} color="var(--color-gov-azul-profundo)" />, color: 'var(--color-gov-azul-profundo)', bg: 'color-mix(in srgb, var(--color-gov-azul-profundo) 3%, transparent)', tag: 'REGRA 1', title: 'Estrutura fixa do shell', desc: 'Todo produto FIPS segue a mesma hierarquia visual: sidebar de navegação à esquerda, header com toolbar no topo, hero institucional com foto e degradê, e área de conteúdo abaixo. Essa ordem nunca muda.' },
        { icon: <AlertTriangle size={20} color="#F6921E" />, color: '#F6921E', bg: '#F6921E08', tag: 'REGRA 2', title: 'Layout base de todo produto', desc: 'O Application Shell é o ponto de partida obrigatório para qualquer tela de produto FIPS. Ele garante consistência entre módulos diferentes — navegação, identidade visual e hierarquia de informação já vêm resolvidas.' },
        { icon: <ArrowUpFromLine size={20} color="var(--color-gov-azul-escuro)" />, color: 'var(--color-gov-azul-escuro)', bg: 'color-mix(in srgb, var(--color-gov-azul-escuro) 3%, transparent)', tag: 'REGRA 3', title: 'Responsividade em três faixas', desc: 'No desktop a sidebar fica sempre visível e pode ser recolhida. No tablet ela aparece como rail compacto (só ícones). No celular a sidebar desaparece e vira um drawer que abre por cima do conteúdo.' },
      ]} />

      {/* Banner de Conteúdo */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)', borderRadius: '12px 12px 12px 24px', padding: '22px 26px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,42,104,.12)', marginTop: 32, marginBottom: 32 }}>
        <svg viewBox="0 0 320 200" fill="none" style={{ opacity: 0.06, position: 'absolute', top: -10, right: -20, width: 360, height: 200 }}>
          <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(253,194,78,0.09)', border: '1px solid rgba(253,194,78,0.19)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PanelLeft size={20} color="#FDC24E" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 21, fontWeight: 700, color: '#fff', fontFamily: "'Saira Expanded', sans-serif", margin: 0, lineHeight: 1.15, letterSpacing: '-0.2px' }}>Preview interativo</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.67)', fontFamily: "'Open Sans', sans-serif", margin: '4px 0 0', lineHeight: 1.4 }}>Clique em qualquer mockup para copiar o código. Família responsiva para desktop, tablet e celular</p>
          </div>
        </div>
      </div>

        <div className="space-y-8">
          <Copyable label="Shell Desktop" code={shellCode('desktop')} preview={shellPreview('desktop')}>
          <MockupFrame
            viewport="desktop"
            label="Desktop"
            hint="Versão principal com sidebar persistente, hero contínuo e quatro indicadores logo abaixo da dobra."
          >
            <div className="h-[860px]">
              <ShellCanvas
                viewport="desktop"
                desktopCollapsed={desktopCollapsed}
                mobileDrawerOpen={mobileDrawerOpen}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
                onToggleDesktopSidebar={() => setDesktopCollapsed((value) => !value)}
                onToggleMobileDrawer={() => setMobileDrawerOpen((value) => !value)}
              />
            </div>
          </MockupFrame>
          </Copyable>

          <Copyable label="Shell Tablet" code={shellCode('tablet')} preview={shellPreview('tablet')}>
          <MockupFrame
            viewport="tablet"
            label="Tablet"
            hint="Mockup mais largo, com proporção de tablet real, rail compacta e conteúdo distribuído sem parecer um telefone."
          >
            <div className="h-[720px]">
              <ShellCanvas
                viewport="tablet"
                desktopCollapsed={desktopCollapsed}
                mobileDrawerOpen={mobileDrawerOpen}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
                onToggleDesktopSidebar={() => setDesktopCollapsed((value) => !value)}
                onToggleMobileDrawer={() => setMobileDrawerOpen((value) => !value)}
              />
            </div>
          </MockupFrame>
          </Copyable>

          <Copyable label="Shell Mobile" code={shellCode('mobile')} preview={shellPreview('mobile')}>
          <MockupFrame
            viewport="mobile"
            label="Celular"
            hint="Layout isolado para celular, com espaçamento mais seguro entre hero, indicadores e conteúdo."
          >
            <div className="h-[760px]">
              <ShellCanvas
                viewport="mobile"
                desktopCollapsed={desktopCollapsed}
                mobileDrawerOpen={mobileDrawerOpen}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
                onToggleDesktopSidebar={() => setDesktopCollapsed((value) => !value)}
                onToggleMobileDrawer={() => setMobileDrawerOpen((value) => !value)}
              />
            </div>
          </MockupFrame>
          </Copyable>
        </div>

        <CodePlayground />

        <CodeExportSection items={[
          {
            label: 'Application Shell Layout',
            description: 'Estrutura base sidebar + header + hero + content area para produtos FIPS.',
            code: `/* ═══════════════════════════════════════════
   Application Shell — Layout base FIPS
   Sidebar persistente + Header + Hero + Content
   ═══════════════════════════════════════════ */

/* CSS Variables necessárias:
   --color-gov-gradient-from: #002A68
   --color-gov-gradient-to: #004B9B
   --color-surface-muted: #F3F6FB (light) / #121212 (dark)
   --color-fg: #333B41 (light) / #E2E2E8 (dark)
   --color-accent: #F6921E
*/

import { useState } from 'react'

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar — w-64 expanded, w-[76px] collapsed */}
      <aside
        style={{
          width: sidebarCollapsed ? 76 : 256,
          background: 'var(--color-gov-gradient-from)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
        }}
      >
        {/* Logo area: 59px height */}
        <div style={{ height: 59, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <img src="/appfips-logo.png" alt="FIPS" style={{ height: 52 }} />
        </div>
        {/* Nav items */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '12px 8px' }}>
          {/* Neumorphic icon tiles — ver DocsNeuSidebar */}
        </nav>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: 48, padding: '0 16px',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Toggle sidebar + Breadcrumb + Search + Actions */}
        </header>

        {/* Section Nav (tabs) */}
        <div style={{ borderBottom: '1px solid #E2E8F0' }}>
          {/* DocHeaderSectionNav */}
        </div>

        {/* Hero with background image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="/backgrounds/app-shell-home-trains.png" alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(118deg, rgba(0,19,56,0.92) 0%, rgba(0,63,138,0.82) 44%, rgba(0,144,208,0.58) 100%)',
          }} />
          <div style={{ position: 'relative', padding: '64px 32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: "'Saira Expanded', sans-serif" }}>
              Home do <span style={{ color: 'var(--color-accent)' }}>Aplicativo FIPS</span>
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* Breakpoints:
   Desktop: sidebar persistente (expandida ou colapsada)
   Tablet: sidebar como rail compacto (só ícones)
   Mobile: sidebar como drawer overlay */`,
          },
        ]} />

        <div style={{ textAlign: 'center', padding: '20px 0 0', borderTop: '1px solid #E2E8F0', marginTop: 20 }}>
          <span style={{ fontSize: 12, color: '#7B8C96', letterSpacing: '0.5px', fontFamily: "'Saira Expanded', sans-serif", fontWeight: 400 }}>DS-FIPS v0.4.2 · Ferrovia Interna do Porto de Santos · Excelência sobre trilhos · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
    </PlaygroundProvider>
  )
}
