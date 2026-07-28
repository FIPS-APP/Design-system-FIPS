import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogContent, DialogFooter, DialogClose } from '../ui/dialog'
import { Button } from '../ui/button'
import {
  FileSpreadsheet,
  FileText,
  FileType,
  GripVertical,
  Maximize2,
  Minimize2,
  Printer,
  X,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export type ExportLayout = 'all' | 'table' | 'expanded'
export type ExportIntent = 'excel' | 'pdf'

export type ExportColumn = {
  key: string
  label: string
  render?: (row: unknown) => ReactNode
}

export type ExportPreviewModalProps<T = unknown> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: ExportColumn[]
  data: T[]
  /** Colunas extras incluídas no modo Expandida (além das da listagem). */
  expandedColumnKeys?: string[]
  /** Colunas visíveis na listagem (modo Tabela / base do Expandida). */
  tableColumnKeys?: string[]
  /** Formato escolhido na toolbar — define quais ações aparecem no footer. */
  intent?: ExportIntent
  onExportExcel?: (selectedColumns: string[], layout: ExportLayout) => void
  onExportPdf?: (selectedColumns: string[], layout: ExportLayout) => void
  onPrint?: (selectedColumns: string[], layout: ExportLayout) => void
  filename?: string
  previewLimit?: number
}

function ExportColumnChip({
  label,
  selected,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  label: string
  selected: boolean
  onToggle: () => void
  onDragStart: (e: DragEvent<HTMLButtonElement>) => void
  onDragOver: (e: DragEvent<HTMLButtonElement>) => void
  onDrop: (e: DragEvent<HTMLButtonElement>) => void
}) {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onToggle}
            className={cn(
              'group inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all',
              selected
                ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-[var(--color-primary)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]',
            )}
          >
            <GripVertical className="h-3 w-3 cursor-grab opacity-50 active:cursor-grabbing" />
            {label}
            {selected ? (
              <span className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-sm opacity-60 transition-opacity group-hover:opacity-100">
                <X className="h-2.5 w-2.5" />
              </span>
            ) : null}
          </button>
        </TooltipTrigger>
        {selected ? <TooltipContent side="top">Remover &quot;{label}&quot;</TooltipContent> : null}
      </Tooltip>
    </TooltipProvider>
  )
}

export function resolveExportKeys(
  layout: ExportLayout,
  orderedKeys: string[],
  selectedOrderedKeys: string[],
  tableColumnKeys: string[],
  expandedColumnKeys: string[],
): string[] {
  const tableSet = new Set(tableColumnKeys)
  const expandedSet = new Set(expandedColumnKeys)
  const sel = new Set(selectedOrderedKeys)
  const tableKeys =
    tableColumnKeys.length > 0 ? orderedKeys.filter((k) => tableSet.has(k)) : [...orderedKeys]

  if (layout === 'all') return selectedOrderedKeys
  if (layout === 'table') return tableKeys.filter((k) => sel.has(k))
  if (layout === 'expanded') {
    const extra =
      expandedColumnKeys.length > 0
        ? orderedKeys.filter((k) => expandedSet.has(k))
        : [...orderedKeys]
    return extra.filter((k) => sel.has(k))
  }
  return tableKeys.filter((k) => sel.has(k))
}

/**
 * Modal de preview de exportação — paridade Tecnopano `ExportPreviewModal`.
 * Segmented Tudo/Tabela/Expandida · chips com drag · preview · Cancelar/Imprimir/Planilha|PDF.
 */
