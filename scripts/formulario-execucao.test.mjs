/**
 * Formulário de execução (SegmentoAvaliacao, BarraAcoesRodape, SecaoNumerada, AssinaturaCanvas,
 * CardChecklist): contraste de texto (WCAG 1.4.3, 4,5:1) nos dois temas, lido dos tokens de
 * src/styles/globals.css e das classes dos próprios arquivos, e marcação renderizada.
 * Rodar: node --test scripts/formulario-execucao.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
const COMP = 'src/components/composites/'
const MINIMO_TEXTO = 4.5
const TEMAS = ['claro', 'escuro']

// ─── Tokens e cores ────────────────────────────────────────────────────────
const css = ler('src/styles/globals.css').replace(/\/\*[\s\S]*?\*\//g, '')
function declaracoes(trecho) {
  const mapa = {}
  for (const [, nome, valor] of trecho.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) mapa[nome] = valor.trim()
  return mapa
}
function bloco(seletor) {
  const inicio = css.indexOf(`${seletor} {`)
  assert.notEqual(inicio, -1, `bloco ${seletor} não encontrado`)
  return css.slice(inicio, css.indexOf('\n  }', inicio))
}
const inicioTema = css.indexOf('@theme {')
const tema = css.slice(inicioTema, css.indexOf('\n}', inicioTema))
const TOKENS = {
  claro: { ...declaracoes(tema), ...declaracoes(bloco(':root')) },
  escuro: { ...declaracoes(tema), ...declaracoes(bloco(':root')), ...declaracoes(bloco('.dark')) },
}

function divideTopo(texto) {
  const partes = []
  let nivel = 0
  let atual = ''
  for (const ch of texto) {
    if (ch === '(') nivel++
    if (ch === ')') nivel--
    if (ch === ',' && nivel === 0) {
      partes.push(atual.trim())
      atual = ''
    } else atual += ch
  }
  partes.push(atual.trim())
  return partes
}

/** Avalia hex, rgba(), white, var() e color-mix(in srgb, A p%, B). Devolve {r,g,b,a}. */
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
  if ((m = expr.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/)))
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
  if ((m = expr.match(/^color-mix\(in[ _]srgb,(.*)\)$/s))) {
    const [a, b] = divideTopo(m[1].replace(/_/g, ' ')).map((p) => {
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
const sobre = (frente, fundo) => ({
  r: frente.r * frente.a + fundo.r * (1 - frente.a),
  g: frente.g * frente.a + fundo.g * (1 - frente.a),
  b: frente.b * frente.a + fundo.b * (1 - frente.a),
  a: 1,
})
const lum = ({ r, g, b }) => {
  const l = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * l(r) + 0.7152 * l(g) + 0.0722 * l(b)
}
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const MEDIDAS = []
function verifica(rotulo, texto, fundo) {
  const c = contraste(sobre(texto, fundo), fundo)
  MEDIDAS.push(`${rotulo}: ${c.toFixed(2)}`)
  assert.ok(c >= MINIMO_TEXTO, `${rotulo}: ${c.toFixed(2)}:1, mínimo ${MINIMO_TEXTO}:1`)
}
after(() => console.log('# contraste medido\n' + MEDIDAS.map((l) => '#   ' + l).join('\n')))

// ─── SegmentoAvaliacao: cada tom, marcado e não marcado ────────────────────
const variantes = ler(COMP + 'segmento-avaliacao-variants.ts')
const bloco_marcado = variantes.slice(variantes.indexOf('segmentoMarcado'), variantes.indexOf('segmentoPonto'))
const TONS = ['sucesso', 'atencao', 'aviso', 'neutro', 'critico']
function classesDoTom(tom) {
  const m = bloco_marcado.match(new RegExp(`${tom}:\\s*'([^']+)'`))
  assert.ok(m, `tom ${tom} não encontrado em segmento-avaliacao-variants.ts`)
  const pega = (prefixo) => {
    const r = m[1].match(new RegExp(`(?:^| )${prefixo}-\\[(.+?)\\](?= |$)`))
    assert.ok(r, `${tom}: classe ${prefixo}-[...] não encontrada`)
    return r[1]
  }
  return { fundo: pega('bg'), texto: pega('text') }
}

for (const t of TEMAS) {
  for (const tom of TONS) {
    test(`SegmentoAvaliacao marcado, tom ${tom}, tema ${t}: texto contra o fundo do tom`, () => {
      const { fundo, texto } = classesDoTom(tom)
      // O fundo pode ter alfa: compõe sobre a base do grupo (surface-muted) e sobre o cartão (surface), vale o pior.
      for (const base of ['--color-surface-muted', '--color-surface']) {
        const b = avaliar(`var(${base})`, t)
        const fundoOpaco = sobre(avaliar(fundo, t), b)
        verifica(`marcado ${tom} / ${t} sobre ${base}`, avaliar(texto, t), fundoOpaco)
      }
    })
  }
  test(`SegmentoAvaliacao não marcado, tema ${t}: texto em repouso e em hover`, () => {
    const fonte = ler(COMP + 'SegmentoAvaliacao.tsx')
    const m = fonte.match(/border-transparent bg-\[var\((--[\w-]+)\)\] text-\[(color-mix[^\]]+)\] hover:bg-\[var\((--[\w-]+)\)\]/)
    assert.ok(m, 'classes do botão não marcado não encontradas')
    verifica(`desmarcado repouso / ${t}`, avaliar(m[2], t), avaliar(`var(${m[1]})`, t))
    verifica(`desmarcado hover / ${t}`, avaliar(m[2], t), avaliar(`var(${m[3]})`, t))
  })
}

// ─── Chip numerado e barra de ações ────────────────────────────────────────
for (const t of TEMAS) {
  test(`SecaoNumerada, tema ${t}: número branco contra as duas pontas do degradê`, () => {
    const fonte = ler(COMP + 'SecaoNumerada.tsx')
    const m = fonte.match(/bg-\[linear-gradient\(135deg,(var\(--color-primary\)),(color-mix\(in_srgb,var\(--color-primary\)_75%,var\(--color-fips-blue-950\)\))\)\]/)
    assert.ok(m, 'degradê do chip não encontrado')
    assert.match(fonte, /text-sm font-bold text-white/)
    for (const ponta of [m[1], m[2]]) verifica(`chip / ${t} / ${ponta.slice(0, 22)}`, avaliar('white', t), avaliar(ponta, t))
  })
  test(`BarraAcoesRodape, tema ${t}: texto de estado, erro e botões contra a faixa`, () => {
    const barra = ler(COMP + 'BarraAcoesRodape.tsx')
    assert.match(barra, /bg-\[var\(--color-primary-hover\)\]/)
    assert.match(barra, /dark:bg-\[var\(--color-surface\)\]/)
    assert.match(barra, /text-white\/60 dark:text-\[var\(--color-fg-muted\)\]/)
    assert.match(barra, /text-\[var\(--color-fips-red-300\)\]/)
    const faixa = avaliar(t === 'claro' ? 'var(--color-primary-hover)' : 'var(--color-surface)', t)
    const estado = t === 'claro' ? { r: 255, g: 255, b: 255, a: 0.6 } : avaliar('var(--color-fg-muted)', t)
    verifica(`barra estado / ${t}`, estado, faixa)
    verifica(`barra erro / ${t}`, avaliar('var(--color-fips-red-300)', t), faixa)
    verifica(`barra botão inverseOutline (texto branco) / ${t}`, avaliar('white', t), faixa)
    verifica(`barra botão ouro (texto primary-hover sobre accent) / ${t}`, avaliar('var(--color-primary-hover)', t), avaliar('var(--color-accent)', t))
  })
}

test('CardChecklist e AssinaturaCanvas: textos só em fg e fg-muted sobre a superfície', () => {
  for (const t of TEMAS) {
    verifica(`card fg-muted / ${t}`, avaliar('var(--color-fg-muted)', t), avaliar('var(--color-surface)', t))
    verifica(`card fg / ${t}`, avaliar('var(--color-fg)', t), avaliar('var(--color-surface)', t))
    verifica(`erro da assinatura (danger-text) / ${t}`, avaliar('var(--color-danger-text)', t), avaliar('var(--color-surface)', t))
  }
})

test('Nenhuma cor crua nos componentes novos, salvo o papel e o traço de reserva da assinatura', () => {
  const achados = []
  for (const arq of ['SecaoNumerada', 'BarraAcoesRodape', 'SegmentoAvaliacao', 'CardChecklist', 'AssinaturaCanvas'].map((n) => COMP + n + '.tsx').concat(COMP + 'segmento-avaliacao-variants.ts')) {
    ler(arq).split('\n').forEach((l, i) => {
      if (/#[\da-f]{3,8}\b|rgba?\(/i.test(l) && !/\|\| '#/.test(l) && !/var\(--color-white, #fff\)|var\(--color-white,#fff\)/.test(l)) achados.push(`${arq}:${i + 1}`)
    })
  }
  assert.deepEqual(achados, [])
})

// ─── Lógica pura do texto de estado ────────────────────────────────────────
test('textoEstadoSalvamento: um texto por estado', async () => {
  const { textoEstadoSalvamento } = await import(pathToFileURL(join(RAIZ, COMP + 'estado-salvamento.ts')).href)
  const hora = new Date(2026, 10, 2, 9, 5)
  assert.equal(textoEstadoSalvamento('limpo'), 'Nada alterado ainda.')
  assert.match(textoEstadoSalvamento('limpo', hora), /^Salvo às 0?9:05$/)
  assert.equal(textoEstadoSalvamento('salvando', hora), 'Salvando…')
  assert.equal(textoEstadoSalvamento('sujo', hora), 'Alterações ainda não salvas.')
  assert.equal(textoEstadoSalvamento('erro'), 'Não foi possível salvar.')
  assert.equal(textoEstadoSalvamento('erro', null, 'Sem rede.'), 'Sem rede.')
})

// ─── Marcação renderizada ──────────────────────────────────────────────────
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-formulario-execucao')
let React, html, M
before(async () => {
  mkdirSync(TMP, { recursive: true })
  const entrada = join(TMP, 'entrada.tsx')
  writeFileSync(
    entrada,
    ['SecaoNumerada', 'BarraAcoesRodape', 'SegmentoAvaliacao', 'AssinaturaCanvas', 'CardChecklist']
      .map((n) => `export * from '${join(RAIZ, COMP + n + '.tsx')}'`)
      .join('\n') + `\nexport { Sparkles } from 'lucide-react'\n`,
  )
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, lote.output.find((o) => o.type === 'chunk' && o.isEntry).code)
  M = await import(pathToFileURL(arquivo).href)
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  const { renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href)
  html = (tipo, props, filhos) => renderToStaticMarkup(React.createElement(M[tipo] ?? tipo, props, filhos))
})
after(() => rmSync(TMP, { recursive: true, force: true }))

test('SecaoNumerada: chip "03" aria-hidden, heading com o número só para leitor de tela', () => {
  const s = html('SecaoNumerada', { id: 'a', numero: 3, titulo: 'Itens', dica: 'Responda tudo', icone: M.Sparkles }, 'corpo')
  assert.match(s, /<section id="a" aria-labelledby="a-titulo"/)
  assert.match(s, /aria-hidden="true"[^>]*>03<\/span>/)
  assert.match(s, /<h2 id="a-titulo"[^>]*><span class="sr-only">3\.<\/span> Itens<\/h2>/)
  assert.match(html('SecaoNumerada', { id: 'b', numero: 1, titulo: 'X', nivelTitulo: 3 }, 'c'), /<h3 id="b-titulo"/)
  assert.doesNotMatch(html('SecaoNumerada', { id: 'c', numero: 1, titulo: 'X' }), /border-b/)
})

test('SegmentoAvaliacao: aria-pressed só na marcada, nome acessível com o rótulo curto', () => {
  const opcoes = [
    { valor: 'AT', rotulo: 'AT', nome: 'Atende', tom: 'sucesso' },
    { valor: 'NA', rotulo: 'NA', tom: 'neutro' },
  ]
  const s = html('SegmentoAvaliacao', { opcoes, valor: 'AT', onChange() {}, rotulo: 'Item 1' })
  assert.match(s, /role="group" aria-label="Item 1"/)
  assert.match(s, /data-avaliacao="AT"[^>]*aria-pressed="true"[^>]*aria-label="AT, Atende"/)
  assert.match(s, /data-avaliacao="NA"[^>]*aria-pressed="false"[^>]*aria-label="NA"/)
  assert.match(html('SegmentoAvaliacao', { opcoes, valor: null, onChange() {}, rotulo: 'x', grande: true }), /grid-template-columns:repeat\(2, ?minmax\(0, ?1fr\)\)/)
  assert.match(html('SegmentoAvaliacao', { opcoes, valor: 'AT', onChange() {}, rotulo: 'x', desabilitado: true }), /disabled=""/)
})

test('BarraAcoesRodape: região nomeada com o estado em role=status', () => {
  const estado = React.createElement(M.EstadoSalvamento, { estado: 'limpo', salvoEm: new Date(2026, 10, 2, 14, 32) })
  const s = html('BarraAcoesRodape', { label: 'Ações da inspeção', estado }, 'botoes')
  assert.match(s, /role="region" aria-label="Ações da inspeção"/)
  assert.match(s, /role="status" aria-live="polite"[^>]*>Salvo às 14:32</)
})

test('AssinaturaCanvas: quadro vazio, imagem registrada e erro', () => {
  const vazio = html('AssinaturaCanvas', { rotulo: 'Inspetor', onChange() {}, obrigatoria: true, erro: 'Falta a assinatura.' })
  assert.match(vazio, /<canvas [^>]*width="520" height="160"/)
  assert.match(vazio, /touch-action:none/)
  assert.match(vazio, /sr-only"> \(obrigatória\)/)
  assert.match(vazio, /Falta a assinatura\./)
  assert.match(vazio, /disabled=""/) // Limpar desligado sem traço
  const feito = html('AssinaturaCanvas', { rotulo: 'Inspetor', onChange() {}, valor: 'data:image/png;base64,AAA', erro: 'Falta a assinatura.' })
  assert.match(feito, /<img [^>]*alt="Assinatura: Inspetor"/)
  assert.doesNotMatch(feito, /Falta a assinatura\./)
  assert.doesNotMatch(html('AssinaturaCanvas', { rotulo: 'I', onChange() {}, valor: 'data:x', desabilitado: true }), /Limpar/)
})

test('CardChecklist: metadados, singular de item e ação desligada com motivo', () => {
  const s = html('CardChecklist', {
    titulo: 'Vistoria', codigo: 'FT-01', revisao: '03', totalItens: 1, como: 'li',
    dados: [{ rotulo: 'Última', valor: '02/11' }],
    acao: { rotulo: 'Iniciar', desabilitada: true, motivoDesabilitada: 'Sem permissão.' },
  })
  assert.match(s, /^<li /)
  assert.match(s, /<h3[^>]*>Vistoria<\/h3>/)
  assert.match(s, /FT-01/)
  assert.match(s, /revisão 03/)
  assert.match(s, /1 item</)
  assert.match(s, /<dt[^>]*>Última<\/dt><dd[^>]*>02\/11<\/dd>/)
  const m = s.match(/<button [^>]*aria-describedby="([^"]+)"[^>]*disabled/) ?? s.match(/<button [^>]*disabled=""[^>]*aria-describedby="([^"]+)"/)
  assert.ok(m, 'botão desligado sem aria-describedby')
  assert.match(s, new RegExp(`<p id="${m[1].replace(/:/g, '\\:')}"[^>]*>Sem permissão\\.`))
  const link = html('CardChecklist', { titulo: 'T', totalItens: 2, acao: { rotulo: 'Ir', href: '/x' } })
  assert.match(link, /<a [^>]*href="\/x"/)
  assert.match(link, /2 itens/)
})

// ─── Rodada 2 da 0.21.0: medidas da Manutenção ─────────────────────────────
test('BarraAcoesRodape: variante rodape (padrão) é faixa reta com linha no topo; cartao mantém o cartão', () => {
  const padrao = html('BarraAcoesRodape', { estado: 'x' }, 'botoes')
  assert.match(padrao, /border-t border-\[var\(--color-border\)\]/)
  assert.match(padrao, /px-4 sm:px-6 lg:px-8/)
  assert.doesNotMatch(padrao, /rounded-xl/)
  assert.match(padrao, /mr-auto/) // estado à esquerda, ações à direita
  const cartao = html('BarraAcoesRodape', { variante: 'cartao', estado: 'x' }, 'botoes')
  assert.match(cartao, /rounded-xl/)
  assert.doesNotMatch(cartao, /border-t /)
  assert.equal(html('BarraAcoesRodape', { variante: 'rodape' }, 'b'), html('BarraAcoesRodape', {}, 'b'))
})

test('AssinaturaCanvas: quadro de borda sólida de 1px, até 512px de borda a borda (510 de conteúdo), sem moldura tracejada', () => {
  const s = html('AssinaturaCanvas', { rotulo: 'Inspetor', onChange() {} })
  assert.match(s, /<canvas [^>]*class="[^"]*max-w-\[510px\][^"]*rounded-md border border-\[var\(--color-border\)\]/)
  assert.doesNotMatch(s, /dashed/)
  assert.doesNotMatch(s, /border-2/)
  assert.match(s, /aspect-ratio:520 \/ 160/)
  const erro = html('AssinaturaCanvas', { rotulo: 'I', onChange() {}, erro: 'Falta.' })
  assert.match(erro, /<canvas [^>]*border-\[var\(--color-danger\)\]/)
})

test('CardChecklist: montado sobre Card e CardContent (raio 16, conteúdo p-6 com pt-5)', () => {
  const s = html('CardChecklist', { titulo: 'T', como: 'li', acao: { rotulo: 'Ir', onClick() {} } })
  assert.match(s, /^<li class="[^"]*rounded-2xl[^"]*flex flex-col/)
  assert.match(s, /<div class="[^"]*p-6 pt-5[^"]*flex flex-1 flex-col gap-3/)
  assert.doesNotMatch(s, /rounded-xl border[^"]* p-4 /)
})
