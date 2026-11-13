/**
 * Linha ativa e ações do menu radial (0.25.3): cor por ação igual no repouso, realce e clique; ações apagadas;
 * anel e sombra no mesmo box-shadow; foco próprio no gatilho; aviso de abrir/fechar; holofote na
 * TabelaExpansivel (linha ativa no tom primário, demais recuadas sob véu cinza claro), ↑↓ e movimento reduzido.
 * Rodar: node --test scripts/linha-ativa-acoes.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { transform, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const imp = (caminho) => import(pathToFileURL(join(RAIZ, caminho)).href)
const radial = await imp('src/components/composites/menu-radial-logica.ts')
const linha = await imp('src/components/composites/tabela-linha-logica.ts')
const contraste = await imp('src/lib/contraste.ts')

const css = readFileSync(join(RAIZ, 'src/styles/globals.css'), 'utf8')
const fonteMenu = readFileSync(join(RAIZ, 'src/components/composites/CircularCommandMenu.tsx'), 'utf8')

/** Corpo da regra cujo seletor é exatamente `seletor` (primeira ocorrência fora de @layer). */
function regra(seletor) {
  const i = css.indexOf(`\n${seletor} {`)
  assert.notEqual(i, -1, `regra ${seletor}`)
  const abre = css.indexOf('{', i)
  return css.slice(abre + 1, css.indexOf('}', abre))
}

// ───────── Lógica pura ─────────
test('tom da ação: `tom` vence; sem ele, `danger` vira perigo; o resto é neutro', () => {
  assert.equal(radial.tomDaAcao({ tom: 'primario' }), 'primario')
  assert.equal(radial.tomDaAcao({ tom: 'pdf', danger: true }), 'pdf')
  assert.equal(radial.tomDaAcao({ danger: true }), 'perigo')
  assert.equal(radial.tomDaAcao({}), 'neutro')
})

test('realce ao abrir: teclado começa no 1º item, mouse sem realce', () => {
  assert.equal(radial.realceAoAbrir(true), 0)
  assert.equal(radial.realceAoAbrir(false), -1)
})

