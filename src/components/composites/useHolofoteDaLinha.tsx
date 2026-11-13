import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cliqueAbreALinha, linhaVizinha, posicaoDoHolofote } from './tabela-linha-logica'

export type HolofoteDaLinhaOpcoes = {
  /** Chave única e estável de cada linha, na ordem em que aparecem (as setas andam por esta lista). */
  chaves: string[]
  /** Liga ou desliga o holofote. Padrão: `true`. Desligado, nada é marcado nem escutado. */
  ligado?: boolean
  /**
   * A linha já tem ação própria no clique (`onClick`) e entra na ordem do Tab. Então o clique na linha só
   * escolhe a linha (não solta no 2º clique) e Enter/Espaço ficam com a ação da linha, não com o gatilho +.
   * Padrão: `false`.
   */
  linhaClicavel?: boolean
}

export type HolofoteDaLinha = {
  /** O holofote está valendo (ligado e com linhas). */
  ativo: boolean
  /** Chave da linha em destaque, ou `null`. */
  emFoco: string | null
  /** Espalhe na moldura que contém a tabela ou a lista: `ref` e `data-recuo` (as demais linhas recuam). */
  moldura: { ref: (el: HTMLElement | null) => void; 'data-recuo': '' | undefined }
  /** Renderize dentro da moldura, depois da tabela ou da lista (a moldura precisa ser `position: relative`). */
  holofote: ReactNode
  /** Espalhe em cada `<tr>` ou `<li>` da linha. */
  propsDaLinha: (chave: string) => PropsDaLinhaComHolofote
  /** Passe ao `onOpenChange` do `RowActionsMenu` da linha: `onOpenChange={h.aoMudarMenu(chave)}`. */
  aoMudarMenu: (chave: string) => (aberto: boolean) => void
}

export type PropsDaLinhaComHolofote = {
  ref: (el: HTMLElement | null) => void
  'data-linha': ''
  'data-em-foco': '' | undefined
  tabIndex?: number
  onClickCapture?: (e: MouseEvent<HTMLElement>) => void
}

const SEPARADOR = '\u0001'

/**
 * Holofote da linha ativa, o mesmo da `TabelaExpansivel`, para qualquer tabela (`Table`/`TableRow`) ou lista de
 * cartões do pacote que use o gatilho + (`RowActionsMenu`). Com o menu da linha aberto (ou a linha escolhida com
 * clique), ela ganha fundo no tom primário, anel e leve elevação, e as demais recuam sob um véu cinza claro.
 * ↑ e ↓ levam o destaque à linha vizinha; Enter/Espaço na linha abre o menu; Esc, X, clique fora ou a ação
 * escolhida devolvem a tabela. Os estilos vêm do `styles.css` do pacote.
 */
