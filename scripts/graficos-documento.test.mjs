/**
 * Gráficos (CartaoGrafico, GraficoBarras, GraficoRosca, GraficoLinha, GraficoFunil, MapaDeCalor,
 * ProgressoPorFaixa), documento de impressão (Folha, CabecalhoDocumento, faixas, TabelaDocumento),
 * TabelaClassificacao, CartaoListagem, AlternadorDeVisao e AvisoSomenteLeitura:
 * lógica pura, marcação renderizada e contraste nos dois temas (marca de gráfico 3:1, texto 4,5:1).
 * Rodar: node --test scripts/graficos-documento.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-graficos-documento')
const C = join(RAIZ, 'src/components/composites/')
let L, M, React, render

before(async () => {
  mkdirSync(TMP, { recursive: true })
  const entrada = join(TMP, 'entrada.tsx')
  const nomes = [
    'CartaoGrafico', 'GraficoBarras', 'GraficoRosca', 'GraficoLinha', 'GraficoFunil', 'MapaDeCalor', 'ProgressoPorFaixa',
    'Documento', 'TabelaClassificacao', 'CartaoListagem', 'AlternadorDeVisao', 'AvisoSomenteLeitura',
  ]
  writeFileSync(
    entrada,
    nomes.map((n) => `export * from '${C}${n}.tsx'`).join('\n') + `\nexport * as logica from '${C}grafico-logica.ts'\n`,
  )
  const saida = await build({
    root: RAIZ, configFile: false, logLevel: 'silent', esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, chunk.code)
  M = await import(pathToFileURL(arquivo).href)
  L = M.logica
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  const { renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href)
  render = (Comp, props) => renderToStaticMarkup(React.createElement(Comp, props))
})
after(() => rmSync(TMP, { recursive: true, force: true }))

// ─── Lógica pura ───────────────────────────────────────────────────────────
test('escalaLinear: teto redondo e marcas', () => {
  assert.deepEqual(L.escalaLinear(47, 2), { teto: 50, ticks: [0, 25, 50] })
  assert.equal(L.escalaLinear(0).teto, 1)
  const e = L.escalaLinear(123, 4)
  assert.ok(e.teto >= 123 && e.ticks[0] === 0 && e.ticks.at(-1) === e.teto)
})

test('participacao: abaixo de 1% ganha casa, abaixo de 0,1% vira <0,1%', () => {
  assert.equal(L.participacao(0, 100), '0%')
  assert.equal(L.participacao(4, 1000), '0,4%')
  assert.equal(L.participacao(12, 58034), '<0,1%')
  assert.equal(L.participacao(50, 200), '25%')
})

test('angulosDaRosca: fecha em 360, zero não ganha fatia e a menor tem o piso', () => {
  const a = L.angulosDaRosca([880, 0, 4, 116], 5)
  assert.equal(a.length, 3)
  assert.equal(a.at(-1).fim, 360)
  for (const f of a) assert.ok(f.fim - f.inicio >= 4.999, `fatia ${f.indice} com ${f.fim - f.inicio}`)
  assert.deepEqual(L.angulosDaRosca([0, 0]), [])
  assert.equal(L.angulosDaRosca([7]).length, 1)
})

test('caminhoDoArco: volta inteira vira arco válido e metade usa o arco grande só acima de 180', () => {
  assert.match(L.caminhoDoArco(100, 100, 90, 60, 0, 360), /^M /)
  assert.match(L.caminhoDoArco(100, 100, 90, 60, 0, 90), / 0 0 1 /)
  assert.match(L.caminhoDoArco(100, 100, 90, 60, 0, 270), / 0 1 1 /)
})

test('nivelDeCalor: zero e vazio ficam em 0, positivo nunca abaixo de 1, máximo em 5', () => {
  assert.equal(L.nivelDeCalor(0, 10), 0)
  assert.equal(L.nivelDeCalor(null, 10), 0)
  assert.equal(L.nivelDeCalor(0.01, 10), 1)
  assert.equal(L.nivelDeCalor(10, 10), 5)
  assert.equal(L.nivelDeCalor(5, 10), 3)
})

test('faixaDeProgresso: os cinco degraus e o vazio', () => {
  const f = [0, 1, 29, 30, 59, 60, 89, 90, 99, 100].map(L.faixaDeProgresso)
  assert.deepEqual(f, ['vazio', 'minimo', 'minimo', 'baixo', 'baixo', 'medio', 'medio', 'alto', 'alto', 'concluido'])
  assert.equal(L.porcentagem(150, 100), 100)
  assert.equal(L.porcentagem(3, 0), 0)
})

test('textoPaginas e passoDosRotulos', () => {
  assert.equal(L.textoPaginas([]), '')
  assert.equal(L.textoPaginas([3]), 'página 3')
  assert.equal(L.textoPaginas([1, 2]), 'páginas 1 e 2')
  assert.equal(L.textoPaginas(['1', 2, '3']), 'páginas 1, 2 e 3')
  assert.equal(L.passoDosRotulos(12, 600, 46), 1)
  assert.equal(L.passoDosRotulos(12, 200, 46), 3)
})

test('percentuaisDoMaior: positivo tem piso, zero continua zero', () => {
  assert.deepEqual(L.percentuaisDoMaior([100, 50, 0, 0.1], 2), [100, 50, 0, 2])
})

// ─── Marcação ──────────────────────────────────────────────────────────────
test('GraficoBarras horizontal: valores escritos, botões com aria-pressed e esmaecimento', () => {
  const dados = [{ rotulo: 'Norte', valor: 46, tom: 'primario' }, { rotulo: 'Sul', valor: 0 }]
  const sem = render(M.GraficoBarras, { dados, rotulo: 'Por local' })
  assert.match(sem, />46</)
  assert.doesNotMatch(sem, /<button/)
  const com = render(M.GraficoBarras, { dados, rotulo: 'Por local', selecionado: 'Norte', onSelecionar: () => {} })
  assert.match(com, /aria-pressed="true"/)
  assert.match(com, /aria-pressed="false"/)
  assert.match(com, /opacity-40/)
  assert.match(com, /var\(--grafico-primario\)/)
  assert.equal(render(M.GraficoBarras, { dados: [], rotulo: 'x' }), '')
})

test('GraficoBarras empilhado: soma no rótulo e legenda das séries', () => {
  const s = render(M.GraficoBarras, {
    orientacao: 'vertical', modo: 'empilhado', rotulo: 'x',
    dados: [{ rotulo: 'jan', valores: [3, 4] }], series: [{ nome: 'A', tom: 'primario' }, { nome: 'B', tom: 'sucesso' }],
  })
  assert.match(s, />7</)
  assert.match(s, />A</)
  assert.match(s, /var\(--grafico-sucesso\)/)
})

test('GraficoRosca: furo com o total, legenda com participação e resumo no aria-label', () => {
  const s = render(M.GraficoRosca, {
    rotulo: 'Por conceito',
    dados: [{ rotulo: 'AT', valor: 90, tom: 'sucesso' }, { rotulo: 'NAT', valor: 10, tom: 'aviso' }, { rotulo: 'INT', valor: 0, tom: 'critico' }],
  })
  assert.match(s, />100</)
  assert.match(s, />90%</)
  assert.match(s, /aria-label="Por conceito, total 100: AT 90 \(90%\), NAT 10 \(10%\), INT 0 \(0%\)\."/)
  assert.equal((s.match(/<path /g) ?? []).length, 2)
  assert.match(render(M.GraficoRosca, { rotulo: 'x', dados: [{ rotulo: 'a', valor: 0 }] }), /sem dados/)
})

test('GraficoLinha: resumo com início, fim e pico; null interrompe a linha', () => {
  const s = render(M.GraficoLinha, {
    rotulo: 'Nota', categorias: ['jan', 'fev', 'mar', 'abr'],
    series: [{ nome: 'Média', valores: [70, 80, null, 90], tom: 'primario' }],
  })
  assert.match(s, /de 70 em jan a 90 em abr, pico de 90 em abr/)
  assert.equal((s.match(/<path /g) ?? []).length, 2)
  assert.match(s, /role="img"/)
})

test('GraficoFunil: conversão sobre a etapa anterior', () => {
  const s = render(M.GraficoFunil, { rotulo: 'x', etapas: [{ rotulo: 'A', valor: 100 }, { rotulo: 'B', valor: 40 }] })
  assert.match(s, /40% da etapa anterior/)
})

test('MapaDeCalor: tabela com cabeçalhos, célula sem dado em traço e botões no drill-down', () => {
  const props = { rotulo: 'x', linhas: ['L1', 'L2'], colunas: ['a', 'b'], valores: [[0, 5], [null, 10]] }
  const s = render(M.MapaDeCalor, props)
  assert.match(s, /scope="row"/)
  assert.match(s, />–</)
  assert.match(s, /data-nivel="5"/)
  assert.doesNotMatch(s, /<button/)
  assert.match(render(M.MapaDeCalor, { ...props, onSelecionarCelula: () => {} }), /<button/)
})

test('ProgressoPorFaixa: define a variável de cor e a faixa; zero fica transparente', () => {
  assert.match(render(M.ProgressoPorFaixa, { valor: 100, rotulo: 'ok' }), /--progresso-cor:var\(--grafico-sucesso\)/)
  assert.match(render(M.ProgressoPorFaixa, { valor: 50 }), /data-faixa-progresso="baixo"/)
  assert.match(render(M.ProgressoPorFaixa, { valor: 0 }), /--progresso-cor:transparent/)
})

test('Documento: título como h1, metadado vazio com texto, campo nulo a preencher, faixas e tabela', () => {
  const cab = render(M.CabecalhoDocumento, { titulo: 'Inspeção', nivel: 1, metadados: [{ rotulo: 'Revisão', valor: '', quandoVazio: 'sem revisão' }] })
  assert.match(cab, /<h1/)
  assert.match(cab, /sem revisão/)
  assert.doesNotMatch(cab, /<img/)
  assert.doesNotMatch(render(M.CabecalhoDocumento, { titulo: 'x', metadados: [] }), /<dl/)
  const bloco = render(M.BlocoDeCamposDocumento, { titulo: 'Dados', campos: [{ rotulo: 'Local', valor: null }] })
  assert.match(bloco, /a preencher/)
  const sec = render(M.FaixaSecaoDocumento, { nome: 'S1', paginas: [1, 2], progresso: { feitos: 2, total: 4 } })
  assert.match(sec, /páginas 1 e 2 do impresso/)
  assert.match(sec, />2\/4</)
  assert.match(sec, /aria-label="Progresso de S1"/)
  assert.doesNotMatch(render(M.FaixaCategoriaDocumento, { nome: 'C', progresso: { feitos: 0, total: 0 } }), /progressbar/)
  assert.match(render(M.FaixaCategoriaDocumento, { nome: 'C', tom: 'indisponivel' }), /documento-faixa-neutra/)
  const tab = render(M.TabelaDocumento, { children: React.createElement('tbody') })
  assert.match(tab, /data-tabela-documento/)
  assert.match(render(M.Folha, { children: 'x' }), /data-folha/)
})

test('Faixas do documento: tom legenda e título centralizado', () => {
  const leg = render(M.FaixaSecaoDocumento, { nome: 'AUDITOR', tom: 'legenda', centralizado: true })
  assert.match(leg, /data-tom="legenda"/)
  assert.match(leg, /bg-\[var\(--documento-faixa-legenda\)\]/)
  assert.match(leg, /<h3 class="[^"]*flex-1[^"]*text-center/)
  assert.doesNotMatch(render(M.FaixaSecaoDocumento, { nome: 'S' }), /text-center/)
  const cat = render(M.FaixaCategoriaDocumento, { nome: 'C', tom: 'legenda', centralizado: true })
  assert.match(cat, /bg-\[var\(--documento-faixa-legenda\)\]/)
  assert.match(cat, /<h4 class="[^"]*flex-1 text-center/)
  assert.doesNotMatch(render(M.FaixaCategoriaDocumento, { nome: 'C' }), /text-center/)
})

test('TabelaClassificacao: bloco no telefone e tabela, detalhe só quando existe', () => {
  const linhas = [{ id: 'a', rotulo: 'Crítico', tom: 'critico', prazo: 'Imediata', descricao: 'Grave.' }]
  const s = render(M.TabelaClassificacao, { linhas })
  assert.match(s, /sm:hidden/)
  assert.match(s, /<table/)
  assert.doesNotMatch(s, /Detalhe/)
  assert.match(render(M.TabelaClassificacao, { linhas: [{ ...linhas[0], detalhe: 'Conforme plano.' }] }), /Detalhe/)
})

test('CartaoListagem, AlternadorDeVisao e AvisoSomenteLeitura', () => {
  const Icone = () => null
  const c = render(M.CartaoListagem, { icone: Icone, titulo: 'Usuários', quantidade: 1, children: 'corpo' })
  assert.match(c, /1 registro no total/)
  assert.match(render(M.CartaoListagem, { icone: Icone, titulo: 'U', quantidade: 3, filtrada: true, children: 'x' }), /3 registros filtrados/)
  const a = render(M.AlternadorDeVisao, { valor: 'tabela', onChange: () => {} })
  assert.match(a, /aria-pressed="true"/)
  assert.match(render(M.AvisoSomenteLeitura, { children: 'Motivo.' }), /role="status"[^>]*>.*Somente leitura\./s)
})

// ─── Tokens e contraste ────────────────────────────────────────────────────
const css = readFileSync(join(RAIZ, 'src/styles/globals.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
function blocos(seletor) {
  const mapa = {}
  const re = new RegExp(`(?:^|[\\s}])${seletor.replace('.', '\\.')}\\s*\\{`, 'g')
  for (const m of css.matchAll(re)) {
    let i = m.index + m[0].length
    let nivel = 1
    const ini = i
    while (nivel > 0 && i < css.length) {
      if (css[i] === '{') nivel++
      if (css[i] === '}') nivel--
      i++
    }
    for (const [, nome, valor] of css.slice(ini, i - 1).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) mapa[nome] = valor.trim()
  }
  return mapa
}
const iniTema = css.indexOf('@theme {')
const tema = {}
for (const [, n, v] of css.slice(iniTema, css.indexOf('\n}', iniTema)).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tema[n] = v.trim()
const TOKENS = {
  claro: { ...tema, ...blocos(':root') },
  escuro: { ...tema, ...blocos(':root'), ...blocos('.dark') },
}
const TEMAS = ['claro', 'escuro']

function divideTopo(texto) {
  const p = []; let nivel = 0; let atual = ''
  for (const ch of texto) {
    if (ch === '(') nivel++
    if (ch === ')') nivel--
    if (ch === ',' && nivel === 0) { p.push(atual.trim()); atual = '' } else atual += ch
  }
  p.push(atual.trim()); return p
}
function avaliar(expr, t) {
  expr = expr.trim()
  let m
  if ((m = expr.match(/^var\((--[\w-]+)(?:,.*)?\)$/))) {
    assert.ok(TOKENS[t][m[1]], `token ${m[1]} não existe no tema ${t}`)
    return avaliar(TOKENS[t][m[1]], t)
  }
  if ((m = expr.match(/^#([\da-f]{3}|[\da-f]{6})$/i))) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }
  }
  if (expr === 'white') return { r: 255, g: 255, b: 255, a: 1 }
  if (expr === 'black') return { r: 0, g: 0, b: 0, a: 1 }
  if ((m = expr.match(/^color-mix\(in srgb,(.*)\)$/s))) {
    const [a, b] = divideTopo(m[1]).map((p) => {
      const pc = p.match(/^(.*?)\s+([\d.]+)%$/)
      return pc ? { cor: avaliar(pc[1], t), p: +pc[2] / 100 } : { cor: avaliar(p, t), p: null }
    })
    if (a.p === null) a.p = 1 - (b.p ?? 0.5)
    if (b.p === null) b.p = 1 - a.p
    const alfa = a.cor.a * a.p + b.cor.a * b.p
    const canal = (c) => (a.cor[c] * a.cor.a * a.p + b.cor[c] * b.cor.a * b.p) / alfa
    return { r: canal('r'), g: canal('g'), b: canal('b'), a: alfa }
  }
  assert.fail(`expressão de cor não reconhecida: ${expr}`)
}
const sobre = (f, fundo) => ({
  r: f.r * f.a + fundo.r * (1 - f.a), g: f.g * f.a + fundo.g * (1 - f.a), b: f.b * f.a + fundo.b * (1 - f.a), a: 1,
})
const lum = ({ r, g, b }) => {
  const l = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * l(r) + 0.7152 * l(g) + 0.0722 * l(b)
}
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const MEDIDAS = []
function verifica(rotulo, frente, fundo, minimo) {
  const c = contraste(sobre(frente, fundo), fundo)
  MEDIDAS.push(`${rotulo}: ${c.toFixed(2)}`)
  assert.ok(c >= minimo, `${rotulo}: ${c.toFixed(2)}:1, mínimo ${minimo}:1`)
}
after(() => console.log('# contraste medido\n' + MEDIDAS.map((l) => '#   ' + l).join('\n')))
const cor = (e, t) => avaliar(e, t)
const TONS = ['primario', 'secundario', 'sucesso', 'atencao', 'aviso', 'critico', 'neutro', 'violeta']

for (const t of TEMAS) {
  for (const tom of TONS) {
    test(`marca do tom ${tom}, tema ${t}: 3:1 sobre cartão, página e trilho`, () => {
      for (const base of ['--color-surface', '--color-surface-muted']) {
        verifica(`marca ${tom} / ${t} sobre ${base}`, cor(`var(--grafico-${tom})`, t), cor(`var(${base})`, t), 3)
      }
    })
  }

  test(`mapa de calor, tema ${t}: texto 4,5:1 nos cinco níveis dos quatro tons`, () => {
    const passos = readFileSync(C + 'grafico-logica.ts', 'utf8').match(/PASSOS_CALOR = \[([^\]]+)\]/)[1].split(',').map(Number)
    assert.equal(passos.length, 5)
    for (const tom of ['primario', 'aviso', 'critico', 'violeta']) {
      passos.forEach((p, i) => {
        const fundo = sobre(cor(`color-mix(in srgb, var(--grafico-${tom}) ${Math.round(p * 100)}%, var(--color-surface))`, t), cor('var(--color-surface)', t))
        const texto = i === 4 ? cor('var(--grafico-calor-texto-forte)', t) : cor('var(--color-fg)', t)
        verifica(`calor ${tom} nível ${i + 1} / ${t}`, texto, fundo, 4.5)
      })
    }
  })

  test(`faixas do documento, tema ${t}: texto branco (e a 90%) 4,5:1`, () => {
    const faixas = {
      titulo: 'var(--documento-faixa-titulo)', rotulo: 'var(--documento-faixa-rotulo)', neutra: 'var(--documento-faixa-neutra)',
      secao: 'var(--color-primary-hover)', categoria: 'var(--color-primary)', legenda: 'var(--documento-faixa-legenda)',
    }
    for (const [nome, f] of Object.entries(faixas)) {
      const fundo = cor(f, t)
      verifica(`branco sobre faixa ${nome} / ${t}`, { r: 255, g: 255, b: 255, a: 1 }, fundo, 4.5)
      // O texto a 90% (referência de página, contagem) só existe nas faixas de seção, categoria e neutra.
      if (['secao', 'categoria', 'neutra', 'legenda'].includes(nome))
        verifica(`branco 90% sobre faixa ${nome} / ${t}`, { r: 255, g: 255, b: 255, a: 0.9 }, fundo, 4.5)
    }
  })

  test(`rótulos do documento e detalhe da classificação, tema ${t}: texto 4,5:1`, () => {
    const s = cor('var(--color-surface)', t)
    verifica(`rótulo de campo / ${t}`, cor('var(--color-fg-muted)', t), s, 4.5)
    verifica(`valor de campo / ${t}`, cor('var(--color-primary-text)', t), s, 4.5)
    for (const tom of TONS) {
      const linha = sobre(cor(`color-mix(in srgb, var(--grafico-${tom}) 8%, var(--color-surface))`, t), s)
      verifica(`classificação fg ${tom} / ${t}`, cor('var(--color-fg)', t), linha, 4.5)
      verifica(`classificação detalhe ${tom} / ${t}`, cor('var(--color-fg-muted-strong)', t), linha, 4.5)
    }
  })
}

// ─── Rodada 2 da 0.21.0: drill-down, escala fixa, valor por barra, rótulo final, baixar imagem ──────────
/** Expande componentes de função sem hook até sobrarem só elementos do DOM: dá para achar o `onClick` e chamá-lo. */
function expandir(no) {
  if (Array.isArray(no)) return no.map(expandir)
  if (no == null || typeof no !== 'object' || !no.type) return no
  if (typeof no.type === 'function') return expandir(no.type(no.props))
  return { ...no, props: { ...no.props, children: expandir(no.props?.children) } }
}
function coletar(no, pred, saida = []) {
  if (Array.isArray(no)) no.forEach((n) => coletar(n, pred, saida))
  else if (no && typeof no === 'object' && no.props) {
    if (pred(no)) saida.push(no)
    coletar(no.props.children, pred, saida)
  }
  return saida
}
const botoes = (arvore) => coletar(expandir(arvore), (n) => n.type === 'button')

