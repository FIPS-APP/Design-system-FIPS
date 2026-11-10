/**
 * AbasDeSecao: papéis, teclado e 375 px. Renderiza o componente de verdade.
 * Papéis e atributos: build em memória com o vite do repo + react-dom/server.
 * Teclado e 375 px: Chrome headless, só se `playwright-core` resolver (ou PLAYWRIGHT_CORE apontar
 * para ele) e o site de docs estiver de pé em ABAS_URL (padrão http://localhost:5191); senão pula.
 * Rodar: npm run test:abas
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-abas-de-secao')
let React, renderToStaticMarkup, AbasDeSecao, indiceDaTecla, propsDoPainel, Icone

before(async () => {
  const entrada = join(TMP, 'entrada.tsx')
  mkdirSync(TMP, { recursive: true })
  writeFileSync(
    entrada,
    `export { AbasDeSecao } from '${join(RAIZ, 'src/components/composites/AbasDeSecao.tsx')}'\n` +
      `export { indiceDaTecla, propsDoPainel } from '${join(RAIZ, 'src/components/composites/abasDeSecaoUtil.ts')}'\n` +
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
  const m = await import(pathToFileURL(arquivo).href)
  ;({ AbasDeSecao, indiceDaTecla, propsDoPainel, Sparkles: Icone } = m)
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  ;({ renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href))
})

after(() => rmSync(TMP, { recursive: true, force: true }))

const ABAS = [
  { id: 'a', label: 'Ficha da meta', icon: undefined },
  { id: 'b', label: 'Resultados e gráficos' },
  { id: 'c', label: 'Histórico' },
]
const html = (props) => renderToStaticMarkup(React.createElement(AbasDeSecao, { abas: ABAS, ativa: 'b', ...props }))

test('sem href: tablist com tab, aria-selected e tabindex móvel; sem nav nem aria-current', () => {
  const s = html({ label: 'Abas da meta' })
  assert.match(s, /role="tablist"[^>]*aria-label="Abas da meta"/)
  assert.equal((s.match(/role="tab"/g) ?? []).length, 3)
  assert.equal((s.match(/aria-selected="true"/g) ?? []).length, 1)
  assert.match(s, /<button[^>]*role="tab"[^>]*aria-selected="true"[^>]*tabindex="0"[^>]*>(?:(?!<\/button>).)*Resultados e gráficos/)
  assert.equal((s.match(/tabindex="-1"/g) ?? []).length, 2)
  assert.doesNotMatch(s, /<nav|aria-current/)
})

test('com idBase: a aba ativa tem aria-controls para o painel e propsDoPainel devolve o par', () => {
  const s = html({ idBase: 'x' })
  assert.match(s, /id="x-aba-b"[^>]*aria-controls="x-painel-b"/)
  // Só a ativa aponta: o painel das outras não está no DOM.
  assert.equal((s.match(/aria-controls=/g) ?? []).length, 1)
  assert.deepEqual(propsDoPainel('x', 'b'), { role: 'tabpanel', id: 'x-painel-b', 'aria-labelledby': 'x-aba-b', tabIndex: 0 })
})

test('sem idBase: nenhum aria-controls (o painel está fora do componente)', () => {
  assert.doesNotMatch(html({}), /aria-controls/)
})

test('com href: nav com links e aria-current="page", sem papéis de aba', () => {
  const s = html({ abas: ABAS.map((a) => ({ ...a, href: `/${a.id}` })), label: 'Seções do app' })
  assert.match(s, /<nav[^>]*aria-label="Seções do app"/)
  assert.match(s, /<a [^>]*aria-current="page"[^>]*href="\/b"|<a [^>]*href="\/b"[^>]*aria-current="page"/)
  assert.doesNotMatch(s, /role="tab|aria-selected/)
})

test('indiceDaTecla: setas com volta nas pontas, Home, End e tecla que não move', () => {
  assert.equal(indiceDaTecla('ArrowRight', 0, 3), 1)
  assert.equal(indiceDaTecla('ArrowRight', 2, 3), 0)
  assert.equal(indiceDaTecla('ArrowLeft', 0, 3), 2)
  assert.equal(indiceDaTecla('ArrowLeft', 2, 3), 1)
  assert.equal(indiceDaTecla('Home', 2, 3), 0)
  assert.equal(indiceDaTecla('End', 0, 3), 2)
  assert.equal(indiceDaTecla('a', 0, 3), -1)
  assert.equal(indiceDaTecla('End', 0, 0), -1)
})

// ---------------------------------------------------------------------------------------------
// Navegador: teclado e 375 px
// ---------------------------------------------------------------------------------------------
const URL_DOC = `${process.env.ABAS_URL ?? 'http://localhost:5191'}/docs/components/abas-de-secao`
let pw = null
try {
  pw = process.env.PLAYWRIGHT_CORE
    ? createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE)
    : createRequire(import.meta.url)('playwright-core')
} catch {
  pw = null
}
const pular = pw ? false : 'playwright-core não resolve (defina PLAYWRIGHT_CORE)'

async function comPagina(largura, fn) {
  const browser = await pw.chromium.launch({ channel: process.env.ABAS_CHANNEL || 'chrome' })
  try {
    const page = await browser.newPage({ viewport: { width: largura, height: 900 } })
    await page.goto(URL_DOC, { waitUntil: 'networkidle' })
    await fn(page)
  } finally {
    await browser.close()
  }
}

test('teclado: setas, Home e End movem o foco e a seleção, com tabindex móvel', { skip: pular }, async () => {
  await comPagina(1440, async (page) => {
    const demo = page.locator('[data-demo="seis"]')
    const abas = demo.getByRole('tab')
    assert.equal(await abas.count(), 6)
    assert.equal(await demo.getByRole('tab', { selected: true }).innerText(), 'Ajuda')
    await abas.nth(5).focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(await demo.getByRole('tab', { selected: true }).innerText(), 'Início')
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Início')
    await page.keyboard.press('End')
    assert.equal(await demo.getByRole('tab', { selected: true }).innerText(), 'Ajuda')
    await page.keyboard.press('Home')
    await page.keyboard.press('ArrowRight')
    assert.equal(await demo.getByRole('tab', { selected: true }).innerText(), 'Registro')
    assert.equal(await demo.locator('[role="tab"][tabindex="0"]').count(), 1)
    await page.keyboard.press('ArrowLeft')
    assert.equal(await demo.getByRole('tab', { selected: true }).innerText(), 'Início')
  })
})

test('375 px: faixa rola, mostra o fade na borda com mais abas e nenhum rótulo é cortado no meio', { skip: pular }, async () => {
  await comPagina(375, async (page) => {
    const demo = page.locator('[data-demo="seis"]')
    const faixa = demo.locator('.abas-secao-faixa')
    const m = await faixa.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }))
    assert.ok(m.sw > m.cw, `a faixa deveria rolar (${m.sw} > ${m.cw})`)
    // Ajuda é a ativa: a faixa rolou até o fim, então só a borda esquerda tem mais abas.
    assert.equal(await faixa.getAttribute('data-rolagem-esq'), '')
    assert.equal(await faixa.getAttribute('data-rolagem-dir'), null)
    assert.match(await faixa.evaluate((el) => getComputedStyle(el).maskImage), /linear-gradient/)
    await faixa.evaluate((el) => (el.scrollLeft = 0))
    await page.waitForFunction(() => document.querySelector('[data-demo="seis"] .abas-secao-faixa')?.hasAttribute('data-rolagem-dir'))
    assert.equal(await faixa.getAttribute('data-rolagem-esq'), null)
    // Nenhum rótulo quebra em duas linhas: altura do texto = uma linha.
    const quebras = await demo.getByRole('tab').evaluateAll((els) => els.map((e) => e.scrollHeight <= e.clientHeight + 1))
    assert.ok(quebras.every(Boolean))
    // A página não rola de lado.
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
  })
})

function lum([r, g, b]) {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

for (const esquema of ['light', 'dark']) {
  test(`foco do teclado da aba: anel de pelo menos 3:1 contra o fundo (${esquema})`, { skip: pular }, async () => {
    const browser = await pw.chromium.launch({ channel: process.env.ABAS_CHANNEL || 'chrome' })
    try {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: esquema })
      const page = await ctx.newPage()
      await page.addInitScript(() => { try { localStorage.setItem('fips_ds_tour_v1', '1') } catch {} })
      await page.goto(URL_DOC, { waitUntil: 'networkidle' })
      if (esquema === 'dark') await page.evaluate(() => document.documentElement.classList.add('dark'))
      const demo = page.locator('[data-demo="seis"]')
      await demo.scrollIntoViewIfNeeded()
      await demo.getByRole('tab').first().focus()
      await page.keyboard.press('ArrowRight')
      const cores = await demo.getByRole('tab', { selected: true }).evaluate((el) => {
        const cs = getComputedStyle(el)
        const rgb = (c) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
        const sombra = cs.boxShadow
        const anel = rgb(sombra.match(/rgba?\([^)]*\)/g)?.find((c) => !/, 0\)$/.test(c)) ?? '')
        const fundo = rgb(getComputedStyle(el.closest('.abas-secao-faixa')).backgroundColor)
        return { anel, fundo, sombra }
      })
      assert.equal(cores.anel.length, 3, `anel não achado: ${cores.sombra}`)
      const r = razao(cores.anel, cores.fundo)
      assert.ok(r >= 3, `anel ${cores.anel} sobre ${cores.fundo} = ${r.toFixed(2)}:1`)
      console.log(`# foco ${esquema}: ${r.toFixed(2)}:1`)
    } finally {
      await browser.close()
    }
  })
}
