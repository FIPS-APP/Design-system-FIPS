import { cn } from '../../lib/cn'

export interface PillOption {
  value: string
  label: string
  /** Cor semântica opcional. Ativo = fundo cheio; inativo = dot colorido. */
  color?: string
}

/** Filtro segmentado — poucas opções, 1 clique, cor escaneável. */
export function PillFilter({
  options,
  value,
  onChange,
  multiple = false,
}: {
  options: PillOption[]
  value: string | string[]
  onChange: (v: string) => void
  multiple?: boolean
}) {
  const selected = Array.isArray(value) ? value : []
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = multiple
          ? o.value === ''
            ? selected.length === 0
            : selected.includes(o.value)
          : o.value === value
        return (
          <button
            key={o.value || 'todos'}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-[3px] text-[11px] font-semibold transition-all duration-100',
              active
                ? o.color
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-fg)]',
            )}
            style={active && o.color ? { background: o.color } : undefined}
          >
            {o.color && !active ? (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: o.color }} aria-hidden />
            ) : null}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
