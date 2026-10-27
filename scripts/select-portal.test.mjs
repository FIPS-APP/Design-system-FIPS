/**
 * Select: a lista abre num portal para o body (position: fixed) e nenhum ancestral com overflow a corta.
 *
 * Parte 1, sem navegador: a conta da posição (src/components/ui/lista-flutuante.ts), o render no
 * servidor com a lista fechada e uma conferência estática do select.tsx.
 * Parte 2, no navegador: monta o Modal, o Drawer e um cartão com overflow hidden do DS num Chromium
 * sem interface e mede a lista de verdade, porque corte por overflow e z-index não existem no jsdom.
 * Precisa do playwright, que o DS não traz no package.json: `npm i --no-save playwright` e, se faltar o
 * navegador, `npx playwright install chromium`. Sem isso a parte 2 é pulada e a saída diz o motivo.
 *
 * Rodar: npm run test:select
 */
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-select-portal')

/** Empacota um módulo do repo para o servidor (em memória) e importa o resultado. */
async function carregarModulo(entradas, nome) {
  mkdirSync(TMP, { recursive: true })
  const entrada = join(TMP, `${nome}-entrada.tsx`)
  writeFileSync(entrada, entradas.join('\n') + '\n')
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, `${nome}.mjs`)
  writeFileSync(arquivo, chunk.code)
  return import(pathToFileURL(arquivo).href)
}

const src = (rel) => join(RAIZ, 'src', rel)

// ───────────────────────── Parte 1: sem navegador ─────────────────────────

describe('lista flutuante: conta da posição', () => {
  let calcular, mesma, MAX
  before(async () => {
    const m = await carregarModulo([`export * from '${src('components/ui/lista-flutuante.ts')}'`], 'lista')
    calcular = m.calcularPosicaoLista
    mesma = m.mesmaPosicaoLista
    MAX = m.LISTA_ALTURA_MAX
  })
  after(() => rmSync(TMP, { recursive: true, force: true }))

  const janela = { largura: 1440, altura: 900 }
  const gatilho = (top, h = 36) => ({ top, bottom: top + h, left: 50, width: 300 })

  test('o teto é 200 px, o mesmo da lista inline que o Select tinha', () => {
    assert.equal(MAX, 200)
  })

  test('cabendo embaixo, abre para baixo colada no gatilho, com a largura dele', () => {
    const p = calcular(gatilho(100), janela, 500)
    assert.equal(p.abrirParaCima, false)
    assert.equal(p.top, 136)
    assert.equal(p.bottom, undefined)
    assert.equal(p.left, 50)
    assert.equal(p.width, 300)
    assert.equal(p.maxHeight, 200)
  })

  test('não cabendo embaixo e sobrando mais em cima, sobe: a borda de baixo da lista é o topo do gatilho', () => {
    const p = calcular(gatilho(700), janela, 500)
    assert.equal(p.abrirParaCima, true)
    assert.equal(p.bottom, 200) // 900 - 700
    assert.equal(p.top, undefined)
    assert.equal(p.maxHeight, 200)
  })

  test('lista curta que cabe embaixo não sobe, mesmo com pouco espaço', () => {
    // gatilho em 760..796: sobram 900 - 796 - 8 = 96 px; a lista de 3 opções tem 96 px
    const p = calcular(gatilho(760), janela, 96)
    assert.equal(p.abrirParaCima, false)
    assert.equal(p.maxHeight, 96)
  })

  test('sem espaço nos dois lados escolhe o maior e encolhe: a lista rola por dentro', () => {
    const p = calcular(gatilho(60), { largura: 1440, altura: 220 }, 500)
    assert.equal(p.abrirParaCima, false) // embaixo 116, em cima 52
    assert.equal(p.maxHeight, 116)
    const q = calcular(gatilho(150), { largura: 1440, altura: 220 }, 500)
    assert.equal(q.abrirParaCima, true) // embaixo 26, em cima 142
    assert.equal(q.maxHeight, 142)
  })

  test('a lista nunca passa da janela, em nenhuma posição do gatilho e altura de janela', () => {
    for (const altura of [220, 420, 600, 812, 900]) {
      for (let top = 0; top <= altura - 36; top += 7) {
        for (const natural of [48, 96, 200, 480]) {
          const p = calcular(gatilho(top), { largura: 1440, altura }, natural)
          const h = Math.min(natural, p.maxHeight)
          const topo = p.abrirParaCima ? altura - p.bottom - h : p.top
          assert.ok(topo >= 0, `topo ${topo} < 0 (altura ${altura}, gatilho ${top}, lista ${natural})`)
          assert.ok(topo + h <= altura, `base ${topo + h} > ${altura} (gatilho ${top}, lista ${natural})`)
        }
      }
    }
  })

  test('mesmaPosicaoLista compara campo a campo', () => {
    const a = calcular(gatilho(100), janela, 500)
    assert.equal(mesma(null, a), false)
    assert.equal(mesma({ ...a }, a), true)
    assert.equal(mesma({ ...a, left: a.left + 1 }, a), false)
    assert.equal(mesma({ ...a, maxHeight: a.maxHeight - 1 }, a), false)
    assert.equal(mesma(calcular(gatilho(700), janela, 500), a), false)
  })
})

