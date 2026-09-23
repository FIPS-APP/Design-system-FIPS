import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Cabeçalho numerado de seção (padrão Registro OPA / formulários densos). */
export function FormSectionHeader({
  num,
  title,
  hint,
  Icon,
}: {
  num: number
  title: string
  hint?: string
  Icon: LucideIcon
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: 'var(--color-fips-blue-200)',
          color: 'var(--color-primary)',
        }}
      >
        <Icon style={{ width: 12, height: 12 }} strokeWidth={2.2} aria-hidden />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--color-fg)]">
          {num}. {title}
        </span>
        {hint ? <span className="text-[10px] text-[var(--color-fg-muted)]">{hint}</span> : null}
      </div>
    </div>
  )
}

/** Card de seção — cantos assimétricos, borda e sombra leve (Registro OPA). */
export function FormSectionCard({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div
      className={cn('mb-2.5', className)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: '12px 12px 12px 24px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0,75,155,.04)',
        padding: '14px 16px',
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