test('escala fixa: tamanhoEmPercentual e percentuaisDoMaior com base', () => {
  assert.equal(L.tamanhoEmPercentual(50, 100), 50)
  assert.equal(L.tamanhoEmPercentual(150, 100), 100)
  assert.equal(L.tamanhoEmPercentual(0, 100), 0)
  assert.equal(L.tamanhoEmPercentual(5, 0), 0)
  assert.equal(L.tamanhoEmPercentual(0.2, 100, 1.5), 1.5)
  assert.deepEqual(L.percentuaisDoMaior([50, 25, 0], 2, 100), [50, 25, 0])
  assert.deepEqual(L.percentuaisDoMaior([50, 25], 2), [100, 50]) // sem base: o maior
})

test('indicesDosRotulos: o último rótulo do eixo sempre aparece, sem colar no vizinho', () => {
  assert.deepEqual(L.indicesDosRotulos(10, 3), [0, 3, 6, 9])
  assert.deepEqual(L.indicesDosRotulos(10, 4), [0, 4, 9]) // 8 cairia colado no 9
  assert.deepEqual(L.indicesDosRotulos(12, 2), [0, 2, 4, 6, 8, 11])
  assert.deepEqual(L.indicesDosRotulos(3, 1), [0, 1, 2])
  assert.deepEqual(L.indicesDosRotulos(1, 5), [0])
  assert.deepEqual(L.indicesDosRotulos(0, 2), [])
  for (let n = 1; n <= 40; n++) for (let p = 1; p <= 8; p++) assert.equal(L.indicesDosRotulos(n, p).at(-1), n - 1)
})

