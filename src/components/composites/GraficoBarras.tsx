import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { corDoItem, expansaoDoSegmento, formatarNumero, tamanhoEmPercentual, type TomGrafico } from './grafico-logica'

export interface DadoBarra {
  /** Nome da categoria: vira o rótulo da barra e a chave de seleção. */
  rotulo: string
  /** Valor da barra, quando o gráfico tem uma série só. */
  valor?: number
  /** Um valor por série, na ordem de `series`. Vale no lugar de `valor`. */
  valores?: number[]
  /** Tom da barra (série única). Sem tom, a categoria recebe a cor da sequência pela posição. */
  tom?: TomGrafico
  /** Cor CSS direta (por exemplo `var(--color-success)`). Vence `tom`. */
  cor?: string
}

export interface SerieBarra {
  nome: string
  tom?: TomGrafico
  cor?: string
}

/** O que `onSelecionarBarra` recebe: a categoria, a série (só com várias séries), a posição da série e o valor da barra. */
export interface SelecaoDeBarra {
  categoria: string
  /** Nome da série. Ausente quando o gráfico tem uma série só. */
  serie?: string
  /** Posição da série em `series` (0 com uma série só). */
  indiceSerie: number
  valor: number
}

export interface GraficoBarrasProps {
  dados: DadoBarra[]
  /** Séries quando cada dado tem `valores`. Aparecem na legenda sob o gráfico. */
  series?: SerieBarra[]
  /** Com várias séries: lado a lado (`agrupado`) ou somadas numa barra só (`empilhado`). Padrão `agrupado`. */
  modo?: 'agrupado' | 'empilhado'
  /** `horizontal`: uma linha por categoria (ranking). `vertical`: colunas (série no tempo). Padrão `horizontal`. */
  orientacao?: 'horizontal' | 'vertical'
  /** Texto alternativo do gráfico inteiro: o que ele mede. */
  rotulo: string
  /** Número escrito junto de cada barra. Padrão ligado: cor sozinha nunca carrega o valor. */
  mostrarValores?: boolean
  formatarValor?: (valor: number) => string
  /** Categoria em destaque; as outras ficam esmaecidas. `null` ou ausente: nenhuma. */
  selecionado?: string | null
  /** Com isto cada categoria vira botão (`aria-pressed`) e o clique devolve o rótulo. */
  onSelecionar?: (rotulo: string) => void
  /**
   * Drill-down por série: com isto cada BARRA (cada série de cada categoria) vira botão e o clique devolve
   * `{ categoria, serie, indiceSerie, valor }`. A categoria deixa de ser um botão só (não há botão dentro de
   * botão); se `onSelecionar` também vier, ele é chamado junto com o rótulo da categoria, então quem já
   * filtra por categoria continua funcionando. Alvo de clique de 24px de altura (horizontal) ou largura da
   * barra mais 6px de cada lado (vertical).
   */
  onSelecionarBarra?: (selecao: SelecaoDeBarra) => void
  /** Série em destaque junto de `selecionado`, no modo `onSelecionarBarra`: só essa barra fica marcada, as outras esmaecem. */
  serieSelecionada?: string | null
  /**
   * Escala fixa: o valor que ocupa a barra inteira (por exemplo 100 para uma nota de 0 a 100). Sem ele a
   * escala é o maior valor do gráfico. Valor acima do máximo enche a barra e continua escrito por inteiro.
   */
  maximo?: number
  /** Altura da área das colunas na orientação vertical, em px. Padrão 192. */
  alturaColunas?: number
  /** Largura da coluna de rótulos na orientação horizontal (CSS). Padrão `8rem`. */
  larguraRotulo?: string
  className?: string
}

function valoresDe(d: DadoBarra, qtdSeries: number): number[] {
  if (d.valores) return d.valores
  return qtdSeries > 1 ? [] : [d.valor ?? 0]
}

