/**
 * Contraste do texto do Badge success e warning, nos dois temas (WCAG 1.4.3, mínimo 4,5:1).
 * O Badge usa texto de 10 e 12 px, então não vale a régua de texto grande.
 * Lê os tokens de src/styles/globals.css e as classes de badge-variants.ts, sem dependência.
 * Rodar: node --test scripts/contraste-badge.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')
const MINIMO = 4.5

// ─── Tokens ────────────────────────────────────────────────────────────────
const css = ler('src/styles/globals.css')

function declaracoes(trecho) {
  const mapa = {}
  for (const [, nome, valor] of trecho.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) mapa[nome] = valor.trim()
  return mapa
}

function bloco(seletor) {
  const inicio = css.indexOf(`${seletor} {`)
  assert.notEqual(inicio, -1, `bloco ${seletor} não encontrado em globals.css`)
  return css.slice(inicio, css.indexOf('\n  }', inicio))
}

const inicioTema = css.indexOf('@theme {')
const tema = css.slice(inicioTema, css.indexOf('\n}', inicioTema))
const TOKENS = {
  claro: { ...declaracoes(tema), ...declaracoes(bloco(':root')) },
  escuro: { ...declaracoes(tema), ...declaracoes(bloco(':root')), ...declaracoes(bloco('.dark')) },
}

function resolver(valor, t, vistos = new Set()) {
  const ref = valor.match(/^var\((--[\w-]+)\)$/)
  if (!ref) return valor
  assert.ok(!vistos.has(ref[1]), `ciclo em ${ref[1]}`)
  vistos.add(ref[1])
  const proximo = TOKENS[t][ref[1]]
  assert.ok(proximo, `token ${ref[1]} não existe no tema ${t}`)
  return resolver(proximo, t, vistos)
}

// Devolve { r, g, b, a }. Aceita #rgb, #rrggbb e rgba(r, g, b, a).
function cor(valor, t) {
  const v = resolver(valor, t)
  const hex = v.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }
  }
  const rgba = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/)
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] }
  assert.fail(`cor não reconhecida: ${valor} -> ${v}`)
}

const token = (nome, t) => {
  assert.ok(TOKENS[t][nome], `token ${nome} não existe no tema ${t}`)
  return cor(TOKENS[t][nome], t)
}

// Cor com transparência pousada sobre um fundo opaco.
const sobre = (topo, fundo) => ({
  r: topo.r * topo.a + fundo.r * (1 - topo.a),
  g: topo.g * topo.a + fundo.g * (1 - topo.a),
  b: topo.b * topo.a + fundo.b * (1 - topo.a),
  a: 1,
})

function luminancia({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

// ─── Badge success e warning ───────────────────────────────────────────────
const VARIANTES = 'src/components/ui/badge-variants.ts'
const fonte = ler(VARIANTES)

// Superfícies onde o Badge aparece: cartão, cartão suave e faixa.
const SUPERFICIES = ['--color-surface', '--color-surface-soft', '--color-surface-muted']

for (const variante of ['success', 'warning']) {
  const linha = fonte.match(new RegExp(`${variante}:\\s*\n?\\s*'([^']+)'`))
  assert.ok(linha, `${VARIANTES}: variante ${variante} não encontrada`)
  const classes = linha[1]
  const pegar = (prefixo) => {
    const m = classes.match(new RegExp(`(?:^|\\s)${prefixo}-\\[var\\((--[\\w-]+)\\)\\]`))
    assert.ok(m, `${VARIANTES}: classe ${prefixo}-[var(--...)] não encontrada em ${variante}`)
    return m[1]
  }
  const TEXTO = pegar('text')
  const FUNDO = pegar('bg')

  test(`Badge ${variante}: nenhuma cor fixa nas classes, só token`, () => {
    assert.equal(classes.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null, `cor fixa em ${variante}: ${classes}`)
  })

  for (const t of ['claro', 'escuro']) {
    test(`Badge ${variante}, tema ${t}: texto contra o fundo em todas as superfícies (>= ${MINIMO}:1)`, () => {
      const texto = token(TEXTO, t)
      const fundo = token(FUNDO, t)
      for (const superficie of SUPERFICIES) {
        const base = token(superficie, t)
        const c = contraste(sobre(texto, sobre(fundo, base)), sobre(fundo, base))
        assert.ok(c >= MINIMO, `${TEXTO} sobre ${FUNDO} em ${superficie}: ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
      }
    })
  }
}

// ─── Alert warning e o --color-accent-strong como texto ────────────────────
import { readdirSync, statSync } from 'node:fs'

const COR_FIXA = /#[\da-f]{3,8}\b|rgba?\(/i

// Cor com transparência de um token, composta sobre o cartão do tema.
function compostoSobreCartao(nome, t) {
  return sobre(token(nome, t), token('--color-surface', t))
}

function arquivosDe(pasta, saida = []) {
  for (const nome of readdirSync(join(RAIZ, pasta))) {
    const caminho = join(pasta, nome)
    if (statSync(join(RAIZ, caminho)).isDirectory()) arquivosDe(caminho, saida)
    else if (/\.(ts|tsx)$/.test(nome)) saida.push(caminho)
  }
  return saida
}

{
  const ALERT = 'src/components/composites/Alert.tsx'
  const linha = ler(ALERT).match(/warning:\s*\n?\s*'([^']+)'/)
  assert.ok(linha, `${ALERT}: tom warning não encontrado`)
  const pegar = (prefixo) => {
    const m = linha[1].match(new RegExp(`(?:^|\\s)${prefixo}-\\[var\\((--[\\w-]+)\\)\\]`))
    assert.ok(m, `${ALERT}: classe ${prefixo}-[var(--...)] não encontrada em warning`)
    return m[1]
  }
  const [TEXTO, FUNDO] = [pegar('text'), pegar('bg')]

  for (const t of ['claro', 'escuro']) {
    test(`Alert warning, tema ${t}: texto contra o fundo em todas as superfícies (>= ${MINIMO}:1)`, () => {
      for (const superficie of SUPERFICIES) {
        const base = token(superficie, t)
        const fundo = sobre(token(FUNDO, t), base)
        const c = contraste(sobre(token(TEXTO, t), fundo), fundo)
        assert.ok(c >= MINIMO, `${TEXTO} sobre ${FUNDO} em ${superficie}: ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
      }
    })
  }
}

test('Nenhum componente lê --color-accent-strong como cor de texto (é fundo e borda: 2,32:1 sobre branco)', () => {
  const achados = []
  for (const arquivo of arquivosDe('src').filter((a) => !a.startsWith(join('src', 'docs')))) {
    ler(arquivo).split('\n').forEach((linha, i) => {
      if (/(?:^|[\s'"`:])(?:[\w-]+:)*text-\[var\(--color-accent-strong\)\]/.test(linha) || /\bcolor:\s*['"`]var\(--color-accent-strong\)/.test(linha)) {
        achados.push(`${arquivo}:${i + 1}`)
      }
    })
  }
  assert.deepEqual(achados, [], `--color-accent-strong como texto:\n${achados.join('\n')}`)
})

// Eyebrow de 11 px sobre o degradê azul do cabeçalho de Modal, Drawer, ExportPreviewModal e ChangelogModal.
const EYEBROWS = [
  ['src/components/ui/Modal.tsx', /tracking-\[0\.14em\] text-\[var\((--[\w-]+)\)\]">\{eyebrow\}/],
  ['src/components/ui/drawer.tsx', /color: 'var\((--[\w-]+)\)' \}\}\s*>\s*\{eyebrow\}/],
  ['src/components/composites/ExportPreviewModal.tsx', /tracking-\[0\.14em\] text-\[var\((--[\w-]+)\)\] uppercase/],
  ['src/components/layout/ChangelogModal.tsx', /tracking-\[0\.14em\] text-\[var\((--[\w-]+)\)\] uppercase/],
]

function fundosDoCabecalho(t) {
  // Modal e Drawer: --color-gov-gradient-from, -to e #001A4A. ExportPreviewModal e ChangelogModal: --fips-banner-content-bg.
  const nomes = ['--color-gov-gradient-from', '--color-gov-gradient-to']
  const fundos = nomes.map((n) => token(n, t))
  const gradientes = [...css.matchAll(/--fips-banner-content-bg:\s*linear-gradient\(([^;]+)\);/g)]
  assert.equal(gradientes.length, 2, '--fips-banner-content-bg deve ter um valor no claro e outro no escuro')
  const m = gradientes[t === 'escuro' ? 1 : 0]
  for (const hex of m[1].match(/#[\da-f]{6}/gi) ?? []) fundos.push(cor(hex, t))
  fundos.push(cor('#001a4a', t))
  return fundos
}

for (const [arquivo, padrao] of EYEBROWS) {
  for (const t of ['claro', 'escuro']) {
    test(`Eyebrow de ${arquivo.split('/').pop()}, tema ${t}: texto contra o degradê do cabeçalho (>= ${MINIMO}:1)`, () => {
      const m = ler(arquivo).match(padrao)
      assert.ok(m, `${arquivo}: eyebrow não encontrada`)
      const texto = token(m[1], t)
      for (const fundo of fundosDoCabecalho(t)) {
        const c = contraste(texto, fundo)
        assert.ok(c >= MINIMO, `${m[1]} sobre rgb(${fundo.r},${fundo.g},${fundo.b}): ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
      }
    })
  }
}

for (const t of ['claro', 'escuro']) {
  test(`ChangelogModal "Importante", tema ${t}: texto contra o cartão do item (>= ${MINIMO}:1)`, () => {
    const fonte = ler('src/components/layout/ChangelogModal.tsx')
    const bloco_ = fonte.match(/breaking:\s*\{[\s\S]*?\n  \},/)[0]
    const texto = bloco_.match(/accent: 'text-\[var\((--[\w-]+)\)\]'/)[1]
    const fundo = bloco_.match(/bg-\[var\((--[\w-]+)\)\]\/(\d+)/)
    const cartao = token('--color-surface', t)
    const base = sobre({ ...token(fundo[1], t), a: Number(fundo[2]) / 100 }, cartao)
    const c = contraste(token(texto, t), base)
    assert.ok(c >= MINIMO, `${texto} sobre ${fundo[1]}/${fundo[2]}: ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
  })

  test(`UserAccountMenu, tema ${t}: ícone em hover contra o fundo do item (>= 3:1)`, () => {
    const fonte = ler('src/components/layout/UserAccountMenu.tsx')
    const icone = fonte.match(/group-hover:text-\[var\((--[\w-]+)\)\]/)[1]
    const fundo = fonte.match(/hover:bg-\[var\((--[\w-]+)\)\]\/(\d+)/)
    const base = sobre({ ...token(fundo[1], t), a: Number(fundo[2]) / 100 }, token('--color-surface', t))
    const c = contraste(token(icone, t), base)
    assert.ok(c >= 3, `${icone} sobre ${fundo[1]}/${fundo[2]}: ${c.toFixed(2)}:1, mínimo 3:1`)
  })
}
