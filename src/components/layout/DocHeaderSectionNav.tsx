import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import {
  docHeaderTabsNavSeparatorClass,
  docHeaderTabsSurface,
  docHeaderTabsUnderlineMd,
} from '../../lib/docHeaderChrome'

const U = docHeaderTabsUnderlineMd

export type DocHeaderSectionTab = {
  id: string
  label: string
  to: string
  end: boolean
  icon: LucideIcon
}

function tabLinkClass(active: boolean, dark: boolean) {
  return cn(
    'inline-flex shrink-0 items-center font-sans whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
    dark
      ? cn(
          active
            ? 'font-semibold text-[#E2E2E8] focus-visible:ring-[#F6921E]'
            : 'font-normal text-[#A1A1AA] hover:bg-white/[0.06] hover:text-[#D4D4D8] focus-visible:ring-[#F6921E]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]',
        )
      : cn(
          active
            ? 'font-semibold text-[var(--color-fg)] focus-visible:ring-[var(--color-ring)]'
            : 'font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-primary)]/[0.04] hover:text-[var(--color-fg)] focus-visible:ring-[var(--color-ring)]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        ),
  )
}

function iconClassInactive(dark: boolean) {
  return cn('shrink-0 transition-colors duration-200', dark ? 'text-[#71717A]' : 'text-[var(--color-fg-muted)]')
}

/** Ícone da tab — cor muda para laranja (#F6921E) quando ativo, seguindo o padrão Underline. */
function SectionTabIcon({
  icon: Icon,
  active,
  dark,
  sizePx,
}: {
  icon: LucideIcon
  active: boolean
  dark: boolean
  sizePx: number
}) {
  return (
    <Icon
      className={cn(
        'shrink-0 transition-colors duration-200',
        active
          ? 'text-[#F6921E]'
          : iconClassInactive(dark),
      )}
      style={{ width: sizePx, height: sizePx }}
      strokeWidth={1.5}
      aria-hidden
    />
  )
}

function useSectionTabUnderline(activeIndex: number, remeasureKey?: unknown) {
  const navRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const [line, setLine] = useState({ left: 0, width: 0 })

  const update = useCallback(() => {
    const nav = navRef.current
    if (activeIndex < 0 || !nav) {
      setLine({ left: 0, width: 0 })
      return
    }
    const el = tabRefs.current[activeIndex]
    if (!el) {
      setLine({ left: 0, width: 0 })
      return
    }
    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setLine({
      left: elRect.left - navRect.left + nav.scrollLeft,
      width: elRect.width,
    })
  }, [activeIndex])

  useLayoutEffect(() => {
    update()
    const nav = navRef.current
    window.addEventListener('resize', update)
    nav?.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('resize', update)
      nav?.removeEventListener('scroll', update)
    }
  }, [update, remeasureKey])

  return { navRef, tabRefs, line }
}

/**
 * Abas de secção — Underline com icon tiles ativos (estilo Tecnopano, paleta FIPS).
 */
export function DocHeaderSectionNav({
  tabs,
  currentGroupId,
  dark = false,
  remeasureKey,
}: {
  tabs: DocHeaderSectionTab[]
  currentGroupId: string
  dark?: boolean
  remeasureKey?: unknown
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === currentGroupId),
  )
  const { navRef, tabRefs, line } = useSectionTabUnderline(activeIndex, remeasureKey)

  const navSkin = dark
    ? cn(
        'bg-[rgba(255,255,255,0.08)] backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
        'border-b-2 border-white/10',
      )
    : cn(docHeaderTabsSurface, docHeaderTabsNavSeparatorClass)

  return (
    <nav
      ref={navRef}
      className={cn('no-scrollbar relative flex w-full min-w-0 items-center gap-0 overflow-x-auto pl-1.5', navSkin)}
      style={{ height: U.navHeightPx }}
      aria-label="Seções principais"
    >
      {tabs.map((tab, i) => {
        const active = tab.id === currentGroupId
        const Icon = tab.icon
        return (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            className="inline-flex shrink-0"
          >
            <NavLink
              to={tab.to}
              end={tab.end}
              className={tabLinkClass(active, dark)}
              style={{
                fontSize: U.fontSizePx,
                padding: `${U.paddingYPx}px ${U.paddingXPx}px`,
                gap: U.iconGapPx,
                height: '100%',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <SectionTabIcon icon={Icon} active={active} dark={dark} sizePx={U.iconSizePx} />
              {tab.label}
            </NavLink>
          </div>
        )
      })}
      <span
        className={cn(
          'pointer-events-none absolute -bottom-0.5 h-[3px] rounded-t-[3px] bg-[#F6921E]',
          activeIndex < 0 && 'opacity-0',
        )}
        style={{
          left: line.left,
          width: line.width,
          transition: U.indicatorTransition,
        }}
        aria-hidden
      />
    </nav>
  )
}

/** Réplica estática (HeaderDoc), mesmo padrão Underline com icon tiles. */
export function DocHeaderSectionNavDemo({
  tabs,
  dark = false,
}: {
  tabs: Array<{ id: string; label: string; active: boolean; icon: LucideIcon }>
  dark?: boolean
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.active),
  )
  const { navRef, tabRefs, line } = useSectionTabUnderline(activeIndex)

  const navSkin = dark
    ? cn(
        'bg-[rgba(255,255,255,0.08)] backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)]',
        'border-b-2 border-white/10',
      )
    : cn(docHeaderTabsSurface, docHeaderTabsNavSeparatorClass)

  return (
    <nav
      ref={navRef}
      className={cn('no-scrollbar relative flex w-full min-w-0 items-center gap-0 overflow-x-auto pl-1.5', navSkin)}
      style={{ height: U.navHeightPx }}
      aria-label="Demo — seções"
    >
      {tabs.map((tab, i) => {
        const Icon = tab.icon
        return (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            className="inline-flex shrink-0"
          >
            <span
              className={cn(tabLinkClass(tab.active, dark), 'cursor-default')}
              style={{
                fontSize: U.fontSizePx,
                padding: `${U.paddingYPx}px ${U.paddingXPx}px`,
                gap: U.iconGapPx,
                height: '100%',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <SectionTabIcon icon={Icon} active={tab.active} dark={dark} sizePx={U.iconSizePx} />
              {tab.label}
            </span>
          </div>
        )
      })}
      <span
        className={cn(
          'pointer-events-none absolute -bottom-0.5 h-[3px] rounded-t-[3px] bg-[#F6921E]',
          activeIndex < 0 && 'opacity-0',
        )}
        style={{
          left: line.left,
          width: line.width,
          transition: U.indicatorTransition,
        }}
        aria-hidden
      />
    </nav>
  )
}
