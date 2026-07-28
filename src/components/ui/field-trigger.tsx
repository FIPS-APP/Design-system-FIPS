import * as React from 'react'
import { cn } from '../../lib/cn'
import type { FieldDensity } from './field'

export interface FieldTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  density?: FieldDensity
  placeholder?: string
  value?: string
}

const FieldTrigger = React.forwardRef<HTMLButtonElement, FieldTriggerProps>(
  (
    { className, leftIcon, rightIcon, density = 'default', placeholder, value, type = 'button', children, ...props },
    ref,
  ) => {
    const content = children ?? value ?? placeholder
    const isPlaceholder = !children && !value

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'relative flex w-full items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-left text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-fg-muted)] disabled:opacity-70 dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/25',
          density === 'compact'
            ? 'h-8 px-2.5 text-[13px]'
            : 'h-12 px-4 text-[1.08rem]',
          leftIcon && (density === 'compact' ? 'pl-8' : 'pl-11'),
          rightIcon && (density === 'compact' ? 'pr-8' : 'pr-11'),
          className,
        )}
        {...props}
      >
        {leftIcon ? (
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]',
              density === 'compact'
                ? 'left-2.5 [&_svg]:h-3.5 [&_svg]:w-3.5'
                : 'left-4 [&_svg]:h-4 [&_svg]:w-4',
            )}
          >
            {leftIcon}
          </span>
        ) : null}

        <span className={cn('min-w-0 flex-1 truncate font-normal', isPlaceholder && 'text-[var(--color-fg-muted)]')}>
          {content}
        </span>

        {rightIcon ? (
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]',
              density === 'compact'
                ? 'right-2.5 [&_svg]:h-3.5 [&_svg]:w-3.5'
                : 'right-4 [&_svg]:h-4 [&_svg]:w-4',
            )}
          >
            {rightIcon}
          </span>
        ) : null}
      </button>
    )
  },
)

FieldTrigger.displayName = 'FieldTrigger'

export { FieldTrigger }
