/**
 * SelectBusca: select de formulário com busca (seleção única).
 *
 * Parte 1, sem navegador: render no servidor com a lista fechada, export no pacote e conferência
 * estática do uso de `lista-flutuante` e `FieldTrigger`.
 * Parte 2, no navegador (Chromium sem interface): Modal de corpo longo com o campo no último lugar, a
 * 375 px e a 1440 px. Mede a lista de verdade (corte por overflow e z-index não existem no jsdom),
 * filtra, usa o teclado e mede o contraste do texto nos dois temas. Precisa de `playwright` ou
 * `playwright-core` (`npm i --no-save playwright-core`) e de `DS_CHROME=/caminho/do/chrome` se o
 * Chromium do playwright não estiver instalado. Sem navegador a parte 2 é pulada, com aviso.
 *
 * Rodar: npm run test:select-busca (a parte 1 também roda no npm test)
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
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-select-busca')
const src = (rel) => join(RAIZ, 'src', rel)

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

// ───────────────────────── Parte 1: sem navegador ─────────────────────────

describe('SelectBusca: servidor e fonte', () => {
  let renderToStaticMarkup, createElement, SelectBusca
  before(async () => {
    ;({ renderToStaticMarkup, createElement, SelectBusca } = await carregarModulo(
      [
        `export { SelectBusca } from '${src('components/ui/select-busca.tsx')}'`,
        `export { createElement } from 'react'`,
        `export { renderToStaticMarkup } from 'react-dom/server'`,
      ],
      'ssr',
    ))
  })
  after(() => rmSync(TMP, { recursive: true, force: true }))

  const options = [{ value: 'a', label: 'Ana' }, { value: 'b', label: 'Bruno' }]

  test('fechado: gatilho combobox com o rótulo da opção, sem lista no DOM', () => {
    const html = renderToStaticMarkup(createElement(SelectBusca, { options, value: 'b', 'aria-label': 'Responsável' }))
    assert.match(html, /role="combobox"/)
    assert.match(html, /aria-expanded="false"/)
    assert.match(html, /Bruno/)
    assert.doesNotMatch(html, /role="listbox"/)
  })

  test('sem valor mostra o placeholder; com name leva o input oculto com o valor', () => {
    const vazio = renderToStaticMarkup(createElement(SelectBusca, { options, placeholder: 'Busque' }))
    assert.match(vazio, /Busque/)
    const comNome = renderToStaticMarkup(createElement(SelectBusca, { options, value: 'a', name: 'resp' }))
    assert.match(comNome, /<input type="hidden" name="resp" value="a"/)
  })

  test('é exportado pelo pacote e reaproveita a conta e o gatilho do DS', () => {
    assert.match(readFileSync(src('components/ui/index.ts'), 'utf8'), /SelectBusca/)
    const f = readFileSync(src('components/ui/select-busca.tsx'), 'utf8')
    assert.match(f, /from '\.\/lista-flutuante'/)
    assert.match(f, /from '\.\/field-trigger'/)
    assert.match(f, /createPortal\(/)
    assert.match(f, /aria-activedescendant/)
    assert.match(f, /motion-reduce:transition-none/)
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
if (!playwright) semNavegador = 'playwright não instalado (npm i --no-save playwright-core, e DS_CHROME)'
else if (!existsSync(CHROME || playwright.chromium.executablePath())) semNavegador = 'sem navegador (DS_CHROME ou npx playwright install chromium)'
if (semNavegador) console.warn(`select-busca: parte 2 (navegador) pulada. ${semNavegador}`)

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
import { SelectBusca } from '${src('components/ui/select-busca.tsx')}'
import { Button } from '${src('components/ui/button.tsx')}'

const NOMES = ['Ana Paula Ribeiro','Bruno Carvalho','Carla Mendes','Diego Nascimento','Elaine Souza','Fábio Teixeira','Gabriela Lima','Hugo Almeida','Isabela Costa','José Antônio Silva','Karina Duarte','Leandro Barbosa','Marina Rocha','Nelson Pires','Olívia Martins','Paulo Vieira','Quênia Dias','Rafael Gomes','Sônia Reis','Tiago Moura']
const OPCOES = NOMES.map((n, i) => ({ value: 'u' + i, label: n }))

function App() {
  const [aberto, setAberto] = useState(true)
  const [v, setV] = useState('')
  window.__valor = v
  return (
    <Modal open={aberto} onOpenChange={setAberto} title="Atribuir responsável" size="md">
      <div style={{ display: 'grid', gap: 16 }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ height: 48, border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, boxSizing: 'border-box' }}>Campo {i + 1}</div>)}
        <SelectBusca aria-label="Responsável" placeholder="Busque pelo nome" options={OPCOES} value={v} onChange={setV} />
      </div>
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

// Contraste WCAG com composição do alfa sobre o fundo.
const rgba = (s) => {
  const m = s.match(/[\d.]+/g).map(Number)
  return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }
}
const sobre = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 })
const lum = ({ r, g, b }) => {
  const c = [r, g, b].map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

describe('SelectBusca no navegador', { skip: semNavegador || false }, () => {
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
      root: PAG, configFile: false, base: './', logLevel: 'silent', esbuild: { jsx: 'automatic' },
      plugins: [react(), tailwindcss()],
      build: { outDir: DIST, emptyOutDir: true, minify: false, rollupOptions: { input: join(PAG, 'index.html') } },
    })
    servidor = createServer((req, res) => {
      const caminho = new URL(req.url, 'http://x').pathname
      const arquivo = join(DIST, caminho === '/' ? 'index.html' : caminho)
      if (!arquivo.startsWith(DIST) || !existsSync(arquivo)) return res.writeHead(404).end()
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

  async function abrir({ largura = 375, altura = 667, escuro = false } = {}) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: altura }, locale: 'pt-BR' })
    const page = await ctx.newPage()
    const erros = []
    page.on('pageerror', (e) => erros.push(String(e)))
    await page.goto(base)
    await page.waitForSelector('[role="combobox"]')
    if (escuro) await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
    return { page, ctx, erros }
  }
  const abrirLista = async (page) => {
    const g = page.locator('[role="combobox"]')
    await g.scrollIntoViewIfNeeded()
    await g.click()
    await page.waitForFunction(() => {
      const l = document.querySelector('[role="listbox"]')
      return !!l && getComputedStyle(l).visibility !== 'hidden'
    })
  }
  const medir = (page) =>
    page.evaluate(() => {
      const l = document.querySelector('[role="listbox"]')
      const r = l.getBoundingClientRect()
      const opcoes = [...l.querySelectorAll('[role="option"]')]
      const inteiras = opcoes.filter((o) => { const b = o.getBoundingClientRect(); return b.top >= r.top - 0.5 && b.bottom <= r.bottom + 0.5 })
      const acessiveis = inteiras.filter((o) => { const b = o.getBoundingClientRect(); const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!e && o.contains(e) })
      const campo = document.activeElement
      return {
        dentro: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
        filhaDoBody: l.parentElement === document.body,
        inteiras: inteiras.length, acessiveis: acessiveis.length, total: opcoes.length, altura: Math.round(r.height),
        focoNoCampo: campo?.getAttribute('role') === 'combobox' && campo.tagName === 'INPUT',
        ativoExiste: !!document.getElementById(campo?.getAttribute('aria-activedescendant') || '__'),
        controla: campo?.getAttribute('aria-controls') === l.id,
      }
    })

  for (const [largura, altura] of [[375, 667], [1440, 900]]) {
    test(`Modal ${largura}x${altura}, campo no fim do corpo: lista inteira, clicável, filha do body, foco no campo`, async (t) => {
      const { page, ctx, erros } = await abrir({ largura, altura })
      try {
        await abrirLista(page)
        const m = await medir(page)
        t.diagnostic(`${largura}x${altura}: lista ${m.altura}px, ${m.acessiveis} de ${m.inteiras} opções inteiras clicáveis, ${m.total} no DOM`)
        assert.equal(m.filhaDoBody, true)
        assert.equal(m.dentro, true, 'lista fora da janela')
        assert.ok(m.inteiras >= 3, `só ${m.inteiras} opções inteiras`)
        assert.equal(m.acessiveis, m.inteiras, 'opção coberta ou cortada por um ancestral')
        assert.equal(m.focoNoCampo, true, 'o foco deveria estar no campo de busca')
        assert.equal(m.ativoExiste, true, 'aria-activedescendant aponta para opção inexistente')
        assert.equal(m.controla, true, 'aria-controls deveria apontar para a lista')
        assert.deepEqual(erros, [])
      } finally { await ctx.close() }
    })
  }

  test('digitar filtra sem acento nem caixa; sem resultado mostra o aviso', async () => {
    const { page, ctx } = await abrir()
    try {
      await abrirLista(page)
      await page.keyboard.type('JOSE')
      assert.deepEqual(await page.locator('[role="option"]').allTextContents(), ['José Antônio Silva'])
      await page.keyboard.press('Control+A')
      await page.keyboard.type('zzz')
      assert.equal(await page.locator('[role="option"]').count(), 0)
      assert.match(await page.locator('[role="status"]').innerText(), /Nenhum resultado/)
    } finally { await ctx.close() }
  })

  test('teclado: seta + Enter escolhe, fecha a lista, devolve o foco ao gatilho e mantém o Modal', async () => {
    const { page, ctx } = await abrir()
    try {
      await abrirLista(page)
      await page.keyboard.type('mar')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      // "mar" acha Marina Rocha (u12) e Olívia Martins (u14); o realce começa na primeira e a seta desce para a segunda.
      assert.equal(await page.evaluate(() => window.__valor), 'u14')
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'o Modal fechou junto')
      await page.waitForFunction(() => document.activeElement?.tagName === 'BUTTON' && document.activeElement.getAttribute('role') === 'combobox')
      assert.match(await page.locator('[role="combobox"]').innerText(), /Olívia Martins/)
    } finally { await ctx.close() }
  })

  test('Escape fecha só a lista (o Modal fica) e o foco volta ao gatilho', async () => {
    const { page, ctx } = await abrir()
    try {
      await abrirLista(page)
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
      assert.equal(await page.locator('[role="dialog"]').count(), 1, 'o Modal fechou junto')
      await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'combobox' && document.activeElement.tagName === 'BUTTON')
    } finally { await ctx.close() }
  })

  test('digitar com o gatilho focado abre a lista já filtrada', async () => {
    const { page, ctx } = await abrir()
    try {
      await page.locator('[role="combobox"]').scrollIntoViewIfNeeded()
      await page.locator('[role="combobox"]').focus()
      await page.keyboard.type('hug')
      await page.waitForSelector('[role="listbox"]')
      assert.deepEqual(await page.locator('[role="option"]').allTextContents(), ['Hugo Almeida'])
    } finally { await ctx.close() }
  })

  for (const escuro of [false, true]) {
    test(`contraste do texto da lista, tema ${escuro ? 'escuro' : 'claro'}: normal e selecionada >= 4,5:1`, async (t) => {
      const { page, ctx } = await abrir({ escuro })
      try {
        // Seleciona a primeira para medir a opção marcada na próxima abertura.
        await abrirLista(page)
        await page.locator('[role="option"]').first().click()
        await page.waitForFunction(() => !document.querySelector('[role="listbox"]'))
        await page.locator('[role="combobox"]').click()
        await page.waitForSelector('[role="listbox"]')
        const med = await page.evaluate(() => {
          const l = document.querySelector('[role="listbox"]')
          const f = (el) => ({ cor: getComputedStyle(el).color, fundo: getComputedStyle(el).backgroundColor })
          const opcoes = [...l.querySelectorAll('[role="option"]')]
          return { lista: getComputedStyle(l).backgroundColor, selecionada: f(opcoes.find((o) => o.getAttribute('aria-selected') === 'true')), normal: f(opcoes.find((o) => o.getAttribute('aria-selected') === 'false')) }
        })
        const fundoLista = rgba(med.lista)
        const r = {
          normal: razao(rgba(med.normal.cor), sobre(rgba(med.normal.fundo), fundoLista)),
          selecionada: razao(rgba(med.selecionada.cor), sobre(rgba(med.selecionada.fundo), fundoLista)),
        }
        t.diagnostic(`${escuro ? 'escuro' : 'claro'}: normal ${r.normal.toFixed(2)}:1, selecionada ${r.selecionada.toFixed(2)}:1`)
        assert.ok(r.normal >= 4.5, `normal ${r.normal}`)
        assert.ok(r.selecionada >= 4.5, `selecionada ${r.selecionada}`)
      } finally { await ctx.close() }
    })
  }
})
