import * as React from 'react'
import { cn } from '../../lib/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

function clampValue(value: number, max: number) {
  if (max <= 0) return 0
  return Math.min(Math.max(value, 0), max)
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
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
          'relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)] shadow-[var(--shadow-progress-track)]',
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
