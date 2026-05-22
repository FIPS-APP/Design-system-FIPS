import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type FipsTabItem = {
  id: string
  label: string
  icon?: ReactNode
  title?: string
  disabled?: boolean
}

type FipsTabBarProps = {
  tabs: FipsTabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
  'data-tutorial'?: string
}

const TAB_RADIUS = '8px 8px 8px 14px'

function tabButtonStyle(active: boolean, disabled?: boolean): CSSProperties {
  if (disabled) {
    return {
      borderRadius: TAB_RADIUS,
      background: 'transparent',
      color: 'var(--color-fg-muted)',
      border: '1px solid transparent',
      cursor: 'not-allowed',
      fontWeight: 500,
      opacity: 0.45,
    }
  }
  if (active) {
    return {
      borderRadius: TAB_RADIUS,
      background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
      cursor: 'pointer',
      fontWeight: 700,
      opacity: 1,
    }
  }
  return {
    borderRadius: TAB_RADIUS,
    background: 'transparent',
    color: 'var(--color-fg-muted)',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 1,
  }
}

/** Barra de abas segmentada FIPS (pílulas em card — ex. Configurações Suprimentos). */
export function FipsTabBar({
  tabs,
  activeId,
  onChange,
  className,
  'data-tutorial': dataTutorial,
}: FipsTabBarProps) {
  return (
    <div
      data-tutorial={dataTutorial}
      role="tablist"
      className={cn('flex w-fit items-center gap-0.5 p-1', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px 10px 10px 18px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={tab.title ?? tab.label}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className="relative flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold transition-all"
            style={tabButtonStyle(isActive, tab.disabled)}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
