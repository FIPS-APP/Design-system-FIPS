import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps, type PageHeaderStat } from './PageHeader'

export type PatternPanelHeroStat = PageHeaderStat

export type PatternPanelHeroProps = Omit<
  PageHeaderProps,
  'description' | 'icon' | 'eyebrow' | 'info' | 'actions' | 'actionsProps' | 'edge' | 'stats' | 'title'
> & {
  title: ReactNode
  subtitle: string
  icon: ReactNode
  /**
   * Linha acima do título. Use só para ESTADO da tela (ex.: "Passo 2 de 4").
   * Não passe o nome do sistema ou do módulo: o menu lateral e o cabeçalho já o dizem.
   */
  badge?: ReactNode
  /**
   * @deprecated Não use a pílula como marca. Ela some do uso novo; fica só para
   * quem mostra estado em `badge` e ainda depende dela.
   */
  badgePill?: boolean
  action?: ReactNode
  stats?: PatternPanelHeroStat[]
  /** Vira `data-tutorial` na raiz. */
  dataTutorial?: string
}

/**
 * Apelido do PageHeader com as props de antes. O desenho é o do PageHeader: título em h1 (use
 * `headingLevel` para mudar), medida pela largura do cartão e ação na última linha abaixo de 560px.
 * `subtitle` vira `description`, `action` vira `actions` e `badge` vira a eyebrow.
 * Em código novo, use o PageHeader.
 */
export function PatternPanelHero({
  title,
  subtitle,
  icon,
  badge,
  badgePill = false,
  action,
  stats,
  dataTutorial,
  ...rest
}: PatternPanelHeroProps) {
  const eyebrow = badge ? (
    badgePill ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/10 px-3.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
        {badge}
      </span>
    ) : (
      badge
    )
  ) : undefined

  return (
    <PageHeader
      {...rest}
      {...(dataTutorial ? { 'data-tutorial': dataTutorial } : {})}
      title={title}
      description={subtitle}
      icon={icon}
      eyebrow={eyebrow}
      actions={action}
      stats={stats}
    />
  )
}
