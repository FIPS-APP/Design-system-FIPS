/**
 * Listagens: AdminTablePagination (linhas por página), ListingFilterToolbar (textos próprios)
 * e TabelaExpansivel. Renderiza o componente de verdade (build em memória com o vite do repo,
 * depois react-dom/server) e lê o HTML.
 * Rodar: npm run test:listagens
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-listagens')
let React, renderToStaticMarkup, AdminTablePagination, ListingFilterToolbar, TabelaExpansivel

before(async () => {
  const entrada = join(TMP, 'entrada.tsx')
  mkdirSync(TMP, { recursive: true })
  writeFileSync(
    entrada,
    `export { AdminTablePagination } from '${join(RAIZ, 'src/components/ui/admin-listing.tsx')}'\n` +
      `export { ListingFilterToolbar } from '${join(RAIZ, 'src/components/composites/ListingFilterToolbar.tsx')}'\n` +
      `export { TabelaExpansivel } from '${join(RAIZ, 'src/components/composites/TabelaExpansivel.tsx')}'\n`,
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
  ;({ AdminTablePagination, ListingFilterToolbar, TabelaExpansivel } = await import(pathToFileURL(arquivo).href))
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  ;({ renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href))
})

after(() => rmSync(TMP, { recursive: true, force: true }))

const h = (C, props) => renderToStaticMarkup(React.createElement(C, props))
const noop = () => undefined

// ---------- AdminTablePagination ----------
const pag = (extra) =>
  h(AdminTablePagination, { page: 1, pageCount: 3, itemsPerPage: 10, totalItems: 27, onPageChange: noop, ...extra })

test('paginação: sem as props novas não há seletor e nada vaza para a div', () => {
  const saida = pag()
  assert.doesNotMatch(saida, /Linhas por página/)
  assert.doesNotMatch(saida, /itemsperpage/i)
})

test('paginação: com opções e callback mostra o grupo e marca a atual', () => {
  const saida = pag({ itemsPerPageOptions: [10, 25, 50], onItemsPerPageChange: noop })
  assert.match(saida, /role="group" aria-label="Linhas por página"/)
  assert.match(saida, /aria-pressed="true" aria-label="10 linhas por página"/)
  assert.match(saida, /aria-pressed="false" aria-label="25 linhas por página"/)
  assert.doesNotMatch(saida, /itemsperpage/i)
})

test('paginação: sem callback, ou com uma opção só, o seletor não aparece', () => {
  assert.doesNotMatch(pag({ itemsPerPageOptions: [10, 25] }), /Linhas por página/)
  assert.doesNotMatch(pag({ itemsPerPageOptions: [10], onItemsPerPageChange: noop }), /Linhas por página/)
})

test('paginação: tamanho atual fora da lista entra na lista, em ordem', () => {
  const saida = pag({ itemsPerPage: 15, itemsPerPageOptions: [10, 25], onItemsPerPageChange: noop })
  const ordem = [...saida.matchAll(/aria-label="(\d+) linhas por página"/g)].map((m) => m[1])
  assert.deepEqual(ordem, ['10', '15', '25'])
})

// ---------- ListingFilterToolbar ----------
const toolbar = (extra) =>
  h(ListingFilterToolbar, {
    filterActiveCount: 0, onOpenFilters: noop, scope: 'todos', onScopeChange: noop, countMinha: 1, countTodos: 2,
    search: '', onSearchChange: noop, periodLabel: 'Tudo', period: 'Tudo', onPeriodChange: noop, showPeriod: false,
    onShowPeriodChange: noop, dateStart: '', dateEnd: '', onDateStartChange: noop, onDateEndChange: noop,
    onApplyCustomPeriod: noop, canApplyCustomPeriod: false, ...extra,
  })

test('toolbar: sem as props novas mantém os textos do painel de OPAs', () => {
  const saida = toolbar()
  assert.match(saida, /Buscar OPAs por número, área, responsável, município…/)
  assert.match(saida, /aria-label="Buscar OPAs"/)
  assert.match(saida, /Minha Área/)
  assert.match(saida, /Toda jurisdição/)
  assert.match(saida, /aria-label="Alçada"/)
  assert.match(saida, /aria-label="2 OPAs"/)
  assert.match(saida, /aria-label="Exportar Excel"/)
  assert.match(saida, /aria-label="Exportar PDF"/)
})

test('toolbar: textos próprios substituem os de OPA e showExport={false} tira Excel e PDF', () => {
  const saida = toolbar({
    searchPlaceholder: 'Buscar inspeções…', scopeLabels: { minha: 'Minhas', todos: 'Todas', grupo: 'Recorte' },
    countUnit: 'inspeções', showExport: false,
  })
  assert.match(saida, /placeholder="Buscar inspeções…"/)
  assert.match(saida, /aria-label="Buscar"/)
  assert.match(saida, /Minhas/)
  assert.match(saida, /aria-label="Recorte"/)
  assert.match(saida, /aria-label="2 inspeções"/)
  assert.doesNotMatch(saida, /OPAs|Minha Área|Toda jurisdição|Exportar/)
})

// ---------- TabelaExpansivel ----------
const COLUNAS = [
  { id: 'n', titulo: 'Nº', celula: (l) => l.n, ordenavel: true },
  { id: 'a', titulo: 'Auditor', celula: (l) => l.a },
]
const LINHAS = [{ id: 'x1', n: 'INS-1', a: 'Ana' }, { id: 'x2', n: 'INS-2', a: 'Bia' }]
const tabela = (extra) =>
  h(TabelaExpansivel, {
    rotulo: 'Inspeções', colunas: COLUNAS, linhas: LINHAS, chave: (l) => l.id,
    renderDetalhe: (l) => React.createElement('p', null, `detalhe ${l.n}`), ...extra,
  })

test('tabela expansível: fechada, o botão diz aria-expanded="false" e não há painel', () => {
  const saida = tabela()
  assert.equal([...saida.matchAll(/aria-expanded="false"/g)].length, 2)
  assert.doesNotMatch(saida, /detalhe INS/)
  assert.match(saida, /<table [^>]*aria-label="Inspeções"/)
})

test('tabela expansível: aberta, aria-controls aponta para o painel que existe', () => {
  const saida = tabela({ expandidas: ['x2'] })
  assert.match(saida, /detalhe INS-2/)
  assert.doesNotMatch(saida, /detalhe INS-1/)
  const controls = saida.match(/aria-controls="([^"]+)"[^>]*>/g).map((s) => s.match(/aria-controls="([^"]+)"/)[1])
  const painel = saida.match(/<div id="([^"]+)" role="region"/)[1]
  assert.ok(controls.includes(painel))
  assert.match(saida, /aria-expanded="true"/)
})

test('tabela expansível: temDetalhe={false} tira o botão; ordenação vira aria-sort', () => {
  const saida = tabela({ temDetalhe: (l) => l.id === 'x1', ordenacao: { coluna: 'n', direcao: 'desc' }, aoOrdenar: noop })
  assert.equal([...saida.matchAll(/aria-expanded=/g)].length, 1)
  assert.match(saida, /aria-sort="descending"/)
})

test('tabela expansível: sem linhas mostra o estado vazio', () => {
  assert.match(tabela({ linhas: [], vazio: { titulo: 'Nada por aqui' } }), /Nada por aqui/)
})
