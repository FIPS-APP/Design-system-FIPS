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

test('README do exemplo portátil do Switch: as linhas citadas da foundations.md apontam para os tokens', () => {
  const readme = ler('exports/switch/README.md')
  const m = readme.match(/\(`:(\d+)-(\d+)` no claro, `:(\d+)` e `:(\d+)-(\d+)` no escuro\)/)
  assert.ok(m, 'README sem a citação de linhas da foundations.md')
  const [claroDe, claroAte, recuo, escuroDe, escuroAte] = m.slice(1).map(Number)
  const linhas = ler('skills/design-system-fips/references/foundations.md').split('\n')
  const trecho = (de, ate) => linhas.slice(de - 1, ate).join('\n')
  const tokens = ['--color-ring', '--color-switch-on', '--color-switch-off']
  assert.equal(claroAte - claroDe + 1, tokens.length, `claro :${claroDe}-${claroAte} deveria ter ${tokens.length} linhas`)
  assert.equal(escuroAte - escuroDe + 1, tokens.length, `escuro :${escuroDe}-${escuroAte} deveria ter ${tokens.length} linhas`)
  for (const nome of tokens) {
    assert.ok(trecho(claroDe, claroAte).includes(`${nome}:`), `foundations.md:${claroDe}-${claroAte} (claro) não declara ${nome}`)
    assert.ok(trecho(escuroDe, escuroAte).includes(`\`${nome}\``), `foundations.md:${escuroDe}-${escuroAte} (escuro) não lista ${nome}`)
  }
  assert.ok(trecho(recuo, recuo).includes('`--color-surface`'), `foundations.md:${recuo} (escuro) não é a linha de --color-surface`)
})

// ─── Sidebar: selinho de contagem no escuro ────────────────────────────────
// A presença do selinho é a informação (WCAG 1.4.11, 3:1 contra o que o cerca); o número é texto (1.4.3, 4,5:1).
// O selinho de 14% de tinta mediu 1,15 a 1,32:1 contra a barra. Lê getBadgeTone de SidebarDoc.tsx, ramo escuro.
const SIDEBAR_DOC = 'src/docs/pages/components/SidebarDoc.tsx'
const TONS_DO_SELINHO = ['âmbar', 'azul', 'verde', 'vermelho']

function corComAlfa(valor) {
  const v = valor.trim()
  const hex = v.match(/^#([\da-f]{6})$/i)
  if (hex) return { ...cor(`#${hex[1]}`, 'claro'), a: 1 }
  const m = v.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/)
  assert.ok(m, `${SIDEBAR_DOC}: cor não reconhecida: ${valor}`)
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
}

const sobreFundo = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a) })

