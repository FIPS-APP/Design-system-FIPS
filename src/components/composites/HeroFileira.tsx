import { useRef, useState, type FocusEvent, type MouseEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { HeroAtalho, type HeroAtalhoVariante } from './HeroAtalho'

export interface HeroFileiraAtalho {
  /** Único na fileira. */
  id: string
  icon: LucideIcon
  label: string
  /** Repassado ao HeroAtalho. Use `ouro` no primário visual (ex. Facilities). */
  variante?: HeroAtalhoVariante
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export interface HeroFileiraProps {
  atalhos: HeroFileiraAtalho[]
  /** Nome da faixa para leitor de tela. */
  label?: string
  className?: string
}

/**
 * Fileira de atalhos do hero. Um aberto por vez, e o primeiro é o principal:
 * fica aberto no repouso, explica a fileira inteira e serve de chamada.
 *
 * O estado mora AQUI, e o "saiu" também. Com o `onMouseLeave` em cada atalho,
 * o vão de 8px entre eles zera o estado por um quadro e o principal reabre no
 * meio do caminho: atravessar a fileira pisca. Aqui o último apontado segura
 * até outro assumir, e só sair da fileira volta ao repouso. Se o teclado ainda
 * está num atalho, sair com o mouse não derruba esse foco: o aberto volta para
 * o atalho focado, não para o principal. Pelo teclado, o blur olha o
 * `relatedTarget`. No Safari esse alvo vem nulo mesmo no Tab entre irmãos, então
 * a fileira espera um instante e lê o foco real antes de voltar ao repouso.
 *
 * A fileira é centrada. Como o atalho aberto é bem mais largo que o fechado,
 * os vizinhos andam quando o aberto muda, e o atalho apontado pode sair de baixo
 * do cursor parado. Ficou assim por decisão do padrão, igual ao Gestão OPA.
 */
function idSobFoco(nav: HTMLElement, ids: string[]): string | null {
  const ativo = document.activeElement
  if (!(ativo instanceof HTMLElement) || !nav.contains(ativo)) return null
  const botoes = [...nav.querySelectorAll<HTMLElement>('a,button')]
  const i = botoes.indexOf(ativo)
  return i >= 0 ? ids[i] ?? null : null
}

export function HeroFileira({ atalhos, label = 'Atalhos', className }: HeroFileiraProps) {
  const [apontado, setApontado] = useState<string | null>(null)
  const esperaFoco = useRef<number | null>(null)
  if (atalhos.length === 0) return null
  // Id que sumiu da lista (a lista mudou) cai no principal, em vez de deixar todos fechados.
  const aberto = atalhos.some((a) => a.id === apontado) ? apontado : atalhos[0].id
  const ids = atalhos.map((a) => a.id)

  function soltarEspera() {
    if (esperaFoco.current !== null) {
      window.clearTimeout(esperaFoco.current)
      esperaFoco.current = null
    }
  }

  function voltarAoFocoOuRepouso(nav: HTMLElement) {
    setApontado(idSobFoco(nav, ids))
  }

  function aoSairComMouse(e: MouseEvent<HTMLElement>) {
    soltarEspera()
    voltarAoFocoOuRepouso(e.currentTarget)
  }

  function aoDesfocar(e: FocusEvent<HTMLElement>) {
    const nav = e.currentTarget
    const proximo = e.relatedTarget
    if (proximo instanceof Node && nav.contains(proximo)) return
    soltarEspera()
    // Safari entrega relatedTarget nulo quando o Tab só troca de atalho.
    esperaFoco.current = window.setTimeout(() => {
      esperaFoco.current = null
      voltarAoFocoOuRepouso(nav)
    }, 0)
  }

  return (
    <nav
      aria-label={label}
      className={cn('flex flex-wrap items-center justify-center gap-2 pt-1', className)}
      onMouseLeave={aoSairComMouse}
      onBlur={aoDesfocar}
    >
      {atalhos.map((a) => (
        <HeroAtalho
          key={a.id}
          icon={a.icon}
          label={a.label}
          variante={a.variante}
          href={a.href}
          onClick={a.onClick}
          aberto={a.id === aberto}
          aoApontar={() => setApontado(a.id)}
        />
      ))}
    </nav>
  )
}
