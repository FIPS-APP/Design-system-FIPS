/**
 * HeroAtalho e HeroFileira: `target` e `rel` chegam ao <a>. Renderiza o componente de verdade
 * (build em memória com o vite do repo, depois react-dom/server) e lê o HTML.
 * Rodar: npm run test:hero
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-hero-atalho')
let React, renderToStaticMarkup, HeroAtalho, HeroFileira, Icone

before(async () => {
  const entrada = join(TMP, 'entrada.tsx')
  mkdirSync(TMP, { recursive: true })
  writeFileSync(
    entrada,
    `export { HeroAtalho } from '${join(RAIZ, 'src/components/composites/HeroAtalho.tsx')}'\n` +
      `export { HeroFileira } from '${join(RAIZ, 'src/components/composites/HeroFileira.tsx')}'\n` +
      `export { Sparkles } from 'lucide-react'\n`,
  )
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, chunk.code)
  const modulo = await import(pathToFileURL(arquivo).href)
  ;({ HeroAtalho, HeroFileira, Sparkles: Icone } = modulo)
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  ;({ renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href))
})

after(() => rmSync(TMP, { recursive: true, force: true }))

const html = (el) => renderToStaticMarkup(el)
const atalho = (props) => html(React.createElement(HeroAtalho, { icon: Icone, label: 'Ir', ...props }))
const fileira = (item) => html(React.createElement(HeroFileira, { atalhos: [{ id: 'a', icon: Icone, label: 'Ir', ...item }] }))

for (const [nome, render] of [['HeroAtalho', atalho], ['HeroFileira', fileira]]) {
  test(`${nome}: target="_blank" sem rel sai com rel="noopener noreferrer"`, () => {
    const saida = render({ href: '/x', target: '_blank' })
    assert.match(saida, /<a [^>]*target="_blank"/)
    assert.match(saida, /<a [^>]*rel="noopener noreferrer"/)
  })

  test(`${nome}: rel informado vale como veio`, () => {
    const saida = render({ href: '/x', target: '_blank', rel: 'author' })
    assert.match(saida, /<a [^>]*rel="author"/)
    assert.doesNotMatch(saida, /noopener/)
  })

  test(`${nome}: rel sem target é repassado`, () => {
    assert.match(render({ href: '/x', rel: 'nofollow' }), /<a [^>]*rel="nofollow"/)
  })

  test(`${nome}: sem target o link sai sem rel, e target diferente de _blank não ganha rel`, () => {
    assert.doesNotMatch(render({ href: '/x' }), /<a [^>]*\brel=/)
    const saida = render({ href: '/x', target: '_self' })
    assert.match(saida, /<a [^>]*target="_self"/)
    assert.doesNotMatch(saida, /<a [^>]*\brel=/)
  })

  test(`${nome}: sem href o botão sai sem target e sem rel`, () => {
    const saida = render({ target: '_blank', rel: 'author' })
    assert.match(saida, /<button /)
    assert.doesNotMatch(saida, /target=|rel=/)
  })

  test(`${nome}: data-* e aria-* continuam chegando ao link`, () => {
    assert.match(render({ href: '/x', target: '_blank', 'data-tutorial': 'novo' }), /<a [^>]*data-tutorial="novo"/)
  })
}
