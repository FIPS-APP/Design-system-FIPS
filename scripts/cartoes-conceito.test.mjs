/**
 * CartoesConceito: cartão da Gestão OPA (filete de topo no tom, canto assinatura), com o ícone ao lado do
 * título (mesma linha) e o texto embaixo alinhado à esquerda. Nada centrado.
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
  // A linha do título é o <div> cujo primeiro filho é o disco do ícone e o seguinte é o <h3>.
  const linha = cabeca.match(/<div class="([^"]*)"><span aria-hidden="true"[^>]*><svg[\s\S]*?<\/svg><\/span><h3/)
  assert.ok(linha, 'primeiro filho da linha é o ícone, e o título vem logo depois')
  const classes = linha[1].split(/\s+/)
  assert.ok(classes.includes('flex'), 'linha flex')
  assert.ok(classes.includes('items-center'), 'ícone e título centrados na vertical')
  assert.ok(!classes.includes('flex-col'), 'na mesma linha, não empilhados')
})

test('texto embaixo, alinhado à esquerda, no cartão da Gestão OPA: filete de topo e canto assinatura', () => {
  const m = html()
  assert.doesNotMatch(m, /\btext-center\b/)
  assert.match(m, /h-\[3px\]/)
  assert.match(m, /rounded-\[10px_10px_10px_18px\]/)
  assert.doesNotMatch(m, /border-l-4/)
  const sst = m.slice(m.indexOf('>SST</h3>'))
  assert.ok(sst.indexOf('Segurança e Saúde do Trabalho.') > 0, 'texto depois do título')
})

test('tom pinta o filete e o ícone; padrão primary', () => {
  const m = html()
  const sst = cabecaDoCartao(m, 'SST')
  const nat = cabecaDoCartao(m, 'NAT')
  assert.match(sst, /var\(--color-primary-text\)/)
  assert.match(nat, /var\(--color-accent-strong\)/)
  assert.match(nat, /text-\[var\(--color-accent-text\)\]/)
})

test('colunas e nivelTitulo continuam valendo', () => {
  assert.match(html(), /md:grid-cols-3/)
  assert.match(html({ colunas: 2 }), /md:grid-cols-2/)
  assert.match(html({ nivelTitulo: 4 }), /<h4[^>]*>SST<\/h4>/)
})

test('CartoesInformativos: ícone ao lado do título e o texto embaixo, fora da coluna do título', () => {
  const m = renderToStaticMarkup(React.createElement(H.CartoesInformativos, {
    cartoes: [{ id: 'obj', icone: ShieldCheck, titulo: 'Objetivo', texto: 'Padronizar a inspeção.' }],
  }))
  const linha = m.match(/<div class="([^"]*)"><span aria-hidden="true"[^>]*><svg[\s\S]*?<\/svg><\/span><h3[^>]*>Objetivo<\/h3><\/div><p[^>]*>Padronizar a inspeção\.<\/p>/)
  assert.ok(linha, 'linha com ícone e título, e o parágrafo depois da linha')
  assert.ok(linha[1].split(/\s+/).includes('items-center'), 'ícone e título centrados na vertical')
})
