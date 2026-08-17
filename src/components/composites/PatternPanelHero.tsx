import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderStat } from './PageHeader'

export type PatternPanelHeroStat = PageHeaderStat

export type PatternPanelHeroProps = {
  title: ReactNode
  subtitle: string
  icon: ReactNode
  badge?: ReactNode
  badgePill?: boolean
  action?: ReactNode
  stats?: PatternPanelHeroStat[]
  compact?: boolean
  className?: string
}

/**
 * @deprecated Use `PageHeader` — mesma faixa, API mais completa (`eyebrow`, `info`, `actions`, `as`).
 * Mantido como adaptador para os consumidores existentes; sem implementação própria, para não
 * divergir do Banner de Conteúdo governado.
 */
export function PatternPanelHero({
  title,
  subtitle,
  icon,
  badge,
  badgePill = false,
  action,
  stats,
  compact = false,
  className,
}: PatternPanelHeroProps) {
  return (
    <PageHeader
      title={title}
      description={subtitle}
      icon={icon}
      badge={badge}
      badgePill={badgePill}
      actions={action}
      stats={stats}
      compact={compact}
      className={className}
    />
  )
}
