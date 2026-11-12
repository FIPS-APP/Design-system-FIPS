import * as React from 'react'
import { cn } from '../../lib/cn'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Bloco de carregamento. API do shadcn: `className` (tamanho e forma) e props de div.
 * Decorativo: nasce com `aria-hidden`. Quem avisa o leitor de tela é o contêiner,
 * com `role="status"` e `aria-label` (ver a página do componente).
 * Pulsa por `animate-pulse`; com redução de movimento ligada fica parado.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    data-slot="skeleton"
    className={cn('animate-pulse rounded-md bg-[var(--color-border)] motion-reduce:animate-none', className)}
    {...props}
  />
))

Skeleton.displayName = 'Skeleton'

export { Skeleton }
