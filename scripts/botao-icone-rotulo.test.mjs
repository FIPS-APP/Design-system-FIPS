/**
 * BotaoIconeRotulo: ícone no repouso, nome no HTML e no aria-label, danger com os tokens do
 * Button danger, borda de 1,5px em todas as variantes (largura igual aberto e fechado).
 * Renderiza o componente de verdade (vite em modo SSR + react-dom/server).
 * Rodar: npm run test:botao-icone-rotulo
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
const ARQUIVO = 'src/components/ui/botao-icone-rotulo.tsx'
let vite, Botao, Icone

before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  ;({ BotaoIconeRotulo: Botao } = await vite.ssrLoadModule('/' + ARQUIVO))
  ;({ Trash2: Icone } = await vite.ssrLoadModule('lucide-react'))
})
after(async () => { await vite?.close() })

const html = (props) => renderToStaticMarkup(React.createElement(Botao, { icon: Icone, label: 'Excluir', ...props }))
const classesDaRaiz = (saida) => saida.match(/^<button\b[^>]*\sclass="([^"]*)"/)[1].split(/\s+/)
const larguraDeBorda = (classes) => classes.filter((c) => /^border(?:-\d+|-\[[\d.]+(?:px|rem|em)?\])?$/.test(c))

test('fechado: <button type="button">, aria-label e data-state closed, nome no HTML', () => {
  const saida = html({})
  assert.match(saida, /^<button [^>]*type="button"/)
  assert.match(saida, /aria-label="Excluir"/)
  assert.match(saida, /data-state="closed"/)
  assert.match(saida, />Excluir<\/span>/)
  assert.match(saida, /<svg [^>]*aria-hidden="true"/)
})

test('fechado: coluna do nome em 0fr e abre em 1fr pelo data-state', () => {
  const saida = html({})
  assert.match(saida, /grid-cols-\[0fr\]/)
  assert.match(saida, /group-data-\[state=open\]\/bir:grid-cols-\[1fr\]/)
})

for (const variant of ['danger', 'outline', 'ghost']) {
  for (const size of ['iconSm', 'icon']) {
    test(`${variant}/${size}: uma largura de borda só, border-[1.5px]`, () => {
      assert.deepEqual(larguraDeBorda(classesDaRaiz(html({ variant, size }))), ['border-[1.5px]'])
    })
  }
}

test('altura e largura mínima: iconSm 30px (igual Button iconSm) e icon 36px', () => {
  assert.ok(classesDaRaiz(html({ size: 'iconSm' })).includes('min-w-[30px]'))
  assert.ok(classesDaRaiz(html({ size: 'icon' })).includes('min-w-9'))
  assert.ok(classesDaRaiz(html({ size: 'iconSm' })).includes('h-[30px]'))
  assert.ok(classesDaRaiz(html({ size: 'icon' })).includes('h-9'))
  assert.ok(classesDaRaiz(html({})).includes('h-[30px]'), 'padrão iconSm')
})

test('danger: repouso no texto de perigo, aberto no fundo do botão de perigo com texto branco', () => {
  const c = classesDaRaiz(html({ variant: 'danger' })).join(' ')
  assert.match(c, /border-\[var\(--color-danger-text\)\]/)
  assert.match(c, /text-\[var\(--color-danger-text\)\]/)
  assert.match(c, /data-\[state=open\]:bg-\[var\(--color-btn-danger-hover\)\]/)
  assert.match(c, /data-\[state=open\]:text-white/)
})

test('aria-label do app vence o label e o nome visível continua no HTML', () => {
  const saida = html({ 'aria-label': 'Excluir rascunho da inspeção 12' })
  assert.match(saida, /aria-label="Excluir rascunho da inspeção 12"/)
  assert.doesNotMatch(saida, /aria-label="Excluir"/)
  assert.match(saida, />Excluir<\/span>/)
})

test('desabilitado: atributo disabled e sem pointer-events (não abre no hover)', () => {
  const saida = html({ disabled: true })
  assert.match(saida, /^<button [^>]*disabled=""/)
  assert.ok(classesDaRaiz(saida).includes('disabled:pointer-events-none'))
})

test('title, data-* e className do app chegam ao botão', () => {
  const saida = html({ title: 'Remove a inspeção', 'data-tutorial': 'x' })
  assert.match(saida, /title="Remove a inspeção"/)
  assert.match(saida, /data-tutorial="x"/)
})

test('fonte: só tokens, sem hex nem rgb literal', () => {
  const fonte = readFileSync(join(RAIZ, ARQUIVO), 'utf8')
  assert.doesNotMatch(fonte, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(fonte, /rgba?\(/)
})
