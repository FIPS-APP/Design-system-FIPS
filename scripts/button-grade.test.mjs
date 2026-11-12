/**
 * Button size="grade": botão de grade densa (1 botão por célula).
 *
 * Parte 1, sem navegador: as classes do tamanho (altura mínima do sm, padding lateral menor,
 * quebra de linha, largura máxima do pai) e que sm e os demais tamanhos não mudaram.
 * Parte 2, no navegador (Chromium sem interface): uma célula de 72 px com "Não se aplica"
 * quebra em 2 linhas, o botão não passa da célula e a altura é no mínimo a do sm.
 * Precisa de playwright-core e de um Chrome: `npm i --no-save playwright-core` e
 * `DS_CHROME=/caminho/do/chrome`. Sem eles a parte 2 é pulada e o aviso diz o motivo.
 *
 * Rodar: npm run test:grade (a parte 1 também roda no npm test)
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

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-button-grade')
const src = (rel) => join(RAIZ, 'src', rel)

// ───────────────────────── Parte 1: sem navegador ─────────────────────────

describe('Button grade: classes', () => {
  let vite, V, cn
  before(async () => {
    vite = await createServer({
      root: RAIZ, configFile: false, logLevel: 'silent',
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
    })
    V = await vite.ssrLoadModule('/src/components/ui/button-variants.ts')
    cn = (await vite.ssrLoadModule('/src/lib/cn.ts')).cn
  })
  after(async () => { await vite?.close() })

  // Como o Button monta: cn (tailwind-merge) em cima das classes do cva.
  const classes = (size) => cn(V.buttonVariants({ size })).split(/\s+/)

  test('altura mínima de 30 px, a do sm, e sem altura fixa', () => {
    const g = classes('grade')
    assert.ok(g.includes('min-h-[30px]'))
    assert.ok(g.includes('h-auto'))
    assert.ok(!g.includes('h-[30px]'))
  })

  test('texto quebra, centralizado, sem passar da largura do pai', () => {
    const g = classes('grade')
    for (const k of ['whitespace-normal', 'text-center', 'max-w-full', 'break-words']) assert.ok(g.includes(k), k)
    assert.ok(!g.includes('whitespace-nowrap'), 'o nowrap da base some')
  })

  test('mesma fonte e ícone do sm, padding lateral menor', () => {
    const g = classes('grade'); const sm = classes('sm')
    for (const k of ['text-[12px]', '[&_svg]:size-3.5']) assert.ok(g.includes(k) && sm.includes(k), k)
    assert.ok(sm.includes('px-3.5') && g.includes('px-2'))
  })

  test('sm, md e touch não mudam', () => {
    assert.ok(classes('sm').includes('h-[30px]') && classes('sm').includes('whitespace-nowrap'))
    assert.ok(classes('md').includes('h-9'))
    assert.ok(classes('touch').includes('h-12'))
  })
})

// ───────────────────────── Parte 2: navegador ─────────────────────────

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
if (semNavegador) console.warn(`button-grade: parte 2 (navegador) pulada. ${semNavegador}`)

const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`
const rel = (alvo) => {
  const r = relative(join(TMP, 'pagina'), alvo).split('\\').join('/')
  return r.startsWith('.') ? r : `./${r}`
}
const ESTILO = `@import '${rel(src('styles/globals.css'))}';\n@source '${rel(src(''))}';\n`
const PAGINA = `
import { createRoot } from 'react-dom/client'
import './estilo.css'
import { Button } from '${src('components/ui/button.tsx')}'

function Celula({ id, size, children, cheio }) {
  return (
    <div id={id} style={{ width: 72, border: '1px dashed #94a3b8', boxSizing: 'border-box' }}>
      <Button variant="outline" size={size} className={cheio ? 'w-full' : undefined}>{children}</Button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <div style={{ display: 'flex', gap: 8, padding: 16, alignItems: 'flex-start' }}>
    <Celula id="grade" size="grade">Não se aplica</Celula>
    <Celula id="grade-cheio" size="grade" cheio>Não se aplica</Celula>
    <Celula id="grade-curto" size="grade" cheio>Lançar</Celula>
    <Celula id="sm" size="sm">Não se aplica</Celula>
  </div>
)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2' }

describe('Button grade no navegador', { skip: semNavegador || false }, () => {
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
    page = await (await browser.newContext({ viewport: { width: 800, height: 400 }, locale: 'pt-BR' })).newPage()
    await page.goto(`http://127.0.0.1:${servidor.address().port}/`)
    await page.waitForSelector('#grade button')
    await page.evaluate(() => document.fonts.ready)
  })

  after(async () => {
    await browser?.close()
    await new Promise((ok) => (servidor ? servidor.close(ok) : ok()))
    rmSync(TMP, { recursive: true, force: true })
  })

  const medir = (id) => page.evaluate((id) => {
    const cel = document.getElementById(id)
    const b = cel.querySelector('button')
    const r = b.getBoundingClientRect()
    const c = cel.getBoundingClientRect()
    const range = document.createRange()
    range.selectNodeContents(b)
    const linhas = new Set([...range.getClientRects()].map((x) => Math.round(x.top))).size
    return { largura: r.width, altura: r.height, celula: c.width, esquerda: r.left - c.left, scrollW: b.scrollWidth, clientW: b.clientWidth, linhas }
  }, id)

  test('célula de 72 px: "Não se aplica" quebra em 2 linhas', async () => {
    const m = await medir('grade-cheio')
    assert.equal(m.linhas, 2, JSON.stringify(m))
  })

  test('o botão não passa da célula, com ou sem w-full, e não rola por dentro', async () => {
    for (const id of ['grade', 'grade-cheio']) {
      const m = await medir(id)
      assert.ok(m.largura <= m.celula + 0.5, `${id}: ${JSON.stringify(m)}`)
      assert.ok(m.esquerda >= -0.5, `${id} esquerda`)
      assert.ok(m.scrollW <= m.clientW + 1, `${id} scroll`)
    }
  })

  test('altura é no mínimo a do sm (30 px)', async () => {
    const sm = await medir('sm')
    assert.equal(Math.round(sm.altura), 30)
    for (const id of ['grade', 'grade-cheio', 'grade-curto']) {
      assert.ok((await medir(id)).altura >= sm.altura, id)
    }
  })

  test('texto curto fica em 1 linha e com a altura do sm', async () => {
    const m = await medir('grade-curto')
    assert.equal(m.linhas, 1)
    assert.ok(Math.abs(m.altura - 30) < 1.5, JSON.stringify(m))
  })

  test('o sm continua a passar da célula (prova de que o teste enxerga o problema)', async () => {
    const m = await medir('sm')
    assert.ok(m.largura > m.celula, JSON.stringify(m))
  })
})
