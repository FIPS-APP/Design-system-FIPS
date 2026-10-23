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
