/**
 * Posição de uma lista que flutua sobre a página (portal no `body`, `position: fixed`),
 * ancorada num gatilho. Só números: o componente mede o DOM e passa os retângulos, e
 * `scripts/select-portal.test.mjs` confere a conta sem navegador.
 */

/** Altura máxima da lista. É a mesma do `Select` quando a lista ainda era inline (`max-h-[200px]`). */
export const LISTA_ALTURA_MAX = 200

/** Folga mínima entre a lista e a borda da janela. */
export const LISTA_FOLGA = 8

/** O que se usa do retângulo do gatilho (`getBoundingClientRect`), em px da janela. */
export interface GatilhoRect {
  top: number
  bottom: number
  left: number
  width: number
}

/** Tamanho da janela que contém o `position: fixed` (`documentElement.clientWidth/Height`, sem barra de rolagem). */
export interface JanelaMedida {
  largura: number
  altura: number
}

export interface PosicaoLista {
  abrirParaCima: boolean
  left: number
  width: number
  /** Só quando abre para baixo: distância do topo da janela à borda de cima da lista. */
  top?: number
  /** Só quando abre para cima: distância da base da janela à borda de baixo da lista. */
  bottom?: number
  /** Teto da altura: 200 px, ou o espaço que sobra do lado escolhido (a lista rola por dentro). */
  maxHeight: number
}

/**
 * Abre para baixo, colada na borda de baixo do gatilho. Só sobe quando embaixo não cabe a lista
 * inteira (`alturaLista`, limitada a 200 px) e em cima sobra mais espaço que embaixo. Em qualquer
 * dos lados a lista nunca passa da janela: se o espaço for menor que 200 px, ela encolhe e rola.
 */
export function calcularPosicaoLista(
  gatilho: GatilhoRect,
  janela: JanelaMedida,
  alturaLista: number,
): PosicaoLista {
  const natural = Math.min(alturaLista, LISTA_ALTURA_MAX)
  const abaixo = Math.max(0, janela.altura - gatilho.bottom - LISTA_FOLGA)
  const acima = Math.max(0, gatilho.top - LISTA_FOLGA)
  const abrirParaCima = abaixo < natural && acima > abaixo
  const maxHeight = Math.min(LISTA_ALTURA_MAX, abrirParaCima ? acima : abaixo)
  const base = { abrirParaCima, left: gatilho.left, width: gatilho.width, maxHeight }
  return abrirParaCima
    ? { ...base, bottom: janela.altura - gatilho.top }
    : { ...base, top: gatilho.bottom }
}

/** Mesma posição, campo a campo. Evita renderizar de novo a cada evento de rolagem que não moveu nada. */
export function mesmaPosicaoLista(a: PosicaoLista | null, b: PosicaoLista): boolean {
  return (
    a !== null &&
    a.abrirParaCima === b.abrirParaCima &&
    a.left === b.left &&
    a.width === b.width &&
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.maxHeight === b.maxHeight
  )
}
