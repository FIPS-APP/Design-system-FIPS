import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export type BotaoIconeRotuloVariant = 'danger' | 'outline' | 'ghost'
export type BotaoIconeRotuloSize = 'iconSm' | 'icon'

export interface BotaoIconeRotuloProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: LucideIcon
  /** Nome da ação: aparece ao abrir e também é o `aria-label`. */
  label: string
  /** `danger` para exclusão. Padrão `outline`. */
  variant?: BotaoIconeRotuloVariant
  /** `iconSm` (30px, igual ao Button iconSm) ou `icon` (36px). Padrão `iconSm`. */
  size?: BotaoIconeRotuloSize
}

// Cada variante declara a borda de 1,5px no repouso: o preflight do Tailwind zera a borda
// de elemento sem largura e o botão fechado ficaria mais estreito que o aberto.
const VARIANTES: Record<BotaoIconeRotuloVariant, string> = {
  danger:
    'border-[var(--color-danger-text)] bg-transparent text-[var(--color-danger-text)] data-[state=open]:border-[var(--color-btn-danger-hover)] data-[state=open]:bg-[var(--color-btn-danger-hover)] data-[state=open]:text-white',
  outline:
    'border-[var(--color-primary-text)] bg-transparent text-[var(--color-primary-text)] data-[state=open]:bg-[var(--color-fips-blue-200)] dark:data-[state=open]:bg-[var(--color-primary-text)]/15',
  ghost:
    'border-transparent bg-transparent text-[var(--color-fg-muted)] data-[state=open]:bg-[var(--color-fips-blue-200)]/50 dark:data-[state=open]:bg-[var(--color-primary-text)]/12',
}

// `min-w` fecha o botão em 30px mesmo quando a tela arredonda a borda de 1,5px para 1px.
// Padding à esquerda centra o ícone de 14px no botão fechado: (altura - 2 bordas - 14) / 2.
const TAMANHOS: Record<BotaoIconeRotuloSize, string> = {
  iconSm: 'h-[30px] min-h-[30px] min-w-[30px] pl-[6.5px] pr-[6.5px] data-[state=open]:pr-[9px]',
  icon: 'h-9 min-h-9 min-w-9 pl-[9.5px] pr-[9.5px] data-[state=open]:pr-3',
}

/** `:focus-visible` só no teclado: clicar com o mouse não deixa o rótulo preso aberto. */
function focoDeTeclado(alvo: HTMLElement): boolean {
  try {
    return alvo.matches(':focus-visible')
  } catch {
    return true
  }
}

/**
 * Botão de ação só com ícone no repouso (30px). No hover ou no foco do teclado abre e mostra o
 * nome ao lado do ícone. `danger` pinta de vermelho, para exclusão.
 *
 * O nome fica no HTML e no `aria-label`, não num `title`: o balão do navegador demora e sai do
 * desenho. Quem abre é uma coluna de grade de `0fr` a `1fr`, porque largura `auto` não tem
 * transição. No toque não há hover: o leitor de tela e o clique seguem iguais, só o rótulo não
 * aparece. Desabilitado não abre.
 */
const BotaoIconeRotulo = React.forwardRef<HTMLButtonElement, BotaoIconeRotuloProps>(
  (
    {
      icon: Icone,
      label,
      variant = 'outline',
      size = 'iconSm',
      className,
      disabled,
      type = 'button',
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [apontado, setApontado] = React.useState(false)
    const [focado, setFocado] = React.useState(false)
    const aberto = !disabled && (apontado || focado)

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        {...props}
        aria-label={label}
        data-state={aberto ? 'open' : 'closed'}
        onMouseEnter={(e) => {
          setApontado(true)
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setApontado(false)
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          if (focoDeTeclado(e.currentTarget)) setFocado(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocado(false)
          onBlur?.(e)
        }}
        className={cn(
          'group/bir inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-[1.5px] text-[12px] font-semibold tracking-[0.01em] transition-[background-color,border-color,color,padding-right] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.97] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
          VARIANTES[variant],
          TAMANHOS[size],
          className,
        )}
      >
        <Icone aria-hidden />
        <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-[250ms] ease-out group-data-[state=open]/bir:grid-cols-[1fr] motion-reduce:transition-none">
          <span className="overflow-hidden opacity-0 transition-opacity duration-200 group-data-[state=open]/bir:opacity-100 motion-reduce:transition-none">
            <span className="block whitespace-nowrap pl-[7px] leading-[1.2]">{label}</span>
          </span>
        </span>
      </button>
    )
  },
)
BotaoIconeRotulo.displayName = 'BotaoIconeRotulo'

export { BotaoIconeRotulo }
