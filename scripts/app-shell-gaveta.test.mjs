/**
 * Gaveta do AppShell (abaixo de 1024px): foco entra no primeiro item do menu, o resto da página fica
 * inert (Tab não chega nela) e Esc/fundo devolvem o foco ao botão "Abrir menu"; no desktop nada disso vale.
 *
 * Parte 1, sem navegador: uma conferência estática do aside e do shell.
 * Parte 2, no navegador: monta o AppShell de verdade num Chromium sem interface a 375 px e a 1440 px.
 * Precisa do playwright, que o DS não traz no package.json: `npm i --no-save playwright`, ou o
 * playwright-core com um Chrome instalado (`DS_CHROME=/caminho/do/chrome`). Sem nenhum dos dois a parte 2
 * é pulada e o aviso no topo da saída diz o motivo.
 *
 * Também cobre aoMudarRecolhido (recolher/expandir avisa o app; a montagem não).
 * Rodar: npm run test:gaveta (a parte 1 também roda no npm test)
 */
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-app-shell-gaveta')
const src = (rel) => join(RAIZ, 'src', rel)

// ───────────────────────── Parte 1: sem navegador ─────────────────────────

describe('gaveta: conferência estática do fonte', () => {
  test('o menu só vira diálogo modal na gaveta (aria depende de gavetaAberta)', () => {
    const fonte = readFileSync(src('components/composites/AppSidebar.tsx'), 'utf8')
    assert.match(fonte, /role=\{gavetaAberta \? 'dialog' : undefined\}/)
    assert.match(fonte, /aria-modal=\{gavetaAberta \? true : undefined\}/)
  })
})

// ───────────────────────── Parte 2: no navegador ─────────────────────────

let playwright = null
let semNavegador = ''
const CHROME = process.env.DS_CHROME || ''
for (const nome of ['playwright', 'playwright-core']) {
  try {
    playwright = await import(nome)
    break
  } catch {
    // tenta o próximo
  }
}
if (!playwright) {
  semNavegador = 'playwright não instalado (npm i --no-save playwright, ou playwright-core com DS_CHROME)'
} else if (!existsSync(CHROME || playwright.chromium.executablePath())) {
  semNavegador = 'Chromium do playwright não instalado (npx playwright install chromium, ou DS_CHROME)'
}
if (semNavegador) console.warn(`app-shell-gaveta: parte 2 (casos no navegador) pulada. ${semNavegador}`)

const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`
const rel = (alvo) => {
  const r = relative(join(TMP, 'pagina'), alvo).split('\\').join('/')
  return r.startsWith('.') ? r : `./${r}`
}
const ESTILO = `@import '${rel(src('styles/globals.css'))}';\n@source '${rel(src(''))}';\n`
const PAGINA = `
import { createRoot } from 'react-dom/client'
import { Home, FileText, Settings } from 'lucide-react'
import './estilo.css'
import { AppShell } from '${src('components/composites/AppShell.tsx')}'

const grupos = [{ id: 'g', itens: [
  { id: 'home', rotulo: 'Home', href: '#home', icone: Home, ativo: true },
  { id: 'rel', rotulo: 'Relatórios', href: '#rel', icone: FileText },
  { id: 'cfg', rotulo: 'Configurações', href: '#cfg', icone: Settings },
] }]

createRoot(document.getElementById('root')).render(
  <AppShell
    chavePreferencias="teste:gaveta"
    menu={{ nome: 'App', grupos, versao: { numero: '0.1.0', aoAbrir: () => {} } }}
    cabecalho={{ trilha: [{ label: 'Home' }] }}
    recolhidoInicial={new URLSearchParams(location.search).has('recolhido')}
    aoMudarRecolhido={(v) => { (window.__recolhido ??= []).push(v) }}
  >
    <main style={{ padding: 16 }}><button id="no-conteudo">Dentro da página</button></main>
  </AppShell>,
)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' }

