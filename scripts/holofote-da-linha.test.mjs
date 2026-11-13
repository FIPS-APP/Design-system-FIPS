/**
 * useHolofoteDaLinha (0.25.9): o holofote da TabelaExpansivel para qualquer tabela do pacote.
 *
 * Parte 1, sem navegador: a API exportada nos dois pontos de entrada e a fonte do hook.
 * Parte 2, no navegador: monta um `Table` comum (e uma lista de cartões) com `RowActionsMenu` e o hook, e confere
 * que abrir o menu marca a linha (data-em-foco) e a moldura (data-recuo), que Esc limpa, que as setas movem,
 * que desligado não marca nada e que o holofote é medido na linha ativa.
 * Precisa de playwright-core com um Chrome (`npm i --no-save playwright-core` e `DS_CHROME=/caminho/do/chrome`,
 * ou o playwright com o Chromium instalado). Sem nenhum dos dois a parte 2 é pulada, com o aviso no topo.
 *
 * Rodar: node --test scripts/holofote-da-linha.test.mjs
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
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-holofote-da-linha')
const src = (rel) => join(RAIZ, 'src', rel)

describe('useHolofoteDaLinha: exportação e fonte', () => {
  test('sai pelos dois pontos de entrada, com os tipos', () => {
    for (const arq of ['index.ts', 'components/composites/index.ts']) {
      const t = readFileSync(src(arq), 'utf8')
      assert.match(t, /useHolofoteDaLinha/, arq)
      assert.match(t, /HolofoteDaLinhaOpcoes/, arq)
      assert.match(t, /PropsDaLinhaComHolofote/, arq)
    }
  })
  test('a TabelaExpansivel usa o hook e não guarda mais o estado do holofote', () => {
    const t = readFileSync(src('components/composites/TabelaExpansivel.tsx'), 'utf8')
    assert.match(t, /useHolofoteDaLinha\(\{/)
    assert.doesNotMatch(t, /posicionarHolofote|menuAbertoRef|ResizeObserver\(\(\) => posicionar/)
  })
})

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
  semNavegador = 'playwright não instalado (npm i --no-save playwright-core, com DS_CHROME)'
} else if (!existsSync(CHROME || playwright.chromium.executablePath())) {
  semNavegador = CHROME ? `DS_CHROME não existe: ${CHROME}` : 'Chromium do playwright não instalado (ou DS_CHROME com um Chrome instalado)'
}
if (semNavegador) console.warn(`holofote-da-linha: parte 2 (casos no navegador) pulada. ${semNavegador}`)

const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`
const rel = (alvo) => {
  const r = relative(join(TMP, 'pagina'), alvo).split('\\').join('/')
  return r.startsWith('.') ? r : `./${r}`
}
const ESTILO = `@import '${rel(src('styles/globals.css'))}';\n@source '${rel(src(''))}';\n`
const PAGINA = `
import { createRoot } from 'react-dom/client'
import './estilo.css'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '${src('components/ui/table.tsx')}'
import { RowActionsMenu } from '${src('components/composites/RowActionsMenu.tsx')}'
import { useHolofoteDaLinha } from '${src('components/composites/useHolofoteDaLinha.tsx')}'

const LINHAS = [{ id: 'a', nome: 'Alfa' }, { id: 'b', nome: 'Beta' }, { id: 'c', nome: 'Gama' }]
const acoes = [
  { key: 'ver', label: 'Ver', icon: <span>v</span>, tom: 'primario', onClick() {} },
  { key: 'pdf', label: 'PDF', icon: <span>p</span>, tom: 'pdf', onClick() {} },
  { key: 'excluir', label: 'Excluir', icon: <span>x</span>, tom: 'perigo', onClick() {} },
]

const ROLA = new URLSearchParams(location.search).get('rola') // 'v' (interna vertical), 'h' (interna lateral), 'm' (a própria moldura)
function Tabela({ ligado, cartoes }) {
  const h = useHolofoteDaLinha({ chaves: LINHAS.map((l) => l.id), ligado })
  return (
    <div {...h.moldura} id="moldura" className={'relative rounded-2xl border ' + (ROLA === 'm' ? 'overflow-auto' : 'overflow-hidden')} style={{ width: cartoes ? 360 : 700, ...(ROLA === 'm' && { height: 150 }) }}>
      {cartoes ? (
        <ul>
          {LINHAS.map((l) => (
            <li key={l.id} {...h.propsDaLinha(l.id)} className="flex items-center justify-between px-4 py-3">
              {l.nome}
              <RowActionsMenu rowId={l.id} actions={acoes} onOpenChange={h.aoMudarMenu(l.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <div id="rolagem" style={ROLA === 'v' ? { height: 130, overflowY: 'auto' } : ROLA === 'h' ? { width: 300, overflowX: 'auto' } : undefined}>
        <Table framed={false} aria-label="Teste" style={ROLA === 'h' ? { minWidth: 900 } : undefined}>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="w-12"><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {LINHAS.map((l) => (
              <TableRow key={l.id} {...h.propsDaLinha(l.id)} style={ROLA ? { height: 90 } : undefined}>
                <TableCell>{l.nome}</TableCell>
                <TableCell><RowActionsMenu rowId={l.id} actions={acoes} onOpenChange={h.aoMudarMenu(l.id)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
      {h.holofote}
    </div>
  )
}

const q = new URLSearchParams(location.search)
createRoot(document.getElementById('root')).render(<div style={{ padding: 24 }}><Tabela ligado={q.get('ligado') !== '0'} cartoes={q.get('c') === 'cartoes'} /></div>)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }

describe('useHolofoteDaLinha no navegador', { skip: semNavegador || false }, () => {
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

  async function abrir(query = '') {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, locale: 'pt-BR' })
    const page = await ctx.newPage()
    const erros = []
    page.on('pageerror', (e) => erros.push(String(e)))
    await page.goto(`${base}?${query}`)
    await page.waitForSelector('.fips-row-action')
    return { page, ctx, erros }
  }
  const emFoco = (page) => page.evaluate(() => [...document.querySelectorAll('[data-em-foco]')].map((e) => e.textContent.trim().slice(0, 4)))
  const recuo = (page) => page.evaluate(() => document.querySelector('#moldura').hasAttribute('data-recuo'))
  const gatilho = (page, n) => page.locator('.fips-row-action').nth(n)

  test('em repouso: nenhuma linha marcada, moldura sem recuo, holofote invisível', async () => {
    const { page, ctx } = await abrir()
    assert.deepEqual(await emFoco(page), [])
    assert.equal(await recuo(page), false)
    assert.equal(await page.locator('.fips-holofote').count(), 1)
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.fips-holofote')).opacity), '0')
    await ctx.close()
  })

  test('abrir o menu marca a linha e a moldura; o holofote cobre a linha; Esc limpa', async () => {
    const { page, ctx, erros } = await abrir()
    await gatilho(page, 1).click()
    await page.waitForSelector('.cmd-acao', { state: 'attached' })
    assert.deepEqual(await emFoco(page), ['Beta'])
    assert.equal(await recuo(page), true)
    await page.waitForTimeout(400)
    const caixas = await page.evaluate(() => {
      const r = (e) => e.getBoundingClientRect()
      const tr = r(document.querySelector('tr[data-em-foco]'))
      const h = r(document.querySelector('.fips-holofote'))
      return { dy: Math.abs(tr.top - h.top), dh: Math.abs(tr.height - h.height), opacidade: getComputedStyle(document.querySelector('.fips-holofote')).opacity }
    })
    assert.ok(caixas.dy <= 1 && caixas.dh <= 1, JSON.stringify(caixas))
    assert.equal(caixas.opacidade, '1')
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('[data-em-foco]'))
    assert.deepEqual(await emFoco(page), [])
    assert.equal(await recuo(page), false)
    assert.deepEqual(erros, [])
    await ctx.close()
  })

  test('clique na linha escolhe; setas movem sem dar a volta; Esc limpa', async () => {
    const { page, ctx } = await abrir()
    await page.locator('tbody tr').nth(0).locator('td').first().click()
    assert.deepEqual(await emFoco(page), ['Alfa'])
    await page.keyboard.press('ArrowDown')
    assert.deepEqual(await emFoco(page), ['Beta'])
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    assert.deepEqual(await emFoco(page), ['Gama'])
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    assert.deepEqual(await emFoco(page), ['Alfa'])
    assert.equal(await recuo(page), true)
    await page.keyboard.press('Escape')
    assert.deepEqual(await emFoco(page), [])
    assert.equal(await recuo(page), false)
    await ctx.close()
  })

  test('clique fora devolve a tabela', async () => {
    const { page, ctx } = await abrir()
    await page.locator('tbody tr').nth(2).locator('td').first().click()
    assert.deepEqual(await emFoco(page), ['Gama'])
    await page.mouse.click(5, 5)
    assert.deepEqual(await emFoco(page), [])
    await ctx.close()
  })

  test('ligado={false}: abrir o menu não marca nada nem põe o holofote', async () => {
    const { page, ctx } = await abrir('ligado=0')
    await gatilho(page, 0).click()
    await page.waitForSelector('.cmd-acao', { state: 'attached' })
    assert.deepEqual(await emFoco(page), [])
    assert.equal(await recuo(page), false)
    assert.equal(await page.locator('.fips-holofote').count(), 0)
    await ctx.close()
  })

  test('lista de cartões (li): mesma marcação e mesmas teclas', async () => {
    const { page, ctx } = await abrir('c=cartoes')
    await gatilho(page, 2).click()
    await page.waitForSelector('.cmd-acao', { state: 'attached' })
    assert.deepEqual(await emFoco(page), ['Gama'])
    assert.equal(await page.evaluate(() => document.querySelector('[data-em-foco]').tagName), 'LI')
    assert.equal(await recuo(page), true)
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('[data-em-foco]'))
    assert.equal(await recuo(page), false)
    await ctx.close()
  })

  const alinhamento = (page) =>
    page.evaluate(() => {
      const r = (e) => e.getBoundingClientRect()
      const tr = r(document.querySelector('tr[data-em-foco]'))
      const h = r(document.querySelector('.fips-holofote'))
      return { dy: Math.abs(tr.top - h.top), dh: Math.abs(tr.height - h.height) }
    })

  for (const [rola, nome, eixo] of [['v', 'rolagem vertical interna (cabeçalho fixo)', 'scrollTop'], ['m', 'a própria moldura rola na vertical', 'scrollTop'], ['h', 'rolagem lateral interna', 'scrollLeft']]) {
    test(`container que rola, ${nome}: o holofote acompanha a linha`, async () => {
      const { page, ctx, erros } = await abrir(`rola=${rola}`)
      await page.locator('tbody tr').nth(0).locator('td').first().click()
      await page.waitForTimeout(400)
      assert.deepEqual(await emFoco(page), ['Alfa'])
      const antes = await alinhamento(page)
      assert.ok(antes.dy <= 1 && antes.dh <= 1, `antes: ${JSON.stringify(antes)}`)
      const sel = rola === 'm' ? '#moldura' : '#rolagem'
      const rolou = await page.evaluate(([s, e]) => {
        // O scroller é o próprio alvo ou o primeiro descendente que de fato transborda no eixo.
        const raiz = document.querySelector(s)
        const cand = [raiz, ...raiz.querySelectorAll('div')]
        const el = cand.find((c) => (e === 'scrollLeft' ? c.scrollWidth > c.clientWidth : c.scrollHeight > c.clientHeight)) || raiz
        el[e] = 60
        return el[e]
      }, [sel, eixo])
      assert.ok(rolou > 0, 'o container precisa rolar de fato')
      await page.waitForTimeout(450)
      if (rola !== 'h') {
        const trTopo = await page.evaluate(() => document.querySelector('tr[data-em-foco]').getBoundingClientRect().top)
        assert.ok(trTopo !== undefined)
      }
      const depois = await alinhamento(page)
      assert.ok(depois.dy <= 1 && depois.dh <= 1, `depois da rolagem: ${JSON.stringify(depois)}`)
      assert.deepEqual(erros, [])
      await ctx.close()
    })
  }

  test('sem linha em foco o hook não escuta scroll nem resize; ao sair do foco, solta os dois', async () => {
    const { page, ctx } = await abrir('rola=v')
    await page.evaluate(() => {
      window.__ouvintes = { add: 0, rem: 0 }
      const a = EventTarget.prototype.addEventListener
      const r = EventTarget.prototype.removeEventListener
      EventTarget.prototype.addEventListener = function (t, ...x) { if (t === 'scroll' || t === 'resize') window.__ouvintes.add++; return a.call(this, t, ...x) }
      EventTarget.prototype.removeEventListener = function (t, ...x) { if (t === 'scroll' || t === 'resize') window.__ouvintes.rem++; return r.call(this, t, ...x) }
    })
    assert.deepEqual(await page.evaluate(() => window.__ouvintes), { add: 0, rem: 0 })
    await page.locator('tbody tr').nth(0).locator('td').first().click()
    const com = await page.evaluate(() => ({ ...window.__ouvintes }))
    assert.ok(com.add >= 2, JSON.stringify(com))
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('[data-em-foco]'))
    const fim = await page.evaluate(() => ({ ...window.__ouvintes }))
    assert.ok(fim.rem >= 2, JSON.stringify(fim))
    await ctx.close()
  })
})

describe('contraste no escuro: --color-primary-text nos pontos do menu da linha', () => {
  const css = readFileSync(src('styles/globals.css'), 'utf8')
  const bloco = (seletor) => {
    const i = css.indexOf(`\n${seletor} {`)
    assert.ok(i >= 0, `bloco ${seletor} não encontrado`)
    return css.slice(i, css.indexOf('\n}', i))
  }
  test('o + em hover, a borda do .cmd-glass:hover e a do .cmd-glass-center usam primary-text, nunca primary puro', () => {
    for (const sel of ['.fips-row-action:hover', '.cmd-glass:hover', '.cmd-glass-center']) {
      // Só a cor do texto e da borda; o fundo translúcido do hover é decoração e não carrega contraste.
      const b = bloco(sel).split('\n').filter((l) => /^\s*(color|border|border-color):/.test(l)).join('\n')
      assert.match(b, /var\(--color-primary-text\)/, sel)
      assert.doesNotMatch(b, /var\(--color-primary\)/, sel)
    }
  })
  test('o anel de foco do gatilho não usa primary puro', () => {
    const b = bloco('.fips-row-action:focus-visible')
    assert.doesNotMatch(b, /var\(--color-primary\)/)
  })
  test('primary-text: no claro é o próprio primary, no escuro é o azul 400', () => {
    assert.match(css, /--color-primary-text: var\(--color-primary\);/)
    assert.match(css, /--color-primary-text: var\(--color-fips-blue-400\);/)
  })
})