test('teclado sem realce: frente vai ao 1º, trás ao último, Enter não ativa', () => {
  assert.deepEqual(radial.acaoDoTeclado('ArrowDown', -1, 4), { tipo: 'mover', indice: 0 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowRight', -1, 4), { tipo: 'mover', indice: 0 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowUp', -1, 4), { tipo: 'mover', indice: 3 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowLeft', -1, 4), { tipo: 'mover', indice: 3 })
  assert.deepEqual(radial.acaoDoTeclado('Enter', -1, 4), { tipo: 'ignorar' })
  assert.deepEqual(radial.acaoDoTeclado(' ', -1, 4), { tipo: 'ignorar' })
  assert.deepEqual(radial.acaoDoTeclado('Escape', -1, 4), { tipo: 'fechar' })
})

test('↑↓ com linha em destaque: vizinha, sem dar a volta; sem destaque ou outra tecla, nada', () => {
  assert.equal(linha.linhaVizinha('ArrowDown', 1, 10), 2)
  assert.equal(linha.linhaVizinha('ArrowUp', 1, 10), 0)
  assert.equal(linha.linhaVizinha('ArrowUp', 0, 10), 0)
  assert.equal(linha.linhaVizinha('ArrowDown', 9, 10), 9)
  assert.equal(linha.linhaVizinha('ArrowDown', -1, 10), null)
  assert.equal(linha.linhaVizinha('ArrowLeft', 3, 10), null)
  assert.equal(linha.linhaVizinha('ArrowDown', 0, 0), null)
})

test('posição do holofote: relativa à moldura, descontada a borda, em px inteiros', () => {
  assert.deepEqual(linha.posicaoDoHolofote({ top: 260.4, height: 41.6 }, { top: 100 }, 1), { y: 159, altura: 42 })
  assert.deepEqual(linha.posicaoDoHolofote({ top: 100, height: 40 }, { top: 100 }), { y: 0, altura: 40 })
})

// ───────── CSS das ações ─────────
test('cor por ação: azul, vermelho escuro e vermelho de excluir (claro e escuro)', () => {
  assert.match(regra(".cmd-acao[data-tom='primario']"), /--cmd-acao: var\(--color-primary-text\)/)
  assert.match(regra(".cmd-acao[data-tom='pdf']"), /--cmd-acao: var\(--color-danger-text\)/)
  assert.match(regra(".cmd-acao[data-tom='perigo']"), /--cmd-acao: var\(--color-btn-danger-hover\)/)
  assert.match(regra(".dark .cmd-acao[data-tom='perigo']"), /--cmd-acao: var\(--color-red-400\)/)
  assert.match(regra('.cmd-acao-bolha'), /color: var\(--cmd-acao\)/)
})

test('ação realçada: fundo 8%, anel na cor da ação e sombra no MESMO box-shadow; clique 16%', () => {
  const ativa = regra('.cmd-acao[data-ativa] .cmd-acao-bolha')
  assert.match(ativa, /background: color-mix\(in srgb, var\(--cmd-acao\) 8%, var\(--color-surface\)\)/)
  assert.match(ativa, /border-color: var\(--cmd-acao\)/)
  assert.match(ativa, /box-shadow: 0 0 0 1px var\(--cmd-acao\), var\(--shadow-float\)/)
  assert.match(ativa, /transform: scale\(1\.1\)/)
  const clique = regra('.cmd-acao:active .cmd-acao-bolha')
  assert.match(clique, /color-mix\(in srgb, var\(--cmd-acao\) 16%, var\(--color-surface\)\)/)
  // O anel de utilitário (ring-2) perdia para o box-shadow do .cmd-glass: não pode voltar.
  assert.doesNotMatch(fonteMenu, /isActive && [^\n]*ring-/)
})

test('ações apagadas: opacidade 0,8 e escala 94% quando outra está realçada', () => {
  const r = regra('[data-tem-ativa] .cmd-acao:not([data-ativa]) .cmd-acao-bolha')
  assert.match(r, /opacity: 0\.8/)
  assert.match(r, /transform: scale\(0\.94\)/)
})

test('gatilho "+" da linha com anel de foco próprio', () => {
  assert.match(regra('.fips-row-action:focus-visible'), /outline: 2px solid var\(--color-ring\)/)
})

// ───────── CSS do holofote ─────────
test('holofote: véu --color-border-strong a 25% no claro e 35% no escuro, anel primário, desliza por transform', () => {
  const h = regra('.fips-holofote')
  assert.match(h, /0 0 0 2px var\(--color-primary-text\)/)
  assert.match(h, /0 0 0 200vmax color-mix\(in srgb, var\(--color-border-strong\) var\(--fips-veu\), transparent\)/)
  assert.match(h, /--fips-veu-max: 25%/)
  assert.match(h, /transition: transform/)
  assert.match(regra('.dark .fips-holofote'), /--fips-veu-max: 35%/)
  assert.match(regra('[data-recuo] > .fips-holofote'), /--fips-veu: var\(--fips-veu-max\)/)
  assert.match(css, /@property --fips-veu/)
})

test('linha ativa no tom primário e texto secundário reforçado; recuadas não reagem a hover', () => {
  assert.match(css, /tr\[data-em-foco\] > td,\nli\[data-em-foco\] \{\n  background-color: color-mix\(in srgb, var\(--color-primary-text\) 9%, var\(--color-surface\)\)/)
  assert.match(regra('tr[data-em-foco]'), /--color-fg-muted: var\(--color-fg-muted-strong\)/)
  assert.match(
    regra("[data-recuo] tbody > tr[data-linha]:not([data-em-foco]):not([data-state='selected']):hover"),
    /background-color: transparent/,
  )
})

test('movimento reduzido: holofote sem transição e bolha sem escala', () => {
  const i = css.indexOf('@media (prefers-reduced-motion: reduce) {\n  *,')
  assert.notEqual(i, -1)
  const bloco = css.slice(i, css.indexOf('\n}\n', i))
  assert.match(bloco, /\.fips-holofote \{\s*transition: none !important;/)
  assert.match(bloco, /\.cmd-acao-bolha \{\s*transform: none !important;/)
})

// ───────── Contraste (tokens do globals.css) ─────────
const tw = readFileSync(join(RAIZ, 'node_modules/tailwindcss/theme.css'), 'utf8')
function bloco(inicio) {
  const i = css.indexOf(inicio)
  assert.notEqual(i, -1, inicio)
  return css.slice(i, css.indexOf('\n  }', i))
}
const CLARO = bloco('  :root {\n    color-scheme: light')
const ESCURO = bloco('  .dark {\n    color-scheme: dark')
const lerVar = (trecho, nome) => (trecho.match(new RegExp(`\\s${nome}:\\s*([^;]+);`)) || [])[1]?.trim()

function oklchParaRgb(l, c, h) {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
  const g = (v) => Math.round(255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)))
  return { r: g(lin[0]), g: g(lin[1]), b: g(lin[2]) }
}

function cor(tema, valor) {
  valor = valor.trim()
  const v = valor.match(/^var\((--[\w-]+)\)$/)
  if (v) {
    const nome = v[1]
    const bruto =
      (tema === 'escuro' && lerVar(ESCURO, nome)) ||
      lerVar(CLARO, nome) ||
      (css.match(new RegExp(`\\n  ${nome}:\\s*([^;]+);`)) || [])[1] ||
      (tw.match(new RegExp(`${nome}:\\s*([^;]+);`)) || [])[1]
    assert.ok(bruto, `token ${nome}`)
    return cor(tema, bruto)
  }
  const ok = valor.match(/^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)$/)
  if (ok) return oklchParaRgb(+ok[1] / 100, +ok[2], +ok[3])
  const hex = contraste.lerHex(valor)
  assert.ok(hex, `cor ${valor}`)
  return hex
}
const mistura = (a, p, b) => ({
  r: a.r * p + b.r * (1 - p),
  g: a.g * p + b.g * (1 - p),
  b: a.b * p + b.b * (1 - p),
})
const razao = (a, b) => contraste.razaoDeContraste(a, b)

const ACOES = { primario: 'var(--color-primary-text)', pdf: 'var(--color-danger-text)' }
for (const tema of ['claro', 'escuro']) {
  test(`contraste ${tema}: linha ativa >= 4,5; ícone realçado >= 4,5; anéis >= 3; recuadas >= 3`, () => {
    const sup = cor(tema, 'var(--color-surface)')
    const fg = cor(tema, 'var(--color-fg)')
    const prim = cor(tema, 'var(--color-primary-text)')
    const fundoAtiva = mistura(prim, 0.09, sup)
    assert.ok(razao(fg, fundoAtiva) >= 4.5, `linha ativa ${razao(fg, fundoAtiva).toFixed(2)}`)
    assert.ok(razao(prim, sup) >= 3, `anel da linha ${razao(prim, sup).toFixed(2)}`)
    const veu = mistura(cor(tema, 'var(--color-border-strong)'), tema === 'claro' ? 0.25 : 0.35, sup)
    const fgVeu = mistura(cor(tema, 'var(--color-border-strong)'), tema === 'claro' ? 0.25 : 0.35, fg)
    assert.ok(razao(fgVeu, veu) >= 3, `recuada ${razao(fgVeu, veu).toFixed(2)}`)
    const tons = { ...ACOES, perigo: tema === 'claro' ? 'var(--color-btn-danger-hover)' : 'var(--color-red-400)' }
    for (const [nome, valor] of Object.entries(tons)) {
      const acao = cor(tema, valor)
      const bolha = mistura(acao, 0.08, sup)
      assert.ok(razao(acao, bolha) >= 4.5, `${nome} realçado ${razao(acao, bolha).toFixed(2)}`)
      assert.ok(razao(acao, sup) >= 3, `${nome} anel ${razao(acao, sup).toFixed(2)}`)
    }
  })
}

// ───────── Render: props novas chegam ao DOM ─────────
let vite
let C
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  C = await vite.ssrLoadModule('/src/components/composites/TabelaExpansivel.tsx')
})
after(async () => { await vite?.close() })

