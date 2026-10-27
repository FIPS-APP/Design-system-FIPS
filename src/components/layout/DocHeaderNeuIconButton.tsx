import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import {
  docHeaderNeuAccentBgHover,
  docHeaderNeuAccentBorderHover,
  docHeaderNeuAccentIcon,
  docHeaderNeuAccentShadowHover,
  docHeaderNeuDarkBgIdle,
  docHeaderNeuDarkBorderIdle,
  docHeaderNeuDarkIconIdle,
  docHeaderNeuDarkShadowIdle,
  docHeaderNeuLightBgIdle,
  docHeaderNeuLightBorderIdle,
  docHeaderNeuLightIconIdle,
  docHeaderNeuLightShadowIdle,
  docHeaderNeuShimmerGradient,
  docHeaderNeuShimmerOnAccent,
} from '../../lib/docHeaderChrome'

export type DocHeaderNeuIconButtonProps = {
  children: ReactNode
  ariaLabel: string
  dark?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'aria-label' | 'children'>

/**
 * Botão de ícone 36×36 — azulejos neumorphic (claro/escuro + hover amarelo FIPS + shimmer).
 */
export function DocHeaderNeuIconButton({
  children,
  ariaLabel,
  className,
  dark = false,
  ...rest
}: DocHeaderNeuIconButtonProps) {
  const [hovered, setHovered] = useState(false)

  const borderIdle = dark ? docHeaderNeuDarkBorderIdle : docHeaderNeuLightBorderIdle
  const bgIdle = dark ? docHeaderNeuDarkBgIdle : docHeaderNeuLightBgIdle
  const shadowIdle = dark ? docHeaderNeuDarkShadowIdle : docHeaderNeuLightShadowIdle
  const iconIdle = dark ? docHeaderNeuDarkIconIdle : docHeaderNeuLightIconIdle

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]',
        className,
      )}
      {...rest}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${hovered ? docHeaderNeuAccentBorderHover : borderIdle}`,
        background: hovered ? docHeaderNeuAccentBgHover : bgIdle,
        boxShadow: hovered ? docHeaderNeuAccentShadowHover : shadowIdle,
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: hovered ? 'all 0.3s ease' : 'all 0.25s ease',
        color: hovered ? docHeaderNeuAccentIcon : iconIdle,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'absolute',
          top: 1,
          left: 2,
          right: 2,
          height: '44%',
          borderRadius: 8,
          background: hovered
            ? 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.02))'
            : 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? docHeaderNeuShimmerOnAccent : docHeaderNeuShimmerGradient,
          transform: hovered ? 'translateX(0)' : 'translateX(-100%)',
          animation: hovered ? 'docsSidebarNeuShimmer 0.5s ease forwards' : 'none',
          pointerEvents: 'none',
        }}
      />
      <div className="relative z-[1] flex items-center justify-center">{children}</div>
    </button>
  )
}
