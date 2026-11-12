/**
 * Slider: export no pacote, ARIA, alvo de 24 px, cor só por token, contraste nos dois temas e teclado.
 * Parte 1 (sem navegador): renderização no servidor, fonte do componente e contraste lido de globals.css.
 * Parte 2 (Chromium sem interface): setas, PageUp/PageDown, Home/End, onValueCommit e polegar >= 24 px.
 * A parte 2 precisa de `npm i --no-save playwright-core` e de DS_CHROME=/caminho/do/chrome; sem eles é pulada com aviso.
 * Rodar: node --test scripts/slider.test.mjs
 */
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer as criarServidor } from 'node:http'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
const src = (rel) => join(RAIZ, 'src', rel)
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-slider')
const FONTE = ler('src/components/ui/slider.tsx')

// ───────────────────────── Parte 1 ─────────────────────────
let vite
let S
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  S = await vite.ssrLoadModule('/src/components/ui/slider.tsx')
})
after(async () => { await vite?.close() })
const html = (props) => renderToStaticMarkup(React.createElement(S.Slider, props))

test('exporta Slider e SliderProps pelo índice de ui, que o pacote reexporta', () => {
  assert.match(ler('src/components/ui/index.ts'), /export \{ Slider, type SliderProps \} from '\.\/slider'/)
  assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
})

test('dependência com versão exata', () => {
  assert.match(JSON.parse(ler('package.json')).dependencies['@radix-ui/react-slider'], /^\d+\.\d+\.\d+$/)
})

test('role slider com min, max e aria-valuetext (aria-valuenow o Radix põe ao montar: medido no navegador)', () => {
  const m = html({ min: 5, max: 120, step: 5, value: 30, 'aria-label': 'Tempo', getValueText: (v) => `${v} segundos` })
  assert.match(m, /role="slider"/)
  assert.match(m, /aria-valuemin="5"/)
  assert.match(m, /aria-valuemax="120"/)
  assert.match(m, /aria-valuetext="30 segundos"/)
  assert.match(m, /aria-label="Tempo"/)
})

test('sem getValueText não inventa aria-valuetext', () => {
  assert.doesNotMatch(html({ value: 10, 'aria-label': 'x' }), /aria-valuetext/)
})

test('defaultValue sem value: o campo guarda o valor (preenchimento até 40%)', () => {
  assert.match(html({ defaultValue: 40, 'aria-label': 'x' }), /right:60%/)
})

