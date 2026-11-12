/**
 * Contraste do Toast nos dois temas.
 * Texto contra o fundo do aviso: 4,5:1 (WCAG 1.4.3). Destaque (borda lateral e ícone) e X: 3:1 (1.4.11).
 * O aviso pousa sobre o cartão (--color-surface); o fundo semitransparente do escuro é composto sobre ele.
 * Lê os tokens de src/styles/globals.css e as variáveis de src/components/composites/Toast.tsx.
 * Rodar: node --test scripts/contraste-toast.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
const MIN_TEXTO = 4.5
const MIN_GRAFICO = 3

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
const token = (n, t) => {
  assert.ok(TOKENS[t][n], `token ${n} não existe no tema ${t}`)
  return cor(TOKENS[t][n], t)
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

// ─── Variáveis de cada variante, lidas do componente ───
const fonte = ler('src/components/composites/Toast.tsx')
const VARIANTES = {}
for (const [, nome, corpo] of fonte.matchAll(/^\s{2}(\w+): \{\n\s+caixa:\s*\n?\s*'([^']+)'/gm)) {
  const v = {}
  for (const [, k, tok] of corpo.matchAll(/\[--toast-(\w+):var\((--[\w-]+)\)\]/g)) v[k] = tok
  VARIANTES[nome] = v
}

test('Toast: as cinco variantes foram lidas do componente', () => {
  assert.deepEqual(Object.keys(VARIANTES), ['sucesso', 'erro', 'atencao', 'info', 'neutro'])
  for (const v of Object.values(VARIANTES)) assert.deepEqual(Object.keys(v).sort(), ['borda', 'destaque', 'fundo', 'texto'])
})

test('Toast: nenhuma cor fixa no componente, só token', () => {
  assert.equal(fonte.match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
})

for (const [nome, v] of Object.entries(VARIANTES)) {
  for (const t of ['claro', 'escuro']) {
    test(`Toast ${nome}, tema ${t}: texto >= ${MIN_TEXTO}:1 e destaque >= ${MIN_GRAFICO}:1 sobre o fundo do aviso`, () => {
      const cartao = token('--color-surface', t)
      const fundo = sobre(token(v.fundo, t), cartao)
      const texto = contraste(sobre(token(v.texto, t), fundo), fundo)
      const destaque = contraste(sobre(token(v.destaque, t), fundo), fundo)
      assert.ok(texto >= MIN_TEXTO, `${v.texto}: ${texto.toFixed(2)}:1`)
      assert.ok(destaque >= MIN_GRAFICO, `${v.destaque}: ${destaque.toFixed(2)}:1`)
    })
  }
}
