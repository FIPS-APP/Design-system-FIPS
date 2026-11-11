import { cn } from '../../lib/cn'
import { corDoTom, formatarNumero, nivelDeCalor, PASSOS_CALOR, type TomGrafico } from './grafico-logica'

/** Tons que sustentam texto legível nos cinco níveis, nos dois temas (medido em scripts/graficos-documento.test.mjs). */
export type TomDeCalor = Extract<TomGrafico, 'primario' | 'aviso' | 'critico' | 'violeta'>

export interface MapaDeCalorProps {
  /** Rótulos das linhas (por exemplo, locais). */
  linhas: string[]
  /** Rótulos das colunas (por exemplo, meses). */
  colunas: string[]
  /** `valores[linha][coluna]`. `null` ou ausente é célula sem dado, mostrada como traço. */
  valores: (number | null | undefined)[][]
  /** Texto alternativo do mapa inteiro: o que ele mede. */
  rotulo: string
  /** Canto superior esquerdo da tabela: o que as linhas são. */
  rotuloDasLinhas?: string
  /** Tom da escala. Padrão `critico`. */
  tom?: TomDeCalor
  formatarValor?: (valor: number) => string
  /** Escala do mapa: o valor que pinta o nível máximo. Padrão: o maior valor da matriz. */
  maximo?: number
  /** Legenda "menos / mais" sob o mapa. Padrão ligada. */
  mostrarLegenda?: boolean
  /** Clique numa célula (drill-down). Com isto a célula vira botão. */
  onSelecionarCelula?: (linha: string, coluna: string, valor: number | null) => void
  className?: string
}

/** Cor de fundo do nível `n` (1 a 5): o tom misturado com a superfície do cartão. */
function fundoDoNivel(tom: TomGrafico, nivel: number): string {
  const pct = Math.round(PASSOS_CALOR[nivel - 1] * 100)
  return `color-mix(in srgb, ${corDoTom(tom)} ${pct}%, var(--color-surface))`
}

/** Texto do nível: o texto do tema nos quatro primeiros, o texto forte do tema na célula mais escura. */
function textoDoNivel(nivel: number): string {
  return nivel >= 5 ? 'var(--grafico-calor-texto-forte)' : 'var(--color-fg)'
}

/**
 * Mapa de calor (linhas por colunas) como tabela de verdade: cabeçalhos de linha e coluna, o número
 * escrito em cada célula, cinco níveis de intensidade. Rola na horizontal quando a matriz é larga e a
 * primeira coluna fica fixa.
 */
export function MapaDeCalor({
  linhas,
  colunas,
  valores,
  rotulo,
  rotuloDasLinhas,
  tom = 'critico',
  formatarValor = formatarNumero,
  maximo,
  mostrarLegenda = true,
  onSelecionarCelula,
  className,
}: MapaDeCalorProps) {
  if (linhas.length === 0 || colunas.length === 0) return null
  const topo =
    maximo ?? Math.max(0, ...valores.flatMap((l) => l.map((v) => (v == null ? 0 : v))))
  return (
    <div className={cn('min-w-0', className)}>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={rotulo}>
        <table className="w-full border-separate border-spacing-[3px] text-xs">
          <caption className="sr-only">{rotulo}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-[var(--color-surface)] px-2 py-1 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-fg-muted)]">
                {rotuloDasLinhas ?? <span className="sr-only">Linha</span>}
              </th>
              {colunas.map((c) => (
                <th key={c} scope="col" className="min-w-10 px-1 py-1 text-center text-[10px] font-semibold text-[var(--color-fg-muted)]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={l}>
                <th scope="row" className="sticky left-0 z-10 max-w-40 truncate bg-[var(--color-surface)] px-2 py-1 text-left text-xs font-medium text-[var(--color-fg)]" title={l}>
                  {l}
                </th>
                {colunas.map((c, j) => {
                  const v = valores[i]?.[j] ?? null
                  const nivel = nivelDeCalor(v, topo)
                  const estilo =
                    nivel > 0
                      ? { background: fundoDoNivel(tom, nivel), color: textoDoNivel(nivel) }
                      : { background: 'var(--color-surface-muted)', color: 'var(--color-fg-muted)' }
                  const texto = v == null ? '–' : formatarValor(v)
                  const aria = `${l}, ${c}: ${v == null ? 'sem dado' : formatarValor(v)}`
                  return (
                    <td key={c} className="p-0 text-center" data-nivel={nivel}>
                      {onSelecionarCelula ? (
                        <button
                          type="button"
                          aria-label={aria}
                          onClick={() => onSelecionarCelula(l, c, v)}
                          className="block h-9 w-full min-w-10 rounded-[5px] font-mono text-[11px] font-semibold [font-variant-numeric:tabular-nums] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]"
                          style={estilo}
                        >
                          {texto}
                        </button>
                      ) : (
                        <span
                          title={aria}
                          className="flex h-9 min-w-10 items-center justify-center rounded-[5px] font-mono text-[11px] font-semibold [font-variant-numeric:tabular-nums]"
                          style={estilo}
                        >
                          {texto}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarLegenda ? (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-fg-muted)]">
          <span>Menos</span>
          <span aria-hidden className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="block h-3 w-6 rounded-[3px]" style={{ background: fundoDoNivel(tom, n) }} />
            ))}
          </span>
          <span>Mais</span>
        </div>
      ) : null}
    </div>
  )
}
