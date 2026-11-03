import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Card, CardContent } from '../ui/card'
import { tagTitulo, tomIcone, type NivelTituloHome } from './home-padrao-variants'

export interface IndicadorNumerado {
  /** Único na lista. */
  id: string
  titulo: string
  texto: ReactNode
}

export interface IndicadoresNumeradosProps {
  indicadores: IndicadorNumerado[]
  /** Nome da lista para leitor de tela. */
  label?: string
  nivelTitulo?: NivelTituloHome
  className?: string
}

/** Lista numerada num cartão só: quadradinho com o número ("01"), título e texto. Para indicadores, critérios, regras. */
export function IndicadoresNumerados({ indicadores, label, nivelTitulo = 3, className }: IndicadoresNumeradosProps) {
  const Titulo = tagTitulo(nivelTitulo)
  return (
    <Card className={className}>
      <CardContent>
        <ol aria-label={label} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {indicadores.map((ind, i) => (
            <li key={ind.id} className="flex items-start gap-3">
              <span aria-hidden className={cn(tomIcone({ tamanho: 'sm' }), 'font-mono text-[12px] font-semibold')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <Titulo className="font-heading text-sm font-semibold tracking-tight text-[var(--color-fg)]">
                  {ind.titulo}
                </Titulo>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{ind.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
