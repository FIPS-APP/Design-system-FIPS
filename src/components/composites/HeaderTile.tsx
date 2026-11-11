import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface HeaderTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Ícone de 17px (traço 1.9). Sem ele, passe o próprio ícone em `children`. */
  icone?: LucideIcon
  /** Azulejo aceso (âmbar), como no hover. Para o botão que representa algo ligado. */
  ativo?: boolean
  /**
   * `sempre` (padrão) aparece em toda largura. `desktop` só a partir de 1024px (botão de recolher o
   * menu). `celular` só abaixo de 1024px (botão da gaveta). O display mora no CSS do DS, por media
   * query: o app não precisa de `hidden lg:grid`.
   */
  exibicao?: 'sempre' | 'desktop' | 'celular'
  children?: ReactNode
}

/**
 * Azulejo neumórfico do cabeçalho (36x36): repouso cinza claro (grafite no escuro), hover âmbar com
 * brilho que varre. É o botão de ícone de toda a barra de ações do `AppHeader`. Precisa de `aria-label`.
 *
 * @example
 * <HeaderTile icone={BookOpen} aria-label="Abrir procedimento" onClick={abrir} />
 */
export const HeaderTile = forwardRef<HTMLButtonElement, HeaderTileProps>(function HeaderTile(
  { icone: Icone, ativo, exibicao = 'sempre', className, children, type = 'button', ...resto },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-ativo={ativo ? 'true' : undefined}
      className={cn(
        'fips-header-tile',
        exibicao === 'desktop' && 'fips-header-tile--so-desktop',
        exibicao === 'celular' && 'fips-header-tile--so-mobile',
        className,
      )}
      {...resto}
    >
      {Icone ? <Icone className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden /> : null}
      {children}
    </button>
  )
})