/** Uma categoria: botão quando há `onSelecionar`, bloco simples quando não. */
function ItemDeBarra({
  descricao,
  esmaecido,
  marcado,
  onSelecionar,
  children,
}: {
  descricao: string
  esmaecido: boolean
  marcado: boolean
  onSelecionar?: () => void
  children: ReactNode
}) {
  const comum = cn('block h-full w-full text-left transition-opacity', esmaecido && 'opacity-40')
  if (!onSelecionar) {
    return (
      <div className={comum} title={descricao}>
        {children}
      </div>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={marcado}
      aria-label={descricao}
      title={descricao}
      onClick={onSelecionar}
      className={cn(
        comum,
        'min-h-11 rounded-md px-1 hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]',
        marcado && 'bg-[var(--color-surface-muted)]',
      )}
    >
      {children}
    </button>
  )
}

/** Uma barra (ou um trecho dela): botão no modo `onSelecionarBarra`, `span` fora dele. */
function Segmento({
  aoSelecionar,
  descricao,
  marcada,
  esmaecida,
  expandir,
  className,
  style,
  children,
}: {
  aoSelecionar?: () => void
  descricao: string
  marcada: boolean
  esmaecida: boolean
  /** Classes do alvo de clique ampliado (`after:`), para barra fina ter 24px. */
  expandir: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  if (!aoSelecionar) {
    return (
      <span className={className} style={style} title={descricao}>
        {children}
      </span>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={marcada}
      aria-label={descricao}
      title={descricao}
      onClick={aoSelecionar}
      style={style}
      className={cn(
        className,
        // `relative` ancora o alvo ampliado (`after:`); barra que já é `absolute` já serve de âncora.
        !className?.includes('absolute') && 'relative',
        'cursor-pointer transition-opacity after:absolute focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]',
        expandir,
        marcada && 'outline-2 outline-offset-1 outline-[var(--color-primary-text)]',
        esmaecida && 'opacity-40',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Barras horizontais (ranking) ou verticais (série no tempo), em HTML com tokens: sem biblioteca de
 * gráfico. O valor sempre aparece escrito; a cor distingue, não informa. Várias séries, agrupadas ou
 * empilhadas. Com `onSelecionar` cada categoria é um botão e o gráfico esmaece as outras.
 */
export function GraficoBarras({
  dados,
  series,
  modo = 'agrupado',
  orientacao = 'horizontal',
  rotulo,
  mostrarValores = true,
  formatarValor = formatarNumero,
  selecionado = null,
  onSelecionar,
  onSelecionarBarra,
  serieSelecionada = null,
  maximo,
  alturaColunas = 192,
  larguraRotulo = '8rem',
  className,
}: GraficoBarrasProps) {
  if (dados.length === 0) return null
  const qtd = series?.length ?? 1
  const empilhado = modo === 'empilhado' && qtd > 1
  const linhas = dados.map((d, indice) => ({ d, indice, v: valoresDe(d, qtd) }))
  const soma = (v: number[]) => v.reduce((s, n) => s + Math.max(0, n), 0)
  const maior = maximo != null && maximo > 0 ? maximo : Math.max(0, ...linhas.map(({ v }) => (empilhado ? soma(v) : Math.max(0, ...v))))
  /** Tamanho da barra, em % do maior (ou do `maximo`). Valor positivo nunca some: piso de 1,5%. */
  const tamanho = (n: number) => tamanhoEmPercentual(n, maior, empilhado ? 0 : 1.5)
  const porBarra = !!onSelecionarBarra
  const corDe = (d: DadoBarra, indice: number, serie: number): string =>
    series ? corDoItem(series[serie] ?? {}, serie) : corDoItem(d, d.tom || d.cor ? 0 : indice)
  const nomeDe = (d: DadoBarra, serie: number) => `${d.rotulo}${series?.[serie] ? ` · ${series[serie].nome}` : ''}`
  const textoValor = (v: number[]) => (empilhado ? formatarValor(soma(v)) : v.map((n) => formatarValor(n)).join(' / '))
  const descricaoDe = (d: DadoBarra, v: number[]) =>
    `${d.rotulo}: ${series ? v.map((n, i) => `${series[i]?.nome ?? ''} ${formatarValor(n)}`).join(', ') : formatarValor(v[0] ?? 0)}`
  const itemProps = (d: DadoBarra, v: number[]) => ({
    descricao: descricaoDe(d, v),
    esmaecido: selecionado != null && selecionado !== d.rotulo,
    marcado: selecionado === d.rotulo,
    onSelecionar: onSelecionar && !porBarra ? () => onSelecionar(d.rotulo) : undefined,
  })
  /** Props de uma barra (série `i` da categoria `d`): botão só no modo `onSelecionarBarra`. */
  const barraProps = (d: DadoBarra, i: number, n: number, expandir: string) => {
    const nomeSerie = series?.[i]?.nome
    const daCategoria = selecionado === d.rotulo
    return {
      descricao: `${nomeDe(d, i)}: ${formatarValor(n)}`,
      expandir,
      marcada: daCategoria && (serieSelecionada != null ? nomeSerie === serieSelecionada : qtd === 1),
      esmaecida: daCategoria && serieSelecionada != null && nomeSerie !== serieSelecionada,
      aoSelecionar: porBarra
        ? () => {
            onSelecionarBarra!({ categoria: d.rotulo, serie: nomeSerie, indiceSerie: i, valor: n })
            onSelecionar?.(d.rotulo)
          }
        : undefined,
    }
  }

  const legenda =
    series && series.length > 1 ? (
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--color-fg)]">
        {series.map((s, i) => (
          <li key={s.nome} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: corDoItem(s, i) }} />
            {s.nome}
          </li>
        ))}
      </ul>
    ) : null

  if (orientacao === 'vertical') {
    const areaBarras = alturaColunas - 18
    const agrupadoVarias = !empilhado && qtd > 1
    return (
      <div role="group" aria-label={rotulo} className={cn('min-w-0', className)}>
        <ul className="flex items-end gap-1.5 @min-[28rem]:gap-2.5" style={{ height: alturaColunas + 44 }}>
          {linhas.map(({ d, indice, v }) => (
            <li key={d.rotulo} className="h-full min-w-0 flex-1">
              <ItemDeBarra {...itemProps(d, v)}>
                <span className="flex h-full flex-col items-center justify-end gap-1">
                  <span
                    aria-hidden={porBarra ? undefined : true}
                    className="relative flex w-full items-end"
                    style={{ height: areaBarras, maxWidth: agrupadoVarias ? `${qtd * 1.75}rem` : '2.25rem' }}
                  >
                    {agrupadoVarias ? (
                      <span className="flex h-full w-full items-end gap-px">
                        {v.map((n, i) => (
                          <span key={i} className="relative block h-full min-w-0 flex-1">
                            <Segmento
                              {...barraProps(d, i, n, expansaoDoSegmento('grupo-vertical', i, v.length))}
                              className="absolute inset-x-0 bottom-0 block rounded-t-[4px]"
                              style={{ background: corDe(d, indice, i), height: `${tamanho(n)}%` }}
                            />
                            {mostrarValores ? (
                              <span
                                className="pointer-events-none absolute left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold leading-none text-[var(--color-fg)] [font-variant-numeric:tabular-nums]"
                                style={{ bottom: `${tamanho(n)}%` }}
                              >
                                {formatarValor(n)}
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="relative flex w-full flex-col-reverse" style={{ height: `${tamanho(empilhado ? soma(v) : (v[0] ?? 0))}%` }}>
                        {mostrarValores ? (
                          <span className="pointer-events-none absolute inset-x-[-1rem] bottom-full mb-1 text-center font-mono text-[10px] font-semibold leading-none text-[var(--color-fg)] [font-variant-numeric:tabular-nums]">
                            {textoValor(v)}
                          </span>
                        ) : null}
                        {v.map((n, i) => (
                          <Segmento
                            key={i}
                            {...barraProps(d, i, n, expansaoDoSegmento(empilhado ? 'pilha-vertical' : 'grupo-vertical', i, v.length))}
                            className={cn('block w-full', !empilhado && 'rounded-t-[4px]')}
                            style={{
                              background: corDe(d, indice, i),
                              height: `${empilhado ? (soma(v) > 0 ? (Math.max(0, n) / soma(v)) * 100 : 0) : 100}%`,
                            }}
                          />
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-2 min-h-[2.2em] w-full break-normal text-center text-[10px] leading-tight text-[var(--color-fg-muted)]">
                    {d.rotulo}
                  </span>
                </span>
              </ItemDeBarra>
            </li>
          ))}
        </ul>
        {legenda}
      </div>
    )
  }

  const colunas = `${larguraRotulo} minmax(0,1fr)${mostrarValores ? ' auto' : ''}`
  return (
    <div role="group" aria-label={rotulo} className={cn('min-w-0', className)}>
      <ul className="flex flex-col gap-1">
        {linhas.map(({ d, indice, v }) => {
          const agrupadoVarias = !empilhado && qtd > 1
          return (
            <li key={d.rotulo}>
              <ItemDeBarra {...itemProps(d, v)}>
                {agrupadoVarias ? (
                  // Agrupado: uma linha por série, cada barra com o seu valor escrito ao lado.
                  <span className="grid items-center gap-x-2 gap-y-0.5" style={{ gridTemplateColumns: colunas }}>
                    <span className="truncate text-xs text-[var(--color-fg)]" style={{ gridRow: `span ${qtd}` }}>
                      {d.rotulo}
                    </span>
                    {v.map((n, i) => (
                      <Fragment key={i}>
                        <Segmento
                          {...barraProps(d, i, n, expansaoDoSegmento('horizontal', i, v.length))}
                          className="relative block h-3 w-full rounded-[3px] bg-[var(--color-surface-muted)]"
                        >
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 block rounded-[3px]"
                            style={{ background: corDe(d, indice, i), width: `${tamanho(n)}%` }}
                          />
                        </Segmento>
                        {mostrarValores ? (
                          <span className="min-w-8 text-right font-mono text-[11px] font-semibold leading-3 text-[var(--color-fg)] [font-variant-numeric:tabular-nums]">
                            {formatarValor(n)}
                          </span>
                        ) : null}
                      </Fragment>
                    ))}
                  </span>
                ) : (
                  <span className="grid items-center gap-2" style={{ gridTemplateColumns: colunas }}>
                    <span className="truncate text-xs text-[var(--color-fg)]">{d.rotulo}</span>
                    <span
                      aria-hidden={porBarra ? undefined : true}
                      className={cn('relative flex overflow-hidden rounded-md bg-[var(--color-surface-muted)]', porBarra ? 'h-6' : 'h-5')}
                    >
                      {v.map((n, i) => (
                        <Segmento
                          key={i}
                          {...barraProps(d, i, n, expansaoDoSegmento('horizontal', i, v.length))}
                          className="block h-full"
                          style={{ background: corDe(d, indice, i), width: `${tamanho(n)}%` }}
                        />
                      ))}
                    </span>
                    {mostrarValores ? (
                      <span className="min-w-8 text-right font-mono text-xs font-semibold text-[var(--color-fg)] [font-variant-numeric:tabular-nums]">
                        {textoValor(v)}
                      </span>
                    ) : null}
                  </span>
                )}
              </ItemDeBarra>
            </li>
          )
        })}
      </ul>
      {legenda}
    </div>
  )
}