describe('gaveta do AppShell no navegador', { skip: semNavegador || false }, () => {
  const PAG = join(TMP, 'pagina')
  const DIST = join(PAG, 'dist')
  let servidor, base, browser

  before(async () => {
    rmSync(PAG, { recursive: true, force: true })
    mkdirSync(PAG, { recursive: true })
    writeFileSync(join(PAG, 'index.html'), HTML)
    writeFileSync(join(PAG, 'main.tsx'), PAGINA)
    writeFileSync(join(PAG, 'estilo.css'), ESTILO)
    await build({
      root: PAG,
      configFile: false,
      base: './',
      logLevel: 'silent',
      esbuild: { jsx: 'automatic' },
      plugins: [react(), tailwindcss()],
      build: { outDir: DIST, emptyOutDir: true, minify: false, rollupOptions: { input: join(PAG, 'index.html') } },
    })
    servidor = createServer((req, res) => {
      const caminho = new URL(req.url, 'http://x').pathname
      const arquivo = join(DIST, caminho === '/' ? 'index.html' : caminho)
      if (!arquivo.startsWith(DIST) || !existsSync(arquivo)) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] || 'application/octet-stream' })
      res.end(readFileSync(arquivo))
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

  async function abrir(largura, busca = '') {
    const ctx = await browser.newContext({ viewport: { width: largura, height: 812 }, locale: 'pt-BR' })
    const page = await ctx.newPage()
    // Sem recolher sozinho: o único que muda o menu é o clique do teste.
    await page.addInitScript(() => localStorage.setItem('teste:gaveta', JSON.stringify({ recolherAuto: false, segundos: 3 })))
    const erros = []
    page.on('pageerror', (e) => erros.push(String(e)))
    await page.goto(base + busca)
    await page.waitForSelector('[data-casca="menu"]')
    return { page, ctx, erros }
  }

  const ativo = (page) =>
    page.evaluate(() => {
      const a = document.activeElement
      return a ? { rotulo: a.getAttribute('aria-label') || a.textContent?.trim() || a.tagName, noMenu: !!a.closest('[data-casca="menu"]') } : null
    })

  /** Tab desde o início da página até o botão "Abrir menu" (como quem navega por teclado). */
  async function tabAteAbrirMenu(page) {
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      if ((await ativo(page))?.rotulo === 'Abrir menu') return
    }
    assert.fail('Tab não chegou em "Abrir menu" em 12 passos')
  }

  test('375px: Enter abre a gaveta e o foco cai no primeiro item (Home), dentro de um diálogo modal', async () => {
    const { page, ctx, erros } = await abrir(375)
    try {
      await tabAteAbrirMenu(page)
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => document.querySelector('[data-casca="menu"]')?.getAttribute('role') === 'dialog')
      const a = await ativo(page)
      assert.deepEqual(a, { rotulo: 'Home', noMenu: true })
      assert.equal(await page.getAttribute('[data-casca="menu"]', 'aria-modal'), 'true')
      assert.deepEqual(erros, [])
    } finally {
      await ctx.close()
    }
  })

  test('375px: com a gaveta aberta o corpo da página fica inert e nenhum Tab (nem Shift+Tab) cai nele', async () => {
    const { page, ctx } = await abrir(375)
    try {
      await tabAteAbrirMenu(page)
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => document.querySelector('[data-casca="menu"]')?.getAttribute('role') === 'dialog')
      assert.equal(await page.getAttribute('[data-casca="corpo"]', 'inert'), '')
      const total = await page.evaluate(
        () => [...document.querySelectorAll('[data-casca="menu"] a[href], [data-casca="menu"] button')].filter((e) => e.getClientRects().length).length,
      )
      assert.ok(total >= 4, `menu com poucos focáveis: ${total}`)
      const foraDoMenu = () => page.evaluate(() => !!document.activeElement?.closest('[data-casca="corpo"], [data-casca="fundo-da-gaveta"]'))
      for (let i = 0; i < total * 2 + 2; i++) {
        await page.keyboard.press('Tab')
        assert.equal(await foraDoMenu(), false, `Tab ${i + 1} caiu na página de trás`)
      }
      for (let i = 0; i < total + 2; i++) {
        await page.keyboard.press('Shift+Tab')
        assert.equal(await foraDoMenu(), false, `Shift+Tab ${i + 1} caiu na página de trás`)
      }
    } finally {
      await ctx.close()
    }
  })

  test('375px: Esc fecha a gaveta e o foco volta ao botão "Abrir menu"', async () => {
    const { page, ctx } = await abrir(375)
    try {
      await tabAteAbrirMenu(page)
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => document.querySelector('[data-casca="menu"]')?.getAttribute('role') === 'dialog')
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('[data-casca="menu"]')?.hasAttribute('role'))
      assert.equal((await ativo(page)).rotulo, 'Abrir menu')
      assert.equal(await page.getAttribute('[data-casca="corpo"]', 'inert'), null)
    } finally {
      await ctx.close()
    }
  })

  test('375px: clicar no fundo devolve o foco ao botão "Abrir menu"', async () => {
    const { page, ctx } = await abrir(375)
    try {
      await tabAteAbrirMenu(page)
      await page.keyboard.press('Enter')
      await page.waitForSelector('[data-casca="fundo-da-gaveta"]')
      await page.mouse.click(350, 400)
      await page.waitForFunction(() => !document.querySelector('[data-casca="fundo-da-gaveta"]'))
      assert.equal((await ativo(page)).rotulo, 'Abrir menu')
    } finally {
      await ctx.close()
    }
  })

  test('1440px: menu fixo sem role dialog nem aria-modal, e Tab segue para a página', async () => {
    const { page, ctx } = await abrir(1440)
    try {
      assert.equal(await page.getAttribute('[data-casca="menu"]', 'role'), null)
      assert.equal(await page.getAttribute('[data-casca="menu"]', 'aria-modal'), null)
      await page.focus('[data-casca="menu"] a[href]:last-of-type')
      await page.focus('#no-conteudo')
      assert.equal((await ativo(page)).noMenu, false)
    } finally {
      await ctx.close()
    }
  })

  test('1440px: recolher chama aoMudarRecolhido(true), expandir chama (false); a montagem não chama', async () => {
    const { page, ctx } = await abrir(1440)
    try {
      assert.equal(await page.evaluate(() => window.__recolhido ?? null), null)
      await page.click('button[aria-label="Recolher menu lateral"]')
      await page.click('button[aria-label="Expandir menu lateral"]')
      assert.deepEqual(await page.evaluate(() => window.__recolhido), [true, false])
    } finally {
      await ctx.close()
    }
  })

  test('1440px: remontar com recolhidoInicial nasce recolhido, sem chamar aoMudarRecolhido', async () => {
    const { page, ctx } = await abrir(1440, '?recolhido')
    try {
      assert.equal(await page.getAttribute('[data-casca="menu"]', 'data-collapsed'), 'true')
      assert.equal(await page.evaluate(() => window.__recolhido ?? null), null)
      await page.click('button[aria-label="Expandir menu lateral"]')
      assert.deepEqual(await page.evaluate(() => window.__recolhido), [false])
    } finally {
      await ctx.close()
    }
  })
})
