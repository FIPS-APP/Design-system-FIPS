import { cn } from '../../lib/cn'
import {
  angulosDaRosca,
  caminhoDoArco,
  corDoItem,
  formatarNumero,
  participacao,
  type TomGrafico,
} from './grafico-logica'

export interface FatiaRosca {
  rotulo: string
  valor: number
  tom?: TomGrafico
  cor?: string
}

export interface GraficoRoscaProps {
  dados: FatiaRosca[]
  /** Texto alternativo do gráfico inteiro: o que ele mede. */
  rotulo: string
  /** Número no furo. Padrão: a soma das fatias. Passe outro quando o total da tela difere da soma (filtro). */
  totalNoFuro?: number | string
  /** Legenda pequena sob o número do furo. Padrão "Total". */
  legendaDoFuro?: string
  /** Como cada valor é escrito na legenda e no furo. Padrão: número em pt-BR. */
  formatarValor?: (valor: number) => string
  /** Fatia em destaque; as outras ficam esmaecidas. */
  selecionado?: string | null
  /** Com isto cada item da legenda e cada fatia viram botões. */
  onSelecionar?: (rotulo: string) => void
  /** Menor fatia desenhada, em graus. Padrão 5: valor pequeno não vira um vão no anel. */
  minimoGraus?: number
  /** Diâmetro do anel em px. Padrão 168. */
  tamanho?: number
  className?: string
}

const CENTRO = 100
const R_EXT = 94
const R_INT = 62

/**
 * Rosca com a legenda como rótulo: nome, valor e participação ficam escritos, nunca só no balão. O furo
 * leva o total. Fatias com 0,4% ainda ocupam `minimoGraus`, e há 2px de superfície entre elas. Dentro de
 * um `CartaoGrafico` ou outro contêiner, a legenda vai ao lado do anel a partir de 28rem e abaixo dele
 * quando estreito.
 */
export function GraficoRosca({
  dados,
  rotulo,
  totalNoFuro,
  legendaDoFuro = 'Total',
  formatarValor = formatarNumero,
  selecionado = null,
  onSelecionar,
  minimoGraus = 5,
  tamanho = 168,
  className,
}: GraficoRoscaProps) {
  const total = dados.reduce((s, d) => s + Math.max(0, d.valor), 0)
  const angulos = angulosDaRosca(
    dados.map((d) => d.valor),
    minimoGraus,
  )
  const noFuro = totalNoFuro ?? total
  const resumo =
    total === 0
      ? `${rotulo}: sem dados no recorte atual.`
      : `${rotulo}, total ${typeof noFuro === 'number' ? formatarValor(noFuro) : noFuro}: ` +
        dados.map((d) => `${d.rotulo} ${formatarValor(d.valor)} (${participacao(d.valor, total)})`).join(', ') +
        '.'
  const esmaecida = (r: string) => selecionado != null && selecionado !== r

  return (
    <div
      role="group"
      aria-label={resumo}
      className={cn('flex min-w-0 flex-col items-center gap-4 @min-[28rem]:flex-row @min-[28rem]:justify-center @min-[28rem]:gap-8', className)}
    >
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="shrink-0"
        style={{ width: tamanho, height: tamanho }}
      >
        {total === 0 ? (
          <circle cx={CENTRO} cy={CENTRO} r={(R_EXT + R_INT) / 2} fill="none" stroke="var(--color-surface-muted)" strokeWidth={R_EXT - R_INT} />
        ) : (
          angulos.map((a, i) => {
            const d = dados[a.indice]
            return (
              <path
                key={d.rotulo}
                d={caminhoDoArco(CENTRO, CENTRO, R_EXT, R_INT, a.inicio, a.fim)}
                fill={corDoItem(d, a.indice)}
                stroke="var(--color-surface)"
                strokeWidth={2}
                opacity={esmaecida(d.rotulo) ? 0.35 : 1}
                className={cn('transition-opacity', onSelecionar && 'cursor-pointer')}
                onClick={onSelecionar ? () => onSelecionar(d.rotulo) : undefined}
                data-fatia={i}
              >
                <title>{`${d.rotulo}: ${formatarValor(d.valor)} (${participacao(d.valor, total)})`}</title>
              </path>
            )
          })
        )}
        {total > 0 ? (
          <g textAnchor="middle" fill="var(--color-fg)">
            <text x={CENTRO} y={CENTRO + 4} fontSize={typeof noFuro === 'string' && noFuro.length > 6 ? 20 : 28} fontWeight={700} className="font-heading">
              {typeof noFuro === 'number' ? formatarValor(noFuro) : noFuro}
            </text>
            <text x={CENTRO} y={CENTRO + 22} fontSize={11} fill="var(--color-fg-muted)">
              {legendaDoFuro}
            </text>
          </g>
        ) : null}
      </svg>
      <ul className="flex w-full min-w-0 max-w-xs flex-col gap-1.5">
        {dados.map((d, i) => {
          const conteudo = (
            <>
              <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: corDoItem(d, i) }} />
              <span className="min-w-0 flex-1 truncate text-xs text-[var(--color-fg)]">{d.rotulo}</span>
              <span className="font-mono text-xs font-semibold text-[var(--color-fg)] [font-variant-numeric:tabular-nums]">
                {formatarValor(d.valor)}
              </span>
              <span className="w-12 text-right font-mono text-[11px] text-[var(--color-fg-muted)] [font-variant-numeric:tabular-nums]">
                {participacao(d.valor, total)}
              </span>
            </>
          )
          const comum = cn('flex w-full items-center gap-2 text-left transition-opacity', esmaecida(d.rotulo) && 'opacity-40')
          return (
            <li key={d.rotulo}>
              {onSelecionar ? (
                <button
                  type="button"
                  aria-pressed={selecionado === d.rotulo}
                  onClick={() => onSelecionar(d.rotulo)}
                  className={cn(
                    comum,
                    'min-h-11 rounded-md px-1.5 hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]',
                    selecionado === d.rotulo && 'bg-[var(--color-surface-muted)]',
                  )}
                >
                  {conteudo}
                </button>
              ) : (
                <div className={cn(comum, 'px-1.5 py-0.5')}>{conteudo}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
