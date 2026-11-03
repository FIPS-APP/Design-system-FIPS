import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { tagTitulo, type NivelTituloHome } from './home-padrao-variants'

export interface PilarFaixa {
  /** Único na faixa. */
  id: string
  /** Letra ou marca curta que acompanha o rótulo ("O", "P", "A" vira "PILAR O"). */
  marca: string
  titulo: string
  texto: ReactNode
  icone: LucideIcon
}

export interface FaixaPilaresProps {
  pilares: PilarFaixa[]
  /** Palavra antes da marca em cada cartão. Padrão: "Pilar". */
  rotulo?: string
  /** Nome da faixa para leitor de tela. */
  label?: string
  /** Sobe a faixa sobre o pé do `HomeHero`. Padrão: sim. */
  sobreposta?: boolean
  /** Nível dos títulos dos cartões. Padrão: `2` (logo abaixo do `h1` do hero). */
  nivelTitulo?: NivelTituloHome
  className?: string
}

const COLUNAS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Faixa de pilares logo abaixo do hero: um cartão por pilar, com a marca em caixa alta ("PILAR O"),
 * o ícone em disco azul, o título e o texto. Sem painel em volta: os cartões já são o painel.
 */
export function FaixaPilares({
  pilares,
  rotulo = 'Pilar',
  label = 'Pilares',
  sobreposta = true,
  nivelTitulo = 2,
  className,
}: FaixaPilaresProps) {
  if (pilares.length === 0) return null
  const Titulo = tagTitulo(nivelTitulo)
  return (
    <section
      aria-label={label}
      className={cn('relative z-10 mx-auto max-w-7xl px-4 sm:px-6', sobreposta && '-mt-4 sm:-mt-2', className)}
    >
      <ul className={cn('grid grid-cols-1 gap-3', COLUNAS[Math.min(pilares.length, 4)] ?? COLUNAS[4])}>
        {pilares.map((p) => {
          const Icone = p.icone
          return (
            <li
              key={p.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5"
            >
              <span
                aria-hidden
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-text)]"
              >
                {rotulo} {p.marca}
              </span>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]"
                >
                  <Icone className="h-5 w-5" />
                </span>
                <Titulo className="font-heading text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                  {p.titulo}
                </Titulo>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{p.texto}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
