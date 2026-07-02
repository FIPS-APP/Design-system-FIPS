import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  docHeaderNeuAccentBgHover,
  docHeaderNeuAccentBorderHover,
  docHeaderNeuAccentIcon,
  docHeaderNeuAccentShadowHover,
  docHeaderNeuDarkBgIdle,
  docHeaderNeuDarkBorderIdle,
  docHeaderNeuDarkShadowIdle,
  docHeaderNeuLightBgIdle,
  docHeaderNeuLightBorderIdle,
  docHeaderNeuLightShadowIdle,
  docHeaderNeuShimmerGradient,
  docHeaderNeuShimmerOnAccent,
} from '../../lib/docHeaderChrome'
import { DEFAULT_FIPS_USER_ID, FIPS_ROLE_COLOR, FIPS_ROLE_LABEL, fipsUserById, fipsUserInitials } from '../../docs/data/users'
import { UserAccountMenu } from './UserAccountMenu'

export type UserChipProps = {
  compact?: boolean
  variant?: 'shell' | 'docHeader' | 'docs'
  dark?: boolean
  name?: string
  initials?: string
  className?: string
}

/** Chip de usuário neumorphic — mesmo estilo dos azulejos da sidebar/botões do header (shimmer no hover). */
export function UserChip({
  compact = false,
  variant = 'docs',
  dark = false,
  name = 'Fipinho Santista',
  initials = 'FS',
  className,
}: UserChipProps) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeUserId, setActiveUserId] = useState(DEFAULT_FIPS_USER_ID)

  if (variant === 'docHeader') {
    const idleBg = dark ? docHeaderNeuDarkBgIdle : docHeaderNeuLightBgIdle
    const idleBorder = dark ? docHeaderNeuDarkBorderIdle : docHeaderNeuLightBorderIdle
    const idleShadow = dark ? docHeaderNeuDarkShadowIdle : docHeaderNeuLightShadowIdle
    const activeUser = fipsUserById(activeUserId)

    return (
      <UserAccountMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        activeUserId={activeUserId}
        onActiveUserChange={setActiveUserId}
        trigger={
          <button
            type="button"
            aria-label={`Conta: ${activeUser.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              'relative flex h-[35px] max-w-[220px] items-center gap-2 overflow-hidden rounded-full px-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/25 focus-visible:ring-offset-0 sm:px-2.5 sm:backdrop-blur-sm',
              'sm:border sm:[border-color:var(--user-chip-border)] sm:[background:var(--user-chip-bg)] sm:[box-shadow:var(--user-chip-shadow)]',
              className,
            )}
            style={
              {
                '--user-chip-border': hovered ? docHeaderNeuAccentBorderHover : idleBorder,
                '--user-chip-bg': hovered ? docHeaderNeuAccentBgHover : idleBg,
                '--user-chip-shadow': hovered ? docHeaderNeuAccentShadowHover : idleShadow,
                transform: hovered ? 'translateY(-1px)' : 'none',
                transition: hovered ? 'all 0.3s ease' : 'all 0.25s ease',
              } as React.CSSProperties
            }
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className="pointer-events-none absolute inset-0 hidden rounded-full sm:block"
              style={{
                background: hovered ? docHeaderNeuShimmerOnAccent : docHeaderNeuShimmerGradient,
                transform: hovered ? 'translateX(0)' : 'translateX(-100%)',
                animation: hovered ? 'docsSidebarNeuShimmer 0.5s ease forwards' : 'none',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute hidden sm:block"
              style={{
                top: 1,
                left: 10,
                right: 10,
                height: '42%',
                borderRadius: 9999,
                background: hovered
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.02))'
                  : 'none',
              }}
              aria-hidden
            />
            <span
              className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]"
              style={{ background: FIPS_ROLE_COLOR[activeUser.role] }}
            >
              {fipsUserInitials(activeUser.name)}
            </span>
            <span className="relative z-[1] hidden min-w-0 flex-1 flex-col text-left sm:flex">
              <span
                className={cn(
                  'truncate font-sans text-[12px] leading-[1.2] font-semibold',
                  !hovered && (dark ? 'text-[#E2E2E8]' : 'text-[var(--color-fg)]'),
                )}
                style={hovered ? { color: docHeaderNeuAccentIcon } : undefined}
              >
                {activeUser.name}
              </span>
              <span
                className="truncate text-[9px] leading-[1.2] font-semibold tracking-[0.04em] uppercase"
                style={{ color: hovered ? docHeaderNeuAccentIcon : FIPS_ROLE_COLOR[activeUser.role] }}
              >
                {FIPS_ROLE_LABEL[activeUser.role]}
              </span>
            </span>
            <ChevronDown
              className={cn(
                'relative z-[1] hidden h-3.5 w-3.5 shrink-0 transition-transform duration-200 sm:block',
                !hovered && (dark ? 'text-[#A1A1AA]' : 'text-[var(--color-fg-muted)]'),
                menuOpen && 'rotate-180',
              )}
              style={hovered ? { color: docHeaderNeuAccentIcon } : undefined}
              strokeWidth={1.5}
              aria-hidden
            />
          </button>
        }
      />
    )
  }

  /* shell / docs fallback */
  const layout = cn(
    'flex items-center rounded-full border-[1.5px]',
    compact ? 'h-[30px] gap-1.5 px-2' : 'h-[35px] gap-2 px-2.5',
  )
  const shellClassicSkin =
    'border-white/[0.12] bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm'
  const docsSkin =
    'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] shadow-[0_1px_2px_rgba(3,15,40,0.06)]'

  return (
    <div
      className={cn(layout, variant === 'docs' ? docsSkin : shellClassicSkin, className)}
      aria-label={`Conta: ${name}`}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-semibold',
          compact ? 'h-6 w-6 text-[11px]' : 'h-7 w-7 text-[12px]',
          variant === 'docs' ? 'bg-[var(--color-secondary)] text-white' : 'bg-white text-[var(--color-primary)]',
        )}
      >
        {initials}
      </span>
      {!compact ? (
        <span
          className={cn(
            'truncate font-sans text-[13px] leading-none',
            variant === 'docs' ? 'text-[var(--color-fg)]' : 'text-white/[0.82]',
          )}
        >
          {name}
        </span>
      ) : null}
      <ChevronDown
        className={cn(
          'shrink-0',
          compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
          variant === 'docs' ? 'text-[var(--color-fg-muted)]' : 'text-white/[0.65]',
        )}
        aria-hidden
      />
    </div>
  )
}