const LINHAS = [{ id: 'a', nome: 'Alfa' }, { id: 'b', nome: 'Beta' }]
const tabela = (props = {}) =>
  renderToStaticMarkup(
    React.createElement(C.TabelaExpansivel, {
      colunas: [{ id: 'nome', titulo: 'Nome', celula: (l) => l.nome }],
      linhas: LINHAS,
      chave: (l) => l.id,
      renderDetalhe: () => null,
      rotulo: 'Teste',
      acoesDaLinha: () => [{ key: 'ver', label: 'Ver', icon: null, tom: 'primario', onClick() {} }],
      ...props,
    }),
  )

test('TabelaExpansivel: moldura com o holofote, linhas marcadas e sem recuo antes de abrir', () => {
  const m = tabela()
  assert.match(m, /class="fips-holofote"/)
  assert.equal((m.match(/data-linha=""/g) || []).length, 2)
  assert.doesNotMatch(m, /data-recuo/)
  assert.doesNotMatch(m, /data-em-foco/)
  assert.match(m, /class="relative overflow-hidden/)
})

test('TabelaExpansivel: destaqueDaLinha={false} tira o holofote', () => {
  assert.doesNotMatch(tabela({ destaqueDaLinha: false }), /fips-holofote/)
})

// ───────── 0.25.4: vidro fosco que sobrevive ao build e holofote nos cartões ─────────
test('vidro do menu: o build mantém backdrop-filter sem prefixo (o -webkit- vem antes)', () => {
  const alvos = browserslistToTargets(browserslist('chrome 111, edge 111, firefox 128, safari 16.4'))
  for (const seletor of ['.cmd-glass', '.cmd-glass-center']) {
    const corpo = regra(seletor)
    const saida = transform({ code: Buffer.from(`${seletor}{${corpo}}`), minify: true, targets: alvos, filename: 'x.css' }).code.toString()
    assert.match(saida, /[;{]backdrop-filter:blur/, `${seletor} sem backdrop-filter depois do build: ${saida}`)
  }
})

test('celular: o cartão do menu aberto ganha o tom e o holofote vale também nos cartões', () => {
  assert.match(css, /tr\[data-em-foco\] > td,\nli\[data-em-foco\] \{\n  background-color: color-mix\(in srgb, var\(--color-primary-text\) 9%/)
  assert.match(css, /\nli\[data-em-foco\] \{\n  position: relative;\n  z-index: 3;\n  --color-fg-muted: var\(--color-fg-muted-strong\);/)
  const fonte = readFileSync(join(RAIZ, 'src/components/composites/TabelaExpansivel.tsx'), 'utf8')
  assert.equal((fonte.match(/onOpenChange=\{aoMudarMenu\(k\)\}/g) || []).length, 2, 'tabela e cartões avisam o menu')
  assert.match(fonte, /const comHolofote = destaqueDaLinha && Boolean\(acoesDaLinha\)/)
  assert.match(fonte, /<li\s+key=\{k\}\s+ref=/)
})
