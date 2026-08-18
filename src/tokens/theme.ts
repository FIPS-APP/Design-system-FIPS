/**
 * FONTE DA VERDADE dos tokens do DS-FIPS.
 *
 * Tudo que vira CSS custom property mora aqui — e só aqui. O arquivo
 * `src/styles/tokens.generated.css` é **gerado** deste módulo por
 * `npm run tokens:build`; editar o CSS à mão faz o `npm run tokens:check`
 * (e o CI) ficar vermelho.
 *
 * As chaves são o nome final da custom property. Um valor pode ser:
 *   - literal   → `'#004B9B'`, `'rgba(0,0,0,.35)'`, `'color-mix(...)'`
 *   - referência→ `'{--color-fips-blue-900}'`, que vira `var(--color-fips-blue-900)`
 *                 no CSS e o valor resolvido quando lido pelo TypeScript.
 */

/** Tokens primitivos: entram no `@theme` do Tailwind e geram utilities. */
export const themeTokens = {
  '--font-sans': "'Open Sans', ui-sans-serif, system-ui, sans-serif",
  '--font-heading': "'Saira Expanded', 'Open Sans', ui-sans-serif, system-ui, sans-serif",

  '--color-fips-blue-1000': '#001A4A',
  '--color-fips-blue-950': '#002A68',
  '--color-fips-blue-900': '#004B9B',
  '--color-fips-blue-700': '#658EC9',
  '--color-fips-blue-400': '#93BDE4',
  '--color-fips-blue-200': '#D3E3F4',
  '--color-fips-sky-600': '#0090D0',

  '--color-fips-yellow-400': '#FDC24E',
  '--color-fips-yellow-600': '#F6921E',
  '--color-fips-yellow-100': '#FFE4B8',

  '--color-fips-green-500': '#00C64C',
  '--color-fips-green-700': '#00904C',
  '--color-fips-green-300': '#8BE5AD',
  '--color-fips-red-600': '#EF4444',
  '--color-fips-red-100': '#FEE2E2',
  '--color-fips-orange-100': '#FFF0D6',

  '--color-fips-gray-900': '#333B41',
  '--color-fips-gray-400': '#C0CCD2',
  '--color-fips-neutral-100': '#E8EBFF',
  '--color-fips-neutral-50': '#F5F8FC',
  '--color-fips-neutral-25': '#FBFDFF',
  '--color-fips-white': '#FFFFFF',

  '--radius-sm': '0.25rem',
  '--radius-md': '0.375rem',
  '--radius-lg': '0.5rem',
  '--radius-xl': '0.75rem',
  '--radius-2xl': '1rem',

  '--shadow-field': '0 1px 2px rgb(15 23 42 / 0.04), inset 0 1px 2px rgb(15 23 42 / 0.03)',
  '--shadow-card': '0 2px 8px rgb(15 23 42 / 0.04), 0 10px 24px rgb(15 23 42 / 0.06)',
  '--shadow-card-hover': '0 8px 22px rgb(15 23 42 / 0.08), 0 18px 38px rgb(0 75 155 / 0.08)',
  '--shadow-elevated': '0 22px 64px rgb(0 75 155 / 0.18)',
  '--shadow-float': '0 12px 36px rgb(15 23 42 / 0.12)',
  // Elevação dos botões cheios (Button variants) — um por família de cor.
  '--shadow-btn-primary': '0 2px 8px rgba(0, 75, 155, 0.12)',
  '--shadow-btn-primary-hover': '0 2px 8px rgba(0, 75, 155, 0.18)',
  '--shadow-btn-accent': '0 2px 8px rgba(246, 146, 30, 0.2)',
  '--shadow-btn-success': '0 2px 8px rgba(0, 198, 76, 0.2)',
  '--shadow-btn-success-strong': '0 2px 8px rgba(0, 144, 76, 0.2)',
  '--shadow-btn-danger': '0 2px 8px rgba(220, 53, 69, 0.2)',

  // Cards rasos do produto (StatsCard, preview de export) e seus estados.
  '--shadow-card-flat': '0 1px 3px rgba(0, 75, 155, 0.04)',
  '--shadow-card-raise': '0 4px 14px rgba(0, 75, 155, 0.08)',
  '--shadow-step-badge': '0 4px 12px rgba(246, 146, 30, 0.3)',

  // Peças de controle.
  '--shadow-progress-track': 'inset 0 1px 2px rgba(15, 23, 42, 0.06)',
  '--shadow-switch-thumb': '0 1px 3px rgba(0, 0, 0, 0.2)',

  // Faixas sólidas do header de modal (`<Modal hero tone="…">`). Não invertem por
  // tema: são fundo com texto branco por cima, e clarear no dark apagaria o texto.
  '--color-tone-success-solid': '{--color-fips-green-700}',
  '--color-tone-danger-solid': '#B91C1C',
  '--color-tone-warning-solid': '#C2410C',

  // Cor de extensão de arquivo — convenção do formato, não é marca FIPS.
  '--color-vendor-excel': '#1D6F42',
} as const

