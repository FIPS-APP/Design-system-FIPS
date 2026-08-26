import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type RuleTileTone = 'info' | 'atencao' | 'critico' | 'sucesso'

const TONE: Record<RuleTileTone, { border: string; bg: string; fg: string }> = {
  info: {
    border: 'border-[var(--color-semantic-info-border)]',
    bg: 'bg-[var(--color-semantic-info-bg)]',
    fg: 'text-[var(--color-semantic-info-fg)]',
  },
  atencao: {
    border: 'border-[var(--color-semantic-atencao-border)]',
    bg: 'bg-[var(--color-semantic-atencao-bg)]',
    fg: 'text-[var(--color-semantic-atencao-fg)]',
  },
  critico: {
    border: 'border-[var(--color-semantic-critico-border)]',
    bg: 'bg-[var(--color-semantic-critico-bg)]',
    fg: 'text-[var(--color-semantic-critico-fg)]',
  },
  sucesso: {
    border: 'border-[var(--color-semantic-sucesso-border)]',
    bg: 'bg-[var(--color-semantic-sucesso-bg)]',
    fg: 'text-[var(--color-semantic-sucesso-fg)]',
  },
}

export type RuleTileProps = {
  tone: RuleTileTone
  kicker: string
  title: string
  description: ReactNode
  className?: string
}

/**
 * Tile semântico da seção «Regras» da Home (fluxo / ciclo).
 * Réplica da anatomia do molde FIPS Suprimentos: kicker uppercase,
 * título e descrição, fundo/borda/texto pelo token `--color-semantic-*`.
 */
export function RuleTile({ tone, kicker, title, description, className }: RuleTileProps) {
  const t = TONE[tone]
  return (
    <div className={cn('h-full min-w-0 rounded-2xl border px-4 py-4', t.border, t.bg, className)}>
      <p className={cn('text-[11px] font-semibold uppercase tracking-wide', t.fg)}>{kicker}</p>
      <p className="mt-2 text-base font-semibold text-[var(--color-fg)]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">{description}</p>
    </div>
  )
}

export type RuleTileGridProps = {
  children: ReactNode
  className?: string
}

/**
 * Grade da seção Regras: 1 col no phone · 2 no md · 4 no lg+.
 */
export function RuleTileGrid({ children, className }: RuleTileGridProps) {
  return (
    <div className={cn('grid items-stretch gap-3 md:grid-cols-2 lg:grid-cols-4', className)}>
      {children}
    </div>
  )
}
