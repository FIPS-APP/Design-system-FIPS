import type { ReactNode } from 'react'
import { CheckCircle2, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from '../ui/card'

export interface TabelaReferenciaColuna {
  /** Único na tabela. É a chave de `valores` nas linhas. */
  id: string
  rotulo: string
}

export interface TabelaReferenciaLinha {
  id: string
  rotulo: string
  /** Linha pequena em caixa alta sob o rótulo (ex.: "§5.1.2"). */
  referencia?: string
  /** `true` marca com o círculo verde, `false` com o traço cinza; qualquer outro valor aparece como texto. */
  valores: Record<string, boolean | ReactNode>
}

export interface TabelaReferenciaProps {
  /** Linha cinza em caixa alta no cabeçalho (ex.: "Referência operacional"). */
  sobretitulo?: string
  titulo: string
  subtitulo?: ReactNode
  /** Pílula à direita do cabeçalho (`Badge`). */
  selo?: ReactNode
  /** Título da primeira coluna. Padrão: "Campo". */
  rotuloLinha?: string
  colunas: TabelaReferenciaColuna[]
  linhas: TabelaReferenciaLinha[]
  /** Texto de leitor de tela para `true`. Padrão: "Sim". */
  textoSim?: string
  /** Texto de leitor de tela para `false`. Padrão: "Não". */
  textoNao?: string
  className?: string
}

function Marca({ valor, textoSim, textoNao }: { valor: boolean | ReactNode; textoSim: string; textoNao: string }) {
  if (valor === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/14 text-[var(--color-success-text)]">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">{textoSim}</span>
      </span>
    )
  }
  if (valor === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-fg-muted)]">
        <Minus className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">{textoNao}</span>
      </span>
    )
  }
  return <span className="text-xs font-semibold text-[var(--color-fg)]">{valor}</span>
}

/**
 * Tabela de referência operacional: matriz de linhas por colunas com marcas de sim/não. No telefone (abaixo
 * de 640px) a matriz não cabe, então cada linha vira um bloco com as marcas embaixo do nome.
 */
export function TabelaReferencia({
  sobretitulo,
  titulo,
  subtitulo,
  selo,
  rotuloLinha = 'Campo',
  colunas,
  linhas,
  textoSim = 'Sim',
  textoNao = 'Não',
  className,
}: TabelaReferenciaProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <header className="flex flex-col gap-1 border-b border-[var(--color-border)] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            {sobretitulo ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
                {sobretitulo}
              </p>
            ) : null}
            <h3 className="font-heading text-base font-semibold tracking-tight text-[var(--color-fg)]">{titulo}</h3>
          </div>
          {selo ? <div className="shrink-0">{selo}</div> : null}
        </div>
        {subtitulo ? <p className="text-sm text-[var(--color-fg-muted)]">{subtitulo}</p> : null}
      </header>

      <ul className="flex flex-col divide-y divide-[var(--color-border)] sm:hidden">
        {linhas.map((l) => (
          <li key={l.id} className="flex flex-col gap-2 px-5 py-3">
            <div>
              <p className="font-medium text-[var(--color-fg)]">{l.rotulo}</p>
              {l.referencia ? (
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">
                  {l.referencia}
                </p>
              ) : null}
            </div>
            <dl className="flex flex-wrap gap-x-4 gap-y-1.5">
              {colunas.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <dt className="text-[11px] text-[var(--color-fg-muted)]">{c.rotulo}</dt>
                  <dd>
                    <Marca valor={l.valores[c.id]} textoSim={textoSim} textoNao={textoNao} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="bg-[var(--color-surface-muted)]">
              <th
                scope="col"
                className="border-b border-[var(--color-border)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-fg)]"
              >
                {rotuloLinha}
              </th>
              {colunas.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className="border-b border-[var(--color-border)] px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-fg)]"
                >
                  {c.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.id} className="border-b border-[var(--color-border)] last:border-b-0">
                <th scope="row" className="px-5 py-3 text-left font-normal">
                  <p className="font-medium text-[var(--color-fg)]">{l.rotulo}</p>
                  {l.referencia ? (
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">
                      {l.referencia}
                    </p>
                  ) : null}
                </th>
                {colunas.map((c) => (
                  <td key={c.id} className="px-5 py-3 text-center">
                    <Marca valor={l.valores[c.id]} textoSim={textoSim} textoNao={textoNao} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
