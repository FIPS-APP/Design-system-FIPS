import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '../../lib/cn'

/**
 * Área com rolagem estilizada. API do shadcn: `className` no contêiner (defina a altura ou a largura máxima
 * nele), `ScrollBar` para a barra horizontal. Barra sempre visível (`type="always"`), polegar em
 * `--color-border-control` (3:1 ou mais sobre o fundo, nos dois temas). O trecho que rola recebe foco por
 * teclado, e as setas, PageUp, PageDown, Home e End rolam. Passe `aria-label` ou `aria-labelledby` para que
 * ele seja anunciado como região. Sem animação com redução de movimento.
 */
const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    'aria-label'?: string
    'aria-labelledby'?: string
    /** Mostra também a barra horizontal. */
    horizontal?: boolean
  }
>(({ className, children, type = 'always', horizontal = false, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
  const rotulado = Boolean(ariaLabel || ariaLabelledBy)
  return (
    <ScrollAreaPrimitive.Root ref={ref} type={type} className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        tabIndex={0}
        role={rotulado ? 'region' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="h-full w-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      {horizontal ? <ScrollBar orientation="horizontal" /> : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = 'ScrollArea'

const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none p-[2px] transition-colors motion-reduce:transition-none',
      orientation === 'vertical' && 'h-full w-3 border-l border-l-transparent',
      orientation === 'horizontal' && 'h-3 flex-col border-t border-t-transparent',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[var(--color-border-control)]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }
