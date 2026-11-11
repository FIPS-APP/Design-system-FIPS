import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { corDoItem, escalaLinear, formatarNumero, indicesDosRotulos, passoDosRotulos, type TomGrafico } from './grafico-logica'

export interface SerieLinha {
  nome: string
  /** Um valor por categoria. `null` deixa a linha interrompida naquele ponto. */
  valores: (number | null)[]
  tom?: TomGrafico
  cor?: string
  /** Linha tracejada, para a série de referência (meta, período anterior). */
  tracejada?: boolean
  /** Preenche a área entre a linha e o eixo. */
  area?: boolean
}

export interface GraficoLinhaProps {
  /** Rótulos do eixo horizontal, na ordem dos valores. */
  categorias: string[]
  series: SerieLinha[]
  /** Texto alternativo do gráfico inteiro: o que ele mede. */
  rotulo: string
  /** Altura do desenho em px. Padrão 220. */
  altura?: number
  /** Onde escrever o valor: nas pontas (primeiro e último ponto), em todos ou em nenhum. Padrão `pontas`. */
  rotulosDeValor?: 'pontas' | 'todos' | 'nenhum'
  formatarValor?: (valor: number) => string
  /**
   * Com isto cada ponto vira botão (`aria-pressed`, Enter e espaço) e o clique devolve
   * `{ categoria, serie, indiceSerie, indice, valor }`. Alvo de 24px de diâmetro por ponto.
   */
  onSelecionarPonto?: (ponto: SelecaoDePonto) => void
  /** Ponto em destaque (série e categoria): ganha um anel. `null` ou ausente: nenhum. */
  pontoSelecionado?: { serie: string; categoria: string } | null
  /**
   * Escala fixa: topo do eixo vertical (por exemplo 100 para uma nota de 0 a 100); o eixo sobe até o valor
   * redondo que o contém. Sem ele o topo acompanha o maior valor. Valor acima do topo é desenhado no topo e
   * continua escrito por inteiro.
   */
  maximo?: number
  className?: string
}

/** O que `onSelecionarPonto` recebe. */
export interface SelecaoDePonto {
  categoria: string
  serie: string
  /** Posição da série em `series`. */
  indiceSerie: number
  /** Posição da categoria em `categorias`. */
  indice: number
  valor: number
}

const MARGEM = { esq: 38, dir: 14, topo: 18, base: 26 }

/** Largura do elemento, acompanhando o redimensionamento. Antes da medida (e no servidor) vale `inicial`. */
function useLargura(inicial: number) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [largura, setLargura] = useState(inicial)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => setLargura(Math.max(1, Math.round(el.getBoundingClientRect().width)))
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const obs = new ResizeObserver(medir)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, largura] as const
}

/**
 * Linhas (e áreas) sobre categorias, em SVG com tokens. Sem curva suave: contagem por período é um valor
 * por período, a curva inventaria valores entre os pontos. Marca a ponta de cada série com o valor escrito.
 * O desenho acompanha a largura do contêiner e os rótulos do eixo rareiam quando não cabem.
 */
export function GraficoLinha({
  categorias,
  series,
  rotulo,
  altura = 220,
  rotulosDeValor = 'pontas',
  formatarValor = formatarNumero,
  onSelecionarPonto,
  pontoSelecionado = null,
  maximo,
  className,
}: GraficoLinhaProps) {
  const [ref, largura] = useLargura(560)
  if (categorias.length === 0 || series.length === 0) return null
  const w = Math.max(240, largura)
  const interna = w - MARGEM.esq - MARGEM.dir
  const alturaInterna = altura - MARGEM.topo - MARGEM.base
  const todos = series.flatMap((s) => s.valores.filter((v): v is number => v != null))
  const { teto, ticks } = escalaLinear(maximo != null && maximo > 0 ? maximo : Math.max(0, ...todos), 4)
  const x = (i: number) => MARGEM.esq + (categorias.length === 1 ? interna / 2 : (i * interna) / (categorias.length - 1))
  const y = (v: number) => MARGEM.topo + (1 - Math.min(v, teto) / teto) * alturaInterna
  const rotulosVisiveis = new Set(indicesDosRotulos(categorias.length, passoDosRotulos(categorias.length, interna, 46)))

  const trechos = (s: SerieLinha): string[] => {
    const partes: string[] = []
    let atual = ''
    s.valores.forEach((v, i) => {
      if (v == null) {
        if (atual) partes.push(atual)
        atual = ''
      } else atual += `${atual ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `
    })
    if (atual) partes.push(atual)
    return partes
  }

  const resumo =
    `${rotulo}. ` +
    series
      .map((s) => {
        const validos = s.valores.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v != null)
        if (validos.length === 0) return `${s.nome}: sem dados.`
        const primeiro = validos[0]
        const ultimo = validos[validos.length - 1]
        const maior = validos.reduce((m, p) => (p.v > m.v ? p : m), validos[0])
        return `${s.nome}: de ${formatarValor(primeiro.v)} em ${categorias[primeiro.i]} a ${formatarValor(ultimo.v)} em ${categorias[ultimo.i]}, pico de ${formatarValor(maior.v)} em ${categorias[maior.i]}.`
      })
      .join(' ')

  return (
    <div className={cn('min-w-0', className)}>
      {series.length > 1 ? (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--color-fg)]">
          {series.map((s, i) => (
            <li key={s.nome} className="inline-flex items-center gap-1.5">
              <svg width="18" height="8" aria-hidden>
                <line x1="0" y1="4" x2="18" y2="4" stroke={corDoItem(s, i)} strokeWidth={s.tracejada ? 1.5 : 2.5} strokeDasharray={s.tracejada ? '4 3' : undefined} strokeLinecap="round" />
              </svg>
              {s.nome}
            </li>
          ))}
        </ul>
      ) : null}
      <div ref={ref} className="w-full">
        <svg viewBox={`0 0 ${w} ${altura}`} width={w} height={altura} role="img" aria-label={resumo} className="block max-w-full">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={MARGEM.esq} x2={MARGEM.esq + interna} y1={y(t)} y2={y(t)} stroke="var(--color-border)" strokeDasharray={t === 0 ? undefined : '2 4'} />
              <text x={MARGEM.esq - 6} y={y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)" className="font-mono">
                {formatarValor(t)}
              </text>
            </g>
          ))}
          {categorias.map((c, i) =>
            rotulosVisiveis.has(i) ? (
              <text key={`${c}-${i}`} x={x(i)} y={altura - 8} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                {c}
              </text>
            ) : null,
          )}
          {series.map((s, si) => {
            const cor = corDoItem(s, si)
            const caminhos = trechos(s)
            return (
              <g key={s.nome}>
                {s.area
                  ? caminhos.map((d, k) => {
                      const pontos = s.valores.map((v, i) => ({ v, i })).filter((p) => p.v != null)
                      if (pontos.length === 0) return null
                      return (
                        <path
                          key={`a${k}`}
                          d={`${d} L${x(pontos[pontos.length - 1].i).toFixed(1)},${y(0).toFixed(1)} L${x(pontos[0].i).toFixed(1)},${y(0).toFixed(1)} Z`}
                          fill={cor}
                          opacity={0.14}
                        />
                      )
                    })
                  : null}
                {caminhos.map((d, k) => (
                  <path
                    key={k}
                    d={d}
                    fill="none"
                    stroke={cor}
                    strokeWidth={s.tracejada ? 1.75 : 2.5}
                    strokeDasharray={s.tracejada ? '5 4' : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {s.valores.map((v, i) => {
                  if (v == null) return null
                  const validos = s.valores.map((q, j) => (q == null ? -1 : j)).filter((j) => j >= 0)
                  const ponta = i === validos[0] || i === validos[validos.length - 1]
                  const escreve = !s.tracejada && (rotulosDeValor === 'todos' || (rotulosDeValor === 'pontas' && ponta))
                  // Acima do ponto se ele é o mais alto da coluna entre as séries; senão abaixo (evita rótulos sobrepostos).
                  const outros = series.filter((o, k) => k !== si && !o.tracejada).map((o) => o.valores[i]).filter((q): q is number => q != null)
                  const acima = outros.every((q) => v > q || (v === q && si === 0))
                  const marcado = pontoSelecionado?.serie === s.nome && pontoSelecionado.categoria === categorias[i]
                  const escolher = onSelecionarPonto
                    ? () => onSelecionarPonto({ categoria: categorias[i], serie: s.nome, indiceSerie: si, indice: i, valor: v })
                    : undefined
                  return (
                    <g
                      key={i}
                      {...(escolher
                        ? {
                            role: 'button',
                            tabIndex: 0,
                            'aria-pressed': marcado,
                            'aria-label': `${s.nome}, ${categorias[i]}: ${formatarValor(v)}`,
                            onClick: escolher,
                            onKeyDown: (e: KeyboardEvent<SVGGElement>) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                escolher()
                              }
                            },
                            className: 'cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-primary-text)]',
                          }
                        : {})}
                    >
                      {escolher ? <circle cx={x(i)} cy={y(v)} r={12} fill="transparent" /> : null}
                      {marcado ? <circle cx={x(i)} cy={y(v)} r={8} fill="none" stroke={cor} strokeWidth={2} /> : null}
                      <circle cx={x(i)} cy={y(v)} r={s.tracejada ? 2.5 : 3.5} fill={cor} stroke="var(--color-surface)" strokeWidth={1.5}>
                        <title>{`${s.nome}, ${categorias[i]}: ${formatarValor(v)}`}</title>
                      </circle>
                      {escreve ? (
                        <text
                          x={x(i)}
                          y={acima ? y(v) - 9 : y(v) + 17}
                          textAnchor={i === 0 && categorias.length > 1 ? 'start' : i === categorias.length - 1 && categorias.length > 1 ? 'end' : 'middle'}
                          fontSize={11}
                          fontWeight={600}
                          fill="var(--color-fg)"
                          className="font-mono"
                        >
                          {formatarValor(v)}
                        </text>
                      ) : null}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
