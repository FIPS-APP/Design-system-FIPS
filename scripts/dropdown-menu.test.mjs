/**
 * DropdownMenu e Separator.
 *
 * Parte 1, sem navegador: contraste nos dois temas (texto 4,5:1, ícone de marcação 3:1), só token no
 * componente, mesmo visual do UserAccountMenu, exports e página do site.
 * Parte 2, no navegador (playwright, como scripts/select-portal.test.mjs): teclado (setas, Home, End,
 * Enter, Esc, foco volta ao gatilho), item destrutivo na cor medida e menu inteiro dentro da janela
 * de 375 px. Sem playwright a parte 2 é pulada e o aviso no topo diz o motivo.
 * Rodar: node --test scripts/dropdown-menu.test.mjs
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
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
const MIN_TEXTO = 4.5
const MIN_ICONE = 3

// ─── Cores: tokens de src/styles/globals.css, resolvidos por tema ───
const css = ler('src/styles/globals.css').replace(/\/\*[^]*?\*\//g, '')
const declaracoes = (trecho) => {
  const mapa = {}
  for (const [, n, v] of trecho.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) mapa[n] = v.trim()
  return mapa
}
const bloco = (seletor) => {
  const i = css.indexOf(`${seletor} {`)
  assert.notEqual(i, -1, `bloco ${seletor} não encontrado`)
  return css.slice(i, css.indexOf('\n  }', i))
}
const iTema = css.indexOf('@theme {')
const tema = css.slice(iTema, css.indexOf('\n}', iTema))
const TOKENS = {
  claro: { ...declaracoes(tema), ...declaracoes(bloco(':root')) },
  escuro: { ...declaracoes(tema), ...declaracoes(bloco(':root')), ...declaracoes(bloco('.dark')) },
}
const resolver = (valor, t, vistos = new Set()) => {
  const ref = valor.match(/^var\((--[\w-]+)\)$/)
  if (!ref) return valor
  assert.ok(!vistos.has(ref[1]), `ciclo em ${ref[1]}`)
  vistos.add(ref[1])
  assert.ok(TOKENS[t][ref[1]], `token ${ref[1]} não existe no tema ${t}`)
  return resolver(TOKENS[t][ref[1]], t, vistos)
}
const cor = (valor, t) => {
  const v = resolver(valor, t)
  const hex = v.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }
  }
  const m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
  return assert.fail(`cor não reconhecida: ${valor} -> ${v}`)
}
const token = (n, t, alfa = 1) => {
  assert.ok(TOKENS[t][n], `token ${n} não existe no tema ${t}`)
  const c = cor(TOKENS[t][n], t)
  return { ...c, a: c.a * alfa }
}
const sobre = (topo, fundo) => ({
  r: topo.r * topo.a + fundo.r * (1 - topo.a),
  g: topo.g * topo.a + fundo.g * (1 - topo.a),
  b: topo.b * topo.a + fundo.b * (1 - topo.a),
  a: 1,
})
const lum = ({ r, g, b }) => {
  const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// ─── O que o componente usa, lido do fonte ───
const fonte = ler('src/components/ui/dropdown-menu.tsx')
const constante = (nome) => {
  const m = fonte.match(new RegExp(`const ${nome} =\\s*\\n?\\s*'([^']+)'`))
  assert.ok(m, `constante ${nome} não encontrada em dropdown-menu.tsx`)
  return m[1]
}
const tokenDe = (classes, prefixo) => {
  const m = classes.match(new RegExp(`${prefixo}\\[var\\((--[\\w-]+)\\)\\](?:/(\\d+))?`))
  assert.ok(m, `classe ${prefixo} não encontrada em: ${classes}`)
  return { nome: m[1], alfa: m[2] ? +m[2] / 100 : 1 }
}
const padrao = constante('itemPadrao')
const destrutivo = constante('itemDestrutivo')
const rotulo = fonte.match(/<DropdownMenuPrimitive\.Label[^]*?'([^']+)',/)[1]

const CASOS = {
  claro: {
    foco: tokenDe(padrao, 'data-\\[highlighted\\]:bg-'),
    focoDestrutivo: tokenDe(destrutivo, 'data-\\[highlighted\\]:bg-'),
  },
  escuro: {
    foco: tokenDe(padrao, 'dark:data-\\[highlighted\\]:bg-'),
    focoDestrutivo: tokenDe(destrutivo, 'data-\\[highlighted\\]:bg-'),
  },
}
const texto = { normal: tokenDe(padrao, 'text-'), destrutivo: tokenDe(destrutivo, 'text-'), rotulo: tokenDe(rotulo, 'text-') }
const icone = { normal: tokenDe(padrao, '\\[&>svg\\]:text-'), destrutivo: tokenDe(destrutivo, '\\[&>svg\\]:text-') }
const marca = fonte.match(/<Check className="size-3\.5 text-\[var\((--[\w-]+)\)\]"/)[1]

const medidas = {}
for (const t of ['claro', 'escuro']) {
  const cartao = token('--color-surface', t)
  const fundoFoco = sobre(token(CASOS[t].foco.nome, t, CASOS[t].foco.alfa), cartao)
  const fundoFocoDestrutivo = sobre(token(CASOS[t].focoDestrutivo.nome, t, CASOS[t].focoDestrutivo.alfa), cartao)
  const c = (t1, fundo) => contraste(token(t1.nome, t), fundo)
  medidas[t] = {
    item: c(texto.normal, cartao),
    itemFoco: c(texto.normal, fundoFoco),
    iconeFoco: c(icone.normal, fundoFoco),
    destrutivo: c(texto.destrutivo, cartao),
    destrutivoFoco: c(texto.destrutivo, fundoFocoDestrutivo),
    iconeDestrutivoFoco: c(icone.destrutivo, fundoFocoDestrutivo),
    rotulo: c(texto.rotulo, cartao),
    marca: contraste(token(marca, t), cartao),
  }
}

describe('DropdownMenu: contraste nos dois temas', () => {
  for (const t of ['claro', 'escuro']) {
    test(`tema ${t}: texto >= ${MIN_TEXTO}:1 em repouso e em foco, normal e destrutivo`, (ctx) => {
      const m = medidas[t]
      ctx.diagnostic(
        `${t}: item ${m.item.toFixed(2)} | foco ${m.itemFoco.toFixed(2)} | destrutivo ${m.destrutivo.toFixed(2)} | destrutivo em foco ${m.destrutivoFoco.toFixed(2)} | rótulo ${m.rotulo.toFixed(2)}`,
      )
      for (const k of ['item', 'itemFoco', 'destrutivo', 'destrutivoFoco', 'rotulo']) {
        assert.ok(m[k] >= MIN_TEXTO, `${k}: ${m[k].toFixed(2)}:1`)
      }
    })
    test(`tema ${t}: ícone e marca >= ${MIN_ICONE}:1`, (ctx) => {
      const m = medidas[t]
      ctx.diagnostic(
        `${t}: ícone em foco ${m.iconeFoco.toFixed(2)} | ícone destrutivo em foco ${m.iconeDestrutivoFoco.toFixed(2)} | marca ${m.marca.toFixed(2)}`,
      )
      for (const k of ['iconeFoco', 'iconeDestrutivoFoco', 'marca']) {
        assert.ok(m[k] >= MIN_ICONE, `${k}: ${m[k].toFixed(2)}:1`)
      }
    })
  }
})

describe('DropdownMenu: fonte e pacote', () => {
  test('só token, nenhuma cor fixa', () => {
    assert.equal(fonte.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
    assert.equal(ler('src/components/ui/separator.tsx').match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
  })

  test('mesma superfície e mesma entrada de 150 ms do UserAccountMenu', () => {
    const conta = ler('src/components/composites/UserAccountMenu.tsx')
    const painel = fonte.match(/dropdownMenuPainel =\s*\n?\s*'([^']+)'/)[1]
    for (const classe of painel.split(' ')) assert.ok(conta.includes(classe), `UserAccountMenu não tem ${classe}`)
    assert.match(css, /\.fips-dropdown-menu\[data-state='open'\]\s*\{\s*animation: fipsDropdownEntrada 0\.15s/)
  })

  test('movimento reduzido desliga a entrada', () => {
    assert.match(
      css,
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.fips-dropdown-menu\[data-state='open'\]\s*\{\s*animation: none;/,
    )
  })

  test('o UserAccountMenu não mudou: item e painel seguem os mesmos', () => {
    const conta = ler('src/components/composites/UserAccountMenu.tsx')
    assert.ok(conta.includes("rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]"))
    assert.ok(conta.includes('hover:bg-[var(--color-accent)]/20'))
  })

  test('src/index.ts exporta o DropdownMenu, o Separator e as dependências estão fixas', () => {
    const ui = ler('src/components/ui/index.ts')
    for (const nome of [
      'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuLabel',
      'DropdownMenuSeparator', 'DropdownMenuCheckboxItem', 'DropdownMenuGroup', 'Separator',
    ]) {
      assert.match(ui, new RegExp(`\\b${nome},?\\n|\\b${nome} \\}`), `${nome} fora de ui/index.ts`)
    }
    assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
    const pkg = JSON.parse(ler('package.json'))
    for (const d of ['@radix-ui/react-dropdown-menu', '@radix-ui/react-separator']) {
      assert.match(pkg.dependencies[d], /^\d+\.\d+\.\d+$/, `${d} sem versão exata`)
    }
  })

  test('uma só cópia das camadas do Radix: Esc dentro do Modal fecha só o menu', () => {
    // Duas versões de dismissable-layer (uma do Dialog, outra do menu) têm pilhas separadas e o Esc fecha o Modal junto.
    const lock = JSON.parse(ler('package-lock.json')).packages
    for (const pacote of ['react-dismissable-layer', 'react-focus-scope', 'react-portal', 'react-presence']) {
      const copias = Object.keys(lock).filter((c) => c.endsWith(`/node_modules/@radix-ui/${pacote}`) || c === `node_modules/@radix-ui/${pacote}`)
      assert.equal(copias.length, 1, `${pacote} em ${copias.length} cópias: ${copias.join(', ')}`)
    }
  })

  test('o item destrutivo é uma variante, não uma classe solta', () => {
    assert.match(fonte, /variant\?: 'default' \| 'destructive'/)
    assert.match(fonte, /data-variant=\{variant\}/)
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
  semNavegador = CHROME
    ? `DS_CHROME não existe: ${CHROME}`
    : 'Chromium do playwright não instalado (npx playwright install chromium, ou DS_CHROME com um Chrome instalado)'
}
if (semNavegador) console.warn(`dropdown-menu: parte 2 (teclado no navegador) pulada. ${semNavegador}`)

const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-dropdown-menu')
const src = (rel) => join(RAIZ, 'src', rel)
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
import { Modal } from '${src('components/ui/Modal.tsx')}'
import { Button } from '${src('components/ui/button.tsx')}'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '${src('components/ui/dropdown-menu.tsx')}'

function Menu() {
  const [log, setLog] = useState([])
  const marca = (x) => () => setLog((l) => [...l, x])
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline" data-gatilho>Ações</Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Linha 4025</DropdownMenuLabel>
          <DropdownMenuItem onSelect={marca('editar')}>Editar</DropdownMenuItem>
          <DropdownMenuItem disabled>Duplicar</DropdownMenuItem>
          <DropdownMenuItem onSelect={marca('mover')}>Mover</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={marca('excluir')}>Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <output id="log">{log.join(',')}</output>
    </>
  )
}

function App() {
  const c = new URLSearchParams(location.search).get('c') || 'solto'
  const [aberto, setAberto] = useState(true)
  if (c === 'modal') {
    return (
      <Modal open={aberto} onOpenChange={setAberto} title="Nova inspeção" size="md">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Menu /></div>
      </Modal>
    )
  }
  return <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-end' }}><Menu /></div>
}

createRoot(document.getElementById('root')).render(<App />)
`
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }

describe('DropdownMenu no navegador', { skip: semNavegador || false }, () => {
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

  async function abrir(cenario, { largura = 1440, altura = 900, escuro = false } = {}) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: altura }, locale: 'pt-BR' })
    const page = await ctx.newPage()
    const erros = []
    page.on('pageerror', (e) => erros.push(String(e)))
    await page.goto(`${base}?c=${cenario}`)
    await page.waitForSelector('[data-gatilho]')
    if (escuro) await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
    return { page, ctx, erros }
  }
  // O Radix devolve o foco logo depois de desmontar o menu, não no mesmo instante.
  const focoNoGatilho = (page) =>
    page.waitForFunction(() => document.activeElement?.hasAttribute('data-gatilho'), null, { timeout: 2000 })
  const esperaDestaque = (page, texto) =>
    page.waitForFunction((t) => document.querySelector('[role="menuitem"][data-highlighted]')?.textContent === t, texto, { timeout: 2000 })

  test('Enter abre, setas percorrem pulando o item desabilitado, Home e End, Esc fecha e o foco volta ao gatilho', async () => {
    const { page, ctx, erros } = await abrir('solto')
    await page.focus('[data-gatilho]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[role="menu"]')
    await esperaDestaque(page, 'Editar')
    await page.keyboard.press('ArrowDown')
    await esperaDestaque(page, 'Mover') // Duplicar está desabilitado
    await page.keyboard.press('ArrowDown')
    await esperaDestaque(page, 'Excluir')
    await page.keyboard.press('ArrowDown')
    await esperaDestaque(page, 'Excluir') // não dá a volta: o foco para no último
    await page.keyboard.press('End')
    await esperaDestaque(page, 'Excluir')
    await page.keyboard.press('Home')
    await esperaDestaque(page, 'Editar')
    await page.keyboard.press('ArrowUp')
    await esperaDestaque(page, 'Editar') // também não dá a volta para cima
    await page.keyboard.press('Escape')
    await page.waitForSelector('[role="menu"]', { state: 'detached' })
    await focoNoGatilho(page)
    assert.deepEqual(erros, [])
    await ctx.close()
  })

  test('seta para baixo no gatilho abre; Enter no item dispara a ação, fecha e devolve o foco', async () => {
    const { page, ctx } = await abrir('solto')
    await page.focus('[data-gatilho]')
    await page.keyboard.press('ArrowDown')
    await page.waitForSelector('[role="menu"]')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await esperaDestaque(page, 'Mover')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[role="menu"]', { state: 'detached' })
    assert.equal(await page.textContent('#log'), 'mover')
    await focoNoGatilho(page)
    await ctx.close()
  })

  test('digitar a inicial do item leva o foco até ele', async () => {
    const { page, ctx } = await abrir('solto')
    await page.focus('[data-gatilho]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[role="menu"]')
    await page.keyboard.press('m')
    await esperaDestaque(page, 'Mover')
    await ctx.close()
  })

  for (const tema of ['claro', 'escuro']) {
    test(`item destrutivo no tema ${tema}: a cor pintada é o token medido`, async (t) => {
      const { page, ctx } = await abrir('solto', { escuro: tema === 'escuro' })
      await page.click('[data-gatilho]')
      await page.waitForSelector('[role="menu"]')
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
      const pintada = await page.evaluate(() => {
        const el = [...document.querySelectorAll('[role="menuitem"]')].find((e) => e.dataset.variant === 'destructive')
        return getComputedStyle(el).color
      })
      const esperada = token(texto.destrutivo.nome, tema)
      assert.equal(pintada, `rgb(${esperada.r}, ${esperada.g}, ${esperada.b})`)
      t.diagnostic(`${tema}: ${pintada}, ${medidas[tema].destrutivo.toFixed(2)}:1 sobre o cartão`)
      await ctx.close()
    })
  }

  test('dentro do Modal a 375 px o menu aparece inteiro e acima do Modal', async () => {
    const { page, ctx } = await abrir('modal', { largura: 375, altura: 667 })
    await page.click('[data-gatilho]')
    await page.waitForSelector('[role="menu"]')
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))
    const caixa = await page.evaluate(() => {
      const r = document.querySelector('[role="menu"]').getBoundingClientRect()
      const meio = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, w: innerWidth, h: innerHeight, topo: !!meio?.closest('[role="menu"]') }
    })
    assert.ok(caixa.left >= 0 && caixa.right <= caixa.w, `horizontal: ${caixa.left} a ${caixa.right} de ${caixa.w}`)
    assert.ok(caixa.top >= 0 && caixa.bottom <= caixa.h, `vertical: ${caixa.top} a ${caixa.bottom} de ${caixa.h}`)
    assert.equal(caixa.topo, true, 'o Modal cobre o menu')
    await page.keyboard.press('Escape')
    await page.waitForSelector('[role="menu"]', { state: 'detached' })
    await focoNoGatilho(page)
    await ctx.close()
  })
})
