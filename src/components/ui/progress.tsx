import * as React from 'react'
import { cn } from '../../lib/cn'
import type { AccessibleName } from './accessible-name'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

function clampValue(value: number, max: number) {
  if (max <= 0) return 0
  return Math.min(Math.max(value, 0), max)
}

/** `aria-label` ou `aria-labelledby` obrigatório: a barra não tem texto próprio. */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps & AccessibleName>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const boundedValue = clampValue(value, max)
    const percent = max > 0 ? (boundedValue / max) * 100 : 0

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(boundedValue)}
        className={cn(
          'relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)] shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]',
          className,
        )}
        {...props}
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-secondary),var(--color-primary))] transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    )
  },
)

Progress.displayName = 'Progress'

export { Progress }
