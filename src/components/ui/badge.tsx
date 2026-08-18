import * as React from 'react'
import { cn } from '../../lib/cn'
import { badgeVariants, type BadgeVariantProps } from './badge-variants'
import { useTableDensity } from './table'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantProps {
  dot?: boolean
}

/**
 * Dentro de `<Table>`, o badge acompanha a densidade da tabela: `comfortable → md`,
 * `compact`/`normal` → `sm`. Fora de tabela, `sm`. A prop `size` explícita sempre vence.
 *
 * Isto era descrito na doc desde sempre, mas `useTableDensity()` não tinha consumidor —
 * o badge ficava `md` em tabela compacta e estourava a altura da linha.
 */
function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  const density = useTableDensity()
  const resolvedSize = size ?? (density === 'comfortable' ? 'md' : 'sm')

  return (
    <div className={cn(badgeVariants({ variant, size: resolvedSize }), className)} {...props}>
      {dot ? (
        <span
          className={cn('rounded-full bg-current', resolvedSize === 'sm' ? 'h-[5px] w-[5px]' : 'h-1.5 w-1.5')}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  )
}

export { Badge }
