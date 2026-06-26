import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Columns3,
  GripVertical,
  Palette,
  Rows3,
  Settings2,
  X,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './button'
import type { TableAppearance, TableDensity } from './table'

export type AdminTableSortDirection = 'asc' | 'desc'
export type AdminTableStatusTone = 'success' | 'warning' | 'danger' | 'muted'

export interface AdminTableColumnItem {
  id: string
  label: string
}

export interface AdminTableSortHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
  direction?: AdminTableSortDirection
}

function AdminTableSortHeader({
  className,
  label,
  active = false,
  direction = 'asc',
  type = 'button',
  ...props
}: AdminTableSortHeaderProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-md text-left transition-colors hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20',
        active ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {active ? (
        direction === 'asc' ? (
          <ArrowUp className="h-3 w-3 text-[var(--color-secondary)]" aria-hidden />
        ) : (
          <ArrowDown className="h-3 w-3 text-[var(--color-secondary)]" aria-hidden />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 text-[var(--color-border-strong)]" aria-hidden />
      )}
    </button>
  )
}

export interface AdminTableCompanyCellProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string
  name: string
}

function AdminTableCompanyCell({ className, initials, name, ...props }: AdminTableCompanyCellProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-fips-blue-100)] text-[11px] font-semibold text-[var(--color-secondary)]">
        {initials}
      </div>
      <span className="max-w-[220px] truncate font-medium text-[var(--color-fg)]">{name}</span>
    </div>
  )
}

const statusToneClasses: Record<AdminTableStatusTone, string> = {
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  muted: 'bg-[var(--color-border-strong)]',
}

export interface AdminTableStatusDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  statuses: AdminTableStatusTone[]
}

function AdminTableStatusDots({ className, statuses, ...props }: AdminTableStatusDotsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      {statuses.map((status, index) => (
        <span
          key={`${status}-${index}`}
          className={cn('h-2.5 w-2.5 rounded-full', statusToneClasses[status])}
          aria-hidden
        />
      ))}
      <span className="sr-only">{statuses.join(', ')}</span>
    </div>
  )
}

const DENSITY_OPTIONS: { id: TableDensity; label: string; desc: string }[] = [
  { id: 'compact', label: 'Compacta', desc: 'Alta densidade' },
  { id: 'normal', label: 'Normal', desc: 'Equilibrada' },
  { id: 'comfortable', label: 'Confortável', desc: 'Mais espaçada' },
]

const APPEARANCE_OPTIONS: { id: keyof TableAppearance; label: string; desc: string }[] = [
  { id: 'zebra', label: 'Linhas zebradas', desc: 'Alterna o fundo das linhas' },
  { id: 'verticalBorders', label: 'Bordas verticais', desc: 'Linhas entre colunas' },
  { id: 'stickyHeader', label: 'Cabeçalho fixo', desc: 'Fica visível ao rolar' },
  { id: 'wrapText', label: 'Quebra de linha', desc: 'Texto longo quebra em linhas' },
]

function ConfigToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-[18px] w-[30px] shrink-0 rounded-full transition-colors',
        checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-strong)]',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-[var(--color-surface)] shadow-sm transition-all',
          checked ? 'left-[14px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

type ConfigTab = 'colunas' | 'densidade' | 'aparencia'

export interface AdminTableColumnMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: AdminTableColumnItem[]
  visibleColumns: Record<string, boolean>
  onToggleColumn: (columnId: string) => void
  onReorderColumn: (sourceId: string, targetId: string) => void
  fixedColumns?: string[]
  density?: TableDensity
  onDensityChange?: (density: TableDensity) => void
  appearance?: TableAppearance
  onAppearanceChange?: (appearance: TableAppearance) => void
  onRestoreDefaults?: () => void
  buttonLabel?: string
}

