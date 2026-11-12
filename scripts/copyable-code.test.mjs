/**
 * CopyableCode: export, copiar com fallback, link do WhatsApp, anúncio "Copiado" e contraste nos dois temas.
 * Rodar: node --test scripts/copyable-code.test.mjs
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
let M
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  M = await vite.ssrLoadModule('/src/components/ui/copyable-code.tsx')
})
after(async () => { await vite?.close() })

const html = (props) => renderToStaticMarkup(React.createElement(M.CopyableCode, props))
const trocar = (nome, valor) => Object.defineProperty(globalThis, nome, { value: valor, configurable: true, writable: true })

test('exporta CopyableCode, copiarTexto, linkWhatsApp e o tipo pelo índice de ui', () => {
  assert.match(ler('src/components/ui/index.ts'), /export \{ CopyableCode, copiarTexto, linkWhatsApp, type CopyableCodeProps \} from '\.\/copyable-code'/)
  assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
})

test('botão com rótulo visível "Copiar", ícone decorativo e região de status vazia no início', () => {
  const m = html({ value: 'ABC-123' })
  assert.match(m, /<button[^>]*type="button"[^>]*>.*Copiar<\/button>/)
  assert.match(m, /<svg[^>]*aria-hidden="true"/)
  assert.match(m, /<span role="status" aria-live="polite" class="sr-only"><\/span>/)
  assert.match(m, /<code[^>]*>ABC-123<\/code>/)
})

test('children muda o que aparece, e value continua sendo o que se copia', () => {
  assert.match(html({ value: '11999990000', children: '(11) 99999-0000' }), /<code[^>]*>\(11\) 99999-0000<\/code>/)
})

test('copiarTexto usa navigator.clipboard quando existe', async () => {
  let escrito
  trocar('navigator', { clipboard: { writeText: async (t) => { escrito = t } } })
  assert.equal(await M.copiarTexto('x1'), true)
  assert.equal(escrito, 'x1')
})

test('copiarTexto cai no execCommand quando o clipboard recusa', async () => {
  trocar('navigator', { clipboard: { writeText: async () => { throw new Error('negado') } } })
  const chamadas = []
  const area = { setAttribute() {}, style: {}, select() { chamadas.push('select') } }
  trocar('document', {
    createElement: () => area,
    body: { appendChild: () => chamadas.push('add'), removeChild: () => chamadas.push('del') },
    execCommand: (c) => { chamadas.push(c); return true },
  })
  assert.equal(await M.copiarTexto('x2'), true)
  assert.equal(area.value, 'x2')
  assert.deepEqual(chamadas, ['add', 'select', 'copy', 'del'])
})

test('copiarTexto cai no execCommand quando não há navigator.clipboard (página sem HTTPS)', async () => {
  trocar('navigator', {})
  trocar('document', {
    createElement: () => ({ setAttribute() {}, style: {}, select() {} }),
    body: { appendChild() {}, removeChild() {} },
    execCommand: () => true,
  })
  assert.equal(await M.copiarTexto('x3'), true)
})

test('copiarTexto devolve false quando nenhuma via funciona, sem lançar', async () => {
  trocar('navigator', { clipboard: { writeText: async () => { throw new Error('negado') } } })
  trocar('document', {
    createElement: () => ({ setAttribute() {}, style: {}, select() {} }),
    body: { appendChild() {}, removeChild() {} },
    execCommand: () => { throw new Error('bloqueado') },
  })
  assert.equal(await M.copiarTexto('x4'), false)
})

test('linkWhatsApp: só dígitos, 55 para DDD + telefone, nulo quando curto', () => {
  assert.equal(M.linkWhatsApp('(11) 99999-0000'), 'https://wa.me/5511999990000')
  assert.equal(M.linkWhatsApp('1133334444'), 'https://wa.me/551133334444')
  assert.equal(M.linkWhatsApp('+55 11 99999-0000'), 'https://wa.me/5511999990000')
  assert.equal(M.linkWhatsApp('1234'), null)
})

test('whatsapp mostra o link wa.me seguro; sem a prop, não mostra', () => {
  const m = html({ value: '(11) 99999-0000', whatsapp: true })
  assert.match(m, /<a href="https:\/\/wa\.me\/5511999990000" target="_blank" rel="noopener noreferrer"/)
  assert.match(m, /Abrir no WhatsApp/)
  assert.doesNotMatch(html({ value: '(11) 99999-0000' }), /wa\.me/)
  assert.doesNotMatch(html({ value: 'abc', whatsapp: true }), /wa\.me/)
})

test('o "Copiado" é anunciado por role=status e o rótulo troca (fonte)', () => {
  const src = ler('src/components/ui/copyable-code.tsx')
  assert.match(src, /role="status" aria-live="polite"/)
  assert.match(src, /estado === 'copiado' \? copiedLabel/)
  assert.match(src, /estado === 'erro' \? errorLabel/)
})

test('sem cor fixa no componente', () => {
  assert.equal(ler('src/components/ui/copyable-code.tsx').match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
})

// ─── contraste, dois temas ───
const css = ler('src/styles/globals.css').replace(/\/\*[^]*?\*\//g, '')
const decl = (t) => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*(#[\da-f]{6}|var\(--[\w-]+\))\s*;/gi)].map((m) => [m[1], m[2]]))
const res = (mapa, n) => { let v = mapa[n]; while (v && v.startsWith('var(')) v = mapa[v.slice(4, -1)]; return v }
const bloco = (s) => { const i = css.indexOf(`${s} {`); return css.slice(i, css.indexOf('\n  }', i)) }
const iT = css.indexOf('@theme {')
const base = decl(css.slice(iT, css.indexOf('\n}', iT)))
const TEMAS = { claro: { ...base, ...decl(bloco(':root')) }, escuro: { ...base, ...decl(bloco(':root')), ...decl(bloco('.dark')) } }
const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).map((c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// [descrição, cor, fundo, mínimo]: texto 4,5:1; contorno de controle 3:1 (WCAG 1.4.11)
const PARES = [
  ['texto do código sobre o fundo do campo', '--color-fg', '--color-surface-soft', 4.5],
  ['texto do botão (secondary) sobre o fundo do botão', '--color-fg', '--color-surface-soft', 4.5],
  ['texto do botão (secondary) no hover', '--color-fg', '--color-surface-muted', 4.5],
  ['link do WhatsApp sobre o fundo do campo', '--color-primary-text', '--color-surface-soft', 4.5],
  ['contorno do campo e do botão contra o fundo da página', '--color-border-control', '--color-surface', 3],
]
for (const t of ['claro', 'escuro']) {
  for (const [nome, fg, bg, min] of PARES) {
    test(`contraste, tema ${t}: ${nome} >= ${min}:1`, () => {
      const r = razao(res(TEMAS[t], fg), res(TEMAS[t], bg))
      console.log(`  ${t} ${fg} sobre ${bg}: ${r.toFixed(2)}:1`)
      assert.ok(r >= min, `${r.toFixed(2)}:1`)
    })
  }
}
