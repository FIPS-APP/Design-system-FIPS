import * as React from 'react'
import { cn } from '../../lib/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /** Texto à esquerda, acima da barra. Liga a barra ao texto por `aria-labelledby`. */
  label?: React.ReactNode
  /** Mostra o percentual (`72%`) à direita, acima da barra. Vira o `aria-valuetext` da barra. */
  showValue?: boolean
}

function clampValue(value: number, max: number) {
  if (max <= 0) return 0
  return Math.min(Math.max(value, 0), max)
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, label, showValue = false, id, 'aria-labelledby': labelledBy, ...props }, ref) => {
    const rotuloId = React.useId()
    const boundedValue = clampValue(value, max)
    const percent = max > 0 ? (boundedValue / max) * 100 : 0

    const percentual = `${Math.round(percent)}%`
    const comRotulo = label != null || showValue

    const barra = (
      <div
        ref={ref}
        id={id}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(boundedValue)}
        aria-valuetext={showValue ? percentual : undefined}
        aria-labelledby={label != null ? [rotuloId, labelledBy].filter(Boolean).join(' ') : labelledBy}
        className={cn(
          'relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)] shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]',
          className,
        )}
        {...props}
      >
        {/* Anima por transform (não por width): a barra cheia desliza para dentro da trilha.
            O degradê ocupa só o trecho visível (o fim da barra), como quando ela crescia por width.
            background-size transiciona junto, com a mesma duração e curva do transform; sem isso o
            degradê encolhe na hora e a barra se desfaz no meio da transição. */}
        <div
          className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary-text))] bg-right bg-no-repeat transition-[transform,background-size] duration-300 ease-out"
          style={{ transform: `translateX(-${100 - percent}%)`, backgroundSize: `${percent}% 100%` }}
        />
      </div>
    )

    if (!comRotulo) return barra

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-baseline justify-between gap-3 text-sm text-[var(--color-fg)]">
          {label != null ? <span id={rotuloId}>{label}</span> : <span />}
          {showValue ? <span className="font-semibold tabular-nums">{percentual}</span> : null}
        </div>
        {barra}
      </div>
    )
  },
)

Progress.displayName = 'Progress'

export { Progress }
