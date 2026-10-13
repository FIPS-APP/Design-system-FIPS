import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { buttonVariants, type ButtonVariantProps } from './button-variants'
import type { AccessibleName } from './accessible-name'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean
  loading?: boolean
}

/**
 * Botão só-ícone (`size="icon"` ou `"iconSm"` escrito na chamada) exige nome acessível:
 * `aria-label`, `aria-labelledby`, ou `asChild` com o nome no filho. Com `size` dinâmico
 * ou repassado por um wrapper o tipo não sabe o tamanho e não cobra; passe o nome assim mesmo.
 */
export type IconButtonName<S> = [S] extends ['icon' | 'iconSm'] ? AccessibleName | { asChild: true } : unknown

type ButtonComponent = (<S extends ButtonProps['size'] = undefined>(
  props: Omit<ButtonProps, 'size'> & { size?: S } & IconButtonName<S> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement | null) & { displayName?: string }

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
        {loading ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
        {children}
      </button>
    )
  },
)
ButtonBase.displayName = 'Button'

const Button = ButtonBase as ButtonComponent

export { Button }
