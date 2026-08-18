#!/usr/bin/env node
/**
 * Gera `src/styles/tokens.generated.css` a partir de `src/tokens/theme.ts`.
 *
 *   node scripts/build-tokens.mjs           # escreve o CSS
 *   node scripts/build-tokens.mjs --check   # falha se o CSS commitado estiver defasado
 *
 * Existe para o hex ter UM dono. Antes, cada cor vivia duas vezes — no TS e no
 * `@theme` — e o CLAUDE.md pedia para editar as duas à mão.
 *
 * Requer Node >= 22.18 (type stripping nativo, para importar o .ts direto).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const THEME_URL = new URL('../src/tokens/theme.ts', import.meta.url)
const OUT_URL = new URL('../src/styles/tokens.generated.css', import.meta.url)

let theme
try {
  theme = await import(THEME_URL.href)
} catch (error) {
  console.error(
    `Não consegui importar ${fileURLToPath(THEME_URL)}.\n` +
      `Node ${process.version} — este script precisa de Node >= 22.18 (type stripping nativo).\n`,
  )
  throw error
}

const { themeTokens, lightTokens, darkTokens, bannerLightTokens, bannerDarkTokens } = theme

/** `{--color-x}` → `var(--color-x)`; qualquer outro valor sai literal. */
function toCss(value) {
  const match = /^\{(--[a-z0-9-]+)\}$/i.exec(value)
  return match ? `var(${match[1]})` : value
}

function block(selector, tokens, { indent = '  ', lead = [] } = {}) {
  const body = [
    ...lead.map((line) => `${indent}  ${line}`),
    ...Object.entries(tokens).map(([name, value]) => `${indent}  ${name}: ${toCss(value)};`),
  ]
  return `${indent}${selector} {\n${body.join('\n')}\n${indent}}`
}

const css = `/* ─────────────────────────────────────────────────────────────────────────────
 * ARQUIVO GERADO — não edite à mão.
 * Fonte: src/tokens/theme.ts · Gerador: scripts/build-tokens.mjs
 * Para mudar um token: edite o .ts e rode \`npm run tokens:build\`.
 * ───────────────────────────────────────────────────────────────────────────── */

${block('@theme', themeTokens, { indent: '' })}

@layer base {
${block(':root', lightTokens, { lead: ['color-scheme: light;'] })}

${block('.dark', darkTokens, { lead: ['color-scheme: dark;'] })}

  /* Banners — PatternPanelHero / PageHero / heros das doc pages */
${block(':root', bannerLightTokens)}

${block('.dark', bannerDarkTokens)}
}
`

const outPath = fileURLToPath(OUT_URL)

if (process.argv.includes('--check')) {
  let current = ''
  try {
    current = readFileSync(outPath, 'utf8')
  } catch {
    console.error(`Faltando ${outPath}. Rode \`npm run tokens:build\`.`)
    process.exit(1)
  }
  if (current !== css) {
    console.error(
      'src/styles/tokens.generated.css está defasado de src/tokens/theme.ts.\n' +
        'Rode `npm run tokens:build` e commite o CSS gerado.',
    )
    process.exit(1)
  }
  console.log('tokens: CSS gerado está em dia com theme.ts')
} else {
  writeFileSync(outPath, css)
  console.log(`tokens: escrito ${outPath}`)
}
