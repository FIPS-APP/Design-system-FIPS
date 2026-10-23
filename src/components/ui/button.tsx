import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { buttonVariants, type ButtonVariantProps } from './button-variants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          aria-busy={loading}
          data-loading={loading ? 'true' : undefined}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={classes}
        ref={ref}
        aria-busy={loading}
        data-loading={loading ? 'true' : undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden /> : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button }
