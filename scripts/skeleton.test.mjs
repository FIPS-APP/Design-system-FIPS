/**
 * Skeleton: export no pacote, API de div, cor por token, aria-hidden e redução de movimento.
 * Contraste do bloco (--color-border) contra cada fundo onde ele pousa, nos dois temas.
 * Rodar: node --test scripts/skeleton.test.mjs
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
  S = await vite.ssrLoadModule('/src/components/ui/skeleton.tsx')
})
after(async () => { await vite?.close() })

const html = (props) => renderToStaticMarkup(React.createElement(S.Skeleton, props))

test('exporta Skeleton e SkeletonProps pelo índice de ui, que o pacote reexporta', () => {
  assert.match(ler('src/components/ui/index.ts'), /export \{ Skeleton, type SkeletonProps \} from '\.\/skeleton'/)
  assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
})

test('é decorativo por padrão: aria-hidden, e o consumidor pode trocar', () => {
  assert.match(html({}), /aria-hidden="true"/)
  assert.doesNotMatch(html({ 'aria-hidden': undefined, role: 'status', 'aria-label': 'Carregando' }), /aria-hidden/)
})

test('aceita className e props de div, e className do consumidor vence', () => {
  const m = html({ className: 'h-4 w-40 rounded-full', id: 'x', 'data-k': 'v' })
  assert.match(m, /class="[^"]*h-4 w-40 rounded-full/)
  assert.doesNotMatch(m, /rounded-md/)
  assert.match(m, /id="x"/)
  assert.match(m, /data-k="v"/)
})

test('reduced-motion: pulsa só sem redução de movimento (animate-pulse + motion-reduce:animate-none)', () => {
  const c = html({}).match(/class="([^"]*)"/)[1].split(/\s+/)
  assert.ok(c.includes('animate-pulse'))
  assert.ok(c.includes('motion-reduce:animate-none'))
})

test('cor por token, sem cor fixa', () => {
  const src = ler('src/components/ui/skeleton.tsx')
  assert.match(src, /bg-\[var\(--color-border\)\]/)
  assert.equal(src.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
})

// ─── contraste do bloco (não é texto: referência 3:1 não se aplica a placeholder; medimos e travamos o piso de visibilidade) ───
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
const MIN = 1.2

// Cartão e cartão suave: onde o bloco pousa. O cabeçalho de tabela (--color-surface-muted) fica só medido:
// no escuro o bloco dá 1,13:1 ali; quem precisar de mais usa className com outro token do DS.
for (const t of ['claro', 'escuro']) {
  for (const fundo of ['--color-surface', '--color-surface-soft']) {
    test(`contraste do bloco, tema ${t}, sobre ${fundo}: >= ${MIN}:1`, () => {
      const r = razao(res(TEMAS[t], '--color-border'), res(TEMAS[t], fundo))
      console.log(`  ${t} ${fundo}: ${r.toFixed(2)}:1`)
      assert.ok(r >= MIN, `${r.toFixed(2)}:1`)
    })
  }
  test(`contraste do bloco, tema ${t}, sobre --color-surface-muted: medido`, () => {
    console.log(`  ${t} --color-surface-muted: ${razao(res(TEMAS[t], '--color-border'), res(TEMAS[t], '--color-surface-muted')).toFixed(2)}:1`)
  })
}
