/**
 * Devolução do foco ao fechar Modal, Dialog e Drawer. O Radix só devolve o foco ao `Trigger`; um
 * painel aberto por estado (`open={aberto}`) deixava o foco no `body` e o teclado recomeçava do topo.
 * Guarda-se o elemento focado ao abrir e, ao fechar, ele recebe o foco de volta se ainda existe.
 */

/** Parte mínima de um elemento que a decisão precisa (facilita testar sem DOM). */
export interface AlvoDeFoco {
  isConnected: boolean
  focus: (opcoes?: { preventScroll?: boolean }) => void
}

/** Quem deve receber o foco ao fechar: a origem, se ainda está na página e não é o `body`. */
export function escolherAlvoDoFoco<T extends AlvoDeFoco>(origem: T | null | undefined, corpo?: unknown): T | null {
  if (!origem) return null
  if (origem === corpo) return null
  if (!origem.isConnected) return null
  if (typeof origem.focus !== 'function') return null
  return origem
}

/** Elemento focado agora (a origem do painel que vai abrir), ou `null` sem DOM. */
export function elementoFocado(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const ativo = document.activeElement
  return ativo instanceof HTMLElement ? ativo : null
}

type EventoDeFoco = Event

/**
 * Par de ganchos para o `Content` do Radix: `aoAbrir` guarda a origem, `aoFechar` devolve o foco.
 * O `aoFechar` respeita `onCloseAutoFocus` do consumidor (se ele chamar `preventDefault`, nada é feito).
 */
export function criarRetornoDoFoco() {
  let origem: HTMLElement | null = null
  return {
    aoAbrir(consumidor?: (e: EventoDeFoco) => void) {
      return (e: EventoDeFoco) => {
        origem = elementoFocado()
        consumidor?.(e)
      }
    },
    aoFechar(consumidor?: (e: EventoDeFoco) => void) {
      return (e: EventoDeFoco) => {
        consumidor?.(e)
        if (e.defaultPrevented) return
        const alvo = escolherAlvoDoFoco(origem, typeof document === 'undefined' ? undefined : document.body)
        origem = null
        if (alvo) {
          e.preventDefault()
          alvo.focus({ preventScroll: true })
        }
      }
    },
  }
}