const FONTE_DA_SIDEBAR = ler(SIDEBAR_DOC)
const CORPO_DO_TOM = FONTE_DA_SIDEBAR.slice(
  FONTE_DA_SIDEBAR.indexOf('function getBadgeTone'),
  FONTE_DA_SIDEBAR.indexOf('\n}\n', FONTE_DA_SIDEBAR.indexOf('function getBadgeTone')),
)
// Ramo escuro de cada tom, achado pela condição de `getBadgeTone` (não pela ordem) e lido campo a campo
// (não pela ordem das chaves): um tom mexido acusa o próprio tom.
const RAMO_ESCURO = '(\\{[^}]*\\})\\s*:'
const OBJETO_ESCURO_DO_TOM = {
  'âmbar': new RegExp(`item\\.badge === 'financeiroPendente'\\)\\s*\\{\\s*return dark\\s*\\?\\s*${RAMO_ESCURO}`),
  azul: new RegExp(`item\\.badge === 'notaPendente'\\)\\s*\\{\\s*return dark\\s*\\?\\s*${RAMO_ESCURO}`),
  verde: new RegExp(`item\\.badge === 'producaoEmAndamento'\\)\\s*\\{\\s*return dark\\s*\\?\\s*${RAMO_ESCURO}`),
}
const campoDoTom = (objeto, nome) => objeto?.match(new RegExp(`\\b${nome}:\\s*'([^']+)'`))?.[1]
const SELINHOS_ESCUROS = TONS_DO_SELINHO.map((tom) => {
  const objeto =
    tom === 'vermelho'
      ? CORPO_DO_TOM.slice(CORPO_DO_TOM.lastIndexOf('return dark')).match(new RegExp(`return dark\\s*\\?\\s*${RAMO_ESCURO}`))?.[1]
      : CORPO_DO_TOM.match(OBJETO_ESCURO_DO_TOM[tom])?.[1]
  return [tom, campoDoTom(objeto, 'bg'), campoDoTom(objeto, 'color'), campoDoTom(objeto, 'border')]
})
const BARRA_ESCURA = cor(FONTE_DA_SIDEBAR.match(/TN_DARKMODE: SidebarTheme = \{\s*bg:\s*'(#[\da-f]{6})'/i)?.[1] ?? '', 'claro')
// Azulejo do ícone no escuro: os três pontos do degradê (o selinho do menu recolhido encosta nele) e o que a Facilities mediu.
const AZULEJOS = [...FONTE_DA_SIDEBAR.matchAll(/linear-gradient\(160deg,\s*(#[\da-f]{6}) 0%,\s*(#[\da-f]{6}) 55%,\s*(#[\da-f]{6}) 100%\)/gi)]
  .filter((m) => m[1].toLowerCase() === '#303036')
  .flatMap((m) => [m[1], m[2], m[3]])
  .map((h) => cor(h, 'claro'))
  .concat([{ r: 43, g: 51, b: 63 }])

test('Sidebar: o selinho de contagem do escuro tem quatro tons, a barra e o azulejo estão lidos', () => {
  for (const [tom, bg, texto, anel] of SELINHOS_ESCUROS) {
    assert.ok(bg && texto && anel, `${tom}: ramo escuro de getBadgeTone não foi lido (bg, color e border)`)
  }
  assert.equal(AZULEJOS.length, 4, 'azulejos do ícone (3 do degradê e 1 medido)')
})

TONS_DO_SELINHO.forEach((tom, i) => {
  test(`Sidebar escuro, selinho ${tom}: número 4,5:1 contra o disco, disco 3:1 contra a barra, anel 3:1 contra o azulejo`, () => {
    const [, bg, texto, anel] = SELINHOS_ESCUROS[i]
    assert.ok(bg && texto && anel, `${tom}: ramo escuro de getBadgeTone não foi lido`)
    const disco = sobreFundo(corComAlfa(bg), BARRA_ESCURA)
    verifica(`${tom}: número ${texto} contra o disco ${bg}`, sobreFundo(corComAlfa(texto), disco), disco, MINIMO_TEXTO)
    verifica(`${tom}: disco ${bg} contra a barra`, disco, BARRA_ESCURA)
    for (const azulejo of AZULEJOS) {
      verifica(`${tom}: anel ${anel} contra o azulejo rgb(${azulejo.r},${azulejo.g},${azulejo.b})`, sobreFundo(corComAlfa(anel), azulejo), azulejo)
    }
  })
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
// Tem de haver uma só classe de texto para a aba ativa e sem variante na frente: uma segunda, como
// `dark:data-[state=active]:text-[var(--color-primary)]`, desfaria a correção no escuro.
test('Tabs: o gatilho tem uma só classe de texto para a aba ativa, sem variante dark: ou outra antes', () => {
  const achadas = [...GATILHO_DE_TABS.matchAll(/[^\s'"`]*data-\[state=active\]:[^\s'"`]*text-\[var\([^)]*\)\]/g)].map((m) => m[0])
  assert.equal(achadas.length, 1, `classes de texto da aba ativa em ${TABS}: ${achadas.join(' ')}`)
  assert.match(achadas[0], /^data-\[state=active\]:text-/, `a classe de texto da aba ativa não pode ter variante antes: ${achadas[0]}`)
})
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

// Campo aparece sobre o cartão, o cartão suave e a página, nos dois temas.
for (const t of TEMAS) {
  test(`--color-border-control, tema ${t}: borda contra o cartão suave e a página`, () => {
    for (const fundo of FUNDOS) verifica(`--color-border-control contra ${fundo}`, token('--color-border-control', t), token(fundo, t))
  })
}

// A fonte em TypeScript (src/tokens/colors.ts) é lida pelo site e pelo docs/tokens.md e escrita à mão:
// não pode divergir do globals.css, que é o que o pacote entrega.
const TS_TOKENS = ler('src/tokens/colors.ts')
function borderControlDoTs(objeto) {
  const m = TS_TOKENS.match(new RegExp(`export const ${objeto}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`))
  assert.ok(m, `colors.ts: objeto ${objeto} não encontrado`)
  const v = m[1].match(/^\s*borderControl:\s*(?:'(#[\da-f]{6})'|fipsPalette\.(\w+))/im)
  assert.ok(v, `colors.ts: borderControl não encontrado em ${objeto}`)
  if (v[1]) return v[1]
  const pal = TS_TOKENS.match(/export const fipsPalette\s*=\s*\{([\s\S]*?)\}\s*as const/)
  assert.ok(pal, 'colors.ts: objeto fipsPalette não encontrado')
  const p = pal[1].match(new RegExp(`^\\s*${v[2]}:\\s*'(#[\\da-f]{6})'`, 'im'))
  assert.ok(p, `colors.ts: fipsPalette.${v[2]} não encontrado dentro de fipsPalette`)
  return p[1]
}

for (const [t, objeto] of [['claro', 'semanticColors'], ['escuro', 'darkSemanticColors']]) {
  test(`colors.ts: borderControl de ${objeto} é o --color-border-control do globals.css, tema ${t}`, () => {
    const ts = borderControlDoTs(objeto)
    assert.deepEqual(cor(ts, t), token('--color-border-control', t), `colors.ts ${ts} diverge de globals.css ${TOKENS[t]['--color-border-control']}`)
  })
}

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

// ─── Input pendente ────────────────────────────────────────────────────────
const INPUT = 'src/components/ui/input.tsx'
const FIO_PENDENTE = classe(INPUT, /isPending &&\s*'[^']*\bborder-\[var\((--[\w-]+)\)\]/)
const FUNDO_PENDENTE = classe(INPUT, /isPending &&\s*'[^']*\bbg-\[var\((--[\w-]+)\)\]/)

for (const t of TEMAS) {
  test(`Input pendente, tema ${t}: fio contra o cartão e contra o próprio fundo`, () => {
    const fio = token(FIO_PENDENTE, t)
    verifica(`${FIO_PENDENTE} contra --color-surface`, fio, token('--color-surface', t))
    verifica(`${FIO_PENDENTE} contra ${FUNDO_PENDENTE}`, fio, compor(TOKENS[t][FUNDO_PENDENTE], t))
  })

  // Campo pendente é campo vazio: o placeholder sempre aparece. No claro mede 4,30:1 até o #143 escurecer --color-fg-muted.
  test(`Input pendente, tema ${t}: placeholder contra o fundo de atenção`, { todo: t === 'claro' ? 'depende do #143 (--color-fg-muted)' : false }, () => {
    verifica(`--color-fg-muted contra ${FUNDO_PENDENTE}`, token('--color-fg-muted', t), compor(TOKENS[t][FUNDO_PENDENTE], t), MINIMO_TEXTO)
  })
}

test('Input pendente: o erro, o desabilitado e o somente leitura vencem antes de pintar', () => {
  const fonte = ler(INPUT)
  assert.match(fonte, /const invalid = props\['aria-invalid'\] === true \|\| props\['aria-invalid'\] === 'true'/, 'input.tsx: aria-invalid (booleano e "true") tem que desligar o pendente')
  const guarda = fonte.match(/const isPending = ([^\n]+)/)
  assert.ok(guarda, 'input.tsx: const isPending não encontrada')
  for (const parte of ['pending', '!invalid', '!props.disabled', '!props.readOnly']) {
    assert.ok(guarda[1].split(/\s*&&\s*/).includes(parte), `input.tsx: isPending sem "${parte}" (${guarda[1]})`)
  }
  assert.match(fonte, /data-pending=\{isPending \? 'true' : undefined\}/, 'input.tsx: data-pending só quando o pendente está ativo')
})

test('--color-primary-hover-text no claro vale o mesmo que --color-primary-hover', () => {
  assert.deepEqual(token('--color-primary-hover-text', 'claro'), token('--color-primary-hover', 'claro'))
})

// ─── Texto secundário (--color-fg-muted) ───────────────────────────────────
// Legenda do BrandLoader, placeholder, botão ghost, hover de borda e todo texto secundário leem este token.
// No claro media 4,29:1 sobre a página (--color-surface-muted), abaixo dos 4,5:1 de texto de 9px a 14px.
for (const t of TEMAS) {
  test(`--color-fg-muted, tema ${t}: texto contra o cartão, o cartão suave e a página`, () => {
    for (const fundo of FUNDOS) verifica(`--color-fg-muted contra ${fundo}`, token('--color-fg-muted', t), token(fundo, t), MINIMO_TEXTO)
  })
}

// Listra da tabela (--color-table-zebra). Cobre color-mix(... N%, transparent),
// color-mix(... N%, outra cor) e rgba(). Com transparent a faixa soma ao fundo
// de baixo. Com outra cor ela já é opaca e não depende do fundo.
function listra(t, fundo) {
  const valor = TOKENS[t]['--color-table-zebra']
  assert.ok(valor, `token --color-table-zebra não existe no tema ${t}`)
  const mistura = valor.match(/^color-mix\(in srgb,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/)
  const rgba = mistura ? null : valor.match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/)
  assert.ok(mistura || rgba, `--color-table-zebra em formato não reconhecido: ${valor}`)
  const topo = mistura ? (mistura[1] === 'white' ? BRANCO : cor(mistura[1], t)) : { r: +rgba[1], g: +rgba[2], b: +rgba[3] }
  if (mistura && mistura[3] !== 'transparent') fundo = cor(mistura[3], t)
  const alfa = mistura ? Number(mistura[2]) / 100 : Number(rgba[4])
  return { r: topo.r * alfa + fundo.r * (1 - alfa), g: topo.g * alfa + fundo.g * (1 - alfa), b: topo.b * alfa + fundo.b * (1 - alfa) }
}

for (const t of TEMAS) {
  test(`--color-fg-muted, tema ${t}: texto sobre a listra da tabela, em cada superfície`, () => {
    for (const fundo of FUNDOS) verifica(`--color-fg-muted contra a listra sobre ${fundo}`, token('--color-fg-muted', t), listra(t, token(fundo, t)), MINIMO_TEXTO)
  })
}

// No claro o --color-neutral-fill é o próprio --color-fg-muted. A fonte em TypeScript (src/tokens/colors.ts)
// alimenta o site e o docs/tokens.md e é escrita à mão: não pode divergir do globals.css, que é o que o pacote entrega.
const COLORS_TS = ler('src/tokens/colors.ts')
function neutralFillDoTs(objeto) {
  const m = COLORS_TS.match(new RegExp(`export const ${objeto}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`))
  assert.ok(m, `colors.ts: objeto ${objeto} não encontrado`)
  const v = m[1].match(/^\s*neutralFill:\s*'(#[\da-f]{6})'/im)
  assert.ok(v, `colors.ts: neutralFill não encontrado em ${objeto}`)
  return v[1]
}

for (const [t, objeto] of [['claro', 'semanticColors'], ['escuro', 'darkSemanticColors']]) {
  test(`colors.ts: neutralFill de ${objeto} é o --color-neutral-fill do globals.css, tema ${t}`, () => {
    const ts = neutralFillDoTs(objeto)
    assert.deepEqual(cor(ts, t), token('--color-neutral-fill', t), `colors.ts ${ts} diverge de globals.css ${TOKENS[t]['--color-neutral-fill']}`)
  })
}

test('PageHeader: ponto do chip de contagem passa de 3:1 sobre o chip (6% de branco sobre o banner), nos dois temas', () => {
  const fonte = ler('src/components/composites/PageHeader.tsx')
  assert.match(fonte, /\?\? 'var\(--fips-banner-stat-dot\)'/, 'PageHeader.tsx: o ponto sem dotColor tem que usar --fips-banner-stat-dot')
  const mistura = (a, b, t) => ({ r: a.r * (1 - t) + b.r * t, g: a.g * (1 - t) + b.g * t, b: a.b * (1 - t) + b.b * t })
  // Fundos do banner: extremos do degradê de cada tema (o mais claro é o pior caso).
  const fundos = {
    claro: [token('--color-gov-gradient-from', 'claro'), token('--color-gov-gradient-to', 'claro'), cor('#001a4a', 'claro')],
    escuro: ['#1e2a3a', '#162030', '#1a2840'].map((c) => cor(c, 'escuro')),
  }
  for (const t of TEMAS) {
    const declarado = css.match(/--fips-banner-stat-dot:\s*([^;]+);/)
    assert.ok(declarado, '--fips-banner-stat-dot não existe em globals.css')
    const ponto = cor(declarado[1].trim(), t)
    for (const fundo of fundos[t]) {
      const r = contraste(ponto, mistura(fundo, BRANCO, 0.06))
      assert.ok(r >= MINIMO, `${t}: ponto ${r.toFixed(2)}:1 < ${MINIMO}`)
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
    linha('azul de texto / cartão', token('--color-primary-hover-text', t), cartao)
    linha('trilho desligado / linha info', token('--color-switch-off', t), compor(TOKENS[t]['--color-semantic-info-bg'], t))
  }
})

// ─── Rótulo do atalho do hero sobre o degradê laranja ──────────────────────
const CHROME = 'src/lib/docHeaderChrome.ts'

function constanteDoChrome(nome) {
  const m = ler(CHROME).match(new RegExp(`export const ${nome}\\s*=\\s*'([^']+)'`))
  assert.ok(m, `${CHROME}: constante ${nome} não encontrada`)
  return m[1]
}

// Lê `linear-gradient(135deg,#a,#b 34%,#c 100%)` e devolve as paradas [cor, posição 0 a 100].
function paradasDoDegrade(valor) {
  const itens = valor.match(/linear-gradient\([^,]+,(.+)\)$/)[1].split(/,(?![^(]*\))/).map((s) => s.trim())
  const paradas = itens.map((item, i) => {
    const [hex, pos] = item.split(/\s+/)
    assert.match(hex, /^#[\da-f]{6}$/i, `parada fora de hex de 6 dígitos: ${item}`)
    return [cor(hex, 'claro'), pos ? Number(pos.replace('%', '')) : i === 0 ? 0 : i === itens.length - 1 ? 100 : NaN]
  })
  paradas.forEach(([, p]) => assert.ok(!Number.isNaN(p), `parada sem posição em ${valor}`))
  return paradas
}

function corNoDegrade(paradas, pct) {
  let k = 0
  while (k < paradas.length - 2 && pct > paradas[k + 1][1]) k++
  const [a, pa] = paradas[k]
  const [b, pb] = paradas[k + 1]
  const t = Math.min(1, Math.max(0, (pct - pa) / (pb - pa)))
  const mistura = (x, y) => Math.round(x + (y - x) * t)
  return { r: mistura(a.r, b.r), g: mistura(a.g, b.g), b: mistura(a.b, b.b) }
}

test('Atalho aberto do hero: rótulo contra o degradê laranja, 4,5:1 em todo o degradê', () => {
  const rotulo = cor(constanteDoChrome('docHeaderNeuAccentIcon'), 'claro')
  const paradas = paradasDoDegrade(constanteDoChrome('docHeaderNeuAccentBgHover'))
  for (let pct = 0; pct <= 100; pct++) verifica(`rótulo contra o degradê a ${pct}%`, rotulo, corNoDegrade(paradas, pct), MINIMO_TEXTO)
})

// O teste acima lê a constante; este garante que os componentes pintam o fundo com ela e não com um degradê próprio.
test('Atalho aberto do hero: HeroAtalho, UserChip e DocHeaderNeuIconButton pintam o fundo com docHeaderNeuAccentBgHover', () => {
  for (const arquivo of ['composites/HeroAtalho', 'layout/UserChip', 'layout/DocHeaderNeuIconButton']) {
    const fonte = ler(`src/components/${arquivo}.tsx`)
    assert.match(
      fonte,
      /(?:\bbackground|'--user-chip-bg')\s*:\s*(?:hovered \? )?docHeaderNeuAccentBgHover\b/,
      `${arquivo}.tsx não pinta o fundo com docHeaderNeuAccentBgHover`,
    )
  }
})

for (const t of TEMAS) {
  test(`Atalho ouro do hero em repouso, tema ${t}: texto contra o fundo`, () => {
    const classes = ler('src/components/composites/HeroAtalho.tsx').match(/const repousoOuro =\s*'([^']+)'/)[1]
    const fundo = classes.match(/\bbg-\[(var\(--[\w-]+\))\]/)[1]
    const texto = classes.match(/\btext-\[(var\(--[\w-]+\))\]/)[1]
    verifica(`${texto} contra ${fundo}`, cor(texto, t), cor(fundo, t), MINIMO_TEXTO)
  })
}

// ─── Foco do atalho do hero ────────────────────────────────────────────────
// O atalho aberto leva boxShadow em `style`, que vence qualquer classe de sombra (ring). O foco
// do teclado precisa ser outline, que a sombra em linha não cobre.
const HERO_ATALHO = 'src/components/composites/HeroAtalho.tsx'

function classesDoAtalho() {
  const m = ler(HERO_ATALHO).match(/className: cn\(\s*'([^']+)'/)
  assert.ok(m, `${HERO_ATALHO}: className do atalho não encontrada`)
  return m[1].split(/\s+/)
}

test('Atalho do hero: foco por outline de 3px, sem ring (a sombra em linha o cobriria)', () => {
  const classes = classesDoAtalho()
  assert.ok(classes.includes('focus-visible:outline-solid'), 'sem focus-visible:outline-solid')
  assert.ok(classes.includes('focus-visible:outline-[3px]'), 'sem focus-visible:outline-[3px]')
  assert.ok(classes.some((c) => /^focus-visible:outline-offset-\d+$/.test(c)), 'sem recuo do contorno')
  assert.equal(classes.filter((c) => /^focus-visible:ring/.test(c)).length, 0, 'ring no atalho: o boxShadow em style o esconde')
  assert.ok(!classes.includes('focus-visible:outline-none'), 'focus-visible:outline-none apaga o contorno')
})

test('Atalho do hero: contorno de foco contra o fundo do PageHero, 3:1 nos dois temas', () => {
  const cls = classesDoAtalho().find((c) => /^focus-visible:outline-(white|black|\[#[\da-f]{6}\])$/i.test(c))
  assert.ok(cls, 'cor do contorno de foco não reconhecida (white, black ou hex)')
  const nome = cls.replace('focus-visible:outline-', '')
  const contorno = nome === 'white' ? BRANCO : nome === 'black' ? { r: 0, g: 0, b: 0 } : cor(nome.slice(1, -1), 'claro')
  const hero = ler('src/composites/PageHero.tsx')
  const m = hero.match(/bg-gradient-to-br from-\[(#[\da-f]{6})\] via-\[(var\(--[\w-]+\))\] to-\[(#[\da-f]{6})\] dark:bg-\[(#[\da-f]{6})\]/i)
  assert.ok(m, 'gradiente do PageHero não encontrado em PageHero.tsx')
  // Pior caso: a película branca de 8% do PageHero clareia o fundo.
  const clareado = (c) => ({ r: Math.round(c.r * 0.92 + 255 * 0.08), g: Math.round(c.g * 0.92 + 255 * 0.08), b: Math.round(c.b * 0.92 + 255 * 0.08) })
  for (const [rotuloFundo, valor, t] of [['início', m[1], 'claro'], ['meio', m[2], 'claro'], ['fim', m[3], 'claro'], ['escuro', m[4], 'escuro']]) {
    verifica(`contorno ${nome} contra o ${rotuloFundo} do hero (${valor})`, contorno, clareado(cor(valor, t)))
  }
})

// ─── Linha info do SettingsPreferenceRow: trilho desligado no hover ────────
const LINHA = 'src/components/composites/SettingsPreferenceRow.tsx'

// Cor com alfa de um token, hex ou rgba(), para o tema t.
function rgbaDe(valor, t) {
  const v = resolver(valor, t)
  const m = v.match(/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/)
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: Number(m[4]) }
  return { ...cor(valor, t), a: 1 }
}

// Aceita `var(--x)` e `color-mix(in_srgb,var(--a)_P%,var(--b))` (mistura com alfa pré-multiplicado, como no CSS).
function fundoDaClasse(expr, t) {
  const simples = expr.match(/^var\((--[\w-]+)\)$/)
  const cm = expr.match(/^color-mix\(in_srgb,var\((--[\w-]+)\)_(\d+)%,var\((--[\w-]+)\)\)$/)
  assert.ok(simples || cm, `fundo fora do que o teste entende: ${expr}`)
  let c
  if (simples) c = rgbaDe(`var(${simples[1]})`, t)
  else {
    const [x, y, p] = [rgbaDe(`var(${cm[1]})`, t), rgbaDe(`var(${cm[3]})`, t), Number(cm[2]) / 100]
    const a = x.a * p + y.a * (1 - p)
    const canal = (k) => (x[k] * x.a * p + y[k] * y.a * (1 - p)) / a
    c = { r: canal('r'), g: canal('g'), b: canal('b'), a }
  }
  const base = token('--color-surface', t)
  const sobre = (k) => Math.round(c[k] * c.a + base[k] * (1 - c.a))
  return { r: sobre('r'), g: sobre('g'), b: sobre('b') }
}

function classesDaLinhaInfo() {
  const m = ler(LINHA).match(/variant === 'info'\s*\?\s*'([^']+)'/)
  assert.ok(m, `${LINHA}: classes da linha info não encontradas`)
  return m[1].split(/\s+/)
}

for (const t of TEMAS) {
  test(`Linha info do SettingsPreferenceRow, tema ${t}: trilho desligado contra o fundo em repouso e no hover`, () => {
    const classes = classesDaLinhaInfo()
    const repouso = classes.find((c) => /^bg-\[.+\]$/.test(c))
    assert.ok(repouso, 'linha info sem fundo bg-[...]')
    const hover = classes.find((c) => /^hover:bg-\[.+\]$/.test(c))
    const trilho = token('--color-switch-off', t)
    verifica('trilho contra o fundo em repouso', trilho, fundoDaClasse(repouso.slice(4, -1), t))
    if (hover) verifica(`trilho contra o fundo de hover (${hover})`, trilho, fundoDaClasse(hover.slice(10, -1), t))
  })
}

test('Linha info do SettingsPreferenceRow: o hover muda a borda, já que o fundo não pode clarear', () => {
  assert.ok(classesDaLinhaInfo().some((c) => /^hover:border-/.test(c)), 'linha info sem hover de borda')
})

// ─── Anéis de foco do cabeçalho ────────────────────────────────────────────
const ANEIS = {
  userChip: 'src/components/layout/UserChip.tsx',
  botao: 'src/components/layout/DocHeaderNeuIconButton.tsx',
  secoes: 'src/components/layout/DocHeaderSectionNav.tsx',
}

test('Anéis do cabeçalho: nenhum ring com hex ou rgba, nem com transparência (/NN)', () => {
  const achados = []
  for (const arquivo of Object.values(ANEIS)) {
    ler(arquivo).split('\n').forEach((linha, i) => {
      for (const m of linha.matchAll(/focus-visible:ring-\[([^\]\s]+)\](\/(?:\[[^\]]+\]|[\w.]+))?/g)) {
        if (m[2] || /rgba?\(|transparent|color-mix/.test(m[1])) achados.push(`${arquivo}:${i + 1} (${m[0]})`)
      }
    })
  }
  assert.deepEqual(achados, [], `anel com transparência:\n${achados.join('\n')}`)
})

test('DocHeaderNeuIconButton: foco por outline em --color-ring (o boxShadow em style cobriria um ring)', () => {
  const m = ler(ANEIS.botao).match(/'relative flex shrink-0[^']*'/)
  assert.ok(m, 'className do botão não encontrada')
  const classes = m[0].slice(1, -1).split(/\s+/)
  for (const c of ['focus-visible:outline-solid', 'focus-visible:outline-2', 'focus-visible:outline-offset-2', 'focus-visible:outline-[var(--color-ring)]']) {
    assert.ok(classes.includes(c), `sem ${c}`)
  }
  assert.equal(classes.filter((c) => /^focus-visible:ring/.test(c) || c === 'focus-visible:outline-none').length, 0, 'ring ou outline-none no botão')
})

test('DocHeaderSectionNav: ramo escuro com anel #F6921E contra o recuo #1A1A1A, 3:1', () => {
  const fonte = ler(ANEIS.secoes)
  const recuo = fonte.match(/focus-visible:ring-offset-\[(#[\da-f]{6})\]/i)
  assert.ok(recuo, 'recuo do ramo escuro não encontrado')
  const aneis = new Set([...fonte.matchAll(/focus-visible:ring-\[(#[\da-f]{6})\]/gi)].map((m) => m[1]))
  assert.ok(aneis.size > 0, 'anel hex do ramo escuro não encontrado')
  for (const hex of aneis) verifica(`anel ${hex} contra o recuo ${recuo[1]}`, cor(hex, 'claro'), cor(recuo[1], 'claro'))
})

test('Anéis do cabeçalho: UserChip e ramo claro das seções leem --color-ring cheio', () => {
  assert.match(ler(ANEIS.userChip), /focus-visible:ring-\[var\(--color-ring\)\](?!\/)/, 'UserChip sem --color-ring cheio')
  assert.match(ler(ANEIS.secoes), /focus-visible:ring-\[var\(--color-ring\)\](?!\/)/, 'ramo claro das seções sem --color-ring cheio')
})
