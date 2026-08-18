import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { ExcelIcon, PdfIcon } from '../icons/FileIcons'

const EXCEL = 'var(--color-vendor-excel)'
const PDF = 'var(--color-danger)'

export type ExportButtonsProps = {
  onExcel?: () => void
  onPdf?: () => void
  className?: string
}

/**
 * Par Excel + PDF (32.5×32.5) — toolbar de listagem Tecnopano / Data Listing.
 * Botões nativos (não `Button` + tint via className — governance/no-visual-overrides).
 */
export function ExportButtons({ onExcel, onPdf, className }: ExportButtonsProps) {
  return (
    <div className={cn('inline-flex shrink-0 items-center gap-2', className)}>
      <ExportIconButton
        aria-label="Exportar para Excel (.xlsx)"
        title="Exportar para Excel"
        accent={EXCEL}
        onClick={onExcel}
      >
        <ExcelIcon size={16} color={EXCEL} />
      </ExportIconButton>
      <ExportIconButton
        aria-label="Exportar para PDF (.pdf)"
        title="Exportar para PDF"
        accent={PDF}
        onClick={onPdf}
      >
        <PdfIcon size={16} />
      </ExportIconButton>
    </div>
  )
}

function ExportIconButton({
  accent,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { accent: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-[32.5px] cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-[background,border-color] duration-150',
        className,
      )}
      style={{ ['--export-accent' as string]: accent } as CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `color-mix(in srgb, ${accent} 3%, transparent)`
        e.currentTarget.style.borderColor = `color-mix(in srgb, ${accent} 25%, var(--color-border))`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface)'
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
      {...props}
    >
      {children}
    </button>
  )
}
