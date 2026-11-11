import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

export interface PosicaoDoPainel {
  top: number
  left: number
  largura: number
}

/**
 * Painel em portal ancorado embaixo de um gatilho (sino, chip do usuário). O cabeçalho tem
 * `overflow: hidden` e cortaria um painel `absolute`, por isso o painel mora no `document.body`.
 * Reposiciona ao rolar e ao redimensionar, nunca passa das bordas da janela, fecha no Esc e no clique
 * fora. O clique no próprio painel conta como DENTRO: senão o `mousedown` desmontaria o painel antes
 * de o `click` chegar a qualquer item.
 */
export function usePainelAncorado(
  aberto: boolean,
  fechar: () => void,
  opcoes: { largura: number; margem?: number },
): {
  ancoraRef: RefObject<HTMLDivElement | null>
  painelRef: RefObject<HTMLDivElement | null>
  posicao: PosicaoDoPainel | null
} {
  const { largura: larguraMax, margem = 8 } = opcoes
  const ancoraRef = useRef<HTMLDivElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)
  const [posicao, setPosicao] = useState<PosicaoDoPainel | null>(null)
  const fecharRef = useRef(fechar)
  useEffect(() => {
    fecharRef.current = fechar
  })

  useLayoutEffect(() => {
    if (!aberto) return
    const atualizar = () => {
      const r = ancoraRef.current?.getBoundingClientRect()
      if (!r) return
      const largura = Math.min(larguraMax, window.innerWidth - 2 * margem)
      const left = Math.max(margem, Math.min(r.right - largura, window.innerWidth - largura - margem))
      setPosicao({ top: r.bottom + 8, left, largura })
    }
    atualizar()
    window.addEventListener('resize', atualizar)
    window.addEventListener('scroll', atualizar, true)
    return () => {
      window.removeEventListener('resize', atualizar)
      window.removeEventListener('scroll', atualizar, true)
    }
  }, [aberto, larguraMax, margem])

  useEffect(() => {
    if (!aberto) return
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target as Node
      if (ancoraRef.current?.contains(alvo) || painelRef.current?.contains(alvo)) return
      fecharRef.current()
    }
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharRef.current()
    }
    document.addEventListener('mousedown', aoClicar)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('mousedown', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  return { ancoraRef, painelRef, posicao: aberto ? posicao : null }
}