describe('Select: servidor e fonte', () => {
  let renderToStaticMarkup, createElement, Select
  before(async () => {
    const m = await carregarModulo(
      [
        `export { Select } from '${src('components/ui/select.tsx')}'`,
        `export { createElement } from 'react'`,
        `export { renderToStaticMarkup } from 'react-dom/server'`,
      ],
      'select-ssr',
    )
    ;({ renderToStaticMarkup, createElement, Select } = m)
  })
  after(() => rmSync(TMP, { recursive: true, force: true }))

  test('fechado renderiza só o gatilho no servidor, sem tocar em document nem montar a lista', () => {
    const html = renderToStaticMarkup(
      createElement(Select, { 'aria-label': 'Local', options: [{ value: 'a', label: 'A' }], value: 'a' }),
    )
    assert.match(html, /role="combobox"/)
    assert.match(html, /aria-expanded="false"/)
    assert.doesNotMatch(html, /role="listbox"/)
  })

  // Guarda barata para quem roda sem navegador: o que a parte 2 mede, aqui só se lê no código.
  const fonte = readFileSync(src('components/ui/select.tsx'), 'utf8')
  test('a lista sai por createPortal para o body, não como filha do wrapper', () => {
    assert.match(fonte, /createPortal\(/)
    assert.match(fonte, /document\.body/)
    assert.doesNotMatch(fonte, /absolute left-0 right-0 top-full/)
  })
  test('a lista devolve pointer-events e fica acima do Modal (z-50) e do tour (z-[60])', () => {
    assert.match(fonte, /pointerEvents: 'auto'/)
    assert.match(fonte, /z-\[70\]/)
    assert.match(fonte, /data-lista-flutuante/)
  })
})

// ───────────────────────── Parte 2: no navegador ─────────────────────────

let playwright = null
let semNavegador = ''
try {
  playwright = await import('playwright')
  if (!existsSync(playwright.chromium.executablePath())) {
    semNavegador = 'Chromium do playwright não instalado (npx playwright install chromium)'
  }
} catch {
  semNavegador = 'playwright não instalado (npm i --no-save playwright)'
}

const OPCOES = 24

// Página de teste: o Modal, o Drawer e um cartão com overflow hidden do DS, cada um com um Select de 24
// opções no fim do corpo. Usa os componentes de verdade, com o CSS de verdade (Tailwind do repo).
const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`
const rel = (alvo) => {
  const r = relative(join(TMP, 'pagina'), alvo).split('\\').join('/')
  return r.startsWith('.') ? r : `./${r}`
}
const ESTILO = `@import '${rel(src('styles/globals.css'))}';\n@source '${rel(src(''))}';\n`
const PAGINA = `
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './estilo.css'
import { Modal, ModalFooter } from '${src('components/ui/Modal.tsx')}'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '${src('components/ui/drawer.tsx')}'
import { Select } from '${src('components/ui/select.tsx')}'
import { Button } from '${src('components/ui/button.tsx')}'

const OPCOES = Array.from({ length: ${OPCOES} }, (_, i) => ({ value: String(i + 1), label: 'Local ' + (i + 1) }))

function Campo({ n }) {
  return <div style={{ height: 48, border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, boxSizing: 'border-box' }}>Campo {n}</div>
}

function CorpoComSelect({ preenchimento }) {
  const [v, setV] = useState('')
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {Array.from({ length: preenchimento }, (_, i) => <Campo key={i} n={i + 1} />)}
      <Select aria-label="Local" placeholder="Selecione o local" options={OPCOES} value={v} onChange={setV} />
    </div>
  )
}

