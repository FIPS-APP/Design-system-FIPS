/**
 * Button size="touch": altura de 48 px (h-12 / min-h-12), padding, fonte e raio do lg,
 * ícone de 20 px; lg e demais tamanhos ficam como estavam.
 * Rodar: npm test
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
let vite
let V
let B
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  V = await vite.ssrLoadModule('/src/components/ui/button-variants.ts')
  B = await vite.ssrLoadModule('/src/components/ui/button.tsx')
})
after(async () => { await vite?.close() })

const classes = (size) => V.buttonVariants({ size }).split(/\s+/)

test('touch: altura de 48 px (h-12 e min-h-12)', () => {
  const c = classes('touch')
  assert.ok(c.includes('h-12'), 'h-12')
  assert.ok(c.includes('min-h-12'), 'min-h-12')
  assert.ok(!c.includes('h-9') && !c.includes('h-[42px]'))
})

test('touch: mesmo padding e fonte do lg, ícone de 20 px', () => {
  const t = classes('touch'); const lg = classes('lg')
  for (const k of ['px-7', 'text-sm']) { assert.ok(t.includes(k) && lg.includes(k), k) }
  assert.ok(t.includes('[&_svg]:size-5'))
})

test('lg e md não mudam', () => {
  assert.ok(classes('lg').includes('h-[42px]'))
  assert.ok(classes('md').includes('h-9'))
})

test('Button renderiza size="touch" com h-12', () => {
  const m = renderToStaticMarkup(React.createElement(B.Button, { size: 'touch' }, 'Concluir'))
  assert.match(m, /class="[^"]*\bh-12\b[^"]*"/)
})
