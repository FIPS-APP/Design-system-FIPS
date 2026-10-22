/**
 * Contraste do Switch e do anel de foco, nos dois temas (WCAG 1.4.11, mínimo 3:1).
 * Lê os tokens de src/styles/globals.css e as classes dos componentes, sem dependência.
 * Rodar: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')
const MINIMO = 3

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

function cor(valor, t) {
  const v = resolver(valor, t)
  const hex = v.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
  }
  assert.fail(`cor não reconhecida: ${valor} -> ${v}`)
}

const token = (nome, t) => {
  assert.ok(TOKENS[t][nome], `token ${nome} não existe no tema ${t}`)
  return cor(TOKENS[t][nome], t)
}

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

const BRANCO = { r: 255, g: 255, b: 255 }
const TEMAS = ['claro', 'escuro']
// Fundos onde o controle pode aparecer: cartão, cartão suave e faixa.
const FUNDOS = ['--color-surface', '--color-surface-soft', '--color-surface-muted']

function classe(arquivo, padrao) {
  const m = ler(arquivo).match(padrao)
  assert.ok(m, `${arquivo}: classe não encontrada (${padrao})`)
  return m[1]
}

function verifica(rotulo, a, b) {
  const c = contraste(a, b)
  assert.ok(c >= MINIMO, `${rotulo}: ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
}

// ─── Switch ────────────────────────────────────────────────────────────────
const SWITCH = 'src/components/ui/switch.tsx'

test('Switch: nenhuma cor fixa no arquivo, só token', () => {
  const hex = ler(SWITCH).match(/#[\da-f]{3,8}\b/gi)
  assert.equal(hex, null, `hex em ${SWITCH}: ${hex}`)
})

for (const [estado, atributo] of [['desligado', 'unchecked'], ['ligado', 'checked']]) {
  const nome = classe(SWITCH, new RegExp(`data-\\[state=${atributo}\\]:bg-\\[var\\((--[\\w-]+)\\)\\]`))
  for (const t of TEMAS) {
    test(`Switch ${estado}, tema ${t}: trilho contra o fundo e botão contra o trilho`, () => {
      const trilho = token(nome, t)
      for (const fundo of FUNDOS) verifica(`trilho ${nome} contra ${fundo}`, trilho, token(fundo, t))
      verifica(`botão branco contra o trilho ${nome}`, BRANCO, trilho)
    })
  }
}

// ─── Anel de foco ──────────────────────────────────────────────────────────
function arquivos(pasta, saida = []) {
  for (const nome of readdirSync(join(RAIZ, pasta))) {
    const caminho = join(pasta, nome)
    if (statSync(join(RAIZ, caminho)).isDirectory()) arquivos(caminho, saida)
    else if (/\.(ts|tsx)$/.test(nome)) saida.push(caminho)
  }
  return saida
}

test('Anel de foco: nenhum arquivo usa --color-ring com transparência', () => {
  const achados = []
  for (const arquivo of [...arquivos('src'), ...arquivos('exports')]) {
    ler(arquivo).split('\n').forEach((linha, i) => {
      for (const m of linha.matchAll(/ring-\[var\(--color-ring\)\]\/(\d+)/g)) {
        achados.push(`${arquivo}:${i + 1} (${m[0]})`)
      }
    })
  }
  assert.deepEqual(achados, [], `anel com transparência:\n${achados.join('\n')}`)
})

for (const t of TEMAS) {
  test(`Anel de foco, tema ${t}: --color-ring contra cada fundo`, () => {
    for (const fundo of FUNDOS) verifica(`--color-ring contra ${fundo}`, token('--color-ring', t), token(fundo, t))
  })
}

test('Anel de foco: Button e Switch usam o anel cheio e o recuo na cor do fundo', () => {
  const botao = ler('src/components/ui/button-variants.ts')
  assert.match(botao, /focus-visible:ring-\[var\(--color-ring\)\](?!\/)/, 'Button sem anel cheio')
  assert.match(botao, /focus-visible:ring-offset-\[var\(--color-surface\)\]/, 'Button sem recuo na cor do fundo')
  const interruptor = ler(SWITCH)
  assert.match(interruptor, /focus-visible:ring-\[var\(--color-ring\)\](?!\/)/, 'Switch sem anel cheio')
  assert.match(interruptor, /focus-visible:ring-offset-\[var\(--color-surface\)\]/, 'Switch com recuo branco no escuro')
})

test('Exemplo portátil do Switch acompanha o componente', () => {
  const normaliza = (s) => s.replace(/\r\n/g, '\n').trim()
  assert.equal(normaliza(ler('exports/switch/Switch.tsx')), normaliza(ler(SWITCH)))
})

test('README do exemplo portátil do Switch lista os tokens lidos, com o hex dos dois temas', () => {
  const readme = ler('exports/switch/README.md')
  const hex = (c) => '#' + [c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, '0')).join('')
  const linhas = Object.fromEntries(
    [...readme.matchAll(/^\|\s*`(--[\w-]+)`[^|]*\|\s*`(#[\da-f]{6})`\s*\|\s*`(#[\da-f]{6})`\s*\|/gim)].map((m) => [m[1], { claro: m[2], escuro: m[3] }]),
  )
  const lidos = new Set(ler('exports/switch/Switch.tsx').match(/var\(--[\w-]+\)/g).map((v) => v.slice(4, -1)))
  assert.ok(lidos.size > 0, 'Switch portátil sem token')
  for (const nome of lidos) {
    assert.ok(linhas[nome], `README sem o token ${nome}, que o Switch.tsx lê`)
    for (const t of TEMAS) {
      assert.equal(linhas[nome][t].toLowerCase(), hex(token(nome, t)), `README: ${nome} no tema ${t} diverge de globals.css`)
    }
  }
})

test('relatório dos números (CONTRASTE_RELATORIO=1)', { skip: !process.env.CONTRASTE_RELATORIO }, () => {
  for (const t of TEMAS) {
    const linha = (rotulo, a, b) => console.log(`${t.padEnd(6)} ${rotulo.padEnd(30)} ${contraste(a, b).toFixed(2)}:1`)
    const cartao = token('--color-surface', t)
    linha('trilho desligado / cartão', token('--color-switch-off', t), cartao)
    linha('botão / trilho desligado', BRANCO, token('--color-switch-off', t))
    linha('trilho ligado / cartão', token('--color-switch-on', t), cartao)
    linha('botão / trilho ligado', BRANCO, token('--color-switch-on', t))
    linha('anel de foco / cartão', token('--color-ring', t), cartao)
    linha('anel de foco / faixa', token('--color-ring', t), token('--color-surface-muted', t))
  }
})
