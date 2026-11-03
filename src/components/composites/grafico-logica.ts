/**
 * Lógica pura dos gráficos e do documento de impressão: sem React, sem DOM.
 * Testada em scripts/graficos-documento.test.mjs.
 */

/** Tons dos gráficos. Cada um é a variável CSS `--grafico-<tom>`, com valor próprio no claro e no escuro. */
export const TONS_GRAFICO = [
  'primario',
  'secundario',
  'sucesso',
  'atencao',
  'aviso',
  'critico',
  'neutro',
  'violeta',
] as const
export type TomGrafico = (typeof TONS_GRAFICO)[number]

/** Ordem em que as categorias sem tom próprio recebem cor. Termina nos dois tons de menor destaque. */
export const SEQUENCIA_CATEGORICA: readonly TomGrafico[] = [
  'primario',
  'aviso',
  'sucesso',
  'secundario',
  'violeta',
  'atencao',
  'critico',
  'neutro',
]

/** Valor CSS de um tom: a variável do tema, nunca uma cor crua. */
export function corDoTom(tom: TomGrafico): string {
  return `var(--grafico-${tom})`
}

/** Cor de um item: `cor` explícita vence, depois `tom`, depois a sequência pela posição. */
export function corDoItem(item: { tom?: TomGrafico; cor?: string }, indice: number): string {
  if (item.cor) return item.cor
  return corDoTom(item.tom ?? SEQUENCIA_CATEGORICA[indice % SEQUENCIA_CATEGORICA.length])
}

