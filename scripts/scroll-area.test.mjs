/**
 * ScrollArea: export no pacote, foco por teclado no trecho que rola, rótulo, redução de movimento
 * e contraste do polegar da barra (WCAG 1.4.11, 3:1) nos dois temas.
 * Rodar: node --test scripts/scroll-area.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
let vite
let S
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  S = await vite.ssrLoadModule('/src/components/ui/scroll-area.tsx')
})
after(async () => { await vite?.close() })

const html = (props, horizontal) =>
  renderToStaticMarkup(React.createElement(S.ScrollArea, { className: 'h-40', horizontal, ...props }, React.createElement('p', null, 'x')))

test('exporta ScrollArea e ScrollBar pelo índice de ui, que o pacote reexporta', () => {
  assert.match(ler('src/components/ui/index.ts'), /export \{ ScrollArea, ScrollBar \} from '\.\/scroll-area'/)
  assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
})

test('o trecho que rola entra na ordem do Tab (tabIndex 0) e mostra o anel de foco', () => {
  const m = html({})
  assert.match(m, /tabindex="0"/)
  assert.match(m, /focus-visible:ring-2/)
})

test('aria-label ou aria-labelledby viram região anunciada; sem rótulo, sem role', () => {
  assert.match(html({ 'aria-label': 'Histórico' }), /role="region"[^>]*aria-label="Histórico"|aria-label="Histórico"[^>]*role="region"/)
  assert.match(html({ 'aria-labelledby': 't' }), /role="region"/)
  assert.doesNotMatch(html({}), /role="region"/)
})

test('aceita className do consumidor no contêiner', () => {
  assert.match(html({ className: 'h-56 w-80' }), /class="[^"]*h-56 w-80/)
})

test('reduced-motion: a barra não anima (motion-reduce:transition-none) e não há keyframe próprio', () => {
  const src = ler('src/components/ui/scroll-area.tsx')
  assert.match(src, /motion-reduce:transition-none/)
  assert.doesNotMatch(src, /animate-|@keyframes/)
})

test('barra sempre visível por padrão (type="always")', () => {
  assert.match(ler('src/components/ui/scroll-area.tsx'), /type = 'always'/)
})

test('cor por token, sem cor fixa', () => {
  const src = ler('src/components/ui/scroll-area.tsx')
  assert.match(src, /bg-\[var\(--color-border-control\)\]/)
  assert.equal(src.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
})

// ─── contraste do polegar ───
const css = ler('src/styles/globals.css').replace(/\/\*[^]*?\*\//g, '')
const decl = (t) => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*(#[\da-f]{6}|var\(--[\w-]+\))\s*;/gi)].map((m) => [m[1], m[2]]))
const res = (mapa, n) => { let v = mapa[n]; while (v && v.startsWith('var(')) v = mapa[v.slice(4, -1)]; return v }
const bloco = (s) => { const i = css.indexOf(`${s} {`); return css.slice(i, css.indexOf('\n  }', i)) }
const iT = css.indexOf('@theme {')
const base = decl(css.slice(iT, css.indexOf('\n}', iT)))
const TEMAS = { claro: { ...base, ...decl(bloco(':root')) }, escuro: { ...base, ...decl(bloco(':root')), ...decl(bloco('.dark')) } }
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const lum = (h) => { const [r, g, b] = rgb(h).map((c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

function tokenDoPolegar() {
  const m = ler('src/components/ui/scroll-area.tsx').match(/ScrollAreaThumb[^>]*bg-\[var\((--[\w-]+)\)\]/)
  assert.ok(m, 'polegar sem token de fundo')
  return m[1]
}

for (const t of ['claro', 'escuro']) {
  for (const fundo of ['--color-surface', '--color-surface-soft']) {
    test(`contraste do polegar, tema ${t}, sobre ${fundo}: >= 3:1`, () => {
      const r = razao(res(TEMAS[t], tokenDoPolegar()), res(TEMAS[t], fundo))
      console.log(`  ${t} ${fundo}: ${r.toFixed(2)}:1`)
      assert.ok(r >= 3, `${r.toFixed(2)}:1`)
    })
  }
  test(`contraste do polegar, tema ${t}, sobre --color-surface-muted: medido`, () => {
    console.log(`  ${t} --color-surface-muted: ${razao(res(TEMAS[t], tokenDoPolegar()), res(TEMAS[t], '--color-surface-muted')).toFixed(2)}:1`)
  })
}
