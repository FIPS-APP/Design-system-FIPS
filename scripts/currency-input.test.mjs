/**
 * CurrencyInput: export, leitura de texto (digitado e colado), formatação e digitação no componente.
 * Rodar: node --test scripts/currency-input.test.mjs
 */
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer as criarHttp } from 'node:http'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
let vite, M, C
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  M = await vite.ssrLoadModule('/src/components/ui/currency.ts')
  C = await vite.ssrLoadModule('/src/components/ui/currency-input.tsx')
})
after(async () => { await vite?.close() })

test('exporta CurrencyInput, props e helpers pelo índice de ui', () => {
  const idx = ler('src/components/ui/index.ts')
  assert.match(idx, /export \{ CurrencyInput, type CurrencyInputProps \} from '\.\/currency-input'/)
  assert.match(idx, /export \{ formatCurrency, parseCurrency \} from '\.\/currency'/)
})

const LER = [
  ['1.234,56', '1234.56'], ['1234.56', '1234.56'], ['1.234', '1234'], ['1234,5', '1234.50'],
  ['12.5', '12.50'], ['1.234.567,89', '1234567.89'], ['R$ 10,00', '10.00'], ['0,5', '0.50'],
  [',5', '0.50'], ['007', '7'], ['1234,567', '1234.56'], ['abc', ''], ['', ''], ['0', '0'], ['-5,00', '5.00'],
]
for (const [entrada, saida] of LER) {
  test(`parseCurrency(${JSON.stringify(entrada)}) = ${JSON.stringify(saida)}`, () => {
    assert.equal(M.parseCurrency(entrada), saida)
  })
}

test('negativo só com allowNegative; "-0" não vira negativo', () => {
  assert.equal(M.parseCurrency('-1.234,50', true), '-1234.50')
  assert.equal(M.parseCurrency('-1.234,50', false), '1234.50')
  assert.equal(M.parseCurrency('-0,00', true), '0.00')
  assert.equal(M.sanitizeCurrencyDraft('-12a,3', true), '-12,3')
  assert.equal(M.sanitizeCurrencyDraft('-12a,3', false), '12,3')
})

test('formatCurrency: milhar com ponto, vírgula decimal, duas casas', () => {
  assert.equal(M.formatCurrency('1234567.8'), '1.234.567,80')
  assert.equal(M.formatCurrency('1234'), '1.234,00')
  assert.equal(M.formatCurrency('0'), '0,00')
  assert.equal(M.formatCurrency('-1500.5'), '-1.500,50')
  assert.equal(M.formatCurrency(''), '')
  assert.equal(M.formatCurrency('x'), '')
})

test('idempotência: formatar e ler devolve o mesmo valor', () => {
  for (const v of ['0.01', '999.99', '1000.00', '123456789012.34']) assert.equal(M.parseCurrency(M.formatCurrency(v)), v)
})

const html = (props) => renderToStaticMarkup(React.createElement(C.CurrencyInput, { onValueChange() {}, ...props }))

test('mostra o valor formatado, símbolo R$, inputMode decimal e repassa aria-invalid e id', () => {
  const m = html({ value: '1234.5', id: 'v', 'aria-invalid': true })
  assert.match(m, /value="1\.234,50"/)
  assert.match(m, /inputMode="decimal"/)
  assert.match(m, /type="text"/)
  assert.match(m, /id="v"/)
  assert.match(m, /aria-invalid="true"/)
  assert.match(m, /<span[^>]*aria-hidden="true"[^>]*>R\$<\/span>/)
})

test('showSymbol={false} tira o R$; vazio mostra campo vazio', () => {
  assert.doesNotMatch(html({ value: '', showSymbol: false }), /R\$/)
  assert.match(html({ value: '' }), /value=""/)
})

// ───────────────────────── Digitação no navegador (DS_CHROME ou chromium do playwright) ─────────────────────────
let playwright = null
let semNavegador = ''
const CHROME = process.env.DS_CHROME || ''
for (const nome of ['playwright', 'playwright-core']) {
  try { playwright = await import(nome); break } catch { /* tenta o próximo */ }
}
if (!playwright) semNavegador = 'playwright não instalado'
else if (!existsSync(CHROME || playwright.chromium.executablePath())) semNavegador = 'sem Chrome (DS_CHROME)'
if (semNavegador) console.warn(`currency-input: digitação no navegador pulada. ${semNavegador}`)

