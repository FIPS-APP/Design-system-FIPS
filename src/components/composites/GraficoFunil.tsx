import { cn } from '../../lib/cn'
import { corDoItem, formatarNumero, participacao, percentuaisDoMaior, type TomGrafico } from './grafico-logica'

export interface EtapaFunil {
  rotulo: string
  valor: number
  tom?: TomGrafico
  cor?: string
}

export interface GraficoFunilProps {
  /** Etapas na ordem do processo, da maior para a menor. A largura é proporcional à etapa de maior valor. */
  etapas: EtapaFunil[]
  /** Texto alternativo do gráfico inteiro: o que ele mede. */
  rotulo: string
  formatarValor?: (valor: number) => string
  /** Escreve, em cada etapa depois da primeira, quanto sobrou da etapa anterior. Padrão ligado. */
  mostrarConversao?: boolean
  /** Com isto cada etapa vira botão (`aria-pressed`) e o clique devolve `{ rotulo, indice, valor }`. */
  onSelecionarEtapa?: (etapa: SelecaoDeEtapa) => void
  /** Rótulo da etapa em destaque; as outras esmaecem. `null` ou ausente: nenhuma. */
  selecionada?: string | null
  /**
   * Escala fixa: o valor que ocupa a largura inteira (por exemplo 100). Sem ele a referência é a etapa de maior
   * valor. A participação escrita em cada etapa também passa a ser sobre este valor.
   */
  maximo?: number
  className?: string
}

/** O que `onSelecionarEtapa` recebe. */
export interface SelecaoDeEtapa {
  rotulo: string
  /** Posição da etapa em `etapas`. */
  indice: number
  valor: number
}

/**
 * Funil de etapas: uma barra centralizada por etapa, a largura proporcional ao valor. Rótulo, valor e
 * participação ficam escritos na linha (a cor só distingue). A conversão é a participação em relação à
 * etapa anterior.
 */
export function GraficoFunil({
  etapas,
  rotulo,
  formatarValor = formatarNumero,
  mostrarConversao = true,
  onSelecionarEtapa,
  selecionada = null,
  maximo,
  className,
}: GraficoFunilProps) {
  if (etapas.length === 0) return null
  const base = maximo != null && maximo > 0 ? maximo : Math.max(...etapas.map((e) => e.valor), 0)
  const larguras = percentuaisDoMaior(etapas.map((e) => e.valor), 4, base)
  return (
    <ol aria-label={rotulo} className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {etapas.map((e, i) => {
        const anterior = i > 0 ? etapas[i - 1].valor : null
        const corpo = (
          <>
            <div className="flex items-baseline justify-between gap-3 text-xs text-[var(--color-fg)]">
              <span className="min-w-0 truncate font-medium">{e.rotulo}</span>
              <span className="shrink-0 font-mono [font-variant-numeric:tabular-nums]">
                <strong className="font-semibold">{formatarValor(e.valor)}</strong>
                <span className="ml-2 text-[11px] text-[var(--color-fg-muted)]">{participacao(e.valor, base)}</span>
                {mostrarConversao && anterior != null && anterior > 0 ? (
                  <span className="ml-2 text-[11px] text-[var(--color-fg-muted)]">
                    ({participacao(e.valor, anterior)} da etapa anterior)
                  </span>
                ) : null}
              </span>
            </div>
            <div aria-hidden className="flex h-6 justify-center rounded-md bg-[var(--color-surface-muted)]">
              <span className="block h-full rounded-md" style={{ width: `${larguras[i]}%`, background: corDoItem(e, i) }} />
            </div>
          </>
        )
        const esmaecida = selecionada != null && selecionada !== e.rotulo
        return (
          <li key={e.rotulo}>
            {onSelecionarEtapa ? (
              <button
                type="button"
                aria-pressed={selecionada === e.rotulo}
                aria-label={`${e.rotulo}: ${formatarValor(e.valor)}, ${participacao(e.valor, base)}`}
                onClick={() => onSelecionarEtapa({ rotulo: e.rotulo, indice: i, valor: e.valor })}
                className={cn(
                  'grid min-h-11 w-full grid-cols-[minmax(0,1fr)] content-center gap-0.5 rounded-md px-1 text-left transition-opacity hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]',
                  selecionada === e.rotulo && 'bg-[var(--color-surface-muted)]',
                  esmaecida && 'opacity-40',
                )}
              >
                {corpo}
              </button>
            ) : (
              <div className="grid grid-cols-[minmax(0,1fr)] gap-0.5">{corpo}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
