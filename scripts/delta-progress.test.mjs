/**
 * DeltaIndicator e rótulo do Progress: export, formato, três canais de sentido (ícone, sinal, palavra),
 * goodWhen, aria do Progress e contraste medido nos dois temas.
 * Rodar: node --test scripts/delta-progress.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')
const MINIMO = 4.5

// ─── Tokens ────────────────────────────────────────────────────────────────
const css = ler('src/styles/globals.css').replace(/\/\*[\s\S]*?\*\//g, '')

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

import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

let vite, D, P
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  D = await vite.ssrLoadModule('/src/components/ui/delta-indicator.tsx')
  P = await vite.ssrLoadModule('/src/components/ui/progress.tsx')
})
after(async () => { await vite?.close() })
const delta = (props) => renderToStaticMarkup(React.createElement(D.DeltaIndicator, props))
const prog = (props) => renderToStaticMarkup(React.createElement(P.Progress, props))
const semTags = (h) => h.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|')

test('exporta DeltaIndicator pelo índice de ui, que o pacote reexporta; Progress segue sendo um só', () => {
  assert.match(ler('src/components/ui/index.ts'), /export \{ DeltaIndicator, type DeltaIndicatorProps \} from '\.\/delta-indicator'/)
  assert.match(ler('src/index.ts'), /export \* from '\.\/components\/ui'/)
  assert.equal((ler('src/components/ui/index.ts').match(/export \{ Progress[ ,]/g) ?? []).length, 1)
})

test('DeltaIndicator: alta, queda e zero têm seta, sinal e palavra', () => {
  const alta = delta({ value: 12.4 })
  assert.match(alta, /data-tendencia="alta"/)
  assert.match(alta, /lucide-arrow-up/)
  assert.match(semTags(alta), /\+12,4%/)
  assert.match(alta, /sr-only">aumento de 12,4%</)
  const queda = delta({ value: -3.2 })
  assert.match(queda, /lucide-arrow-down/)
  assert.match(semTags(queda), /−3,2%/)
  assert.match(queda, /queda de 3,2%/)
  const zero = delta({ value: 0 })
  assert.match(zero, /data-tendencia="estavel"/)
  assert.match(zero, /sem variação/)
  assert.match(delta({ value: 0.04 }), /data-tendencia="estavel"/)
})

test('DeltaIndicator: cor por sinal e goodWhen inverte o bom e o ruim, sem inverter a seta', () => {
  assert.match(delta({ value: 5 }), /data-resultado="bom"[^>]*text-\[var\(--color-success-text\)\]/)
  assert.match(delta({ value: -5 }), /data-resultado="ruim"[^>]*text-\[var\(--color-danger-text\)\]/)
  assert.match(delta({ value: 0 }), /data-resultado="neutro"[^>]*text-\[var\(--color-fg-muted\)\]/)
  const inv = delta({ value: -8, goodWhen: 'down' })
  assert.match(inv, /data-resultado="bom"/)
  assert.match(inv, /lucide-arrow-down/)
  assert.match(delta({ value: 8, goodWhen: 'down' }), /data-resultado="ruim"/)
})

test('DeltaIndicator: unidade, casas, description e props de span', () => {
  assert.match(semTags(delta({ value: 1234.5, decimals: 0, unit: ' pp' })), /\+1\.235 pp/)
  assert.match(delta({ value: 2, description: 'em relação ao mês anterior', id: 'x' }), /aumento de 2,0% em relação ao mês anterior/)
  assert.match(delta({ value: 2, id: 'x' }), /id="x"/)
})

test('Progress sem rótulo continua igual: só a barra, sem aria-labelledby nem valuetext', () => {
  const h = prog({ value: 40 })
  assert.match(h, /^<div role="progressbar"/)
  assert.match(h, /aria-valuenow="40"/)
  assert.doesNotMatch(h, /aria-labelledby|aria-valuetext/)
})

test('Progress com rótulo e percentual: texto acima, aria-labelledby aponta para ele, valuetext traz o percentual', () => {
  const h = prog({ value: 72, label: 'Inspeções do mês', showValue: true })
  const id = h.match(/<span id="([^"]+)">Inspeções do mês<\/span>/)?.[1]
  assert.ok(id, 'rótulo sem id')
  assert.match(h, new RegExp(`aria-labelledby="${id}"`))
  assert.match(h, /aria-valuetext="72%"/)
  assert.match(h, />72%</)
  assert.ok(h.indexOf('Inspeções do mês') < h.indexOf('role="progressbar"'))
  assert.match(prog({ value: 150, max: 100, showValue: true }), />100%</)
  assert.match(prog({ value: 1, max: 4, showValue: true }), />25%</)
})

// ─── Contraste ─────────────────────────────────────────────────────────────
const SUPERFICIES = ['--color-surface', '--color-surface-soft', '--color-surface-muted']
const medidas = {}

test('Texto do DeltaIndicator e do rótulo do Progress passa de 4,5:1 nos dois temas, sobre as três superfícies', () => {
  for (const t of ['claro', 'escuro']) {
    for (const fg of ['--color-success-text', '--color-danger-text', '--color-fg-muted', '--color-fg']) {
      for (const s of SUPERFICIES) {
        const c = contraste(token(fg, t), token(s, t))
        medidas[`${fg} ${s} ${t}`] = c.toFixed(2)
        assert.ok(c >= MINIMO, `${fg} sobre ${s} no tema ${t}: ${c.toFixed(2)}:1`)
      }
    }
  }
})

test('Barra do Progress: início e fim do degradê passam de 3:1 sobre o trilho nos dois temas', () => {
  const fonte = ler('src/components/ui/progress.tsx')
  const grad = fonte.match(/linear-gradient\(90deg,var\((--[\w-]+)\),var\((--[\w-]+)\)\)/)
  assert.ok(grad, 'degradê da barra não encontrado')
  assert.match(fonte, /bg-\[var\(--color-surface-muted\)\]/, 'trilho mudou: atualize a medição')
  for (const t of ['claro', 'escuro']) {
    for (const ponta of [grad[1], grad[2]]) {
      const c = contraste(token(ponta, t), token('--color-surface-muted', t))
      medidas[`barra ${ponta} ${t}`] = c.toFixed(2)
      assert.ok(c >= 3, `barra ${ponta} sobre o trilho no tema ${t}: ${c.toFixed(2)}:1`)
    }
  }
})

test('Cor só por token, sem literal novo', () => {
  assert.equal(ler('src/components/ui/delta-indicator.tsx').match(/#[\da-f]{3,8}\b|rgba?\(/gi), null)
  if (process.env.MOSTRAR_MEDIDAS) console.log(JSON.stringify(medidas, null, 1))
})