/**
 * Tokens semânticos do tema claro (`:root`). São lidos pelos componentes como
 * `bg-[var(--color-surface)]` — ficam fora do `@theme` de propósito: não geram
 * utility, então trocar o valor no dark não reescreve classe nenhuma.
 */
export const lightTokens = {
  '--color-primary': '{--color-fips-blue-900}',
  '--color-primary-hover': '{--color-fips-blue-950}',
  '--color-secondary': '{--color-fips-sky-600}',
  '--color-secondary-hover': '#007AB1',
  '--color-accent': '{--color-fips-yellow-400}',
  '--color-accent-strong': '{--color-fips-yellow-600}',
  '--color-success': '{--color-fips-green-500}',
  '--color-success-strong': '{--color-fips-green-700}',
  '--color-warning': '{--color-fips-yellow-600}',
  '--color-danger': '{--color-fips-red-600}',
  '--color-surface': '{--color-fips-white}',
  '--color-surface-soft': '{--color-fips-neutral-25}',
  '--color-surface-muted': '{--color-fips-neutral-50}',
  '--color-table-zebra': 'color-mix(in srgb, var(--color-fips-blue-200) 25%, transparent)',
  '--color-border': '#D7E0EA',
  '--color-border-strong': '{--color-fips-gray-400}',
  '--color-fg': '{--color-fips-gray-900}',
  '--color-fg-muted': '#6B7784',
  '--color-ring': '{--color-fips-sky-600}',
  '--color-input-border-hover': '{--color-fips-gray-400}',
  '--color-surface-hover': '{--color-fips-neutral-50}',
  '--color-danger-hover': '#C82333',

  // Chrome do Dialog/Modal (superfície neumórfica + tile do ícone).
  '--color-dialog-from': '#FAFAFA',
  '--color-dialog-via': '#F0F0F2',
  '--color-dialog-to': '#E8E8EC',
  '--color-dialog-title': '#18181B',
  '--color-dialog-tile-from': '{--color-fips-white}',
  '--color-dialog-tile-via': '#EBEBEB',
  '--color-dialog-tile-to': '#E0E0E0',
  '--color-dialog-tile-fg': 'rgba(55, 55, 55, 0.82)',
  '--shadow-dialog':
    '0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 1px 0 rgba(255, 255, 255, 0.9) inset',
  '--shadow-dialog-tile':
    '0 1px 2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.85)',

  '--color-badge-warning-bg': '{--color-fips-orange-100}',
  '--color-badge-danger-bg': '{--color-fips-red-100}',
  '--color-sidebar': '{--color-fips-blue-950}',
  '--color-sidebar-deep': '{--color-fips-blue-950}',
  '--color-sidebar-soft': '{--color-fips-blue-900}',

  // Acentos das doc pages / GovernancePage. No dark eles clareiam em vez de escurecer.
  '--color-gov-azul-profundo': '{--color-fips-blue-900}',
  '--color-gov-azul-escuro': '{--color-fips-blue-950}',
  '--color-gov-azul-claro': '{--color-fips-blue-700}',
  '--color-gov-verde-escuro': '{--color-fips-green-700}',
  '--color-gov-gradient-from': '{--color-fips-blue-900}',
  '--color-gov-gradient-to': '{--color-fips-blue-950}',

  '--color-semantic-info-bg': '{--color-fips-blue-200}',
  '--color-semantic-info-fg': '{--color-fips-blue-950}',
  '--color-semantic-info-border': '{--color-fips-blue-400}',
  '--color-semantic-sucesso-bg': '#ECFDF5',
  '--color-semantic-sucesso-fg': '{--color-fips-green-700}',
  '--color-semantic-sucesso-border': '#A7F3D0',
  '--color-semantic-critico-bg': '#FEF2F2',
  '--color-semantic-critico-fg': '#B91C1C',
  '--color-semantic-critico-border': '#FECACA',

  // Trilhos de junção dos banners/heros: brancos no claro, ouro no escuro.
  '--color-junction-stroke': '{--color-fips-white}',

  // Sombra de card do produto — mais rasa que a primitiva do `@theme`, que fica
  // para superfícies flutuantes. Como `@layer base` vence `@layer theme`, esta
  // linha é a que realmente pinta o `shadow-card`.
  '--shadow-card': '0 1px 3px rgba(0, 75, 155, 0.04), 0 4px 14px rgba(0, 75, 155, 0.03)',
} as const

