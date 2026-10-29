/**
 * Paleta oficial FIPS extraída do Brandbook (cores primárias, secundárias e neutros).
 * Valores em hex para uso em CSS/TS; alinhar alterações ao PDF de marca.
 */
export const fipsPalette = {
  azulProfundo: '#004B9B',
  azulProfundoDark: '#002A68',
  cinzaChumbo: '#333B41',
  cinzaMetal: '#C0CCD2',
  azulIntermediario: '#658EC9',
  azulCeuClaro: '#D3E3F4',
  amareloPastel: '#FFE4B8',
  azulCeu: '#93BDE4',
  azulCeuProfundo: '#0090D0',
  amareloOuro: '#FDC24E',
  amareloOuroEscuro: '#F6921E',
  verdeClaro: '#8BE5AD',
  verdeFloresta: '#00C64C',
  verdeFlorestaEscuro: '#00904C',
  branco: '#FFFFFF',
  neutroClaro: '#E8EBFF',
} as const

export type FipsPaletteKey = keyof typeof fipsPalette

/** Tokens semânticos para UI de produto e documentação */
export const semanticColors = {
  primary: fipsPalette.azulProfundo,
  primaryHover: fipsPalette.azulProfundoDark,
  secondary: fipsPalette.azulCeuProfundo,
  accent: fipsPalette.amareloOuro,
  accentStrong: fipsPalette.amareloOuroEscuro,
  success: fipsPalette.verdeFloresta,
  successStrong: fipsPalette.verdeFlorestaEscuro,
  dangerStrong: '#B91C1C',
  info: fipsPalette.azulCeu,
  surface: fipsPalette.branco,
  surfaceMuted: fipsPalette.neutroClaro,
  border: fipsPalette.cinzaMetal,
  foreground: fipsPalette.cinzaChumbo,
  foregroundMuted: '#4b5563',
  /** Borda de campo. No claro é a mesma do divisor. */
  borderControl: fipsPalette.cinzaMetal,
  /** Texto e contorno de ação. */
  primaryText: fipsPalette.azulProfundo,
  /** Alias de dangerStrong: texto vermelho pequeno, 6,47:1 sobre branco. */
  dangerText: '#B91C1C',
  /** Verde de fundo com texto branco. */
  successFill: fipsPalette.verdeFlorestaEscuro,
  /** Cinza de fundo com texto branco: o mesmo valor do --color-fg-muted no claro (5,05:1 com texto branco). */
  neutralFill: '#64707D',
  sidebar: fipsPalette.azulProfundo,
  sidebarMuted: fipsPalette.azulProfundoDark,
} as const

/**
 * Tokens semânticos para dark mode.
 * Mapeia cada token do light mode para o valor equivalente no tema escuro.
 */
export const darkSemanticColors = {
  surface: '#1A1A1A',
  surfaceSoft: '#1F1F1F',
  surfaceMuted: '#252525',
  border: '#2E2E2E',
  borderStrong: '#3a3a3a',
  foreground: '#E8E8E8',
  foregroundMuted: '#9CA3AF',
  /** Campo, select, textarea e gatilho de campo. 3,03:1 sobre o cartão. */
  borderControl: '#666666',
  /** Texto e contorno de ação. 8,82:1 sobre o cartão. */
  primaryText: '#93BDE4',
  /** Alias de dangerStrong: texto vermelho pequeno, 9,17:1 sobre o cartão. */
  dangerText: '#FCA5A5',
  /** Verde de fundo com texto branco. 4,56:1. */
  successFill: '#008842',
  /** Cinza de fundo com texto branco. */
  neutralFill: '#5B6470',
  primary: '#93BDE4',
  primaryHover: '#658EC9',
  secondary: '#0090D0',
  accent: '#FDC24E',
  accentStrong: '#F6921E',
  success: '#8BE5AD',
  /** No escuro é cor de texto. Fundo com texto branco usa successFill. */
  successStrong: '#8BE5AD',
  danger: '#FCA5A5',
  dangerStrong: '#FCA5A5',
  info: '#93BDE4',
  warning: '#FDC24E',
  sidebar: '#1A1A1A',
  sidebarDeep: '#0a0c10',
  sidebarSoft: '#222222',
  inputBorderHover: '#9CA3AF',
  inputBorderFocus: '#93BDE4',
  inputBg: '#1A1A1A',
  badgeSuccessBg: 'rgba(0,198,76,0.14)',
  badgeWarningBg: 'rgba(246,146,30,0.14)',
  badgeDangerBg: 'rgba(239,68,68,0.14)',
  badgeInfoBg: 'rgba(147,189,228,0.14)',
} as const
