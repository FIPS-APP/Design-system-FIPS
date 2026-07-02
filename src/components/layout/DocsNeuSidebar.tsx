import { useCallback, useEffect, useMemo, useRef, useState, createContext, type ReactNode } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Compass, LogOut, MousePointer2, Sparkles, Timer, Zap, type LucideIcon } from 'lucide-react'
import { matchPath, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useFipsTheme } from '../../hooks/useFipsTheme'
import { navGroups, type NavGroup } from '../../routes/nav'

const C = {
  azulProfundo: '#004B9B',
  azulEscuro: '#002A68',
  azulCeuClaro: '#D3E3F4',
  neutro: '#E8EBFF',
  branco: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textMuted: '#64748B',
  amareloEscuro: '#F6921E',
  /* Dialog tokens (via CSS vars para dark mode) */
  dialogBorder: 'var(--color-border)',
  dialogFg: 'var(--color-fg)',
  dialogFgMuted: 'var(--color-fg-muted)',
}

const F = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
}

type SidebarTheme = {
  border: string
  iconBorderIdle: string
  textMuted: string
  textHover: string
  textActive: string
  accentFrom: string
  accentTo: string
  accentBorderStrong: string
  iconActive: string
  chevron: string
  idleShadow: string
  hoverShadow: string
  activeShadow: string
  tooltipBg: string
  tooltipText: string
}

const TN: SidebarTheme = {
  border: 'rgba(255,255,255,0.06)',
  iconBorderIdle: '#1a3d6e',
  textMuted: 'rgba(255,255,255,0.75)',
  textHover: 'rgba(255,255,255,0.92)',
  textActive: '#fafafa',
  accentFrom: C.amareloEscuro,
  accentTo: '#FFD37B',
  accentBorderStrong: 'rgba(246,146,30,0.58)',
  iconActive: C.azulEscuro,
  chevron: 'rgba(255,255,255,0.55)',
  idleShadow: '0 3px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.45) inset',
  hoverShadow:
    '0 10px 20px -10px rgba(246,146,30,0.55), 0 2px 3px rgba(0,42,104,0.34), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -2px 4px rgba(140,72,0,0.28)',
  activeShadow:
    '0 12px 24px -12px rgba(246,146,30,0.62), 0 2px 4px rgba(0,42,104,0.38), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -3px 6px rgba(120,64,0,0.36)',
  tooltipBg: '#002A68',
  tooltipText: '#fafafa',
}

export const SIDEBAR_WIDTH = 256
export const SIDEBAR_COLLAPSED_WIDTH = 68

type TreeItem = {
  label: string
  href?: string
  icon: LucideIcon
  children?: TreeItem[]
}

function buildMenuTree(groups: NavGroup[]): TreeItem[] {
  const items: TreeItem[] = []
  for (const g of groups) {
    if (g.id === 'start') {
      for (const it of g.items) {
        items.push({ label: it.label, href: it.to, icon: it.icon ?? BookOpen })
      }
    } else {
      items.push({
        label: g.label,
        icon: g.icon ?? BookOpen,
        children: g.items.map((it) => ({
          label: it.label,
          href: it.to,
          icon: it.icon ?? BookOpen,
        })),
      })
    }
  }
  return items
}

function pathIsActive(pathname: string, to: string): boolean {
  return !!matchPath({ path: to, end: to === '/docs' }, pathname)
}

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
  const { dark } = useFipsTheme()
  const lit = isActive
  const shimmerHover = hovered && !isActive && !shimmerLoop
  const idleBg = dark
    ? 'linear-gradient(160deg, #303036 0%, #222226 55%, #1c1c20 100%)'
    : 'linear-gradient(160deg, #0e4d8a 0%, #0a3a6e 55%, #072d58 100%)'
  const idleBorder = dark ? '#3f3f46' : '#1a3d6e'
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${isActive || shimmerHover ? theme.accentBorderStrong : idleBorder}`,
        background:
          lit || shimmerHover
            ? `linear-gradient(145deg, ${theme.accentTo} 0%, #f7ad45 34%, ${theme.accentFrom} 64%, #cf730d 100%)`
            : idleBg,
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
          background:
            lit || shimmerHover ? 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.02))' : 'none',
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
            ? 'docsSidebarNeuShimmerLoop 2.8s ease-in-out infinite'
            : lit || shimmerHover
              ? 'docsSidebarNeuShimmer 0.5s ease forwards'
              : 'none',
          pointerEvents: 'none',
        }}
      />
      <div className="relative z-[1] flex items-center justify-center">{children}</div>
    </div>
  )
}

const SidebarCtx = createContext<{ collapsed: boolean }>({ collapsed: false })

