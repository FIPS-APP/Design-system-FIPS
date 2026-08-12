import * as React from 'react'
import { cn } from '../../lib/cn'

export type TableDensity = 'compact' | 'normal' | 'comfortable'

export interface TableAppearance {
  zebra: boolean
  verticalBorders: boolean
  stickyHeader: boolean
  wrapText: boolean
}

interface TableConfig extends TableAppearance {
  density: TableDensity
}

const DEFAULT_TABLE_CONFIG: TableConfig = {
  density: 'comfortable',
  zebra: true,
  verticalBorders: false,
  stickyHeader: false,
  wrapText: false,
}

const TableConfigContext = React.createContext<TableConfig>(DEFAULT_TABLE_CONFIG)

// Densidade exposta para descendentes (ex.: Badge ajusta o tamanho). null = fora de uma Table.
const TableDensityContext = React.createContext<TableDensity | null>(null)
export const useTableDensity = () => React.useContext(TableDensityContext)

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  framed?: boolean
  density?: TableDensity
  zebra?: boolean
  verticalBorders?: boolean
  stickyHeader?: boolean
  wrapText?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      framed = true,
      density = 'comfortable',
      zebra = true,
      verticalBorders = false,
      stickyHeader = false,
      wrapText = false,
      ...props
    },
    ref,
  ) => {
    const config = React.useMemo<TableConfig>(
      () => ({ density, zebra, verticalBorders, stickyHeader, wrapText }),
      [density, zebra, verticalBorders, stickyHeader, wrapText],
    )

    const table = (
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        data-density={density}
        {...props}
      />
    )

    return (
      <TableConfigContext.Provider value={config}>
        <TableDensityContext.Provider value={density}>
          {framed ? (
            <div className="relative w-full overflow-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
              {table}
            </div>
          ) : (
            <div className="relative w-full overflow-auto">{table}</div>
          )}
        </TableDensityContext.Provider>
      </TableConfigContext.Provider>
    )
  },
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { stickyHeader } = React.useContext(TableConfigContext)

  return (
    <thead
      ref={ref}
      className={cn(
        'border-b-2 border-[var(--color-border)] bg-[var(--color-surface-muted)]',
        stickyHeader && 'sticky top-0 z-10',
        className,
      )}
      {...props}
    />
  )
})
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    const { zebra } = React.useContext(TableConfigContext)

    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-soft)] data-[state=selected]:bg-[var(--color-surface-muted)]',
          zebra && 'even:bg-[var(--color-table-zebra)]',
          className,
        )}
        {...props}
      />
    )
  },
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density } = React.useContext(TableConfigContext)
  const dense = density !== 'comfortable'

  return (
    <th
      ref={ref}
      className={cn(
        'px-4 text-center align-middle text-[var(--color-fg-muted)]',
        density === 'compact' ? 'py-2' : density === 'normal' ? 'py-2.5' : 'h-14',
        dense
          ? 'text-[9px] font-bold uppercase tracking-[1px] font-[family-name:var(--font-heading)]'
          : 'text-sm font-semibold',
        className,
      )}
      {...props}
    />
  )
})
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, wrapText, verticalBorders } = React.useContext(TableConfigContext)

  return (
    <td
      ref={ref}
      className={cn(
        'px-4 align-middle text-[var(--color-fg)]',
        density === 'compact'
          ? 'py-1.5 text-[11px]'
          : density === 'normal'
            ? 'py-3 text-[12px]'
            : 'py-5 text-[15px]',
        density !== 'comfortable' && (wrapText ? 'whitespace-normal' : 'whitespace-nowrap'),
        verticalBorders && 'border-r border-[var(--color-border)] last:border-r-0',
        className,
      )}
      {...props}
    />
  )
})
TableCell.displayName = 'TableCell'

interface TableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan: number
  title?: string
  description?: string
}

const TableEmpty = React.forwardRef<HTMLTableRowElement, TableEmptyProps>(
  ({ className, colSpan, title = 'Nenhum registro encontrado', description, ...props }, ref) => (
    <tr ref={ref} className={className} {...props}>
      <td colSpan={colSpan} className="px-6 py-14 text-center">
        <div className="mx-auto max-w-sm space-y-2">
          <p className="font-medium text-[var(--color-fg)]">{title}</p>
          {description ? (
            <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{description}</p>
          ) : null}
        </div>
      </td>
    </tr>
  ),
)
TableEmpty.displayName = 'TableEmpty'

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableEmpty }
