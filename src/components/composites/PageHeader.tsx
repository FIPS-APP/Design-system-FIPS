import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { BannerIconBox, BannerJunctionLines, FIPS_BANNER_CONTENT_CLASS } from './banner-shared'

export type PageHeaderStat = {
  label: string
  value: string | number
  /** Cor do dot. Default: `--color-accent-strong`. */
  dotColor?: string
}

export type PageHeaderProps = {
  /** Título da faixa — Saira Expanded 21px (17px em `compact`). */
  title: ReactNode
  /** Linha de apoio sob o título. */
  description?: ReactNode
  /** Rótulo curto uppercase acima do título — a seção do módulo. */
  eyebrow?: ReactNode
  /** Ícone do tile âmbar à esquerda (ex.: `<FileText size={20} color="var(--color-accent)" />`). */
  icon?: ReactNode
  /** Slot ao lado do título — ex.: botão "como funciona". */
  info?: ReactNode
  /** Nó livre acima do título. Com `badgePill`, ganha a moldura de pill translúcida. */
  badge?: ReactNode
  badgePill?: boolean
  /** Ações à direita: `Button variant="accent"` (primária) + `variant="inverseOutline"` (secundária). */
  actions?: ReactNode
  /** Chips de KPI abaixo do título — variante "Banner de Fluxo". */
  stats?: PageHeaderStat[]
  /** Faixa reduzida (mobile / painel estreito): raio e tipografia menores. */
  compact?: boolean
  /** Nível do título. `h1` quando a faixa é o título da página; default `h2`. */
  as?: 'h1' | 'h2'
  /** Layout externo (margens, grid). Aparência sai dos tokens do banner. */
  className?: string
}

/**
 * Faixa de módulo FIPS — padrão **Banner de Conteúdo** do DS (doc: `/docs/patterns/hero-banner`).
 *
 * Abre módulos, listagens e formulários. NÃO confundir com o hero da Home (foto + overlay azul,
 * doc `/docs/patterns/hero`) nem com `PageHero` (faixa full-bleed de visão geral).
 *
 * Fundo, sombra, borda e raio vêm de `.fips-banner-shell--content` (tokens `--fips-banner-*`),
 * que já resolve claro/escuro — não sobrescreva por className.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  icon,
  info,
  badge,
  badgePill = false,
  actions,
  stats,
  compact = false,
  as = 'h2',
  className,
}: PageHeaderProps) {
  const Title = as
  const hasStats = Boolean(stats?.length)

  const head = (
    <div className="min-w-0 flex-1">
      {badge ? (
        <div className={badgePill ? 'mb-2' : 'mb-1'}>
          {badgePill ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/10 px-3.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
      ) : null}
      {eyebrow ? (
        <span className="mb-0.5 block font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-strong)]">
          {eyebrow}
        </span>
      ) : null}
      <div className="flex items-center gap-1.5">
        <Title
          className="m-0 font-heading font-bold leading-[1.15] tracking-[-0.2px] text-white"
          style={{ fontSize: compact ? 17 : 21 }}
        >
          {title}
        </Title>
        {info}
      </div>
      {description ? (
        <p
          className="mt-1 max-w-2xl font-sans leading-[1.4] text-white/[0.67]"
          style={{ fontSize: compact ? 11 : 12 }}
        >
          {description}
        </p>
      ) : null}
    </div>
  )

  const statChips = hasStats ? (
    <div className="flex flex-wrap gap-2" style={{ paddingLeft: compact || !icon ? 0 : 58 }}>
      {stats!.map((s) => (
        <span
          key={s.label}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[11px] font-semibold text-white/75"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: s.dotColor ?? 'var(--color-accent-strong)' }}
            aria-hidden
          />
          {s.label} <strong className="font-bold text-white">{s.value}</strong>
        </span>
      ))}
    </div>
  ) : null

  return (
    <section
      className={cn(FIPS_BANNER_CONTENT_CLASS, compact && 'fips-banner-shell--compact', 'isolate text-white', className)}
      style={{ padding: compact ? '18px 18px' : '22px 26px' }}
    >
      <BannerJunctionLines
        style={{ position: 'absolute', top: -10, right: -20, width: compact ? 180 : 360, height: 200 }}
      />

      {hasStats ? (
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex items-center gap-3.5">
              {icon ? <BannerIconBox compact={compact}>{icon}</BannerIconBox> : null}
              {head}
            </div>
            {statChips}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : (
        <div className="relative flex flex-wrap items-center" style={{ gap: compact ? 12 : 16 }}>
          {icon ? <BannerIconBox compact={compact}>{icon}</BannerIconBox> : null}
          {head}
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}
    </section>
  )
}
