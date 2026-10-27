/**
 * Contraste do Switch, do anel de foco e do azul escuro de texto, nos dois temas
 * (WCAG 1.4.11, mínimo 3:1; texto, 1.4.3, mínimo 4,5:1).
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
const MINIMO_TEXTO = 4.5

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

// Cor com alfa (rgba) composta sobre o cartão do tema.
function compor(valor, t) {
  const m = resolver(valor, t).match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/)
  if (!m) return cor(valor, t)
  const base = token('--color-surface', t)
  const a = Number(m[4])
  const mistura = (f, b) => Math.round(f * a + b * (1 - a))
  return { r: mistura(+m[1], base.r), g: mistura(+m[2], base.g), b: mistura(+m[3], base.b) }
}

function classe(arquivo, padrao) {
  const m = ler(arquivo).match(padrao)
  assert.ok(m, `${arquivo}: classe não encontrada (${padrao})`)
  return m[1]
}

function verifica(rotulo, a, b, minimo = MINIMO) {
  const c = contraste(a, b)
  assert.ok(c >= minimo, `${rotulo}: ${c.toFixed(2)}:1, mínimo ${minimo}:1`)
}

// ─── Switch ────────────────────────────────────────────────────────────────
const SWITCH = 'src/components/ui/switch.tsx'

// Cor do botão (Thumb), lida da classe bg-* do próprio componente.
function corDoBotao() {
  const m = ler(SWITCH).match(/Thumb[\s\S]*?\bbg-(white|black|\[#[\da-f]{3,6}\])/i)
  assert.ok(m, `${SWITCH}: classe de fundo do botão (Thumb) não encontrada ou fora de white, black e hex`)
  if (m[1] === 'white') return BRANCO
  if (m[1] === 'black') return { r: 0, g: 0, b: 0 }
  return cor(m[1].slice(1, -1), 'claro')
}

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
      verifica(`botão contra o trilho ${nome}`, corDoBotao(), trilho)
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
      // ring-[...] que cita --color-ring e termina em /NN, /[0.2] ou usa color-mix, rgba ou transparent.
      for (const m of linha.matchAll(/ring-\[([^\]\s]+)\](\/(?:\[[^\]]+\]|[\w.]+))?/g)) {
        if (!m[1].includes('--color-ring')) continue
        if (m[2] || /color-mix|rgba?\(|transparent|\/\d/.test(m[1])) achados.push(`${arquivo}:${i + 1} (${m[0]})`)
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

// Fundos fora do conjunto de superfícies: o gradiente do Dialog e a linha info do SettingsPreferenceRow.
test('Anel de foco, tema claro: fechar do Dialog contra o gradiente (ponto médio, onde o canto superior direito cai)', () => {
  const m = ler('src/components/ui/dialog.tsx').match(/(?<!dark:)from-\[#[\da-f]{6}\] via-\[(#[\da-f]{6})\] to-\[#[\da-f]{6}\]/i)
  assert.ok(m, 'gradiente do Dialog não encontrado em dialog.tsx')
  verifica(`--color-ring contra o gradiente do Dialog ${m[1]}`, token('--color-ring', 'claro'), cor(m[1], 'claro'))
})

// Em repouso. O hover da linha (cor da faixa) não se resolve por token: o trilho tem teto de luminância contra o botão branco.
for (const t of TEMAS) {
  test(`Switch desligado, tema ${t}: trilho contra a linha info em repouso`, () => {
    const fundo = compor(TOKENS[t]['--color-semantic-info-bg'], t)
    verifica('trilho --color-switch-off contra --color-semantic-info-bg', token('--color-switch-off', t), fundo)
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

// ─── Tabs: texto da aba ativa ──────────────────────────────────────────────
// --color-primary não muda no .dark (#004b9b nos dois temas): a aba ativa ficava em 2,06:1 sobre o
// cartão, menos legível que as inativas. O texto da aba ativa lê --color-primary-text.
const TABS = 'src/components/ui/tabs.tsx'

function trechoDeTabs(de, ate) {
  const fonte = ler(TABS)
  const inicio = fonte.indexOf(de)
  assert.notEqual(inicio, -1, `${TABS}: ${de} não encontrado`)
  return fonte.slice(inicio, fonte.indexOf(ate, inicio))
}

function tokenDeTabs(trecho, padrao, rotulo) {
  const m = trecho.match(padrao)
  assert.ok(m, `${TABS}: ${rotulo} não encontrado (${padrao})`)
  return m[1]
}

const GATILHO_DE_TABS = trechoDeTabs('const TabsTrigger', 'TabsTrigger.displayName')
const LISTA_DE_TABS = trechoDeTabs('const TabsList', 'TabsList.displayName')
const TEXTO_ABA_ATIVA = tokenDeTabs(GATILHO_DE_TABS, /data-\[state=active\]:text-\[var\((--[\w-]+)\)\]/, 'texto da aba ativa')
const FUNDO_ABA_ATIVA = tokenDeTabs(GATILHO_DE_TABS, /data-\[state=active\]:bg-\[var\((--[\w-]+)\)\]/, 'fundo da aba ativa')
// A aba inativa não pinta texto: herda o da lista, que também dá o fundo dela.
const TEXTO_ABA_INATIVA = tokenDeTabs(LISTA_DE_TABS, /(?<![:\w-])text-\[var\((--[\w-]+)\)\]/, 'texto herdado pela aba inativa')
const FUNDO_DA_LISTA = tokenDeTabs(LISTA_DE_TABS, /(?<![:\w-])bg-\[var\((--[\w-]+)\)\]/, 'fundo da lista')

for (const t of TEMAS) {
  test(`Tabs, tema ${t}: texto da aba ativa contra o fundo dela`, () => {
    verifica(`${TEXTO_ABA_ATIVA} contra ${FUNDO_ABA_ATIVA}`, token(TEXTO_ABA_ATIVA, t), token(FUNDO_ABA_ATIVA, t), MINIMO_TEXTO)
  })

  test(`Tabs, tema ${t}: a aba ativa é mais legível que a inativa`, () => {
    const ativa = contraste(token(TEXTO_ABA_ATIVA, t), token(FUNDO_ABA_ATIVA, t))
    const inativa = contraste(token(TEXTO_ABA_INATIVA, t), token(FUNDO_DA_LISTA, t))
    assert.ok(ativa > inativa, `aba ativa ${ativa.toFixed(2)}:1 não passa a inativa ${inativa.toFixed(2)}:1 (${TEXTO_ABA_INATIVA} sobre ${FUNDO_DA_LISTA})`)
  })
}

test('Tabs, tema claro: a aba ativa continua no azul do --color-primary', () => {
  assert.deepEqual(token(TEXTO_ABA_ATIVA, 'claro'), token('--color-primary', 'claro'))
})

// ─── Azul escuro de texto ──────────────────────────────────────────────────
for (const t of TEMAS) {
  test(`--color-primary-hover-text, tema ${t}: texto contra --color-surface`, () => {
    verifica('--color-primary-hover-text contra --color-surface', token('--color-primary-hover-text', t), token('--color-surface', t), MINIMO_TEXTO)
  })
}

// ─── Borda de campo e de controle ──────────────────────────────────────────
for (const t of TEMAS) {
  test(`--color-border-control, tema ${t}: borda contra o cartão`, () => {
    verifica('--color-border-control contra --color-surface', token('--color-border-control', t), token('--color-surface', t))
  })
}

// Só o claro cobre também o cartão suave e a página. No escuro a borda #666666 mede 2,87:1 sobre o cartão suave: fora do escopo.
test('--color-border-control, tema claro: borda contra o cartão suave e a página', () => {
  for (const fundo of FUNDOS) verifica(`--color-border-control contra ${fundo}`, token('--color-border-control', 'claro'), token(fundo, 'claro'))
})

test('--color-border (divisor) segue como estava: o --color-border-control não o reaproveita', () => {
  assert.equal(TOKENS.claro['--color-border'], '#d7e0ea')
  assert.equal(TOKENS.escuro['--color-border'], '#2e2e2e')
  assert.notEqual(TOKENS.claro['--color-border-control'], 'var(--color-border)')
})

test('Campos: o hover da borda é mais escuro que a borda em repouso no claro (e mais claro no escuro)', () => {
  for (const arquivo of ['input', 'textarea', 'select', 'field-trigger']) {
    const fonte = ler(`src/components/ui/${arquivo}.tsx`)
    assert.match(fonte, /(?<![:\w-])hover:border-\[var\(--color-fg-muted\)\]/, `${arquivo}.tsx sem hover:border-[var(--color-fg-muted)]`)
    assert.doesNotMatch(fonte, /hover:border-\[var\(--color-border-strong\)\]/, `${arquivo}.tsx: hover com --color-border-strong é mais claro que a borda no claro`)
  }
  for (const t of TEMAS) {
    const repouso = luminancia(token('--color-border-control', t))
    const hover = luminancia(token('--color-fg-muted', t))
    if (t === 'claro') assert.ok(hover < repouso, 'claro: o hover deve ser mais escuro que a borda')
    else assert.ok(hover > repouso, 'escuro: o hover deve ser mais claro que a borda')
  }
})

test('--color-primary-hover-text no claro vale o mesmo que --color-primary-hover', () => {
  assert.deepEqual(token('--color-primary-hover-text', 'claro'), token('--color-primary-hover', 'claro'))
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
    linha('azul de texto / cartão', token('--color-primary-hover-text', t), cartao)
    linha('trilho desligado / linha info', token('--color-switch-off', t), compor(TOKENS[t]['--color-semantic-info-bg'], t))
  }
})
