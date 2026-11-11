import type { ReactNode } from 'react'
import { Hourglass } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from '../ui/card'
import type { TomGrafico } from './grafico-logica'

export interface LinhaClassificacao {
  id: string
  /** Nome da classe (por exemplo "Crítico"). Leva o ponto colorido do tom. */
  rotulo: string
  /** Definição da classe, em uma ou duas frases. */
  descricao: ReactNode
  /** Tom do ponto, da pílula e do fundo suave da linha: um tom de gráfico. */
  tom: TomGrafico
  /** Texto da pílula de prazo ("Ação em 15 dias"). */
  prazo: string
  /** Terceira coluna opcional ("Solução"), em cinza. */
  detalhe?: ReactNode
}

export interface TabelaClassificacaoProps {
  linhas: LinhaClassificacao[]
  /** Nome da tabela para leitor de tela. Padrão "Classificação". */
  titulo?: string
  /** Cabeçalhos das colunas. Padrões: Risco, Prazo, Detalhe, Definição. */
  cabecalhos?: { rotulo?: string; prazo?: string; detalhe?: string; descricao?: string }
  className?: string
}

/** Fundo suave da linha: 8% do tom sobre a superfície. O texto continua em `--color-fg` (9:1 ou mais). */
function fundoDaLinha(tom: TomGrafico): string {
  return `color-mix(in srgb, var(--grafico-${tom}) 8%, var(--color-surface))`
}

function Rotulo({ tom, children }: { tom: TomGrafico; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[var(--color-fg)]">
      <span aria-hidden className="size-2 rounded-full" style={{ background: `var(--grafico-${tom})` }} />
      {children}
    </span>
  )
}

function Prazo({ tom, children }: { tom: TomGrafico; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-fg)]"
      style={{ borderColor: `color-mix(in srgb, var(--grafico-${tom}) 55%, transparent)` }}
    >
      <Hourglass className="size-3" aria-hidden />
      {children}
    </span>
  )
}

/**
 * Tabela de classificação (por exemplo, criticidade): uma classe por linha, com ponto colorido, pílula de
 * prazo e definição. Tom e texto vão juntos: a cor nunca é a única informação. No telefone (abaixo de 640px)
 * cada linha vira um bloco com rótulo, prazo, definição e detalhe empilhados.
 */
export function TabelaClassificacao({ linhas, titulo = 'Classificação', cabecalhos, className }: TabelaClassificacaoProps) {
  const temDetalhe = linhas.some((l) => l.detalhe !== undefined)
  const cab = { rotulo: 'Risco', prazo: 'Prazo', detalhe: 'Detalhe', descricao: 'Definição', ...cabecalhos }
  const colunas = [cab.rotulo, cab.prazo, ...(temDetalhe ? [cab.detalhe] : []), cab.descricao]
  return (
    <Card className={cn('overflow-hidden', className)}>
      <ul className="flex flex-col divide-y divide-[var(--color-border)] sm:hidden" aria-label={titulo}>
        {linhas.map((l) => (
          <li key={l.id} className="flex flex-col gap-2 px-5 py-3.5" style={{ background: fundoDaLinha(l.tom) }}>
            <div className="flex flex-wrap items-center gap-2">
              <Rotulo tom={l.tom}>{l.rotulo}</Rotulo>
              <Prazo tom={l.tom}>{l.prazo}</Prazo>
            </div>
            <p className="text-sm text-[var(--color-fg)]">{l.descricao}</p>
            {l.detalhe !== undefined ? <p className="text-xs text-[var(--color-fg-muted-strong)]">{l.detalhe}</p> : null}
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="bg-[var(--color-surface-muted)]">
              {colunas.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-[var(--color-border)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-fg)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.id} className="border-b border-[var(--color-border)] last:border-b-0" style={{ background: fundoDaLinha(l.tom) }}>
                <th scope="row" className="whitespace-nowrap px-5 py-3.5 text-left font-normal">
                  <Rotulo tom={l.tom}>{l.rotulo}</Rotulo>
                </th>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <Prazo tom={l.tom}>{l.prazo}</Prazo>
                </td>
                {temDetalhe ? <td className="px-5 py-3.5 text-[var(--color-fg-muted-strong)]">{l.detalhe}</td> : null}
                <td className="px-5 py-3.5 text-[var(--color-fg)]">{l.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
