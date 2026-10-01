import { useState, type MouseEvent } from 'react'
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
 * até outro assumir, e só sair da fileira volta ao repouso. Pelo teclado vale o
 * mesmo, pelo `relatedTarget` do blur: pular de um atalho para o vizinho com
 * Tab não pode piscar.
 *
 * A fileira é centrada. Como o atalho aberto é bem mais largo que o fechado,
 * os vizinhos andam quando o aberto muda, e o atalho apontado pode sair de baixo
 * do cursor parado. Ficou assim por decisão do padrão, igual ao Gestão OPA.
 */
export function HeroFileira({ atalhos, label = 'Atalhos', className }: HeroFileiraProps) {
  const [apontado, setApontado] = useState<string | null>(null)
  if (atalhos.length === 0) return null
  // Id que sumiu da lista (a lista mudou) cai no principal, em vez de deixar todos fechados.
  const aberto = atalhos.some((a) => a.id === apontado) ? apontado : atalhos[0].id

  return (
    <nav
      aria-label={label}
      className={cn('flex flex-wrap items-center justify-center gap-2 pt-1', className)}
      onMouseLeave={() => setApontado(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setApontado(null)
      }}
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
