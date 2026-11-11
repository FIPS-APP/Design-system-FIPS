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
  /**
   * `false`: indicador só informativo. Vira `div` (sem foco, hover nem clique) em vez de botão. Padrão `true`:
   * clicar filtra a tabela por este indicador.
   */
  filtravel?: boolean
}

export type ListingKpiRowProps = {
  cards: ListingKpiCard[]
  focusId?: string
  onSelect: (id: string) => void
  onClear: () => void
  loading?: boolean
  /**
   * Título acima da grade ("Indicadores rápidos"). Sem ele (padrão desde a 0.21.0, como no Gestão OPA) a grade
   * aparece sozinha; o botão "Limpar filtro" continua surgindo quando há um indicador selecionado.
   * Até a 0.20.x o título era fixo: quem quer o de antes passa `titulo="Indicadores rápidos"`.
   */
  titulo?: string
  /** Frase pequena sob o título. Só aparece junto do `titulo`. */
  hint?: string
  gridClassName?: string
  className?: string
}

/**
 * Indicadores rápidos — grade de StatsCard clicáveis (filtro da tabela), com título opcional.
 * Paridade Tecnopano `ListingKpiRow` / panelHeader da DataListingToolbar.
 */
export function ListingKpiRow({
  cards,
  focusId = '',
  onSelect,
  onClear,
  loading,
  titulo,
  hint,
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
      {titulo || focusId ? (
        <div className="flex flex-wrap items-end justify-between gap-2">
          {titulo ? (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">{titulo}</h2>
              {hint ? <p className="text-[10px] text-[var(--color-fg-muted)]">{hint}</p> : null}
            </div>
          ) : null}
          {focusId ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md bg-[color-mix(in_srgb,var(--color-primary-text)_10%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--color-primary-text)] hover:bg-[color-mix(in_srgb,var(--color-primary-text)_18%,transparent)]"
            >
              ✕ Limpar filtro
            </button>
          ) : null}
        </div>
      ) : null}
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
            onClick={card.filtravel === false ? undefined : () => toggle(card.id)}
            disabled={loading}
            selected={card.filtravel === false ? false : focusId === card.id}
          />
        ))}
      </div>
    </div>
  )
}
