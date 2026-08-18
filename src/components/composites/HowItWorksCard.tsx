import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Card, CardContent } from '../ui/card'

export type HowItWorksCardProps = {
  /** Número exibido no badge (1-based). */
  step: number
  title: string
  description: string
  icon: ElementType
  className?: string
}

/**
 * Card de etapa «Como Funciona» — réplica da Home FIPS Suprimentos.
 * Badge numerada no topo, ícone quadrado, título + descrição densos.
 */
export function HowItWorksCard({
  step,
  title,
  description,
  icon: Icon,
  className,
}: HowItWorksCardProps) {
  return (
    <Card
      className={cn(
        'group min-w-0 border border-[var(--color-border)] shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <CardContent className="relative px-2.5 py-3 text-center sm:px-3 sm:py-3.5">
        <span className="absolute -top-2.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-accent-strong)] text-[10px] font-bold text-white shadow-[var(--shadow-step-badge)] sm:-top-3 sm:h-6 sm:w-6 sm:text-xs">
          {step}
        </span>
        <div className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 sm:mt-4 sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 text-[var(--color-primary)] sm:h-5 sm:w-5" />
        </div>
        <h3 className="mt-2 text-[11px] font-semibold leading-snug text-[var(--color-fg)] sm:mt-2.5 sm:text-xs lg:text-[11px] xl:text-[10px] 2xl:text-xs">
          {title}
        </h3>
        <p className="mt-1 text-[10px] leading-snug text-[var(--color-fg-muted)] sm:text-[11px] xl:text-[10px] 2xl:text-[11px]">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export type HowItWorksGridProps = {
  children: ReactNode
  className?: string
}

/**
 * Grade responsiva da seção Como Funciona.
 * Phone 1 · sm/tablet 2 · md 3 · lg+ (notebook/desktop): 7 numa linha.
 */
export function HowItWorksGrid({ children, className }: HowItWorksGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-7 lg:gap-2',
        className,
      )}
    >
      {children}
    </div>
  )
}
