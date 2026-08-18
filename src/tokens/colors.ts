/**
 * Paleta oficial FIPS extraída do Brandbook (cores primárias, secundárias e neutros).
 *
 * Os valores NÃO moram aqui: este módulo é uma vista com os nomes do Brandbook
 * sobre `theme.ts`, que é a fonte da verdade e também gera o CSS. Alterar cor =
 * alterar `theme.ts` + `npm run tokens:build`.
 */
import { themeTokens, light, dark } from './theme'

export const fipsPalette = {
  azulProfundo: themeTokens['--color-fips-blue-900'],
  azulProfundoDark: themeTokens['--color-fips-blue-950'],
  cinzaChumbo: themeTokens['--color-fips-gray-900'],
  cinzaMetal: themeTokens['--color-fips-gray-400'],
  azulIntermediario: themeTokens['--color-fips-blue-700'],
  azulCeuClaro: themeTokens['--color-fips-blue-200'],
  amareloPastel: themeTokens['--color-fips-yellow-100'],
  azulCeu: themeTokens['--color-fips-blue-400'],
  azulCeuProfundo: themeTokens['--color-fips-sky-600'],
  amareloOuro: themeTokens['--color-fips-yellow-400'],
  amareloOuroEscuro: themeTokens['--color-fips-yellow-600'],
  verdeClaro: themeTokens['--color-fips-green-300'],
  verdeFloresta: themeTokens['--color-fips-green-500'],
  verdeFlorestaEscuro: themeTokens['--color-fips-green-700'],
  branco: themeTokens['--color-fips-white'],
  neutroClaro: themeTokens['--color-fips-neutral-100'],
} as const

export type FipsPaletteKey = keyof typeof fipsPalette

/**
 * Tokens semânticos para UI de produto e documentação.
 * Espelham 1:1 as custom properties do tema claro — se o valor mudar no CSS,
 * muda aqui junto, porque a origem é a mesma.
 */
export const semanticColors = {
  primary: light('--color-primary'),
  primaryHover: light('--color-primary-hover'),
  secondary: light('--color-secondary'),
  accent: light('--color-accent'),
  accentStrong: light('--color-accent-strong'),
  success: light('--color-success'),
  successStrong: light('--color-success-strong'),
  info: themeTokens['--color-fips-blue-400'],
  surface: light('--color-surface'),
  surfaceMuted: light('--color-surface-muted'),
  border: light('--color-border'),
  foreground: light('--color-fg'),
  foregroundMuted: light('--color-fg-muted'),
  sidebar: light('--color-sidebar'),
  sidebarMuted: light('--color-sidebar-deep'),
} as const

/** Tokens semânticos do dark mode — mesma origem, tema `.dark`. */
export const darkSemanticColors = {
  surface: dark('--color-surface'),
  surfaceSoft: dark('--color-surface-soft'),
  surfaceMuted: dark('--color-surface-muted'),
  border: dark('--color-border'),
  borderStrong: dark('--color-border-strong'),
  foreground: dark('--color-fg'),
  foregroundMuted: dark('--color-fg-muted'),
  primary: dark('--color-gov-azul-profundo'),
  primaryHover: dark('--color-gov-azul-escuro'),
  secondary: dark('--color-secondary'),
  accent: dark('--color-accent'),
  accentStrong: dark('--color-accent-strong'),
  success: dark('--color-semantic-sucesso-fg'),
  successStrong: dark('--color-success'),
  danger: dark('--color-semantic-critico-fg'),
  info: dark('--color-semantic-info-fg'),
  warning: dark('--color-warning'),
  sidebar: dark('--color-surface-muted'),
  sidebarDeep: dark('--color-sidebar-deep'),
  sidebarSoft: dark('--color-surface'),
  inputBorder: dark('--color-border-strong'),
  inputBorderHover: dark('--color-input-border-hover'),
  inputBorderFocus: dark('--color-gov-azul-claro'),
  inputBg: dark('--color-surface-soft'),
  badgeSuccessBg: dark('--color-semantic-sucesso-bg'),
  badgeWarningBg: dark('--color-badge-warning-bg'),
  badgeDangerBg: dark('--color-badge-danger-bg'),
  badgeInfoBg: dark('--color-semantic-info-bg'),
} as const
