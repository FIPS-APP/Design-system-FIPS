import { useLayoutEffect, useState, type RefObject } from 'react'
import { ajustarListaNaArea, intersecao, type Retangulo } from './lista-na-tela'

/** Área visível do gatilho: a janela cortada por cada ancestral com `overflow` diferente de `visible`. */
function areaVisivel(origem: HTMLElement): Retangulo {
  let area: Retangulo = { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }
  for (let no = origem.parentElement; no && no !== document.body && no !== document.documentElement; no = no.parentElement) {
    const estilo = getComputedStyle(no)
    if (estilo.overflowX === 'visible' && estilo.overflowY === 'visible') continue
    const r = no.getBoundingClientRect()
    area = intersecao(area, { top: r.top, left: r.left, right: r.right, bottom: r.bottom })
  }
  return area
}

/**
 * Mantém a lista suspensa inteira na tela e na área rolável que a contém. Nada de portal: a lista segue
 * dentro do Modal ou do Drawer (o foco e o `Esc` continuam do painel). Ao abrir, ao redimensionar e ao
 * rolar, mede a lista na posição natural e vira para cima, encurta (`max-height`) ou desloca na horizontal.
 * `afastamento` é o vão que a lista tem do gatilho (px), repetido ao virar para cima. Devolve o lado,
 * para o componente ajustar bordas.
 */
export function useListaNaTela(
  aberto: boolean,
  gatilhoRef: RefObject<HTMLElement | null>,
  listaRef: RefObject<HTMLElement | null>,
  { folga = 8, afastamento = 0 }: { folga?: number; afastamento?: number } = {},
): 'baixo' | 'cima' {
  const [lado, setLado] = useState<'baixo' | 'cima'>('baixo')

  useLayoutEffect(() => {
    if (!aberto) return
    const ajustar = () => {
      const gatilho = gatilhoRef.current
      const lista = listaRef.current
      if (!gatilho || !lista) return
      // Medida na posição natural: limpa o que foi aplicado antes.
      lista.style.transform = ''
      lista.style.maxHeight = ''
      lista.style.top = ''
      lista.style.bottom = ''
      lista.style.marginTop = ''
      lista.style.marginBottom = ''
      const g = gatilho.getBoundingClientRect()
      const l = lista.getBoundingClientRect()
      const ajuste = ajustarListaNaArea(
        { top: g.top, left: g.left, right: g.right, bottom: g.bottom },
        { left: l.left, right: l.right, height: l.height },
        areaVisivel(gatilho),
        folga,
        afastamento,
      )
      if (ajuste.deslocamentoX !== 0) lista.style.transform = `translateX(${Math.round(ajuste.deslocamentoX)}px)`
      if (ajuste.alturaMaxima !== null) lista.style.maxHeight = `${ajuste.alturaMaxima}px`
      if (ajuste.lado === 'cima') {
        lista.style.top = 'auto'
        lista.style.bottom = '100%'
        lista.style.marginTop = '0'
        lista.style.marginBottom = `${afastamento}px`
      }
      setLado(ajuste.lado)
    }
    ajustar()
    window.addEventListener('resize', ajustar)
    // Rolar a própria lista não reposiciona nada.
    const aoRolar = (e: Event) => {
      if (e.target instanceof Node && listaRef.current?.contains(e.target)) return
      ajustar()
    }
    window.addEventListener('scroll', aoRolar, true)
    return () => {
      window.removeEventListener('resize', ajustar)
      window.removeEventListener('scroll', aoRolar, true)
    }
  }, [aberto, gatilhoRef, listaRef, folga, afastamento])

  return aberto ? lado : 'baixo'
}
