/** Lógica pura da casca do app (sem React), testada em `scripts/app-shell.test.mjs`. */

export interface PreferenciasDoMenu {
  /** Recolhe o menu sozinho depois de `segundos` sem o ponteiro em cima. */
  recolherAuto: boolean
  /** 1 a 30. */
  segundos: number
}

export const SEGUNDOS_MIN = 1
export const SEGUNDOS_MAX = 30
export const ATALHOS_DE_SEGUNDOS = [3, 5, 10, 15] as const

export function preferenciasPadrao(): PreferenciasDoMenu {
  return { recolherAuto: true, segundos: 3 }
}

/**
 * Lê as preferências guardadas. Campo ausente ou inválido cai no padrão, campo por campo
 * (`!!undefined` daria `false` e engoliria o padrão). JSON quebrado e armazenamento indisponível
 * também caem no padrão.
 */
export function lerPreferencias(
  bruto: string | null | undefined,
  padrao: PreferenciasDoMenu = preferenciasPadrao(),
): PreferenciasDoMenu {
  if (!bruto) return padrao
  try {
    const lido = JSON.parse(bruto) as Partial<PreferenciasDoMenu> | null
    if (!lido || typeof lido !== 'object') return padrao
    return {
      recolherAuto: typeof lido.recolherAuto === 'boolean' ? lido.recolherAuto : padrao.recolherAuto,
      segundos:
        typeof lido.segundos === 'number' && lido.segundos >= SEGUNDOS_MIN && lido.segundos <= SEGUNDOS_MAX
          ? lido.segundos
          : padrao.segundos,
    }
  } catch {
    return padrao
  }
}

export function carregarPreferencias(chave: string, padrao?: PreferenciasDoMenu): PreferenciasDoMenu {
  if (typeof window === 'undefined') return padrao ?? preferenciasPadrao()
  try {
    return lerPreferencias(window.localStorage.getItem(chave), padrao)
  } catch {
    return padrao ?? preferenciasPadrao()
  }
}

export function guardarPreferencias(chave: string, prefs: PreferenciasDoMenu): void {
  try {
    window.localStorage.setItem(chave, JSON.stringify(prefs))
  } catch {
    /* armazenamento indisponível: a preferência vale só nesta sessão */
  }
}

/** "Fipinho Baixada Santista" -> "Fipinho Santista". */
export function primeiroEUltimo(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length <= 1) return partes[0] ?? ''
  return `${partes[0]} ${partes[partes.length - 1]}`
}

/** Duas iniciais a partir do nome completo. */
export function iniciaisDoNome(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

/** Posição do cartão do tutorial: abaixo do alvo, senão acima, à direita, à esquerda, senão no centro. */
export interface PosicaoDoCartao {
  top: string
  left: string
  transform: string
  seta: 'cima' | 'baixo' | 'nenhuma'
}

export interface CaixaDoAlvo {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export function posicaoDoCartao(
  alvo: CaixaDoAlvo | null,
  largura: number,
  altura: number,
  janela: { largura: number; altura: number },
): PosicaoDoCartao {
  const centro: PosicaoDoCartao = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', seta: 'nenhuma' }
  if (!alvo) return centro
  const folga = 16
  const seta = 12
  const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max))

  const abaixo = alvo.bottom + seta + folga
  if (abaixo + altura < janela.altura - folga) {
    const left = limitar(alvo.left + alvo.width / 2 - largura / 2, folga, janela.largura - largura - folga)
    return { top: `${abaixo}px`, left: `${left}px`, transform: 'none', seta: 'cima' }
  }
  const acima = alvo.top - altura - seta - folga
  if (acima > folga) {
    const left = limitar(alvo.left + alvo.width / 2 - largura / 2, folga, janela.largura - largura - folga)
    return { top: `${acima}px`, left: `${left}px`, transform: 'none', seta: 'baixo' }
  }
  const direita = alvo.right + folga
  if (direita + largura < janela.largura - folga) {
    const top = limitar(alvo.top + alvo.height / 2 - altura / 2, folga, janela.altura - altura - folga)
    return { top: `${top}px`, left: `${direita}px`, transform: 'none', seta: 'nenhuma' }
  }
  const esquerda = alvo.left - largura - folga
  if (esquerda > folga) {
    const top = limitar(alvo.top + alvo.height / 2 - altura / 2, folga, janela.altura - altura - folga)
    return { top: `${top}px`, left: `${esquerda}px`, transform: 'none', seta: 'nenhuma' }
  }
  // Janela estreita (celular): nenhum lado comporta o cartão. Em vez de centrar sobre o alvo, encosta o cartão
  // no alto ou no pé da janela, no lado que cobre menos do alvo (empate: no pé).
  const sobreposicao = (de: number, ate: number) => Math.max(0, Math.min(alvo.bottom, ate) - Math.max(alvo.top, de))
  const topoDoPe = Math.max(folga, janela.altura - altura - folga)
  const noAlto = sobreposicao(folga, folga + altura)
  const noPe = sobreposicao(topoDoPe, topoDoPe + altura)
  const left = limitar(alvo.left + alvo.width / 2 - largura / 2, folga, Math.max(folga, janela.largura - largura - folga))
  return noAlto < noPe
    ? { top: `${folga}px`, left: `${left}px`, transform: 'none', seta: 'nenhuma' }
    : { top: `${topoDoPe}px`, left: `${left}px`, transform: 'none', seta: 'nenhuma' }
}

