import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { BannerJunctionLines, FIPS_BANNER_PAGE_CLASS } from '../components/composites/banner-shared'

/** Arte de trem/fundo usada nos produtos FIPS (public/). */
export const PAGE_HERO_DEFAULT_DECORATION = '/backgrounds/app-shell-home-trains.png'

export type PageHeroProps = {
  children: ReactNode
  className?: string
  /**
   * Imagem sutil à direita (trem / infra). Padrão: trilho do DS.
   * Passe string vazia para desativar e usar só o SVG geométrico.
   */
  decorationSrc?: string | null
  /** Silhueta SVG leve (fallback ou reforço). Por padrão fica desligada se houver foto. */
  showTrainSilhouette?: boolean
  /** Faixa reduzida com cantos arredondados — para painel embutido em vez de full-bleed. */
  compact?: boolean
}

/**
 * Faixa hero **full-bleed** dos produtos FIPS: gradiente do Banner de Página
 * (`--fips-banner-page-bg`, que já resolve claro/escuro) + trilhos de junção + foto sutil à direita.
 *
 * Use em páginas de visão geral e edição que pedem faixa alta. Para cabeçalho de tela operacional,
 * o padrão é o `PageHeader` (Banner de Conteúdo); para a Home, o hero com foto + overlay azul.
 *
 * O padding é do componente (`compact` reduz) — não embrulhe os filhos em outro `px/py`.
 */
export function PageHero({
  children,
  className,
  decorationSrc = PAGE_HERO_DEFAULT_DECORATION,
  showTrainSilhouette,
  compact = false,
}: PageHeroProps) {
  const hasPhoto = Boolean(decorationSrc)
  const showSvg = showTrainSilhouette ?? !hasPhoto

  return (
    <section
      className={cn(
        'relative isolate min-h-[200px] overflow-hidden text-white',
        compact && 'rounded-2xl',
        className,
      )}
    >
      <div className={cn('absolute inset-0', FIPS_BANNER_PAGE_CLASS)} aria-hidden />

      <BannerJunctionLines
        style={{ position: 'absolute', top: -10, right: -20, width: 400, height: 250 }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-white/[0.03]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
        aria-hidden
      />

      {hasPhoto ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[min(65vw,580px)] opacity-[0.22] mix-blend-soft-light sm:opacity-[0.28]"
          aria-hidden
        >
          <img
            src={decorationSrc!}
            alt=""
            className="h-full w-full object-cover object-right"
            decoding="async"
          />
        </div>
      ) : null}

      {showSvg ? (
        <div
          className="pointer-events-none absolute -right-4 bottom-0 top-8 w-[min(70vw,640px)] opacity-[0.1] sm:opacity-[0.12]"
          aria-hidden
        >
          <img
            src="/brand/hero-train-silhouette.svg"
            alt=""
            className="h-full w-full object-contain object-right-bottom"
            decoding="async"
          />
        </div>
      ) : null}

      <div
        className={cn(
          'relative z-10',
          compact ? 'px-6 py-6 md:px-8 md:py-8' : 'px-8 py-10 md:px-10 md:py-12',
        )}
      >
        {children}
      </div>
    </section>
  )
}