test('nomeDoArquivoImagem: sem acento nem símbolo, com hífens', () => {
  assert.equal(L.nomeDoArquivoImagem('OPAs por status'), 'opas-por-status.png')
  assert.equal(L.nomeDoArquivoImagem('Inspeções por local (2025)'), 'inspecoes-por-local-2025.png')
  assert.equal(L.nomeDoArquivoImagem('  ?!  '), 'grafico.png')
})

const SERIES2 = [{ nome: 'Abertas', tom: 'critico' }, { nome: 'Encerradas', tom: 'sucesso' }]
const DADOS2 = [{ rotulo: '1º tri', valores: [5, 4] }, { rotulo: '2º tri', valores: [9, 6] }]

test('GraficoBarras agrupado: um valor por barra, nunca "5 / 4" numa linha só (vertical e horizontal)', () => {
  for (const orientacao of ['vertical', 'horizontal']) {
    const s = render(M.GraficoBarras, { rotulo: 'x', orientacao, dados: DADOS2, series: SERIES2 })
    for (const v of [5, 4, 9, 6]) assert.match(s, new RegExp(`>${v}<`), `${orientacao}: falta o valor ${v}`)
    assert.doesNotMatch(s, /\d \/ \d/, `${orientacao}: valores juntos numa linha`)
  }
  // Empilhado continua com a soma.
  assert.match(render(M.GraficoBarras, { rotulo: 'x', orientacao: 'vertical', modo: 'empilhado', dados: DADOS2, series: SERIES2 }), />9</)
})