const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-currency-input')
const PAG = join(TMP, 'pagina')
const DIST = join(PAG, 'dist')
const PAGINA = `
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import { CurrencyInput } from '${join(RAIZ, 'src/components/ui/currency-input.tsx')}'
import { Field, FieldLabel } from '${join(RAIZ, 'src/components/ui/field.tsx')}'
function App() {
  const neg = new URLSearchParams(location.search).get('neg') === '1'
  const [v, setV] = useState('')
  return (
    <Field style={{ width: 280, padding: 20 }}>
      <FieldLabel htmlFor="v">Valor (R$)</FieldLabel>
      <CurrencyInput id="v" value={v} onValueChange={setV} allowNegative={neg} />
      <output id="saida">{v}</output>
      <button id="fora">fora</button>
    </Field>
  )
}
createRoot(document.getElementById('root')).render(<App />)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' }

describe('CurrencyInput no navegador', { skip: semNavegador || false }, () => {
  let servidor, base, browser
  before(async () => {
    rmSync(TMP, { recursive: true, force: true })
    mkdirSync(PAG, { recursive: true })
    writeFileSync(join(PAG, 'index.html'), '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>')
    writeFileSync(join(PAG, 'main.tsx'), PAGINA)
    await build({
      root: PAG, configFile: false, base: './', logLevel: 'silent', esbuild: { jsx: 'automatic' }, plugins: [react()],
      build: { outDir: DIST, emptyOutDir: true, minify: false, rollupOptions: { input: join(PAG, 'index.html') } },
    })
    servidor = criarHttp((req, res) => {
      const c = new URL(req.url, 'http://x').pathname
      const a = join(DIST, c === '/' ? 'index.html' : c)
      if (!a.startsWith(DIST) || !existsSync(a)) { res.writeHead(404).end(); return }
      res.writeHead(200, { 'content-type': TIPOS[extname(a)] || 'application/octet-stream' })
      res.end(readFileSync(a))
    })
    await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok))
    base = `http://127.0.0.1:${servidor.address().port}/`
    browser = await playwright.chromium.launch({ headless: true, ...(CHROME && { executablePath: CHROME }) })
  })
  after(async () => {
    await browser?.close()
    await new Promise((ok) => (servidor ? servidor.close(ok) : ok()))
    rmSync(TMP, { recursive: true, force: true })
  })

  async function abrir(q = '') {
    const page = await (await browser.newContext({ locale: 'pt-BR' })).newPage()
    await page.goto(base + q)
    await page.waitForSelector('#v')
    return page
  }
  const saida = (page) => page.locator('#saida').textContent()
  const campo = (page) => page.locator('#v').inputValue()

  test('digitar 1234,56: entrega 1234.56, mostra o digitado com foco e formata ao sair', async () => {
    const page = await abrir()
    await page.locator('#v').click()
    await page.keyboard.type('1234,56')
    assert.equal(await saida(page), '1234.56')
    assert.equal(await campo(page), '1234,56')
    await page.locator('#fora').click()
    assert.equal(await campo(page), '1.234,56')
    assert.equal(await saida(page), '1234.56')
    await page.context().close()
  })

  test('colar 1.234,56 e 1234.56 dá o mesmo valor; letras são ignoradas', async () => {
    const page = await abrir()
    await page.locator('#v').click()
    await page.locator('#v').fill('1.234,56')
    assert.equal(await saida(page), '1234.56')
    await page.locator('#v').fill('1234.56')
    assert.equal(await saida(page), '1234.56')
    await page.locator('#v').fill('')
    await page.keyboard.type('a1b2')
    assert.equal(await saida(page), '12')
    assert.equal(await campo(page), '12')
    await page.context().close()
  })

  test('voltar ao campo mostra o valor formatado e continua editável; limpar entrega vazio', async () => {
    const page = await abrir()
    await page.locator('#v').click()
    await page.keyboard.type('5')
    await page.locator('#fora').click()
    assert.equal(await campo(page), '5,00')
    await page.locator('#v').click()
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Backspace')
    assert.equal(await saida(page), '')
    await page.context().close()
  })

  test('negativo: sem allowNegative o menos some; com allowNegative fica', async () => {
    let page = await abrir()
    await page.locator('#v').click()
    await page.keyboard.type('-10,5')
    assert.equal(await saida(page), '10.50')
    await page.context().close()
    page = await abrir('?neg=1')
    await page.locator('#v').click()
    await page.keyboard.type('-10,5')
    assert.equal(await saida(page), '-10.50')
    await page.context().close()
  })

  test('rótulo do Field aponta para o campo (clicar no rótulo foca)', async () => {
    const page = await abrir()
    await page.locator('label[for="v"]').click()
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'v')
    await page.context().close()
  })
})
