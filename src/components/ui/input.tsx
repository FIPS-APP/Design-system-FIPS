import * as React from 'react'
import { cn } from '../../lib/cn'
import type { FieldDensity } from './field'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  density?: FieldDensity
  /** Obrigatório ainda vazio. Some com `aria-invalid`, `disabled` ou `readOnly`: o erro vence. */
  pending?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, density = 'default', pending = false, ...props }, ref) => {
    const invalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true'
    const isPending = pending && !invalid && !props.disabled && !props.readOnly

    return (
      <div className="relative w-full">
        {leftIcon ? (
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--color-fg-muted)]',
              density === 'compact'
                ? 'left-2.5 [&_svg]:h-3.5 [&_svg]:w-3.5'
                : 'left-4 [&_svg]:h-4 [&_svg]:w-4',
            )}
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-lg border border-[var(--color-border-control)] bg-[var(--color-surface)] text-[var(--color-fg)] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-fg-muted)] placeholder:opacity-100 hover:border-[var(--color-fg-muted)] focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 focus-visible:outline-none data-[state-preview=focused]:border-[var(--color-primary)] data-[state-preview=focused]:ring-2 data-[state-preview=focused]:ring-[var(--color-primary)]/25 data-[state-preview=focused]:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-fg-muted)] disabled:opacity-70 aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:focus-visible:ring-2 aria-[invalid=true]:focus-visible:ring-[var(--color-danger)]/25 aria-[invalid=true]:data-[state-preview=focused]:border-[var(--color-danger)] aria-[invalid=true]:data-[state-preview=focused]:ring-2 aria-[invalid=true]:data-[state-preview=focused]:ring-[var(--color-danger)]/25 dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/25 dark:data-[state-preview=focused]:border-[#93BDE4] dark:data-[state-preview=focused]:ring-[#93BDE4]/25',
            density === 'compact'
              ? 'h-8 px-2.5 text-[13px] leading-none'
              : 'h-12 px-4 py-2 text-[1.08rem]',
            leftIcon && (density === 'compact' ? 'pl-8' : 'pl-11'),
            isPending &&
              'border-2 border-[var(--color-semantic-atencao-fg)] bg-[var(--color-semantic-atencao-bg)] hover:border-[var(--color-semantic-atencao-fg)]',
            className,
          )}
          data-pending={isPending ? 'true' : undefined}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
