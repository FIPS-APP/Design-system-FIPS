import { useState, type ReactNode } from 'react'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Drawer, DrawerContent, DrawerHero, DrawerTrigger } from '../ui/drawer'
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
  /** Texto da busca. A busca faz parte do padrão e sempre aparece. */
  search: string
  onSearchChange: (value: string) => void
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
 * Card 12/12/12/24 (padding 0; o respiro 14/18 e o espaço de 10px entre controles são de uma faixa interna,
 * como na Manutenção), botões de 30px e busca de 34px (a linha fecha em 64px). Abaixo de 640px a busca desce para uma
 * segunda linha, em largura total, como na Gestão OPA; a partir de 640px fica na mesma linha. As dimensões moram no drawer, nunca soltas na barra.
 * A busca é obrigatória (`search` e `onSearchChange`); a vaga de exportar é opcional.
 */
export function FilterBlock({
  filters,
  activeCount = 0,
  onClear,
  eyebrow,
  resultCount,
  search,
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
        'rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2.5 px-[18px] py-3.5">
        {filters ? (
          <div className="shrink-0">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Filter aria-hidden />
                  Filtros
                  {hasActive ? (
                    <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white">
                      {activeCount}
                    </span>
                  ) : null}
                </Button>
              </DrawerTrigger>
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

        <div className="relative order-last w-full basis-full sm:order-none sm:w-auto sm:min-w-[160px] sm:flex-1 sm:basis-0">
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
            className="h-[34px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-2.5 text-[13px] text-[var(--color-fg)] transition-colors focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/25"
          />
        </div>

        {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
