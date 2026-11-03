/**
 * Rodada 3 da 0.21.0: lógica pura (foco, lista na tela, menu radial, linha clicável, impressão, tutorial,
 * expansão do clique do gráfico, contraste) e render estático (KPI, Modal, pills, Tabela). Rodar:
 * node --test scripts/rodada3.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const imp = (caminho) => import(pathToFileURL(join(RAIZ, caminho)).href)

const foco = await imp('src/lib/foco-de-retorno.ts')
const lista = await imp('src/lib/lista-na-tela.ts')
const contraste = await imp('src/lib/contraste.ts')
const radial = await imp('src/components/composites/menu-radial-logica.ts')
const linha = await imp('src/components/composites/tabela-linha-logica.ts')
const casca = await imp('src/components/composites/app-shell-logica.ts')
const grafico = await imp('src/components/composites/grafico-logica.ts')

// ───────── Foco de retorno (Modal, Dialog, Drawer) ─────────
const elemento = (extra = {}) => ({ isConnected: true, focus() {}, ...extra })

test('foco de retorno: devolve a origem quando ela ainda está na página', () => {
  const origem = elemento()
  assert.equal(foco.escolherAlvoDoFoco(origem, {}), origem)
})

test('foco de retorno: origem removida, ausente ou o próprio body não recebe foco', () => {
  const corpo = elemento()
  assert.equal(foco.escolherAlvoDoFoco(elemento({ isConnected: false }), corpo), null)
  assert.equal(foco.escolherAlvoDoFoco(null, corpo), null)
  assert.equal(foco.escolherAlvoDoFoco(undefined, corpo), null)
  assert.equal(foco.escolherAlvoDoFoco(corpo, corpo), null)
  assert.equal(foco.escolherAlvoDoFoco({ isConnected: true }, corpo), null)
})

// ───────── Lista suspensa na tela (Select, ChipSelect, Período) ─────────
const AREA = { top: 0, left: 0, right: 375, bottom: 640 }
const gatilho = (top, bottom) => ({ top, bottom, left: 24, right: 224 })

test('lista na tela: cabendo embaixo, não muda nada', () => {
  const r = lista.ajustarListaNaArea(gatilho(100, 140), { left: 24, right: 224, height: 200 }, AREA)
  assert.deepEqual(r, { lado: 'baixo', deslocamentoX: 0, alturaMaxima: null })
})

test('lista na tela: sem espaço embaixo e com espaço em cima, vira para cima', () => {
  const r = lista.ajustarListaNaArea(gatilho(500, 540), { left: 24, right: 224, height: 280 }, AREA)
  assert.equal(r.lado, 'cima')
  assert.equal(r.alturaMaxima, null)
})

test('lista na tela: não cabe em nenhum lado, usa o lado maior e encurta (fecha com folga)', () => {
  const r = lista.ajustarListaNaArea(gatilho(250, 290), { left: 24, right: 224, height: 500 }, AREA)
  assert.equal(r.lado, 'baixo')
  assert.equal(r.alturaMaxima, 640 - 290 - 8)
  const cima = lista.ajustarListaNaArea(gatilho(330, 370), { left: 24, right: 224, height: 600 }, AREA)
  assert.equal(cima.lado, 'cima')
  assert.equal(cima.alturaMaxima, 330 - 0 - 8)
})

test('lista na tela: o vão do gatilho (afastamento) entra na conta do espaço', () => {
  const sem = lista.ajustarListaNaArea(gatilho(100, 140), { left: 24, right: 224, height: 480 }, AREA, 8, 0)
  const com = lista.ajustarListaNaArea(gatilho(100, 140), { left: 24, right: 224, height: 480 }, AREA, 8, 20)
  assert.equal(sem.lado, 'baixo')
  assert.equal(sem.alturaMaxima, null) // 640-140-8 = 492
  assert.equal(com.alturaMaxima, 472) // 640-140-20-8
})

test('lista na tela: passou da borda esquerda ou direita, desloca para dentro com folga', () => {
  const esq = lista.ajustarListaNaArea(gatilho(100, 140), { left: -11, right: 189, height: 100 }, AREA)
  assert.equal(esq.deslocamentoX, 19) // -11 -> 8
  const dir = lista.ajustarListaNaArea(gatilho(100, 140), { left: 250, right: 450, height: 100 }, AREA)
  assert.equal(dir.deslocamentoX, -83) // 450 -> 367
})

test('lista na tela: área recortada (corpo do Drawer) vale no lugar da janela', () => {
  const corpo = { top: 101, left: 0, right: 400, bottom: 571 }
  const r = lista.ajustarListaNaArea(gatilho(496, 536), { left: 24, right: 224, height: 280 }, corpo)
  assert.equal(r.lado, 'cima')
})

test('lista na tela: interseção de áreas', () => {
  assert.deepEqual(
    lista.intersecao({ top: 0, left: 0, right: 100, bottom: 100 }, { top: 20, left: 10, right: 300, bottom: 50 }),
    { top: 20, left: 10, right: 100, bottom: 50 },
  )
})

// ───────── Menu radial: teclado ─────────
test('menu radial: setas giram com volta, Home e End vão às pontas', () => {
  assert.deepEqual(radial.acaoDoTeclado('ArrowRight', 2, 3), { tipo: 'mover', indice: 0 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowDown', 0, 3), { tipo: 'mover', indice: 1 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowLeft', 0, 3), { tipo: 'mover', indice: 2 })
  assert.deepEqual(radial.acaoDoTeclado('ArrowUp', 1, 3), { tipo: 'mover', indice: 0 })
  assert.deepEqual(radial.acaoDoTeclado('Home', 2, 3), { tipo: 'mover', indice: 0 })
  assert.deepEqual(radial.acaoDoTeclado('End', 0, 3), { tipo: 'mover', indice: 2 })
})

test('menu radial: Enter e Espaço ativam; Esc e Tab fecham; outras teclas e lista vazia ignoram', () => {
  assert.deepEqual(radial.acaoDoTeclado('Enter', 1, 3), { tipo: 'ativar' })
  assert.deepEqual(radial.acaoDoTeclado(' ', 1, 3), { tipo: 'ativar' })
  assert.deepEqual(radial.acaoDoTeclado('Escape', 1, 3), { tipo: 'fechar' })
  assert.deepEqual(radial.acaoDoTeclado('Tab', 1, 3), { tipo: 'fechar' })
  assert.deepEqual(radial.acaoDoTeclado('a', 1, 3), { tipo: 'ignorar' })
  assert.deepEqual(radial.acaoDoTeclado('ArrowDown', 0, 0), { tipo: 'ignorar' })
  assert.deepEqual(radial.acaoDoTeclado('Escape', 0, 0), { tipo: 'fechar' })
})

test('menu radial: texto do realce para leitor de tela', () => {
  assert.equal(radial.textoDoRealce('Excluir', 2, 3), 'Excluir, 3 de 3')
})

// ───────── Linha clicável da TabelaExpansivel ─────────
test('linha clicável: clique em célula comum abre', () => {
  const l = { contains: (x) => x === a }
  const a = { closest: () => null }
  assert.equal(linha.cliqueAbreALinha(a, l), true)
})

test('linha clicável: clique em botão, link ou menu de dentro da linha não abre', () => {
  const botao = {}
  const a = { closest: () => botao }
  const l = { contains: (x) => x === a || x === botao }
  assert.equal(linha.cliqueAbreALinha(a, l), false)
})

test('linha clicável: evento que sobe por portal (alvo fora da linha no DOM) não abre', () => {
  const a = { closest: () => null }
  const l = { contains: () => false }
  assert.equal(linha.cliqueAbreALinha(a, l), false)
  assert.equal(linha.cliqueAbreALinha(null, l), false)
})

test('linha clicável: o seletor cobre botão, link, campo, menu e o atributo de exceção', () => {
  for (const parte of ['button', 'a[href]', 'input', 'select', 'textarea', '[role="menuitem"]', '[data-linha-ignorar]']) {
    assert.ok(linha.SELETOR_DE_CONTROLE.includes(parte), parte)
  }
})

test('linha clicável: Enter e Espaço só com o foco na própria linha', () => {
  const l = {}
  assert.equal(linha.teclaAbreALinha('Enter', l, l), true)
  assert.equal(linha.teclaAbreALinha(' ', l, l), true)
  assert.equal(linha.teclaAbreALinha('Enter', {}, l), false)
  assert.equal(linha.teclaAbreALinha('a', l, l), false)
})

// ───────── Casca: versão, impressão, tutorial ─────────
test('versão do menu: aceita com e sem "v", mostra um só', () => {
  assert.equal(casca.numeroDaVersao('0.2'), '0.2')
  assert.equal(casca.numeroDaVersao('v0.2'), '0.2')
  assert.equal(casca.numeroDaVersao('V1.4.0'), '1.4.0')
  assert.equal(casca.numeroDaVersao(' v2 '), '2')
  assert.equal(casca.numeroDaVersao('beta'), 'beta')
})

const raiz = (classes) => {
  const c = new Set(classes)
  return { classList: { contains: (x) => c.has(x), remove: (x) => c.delete(x), add: (x) => c.add(x) }, _c: c }
}

test('impressão: tira o tema escuro e devolve depois', () => {
  const r = raiz(['dark', 'x'])
  const restaurar = casca.prepararImpressaoClara(r)
  assert.equal(r._c.has('dark'), false)
  assert.equal(r._c.has('x'), true)
  restaurar()
  assert.equal(r._c.has('dark'), true)
})

test('impressão: no tema claro não mexe em nada e não cria a classe depois', () => {
  const r = raiz([])
  casca.prepararImpressaoClara(r)()
  assert.equal(r._c.has('dark'), false)
})

test('tutorial: Tab dá a volta nas pontas, Shift+Tab também, foco fora entra pelo lado certo', () => {
  assert.equal(casca.indiceDoFocoNoTab(4, 3, false), 0)
  assert.equal(casca.indiceDoFocoNoTab(4, 0, true), 3)
  assert.equal(casca.indiceDoFocoNoTab(4, 1, false), 2)
  assert.equal(casca.indiceDoFocoNoTab(4, -1, false), 0)
  assert.equal(casca.indiceDoFocoNoTab(4, -1, true), 3)
  assert.equal(casca.indiceDoFocoNoTab(0, -1, false), -1)
})

const JANELA = { largura: 375, altura: 667 }
const caixa = (top, bottom) => ({ top, bottom, left: 16, right: 359, width: 343, height: bottom - top })

test('tutorial: alvo que não deixa lugar nem acima nem abaixo não é coberto pelo meio (cartão encosta no pé ou no alto)', () => {
  const alvo = caixa(95, 565)
  const pos = casca.posicaoDoCartao(alvo, 343, 210, JANELA)
  assert.notEqual(pos.top, '50%')
  assert.equal(pos.transform, 'none')
  const topo = parseFloat(pos.top)
  const cobertura = Math.max(0, Math.min(alvo.bottom, topo + 210) - Math.max(alvo.top, topo))
  // O cartão centrado cobriria 210 px do alvo; encostado cobre menos.
  assert.ok(cobertura < 210, `cobertura ${cobertura}`)
})

test('tutorial: alvo na metade de cima manda o cartão para o pé; alvo na de baixo, para o alto', () => {
  const emCima = casca.posicaoDoCartao(caixa(60, 330), 343, 340, JANELA)
  assert.equal(parseFloat(emCima.top), 667 - 340 - 16)
  const emBaixo = casca.posicaoDoCartao(caixa(330, 620), 343, 340, JANELA)
  assert.equal(parseFloat(emBaixo.top), 16)
})

test('tutorial: com lugar embaixo ou em cima o cartão segue ao lado do alvo, com seta', () => {
  assert.equal(casca.posicaoDoCartao(caixa(100, 140), 343, 210, JANELA).seta, 'cima')
  assert.equal(casca.posicaoDoCartao(caixa(500, 540), 343, 210, JANELA).seta, 'baixo')
})

test('tutorial: rolagem para liberar o alvo', () => {
  assert.equal(casca.rolagemParaLiberarOAlvo({ top: 100, bottom: 300 }, 210, 667), 0)
  // pé do alvo passa do limite (667-210-32 = 425): rola a diferença
  assert.equal(casca.rolagemParaLiberarOAlvo({ top: 250, bottom: 500 }, 210, 667), 75)
  // alvo grande demais: alinha o topo no mínimo
  assert.equal(casca.rolagemParaLiberarOAlvo({ top: 200, bottom: 800 }, 210, 667), 128)
  // topo escondido sob o cabeçalho
  assert.equal(casca.rolagemParaLiberarOAlvo({ top: 20, bottom: 120 }, 210, 667), -52)
})

// ───────── Gráfico: alvo de clique e toque ─────────
test('gráfico: pilha vertical só expande a base do primeiro e o topo do último segmento', () => {
  const [a, b, c] = [0, 1, 2].map((i) => grafico.expansaoDoSegmento('pilha-vertical', i, 3))
  assert.match(a, /after:-bottom-\[6px\]/)
  assert.match(a, /after:top-0/)
  assert.match(b, /after:top-0/)
  assert.match(b, /after:bottom-0/)
  assert.doesNotMatch(b, /\[6px\]\s*$/)
  assert.match(c, /after:-top-\[6px\]/)
  assert.match(c, /after:bottom-0/)
})

test('gráfico: segmento único cresce nas duas pontas; grupo vertical nunca na horizontal', () => {
  const unico = grafico.expansaoDoSegmento('pilha-vertical', 0, 1)
  assert.match(unico, /after:-top-\[6px\]/)
  assert.match(unico, /after:-bottom-\[6px\]/)
  assert.doesNotMatch(grafico.expansaoDoSegmento('grupo-vertical', 0, 2), /inset-x-\[|-inset-x/)
  assert.match(grafico.expansaoDoSegmento('horizontal', 0, 2), /after:-inset-y-\[2px\]/)
})

test('gráfico: só toque e caneta abrem a nota; mouse e teclado não', () => {
  assert.equal(grafico.cliqueEhDeToque({ pointerType: 'touch' }), true)
  assert.equal(grafico.cliqueEhDeToque({ pointerType: 'pen' }), true)
  assert.equal(grafico.cliqueEhDeToque({ pointerType: 'mouse' }), false)
  assert.equal(grafico.cliqueEhDeToque({ pointerType: '' }), false)
  assert.equal(grafico.cliqueEhDeToque(null), false)
})

// ───────── Contraste: texto de pill ─────────
test('pill: texto branco quando passa de 4,5:1, escuro quando o branco reprova, nulo para token', () => {
  assert.equal(contraste.corDoTextoSobre('#004B9B'), '#ffffff')
  assert.equal(contraste.corDoTextoSobre('#7B8C96'), '#0b1b33') // branco sobre ele: 3,48:1
  assert.equal(contraste.corDoTextoSobre('#F6921E'), '#0b1b33')
  assert.equal(contraste.corDoTextoSobre('var(--x)'), null)
  assert.equal(contraste.corDoTextoSobre('#fff'), '#0b1b33')
})

test('contraste: fórmula WCAG (branco sobre preto 21:1; mesma cor 1:1)', () => {
  const b = contraste.lerHex('#ffffff')
  const p = contraste.lerHex('#000000')
  assert.ok(Math.abs(contraste.razaoDeContraste(b, p) - 21) < 1e-9)
  assert.equal(contraste.razaoDeContraste(b, b), 1)
})

// ───────── --color-fg-muted: 4,5:1 nas três superfícies, nos dois temas ─────────
const css = readFileSync(join(RAIZ, 'src/styles/globals.css'), 'utf8')
function valorDe(bloco, nome) {
  const i = css.indexOf(bloco)
  const fim = css.indexOf('\n  }', i)
  const m = css.slice(i, fim).match(new RegExp(`${nome}:\\s*([^;]+);`))
  return m && m[1].trim()
}
const NEUTRO = { '--color-fips-neutral-25': '#fbfdff', '--color-fips-neutral-50': '#f5f8fc' }
const resolve = (v) => NEUTRO[(v.match(/var\((--[\w-]+)\)/) || [])[1]] ?? v

for (const [tema, bloco] of [['claro', '  :root {\n    color-scheme: light'], ['escuro', '  .dark {\n    color-scheme: dark']]) {
  test(`--color-fg-muted, tema ${tema}: 4,5:1 ou mais sobre surface, surface-soft e surface-muted`, () => {
    const i = css.indexOf(bloco)
    assert.notEqual(i, -1)
    const trecho = css.slice(i, css.indexOf('\n  }', i))
    const pega = (n) => resolve(trecho.match(new RegExp(`${n}:\\s*([^;]+);`))[1].trim())
    const fg = contraste.lerHex(pega('--color-fg-muted'))
    for (const s of ['--color-surface', '--color-surface-soft', '--color-surface-muted']) {
      const r = contraste.razaoDeContraste(fg, contraste.lerHex(pega(s)))
      assert.ok(r >= 4.5, `${s}: ${r.toFixed(3)}`)
    }
  })
}

test('asterisco de campo obrigatório usa a cor de texto de erro (4,5:1), não a de preenchimento', () => {
  const fonte = readFileSync(join(RAIZ, 'src/components/ui/field.tsx'), 'utf8')
  assert.match(fonte, /text-\[var\(--color-danger-text\)\]">\*</)
  assert.equal(valorDe(':root {\n    color-scheme: light', '--color-danger-text'), 'var(--color-danger-strong)')
})

// ───────── Render estático ─────────
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-rodada3')
let React, renderToStaticMarkup, M

before(async () => {
  const entrada = join(TMP, 'entrada.tsx')
  mkdirSync(TMP, { recursive: true })
  const a = (c) => join(RAIZ, c)
  writeFileSync(
    entrada,
    `export { ListingKpiRow } from '${a('src/components/composites/ListingKpiRow.tsx')}'\n` +
      `export { classesDoModal } from '${a('src/components/ui/modal-variants.ts')}'\n` +
      `export { PillFilter } from '${a('src/components/composites/PillFilter.tsx')}'\n` +
      `export { TabelaExpansivel } from '${a('src/components/composites/TabelaExpansivel.tsx')}'\n` +
      `export { TEXTO_PADRAO_DO_FILTRO } from '${a('src/components/composites/FilterDrawer.tsx')}'\n`,
  )
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, chunk.code)
  M = await import(pathToFileURL(arquivo).href)
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  ;({ renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href))
})

after(() => rmSync(TMP, { recursive: true, force: true }))

const Icone = () => null
const h = (C, props) => renderToStaticMarkup(React.createElement(C, props))
const card = (id, extra = {}) => ({ id, label: id, value: 1, subtitle: 's', icon: Icone, color: '#004B9B', ...extra })

test('KPI: cartão sem ação é div (sem foco nem clique); com ação é botão', () => {
  const saida = h(M.ListingKpiRow, {
    cards: [card('a', { filtravel: false }), card('b'), card('c', { filtravel: true })],
    onSelect() {},
    onClear() {},
  })
  assert.equal((saida.match(/<button/g) ?? []).length, 2)
  assert.equal((saida.match(/<div class="relative flex min-w-0 items-center/g) ?? []).length, 1)
})

test('KPI: cartão informativo nunca fica "selecionado", mesmo com focusId igual', () => {
  const saida = h(M.ListingKpiRow, { cards: [card('a', { filtravel: false })], focusId: 'a', onSelect() {}, onClear() {} })
  assert.doesNotMatch(saida, /ring-2/)
})

test('Modal: className com max-w do app não impede a tela cheia de ocupar 96% da janela', () => {
  const normal = M.classesDoModal({ size: 'lg', telaCheia: false, className: 'max-w-[1200px]' })
  assert.match(normal, /max-w-\[1200px\]/)
  const cheia = M.classesDoModal({ size: 'lg', telaCheia: true, className: 'max-w-[1200px]' })
  assert.match(cheia, /max-w-\[96vw\]/)
  assert.doesNotMatch(cheia, /max-w-\[1200px\]/)
  assert.match(cheia, /h-\[96dvh\]/)
  assert.match(cheia, /w-\[96vw\]/)
})

test('Modal: className do consumidor para outras coisas continua valendo em tela cheia', () => {
  assert.match(M.classesDoModal({ telaCheia: true, className: 'dark' }), /(^| )dark( |$)/)
})

test('FilterDrawer: texto padrão é neutro, sem a palavra OPAs', () => {
  assert.doesNotMatch(M.TEXTO_PADRAO_DO_FILTRO, /OPA/i)
  assert.equal(M.TEXTO_PADRAO_DO_FILTRO, 'Refine os resultados pelos campos abaixo')
})

test('pills: ativo com cor clara leva texto escuro; cor escura leva branco; sem cor, a classe de sempre', () => {
  const opcoes = [
    { value: 'a', label: 'Média', color: '#F6921E' },
    { value: 'b', label: 'Alta', color: '#004B9B' },
    { value: 'c', label: 'Baixa' },
  ]
  const so = (v) => h(M.PillFilter, { options: opcoes, value: v, onChange() {} })
  assert.match(so('a'), /background:#F6921E;color:#0b1b33/)
  assert.match(so('b'), /background:#004B9B;color:#ffffff/)
  assert.match(so('c'), /bg-\[var\(--color-primary\)\] text-white/)
})

const COLUNAS = [{ id: 'n', titulo: 'Número', celula: (l) => l.n }]
const tabela = (extra) =>
  h(M.TabelaExpansivel, {
    rotulo: 't',
    colunas: COLUNAS,
    linhas: [{ id: '1', n: 'X1' }],
    chave: (l) => l.id,
    renderDetalhe: () => null,
    ...extra,
  })

test('tabela: com aoClicarLinha a linha ganha foco e cursor; sem ela, nada muda', () => {
  const com = tabela({ aoClicarLinha() {} })
  assert.match(com, /<tr[^>]*tabindex="0"[^>]*cursor-pointer|<tr[^>]*cursor-pointer[^>]*tabindex="0"/)
  const sem = tabela({})
  assert.doesNotMatch(sem, /<tr[^>]*tabindex/)
  assert.doesNotMatch(sem, /<tr[^>]*cursor-pointer/)
})