test('polegar de 24 px (h-6 w-6), anel de foco no token e cor só por token', () => {
  assert.match(FONTE, /block h-6 w-6 rounded-full/)
  assert.match(FONTE, /focus-visible:ring-\[var\(--color-ring\)\]/)
  assert.match(FONTE, /bg-\[var\(--color-switch-off\)\]/)
  assert.match(FONTE, /bg-\[var\(--color-switch-on\)\]/)
  assert.equal(FONTE.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
})

// contraste (mesma régua do skeleton.test.mjs, com cor de componente >= 3:1, WCAG 1.4.11)
const css = ler('src/styles/globals.css').replace(/\/\*[^]*?\*\//g, '')
const decl = (t) => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*(#[\da-f]{6}|var\(--[\w-]+\))\s*;/gi)].map((m) => [m[1], m[2]]))
const res = (mapa, n) => { let v = mapa[n]; while (v && v.startsWith('var(')) v = mapa[v.slice(4, -1)]; return v }
const bloco = (s) => { const i = css.indexOf(`${s} {`); return css.slice(i, css.indexOf('\n  }', i)) }
const iT = css.indexOf('@theme {')
const base = decl(css.slice(iT, css.indexOf('\n}', iT)))
const TEMAS = { claro: { ...base, ...decl(bloco(':root')) }, escuro: { ...base, ...decl(bloco(':root')), ...decl(bloco('.dark')) } }
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const lum = (h) => { const [r, g, b] = rgb(h).map((c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// O token usado no componente é lido do fonte: trocar o token no componente muda o que se mede.
const tokenDe = (classe) => FONTE.match(new RegExp(`${classe}-\\[var\\((--[\\w-]+)\\)\\]`))[1]
const TRILHO = tokenDe('bg')  // primeira ocorrência de bg-[var()] = trilho
const PREENCHIDO = FONTE.match(/Range[^>]*bg-\[var\((--[\w-]+)\)\]/)[1]
const BORDA_POLEGAR = FONTE.match(/border-\[var\((--[\w-]+)\)\]/)[1]
const FUNDOS = ['--color-surface', '--color-surface-soft']

for (const t of ['claro', 'escuro']) {
  for (const fundo of FUNDOS) {
    for (const [nome, tk] of [['trilho', TRILHO], ['parte preenchida', PREENCHIDO], ['borda do polegar', BORDA_POLEGAR]]) {
      test(`contraste, tema ${t}, ${nome} (${tk}) sobre ${fundo}: >= 3:1`, () => {
        const r = razao(res(TEMAS[t], tk), res(TEMAS[t], fundo))
        console.log(`  ${t} ${nome} / ${fundo}: ${r.toFixed(2)}:1`)
        assert.ok(r >= 3, `${r.toFixed(2)}:1`)
      })
    }
  }
}

// No escuro a diferença é de matiz (azul sobre cinza) mais a posição do polegar; só a luminosidade dá 1,27:1. O que a WCAG 1.4.11 pede é cada parte contra o fundo (3:1, acima).
test('trilho e preenchido: diferença de luminosidade >= 1,2:1 nos dois temas (piso, medido)', () => {
  for (const t of ['claro', 'escuro']) {
    const r = razao(res(TEMAS[t], PREENCHIDO), res(TEMAS[t], TRILHO))
    console.log(`  ${t} preenchido / trilho: ${r.toFixed(2)}:1`)
    assert.ok(r >= 1.2, `${t}: ${r.toFixed(2)}:1`)
  }
})

// ───────────────────────── Parte 2 ─────────────────────────
let playwright = null
const CHROME = process.env.DS_CHROME || ''
for (const nome of ['playwright', 'playwright-core']) {
  try { playwright = await import(nome); break } catch { /* próximo */ }
}
let semNavegador = ''
if (!playwright) semNavegador = 'playwright não instalado (npm i --no-save playwright-core, com DS_CHROME)'
else if (!existsSync(CHROME || playwright.chromium.executablePath())) {
  semNavegador = CHROME ? `DS_CHROME não existe: ${CHROME}` : 'Chromium do playwright não instalado (ou DS_CHROME com um Chrome instalado)'
}
if (semNavegador) console.warn(`slider: parte 2 (navegador) pulada. ${semNavegador}`)

const rel = (alvo) => {
  const r = relative(join(TMP, 'pagina'), alvo).split('\\').join('/')
  return r.startsWith('.') ? r : `./${r}`
}
const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`
const ESTILO = `@import '${rel(src('styles/globals.css'))}';\n@source '${rel(src(''))}';\n`
const PAGINA = `
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './estilo.css'
import { Slider } from '${src('components/ui/slider.tsx')}'

function App() {
  const [v, setV] = useState(30)
  const [c, setC] = useState('nenhum')
  return (
    <div style={{ padding: 24, width: 300 }}>
      <Slider aria-label="Tempo" min={0} max={100} step={5} value={v} onValueChange={setV}
        onValueCommit={(x) => setC(String(x))} getValueText={(x) => x + ' segundos'} />
      <output id="valor">{v}</output>
      <output id="commit">{c}</output>
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2' }

describe('Slider no navegador', { skip: semNavegador || false }, () => {
  const PAG = join(TMP, 'pagina')
  const DIST = join(PAG, 'dist')
  let servidor, browser, page

  before(async () => {
    rmSync(PAG, { recursive: true, force: true })
    mkdirSync(PAG, { recursive: true })
    writeFileSync(join(PAG, 'index.html'), HTML)
    writeFileSync(join(PAG, 'main.tsx'), PAGINA)
    writeFileSync(join(PAG, 'estilo.css'), ESTILO)
    await build({
      root: PAG, configFile: false, base: './', logLevel: 'silent', esbuild: { jsx: 'automatic' },
      plugins: [react(), tailwindcss()],
      build: { outDir: DIST, emptyOutDir: true, minify: false, rollupOptions: { input: join(PAG, 'index.html') } },
    })
    servidor = criarServidor((req, res) => {
      const caminho = new URL(req.url, 'http://x').pathname
      const arquivo = join(DIST, caminho === '/' ? 'index.html' : caminho)
      if (!arquivo.startsWith(DIST) || !existsSync(arquivo)) { res.writeHead(404).end(); return }
      res.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] || 'application/octet-stream' })
      res.end(readFileSync(arquivo))
    })
    await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok))
    browser = await playwright.chromium.launch({ headless: true, ...(CHROME && { executablePath: CHROME }) })
    page = await (await browser.newContext({ viewport: { width: 400, height: 300 }, locale: 'pt-BR' })).newPage()
    await page.goto(`http://127.0.0.1:${servidor.address().port}/`)
    await page.waitForSelector('[role="slider"]')
  })
  after(async () => {
    await browser?.close()
    await new Promise((ok) => (servidor ? servidor.close(ok) : ok()))
    rmSync(TMP, { recursive: true, force: true })
  })

  const valor = () => page.locator('[role="slider"]').getAttribute('aria-valuenow')

  test('alvo: o polegar mede >= 24 x 24 px', async () => {
    const b = await page.locator('[role="slider"]').boundingBox()
    assert.ok(b.width >= 24 && b.height >= 24, JSON.stringify(b))
  })

  test('teclado: setas, PageUp/PageDown, Home e End', async () => {
    await page.locator('[role="slider"]').focus()
    assert.equal(await valor(), '30')
    await page.keyboard.press('ArrowRight'); assert.equal(await valor(), '35')
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft'); assert.equal(await valor(), '25')
    await page.keyboard.press('PageUp'); assert.equal(await valor(), '75')
    await page.keyboard.press('PageDown'); assert.equal(await valor(), '25')
    await page.keyboard.press('End'); assert.equal(await valor(), '100')
    await page.keyboard.press('Home'); assert.equal(await valor(), '0')
  })

  test('aria-valuetext acompanha o valor e o estado controlado muda', async () => {
    await page.keyboard.press('ArrowRight')
    assert.equal(await page.locator('[role="slider"]').getAttribute('aria-valuetext'), '5 segundos')
    assert.equal(await page.locator('#valor').textContent(), '5')
  })

  test('onValueCommit dispara pela tecla', async () => {
    await page.keyboard.press('ArrowRight')
    assert.equal(await page.locator('#commit').textContent(), '10')
  })

  test('arrastar o polegar muda o valor', async () => {
    const trilho = await page.locator('[data-orientation="horizontal"]').first().boundingBox()
    await page.mouse.move(trilho.x + 5, trilho.y + trilho.height / 2)
    await page.mouse.down()
    await page.mouse.move(trilho.x + trilho.width * 0.5, trilho.y + trilho.height / 2, { steps: 5 })
    await page.mouse.up()
    const v = Number(await valor())
    assert.ok(v >= 40 && v <= 60, `valor ${v}`)
  })
})
