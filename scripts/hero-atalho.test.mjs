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

// ─── Borda de 1,5px nos quatro estados ─────────────────────────────────────
// O preflight do Tailwind zera a borda de elemento sem largura declarada. O `ouro` fechado não
// declarava: saía com borda 0 e mais estreito que o `inverseOutline` fechado e que os abertos, e
// como a fileira é centrada os vizinhos andavam quando o principal fechava.
const classesDaRaiz = (saida) => {
  const tag = saida.match(/^<(?:a|button)\b[^>]*>/)
  assert.ok(tag, `HTML sem <a> ou <button> na raiz: ${saida.slice(0, 120)}`)
  const classe = tag[0].match(/\sclass="([^"]*)"/)
  assert.ok(classe, `raiz sem class: ${tag[0]}`)
  return classe[1].split(/\s+/)
}
// `border`, `border-2` e `border-[1.5px]` são largura; `border-transparent` e `border-white/60` são cor.
const larguraDeBorda = (classes) => classes.filter((c) => /^border(?:-\d+|-\[[\d.]+(?:px|rem|em)?\])?$/.test(c))

for (const [rotulo, props] of [
  ['ouro fechado', { variante: 'ouro', aberto: false }],
  ['ouro aberto', { variante: 'ouro', aberto: true }],
  ['inverseOutline fechado', { variante: 'inverseOutline', aberto: false }],
  ['inverseOutline aberto', { variante: 'inverseOutline', aberto: true }],
]) {
  test(`HeroAtalho ${rotulo}: uma largura de borda só, border-[1.5px]`, () => {
    assert.deepEqual(larguraDeBorda(classesDaRaiz(atalho(props))), ['border-[1.5px]'])
  })
}

test('HeroAtalho: fechado, ouro e inverseOutline têm a mesma largura de borda (a fileira não se desloca)', () => {
  const ouro = larguraDeBorda(classesDaRaiz(atalho({ variante: 'ouro', aberto: false })))
  const inverse = larguraDeBorda(classesDaRaiz(atalho({ variante: 'inverseOutline', aberto: false })))
  assert.deepEqual(ouro, inverse)
})

test('HeroFileira: o principal ouro aberto e os demais fechados saem com a mesma borda', () => {
  const saida = html(
    React.createElement(HeroFileira, {
      atalhos: [
        { id: 'a', icon: Icone, label: 'Principal', variante: 'ouro' },
        { id: 'b', icon: Icone, label: 'Segundo' },
      ],
    }),
  )
  const raizes = [...saida.matchAll(/<button\b[^>]*>/g)].map((m) => m[0])
  assert.equal(raizes.length, 2)
  assert.match(raizes[0], /data-state="open"/)
  assert.match(raizes[1], /data-state="closed"/)
  for (const raiz of raizes) assert.deepEqual(larguraDeBorda(classesDaRaiz(raiz)), ['border-[1.5px]'])
})
