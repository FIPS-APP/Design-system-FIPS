/**
 * CartoesConceito: ícone ao lado do título (mesma linha), texto embaixo alinhado à esquerda, borda esquerda
 * no tom. Sem filete de topo e sem nada centrado.
 * Rodar: npm test
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ShieldCheck, TriangleAlert } from 'lucide-react'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
let vite
let H
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  H = await vite.ssrLoadModule('/src/components/composites/CartoesHome.tsx')
})
after(async () => { await vite?.close() })

const CONCEITOS = [
  { id: 'sst', icone: ShieldCheck, titulo: 'SST', texto: 'Segurança e Saúde do Trabalho.' },
  { id: 'nat', icone: TriangleAlert, titulo: 'NAT', texto: 'Não Atende.', tom: 'warning' },
]

const html = (props = {}) =>
  renderToStaticMarkup(React.createElement(H.CartoesConceito, { conceitos: CONCEITOS, ...props }))

/** Trecho do `<li>` de um cartão, do início até o fim do título. */
function cabecaDoCartao(m, titulo) {
  const fimTitulo = m.indexOf(`>${titulo}</h3>`)
  assert.ok(fimTitulo > 0, `título ${titulo}`)
  const inicio = m.lastIndexOf('<li', fimTitulo)
  return m.slice(inicio, fimTitulo)
}

test('primeiro filho da linha do título é o ícone, e o título vem na mesma linha', () => {
  const cabeca = cabecaDoCartao(html(), 'SST')
  // A linha do título é o <div> cujo primeiro filho é o quadradinho do ícone e o seguinte leva o <h3>.
  const linha = cabeca.match(/<div class="([^"]*)"><span aria-hidden="true"[^>]*><svg[\s\S]*?<\/svg><\/span><div[^>]*><h3/)
  assert.ok(linha, 'primeiro filho da linha é o ícone, e o título vem logo depois')
  const classes = linha[1].split(/\s+/)
  assert.ok(classes.includes('flex'), 'linha flex')
  assert.ok(classes.includes('items-center'), 'ícone e título centrados na vertical')
  assert.ok(!classes.includes('flex-col'), 'na mesma linha, não empilhados')
})

test('texto embaixo, alinhado à esquerda: nada centrado e sem filete de topo', () => {
  const m = html()
  assert.doesNotMatch(m, /\btext-center\b/)
  assert.doesNotMatch(m, /h-\[3px\]/)
  assert.doesNotMatch(m, /rounded-full/)
  const sst = m.slice(m.indexOf('>SST</h3>'))
  assert.ok(sst.indexOf('Segurança e Saúde do Trabalho.') > 0, 'texto depois do título')
})

test('tom pinta a borda esquerda e o ícone; padrão primary', () => {
  const m = html()
  const sst = cabecaDoCartao(m, 'SST')
  const nat = cabecaDoCartao(m, 'NAT')
  assert.match(sst, /border-l-4/)
  assert.match(sst, /border-l-\[var\(--color-primary-text\)\]/)
  assert.match(nat, /border-l-\[var\(--color-accent-strong\)\]/)
  assert.match(nat, /text-\[var\(--color-accent-text\)\]/)
})

test('mesmo cartão do CartoesResponsabilidade (sem markup duplicado)', () => {
  const conceito = html({ colunas: 4 })
  const resp = renderToStaticMarkup(React.createElement(H.CartoesResponsabilidade, { cartoes: CONCEITOS, colunas: 4 }))
  assert.equal(conceito, resp)
})

test('colunas e nivelTitulo continuam valendo', () => {
  assert.match(html(), /md:grid-cols-3/)
  assert.match(html({ colunas: 2 }), /md:grid-cols-2/)
  assert.match(html({ nivelTitulo: 4 }), /<h4[^>]*>SST<\/h4>/)
})
