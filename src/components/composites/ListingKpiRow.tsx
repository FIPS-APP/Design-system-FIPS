import type { ElementType } from 'react'
import { StatsCard } from './StatsCard'
import { cn } from '../../lib/cn'

export type ListingKpiCard = {
  id: string
  label: string
  value: string | number
  subtitle: string
  icon: ElementType
  color: string
  className?: string
}

export type ListingKpiRowProps = {
  cards: ListingKpiCard[]
  focusId?: string
  onSelect: (id: string) => void
  onClear: () => void
  loading?: boolean
  hint?: string
  gridClassName?: string
  className?: string
}

/**
 * Indicadores rápidos — título + grade de StatsCard clicáveis (filtro da tabela).
 * Paridade Tecnopano `ListingKpiRow` / panelHeader da DataListingToolbar.
 */
export function ListingKpiRow({
  cards,
  focusId = '',
  onSelect,
  onClear,
  loading,
  hint = 'Mesmo cartão que o resto do sistema; clique para filtrar a tabela.',
  gridClassName = 'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3',
  className,
}: ListingKpiRowProps) {
  const dash = loading ? '—' : undefined

  const toggle = (id: string) => {
    if (focusId === id) onClear()
    else onSelect(id)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            Indicadores rápidos
          </h2>
          <p className="text-[10px] text-[var(--color-fg-muted)]">{hint}</p>
        </div>
        {focusId ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          >
            ✕ Limpar filtro
          </button>
        ) : null}
      </div>
      <div className={gridClassName}>
        {cards.map((card) => (
          <StatsCard
            key={card.id}
            label={card.label}
            value={dash ?? card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            className={card.className}
            onClick={() => toggle(card.id)}
            disabled={loading}
            selected={focusId === card.id}
          />
        ))}
      </div>
    </div>
  )
}
