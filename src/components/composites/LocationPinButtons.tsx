import { Check, MapPin } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'

export type LocationPinButtonsProps = {
  options: readonly string[]
  value: string | null
  onChange: (value: string) => void
  /** Rótulo do grupo para leitor de tela */
  ariaLabel?: string
  loading?: boolean
  className?: string
}

/** Poucas cidades fixas: botões compactos (primary/outline) com Check ou MapPin. */
export function LocationPinButtons({
  options,
  value,
  onChange,
  ariaLabel = 'Local de Atividade',
  loading = false,
  className,
}: LocationPinButtonsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex min-h-8 flex-wrap items-center gap-2', className)}
    >
      {loading
        ? null
        : options.map((c) => {
            const escolhida = value === c
            return (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={escolhida ? 'primary' : 'outline'}
                aria-pressed={escolhida}
                onClick={() => onChange(c)}
              >
                {escolhida ? <Check aria-hidden /> : <MapPin aria-hidden />}
                {c}
              </Button>
            )
          })}
    </div>
  )
}
