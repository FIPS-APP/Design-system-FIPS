/**
 * Rodada 2 da 0.21.0: medidas que o QA byte a byte achou diferentes do Gestão OPA e da Manutenção.
 * Cada teste prende um valor medido na referência viva (a medida está no nome ou no comentário).
 * Renderiza o componente de verdade (build em memória + react-dom/server) e lê o HTML.
 * Rodar: node --test scripts/rodada2-medidas.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build, loadConfigFromFile } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-rodada2')
const C = (n) => join(RAIZ, 'src/components/composites/', n)
const ler = (rel) => readFileSync(join(RAIZ, rel), 'utf8')
let M, React, render

before(async () => {
  mkdirSync(TMP, { recursive: true })
  const entrada = join(TMP, 'entrada.tsx')
  writeFileSync(
    entrada,
    [
      `export * from '${C('HomeHero.tsx')}'`,
      `export * from '${C('SecaoHome.tsx')}'`,
      `export * from '${C('FaixaPilares.tsx')}'`,
      `export * from '${C('ListingKpiRow.tsx')}'`,
      `export * from '${C('ListingFilterToolbar.tsx')}'`,
      `export * from '${C('FilterBlock.tsx')}'`,
      `export * from '${C('CartaoListagem.tsx')}'`,
      `export * from '${C('Documento.tsx')}'`,
      `export * from '${join(RAIZ, 'src/components/ui/table.tsx')}'`,
      `export * from '${join(RAIZ, 'src/components/ui/admin-listing.tsx')}'`,
      `export * from '${join(RAIZ, 'src/components/brand/FipsLogo.tsx')}'`,
      `export { Sparkles } from 'lucide-react'`,
    ].join('\n'),
  )
  const saida = await build({
    root: RAIZ, configFile: false, logLevel: 'silent', esbuild: { jsx: 'automatic' },
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, lote.output.find((o) => o.type === 'chunk' && o.isEntry).code)
  M = await import(pathToFileURL(arquivo).href)
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  const { renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href)
  render = (Comp, props, ...filhos) => renderToStaticMarkup(React.createElement(Comp, props, ...filhos))
})
after(() => rmSync(TMP, { recursive: true, force: true }))

test('1. --shadow-card tem UMA declaração, a neutra medida no OPA e na Manutenção', () => {
  const css = ler('src/styles/globals.css')
  const decl = css.match(/--shadow-card:[^;]+;/g) ?? []
  assert.equal(decl.length, 1, `declarações: ${decl.join(' | ')}`)
  assert.match(decl[0], /0 2px 8px rgb\(15 23 42 \/ 0\.04\), 0 10px 24px rgb\(15 23 42 \/ 0\.06\)/)
  assert.doesNotMatch(css, /--shadow-card:[^;]*0, 75, 155/)
})

test('3. HomeHero: sem cor de fundo atrás da foto; o azul entra sem foto', () => {
  const classeDaSecao = (html) => html.match(/<section class="([^"]*)"/)[1]
  const comFoto = classeDaSecao(render(M.HomeHero, { titulo: 'T' }))
  assert.match(comFoto, /relative isolate/)
  assert.doesNotMatch(comFoto, /bg-\[var\(--color-fips-blue-950\)\]/)
  assert.match(classeDaSecao(render(M.HomeHero, { titulo: 'T', imagem: null })), /bg-\[var\(--color-fips-blue-950\)\]/)
})

test('4. SecaoHome: 8px entre as linhas sem ação (header em coluna); com ação 12px e pilha de 8px', () => {
  const sem = render(M.SecaoHome, { numero: 1, titulo: 'Sobre', subtitulo: 'x' })
  assert.match(sem, /<header class="flex min-w-0 flex-col gap-2">/)
  const com = render(M.SecaoHome, { numero: 2, titulo: 'Termos', acao: 'badge' })
  assert.match(com, /<header class="flex items-end justify-between gap-3">/)
  assert.match(com, /<div class="flex min-w-0 flex-col gap-2">/)
  assert.doesNotMatch(sem + com, /gap-1\.5/)
})

test('5. FaixaPilares: o quadradinho do ícone leva a sombra de cartão', () => {
  const s = render(M.FaixaPilares, { pilares: [{ id: 'o', marca: 'O', titulo: 'Observar', texto: 't', icone: M.Sparkles }] })
  assert.match(s, /<span aria-hidden="true" class="[^"]*bg-\[var\(--color-primary\)\][^"]*shadow-\[var\(--shadow-card\)\]/)
})

test('10. th de tabela em Saira (largura normal), não Saira Expanded', () => {
  const s = render(M.Table, { density: 'normal' }, React.createElement(M.TableHeader, null, React.createElement(M.TableRow, null, React.createElement(M.TableHead, null, 'Nº'))))
  assert.match(s, /font-\[family-name:var\(--font-saira\)\]/)
  assert.doesNotMatch(s, /var\(--font-heading\)/)
  const css = ler('src/styles/globals.css')
  assert.match(css, /--font-saira: 'Saira',/)
  const fontes = ler('src/styles/fontes-fips.css')
  assert.equal((fontes.match(/font-family: 'Saira';/g) ?? []).length, 1) // só o subset latin (custo em base64)
  assert.match(fontes, /font-family: 'Saira';[^}]*font-stretch: 100%/)
})

test('11. ListingKpiRow: sem título por padrão; com titulo e hint ele volta', () => {
  const cards = [{ id: 'a', label: 'A', value: 3, subtitle: 's', icon: M.Sparkles, color: 'var(--color-primary)' }]
  const sem = render(M.ListingKpiRow, { cards, onSelect() {}, onClear() {} })
  assert.doesNotMatch(sem, /<h2/)
  assert.doesNotMatch(sem, /Indicadores rápidos|clique para filtrar/)
  assert.match(sem, /^<div class="space-y-3">/)
  const com = render(M.ListingKpiRow, { cards, onSelect() {}, onClear() {}, titulo: 'Indicadores rápidos', hint: 'Clique.' })
  assert.match(com, /<h2[^>]*>Indicadores rápidos<\/h2>/)
  assert.match(com, /Clique\./)
  const foco = render(M.ListingKpiRow, { cards, onSelect() {}, onClear() {}, focusId: 'a' })
  assert.match(foco, /Limpar filtro/)
  assert.doesNotMatch(foco, /<h2/)
})

const BASE = {
  filterActiveCount: 0, onOpenFilters() {}, scope: 'minha', onScopeChange() {}, countMinha: 3, countTodos: 9, search: '',
  onSearchChange() {}, periodLabel: 'Tudo', period: 'Tudo', onPeriodChange() {}, showPeriod: false, onShowPeriodChange() {},
  dateStart: '', dateEnd: '', onDateStartChange() {}, onDateEndChange() {}, onApplyCustomPeriod() {}, canApplyCustomPeriod: false,
}

test('9. ListingFilterToolbar: rótulo Filtros some abaixo de md; escopos e mostrarEscopo', () => {
  const padrao = render(M.ListingFilterToolbar, BASE)
  assert.match(padrao, /<span class="max-md:sr-only">Filtros<\/span>/)
  assert.match(padrao, /Minha Área/)
  assert.match(padrao, /Toda jurisdição/)
  const terceiro = render(M.ListingFilterToolbar, { ...BASE, escopos: ['minha'] })
  assert.match(terceiro, /Minha Área/)
  assert.doesNotMatch(terceiro, /Toda jurisdição/)
  const nenhum = render(M.ListingFilterToolbar, { ...BASE, mostrarEscopo: false })
  assert.doesNotMatch(nenhum, /aria-label="Alçada"/)
  assert.doesNotMatch(nenhum, /Minha Área/)
  assert.doesNotMatch(render(M.ListingFilterToolbar, { ...BASE, escopos: [] }), /aria-label="Alçada"/)
})

test('17. FilterBlock: raio 12/24, padding 0 no cartão, faixa interna 14/18 com gap de 10px, busca de 34px', () => {
  const s = render(M.FilterBlock, { search: '', onSearchChange() {} })
  assert.match(s, /^<div class="rounded-\[12px_12px_12px_24px\] border/)
  assert.doesNotMatch(s.match(/^<div class="([^"]*)"/)[1], /\bp-[34]\b|sm:p-4/)
  assert.match(s, /<div class="flex min-w-0 flex-wrap items-center gap-2\.5 px-\[18px\] py-3\.5">/)
  assert.match(s, /<input[^>]*class="h-\[34px\]/)
})

test('17b. FilterBlock: abaixo de 640px a busca desce para a 2ª linha em largura total; de 640px em diante fica na linha', () => {
  const s = render(M.FilterBlock, { search: '', onSearchChange() {}, filters: 'x' })
  const caixa = s.match(/<div class="([^"]*)"><svg[^>]*lucide-search/)[1].split(/\s+/)
  for (const c of ['order-last', 'w-full', 'basis-full', 'sm:order-none', 'sm:w-auto', 'sm:flex-1', 'sm:min-w-[160px]']) {
    assert.ok(caixa.includes(c), `falta ${c}: ${caixa.join(' ')}`)
  }
  assert.ok(!caixa.includes('flex-1') && !caixa.includes('min-w-[160px]'), 'flex-1 e min-w sem prefixo prendem a busca na 1ª linha no celular')
})

test('18. AdminTablePagination: 11px, fundo suave, padding 10/16', () => {
  const s = render(M.AdminTablePagination, { page: 1, pageCount: 2, itemsPerPage: 10, totalItems: 12, onPageChange() {} })
  const raiz = s.match(/^<div class="([^"]*)"/)[1]
  for (const c of ['bg-[var(--color-surface-muted)]', 'text-[11px]', 'px-4', 'py-2.5']) assert.ok(raiz.includes(c), `falta ${c}: ${raiz}`)
  assert.ok(!raiz.includes('px-6'))
})

test('19. CartaoListagem: cabeçalho com 18px em cima e 14px embaixo de sm em diante (14/12/12/12 no celular)', () => {
  const s = render(M.CartaoListagem, { icone: M.Sparkles, titulo: 'Lista', quantidade: 2 }, 'corpo')
  assert.match(s, /border-b border-\[var\(--color-border\)\] px-3 pb-3 pt-3\.5 sm:gap-3\.5 sm:px-5 sm:pb-3\.5 sm:pt-\[18px\]/)
  assert.doesNotMatch(s, /px-5 py-4/)
})

test('14. FipsLogo variante branca: marca embutida (sem arquivo do app), 42px de altura; selo continua o padrão', () => {
  const b = render(M.FipsLogo, { variante: 'branca' })
  assert.match(b, /^<img src="data:image\/avif;base64,[A-Za-z0-9+/=]{500,}" alt="FIPS" class="block h-\[42px\] w-auto"/)
  const selo = render(M.FipsLogo, {})
  assert.match(selo, /src="\/fips-logo\.png"/)
  assert.match(selo, /bg-white/)
})

test('15. FaixaCategoriaDocumento: o contêiner não leva text-white (os filhos levam); a seção mantém', () => {
  const cat = render(M.FaixaCategoriaDocumento, { nome: 'Reta Métrica', contagem: '0/22' })
  assert.doesNotMatch(cat.match(/^<div[^>]*class="([^"]*)"/)[1], /text-white/)
  assert.match(cat, /<h4 class="[^"]*text-white/)
  assert.match(cat, /<span class="font-mono text-\[11px\] text-white\/90">0\/22<\/span>/)
  const sec = render(M.FaixaSecaoDocumento, { nome: 'Seção' })
  assert.match(sec.match(/^<div[^>]*class="([^"]*)"/)[1], /text-white/)
})

test('16. CSS do pacote sai em subcamadas: o plugin renomeia components e utilities e deixa theme e base', async () => {
  const carregado = await loadConfigFromFile({ command: 'build', mode: 'production' }, join(RAIZ, 'vite.config.lib.ts'))
  const plugin = carregado.config.plugins.flat().find((p) => p && p.name === 'fips-css-em-subcamadas')
  assert.ok(plugin, 'plugin ausente da config da library')
  const css = '@layer properties{a}@layer theme{:root{--x:1}}@layer base{*{b:1}}@layer components{.c{c:1}}@layer utilities{.grid-cols-1{d:1}}.fora{e:1}'
  const bundle = { 'styles.css': { type: 'asset', fileName: 'styles.css', source: css }, 'index.js': { type: 'chunk', fileName: 'index.js' } }
  plugin.generateBundle.handler.call({}, {}, bundle)
  const saida = bundle['styles.css'].source
  assert.match(saida, /@layer components\.ds-fips\{\.c/)
  assert.match(saida, /@layer utilities\.ds-fips\{\.grid-cols-1/)
  assert.match(saida, /@layer theme\{/)
  assert.match(saida, /@layer base\{/)
  assert.match(saida, /\.fora\{e:1\}/)
  assert.throws(() => plugin.generateBundle.handler.call({}, {}, { 'styles.css': { type: 'asset', fileName: 'styles.css', source: '@layer theme{a}' } }), /components/)
})
