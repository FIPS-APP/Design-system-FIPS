import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export type PageHeroProps = {
  children: ReactNode
  className?: string
}

/**
 * Faixa hero padrão dos módulos FIPS: gradiente azul institucional, e só.
 *
 * A arte de trem que vivia aqui saiu em 21/09/2026, por decisão do dono, depois
 * de ser recusada em tela nas duas formas que este componente oferecia:
 *
 * - a foto (`app-shell-home-trains.png`) entrava só na faixa direita,
 *   `min(65vw, 580px)` com `object-right`. Num hero de 200px isso lê como
 *   textura; num hero baixo, de celular, a borda esquerda da foto vira uma
 *   emenda reta no meio do gradiente;
 * - a silhueta SVG, no lugar dela, lê como um vulto chapado no canto.
 *
 * Quem precisar de arte no topo desenha no `children`, onde dá para controlar
 * recorte e altura. O hero entrega o fundo, não a ilustração.
 */
export function PageHero({ children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate min-h-[200px] overflow-hidden text-white',
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#031a3d] via-[var(--color-fips-blue-900)] to-[#1b6fd4] dark:bg-[#333B41] dark:bg-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-white/[0.03]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10">{children}</div>
    </section>
  )
}
