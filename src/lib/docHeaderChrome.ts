/**
 * Cromia do header da documentação — estilo Tecnopano (toolbar claro/escuro, neumorphic, shimmer).
 * Paleta FIPS: azul #002A68, amarelo #F6921E.
 */

import type { CSSProperties } from 'react'

/** Painel vidro sobre `#1A1A1A` — faixa de tabs (dark), barra de filtros e KPIs no dashboard. */
export const shellDarkGlassPanel: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
}

export const docHeaderShellBorder = ''

/** Lavagem sobre a arte (silhueta) — claro. */
export const docHeaderArtWash =
  'bg-[linear-gradient(135deg,rgba(245,245,245,0.94)_0%,rgba(255,255,255,0.88)_44%,rgba(235,235,235,0.96)_100%)]'

/** Profundidade / vinheta. */
export const docHeaderArtDepth =
  'bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.5),transparent_48%),radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.06),transparent_40%)]'

export const docHeaderBarSurface = 'bg-[var(--color-surface-soft)]'

/** Primeira faixa (toolbar): trilho, busca, ações — cinza claro como Tecnopano. */
export const docHeaderBarTop = `border-b border-[var(--color-border)] ${docHeaderBarSurface}`

/** Superfície clara da faixa de abas. */
export const docHeaderTabsSurface = 'bg-[var(--color-surface)]'

/** Faixa das abas de secção. */
export const docHeaderBarTabs = `${docHeaderTabsSurface} pt-0 pb-0`

/** Separador sob o `nav` de abas. */
export const docHeaderTabsNavSeparatorClass = 'border-b-2 border-[var(--color-border)]'

/* ─── Neumorphic: azulejo claro (repouso na faixa #f5f5f5 — mesmo padrão Tecnopano) ─── */
export const docHeaderNeuLightBorderIdle = 'rgba(0,0,0,0.10)'
export const docHeaderNeuLightBgIdle =
  'linear-gradient(145deg, #ffffff 0%, #ebebeb 55%, #e0e0e0 100%)'
export const docHeaderNeuLightShadowIdle =
  '0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)'
export const docHeaderNeuLightIconIdle = 'rgba(55,55,55,0.82)'

/* ─── Neumorphic: hover/active amarelo FIPS — wash pastel, não bloco sólido ─── */
export const docHeaderNeuAccentBorderHover = 'rgba(246,146,30,0.45)'
export const docHeaderNeuAccentBgHover = 'linear-gradient(145deg, #fffaf0 0%, #ffe4b8 100%)'
export const docHeaderNeuAccentShadowHover =
  '0 4px 14px rgba(246,146,30,0.22), 0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)'
export const docHeaderNeuAccentIcon = '#002A68'

/* ─── Neumorphic: faixa escura (repouso) ─── */
export const docHeaderNeuDarkBorderIdle = '#3f3f46'
export const docHeaderNeuDarkBgIdle =
  'linear-gradient(160deg, #303036 0%, #222226 55%, #1c1c20 100%)'
export const docHeaderNeuDarkShadowIdle =
  '0 3px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.45) inset'
export const docHeaderNeuDarkIconIdle = '#a1a1aa'

/** Shimmer translúcido (sweep). */
export const docHeaderNeuShimmerGradient =
  'linear-gradient(135deg,transparent,rgba(255,255,255,0.25) 50%,transparent)'
/** Sobre hover amarelo — mais visível. */
export const docHeaderNeuShimmerOnAccent =
  'linear-gradient(135deg,transparent,rgba(255,255,255,0.38) 50%,transparent)'

export const docHeaderTabsUnderlineMd = {
  fontSizePx: 13,
  paddingXPx: 24,
  paddingYPx: 8,
  navHeightPx: 39,
  iconGapPx: 7,
  iconSizePx: 14,
  indicatorHeightPx: 3,
  borderBottomPx: 2,
  activeFontWeight: 600,
  inactiveFontWeight: 400,
  transitionMs: 200,
  indicatorTransition: 'left .3s cubic-bezier(.4,0,.2,1), width .3s cubic-bezier(.4,0,.2,1)',
  accentHex: '#F6921E',
  activeTextOnLightHex: '#002A68',
  mutedOnLightHex: '#7B8C96',
  hoverTextOnLightHex: '#333B41',
  separatorOnLightHex: '#E2E8F0',
} as const

/** Input de busca no header claro. */
export const docHeaderSearchInputLightClass =
  'h-[35px] w-full rounded-lg border border-[var(--color-border)]/60 bg-[var(--color-surface)] py-0 pl-9 pr-3 font-sans text-[13px] leading-normal text-[var(--color-fg)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:border-[var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/20 focus-visible:ring-offset-0'
