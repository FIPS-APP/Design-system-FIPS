import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type StatsCardSize = 'default' | 'compact'

export type StatsCardProps = {
  label: string
  value: ReactNode
  subtitle?: string
  icon: ElementType
  /** Cor accent (borda esquerda, valor, ícone) — hex ou CSS var */
  color?: string
  size?: StatsCardSize
  loading?: boolean
  className?: string
  /** Cartão clicável (filtro / drill) — paridade Tecnopano */
  onClick?: () => void
  disabled?: boolean
  /** Realce quando corresponde ao filtro ativo */
  selected?: boolean
}

/**
 * Card de métrica estilo Tecnopano StatsCard / Home Suprimentos.
 * Texto à esquerda → ícone circular à direita.
 * Com `onClick` vira botão (Indicadores rápidos).
 */
export function StatsCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--color-gov-azul-profundo)',
  size = 'compact',
  loading = false,
  className,
  onClick,
  disabled,
  selected,
}: StatsCardProps) {
  const compact = size === 'compact'
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      className={cn(
        'relative flex min-w-0 items-center justify-between gap-2 rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card-flat)]',
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5',
        onClick &&
          'cursor-pointer text-left transition-[box-shadow,border-color,transform] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] hover:shadow-[var(--shadow-card-raise)] active:scale-[0.99]',
        onClick && disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        selected &&
          'ring-2 ring-[var(--color-primary)]/35 ring-offset-1 ring-offset-[var(--color-surface)]',
        className,
      )}
      style={{ borderLeft: `${compact ? 3 : 4}px solid ${color}` }}
    >
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'mb-0.5 block font-semibold uppercase leading-tight tracking-[0.4px] text-[var(--color-fg-muted)]',
            compact ? 'text-[9px]' : 'mb-[3px] text-[10px]',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'font-heading block font-extrabold leading-none tabular-nums',
            compact ? 'text-lg' : 'text-2xl',
          )}
          style={{ color }}
        >
          {loading ? '…' : value}
        </span>
        {subtitle ? (
          <span
            className={cn(
              'mt-0.5 block leading-snug text-[var(--color-fg-muted)]',
              compact ? 'text-[9px]' : 'mt-[3px] text-[10px]',
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full',
          compact ? 'h-8 w-8' : 'h-10 w-10',
        )}
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 6%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 12%, transparent)`,
        }}
        aria-hidden
      >
        <Icon
          className={compact ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]'}
          style={{ color }}
        />
      </div>
    </Tag>
  )
}

export type StatsCardGridProps = {
  children: ReactNode
  /** Quantidade alvo de colunas no desktop largo (padrão 7 = Home Suprimentos). */
  columnsXl?: 4 | 5 | 6 | 7
  className?: string
}

/**
 * Grade responsiva para fileira de StatsCard (Home / indicadores).
 * Phone: scroll horizontal · tablet: 2–3 cols · lg: 4 · xl: N numa linha.
 */
export function StatsCardGrid({ children, columnsXl = 7, className }: StatsCardGridProps) {
  const xlCols =
    columnsXl === 4
      ? 'xl:grid-cols-4'
      : columnsXl === 5
        ? 'xl:grid-cols-5'
        : columnsXl === 6
          ? 'xl:grid-cols-6'
          : 'xl:grid-cols-7'

  return (
    <div
      className={cn(
        'grid gap-3',
        'grid-flow-col auto-cols-[minmax(168px,1fr)] overflow-x-auto pb-1',
        'sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:overflow-visible',
        'md:grid-cols-3',
        'lg:grid-cols-4',
        xlCols,
        'xl:gap-2.5',
        className,
      )}
    >
      {children}
    </div>
  )
}
