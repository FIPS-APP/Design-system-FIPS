/**
 * Mapa oficial de status do Badge (status-badge.ts): cada grupo cai numa variante que existe,
 * e o texto de cada variante usada passa de 4,5:1 nos dois temas, sobre as três superfícies.
 * Rodar: node --test scripts/status-badge.test.mjs
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

// ─── Mapa ──────────────────────────────────────────────────────────────────
const SUPERFICIES = ['--color-surface', '--color-surface-soft', '--color-surface-muted']
const fonteMapa = ler('src/components/ui/status-badge.ts')
const fonteVariantes = ler('src/components/ui/badge-variants.ts')

const GRUPOS_ESPERADOS = ['pendente', 'andamento', 'concluido', 'atrasado', 'cancelado', 'rascunho', 'critico']
const grupos = {}
for (const [, grupo, variante] of fonteMapa.matchAll(/^\s{2}(\w+):\s*\{\s*variant:\s*'(\w+)'/gm)) grupos[grupo] = variante
const sinonimos = {}
for (const [, chave, grupo] of fonteMapa.matchAll(/^\s{2}(\w+):\s*'(\w+)',\s*$/gm)) sinonimos[chave] = grupo
const variantesUsadas = [...new Set(Object.values(grupos))]

test('Mapa: os sete grupos existem, cada um com variante do Badge', () => {
  assert.deepEqual(Object.keys(grupos).sort(), [...GRUPOS_ESPERADOS].sort())
  for (const [g, v] of Object.entries(grupos)) {
    assert.match(fonteVariantes, new RegExp(`\\b${v}:`), `grupo ${g}: variante ${v} não existe em badge-variants.ts`)
  }
})

test('Mapa: todo sinônimo aponta para um grupo que existe e já está normalizado', () => {
  assert.ok(Object.keys(sinonimos).length >= 60, `só ${Object.keys(sinonimos).length} sinônimos lidos`)
  for (const [chave, grupo] of Object.entries(sinonimos)) {
    assert.ok(GRUPOS_ESPERADOS.includes(grupo), `${chave}: grupo ${grupo} não existe`)
    assert.match(chave, /^[a-z0-9_]+$/, `${chave} não está normalizado`)
  }
})

const medidas = {}
for (const variante of variantesUsadas) {
  const linha = fonteVariantes.match(new RegExp(`\\b${variante}:\\s*\n?\\s*'([^']+)'`))
  assert.ok(linha, `variante ${variante} não encontrada em badge-variants.ts`)
  const classes = linha[1]
  const pegar = (prefixo) => {
    const m = classes.match(new RegExp(`(?:^|\\s)${prefixo}-\\[var\\((--[\\w-]+)\\)\\]`))
    assert.ok(m, `classe ${prefixo}-[var(--...)] não encontrada em ${variante}`)
    return m[1]
  }
  const [TEXTO, FUNDO] = [pegar('text'), pegar('bg')]
  for (const t of ['claro', 'escuro']) {
    test(`Status ${variante}, tema ${t}: texto contra o fundo em todas as superfícies (>= ${MINIMO}:1)`, () => {
      const piores = []
      for (const superficie of SUPERFICIES) {
        const base = token(superficie, t)
        const fundo = sobre(token(FUNDO, t), base)
        const c = contraste(sobre(token(TEXTO, t), fundo), fundo)
        piores.push(c)
        assert.ok(c >= MINIMO, `${TEXTO} sobre ${FUNDO} em ${superficie}: ${c.toFixed(2)}:1, mínimo ${MINIMO}:1`)
      }
      medidas[`${variante} ${t}`] = Math.min(...piores).toFixed(2)
    })
  }
}

test('Medidas (pior superfície), para a tabela da doc', () => {
  if (process.env.IMPRIMIR_MEDIDAS) console.log(JSON.stringify(medidas))
})

// ─── Comportamento: os status reais dos apps caem no grupo certo ────────────
const { statusBadge, normalizarStatus } = await import('../src/components/ui/status-badge.ts')

const REAIS = [
  // [status como o app guarda, grupo, variante]
  ['Pendente', 'pendente', 'warning'],
  ['Andamento', 'andamento', 'info'],
  ['Finalizado', 'concluido', 'success'],
  ['Improcedente', 'cancelado', 'outline'],
  ['No Prazo', 'andamento', 'info'],
  ['Fora do Prazo', 'atrasado', 'danger'],
  ['Entregue no Prazo', 'concluido', 'success'],
  ['Entregue Fora do Prazo', 'concluido', 'success'],
  ['pre_cadastro', 'andamento', 'info'],
  ['aguardando_aprovacao_superior', 'pendente', 'warning'],
  ['aguardando_rc', 'pendente', 'warning'],
  ['recusado', 'critico', 'danger'],
  ['em_andamento', 'andamento', 'info'],
  ['teste_piloto', 'andamento', 'info'],
  ['backlog_tecnico', 'rascunho', 'secondary'],
  ['cancelado', 'cancelado', 'outline'],
  ['PENDENTE', 'pendente', 'warning'],
  ['EM_ANDAMENTO', 'andamento', 'info'],
  ['CONCLUIDO', 'concluido', 'success'],
  ['VENCIDO', 'atrasado', 'danger'],
  ['RASCUNHO', 'rascunho', 'secondary'],
  ['CONCLUIDA', 'concluido', 'success'],
  ['SINCRONIZADA', 'concluido', 'success'],
  ['CANCELADA', 'cancelado', 'outline'],
  ['erro', 'critico', 'danger'],
  ['Crítico', 'critico', 'danger'],
  ['Concluído', 'concluido', 'success'],
  ['Em andamento', 'andamento', 'info'],
]

test('statusBadge: status reais dos apps (texto cru, com acento, caixa alta)', () => {
  for (const [status, grupo, variant] of REAIS) {
    const r = statusBadge(status)
    assert.equal(r.grupo, grupo, `${status}: grupo`)
    assert.equal(r.variant, variant, `${status}: variante`)
  }
})

test('statusBadge: desconhecido, vazio e nulo caem em secondary sem grupo', () => {
  for (const s of ['xyz', '', null, undefined]) {
    assert.deepEqual(statusBadge(s), { grupo: undefined, variant: 'secondary', label: undefined })
  }
})

test('normalizarStatus: acento, caixa e pontuação', () => {
  assert.equal(normalizarStatus('  Em Votação! '), 'em_votacao')
  assert.equal(normalizarStatus('Entregue Fora do Prazo'), 'entregue_fora_do_prazo')
})

test('Index do pacote exporta StatusBadge e statusBadge', () => {
  const indice = ler('src/components/ui/index.ts')
  assert.match(indice, /StatusBadge,/)
  assert.match(indice, /statusBadge,/)
})
