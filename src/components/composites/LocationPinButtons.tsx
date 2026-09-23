import { MapPin } from 'lucide-react'
import { cn } from '../../lib/cn'

export type LocationPinButtonsProps = {
  options: readonly string[]
  value: string | null
  onChange: (value: string) => void
  /** Rótulo do grupo para leitor de tela */
  ariaLabel?: string
  loading?: boolean
  loadingLabel?: string
  className?: string
}

/**
 * Seleção de cidade/local com botões pin (Registro OPA).
 * Não usar Select quando há poucas cidades fixas.
 */
export function LocationPinButtons({
  options,
  value,
  onChange,
  ariaLabel = 'Local de Atividade',
  loading = false,
  loadingLabel = 'Carregando...',
  className,
}: LocationPinButtonsProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex flex-wrap gap-2', className)}>
      {loading ? (
        <span className="text-[12px] text-[var(--color-fg-muted)]">{loadingLabel}</span>
      ) : (
        options.map((label) => {
          const active = value === label
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(label)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-semibold"
              style={{
                borderColor: 'var(--color-primary)',
                color: active ? '#fff' : 'var(--color-primary)',
                background: active ? 'var(--color-primary)' : 'var(--color-surface)',
              }}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          )
        })
      )}
    </div>
  )
}