test('GraficoBarras: maximo fixa a escala (50 de 100 ocupa metade; sem maximo, o maior enche)', () => {
  const dados = [{ rotulo: 'a', valor: 50 }]
  assert.match(render(M.GraficoBarras, { rotulo: 'x', dados, maximo: 100 }), /width:50%/)
  assert.match(render(M.GraficoBarras, { rotulo: 'x', dados }), /width:100%/)
  assert.match(render(M.GraficoBarras, { rotulo: 'x', dados: [{ rotulo: 'a', valor: 150 }], maximo: 100 }), /width:100%/)
})

test('GraficoBarras onSelecionarBarra: uma barra = um botão, devolve categoria e série; onSelecionar vem junto', () => {
  const barras = []
  const cats = []
  const props = { rotulo: 'x', dados: DADOS2, series: SERIES2, onSelecionarBarra: (e) => barras.push(e), onSelecionar: (r) => cats.push(r) }
  const arvore = M.GraficoBarras(props)
  const bs = botoes(arvore)
  assert.equal(bs.length, 4, 'um botão por barra (2 categorias x 2 séries)')
  assert.equal(bs[1].props['aria-label'], '1º tri · Encerradas: 4')
  bs[1].props.onClick()
  bs[2].props.onClick()
  assert.deepEqual(barras, [
    { categoria: '1º tri', serie: 'Encerradas', indiceSerie: 1, valor: 4 },
    { categoria: '2º tri', serie: 'Abertas', indiceSerie: 0, valor: 9 },
  ])
  assert.deepEqual(cats, ['1º tri', '2º tri'])
  // Sem onSelecionarBarra nenhuma barra é botão; com onSelecionar a categoria é um botão só.
  assert.equal(botoes(M.GraficoBarras({ rotulo: 'x', dados: DADOS2, series: SERIES2 })).length, 0)
  assert.equal(botoes(M.GraficoBarras({ rotulo: 'x', dados: DADOS2, series: SERIES2, onSelecionar() {} })).length, 2)
  // Barra posicionada com `absolute` não pode receber `relative` por cima (sumia do desenho): uma coisa ou outra.
  const html = render(M.GraficoBarras, { rotulo: 'x', orientacao: 'vertical', dados: DADOS2, series: SERIES2, onSelecionarBarra() {} })
  const classes = (html.match(/<button[^>]*class="([^"]*)"/g) ?? [])
  assert.equal(classes.filter((c) => /[ "]absolute /.test(c)).length, 4, 'as 4 barras seguem absolute (o relative do alvo ampliado não pode vencer)')
  // Série única: serie fica ausente.
  const um = []
  botoes(M.GraficoBarras({ rotulo: 'x', dados: [{ rotulo: 'Norte', valor: 7 }], onSelecionarBarra: (e) => um.push(e) }))[0].props.onClick()
  assert.deepEqual(um, [{ categoria: 'Norte', serie: undefined, indiceSerie: 0, valor: 7 }])
  // serieSelecionada marca só a barra da série.
  const m = render(M.GraficoBarras, { rotulo: 'x', dados: DADOS2, series: SERIES2, onSelecionarBarra() {}, selecionado: '1º tri', serieSelecionada: 'Abertas' })
  assert.equal((m.match(/aria-pressed="true"/g) ?? []).length, 1)
})

test('GraficoFunil: onSelecionarEtapa vira botão por etapa; maximo fixa a largura', () => {
  const etapas = [{ rotulo: 'A', valor: 100 }, { rotulo: 'B', valor: 40 }]
  const sel = []
  const bs = botoes(M.GraficoFunil({ rotulo: 'x', etapas, onSelecionarEtapa: (e) => sel.push(e) }))
  assert.equal(bs.length, 2)
  bs[1].props.onClick()
  assert.deepEqual(sel, [{ rotulo: 'B', indice: 1, valor: 40 }])
  assert.equal(botoes(M.GraficoFunil({ rotulo: 'x', etapas })).length, 0)
  assert.match(render(M.GraficoFunil, { rotulo: 'x', etapas, selecionada: 'A', onSelecionarEtapa() {} }), /aria-pressed="true"/)
  assert.match(render(M.GraficoFunil, { rotulo: 'x', etapas: [{ rotulo: 'A', valor: 50 }], maximo: 100 }), /width:50%/)
  assert.match(render(M.GraficoFunil, { rotulo: 'x', etapas: [{ rotulo: 'A', valor: 50 }] }), /width:100%/)
})

test('GraficoLinha: o último rótulo do eixo aparece; maximo fixa o topo; ponto vira botão só com onSelecionarPonto', () => {
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const props = { rotulo: 'x', categorias: meses, series: [{ nome: 'Nota', valores: meses.map((_, i) => 40 + i) }] }
  const s = render(M.GraficoLinha, props)
  assert.match(s, />jan</)
  assert.match(s, />dez</)
  assert.doesNotMatch(s, /role="button"/)
  assert.match(s, />60</) // sem maximo o topo acompanha o maior valor (51 -> 60)
  assert.doesNotMatch(s, />100</)
  const fixo = render(M.GraficoLinha, { ...props, maximo: 100 })
  assert.match(fixo, />100</)
  assert.match(fixo, />75</)
  const com = render(M.GraficoLinha, { ...props, onSelecionarPonto() {}, pontoSelecionado: { serie: 'Nota', categoria: 'mar' } })
  assert.equal((com.match(/role="button"/g) ?? []).length, 12)
  assert.match(com, /aria-label="Nota, mar: 42"/)
  assert.equal((com.match(/aria-pressed="true"/g) ?? []).length, 1)
})

test('CartaoGrafico: o botão de baixar imagem só existe com permiteBaixarImagem e fica fora do PNG', () => {
  assert.doesNotMatch(render(M.CartaoGrafico, { titulo: 'Por status', lateral: '3 itens', children: 'x' }), /Baixar imagem/)
  const s = render(M.CartaoGrafico, { titulo: 'Por status', permiteBaixarImagem: true, children: 'x' })
  assert.match(s, /aria-label="Baixar imagem do gráfico Por status"/)
  assert.match(s, /data-sem-imagem=""/)
  assert.doesNotMatch(render(M.CartaoGrafico, { titulo: 'T', permiteBaixarImagem: true, vazio: true }), /Baixar imagem/)
})