/** Tema escuro (`.dark`) — extraído do Tecnopano 3.0 DashboardAdmin. */
export const darkTokens = {
  '--color-primary': '{--color-fips-blue-900}',
  '--color-primary-hover': '{--color-fips-blue-950}',
  '--color-secondary': '{--color-fips-sky-600}',
  '--color-secondary-hover': '#007AB1',
  '--color-accent': '{--color-fips-yellow-400}',
  '--color-accent-strong': '{--color-fips-yellow-600}',
  '--color-success': '{--color-fips-green-500}',
  '--color-success-strong': '{--color-fips-green-700}',
  '--color-warning': '{--color-fips-yellow-600}',
  '--color-danger': '{--color-fips-red-600}',
  '--color-surface': '#222222',
  '--color-surface-soft': '#252525',
  '--color-surface-muted': '#1A1A1A',
  '--color-table-zebra': 'rgba(255, 255, 255, 0.03)',
  '--color-border': '#2E2E2E',
  '--color-border-strong': '#3A3A3A',
  '--color-fg': '#E2E2E8',
  '--color-fg-muted': '#A1A1AA',
  '--color-ring': '{--color-fips-yellow-600}',
  '--color-input-border-hover': '#4A4A4A',
  '--color-surface-hover': '#2A2A2A',
  '--color-danger-hover': '#C82333',

  '--color-dialog-from': '#272727',
  '--color-dialog-via': '#222222',
  '--color-dialog-to': '#1D1D1D',
  '--color-dialog-title': '#FAFAFA',
  '--color-dialog-tile-from': '#2C2C2C',
  '--color-dialog-tile-via': '#262626',
  '--color-dialog-tile-to': '#1F1F1F',
  '--color-dialog-tile-fg': '#A1A1AA',
  '--shadow-dialog':
    '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04) inset, 0 1px 0 rgba(255, 255, 255, 0.06) inset',
  '--shadow-dialog-tile':
    '0 3px 10px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.08) inset, 0 -1px 0 rgba(0, 0, 0, 0.45) inset',

  '--color-badge-warning-bg': 'rgba(246, 146, 30, 0.14)',
  '--color-badge-danger-bg': 'rgba(239, 68, 68, 0.14)',
  '--color-sidebar': '{--color-fips-blue-950}',
  '--color-sidebar-deep': '{--color-fips-blue-950}',
  '--color-sidebar-soft': '{--color-fips-blue-900}',

  '--color-gov-azul-profundo': '{--color-fips-blue-400}',
  '--color-gov-azul-escuro': '{--color-fips-blue-700}',
  '--color-gov-azul-claro': '{--color-fips-blue-400}',
  '--color-gov-verde-escuro': '{--color-fips-green-300}',
  '--color-gov-gradient-from': '{--color-fips-gray-900}',
  '--color-gov-gradient-to': '#2A2F35',

  '--color-semantic-info-bg': 'rgba(147, 189, 228, 0.14)',
  '--color-semantic-info-fg': '{--color-fips-blue-400}',
  '--color-semantic-info-border': 'rgba(147, 189, 228, 0.28)',
  '--color-semantic-sucesso-bg': 'rgba(0, 198, 76, 0.14)',
  '--color-semantic-sucesso-fg': '{--color-fips-green-300}',
  '--color-semantic-sucesso-border': 'rgba(0, 198, 76, 0.28)',
  '--color-semantic-critico-bg': 'rgba(239, 68, 68, 0.14)',
  '--color-semantic-critico-fg': '#FCA5A5',
  '--color-semantic-critico-border': 'rgba(239, 68, 68, 0.28)',

  '--color-junction-stroke': '{--color-fips-yellow-400}',
} as const