function DocNavItem({
  item,
  collapsed,
  depth,
  pathname,
  onItemNavigate,
  theme,
}: {
  item: TreeItem
  collapsed: boolean
  depth: number
  pathname: string
  onItemNavigate?: () => void
  theme: SidebarTheme
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const hasChildren = !!item.children?.length
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some((c) => c.href && pathIsActive(pathname, c.href))
  })

  useEffect(() => {
    if (!hasChildren) return
    const next = item.children!.some((c) => c.href && pathIsActive(pathname, c.href))
    // Sincronizar grupo expandido com rota (filho ativo).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intencional: espelhar URL nos accordions
    setOpen((prev) => (prev === next ? prev : next))
  }, [pathname, hasChildren, item.children])

  const isActive = item.href
    ? pathIsActive(pathname, item.href)
    : !!item.children?.some((c) => c.href && pathIsActive(pathname, c.href))

  const Icon = item.icon

  // ── Cabeçalho de categoria (grupo de nível 0) — padrão unificado FIPS ──
  // Tipografia do Governança BI (10.5 / 600 / 0.08em / uppercase) + colapso do
  // Suprimentos (separador, chevron e animação de altura). No rail (colapsado)
  // a categoria some e seus itens viram ícones soltos sob um separador.
  if (hasChildren && depth === 0) {
    if (collapsed) {
      return (
        <div>
          <div aria-hidden style={{ borderTop: `1px solid ${theme.border}`, margin: '8px 14px 4px' }} />
          {item.children!.map((child) => (
            <DocNavItem
              key={child.href ?? child.label}
              item={child}
              collapsed
              depth={0}
              pathname={pathname}
              onItemNavigate={onItemNavigate}
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
            <DocNavItem
              key={child.href ?? child.label}
              item={child}
              collapsed={false}
              depth={depth + 1}
              pathname={pathname}
              onItemNavigate={onItemNavigate}
              theme={theme}
            />
          ))}
        </div>
      </div>
    )
  }

  const rowContent = (
    <>
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
            fontFamily: F.body,
          }}
        >
          {item.label}
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
    </>
  )

  const rowStyle: React.CSSProperties = {
    padding: collapsed ? '6px 0' : depth > 0 ? '6px 12px 6px 28px' : '6px 12px',
    margin: collapsed ? '1px auto' : '1px 8px',
    borderRadius: 8,
    transition: 'background 0.15s ease',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: collapsed ? 0 : 12,
    width: collapsed ? 52 : undefined,
    maxWidth: collapsed ? 52 : '100%',
    minWidth: 0,
  }

  const wrapClass = 'group relative flex cursor-pointer items-center text-left no-underline [color:inherit]'

  const row =
    !hasChildren && item.href ? (
      <NavLink
        to={item.href}
        end={item.href === '/docs'}
        onClick={() => onItemNavigate?.()}
        className={wrapClass}
        style={rowStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {rowContent}
      </NavLink>
    ) : (
      <div
        role="button"
        tabIndex={0}
        className={wrapClass}
        style={rowStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (hasChildren && !collapsed) setOpen((o) => !o)
            else if (collapsed && item.children?.[0]?.href) {
              navigate(item.children[0].href)
              onItemNavigate?.()
            }
          }
        }}
        onClick={() => {
          if (hasChildren) {
            if (!collapsed) setOpen((o) => !o)
            else if (item.children?.[0]?.href) {
              navigate(item.children[0].href)
              onItemNavigate?.()
            }
          }
        }}
      >
        {rowContent}
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
            <DocNavItem
              key={child.href ?? child.label}
              item={child}
              collapsed={false}
              depth={depth + 1}
              pathname={pathname}
              onItemNavigate={onItemNavigate}
              theme={theme}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export type DocsNeuSidebarProps = {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  onNavigate?: () => void
  docVersion?: string
  /** Quando “Fechar automaticamente” (menu automático) é ligado ou desligado no diálogo do rodapé. */
  onAutoCollapseChange?: (enabled: boolean) => void
  /** Reinicia o tour de primeiro acesso (item “Primeiro acesso” do rodapé). */
  onReplayTour?: () => void
  /** Abre o modal "Novidades do Sistema" (item “Versão” do rodapé). */
  onOpenChangelog?: () => void
}

