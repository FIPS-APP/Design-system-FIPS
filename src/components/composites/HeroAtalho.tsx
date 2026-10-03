import { useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  docHeaderNeuAccentBgHover,
  docHeaderNeuAccentBorderHover,
  docHeaderNeuAccentGloss,
  docHeaderNeuAccentIcon,
  docHeaderNeuAccentShadowHover,
  docHeaderNeuShimmerGradient,
  docHeaderNeuShimmerOnAccent,
} from '../../lib/docHeaderChrome'

export type HeroAtalhoVariante = 'ouro' | 'inverseOutline'

export interface HeroAtalhoProps {
  icon: LucideIcon
  label: string
  /** `ouro` para o atalho primário do hero (mesmo fill do Button ouro). Padrão `inverseOutline`. */
  variante?: HeroAtalhoVariante
  /** Com `href` vira `<a>`. Sem ele é `<button type="button">`. */
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

/**
 * Atalho do hero da Home. Parado mostra só o ícone, em 30px, no `inverseOutline`.
 * No hover ou no foco abre e mostra o nome dentro do botão, com o realce dos
 * azulejos do header.
 *
 * O nome fica no HTML, não num `title`: o balão do navegador demora e sai do
 * desenho. Quem abre é uma coluna de grade de `0fr` a `1fr`, porque largura
 * `auto` não tem transição. A caixa que corta não pode ter padding, senão o
 * botão fechado passa de 30px.
 */
const repousoInverse =
  'border-[1.5px] border-white/60 bg-white/[0.06] text-white'
const repousoOuro =
  'border-transparent bg-[var(--color-accent)] text-[var(--color-primary-hover)] shadow-[var(--shadow-card)]'

export function HeroAtalho({
  icon: Icone,
  label,
  variante = 'inverseOutline',
  href,
  onClick,
}: HeroAtalhoProps) {
  const [apontado, setApontado] = useState(false)
  const [focado, setFocado] = useState(false)
  const realcado = apontado || focado

  const style: CSSProperties = {
    ...(realcado && {
      borderColor: docHeaderNeuAccentBorderHover,
      background: docHeaderNeuAccentBgHover,
      boxShadow: docHeaderNeuAccentShadowHover,
      color: docHeaderNeuAccentIcon,
      transform: 'translateY(-1px)',
    }),
    paddingRight: realcado ? 9 : 6.5,
    transition: realcado ? 'all 0.3s ease' : 'all 0.25s ease',
  }

  const comum = {
    'aria-label': label,
    onClick,
    onMouseEnter: () => setApontado(true),
    onMouseLeave: () => setApontado(false),
    onFocus: () => setFocado(true),
    onBlur: () => setFocado(false),
    className: cn(
      'relative inline-flex h-[30px] cursor-pointer items-center justify-center overflow-hidden rounded-md pl-[6.5px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/40 active:scale-[0.97]',
      realcado ? 'border-[1.5px]' : variante === 'ouro' ? repousoOuro : repousoInverse,
    ),
    style,
  }

  const conteudo = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0.5 right-0.5 top-px h-[44%] rounded-[6px]"
        style={{ background: realcado ? docHeaderNeuAccentGloss : 'none' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: realcado ? docHeaderNeuShimmerOnAccent : docHeaderNeuShimmerGradient,
          transform: realcado ? 'translateX(0)' : 'translateX(-100%)',
          animation: realcado ? 'docsSidebarNeuShimmer 0.5s ease forwards' : 'none',
        }}
      />
      <Icone className="relative z-[1] h-3.5 w-3.5 shrink-0" aria-hidden />
      <span
        className="relative z-[1] grid"
        style={{
          gridTemplateColumns: realcado ? '1fr' : '0fr',
          transition: 'grid-template-columns 0.25s ease',
        }}
      >
        <span className="overflow-hidden" style={{ opacity: realcado ? 1 : 0, transition: 'opacity 0.2s ease' }}>
          <span className="block whitespace-nowrap pl-[7px] text-[12px] font-semibold leading-[1.2] tracking-[0.01em]">
            {label}
          </span>
        </span>
      </span>
    </>
  )

  return href ? (
    <a href={href} {...comum}>
      {conteudo}
    </a>
  ) : (
    <button type="button" {...comum}>
      {conteudo}
    </button>
  )
}

export interface HeroAtalhosProps {
  /** Nome da faixa para leitor de tela. */
  label?: string
  className?: string
  children: ReactNode
}

/** Faixa dos atalhos do hero, centralizada, com 8px entre eles. */
export function HeroAtalhos({ label = 'Atalhos', className, children }: HeroAtalhosProps) {
  return (
    <nav aria-label={label} className={cn('flex flex-wrap items-center justify-center gap-2 pt-1', className)}>
      {children}
    </nav>
  )
}