/**
 * Quanto rolar a página (px, positivo = para baixo) para o alvo ficar na parte da janela que o cartão do
 * tutorial não cobre. `topoMinimo` reserva o cabeçalho fixo. Só vale quando o cartão ficou no pé da janela
 * (celular); devolve 0 quando o alvo já está livre ou quando não cabe na parte livre (nesse caso alinha o topo).
 */
export function rolagemParaLiberarOAlvo(
  alvo: { top: number; bottom: number },
  alturaDoCartao: number,
  janelaAltura: number,
  topoMinimo = 72,
  folga = 16,
): number {
  const limiteInferior = janelaAltura - alturaDoCartao - 2 * folga
  const altura = alvo.bottom - alvo.top
  if (alvo.bottom <= limiteInferior && alvo.top >= topoMinimo) return 0
  if (altura <= limiteInferior - topoMinimo) {
    // Cabe inteiro na parte livre: encosta o pé do alvo no limite (ou o topo no mínimo).
    return alvo.bottom > limiteInferior ? alvo.bottom - limiteInferior : alvo.top - topoMinimo
  }
  return alvo.top - topoMinimo
}

/**
 * Tab dentro do tutorial (`aria-modal`): para onde vai o foco. `atual` é o índice do elemento focado na lista
 * de focáveis do cartão (`-1` se o foco está fora), com volta nas pontas.
 */
export function indiceDoFocoNoTab(total: number, atual: number, voltando: boolean): number {
  if (total <= 0) return -1
  if (atual < 0) return voltando ? total - 1 : 0
  return voltando ? (atual - 1 + total) % total : (atual + 1) % total
}

/** "99+" acima de 99. */
export function textoDoContador(n: number): string {
  return n > 99 ? '99+' : String(n)
}

/** O selo do item aparece com número maior que zero ou texto não vazio. */
export function seloVisivel(selo: number | string | undefined): selo is number | string {
  if (selo === undefined) return false
  if (typeof selo === 'number') return selo > 0
  return selo.trim().length > 0
}

/**
 * Número da versão sem o "v" inicial. O contrato aceita os dois jeitos ("0.2" e "v0.2"): a tela mostra
 * sempre um "v" só, e o leitor de tela lê o número puro.
 */
export function numeroDaVersao(numero: string): string {
  return numero.trim().replace(/^v(?=\d)/i, '')
}

/** Parte do `<html>` que a impressão mexe (facilita testar sem DOM). */
export interface RaizDoTema {
  classList: { contains: (c: string) => boolean; remove: (c: string) => void; add: (c: string) => void }
}

/**
 * Antes de imprimir: se a página está no tema escuro, tira a classe `dark` do `<html>` (papel é branco: o
 * texto claro do escuro sumiria). Devolve a função que a recoloca depois de imprimir. Sem `dark`, não faz nada.
 */
export function prepararImpressaoClara(raiz: RaizDoTema): () => void {
  if (!raiz.classList.contains('dark')) return () => {}
  raiz.classList.remove('dark')
  return () => raiz.classList.add('dark')
}
