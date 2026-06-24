import * as React from 'react'
import { cn } from '../../lib/cn'
import { badgeVariants, type BadgeVariantProps } from './badge-variants'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantProps {
  dot?: boolean
}

function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? (
        <span
          className={cn('rounded-full bg-current', size === 'sm' ? 'h-[5px] w-[5px]' : 'h-1.5 w-1.5')}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  )
}

export { Badge }