/** 12345,6 -> "12.345,6" (pt-BR), no máximo uma casa. */
export function formatarNumero(n: number): string {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

/**
 * Participação de `valor` em `total`, como sai na legenda e no texto alternativo.
 * Abaixo de 1% a casa decimal fica ("0,4%"), senão arredondar viraria "0%", que lê como "nenhum"
 * quando há; abaixo de 0,1% sai "<0,1%".
 */
export function participacao(valor: number, total: number): string {
  if (!total || !valor) return '0%'
  const pct = (100 * valor) / total
  if (pct < 0.1) return '<0,1%'
  if (pct < 1) return `${pct.toFixed(1).replace('.', ',')}%`
  return `${Math.round(pct)}%`
}

/**
 * Tamanho de uma barra em % da `base` (o maior valor, ou o `maximo` fixo do gráfico). Valor positivo ganha
 * pelo menos `pisoPositivo`; valor acima da base enche a barra (100). Zero, negativo ou base inválida: 0.
 */
export function tamanhoEmPercentual(valor: number, base: number, pisoPositivo = 0): number {
  if (!(valor > 0) || !(base > 0)) return 0
  return Math.min(100, Math.max(pisoPositivo, (valor / base) * 100))
}

/**
 * Largura de cada valor em % do maior, com piso para valor positivo não sumir (0 continua 0).
 * Com `base` (escala fixa, por exemplo 100) a referência é ela e não o maior valor.
 */
export function percentuaisDoMaior(valores: number[], pisoPositivo = 2, base?: number): number[] {
  const max = base != null && base > 0 ? base : Math.max(0, ...valores)
  if (max <= 0) return valores.map(() => 0)
  return valores.map((v) => tamanhoEmPercentual(v, max, pisoPositivo))
}

/**
 * Teto "redondo" do eixo e as marcas entre 0 e ele. `escalaLinear(47)` -> teto 50, marcas 0, 25, 50.
 * Passos 1, 2, 2,5, 5 e 10 vezes a potência de dez; `marcas` é o número desejado de intervalos.
 */
export function escalaLinear(maximo: number, marcas = 4): { teto: number; ticks: number[] } {
  if (!(maximo > 0) || !Number.isFinite(maximo)) return { teto: 1, ticks: [0, 1] }
  const bruto = maximo / Math.max(1, marcas)
  const potencia = 10 ** Math.floor(Math.log10(bruto))
  const fracao = bruto / potencia
  const passoBase = fracao <= 1 ? 1 : fracao <= 2 ? 2 : fracao <= 2.5 ? 2.5 : fracao <= 5 ? 5 : 10
  const passo = passoBase * potencia
  const teto = Math.ceil(maximo / passo - 1e-9) * passo
  const ticks: number[] = []
  for (let v = 0; v <= teto + passo / 1e6; v += passo) ticks.push(Math.round(v * 1e6) / 1e6)
  return { teto, ticks }
}

export interface FatiaAngular {
  indice: number
  inicio: number
  fim: number
}

/**
 * Ângulos (graus, a partir do topo, sentido horário) de cada fatia da rosca.
 * Valor zero não ganha fatia. Toda fatia com valor ocupa pelo menos `minimoGraus`, tirados das
 * maiores na proporção, para que 0,4% não vire um vão de 1 grau. A soma fecha em 360.
 */
export function angulosDaRosca(valores: number[], minimoGraus = 5): FatiaAngular[] {
  const positivos = valores.map((v, indice) => ({ v: v > 0 ? v : 0, indice })).filter((x) => x.v > 0)
  const total = positivos.reduce((s, x) => s + x.v, 0)
  if (total <= 0) return []
  const piso = Math.min(minimoGraus, 360 / positivos.length)
  let graus = positivos.map((x) => (x.v / total) * 360)
  const pequenos = graus.map((g) => g < piso)
  const faltam = graus.reduce((s, g, i) => s + (pequenos[i] ? piso - g : 0), 0)
  const folga = graus.reduce((s, g, i) => s + (pequenos[i] ? 0 : g - piso), 0)
  if (faltam > 0 && folga > 0) {
    const fator = Math.min(1, faltam / folga)
    graus = graus.map((g, i) => (pequenos[i] ? piso : g - (g - piso) * fator))
  }
  const soma = graus.reduce((s, g) => s + g, 0)
  graus = graus.map((g) => (g / soma) * 360)
  let cursor = 0
  return positivos.map((x, i) => {
    const inicio = cursor
    cursor += graus[i]
    return { indice: x.indice, inicio, fim: i === positivos.length - 1 ? 360 : cursor }
  })
}

const rad = (graus: number) => ((graus - 90) * Math.PI) / 180
const f = (n: number) => Math.round(n * 100) / 100

/** Caminho SVG de um setor de rosca (anel entre `raioInterno` e `raioExterno`). 360 graus vira dois arcos. */
export function caminhoDoArco(
  cx: number,
  cy: number,
  raioExterno: number,
  raioInterno: number,
  inicio: number,
  fim: number,
): string {
  const volta = fim - inicio >= 359.999
  const fimReal = volta ? inicio + 359.99 : fim
  const grande = fimReal - inicio > 180 ? 1 : 0
  const p = (r: number, g: number) => `${f(cx + r * Math.cos(rad(g)))} ${f(cy + r * Math.sin(rad(g)))}`
  return [
    `M ${p(raioExterno, inicio)}`,
    `A ${raioExterno} ${raioExterno} 0 ${grande} 1 ${p(raioExterno, fimReal)}`,
    `L ${p(raioInterno, fimReal)}`,
    `A ${raioInterno} ${raioInterno} 0 ${grande} 0 ${p(raioInterno, inicio)}`,
    'Z',
  ].join(' ')
}

/** Passos do mapa de calor: fração do tom misturada com a superfície, do mais claro ao mais escuro. */
export const PASSOS_CALOR = [0.1, 0.22, 0.34, 0.46, 1] as const

/** Nível 0 a 5 de `valor` na escala 0..`maximo`. 0 só para valor vazio ou zero; positivo nunca cai abaixo de 1. */
export function nivelDeCalor(valor: number | null | undefined, maximo: number): number {
  if (valor == null || !(valor > 0) || !(maximo > 0)) return 0
  return Math.min(5, Math.max(1, Math.ceil((valor / maximo) * 5 - 1e-9)))
}

/** Tom da barra de progresso pela porcentagem: concluído, quase lá, na metade, começando, mal começou, nada. */
export type FaixaProgresso = 'concluido' | 'alto' | 'medio' | 'baixo' | 'minimo' | 'vazio'

export function faixaDeProgresso(pct: number): FaixaProgresso {
  if (pct >= 100) return 'concluido'
  if (pct >= 90) return 'alto'
  if (pct >= 60) return 'medio'
  if (pct >= 30) return 'baixo'
  if (pct >= 1) return 'minimo'
  return 'vazio'
}

/** Porcentagem inteira de `valor` em `maximo`, presa entre 0 e 100. */
export function porcentagem(valor: number, maximo: number): number {
  if (!(maximo > 0)) return 0
  return Math.round((Math.min(Math.max(valor, 0), maximo) / maximo) * 100)
}

/**
 * Quantos rótulos do eixo cabem: devolve o passo (1 = todos, 2 = um sim um não...).
 * `larguraRotulo` e `largura` em pixels.
 */
export function passoDosRotulos(quantidade: number, largura: number, larguraRotulo: number): number {
  if (quantidade <= 1 || largura <= 0) return 1
  const cabem = Math.max(1, Math.floor(largura / larguraRotulo))
  return Math.max(1, Math.ceil(quantidade / cabem))
}

/**
 * Posições dos rótulos do eixo que aparecem, dado o passo de `passoDosRotulos`: de `passo` em `passo` a partir
 * do primeiro, e SEMPRE o último (sem ele o eixo termina num ponto sem nome). O rótulo de passo que cairia
 * colado no último (a menos de `passo` posições) sai, para os dois não se sobreporem.
 */
export function indicesDosRotulos(quantidade: number, passo: number): number[] {
  if (quantidade <= 0) return []
  const p = Math.max(1, Math.floor(passo))
  const ultimo = quantidade - 1
  const indices: number[] = []
  for (let i = 0; i < ultimo; i += p) if (i === 0 || ultimo - i >= p) indices.push(i)
  indices.push(ultimo)
  return indices
}

/** Nome do arquivo PNG de um cartão de gráfico: o título sem acento nem símbolo, com hífens (`graficos-por-status.png`). */
export function nomeDoArquivoImagem(titulo: string): string {
  const base = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base || 'grafico'}.png`
}

/** "página 3", "páginas 1 e 2", "páginas 1, 2 e 3". Vazio quando não há referência. */
export function textoPaginas(paginas: (string | number)[]): string {
  const lista = paginas.map((p) => String(p).trim()).filter((p) => p !== '')
  if (lista.length === 0) return ''
  if (lista.length === 1) return `página ${lista[0]}`
  return `páginas ${lista.slice(0, -1).join(', ')} e ${lista[lista.length - 1]}`
}

/**
 * Alvo de clique ampliado (`after:`) de um segmento de barra. Segmento com vizinho NÃO cresce na direção do
 * vizinho: senão a área do segmento de cima cobre o centro do de baixo e o clique cai na série errada (medido
 * em "nov/26 · SST": 9,7 px de altura, o clique no centro devolvia "MA").
 * - `pilha-vertical`: segmentos empilhados; só a base do primeiro (embaixo) e o topo do último (em cima) crescem.
 * - `grupo-vertical`: barras lado a lado; cresce na vertical, nunca na horizontal.
 * - `horizontal`: barras em linhas; cresce pouco na vertical (a distância entre linhas é de 4 px).
 */
export type ModoDeExpansao = 'pilha-vertical' | 'grupo-vertical' | 'horizontal'

export function expansaoDoSegmento(modo: ModoDeExpansao, indice: number, total: number): string {
  if (modo === 'grupo-vertical') return 'after:inset-x-0 after:-inset-y-[6px]'
  if (modo === 'horizontal') return 'after:inset-x-0 after:-inset-y-[2px]'
  const primeiro = indice === 0
  const ultimo = indice === total - 1
  return [
    'after:-inset-x-[3px]',
    ultimo ? 'after:-top-[6px]' : 'after:top-0',
    primeiro ? 'after:-bottom-[6px]' : 'after:bottom-0',
  ].join(' ')
}

/**
 * O clique veio de toque ou caneta? O balão (tooltip) só abre por ponteiro com hover e por foco de teclado;
 * no toque o clique abre a nota na página. Clique de teclado e de mouse tem `pointerType` `''`/`'mouse'`.
 */
export function cliqueEhDeToque(evento: { pointerType?: string } | null | undefined): boolean {
  const tipo = evento?.pointerType
  return tipo === 'touch' || tipo === 'pen'
}
