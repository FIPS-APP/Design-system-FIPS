import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ActiveFilterChip = {
  /** Chave estável do chip (normalmente a dimensão filtrada). */
  key: string
  /** O VALOR filtrado, não o nome do campo. "Pendente", não "Status". */
  label: string
  /** Remove SÓ este valor. */
  remove: () => void
}

export interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[]
  /** Zera todos os filtros. Sem isto, o "Limpar" não aparece. */
  onClearAll?: () => void
  /** Reabre o Drawer de filtros — destino do "+N" quando há excedente. */
  onOpenFilters?: () => void
  /** Quantos chips cabem antes de virar "+N". */
  max?: number
  className?: string
}

/** Quantos chips cabem no header antes de virar "+N". */
export const MAX_FILTER_CHIPS = 4

/**
 * Chips de filtro ativo — OBRIGATÓRIO em toda listagem com botão "Filtros".
 *
 * Vai **inline à ESQUERDA, logo após o título** do card da listagem (separado
 * por `·`), nunca no slot direito de ações — lá ficam ViewToggle/Configurar.
 *
 * Regra: um chip por VALOR filtrado, nunca uma contagem genérica ("3 filtros")
 * nem um badge "Filtrado". Contagem não diz O QUE está filtrado — o usuário
 * teria que reabrir o Drawer pra descobrir e só conseguiria limpar tudo de uma
 * vez. Cada chip remove só o seu valor pelo X; acima de `max` o excedente vira
 * "+N" que reabre o Drawer; a partir de 2 chips aparece um "Limpar" textual.
 */
export function ActiveFilterChips({
  chips,
  onClearAll,
  onOpenFilters,
  max = MAX_FILTER_CHIPS,
  className,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null

  const excedente = chips.length - max

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span className="text-sm text-[var(--color-fg-muted)]" aria-hidden>
        ·
      </span>

      {chips.slice(0, max).map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          title={`Remover filtro: ${c.label}`}
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap rounded transition-all hover:brightness-95',
            'border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)]',
            'py-0.5 pl-2 pr-1 text-[10px] font-semibold text-[var(--color-fg)]',
          )}
        >
          <SlidersHorizontal className="h-2.5 w-2.5" strokeWidth={2.2} aria-hidden />
          {c.label}
          <X className="h-[11px] w-[11px] opacity-70" strokeWidth={2.5} aria-hidden />
        </button>
      ))}

      {excedente > 0 ? (
        <button
          type="button"
          onClick={onOpenFilters}
          title="Ver todos os filtros ativos"
          className={cn(
            'inline-flex items-center whitespace-nowrap rounded transition-all hover:brightness-95',
            'border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)]',
            'px-2 py-0.5 text-[10px] font-semibold text-[var(--color-fg-muted)]',
          )}
        >
          +{excedente}
        </button>
      ) : null}

      {chips.length > 1 && onClearAll ? (
        <button
          type="button"
          onClick={onClearAll}
          title="Limpar todos os filtros"
          className="whitespace-nowrap text-[10px] font-semibold text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-danger)]"
        >
          Limpar
        </button>
      ) : null}
    </div>
  )
}
