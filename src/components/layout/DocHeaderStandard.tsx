import type { ReactNode } from 'react'
import { Bell, GraduationCap, Menu, PanelLeft } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  docHeaderArtDepth,
  docHeaderArtWash,
  docHeaderBarTabs,
  docHeaderBarTop,
  docHeaderShellBorder,
} from '../../lib/docHeaderChrome'
import { SHELL_HERO_ART_SRC } from '../../lib/shellHeroArt'
import { Button } from '../ui/button'
import { DocHeaderNeuIconButton } from './DocHeaderNeuIconButton'

export { DocHeaderNeuIconButton } from './DocHeaderNeuIconButton'
import { DocHeaderPageTrail } from './DocHeaderPageTrail'
import { UserChip } from './UserChip'

/** Camada de arte + gradientes (light mode — hero com lavagem clara). */
export function DocHeaderHeroBackground({ src = SHELL_HERO_ART_SRC }: { src?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover object-[center_65%] opacity-[0.20]"
        draggable={false}
      />
      <div className={cn('absolute inset-0', docHeaderArtWash)} />
      <div className={cn('absolute inset-0', docHeaderArtDepth)} />
    </div>
  )
}

/** Camada dark mode — fundo #1A1A1A com sutil gradiente superior. */
export function DocHeaderDarkBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-0 bg-[#1A1A1A]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
    </div>
  )
}

export type DocHeaderStandardPreviewProps = {
  groupLabel: string
  pageTitle: string
  sectionNav: ReactNode
  footer?: ReactNode
  withCardChrome?: boolean
  dark?: boolean
}

/**
 * Header padrão da documentação — estilo Tecnopano (toolbar claro/escuro, neumorphic, shimmer).
 */
export function DocHeaderStandardPreview({
  groupLabel,
  pageTitle,
  sectionNav,
  footer = (
    <div className="px-4 py-3 text-xs text-[var(--color-fg-muted)] sm:px-6">Área de conteúdo (exemplo)</div>
  ),
  withCardChrome = true,
  dark = false,
}: DocHeaderStandardPreviewProps) {
  const inner = (
    <header
      className={cn(
        'relative overflow-hidden',
        docHeaderShellBorder,
        !dark && 'shadow-[0_1px_0_rgba(0,0,0,0.06)]',
        dark && 'shadow-[0_1px_0_rgba(0,0,0,0.35)]',
      )}
    >
      {!dark ? (
        <DocHeaderHeroBackground />
      ) : (
        <DocHeaderDarkBackground />
      )}

      <div
        className={cn(
          'relative z-10',
          dark
            ? 'border-b border-white/[0.08] bg-[#1A1A1A]'
            : docHeaderBarTop,
        )}
      >
        <div className="flex items-center gap-3 py-3 pr-3 pl-4 sm:pr-5 sm:pl-6">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className={cn(
              'lg:hidden',
              dark
                ? 'border border-[#3F3F46] bg-[#27272A] text-[#E2E2E8] hover:bg-[#323236]'
                : 'border border-black/[0.10] bg-white/90 text-neutral-800 hover:bg-white',
            )}
            aria-label="Abrir menu (demo)"
            tabIndex={0}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <DocHeaderNeuIconButton ariaLabel="Recolher menu lateral" dark={dark} className="hidden sm:inline-flex">
              <PanelLeft className="h-[17px] w-[17px]" aria-hidden strokeWidth={1.9} />
            </DocHeaderNeuIconButton>
            <DocHeaderPageTrail groupLabel={groupLabel} pageTitle={pageTitle} dark={dark} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex shrink-0 items-center gap-2">
              <DocHeaderNeuIconButton ariaLabel="Notificações" dark={dark}>
                <Bell className="h-[17px] w-[17px]" aria-hidden strokeWidth={1.9} />
              </DocHeaderNeuIconButton>
              <DocHeaderNeuIconButton ariaLabel="Tutorial" dark={dark}>
                <GraduationCap className="h-[17px] w-[17px]" aria-hidden strokeWidth={1.9} />
              </DocHeaderNeuIconButton>
            </div>
            <div
              className={cn('mx-0.5 hidden h-6 w-px shrink-0 sm:block', dark ? 'bg-[#52525B]' : 'bg-neutral-300')}
            />
            <UserChip variant="docHeader" dark={dark} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'relative z-10 hidden lg:block',
          dark ? '!bg-transparent' : docHeaderBarTabs,
        )}
      >
        {sectionNav}
      </div>
    </header>
  )

  if (!withCardChrome) {
    return (
      <>
        {inner}
        {footer}
      </>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-sm">
      {inner}
      {footer}
    </div>
  )
}
