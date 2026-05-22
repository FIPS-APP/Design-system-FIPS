import * as React from 'react'
import { cn } from '../../lib/cn'
import type { FieldDensity } from './field'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  density?: FieldDensity
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, density = 'default', ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex w-full resize-y rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] text-[var(--color-fg)] transition-all duration-200 placeholder:text-[var(--color-fg-muted)] placeholder:opacity-100 hover:border-[var(--color-border)]/80 focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:outline-none data-[state-preview=focused]:border-[var(--color-primary)] data-[state-preview=focused]:ring-2 data-[state-preview=focused]:ring-[var(--color-primary)]/20 data-[state-preview=focused]:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-fg-muted)] disabled:opacity-70 aria-[invalid=true]:border-[var(--color-danger)]/70 aria-[invalid=true]:focus-visible:border-[var(--color-danger)] aria-[invalid=true]:focus-visible:ring-2 aria-[invalid=true]:focus-visible:ring-[var(--color-danger)]/20 aria-[invalid=true]:data-[state-preview=focused]:border-[var(--color-danger)] aria-[invalid=true]:data-[state-preview=focused]:ring-2 aria-[invalid=true]:data-[state-preview=focused]:ring-[var(--color-danger)]/20 dark:border-[#3a3a3a] dark:bg-[#252525] dark:hover:border-[#4a4a4a] dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/20 dark:data-[state-preview=focused]:border-[#93BDE4] dark:data-[state-preview=focused]:ring-[#93BDE4]/20 dark:disabled:bg-[#1A1A1A]',
          density === 'compact'
            ? 'min-h-[92px] px-3 py-2 text-sm shadow-sm'
            : 'min-h-[132px] px-4 py-3 text-[1.02rem] shadow-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