export function DocsNeuSidebar({
  collapsed,
  onCollapsedChange,
  onNavigate,
  docVersion = 'v0.3.0',
  onAutoCollapseChange,
  onReplayTour,
  onOpenChangelog,
}: DocsNeuSidebarProps) {
  const theme = TN
  const { pathname } = useLocation()
  const menuTree = useMemo(() => buildMenuTree(navGroups), [])
  const [menuBehaviorOpen, setMenuBehaviorOpen] = useState(false)
  const [autoCollapse, setAutoCollapse] = useState(false)
  const [collapseSeconds, setCollapseSeconds] = useState(3)
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarPointerInsideRef = useRef(false)
  const menuBehaviorOpenRef = useRef(false)
  const menuModePopoverRef = useRef<HTMLDivElement | null>(null)
  const skipSettingsEffect = useRef(true)

  const clearTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }
  }, [])

  /** Só recolhe após sair do painel se “Fechar automaticamente” estiver ligado (com o atraso em segundos). */
  const scheduleLeaveCollapse = useCallback(() => {
    clearTimer()
    if (!autoCollapse) return
    collapseTimer.current = setTimeout(() => {
      onCollapsedChange(true)
    }, collapseSeconds * 1000)
  }, [autoCollapse, collapseSeconds, clearTimer, onCollapsedChange])

  const onPointerEnter = useCallback(() => {
    sidebarPointerInsideRef.current = true
    clearTimer()
    if (autoCollapse) onCollapsedChange(false)
  }, [autoCollapse, clearTimer, onCollapsedChange])

  const onPointerLeave = useCallback(() => {
    sidebarPointerInsideRef.current = false
    if (menuBehaviorOpenRef.current) return
    scheduleLeaveCollapse()
  }, [scheduleLeaveCollapse])

  const onMenuBehaviorOpenChange = useCallback(
    (open: boolean) => {
      menuBehaviorOpenRef.current = open
      setMenuBehaviorOpen(open)
      if (open) clearTimer()
      else
        queueMicrotask(() => {
          if (!sidebarPointerInsideRef.current) scheduleLeaveCollapse()
        })
    },
    [clearTimer, scheduleLeaveCollapse],
  )

  const rangePct = ((collapseSeconds - 1) / 29) * 100
  const MENU_MODE_QUICK_PICKS = [3, 5, 10, 15] as const

  /** Fecha o popover de comportamento ao clicar fora dele. */
  useEffect(() => {
    if (!menuBehaviorOpen) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuModePopoverRef.current && !menuModePopoverRef.current.contains(target)) {
        onMenuBehaviorOpenChange(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuBehaviorOpen, onMenuBehaviorOpenChange])

  useEffect(() => {
    if (skipSettingsEffect.current) {
      skipSettingsEffect.current = false
      return
    }
    if (sidebarPointerInsideRef.current || menuBehaviorOpen) return
    clearTimer()
    scheduleLeaveCollapse()
  }, [collapseSeconds, autoCollapse, menuBehaviorOpen, clearTimer, scheduleLeaveCollapse])

  useEffect(() => () => clearTimer(), [clearTimer])

  useEffect(() => {
    onAutoCollapseChange?.(autoCollapse)
  }, [autoCollapse, onAutoCollapseChange])

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <SidebarCtx.Provider value={{ collapsed }}>
      <aside
        className="flex flex-col"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        style={{
          width,
          flexShrink: 0,
          backgroundColor: 'inherit',
          borderRight: `1px solid ${theme.border}`,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          minHeight: 0,
          overflowX: 'visible',
          position: 'relative',
          fontFamily: F.body,
          height: '100%',
        }}
        aria-label="Documentação Design System"
      >
        <div
          className="flex items-center justify-center overflow-hidden px-4"
          style={{
            borderBottom: `1px solid ${theme.border}`,
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
                      maxWidth: 100,
                      minWidth: 60,
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

        <nav className="sidebar-scroll min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto py-3 [overflow-x:clip]" aria-label="Documentação">
          {menuTree.map((item) => (
            <DocNavItem
              key={item.href ?? item.label}
              item={item}
              collapsed={collapsed}
              depth={0}
              pathname={pathname}
              onItemNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </nav>

        <div style={{ borderTop: `1px solid ${theme.border}`, padding: '8px 0 10px', flexShrink: 0 }}>
            <div className="relative" ref={menuModePopoverRef}>
              <button
                type="button"
                onClick={() => onMenuBehaviorOpenChange(!menuBehaviorOpen)}
                onMouseEnter={(e) => {
                  if (menuBehaviorOpen) return
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  if (menuBehaviorOpen) return
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = theme.chevron
                }}
                aria-expanded={menuBehaviorOpen}
                aria-haspopup="dialog"
                id="docs-sidebar-menu-behavior-trigger"
                data-tour-step="menu-auto"
                className="flex cursor-pointer items-center gap-2 rounded-md text-[11px] transition"
                style={{
                  color: menuBehaviorOpen ? 'rgba(255,255,255,0.85)' : theme.chevron,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '6px 0' : '6px 8px',
                  width: collapsed ? 52 : 'calc(100% - 16px)',
                  margin: collapsed ? '1px auto' : '1px 8px',
                  border: 'none',
                  background: menuBehaviorOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {!collapsed ? (
                  <>
                    <span className="flex-1 truncate text-left font-medium" style={{ fontFamily: F.body }}>
                      Modo menu
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {autoCollapse ? `Auto · ${collapseSeconds}s` : 'Manual'}
                    </span>
                  </>
                ) : null}
              </button>

              {menuBehaviorOpen && !collapsed ? (
                <div
                  role="dialog"
                  aria-label="Comportamento do menu"
                  className="absolute bottom-full left-2 right-2 z-40 mb-2 rounded-lg border p-3"
                  style={{
                    borderColor: 'rgba(255,255,255,0.10)',
                    background: C.azulEscuro,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="mb-2.5 flex rounded-md p-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        clearTimer()
                        setAutoCollapse(false)
                      }}
                      className="flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition"
                      style={{
                        background: !autoCollapse ? 'rgba(255,255,255,0.10)' : 'transparent',
                        color: !autoCollapse ? '#fff' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      <MousePointer2 className="h-3 w-3" strokeWidth={2} aria-hidden />
                      Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoCollapse(true)}
                      className="flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition"
                      style={{
                        background: autoCollapse ? 'rgba(255,255,255,0.10)' : 'transparent',
                        color: autoCollapse ? '#fff' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      <Zap className="h-3 w-3" strokeWidth={2} aria-hidden />
                      Automático
                    </button>
                  </div>

                  {autoCollapse ? (
                    <>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <Timer className="h-3 w-3" strokeWidth={2} aria-hidden />
                        <span>Recolher após</span>
                        <span className="ml-auto font-mono text-[11px] normal-case tracking-normal" style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {collapseSeconds}s
                        </span>
                      </div>
                      <input
                        type="range"
                        className="docs-sidebar-behavior-range block w-full"
                        min={1}
                        max={30}
                        step={1}
                        value={collapseSeconds}
                        onChange={(e) => setCollapseSeconds(Number(e.target.value))}
                        aria-label="Tempo para recolher (segundos)"
                        style={{
                          background: `linear-gradient(to right, ${C.amareloEscuro} 0%, ${C.amareloEscuro} ${rangePct}%, rgba(255,255,255,0.10) ${rangePct}%, rgba(255,255,255,0.10) 100%)`,
                        }}
                      />
                      <div className="mt-2 flex gap-1">
                        {MENU_MODE_QUICK_PICKS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCollapseSeconds(s)}
                            className="flex-1 rounded px-1 py-0.5 font-mono text-[10px] transition"
                            style={{
                              background: collapseSeconds === s ? 'rgba(246,146,30,0.20)' : 'rgba(255,255,255,0.04)',
                              color: collapseSeconds === s ? C.amareloEscuro : 'rgba(255,255,255,0.55)',
                            }}
                          >
                            {s}s
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Use o botão do cabeçalho para recolher e expandir o menu.
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onReplayTour?.()}
              className="flex cursor-pointer items-center gap-2 rounded-md text-[11px] transition"
              style={{
                color: theme.chevron,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '6px 0' : '6px 8px',
                width: collapsed ? 52 : 'calc(100% - 16px)',
                margin: collapsed ? '1px auto' : '1px 8px',
                border: 'none',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = theme.chevron
              }}
              title="Refazer o tour de boas-vindas"
            >
              <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {!collapsed ? (
                <span className="flex-1 truncate text-left font-medium" style={{ fontFamily: F.body }}>
                  Primeiro acesso
                </span>
              ) : null}
            </button>

            <a
              href="https://github.com/LuizM2/Design-system-FIPS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-2 rounded-md text-[11px] transition no-underline [color:inherit]"
              style={{
                color: theme.chevron,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '6px 0' : '6px 8px',
                width: collapsed ? 52 : 'calc(100% - 16px)',
                margin: collapsed ? '1px auto' : '1px 8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = theme.chevron
              }}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {!collapsed ? (
                <span className="flex-1 truncate text-left font-medium" style={{ fontFamily: F.body }}>
                  Repositório
                </span>
              ) : null}
            </a>

            <button
              type="button"
              onClick={() => onOpenChangelog?.()}
              className="flex cursor-pointer items-center gap-2 rounded-md text-[11px] transition"
              style={{
                color: theme.chevron,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '6px 0' : '6px 8px',
                width: collapsed ? 52 : 'calc(100% - 16px)',
                margin: collapsed ? '1px auto' : '1px 8px',
                border: 'none',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = theme.chevron
              }}
              title="Ver novidades desta versão"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {!collapsed ? (
                <>
                  <span className="flex-1 truncate text-left font-medium" style={{ fontFamily: F.body }}>
                    Versão
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {docVersion}
                  </span>
                </>
              ) : null}
            </button>
        </div>
      </aside>
    </SidebarCtx.Provider>
  )
}

/** Re-export para páginas que leem o estado colapsado do demo (opcional). */
export { SidebarCtx }
