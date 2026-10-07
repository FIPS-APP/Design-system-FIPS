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
  sidebar: fipsPalette.azulProfundo,
  sidebarMuted: fipsPalette.azulProfundoDark,
} as const

/**
 * Tokens semânticos para dark mode.
 * Mapeia cada token do light mode para o valor equivalente no tema escuro.
 */
export const darkSemanticColors = {
  surface: '#222222',
  surfaceSoft: '#252525',
  surfaceMuted: '#1A1A1A',
  border: '#2E2E2E',
  borderStrong: '#3a3a3a',
  foreground: '#E2E2E8',
  foregroundMuted: '#A1A1AA',
  primary: '#93BDE4',
  primaryHover: '#658EC9',
  secondary: '#0090D0',
  accent: '#FDC24E',
  accentStrong: '#F6921E',
  success: '#8BE5AD',
  successStrong: '#00C64C',
  danger: '#FCA5A5',
  dangerStrong: '#FCA5A5',
  info: '#93BDE4',
  warning: '#FDC24E',
  sidebar: '#1A1A1A',
  sidebarDeep: '#0a0c10',
  sidebarSoft: '#222222',
  inputBorder: '#3a3a3a',
  inputBorderHover: '#4a4a4a',
  inputBorderFocus: '#93BDE4',
  inputBg: '#252525',
  badgeSuccessBg: 'rgba(0,198,76,0.14)',
  badgeWarningBg: 'rgba(246,146,30,0.14)',
  badgeDangerBg: 'rgba(239,68,68,0.14)',
  badgeInfoBg: 'rgba(147,189,228,0.14)',
} as const