function AdminTableColumnMenu({
  className,
  columns,
  visibleColumns,
  onToggleColumn,
  onReorderColumn,
  fixedColumns = [],
  density,
  onDensityChange,
  appearance,
  onAppearanceChange,
  onRestoreDefaults,
  buttonLabel = 'Configurar',
  ...props
}: AdminTableColumnMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<ConfigTab>('colunas')
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const visibleCount = columns.filter((c) => visibleColumns[c.id] ?? true).length
  const tabs: { id: ConfigTab; label: string; icon: typeof Columns3 }[] = [
    { id: 'colunas', label: 'Colunas', icon: Columns3 },
    ...(density && onDensityChange
      ? [{ id: 'densidade' as const, label: 'Densidade', icon: Rows3 }]
      : []),
    ...(appearance && onAppearanceChange
      ? [{ id: 'aparencia' as const, label: 'Aparência', icon: Palette }]
      : []),
  ]

  return (
    <div ref={containerRef} className={cn('relative', className)} {...props}>
      <Button
        type="button"
        variant={open ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setOpen((value) => !value)}
      >
        <Settings2 className="h-4 w-4" aria-hidden />
        {buttonLabel}
      </Button>

      {open ? (
        <div className="absolute top-full right-0 z-30 mt-2 w-[300px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-float)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="text-sm font-semibold text-[var(--color-fg)]">Configurações</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-fg)]"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>

          {tabs.length > 1 ? (
            <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              {tabs.map((t) => {
                const TabIcon = t.icon
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-[11px] font-semibold transition-colors',
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
                    )}
                  >
                    <TabIcon className="h-3 w-3" aria-hidden />
                    {t.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div className="max-h-[320px] overflow-y-auto p-3">
            {tab === 'colunas' ? (
              <div className="space-y-1">
                <p className="mb-1.5 ml-1 text-[9px] font-bold uppercase tracking-[1px] text-[var(--color-fg-muted)]">
                  Visíveis ({visibleCount})
                </p>
                {columns.map((column) => {
                  const checked = visibleColumns[column.id] ?? true
                  const fixed = fixedColumns.includes(column.id)
                  const isDropTarget = dropTargetId === column.id
                  return (
                    <div
                      key={column.id}
                      draggable={!fixed}
                      onDragStart={() => {
                        if (!fixed) setDraggedId(column.id)
                      }}
                      onDragEnd={() => {
                        setDraggedId(null)
                        setDropTargetId(null)
                      }}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDropTargetId(column.id)
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        if (draggedId && draggedId !== column.id) onReorderColumn(draggedId, column.id)
                        setDraggedId(null)
                        setDropTargetId(null)
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition-colors',
                        isDropTarget
                          ? 'border-[var(--color-secondary)]/40 bg-[var(--color-semantic-info-bg)]'
                          : 'border-transparent hover:bg-[var(--color-surface-soft)]',
                        fixed && 'opacity-60',
                      )}
                    >
                      <span
                        className={cn(
                          'text-[var(--color-fg-muted)]',
                          fixed ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
                        )}
                      >
                        <GripVertical className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={fixed}
                        onChange={() => onToggleColumn(column.id)}
                        className="h-4 w-4 rounded accent-[var(--color-primary)]"
                        aria-label={`Alternar coluna ${column.label}`}
                      />
                      <span className="flex-1 truncate text-[var(--color-fg)]">{column.label}</span>
                      {fixed ? (
                        <span className="font-mono text-[9px] text-[var(--color-fg-muted)]">fixa</span>
                      ) : checked ? (
                        <Check className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden />
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}

            {tab === 'densidade' && density && onDensityChange ? (
              <div className="space-y-1.5">
                <p className="mb-1.5 ml-1 text-[9px] font-bold uppercase tracking-[1px] text-[var(--color-fg-muted)]">
                  Altura das linhas
                </p>
                {DENSITY_OPTIONS.map((opt) => {
                  const active = density === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onDensityChange(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors',
                        active
                          ? 'border-[var(--color-primary)] bg-[var(--color-semantic-info-bg)]'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-surface-soft)]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2',
                          active
                            ? 'border-[var(--color-primary)]'
                            : 'border-[var(--color-border-strong)]',
                        )}
                      >
                        {active ? (
                          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                        ) : null}
                      </span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            'block text-[12px] font-semibold',
                            active ? 'text-[var(--color-primary)]' : 'text-[var(--color-fg)]',
                          )}
                        >
                          {opt.label}
                        </span>
                        <span className="block text-[10px] text-[var(--color-fg-muted)]">{opt.desc}</span>
                      </span>
                      <span className="flex flex-col items-end gap-0.5" aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={cn(
                              'w-6 rounded-sm opacity-60',
                              opt.id === 'compact' ? 'h-0.5' : opt.id === 'normal' ? 'h-[3px]' : 'h-1',
                              active ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-strong)]',
                            )}
                          />
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : null}

            {tab === 'aparencia' && appearance && onAppearanceChange ? (
              <div className="space-y-0.5">
                <p className="mb-1.5 ml-1 text-[9px] font-bold uppercase tracking-[1px] text-[var(--color-fg-muted)]">
                  Aparência da tabela
                </p>
                {APPEARANCE_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                    <span className="flex-1">
                      <span className="block text-[11px] font-semibold text-[var(--color-fg)]">
                        {opt.label}
                      </span>
                      <span className="block text-[10px] text-[var(--color-fg-muted)]">{opt.desc}</span>
                    </span>
                    <ConfigToggle
                      checked={appearance[opt.id]}
                      onChange={() => onAppearanceChange({ ...appearance, [opt.id]: !appearance[opt.id] })}
                      label={opt.label}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5">
            <button
              type="button"
              onClick={() => onRestoreDefaults?.()}
              className="text-[10px] font-semibold text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              Restaurar padrão
            </button>
            <Button type="button" variant="primary" size="sm" onClick={() => setOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export interface AdminTablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number
  pageCount: number
  itemsPerPage: number
  totalItems?: number
  itemsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

function buildPageList(page: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) pages.push('ellipsis')
  for (let p = start; p <= end; p += 1) pages.push(p)
  if (end < total - 1) pages.push('ellipsis')
  pages.push(total)
  return pages
}

function AdminTablePagination({
  className,
  page,
  pageCount,
  itemsPerPage,
  totalItems,
  onPageChange,
  ...props
}: AdminTablePaginationProps) {
  const totalPages = Math.max(pageCount, 1)
  const from = totalItems != null ? (page - 1) * itemsPerPage + 1 : 0
  const to = totalItems != null ? Math.min(page * itemsPerPage, totalItems) : 0
  const pages = buildPageList(page, totalPages)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-[var(--color-border)] px-6 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <span className="text-[11px] text-[var(--color-fg-muted)]">
        {totalItems != null ? (
          <>
            Mostrando{' '}
            <strong className="font-semibold text-[var(--color-fg)]">
              {from}–{to}
            </strong>{' '}
            de {totalItems} registros
          </>
        ) : (
          <>Página {page} de {totalPages}</>
        )}
      </span>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="iconSm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft aria-hidden />
        </Button>
        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-[11px] text-[var(--color-fg-muted)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              type="button"
              variant={p === page ? 'primary' : 'secondary'}
              size="iconSm"
              onClick={() => onPageChange(p)}
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="secondary"
          size="iconSm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </div>
  )
}

export {
  AdminTableColumnMenu,
  AdminTableCompanyCell,
  AdminTablePagination,
  AdminTableSortHeader,
  AdminTableStatusDots,
}
