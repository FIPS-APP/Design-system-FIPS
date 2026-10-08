import { useState, type ReactNode } from 'react'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Drawer, DrawerContent, DrawerHero } from '../ui/drawer'
import { cn } from '../../lib/cn'

export type FilterBlockProps = {
  /** Conteúdo do drawer. Sem ele o botão Filtros não aparece. */
  filters?: ReactNode
  /** Quantos filtros do drawer estão preenchidos. Vira o badge do botão. */
  activeCount?: number
  /** Zera os filtros do drawer (e a busca, se o dono da tela quiser). */
  onClear?: () => void
  /** Sobrancelha dourada do drawer, ex.: "Mapa de Pátios". */
  eyebrow?: string
  /** Resultados que sobraram, para o rodapé do drawer. */
  resultCount?: number
  /** Texto da busca. A busca só aparece se `onSearchChange` vier junto. */
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** Controles da tela antes da ação de exportar (ex.: "Expandir tudo"). */
  trailing?: ReactNode
  /**
   * Vaga única de exportar/relatório: `ExportButtons` (par Excel/PDF), um botão
   * de PDF sozinho ou um botão desabilitado enquanto a exportação não existe.
   */
  actions?: ReactNode
  className?: string
}

/**
 * Bloco de filtros da casa: Filtros (abre drawer) · Busca · Exportar.
 * Card 10/10/10/18, controles de 30px. As dimensões moram no drawer, nunca soltas na barra.
 * Busca e exportação são opcionais: tela sem busca não ganha campo vazio.
 */
export function FilterBlock({
  filters,
  activeCount = 0,
  onClear,
  eyebrow,
  resultCount,
  search = '',
  onSearchChange,
  searchPlaceholder = 'Buscar…',
  trailing,
  actions,
  className,
}: FilterBlockProps) {
  const [open, setOpen] = useState(false)
  const hasActive = activeCount > 0

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-4',
        className,
      )}
    >
      {filters ? (
        <div className="shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <Filter aria-hidden />
            Filtros
            {hasActive ? (
              <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
          </Button>

          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent
              side="left"
              showCloseButton={false}
              className="max-w-[400px] gap-0 overflow-hidden p-0 sm:p-0"
            >
              <DrawerHero
                icon={SlidersHorizontal}
                eyebrow={eyebrow}
                title="Filtros"
                description={hasActive ? `${activeCount} filtro(s) ativo(s)` : 'Refine a listagem pelos campos abaixo'}
              />
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">{filters}</div>
              <div className="flex shrink-0 gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onClear}
                  disabled={!onClear || (!hasActive && !search)}
                >
                  Limpar tudo
                </Button>
                <Button type="button" variant="primary" size="sm" className="flex-1" onClick={() => setOpen(false)}>
                  Ver {resultCount === undefined ? 'resultados' : `${resultCount} resultado${resultCount === 1 ? '' : 's'}`}
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : null}

      {onSearchChange ? (
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-fg-muted)]"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-[30px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-2.5 text-[13px] text-[var(--color-fg)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25"
          />
        </div>
      ) : (
        <div className="hidden flex-1 sm:block" aria-hidden />
      )}

      {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
