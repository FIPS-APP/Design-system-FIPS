import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '../../lib/cn'

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/25 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-[var(--color-primary)] data-[state=unchecked]:bg-[var(--color-fips-gray-400)]',
      'dark:data-[state=checked]:bg-[var(--color-fips-blue-400)] dark:data-[state=unchecked]:bg-[var(--color-border-strong)]',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-[var(--shadow-switch-thumb)]',
        'transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0.5',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
