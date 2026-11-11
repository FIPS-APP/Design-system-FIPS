/**
 * Posição de uma lista suspensa (Select, ChipSelect, Período) para ela caber inteira na tela e na
 * área que a recorta (corpo rolável de Modal ou Drawer). A lista nasce `absolute` embaixo do gatilho;
 * aqui se decide o que corrigir: virar para cima, encurtar e deslocar na horizontal.
 */

export interface Retangulo {
  top: number
  left: number
  right: number
  bottom: number
}

export interface AjusteDaLista {
  /** `baixo` é o natural (logo abaixo do gatilho). `cima` abre acima dele. */
  lado: 'baixo' | 'cima'
  /** Deslocamento horizontal em px (negativo para a esquerda) que devolve a lista para dentro da área. */
  deslocamentoX: number
  /** Altura máxima em px quando a lista natural não cabe; `null` mantém a do componente. */
  alturaMaxima: number | null
}

/** Interseção de dois retângulos (a área visível é a janela cortada por cada ancestral que recorta). */
export function intersecao(a: Retangulo, b: Retangulo): Retangulo {
  return {
    top: Math.max(a.top, b.top),
    left: Math.max(a.left, b.left),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  }
}

/**
 * `gatilho`: retângulo do gatilho. `lista`: retângulo da lista na posição natural (embaixo). `area`:
 * retângulo visível (janela ∩ ancestrais que recortam). `folga`: respiro até a borda da área.
 * `afastamento`: vão entre o gatilho e a lista (margem ou `top` além de 100%).
 */
export function ajustarListaNaArea(
  gatilho: Retangulo,
  lista: { left: number; right: number; height: number },
  area: Retangulo,
  folga = 8,
  afastamento = 0,
): AjusteDaLista {
  const largura = lista.right - lista.left
  let deslocamentoX = 0
  const minimoX = area.left + folga
  const maximoX = area.right - folga
  if (largura >= maximoX - minimoX) {
    deslocamentoX = minimoX - lista.left
  } else if (lista.right > maximoX) {
    deslocamentoX = maximoX - lista.right
  } else if (lista.left < minimoX) {
    deslocamentoX = minimoX - lista.left
  }

  const abaixo = area.bottom - gatilho.bottom - afastamento - folga
  const acima = gatilho.top - area.top - afastamento - folga
  // Cabe inteira embaixo: nada a fazer. Senão, o lado em que ela cabe inteira; senão, o lado maior, encurtada.
  if (lista.height <= abaixo) return { lado: 'baixo', deslocamentoX, alturaMaxima: null }
  if (lista.height <= acima) return { lado: 'cima', deslocamentoX, alturaMaxima: null }
  if (abaixo >= acima) return { lado: 'baixo', deslocamentoX, alturaMaxima: Math.max(0, Math.floor(abaixo)) }
  return { lado: 'cima', deslocamentoX, alturaMaxima: Math.max(0, Math.floor(acima)) }
}
