/**
 * Radio, RadioGroup e Checkbox: marcação (rótulo clicável, descrição, erro, aria),
 * exports do barrel e teclado de verdade (setas no grupo de rádio) em Chrome headless.
 * O teclado só roda se o pacote `playwright` resolver (senão o teste é pulado).
 * Rodar: npm test
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
let vite
let M
const h = React.createElement

before(async () => {
  vite = await createServer({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    esbuild: { jsx: 'automatic' },
    optimizeDeps: { noDiscovery: true },
  })
  const [checkbox, radio] = await Promise.all([
    vite.ssrLoadModule('/src/components/ui/checkbox.tsx'),
    vite.ssrLoadModule('/src/components/ui/radio.tsx'),
  ])
  M = { ...checkbox, ...radio }
})
after(async () => { await vite?.close() })

const html = (el) => renderToStaticMarkup(el)
const id = (marcacao, tag) => marcacao.match(new RegExp(`<${tag}[^>]*\\sid="([^"]+)"`))?.[1]

test('barrel: Checkbox, Radio e RadioGroup (com tipos) saem de src/index.ts', () => {
  const fonte = readFileSync(join(RAIZ, 'src/components/ui/index.ts'), 'utf8')
  assert.match(fonte, /export \{ Checkbox, type CheckboxProps \} from '\.\/checkbox'/)
  assert.match(fonte, /Radio,\s*RadioGroup,\s*type RadioProps,\s*type RadioGroupProps/)
  const raiz = readFileSync(join(RAIZ, 'src/index.ts'), 'utf8')
  assert.match(raiz, /export \* from '\.\/components\/ui'/)
})

test('Checkbox: rótulo aponta para a caixa (clicável), type=checkbox', () => {
  const m = html(h(M.Checkbox, { label: 'Aceito os termos' }))
  const inputId = id(m, 'input')
  assert.ok(inputId)
  assert.match(m, new RegExp(`<label[^>]*for="${inputId.replace(/:/g, ':')}"`))
  assert.match(m, /type="checkbox"/)
  assert.doesNotMatch(m, /aria-invalid|aria-describedby/)
})

test('Checkbox: descrição e erro entram em aria-describedby; erro liga aria-invalid', () => {
  const m = html(h(M.Checkbox, { label: 'Termos', description: 'Leia antes', error: 'Obrigatório aceitar', 'aria-describedby': 'extra' }))
  const inputId = id(m, 'input')
  assert.match(m, new RegExp(`aria-describedby="extra ${inputId}-desc ${inputId}-err"`))
  assert.match(m, /aria-invalid="true"/)
  assert.match(m, new RegExp(`<p[^>]*id="${inputId}-desc"[^>]*>Leia antes`))
  assert.match(m, new RegExp(`<p[^>]*id="${inputId}-err"[^>]*>Obrigatório aceitar`))
})

test('Checkbox: desabilitado, obrigatório e marcado chegam no input', () => {
  const m = html(h(M.Checkbox, { label: 'X', disabled: true, required: true, defaultChecked: true, indeterminate: true }))
  assert.match(m, /disabled=""/)
  assert.match(m, /required=""/)
  assert.match(m, /checked=""/)
  assert.match(m, /data-indeterminate="true"/)
  assert.match(m, /obrigatório/)
})

test('RadioGroup: role=radiogroup nomeado pelo rótulo, aria-required, opções com o mesmo name', () => {
  const m = html(
    h(M.RadioGroup, { label: 'Nível', name: 'nivel', defaultValue: 'b', required: true },
      h(M.Radio, { value: 'a', label: 'Alto' }),
      h(M.Radio, { value: 'b', label: 'Médio' }),
      h(M.Radio, { value: 'c', label: 'Baixo' })),
  )
  const rotuloId = m.match(/aria-labelledby="([^"]+)"/)?.[1]
  assert.ok(rotuloId)
  assert.match(m, new RegExp(`<span id="${rotuloId}"`))
  assert.match(m, /role="radiogroup"/)
  assert.match(m, /aria-required="true"/)
  assert.equal(m.match(/name="nivel"/g).length, 3)
  assert.equal(m.match(/type="radio"/g).length, 3)
  assert.equal(m.match(/checked=""/g).length, 1)
  assert.match(m, /<input[^>]*value="b"[^>]*checked=""|<input[^>]*checked=""[^>]*value="b"/)
})

test('RadioGroup: erro liga aria-invalid no grupo e aria-describedby no grupo e nas opções', () => {
  const m = html(
    h(M.RadioGroup, { label: 'Parecer', description: 'Escolha um', error: 'Falta o parecer' },
      h(M.Radio, { value: 'a', label: 'Aprovado', description: 'Sem ressalvas' })),
  )
  assert.match(m, /role="radiogroup"[^>]*aria-invalid="true"|aria-invalid="true"[^>]*role="radiogroup"/)
  const grupo = m.match(/aria-describedby="([^"]+)"/)[1]
  assert.match(grupo, /-desc .*-err$/)
  const opcao = m.match(/<input[^>]*aria-describedby="([^"]+)"/)[1]
  assert.ok(opcao.startsWith(grupo), `opção: ${opcao}`)
  assert.match(m, /Falta o parecer/)
  assert.match(m, /data-invalid="true"/)
})

test('RadioGroup: desabilitado desliga todas as opções; opção sozinha também', () => {
  const g = html(h(M.RadioGroup, { 'aria-label': 'G', disabled: true }, h(M.Radio, { value: 'a', label: 'A' }), h(M.Radio, { value: 'b', label: 'B' })))
  assert.equal(g.match(/disabled=""/g).length, 2)
  const o = html(h(M.RadioGroup, { 'aria-label': 'G' }, h(M.Radio, { value: 'a', label: 'A', disabled: true }), h(M.Radio, { value: 'b', label: 'B' })))
  assert.equal(o.match(/disabled=""/g).length, 1)
})

test('RadioGroup pílula: opção é uma label em pílula com a caixa nativa escondida (sr-only), horizontal', () => {
  const m = html(h(M.RadioGroup, { 'aria-label': 'Nível', variant: 'pill', defaultValue: 'a' }, h(M.Radio, { value: 'a', label: 'Alto' }), h(M.Radio, { value: 'b', label: 'Baixo' })))
  assert.match(m, /data-orientation="horizontal"/)
  assert.equal(m.match(/class="peer sr-only"/g).length, 2)
  assert.match(m, /rounded-full/)
  assert.match(m, /<label[^>]*for=/)
})

test('Radio fora de RadioGroup falha com mensagem clara', () => {
  assert.throws(() => html(h(M.Radio, { value: 'a', label: 'A' })), /RadioGroup/)
})

test('teclado: setas movem e marcam a opção, Tab sai do grupo (Chrome headless)', async (t) => {
  let playwright
  try { playwright = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright') } catch { return t.skip('playwright não resolvido') }
  const chromium = (playwright.default ?? playwright).chromium
  let browser
  try { browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined }) } catch (e) { return t.skip(`chromium indisponível: ${e.message}`) }
  try {
    const page = await browser.newPage()
    const marcacao = html(
      h('div', null,
        h('button', { id: 'antes' }, 'antes'),
        h(M.RadioGroup, { label: 'Nível', name: 'n', defaultValue: 'a', variant: 'pill' },
          h(M.Radio, { value: 'a', label: 'Alto' }), h(M.Radio, { value: 'b', label: 'Médio' }), h(M.Radio, { value: 'c', label: 'Baixo' })),
        h(M.Checkbox, { label: 'Ciente', id: 'ck' })),
    )
    await page.setContent(`<!doctype html><body>${marcacao}</body>`)
    await page.focus('#antes')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.value), 'a')
    await page.keyboard.press('ArrowRight')
    assert.equal(await page.evaluate(() => document.activeElement.value), 'b')
    assert.equal(await page.evaluate(() => document.activeElement.checked), true)
    await page.keyboard.press('ArrowDown')
    assert.equal(await page.evaluate(() => document.activeElement.value), 'c')
    await page.keyboard.press('ArrowRight')
    assert.equal(await page.evaluate(() => document.activeElement.value), 'a', 'volta ao primeiro')
    await page.keyboard.press('ArrowLeft')
    assert.equal(await page.evaluate(() => document.activeElement.value), 'c')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.id), 'ck', 'Tab sai do grupo para o checkbox')
    await page.keyboard.press('Space')
    assert.equal(await page.evaluate(() => document.activeElement.checked), true)
    await page.click('label[for="ck"]')
    assert.equal(await page.evaluate(() => document.getElementById('ck').checked), false, 'clicar no rótulo alterna')
  } finally {
    await browser.close()
  }
})
