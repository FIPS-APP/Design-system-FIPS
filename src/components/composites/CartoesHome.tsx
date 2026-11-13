import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import {
  tagTitulo,
  tomBordaEsquerda,
  tomFilete,
  tomIcone,
  tomIconeSolto,
  type NivelTituloHome,
  type TomHome,
} from './home-padrao-variants'

type Colunas = 2 | 3 | 4

const GRADE: Record<Colunas, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
}

// ─── Cartões informativos (Objetivo, Aplicação) ───

export interface CartaoInformativo {
  /** Único na lista. */
  id: string
  icone: LucideIcon
  titulo: string
  texto: ReactNode
  /** Pílulas sob o texto (ex.: "Próprios", "Terceiros"). */
  marcas?: string[]
}

export interface CartoesInformativosProps {
  cartoes: CartaoInformativo[]
  /** Colunas a partir de 768px. Padrão: 2. */
  colunas?: Colunas
  nivelTitulo?: NivelTituloHome
  className?: string
}

/** Cartões largos: ícone em quadradinho azul ao lado do título e, embaixo, o texto e as pílulas. Para "Objetivo" e "Aplicação". */
export function CartoesInformativos({ cartoes, colunas = 2, nivelTitulo = 3, className }: CartoesInformativosProps) {
  const Titulo = tagTitulo(nivelTitulo)
  return (
    <ul className={cn('grid grid-cols-1 gap-3', GRADE[colunas], className)}>
      {cartoes.map((c) => {
        const Icone = c.icone
        return (
          <li key={c.id}>
            <Card className="h-full">
              <CardContent>
                <div className="flex items-center gap-4">
                  <span aria-hidden className={tomIcone({ tamanho: 'lg' })}>
                    <Icone className="h-5 w-5" />
                  </span>
                  <Titulo className="min-w-0 font-heading text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {c.titulo}
                  </Titulo>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg)]">{c.texto}</p>
                {c.marcas && c.marcas.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Aplica-se a">
                    {c.marcas.map((m) => (
                      <li key={m}>
                        <Badge variant="info">{m}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Cartões de conceito (termos e definições) ───

export interface CartaoConceito {
  id: string
  icone: LucideIcon
  titulo: string
  texto: ReactNode
  /** Cor do filete de topo e do ícone. Padrão: `primary`. */
  tom?: TomHome
}

export interface CartoesConceitoProps {
  conceitos: CartaoConceito[]
  colunas?: Colunas
  nivelTitulo?: NivelTituloHome
  className?: string
}

/**
 * Cartões de conceito (termos e definições), no cartão da Gestão OPA: filete no topo na cor do tom, canto
 * inferior esquerdo mais redondo, ícone em disco ao lado do título e a definição embaixo, alinhada à esquerda.
 */
export function CartoesConceito({ conceitos, colunas = 3, nivelTitulo = 3, className }: CartoesConceitoProps) {
  const Titulo = tagTitulo(nivelTitulo)
  return (
    <ul className={cn('grid grid-cols-1 gap-3', GRADE[colunas], className)}>
      {conceitos.map((c) => {
        const Icone = c.icone
        return (
          <li
            key={c.id}
            className="overflow-hidden rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]"
          >
            <div aria-hidden className={tomFilete({ tom: c.tom })} />
            <div className="px-4 pb-4 pt-3.5">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--color-border)] bg-[var(--color-surface-muted)]"
                >
                  <Icone className={cn('h-[18px] w-[18px]', tomIconeSolto({ tom: c.tom }))} />
                </span>
                <Titulo className="font-heading text-[13px] font-bold tracking-[0.02em] text-[var(--color-fg)]">
                  {c.titulo}
                </Titulo>
              </div>
              <p className="mt-2 text-[11px] leading-[1.5] text-[var(--color-fg-muted)]">{c.texto}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Cartões de responsabilidade (e de perfil) ───

export interface CartaoResponsabilidade {
  id: string
  icone: LucideIcon
  titulo: string
  /** Linha pequena sob o título (ex.: a descrição curta de um perfil). */
  subtitulo?: string
  texto?: ReactNode
  /** Pares rótulo e texto em lista de definição (ex.: "Vê" e "Edita"). */
  detalhes?: { rotulo: string; texto: ReactNode }[]
  /** Cor da borda esquerda e do ícone. Padrão: `primary`. */
  tom?: TomHome
}

export interface CartoesResponsabilidadeProps {
  cartoes: CartaoResponsabilidade[]
  colunas?: Colunas
  nivelTitulo?: NivelTituloHome
  className?: string
}

/**
 * Cartões com borda esquerda grossa na cor do tom, ícone e título lado a lado, e o texto embaixo. Com
 * `detalhes`, vira cartão de perfil (quem vê, quem edita). Serve também para decisões com tom
 * (`success` e `danger`, "procedente" e "improcedente").
 */
export function CartoesResponsabilidade({
  cartoes,
  colunas = 3,
  nivelTitulo = 3,
  className,
}: CartoesResponsabilidadeProps) {
  const Titulo = tagTitulo(nivelTitulo)
  return (
    <ul className={cn('grid grid-cols-1 gap-3', GRADE[colunas], className)}>
      {cartoes.map((c) => {
        const Icone = c.icone
        return (
          <li key={c.id}>
            <Card className={cn('h-full', tomBordaEsquerda({ tom: c.tom }))}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span aria-hidden className={tomIcone({ tom: c.tom })}>
                    <Icone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <Titulo className="font-heading text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {c.titulo}
                    </Titulo>
                    {c.subtitulo ? (
                      <p className="text-[11px] leading-tight text-[var(--color-fg-muted)]">{c.subtitulo}</p>
                    ) : null}
                  </div>
                </div>
                {c.texto ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{c.texto}</p>
                ) : null}
                {c.detalhes && c.detalhes.length > 0 ? (
                  <dl className="mt-3 flex flex-col gap-2 text-sm">
                    {c.detalhes.map((d) => (
                      <div key={d.rotulo}>
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                          {d.rotulo}
                        </dt>
                        <dd className="mt-0.5 leading-relaxed text-[var(--color-fg-muted)]">{d.texto}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