/** Banners (PatternPanelHero / PageHero / heros das doc pages) — tema claro. */
export const bannerLightTokens = {
  '--fips-banner-page-bg':
    'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 100%)',
  '--fips-banner-content-bg':
    'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, var(--color-fips-blue-1000) 100%)',
  '--fips-banner-content-shadow': '0 4px 20px rgba(0, 42, 104, 0.12)',
  '--fips-banner-content-border-color': 'transparent',
  // Faixa de página (alta, full-bleed) aguenta trilho mais visível…
  '--fips-banner-junction-opacity': '0.12',
  // …a faixa de conteúdo é baixa: 0.12 vira ruído atrás do título. Valor da doc do Banner.
  '--fips-banner-junction-content-opacity': '0.06',

  // Pílula "Design System FIPS" sobre a faixa escura.
  '--fips-banner-pill-bg': 'rgba(255, 255, 255, 0.06)',
  '--fips-banner-pill-border': 'rgba(255, 255, 255, 0.09)',

  // Hero de Modal/Drawer: mesma faixa do banner de conteúdo, mas sem trocar de
  // gradiente no dark (o `--color-gov-gradient-*` já escurece sozinho).
  '--fips-modal-hero-bg':
    'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, var(--color-fips-blue-1000) 100%)',
  '--fips-modal-hero-icon-bg':
    'linear-gradient(145deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.06) 56%, rgba(0, 24, 58, 0.22) 100%)',
  '--fips-modal-hero-icon-shadow':
    '0 1px 2px rgba(0, 42, 104, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
} as const

/** Banners — tema escuro. */
export const bannerDarkTokens = {
  '--fips-banner-content-bg': 'linear-gradient(135deg, #1E2A3A 0%, #162030 50%, #1A2840 100%)',
  '--fips-banner-content-shadow':
    '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  '--fips-banner-content-border-color': 'rgba(147, 189, 228, 0.08)',
  '--fips-banner-junction-opacity': '0.04',
  '--fips-banner-junction-content-opacity': '0.04',
} as const

export type ThemeTokenName = keyof typeof themeTokens
export type LightTokenName = keyof typeof lightTokens
export type DarkTokenName = keyof typeof darkTokens

const REFERENCE = /^\{(--[a-z0-9-]+)\}$/i

/**
 * Resolve um valor de token até o literal final: `'{--color-fips-blue-900}'` → `'#004B9B'`.
 * Usado pelos exports TS (que precisam de hex) e pelo gerador do CSS.
 */
export function resolveToken(value: string, scope: Record<string, string> = {}): string {
  let current = value
  // 8 saltos bastam para qualquer cadeia real; o teto evita loop em ref circular.
  for (let hop = 0; hop < 8; hop += 1) {
    const match = REFERENCE.exec(current)
    if (!match) return current
    const name = match[1]
    const next = scope[name] ?? (themeTokens as Record<string, string>)[name]
    if (next === undefined) throw new Error(`Token inexistente: ${name}`)
    current = next
  }
  throw new Error(`Referência circular de token em: ${value}`)
}

/** Valor final do token no tema claro. */
export function light(name: LightTokenName): string {
  return resolveToken(lightTokens[name], lightTokens)
}

/** Valor final do token no tema escuro. */
export function dark(name: DarkTokenName): string {
  return resolveToken(darkTokens[name], darkTokens)
}