function App() {
  const c = new URLSearchParams(location.search).get('c') || 'modal'
  const [aberto, setAberto] = useState(true)
  if (c === 'cartao') {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ overflow: 'hidden', borderRadius: 16, border: '1px solid #94a3b8', width: 320, padding: 16 }}>
          <CorpoComSelect preenchimento={0} />
        </div>
        <p>Texto depois do cartão</p>
      </div>
    )
  }
  if (c === 'drawer') {
    return (
      <Drawer open={aberto} onOpenChange={setAberto}>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Filtros</DrawerTitle></DrawerHeader>
          <CorpoComSelect preenchimento={2} />
        </DrawerContent>
      </Drawer>
    )
  }
  return (
    <Modal open={aberto} onOpenChange={setAberto} title="Nova inspeção" size="md">
      <CorpoComSelect preenchimento={c === 'modal-longo' ? 14 : 2} />
      <ModalFooter>
        <Button variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
        <Button>Salvar</Button>
      </ModalFooter>
    </Modal>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' }

describe('Select no navegador', { skip: semNavegador || false }, () => {
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
    browser = await playwright.chromium.launch({ headless: true })
  })

  after(async () => {
    await browser?.close()
    await new Promise((ok) => (servidor ? servidor.close(ok) : ok()))
    rmSync(TMP, { recursive: true, force: true })
  })

  /** Página nova (contexto isolado) no cenário e no tamanho de janela pedidos. */
  async function abrir(cenario, { largura = 1440, altura = 900, toque = false, escuro = false } = {}) {
    const ctx = await browser.newContext({
      viewport: { width: largura, height: altura },
      hasTouch: toque,
      isMobile: toque,
      deviceScaleFactor: toque ? 2 : 1,
      locale: 'pt-BR',
    })
    const page = await ctx.newPage()
    const erros = []
    page.on('pageerror', (e) => erros.push(String(e)))
    await page.goto(`${base}?c=${cenario}`)
    await page.waitForSelector('[role="combobox"]')
    // O Modal anima a entrada; medir o gatilho no meio da animação mede um lugar que ele deixa logo depois.
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
    if (escuro) {
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      // O gatilho tem transition-colors: medir a cor no meio da transição mede a cor errada.
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
    }
    return { page, ctx, erros }
  }

  /** Abre a lista (clique de verdade no gatilho) e espera a primeira medida: até lá ela está hidden. */
  async function abrirLista(page, { toque = false } = {}) {
    const gatilho = page.locator('[role="combobox"]')
    await gatilho.scrollIntoViewIfNeeded()
    if (toque) await gatilho.tap()
    else await gatilho.click()
    await page.waitForSelector('[role="listbox"]')
    await page.waitForFunction(() => {
      const l = document.querySelector('[role="listbox"]')
      return !!l && getComputedStyle(l).visibility !== 'hidden'
    })
  }

  /** Medidas da lista aberta e do gatilho, em px da janela. `acessiveis` usa elementFromPoint: é o que o clique encontra. */
  const medir = (page) =>
    page.evaluate(() => {
      const l = document.querySelector('[role="listbox"]')
      const g = document.querySelector('[role="combobox"]')
      if (!l || !g) return null
      const r = l.getBoundingClientRect()
      const t = g.getBoundingClientRect()
      const opcoes = [...l.querySelectorAll('[role="option"]')]
      const inteiras = opcoes.filter((o) => {
        const b = o.getBoundingClientRect()
        return b.top >= r.top - 0.5 && b.bottom <= r.bottom + 0.5
      })
      const acessiveis = inteiras.filter((o) => {
        const b = o.getBoundingClientRect()
        const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
        return !!e && o.contains(e)
      })
      const cl = getComputedStyle(l)
      const cg = getComputedStyle(g)
      const raio = (c) => [c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius]
      return {
        janela: { w: innerWidth, h: innerHeight },
        lista: { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height },
        gatilho: { top: t.top, bottom: t.bottom, left: t.left, right: t.right, width: t.width },
        dentroDaJanela: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
        visivelDaLista: Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height,
        filhaDoBody: l.parentElement === document.body,
        marcador: l.hasAttribute('data-lista-flutuante'),
        opcoes: opcoes.length,
        inteiras: inteiras.length,
        acessiveis: acessiveis.length,
        raioLista: raio(cl),
        raioGatilho: raio(cg),
        bordaTopoLista: cl.borderTopWidth,
        bordaBaseLista: cl.borderBottomWidth,
        fundoLista: cl.backgroundColor,
        fundoGatilho: cg.backgroundColor,
        corBordaLista: cl.borderLeftColor,
        corBordaGatilho: cg.borderLeftColor,
        rolagemLista: l.scrollTop,
        alturaRolavel: l.scrollHeight - l.clientHeight,
      }
    })

  /** Distância entre a lista e o gatilho na emenda (0 = colados), do lado em que a lista abriu. */
  const emenda = (m) => (m.lista.top >= m.gatilho.bottom - 1 ? m.lista.top - m.gatilho.bottom : m.gatilho.top - m.lista.bottom)

  const resumo = (m) =>
    `lista ${Math.round(m.lista.height)}px, ${m.acessiveis} de ${m.inteiras} opções inteiras clicáveis, ${Math.round(m.visivelDaLista * 100)}% dentro da janela, filha do body: ${m.filhaDoBody}`

  test('Modal 1440x900: a lista sai inteira do corpo do Modal, colada no gatilho e com a largura dele', async (t) => {
    const { page, ctx, erros } = await abrir('modal')
    try {
      await abrirLista(page)
      const m = await medir(page)
      t.diagnostic(`1440x900 Modal: ${resumo(m)}`)
      assert.equal(m.filhaDoBody, true, 'a lista deveria ser filha do body (portal)')
      assert.equal(m.marcador, true, 'a lista deveria levar data-lista-flutuante')
      assert.equal(m.dentroDaJanela, true, `lista fora da janela: ${JSON.stringify(m.lista)}`)
      assert.ok(m.inteiras >= 3, `só ${m.inteiras} opções inteiras na lista`)
      assert.equal(m.acessiveis, m.inteiras, `${m.inteiras - m.acessiveis} opções cobertas ou cortadas por um ancestral`)
      assert.ok(Math.abs(emenda(m)) <= 1, `a lista deveria emendar no gatilho, mas há ${emenda(m)} px entre os dois`)
      assert.ok(Math.abs(m.lista.left - m.gatilho.left) <= 1 && Math.abs(m.lista.width - m.gatilho.width) <= 1, 'largura ou borda esquerda diferentes do gatilho')
      assert.deepEqual(erros, [])
    } finally {
      await ctx.close()
    }
  })

  test('Modal: a roda do mouse rola a lista até a última opção, e clicar nela escolhe sem fechar o Modal', async (t) => {
    const { page, ctx } = await abrir('modal')
    try {
      await abrirLista(page)
      const antes = await medir(page)
      await page.mouse.move(antes.lista.left + antes.lista.width / 2, antes.lista.top + antes.lista.height / 2)
      await page.mouse.wheel(0, 4000)
      await page.waitForFunction(() => {
        const l = document.querySelector('[role="listbox"]')
        return l.scrollTop >= l.scrollHeight - l.clientHeight - 1
      })
      const depois = await medir(page)
      t.diagnostic(`roda: rolagem da lista ${Math.round(antes.rolagemLista)} -> ${Math.round(depois.rolagemLista)} de ${Math.round(depois.alturaRolavel)} px`)
      assert.ok(depois.rolagemLista > 0, 'a roda não rolou a lista (o travamento de rolagem do Modal pegou a lista do portal)')
      // Clique de verdade, na coordenada da última opção: é o que o usuário faz.
      const alvo = await page.evaluate(() => {
        const ops = document.querySelectorAll('[role="option"]')
        const b = ops[ops.length - 1].getBoundingClientRect()
        const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
        return { x: b.left + b.width / 2, y: b.top + b.height / 2, acerta: !!e && ops[ops.length - 1].contains(e) }
      })
      assert.equal(alvo.acerta, true, 'a última opção não recebe o clique (coberta ou com pointer-events none)')
      await page.mouse.click(alvo.x, alvo.y)
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.match(await page.locator('[role="combobox"]').innerText(), new RegExp(`Local ${OPCOES}`))
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'o clique na lista fechou o Modal')
    } finally {
      await ctx.close()
    }
  })

  test('Modal: clicar fora da lista fecha só a lista, o Modal continua aberto', async () => {
    const { page, ctx } = await abrir('modal')
    try {
      await abrirLista(page)
      await page.getByRole('heading', { name: 'Nova inspeção' }).click()
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'clicar no título fechou o Modal junto com a lista')
    } finally {
      await ctx.close()
    }
  })

  test('Modal: o teclado segue valendo com a lista no portal (setas, aria-activedescendant, Enter, Escape)', async () => {
    const { page, ctx } = await abrir('modal')
    try {
      const gatilho = page.locator('[role="combobox"]')
      await gatilho.focus()
      await page.keyboard.press('ArrowDown')
      await page.waitForSelector('[role="listbox"]')
      await page.keyboard.press('ArrowDown')
      const ativo = await page.evaluate(() => {
        const g = document.querySelector('[role="combobox"]')
        const alvo = document.getElementById(g.getAttribute('aria-activedescendant') || '')
        const lista = document.querySelector('[role="listbox"]')
        return { achou: !!alvo, dentroDaLista: !!alvo && lista.contains(alvo), controla: g.getAttribute('aria-controls') === lista.id, indice: alvo ? [...lista.children].indexOf(alvo) : -1 }
      })
      assert.deepEqual(ativo, { achou: true, dentroDaLista: true, controla: true, indice: 1 })
      // Escape fecha só a lista, o Modal fica.
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'Escape fechou o Modal junto com a lista')
      // Enter escolhe a opção realçada.
      await page.keyboard.press('ArrowDown')
      await page.waitForSelector('[role="listbox"]')
      await page.keyboard.press('ArrowDown')
      const rotulo = await page.locator('[role="listbox"] [role="option"]').nth(1).innerText()
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.ok((await gatilho.innerText()).includes(rotulo.trim()), 'Enter não escolheu a opção realçada')
    } finally {
      await ctx.close()
    }
  })

  test('Modal com corpo rolável: a lista acompanha a rolagem e fecha quando o gatilho sai da vista', async (t) => {
    const { page, ctx } = await abrir('modal-longo')
    try {
      await page.locator('[role="combobox"]').evaluate((g) => g.scrollIntoView({ block: 'center' }))
      await abrirLista(page)
      const a = await medir(page)
      // Sobe o corpo 60 px: o gatilho desce 60 e a lista tem de descer junto.
      const corpo = () => page.locator('[role="combobox"]').evaluateHandle((g) => {
        for (let n = g.parentElement; n; n = n.parentElement) if (getComputedStyle(n).overflowY === 'auto') return n
        return null
      })
      const el = await corpo()
      await el.evaluate((n) => { n.scrollTop -= 60 })
      await page.waitForTimeout(150)
      const b = await medir(page)
      t.diagnostic(`rolagem do corpo: gatilho ${Math.round(a.gatilho.bottom)} -> ${Math.round(b.gatilho.bottom)}, lista ${Math.round(a.lista.top)} -> ${Math.round(b.lista.top)}`)
      assert.ok(Math.abs(b.gatilho.bottom - a.gatilho.bottom - 60) <= 1, 'o gatilho não andou 60 px')
      assert.ok(Math.abs(emenda(b)) <= 1, `a lista ficou solta do gatilho: ${emenda(b)} px`)
      // Rola o corpo até o topo: o gatilho, no fim do corpo, sai da área visível dele.
      await el.evaluate((n) => { n.scrollTop = 0 })
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'), null, { timeout: 2000 })
    } finally {
      await ctx.close()
    }
  })

  test('janela baixa (1440x420): a lista sobe, emenda por cima e os cantos arredondados trocam de lado', async (t) => {
    const { page, ctx } = await abrir('modal', { altura: 420 })
    try {
      await abrirLista(page)
      const m = await medir(page)
      t.diagnostic(`1440x420: ${resumo(m)}; lista ${Math.round(m.lista.top)}..${Math.round(m.lista.bottom)}, gatilho ${Math.round(m.gatilho.top)}..${Math.round(m.gatilho.bottom)}`)
      assert.ok(m.lista.bottom <= m.gatilho.top + 1, 'a lista deveria abrir para cima')
      assert.equal(m.dentroDaJanela, true, `lista fora da janela: ${JSON.stringify(m.lista)}`)
      assert.equal(m.acessiveis, m.inteiras)
      assert.ok(Math.abs(emenda(m)) <= 1)
      // Emenda por cima: o gatilho perde os cantos de cima e a lista os de baixo.
      assert.deepEqual(m.raioGatilho, ['0px', '0px', '8px', '8px'], `gatilho ${m.raioGatilho}`)
      assert.deepEqual(m.raioLista, ['8px', '8px', '0px', '0px'], `lista ${m.raioLista}`)
      assert.equal(m.bordaBaseLista, '0px')
    } finally {
      await ctx.close()
    }
  })

  test('abrindo para baixo, o gatilho perde os cantos de baixo e a lista os de cima', async () => {
    const { page, ctx } = await abrir('modal')
    try {
      await abrirLista(page)
      const m = await medir(page)
      assert.deepEqual(m.raioGatilho, ['8px', '8px', '0px', '0px'], `gatilho ${m.raioGatilho}`)
      assert.deepEqual(m.raioLista, ['0px', '0px', '8px', '8px'], `lista ${m.raioLista}`)
      assert.equal(m.bordaTopoLista, '0px')
    } finally {
      await ctx.close()
    }
  })

  test('redimensionar a janela com a lista aberta reposiciona a lista', async (t) => {
    const { page, ctx } = await abrir('modal')
    try {
      await abrirLista(page)
      await page.setViewportSize({ width: 600, height: 500 })
      await page.waitForTimeout(250)
      const m = await medir(page)
      t.diagnostic(`600x500: ${resumo(m)}`)
      assert.equal(m.dentroDaJanela, true, `lista fora da janela: ${JSON.stringify(m.lista)}`)
      assert.ok(Math.abs(emenda(m)) <= 1, `a lista ficou solta do gatilho: ${emenda(m)} px`)
      assert.ok(Math.abs(m.lista.width - m.gatilho.width) <= 1)
    } finally {
      await ctx.close()
    }
  })

  test('375x812 com toque: tocar abre a lista, rola e escolhe sem fechar o Modal', async (t) => {
    const { page, ctx } = await abrir('modal', { largura: 375, altura: 812, toque: true })
    try {
      await abrirLista(page, { toque: true })
      const m = await medir(page)
      t.diagnostic(`375x812 toque: ${resumo(m)}`)
      assert.equal(m.dentroDaJanela, true, `lista fora da janela: ${JSON.stringify(m.lista)}`)
      assert.equal(m.acessiveis, m.inteiras)
      const alvo = await page.evaluate(() => {
        const o = document.querySelectorAll('[role="option"]')[2]
        const b = o.getBoundingClientRect()
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 }
      })
      await page.touchscreen.tap(alvo.x, alvo.y)
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.match(await page.locator('[role="combobox"]').innerText(), /Local 3/)
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'o toque na lista fechou o Modal')
    } finally {
      await ctx.close()
    }
  })

  test('tema escuro: lista e gatilho com a mesma superfície e a mesma borda', async (t) => {
    const { page, ctx } = await abrir('modal', { escuro: true })
    try {
      await abrirLista(page)
      const m = await medir(page)
      t.diagnostic(`escuro: fundo ${m.fundoLista}, borda ${m.corBordaLista}`)
      assert.equal(m.fundoLista, m.fundoGatilho)
      assert.equal(m.corBordaLista, m.corBordaGatilho)
      assert.equal(m.corBordaLista, 'rgb(147, 189, 228)')
    } finally {
      await ctx.close()
    }
  })

  test('Drawer: a lista fica acima do painel e recebe o clique', async (t) => {
    const { page, ctx } = await abrir('drawer')
    try {
      await abrirLista(page)
      const m = await medir(page)
      t.diagnostic(`Drawer: ${resumo(m)}`)
      assert.equal(m.acessiveis, m.inteiras)
      const alvo = await page.evaluate(() => {
        const b = document.querySelectorAll('[role="option"]')[1].getBoundingClientRect()
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 }
      })
      await page.mouse.click(alvo.x, alvo.y)
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.match(await page.locator('[role="combobox"]').innerText(), /Local 2/)
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'o clique na lista fechou o Drawer')
    } finally {
      await ctx.close()
    }
  })

  test('cartão com overflow hidden e raio 16: a lista sai do cartão', async (t) => {
    const { page, ctx } = await abrir('cartao')
    try {
      await abrirLista(page)
      const m = await medir(page)
      t.diagnostic(`cartão: ${resumo(m)}`)
      assert.equal(m.filhaDoBody, true)
      assert.equal(m.acessiveis, m.inteiras)
      assert.ok(m.inteiras >= 3)
    } finally {
      await ctx.close()
    }
  })
})