export function useHolofoteDaLinha({ chaves: chavesDeFora, ligado = true, linhaClicavel = false }: HolofoteDaLinhaOpcoes): HolofoteDaLinha {
  // A lista só muda de identidade quando as chaves mudam (quem chama pode passar um array novo a cada render).
  const assinatura = chavesDeFora.join(SEPARADOR)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chaves = useMemo(() => chavesDeFora, [assinatura, chavesDeFora.length])

  const [emFoco, setEmFoco] = useState<string | null>(null)
  const menuAbertoRef = useRef(false)
  const molduraRef = useRef<HTMLElement | null>(null)
  const holofoteRef = useRef<HTMLDivElement | null>(null)
  const holofotePosto = useRef(false)
  const linhasRef = useRef(new Map<string, HTMLElement>())
  const refMoldura = useCallback((el: HTMLElement | null) => {
    molduraRef.current = el
  }, [])

  const ativo = ligado && chaves.length > 0
  const focoValido = ativo && emFoco !== null && chaves.includes(emFoco) ? emFoco : null

  const posicionarHolofote = useCallback(() => {
    const holo = holofoteRef.current
    const moldura = molduraRef.current
    const tr = focoValido ? linhasRef.current.get(focoValido) : undefined
    if (!holo || !moldura || !tr) return
    const { y, altura } = posicaoDoHolofote(tr.getBoundingClientRect(), moldura.getBoundingClientRect(), moldura.clientTop)
    // 1ª aparição: entra no lugar, sem vir deslizando do topo; depois desliza por transform.
    const primeira = !holofotePosto.current
    if (primeira) holo.setAttribute('data-sem-deslize', '')
    holo.style.transform = `translateY(${y}px)`
    holo.style.height = `${altura}px`
    if (primeira) {
      void holo.offsetWidth
      holo.removeAttribute('data-sem-deslize')
      holofotePosto.current = true
    }
  }, [focoValido])

  useLayoutEffect(() => {
    posicionarHolofote()
  })

  useEffect(() => {
    const moldura = molduraRef.current
    if (!focoValido || !moldura || typeof ResizeObserver === 'undefined') return
    const observador = new ResizeObserver(() => posicionarHolofote())
    observador.observe(moldura)
    return () => observador.disconnect()
  }, [focoValido, posicionarHolofote])

  // Linha escolhida com o menu fechado: ↑↓ movem, Enter/Espaço na linha abre o menu, Esc e clique fora devolvem.
  useEffect(() => {
    if (!focoValido) return
    const focarLinha = (k: string) => linhasRef.current.get(k)?.focus({ preventScroll: false })
    const gatilho = (k: string) => linhasRef.current.get(k)?.querySelector<HTMLButtonElement>('.fips-row-action')
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || menuAbertoRef.current) return
      const alvo = e.target as HTMLElement | null
      if (alvo?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      const atual = chaves.indexOf(focoValido)
      const proxima = linhaVizinha(e.key, atual, chaves.length)
      if (proxima !== null) {
        e.preventDefault()
        setEmFoco(chaves[proxima])
        focarLinha(chaves[proxima])
        return
      }
      const tr = linhasRef.current.get(focoValido)
      if ((e.key === 'Enter' || e.key === ' ') && !linhaClicavel && alvo === tr) {
        const g = gatilho(focoValido)
        if (g) {
          e.preventDefault()
          g.click()
        }
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        const g = gatilho(focoValido)
        setEmFoco(null)
        g?.focus({ preventScroll: true })
      }
    }
    const onClique = (e: globalThis.MouseEvent) => {
      if (menuAbertoRef.current) return
      const corpo = linhasRef.current.get(focoValido)?.parentElement
      if (corpo && !corpo.contains(e.target as Node)) setEmFoco(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClique)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClique)
    }
  }, [focoValido, chaves, linhaClicavel])

  // O menu da linha abre: ela vira a linha em destaque. Fecha (Esc, X, clique fora, ação): a tabela volta.
  const aoMudarMenu = (k: string) => (aberto: boolean) => {
    menuAbertoRef.current = aberto
    setEmFoco(aberto ? k : null)
  }

  // Clique na linha (fora dos controles) escolhe a linha para o destaque; sem ação própria, o 2º clique solta.
  // tabIndex -1 deixa as setas levarem o foco de linha em linha sem pôr a linha na ordem do Tab.
  const propsDaLinha = (k: string): PropsDaLinhaComHolofote => ({
    ref: (el) => {
      if (el) linhasRef.current.set(k, el)
      else linhasRef.current.delete(k)
    },
    'data-linha': '',
    'data-em-foco': focoValido === k ? '' : undefined,
    ...(ativo
      ? {
          ...(linhaClicavel ? {} : { tabIndex: -1 }),
          onClickCapture: (e: MouseEvent<HTMLElement>) => {
            if (menuAbertoRef.current || !cliqueAbreALinha(e.target as Element, e.currentTarget)) return
            const solta = !linhaClicavel && focoValido === k
            setEmFoco(solta ? null : k)
            if (!solta) e.currentTarget.focus({ preventScroll: true })
          },
        }
      : {}),
  })

  return {
    ativo,
    emFoco: focoValido,
    moldura: { ref: refMoldura, 'data-recuo': focoValido ? '' : undefined },
    holofote: ativo ? <div ref={holofoteRef} className="fips-holofote" aria-hidden /> : null,
    propsDaLinha,
    aoMudarMenu,
  }
}