export function ExportPreviewModal<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  columns,
  data,
  expandedColumnKeys = [],
  tableColumnKeys = [],
  intent = 'excel',
  onExportExcel,
  onExportPdf,
  onPrint,
  filename = 'export',
  previewLimit = 8,
}: ExportPreviewModalProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(columns.map((c) => c.key)))
  const [orderedKeys, setOrderedKeys] = useState<string[]>(() => columns.map((c) => c.key))
  const [layout, setLayout] = useState<ExportLayout>('table')
  const [fullscreen, setFullscreen] = useState(false)
  const dragKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelected(new Set(columns.map((c) => c.key)))
    setOrderedKeys(columns.map((c) => c.key))
    setLayout('table')
    setFullscreen(false)
    dragKeyRef.current = null
  }, [open, columns])

  const columnMap = useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns])

  const orderedColumns = useMemo(
    () => orderedKeys.map((key) => columnMap.get(key)).filter((c): c is ExportColumn => !!c),
    [orderedKeys, columnMap],
  )

  const selectedOrderedKeys = useMemo(
    () => orderedKeys.filter((key) => selected.has(key)),
    [orderedKeys, selected],
  )

  const exportKeys = useMemo(
    () =>
      resolveExportKeys(
        layout,
        orderedKeys,
        selectedOrderedKeys,
        tableColumnKeys,
        expandedColumnKeys,
      ),
    [layout, orderedKeys, selectedOrderedKeys, tableColumnKeys, expandedColumnKeys],
  )

  const pickerColumns = useMemo(() => {
    if (layout === 'table' && tableColumnKeys.length > 0) {
      const set = new Set(tableColumnKeys)
      return orderedColumns.filter((c) => set.has(c.key))
    }
    if (layout === 'expanded' && expandedColumnKeys.length > 0) {
      const set = new Set(expandedColumnKeys)
      return orderedColumns.filter((c) => set.has(c.key))
    }
    return orderedColumns
  }, [layout, orderedColumns, tableColumnKeys, expandedColumnKeys])

  const previewColumns = useMemo(
    () => exportKeys.map((key) => columnMap.get(key)).filter((c): c is ExportColumn => !!c),
    [exportKeys, columnMap],
  )

  const previewRows = useMemo(() => data.slice(0, previewLimit), [data, previewLimit])

  const layoutHint = useMemo(() => {
    if (layout === 'all') return 'Personalize colunas abaixo'
    if (layout === 'expanded') return 'Colunas da listagem + campos expandidos'
    return 'Colunas visíveis na listagem'
  }, [layout])

  const toggleColumn = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    if (selected.size === columns.length) setSelected(new Set())
    else setSelected(new Set(columns.map((c) => c.key)))
  }, [columns, selected.size])

  const reorder = useCallback((fromKey: string, toKey: string) => {
    if (fromKey === toKey) return
    setOrderedKeys((keys) => {
      const fromIdx = keys.indexOf(fromKey)
      const toIdx = keys.indexOf(toKey)
      if (fromIdx < 0 || toIdx < 0) return keys
      const next = [...keys]
      next.splice(fromIdx, 1)
      next.splice(toIdx, 0, fromKey)
      return next
    })
  }, [])

  const runExport = useCallback(
    (action: 'excel' | 'pdf' | 'print') => {
      const keys = exportKeys
      if (keys.length === 0) return
      if (action === 'excel') onExportExcel?.(keys, layout)
      if (action === 'pdf') onExportPdf?.(keys, layout)
      if (action === 'print') onPrint?.(keys, layout)
      onOpenChange(false)
    },
    [exportKeys, layout, onExportExcel, onExportPdf, onOpenChange, onPrint],
  )

  const layoutOptions: { id: ExportLayout; label: string; Icon: typeof FileType }[] = [
    { id: 'all', label: 'Tudo', Icon: FileType },
    { id: 'table', label: 'Tabela', Icon: FileSpreadsheet },
    { id: 'expanded', label: 'Expandida', Icon: Maximize2 },
  ]

  const isExcelIntent = intent === 'excel'
  const modalTitle = isExcelIntent ? 'Exportar planilha' : 'Exportar PDF'
  const ModalIcon = isExcelIntent ? FileSpreadsheet : FileText

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0 sm:p-0',
          fullscreen
            ? // sm:max-h do Dialog base (90vh) sobrescrevia max-h solto — forçar altura cheia em todos breakpoints
              'h-[96dvh] max-h-[96dvh] w-[min(96vw,1400px)] max-w-[min(96vw,1400px)] sm:h-[96dvh] sm:max-h-[96dvh]'
            : 'max-h-[85vh] max-w-4xl sm:max-h-[85vh]',
        )}
      >
          {/* Header — hero gov-gradient, mesmo padrão do ChangelogModal (âmbar + eyebrow + JunctionLines) */}
          <div
            className="relative shrink-0 overflow-hidden px-6 pt-5 pb-4 text-white"
            style={{ background: 'var(--fips-banner-content-bg)' }}
          >
            <svg
              viewBox="0 0 320 200"
              fill="none"
              aria-hidden
              className="pointer-events-none absolute -top-2.5 -right-5 h-[200px] w-[360px] opacity-[0.06]"
            >
              <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <DialogClose
              className="absolute top-5 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/75 transition-colors hover:bg-white/[0.18] hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" aria-hidden />
            </DialogClose>

            <div className="relative flex items-start gap-3 pr-10">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10"
                style={{ boxShadow: '0 1px 2px rgba(0,42,104,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' }}
              >
                <ModalIcon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-heading block text-[11px] font-semibold tracking-[0.14em] text-[var(--color-accent-strong)] uppercase">
                  Exportação
                </span>
                <DialogPrimitive.Title className="font-heading text-[17px] leading-tight font-bold text-white">
                  {modalTitle}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-0.5 text-[12px] text-white/65">
                  <strong className="text-white">{data.length}</strong> registros ·{' '}
                  <strong className="text-white">{previewColumns.length}</strong> colunas
                  no preview · arquivo <span className="font-mono">{filename}</span>
                </DialogPrimitive.Description>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen((f) => !f)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.08] px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-white/75 uppercase transition-colors hover:bg-white/[0.16] hover:text-white"
                title={fullscreen ? 'Voltar ao tamanho compacto' : 'Ampliar em tela cheia'}
                aria-pressed={fullscreen}
              >
                {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                {fullscreen ? 'Compacto' : 'Tela cheia'}
              </button>
            </div>
          </div>

          <div className="shrink-0 border-b border-[var(--color-border)] px-6 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className="flex w-max min-w-0 items-center gap-0.5 p-1"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px 10px 10px 18px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {layoutOptions.map(({ id, label, Icon }) => {
                  const isActive = layout === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setLayout(id)}
                      className="relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold transition-all"
                      style={{
                        borderRadius: '8px 8px 8px 14px',
                        background: isActive ? 'rgba(0,75,155,0.15)' : 'transparent',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-fg-muted)',
                        border: isActive
                          ? '1px solid var(--color-primary)'
                          : '1px solid transparent',
                        cursor: 'pointer',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  )
                })}
              </div>
              <span className="text-[10px] font-medium text-[var(--color-fg-muted)]">
                {layoutHint}
              </span>
            </div>
          </div>

          <div className="shrink-0 border-b border-[var(--color-border)] px-6 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[1px] text-[var(--color-fg-muted)] uppercase">
                Colunas — Clique para selecionar/desmarcar · Arraste para reordenar
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-fg)]"
              >
                {selected.size === columns.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pickerColumns.map((col) => (
                <ExportColumnChip
                  key={col.key}
                  label={col.label}
                  selected={selected.has(col.key)}
                  onToggle={() => toggleColumn(col.key)}
                  onDragStart={(e) => {
                    dragKeyRef.current = col.key
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (dragKeyRef.current) reorder(dragKeyRef.current, col.key)
                    dragKeyRef.current = null
                  }}
                />
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-6 py-3">
            {previewColumns.length === 0 ? (
              <div className="flex h-full min-h-[160px] items-center justify-center">
                <p className="text-center text-sm text-[var(--color-fg-muted)]">
                  Selecione ao menos uma coluna para visualizar
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(0,75,155,0.04)]">
                <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_4%,transparent)]">
                    <FileSpreadsheet className="h-[22px] w-[22px] text-[var(--color-primary)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-bold text-[var(--color-fg)]">
                      Pré-visualização
                    </h3>
                    <p className="text-[11px] text-[var(--color-fg-muted)]">
                      {previewRows.length} de {data.length} linhas · {previewColumns.length} colunas ·{' '}
                      {layoutHint}
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[var(--color-surface-muted)]">
                        {previewColumns.map((col) => (
                          <th
                            key={col.key}
                            className="border-b-2 border-[var(--color-border)] px-3 py-2 font-heading text-[9px] font-bold tracking-wider text-[var(--color-fg-muted)] uppercase"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr
                          key={String(
                            row.id ?? row.numero ?? row.codigo ?? row.nomeFantasia ?? `row-${i}`,
                          )}
                          className="border-b border-[var(--color-border)]"
                        >
                          {previewColumns.map((col) => (
                            <td
                              key={col.key}
                              className="px-3 py-2 font-mono text-[11px] text-[var(--color-fg-muted)]"
                            >
                              {col.render
                                ? col.render(row)
                                : String(row[col.key] ?? '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {data.length > previewLimit ? (
              <p className="mt-2 text-center text-[10px] text-[var(--color-fg-muted)]">
                Preview de {previewLimit} de {data.length} linhas. A exportação inclui todas.
              </p>
            ) : null}
          </div>

          <DialogFooter className="shrink-0 border-t border-[var(--color-border)] px-6 py-3">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[var(--color-fg-muted)]">
                {exportKeys.length} cols · {data.length} linhas · {layout}
              </span>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
                {onPrint ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runExport('print')}
                    disabled={exportKeys.length === 0}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Imprimir
                  </Button>
                ) : null}
                {onExportPdf ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => runExport('pdf')}
                    disabled={exportKeys.length === 0}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                ) : null}
                {onExportExcel ? (
                  <Button
                    variant="successStrong"
                    size="sm"
                    onClick={() => runExport('excel')}
                    disabled={exportKeys.length === 0}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Excel
                  </Button>
                ) : null}
              </div>
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
