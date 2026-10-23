// Teste do PageHeader sem navegador: renderiza o componente no servidor (SSR) e confere a estrutura,
// mais verificações estáticas do CSS. Complementa scripts/medir-banner.mjs, que mede no navegador
// (contraste, coluna do título a 375, alvo de 44 px). O repositório não tem suíte de testes: este
// script sai com código 1 se algum caso falhar.
// Uso: node scripts/testar-page-header.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const lerArq = (p) => readFileSync(raiz + p, 'utf8')
const falhas = []
let n = 0
const caso = (nome, ok, detalhe = '') => {
  n++
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${nome}${ok || !detalhe ? '' : ` (${detalhe})`}`)
  if (!ok) falhas.push(nome)
}
const conta = (html, re) => (html.match(re) || []).length

const vite = await createServer({
  root: raiz, configFile: false, plugins: [react()], appType: 'custom', logLevel: 'silent',
  server: { middlewareMode: true, hmr: false, ws: false },
})
try {
  const { PageHeader } = await vite.ssrLoadModule('/src/components/composites/PageHeader.tsx')
  const { PatternPanelHero } = await vite.ssrLoadModule('/src/components/composites/PatternPanelHero.tsx')
  const banner = await vite.ssrLoadModule('/src/components/composites/banner-shared.tsx')
  const pacote = await vite.ssrLoadModule('/src/index.ts')
  const render = (el) => renderToStaticMarkup(el)

  // 1. Nível do título
  const base = render(h(PageHeader, { title: 'Pedidos', description: 'Resumo da página', icon: h('i') }))
  caso('título é h1 por padrão', conta(base, /<h1[ >]/g) === 1)
  caso('nenhum outro título além do h1', conta(base, /<h[2-6][ >]/g) === 0)
  const h2 = render(h(PageHeader, { title: 'Pedidos', headingLevel: 2 }))
  caso('headingLevel=2 emite h2 e nenhum h1', conta(h2, /<h2[ >]/g) === 1 && conta(h2, /<h1[ >]/g) === 0)
  caso('o texto do título está dentro do h1', /<h1[^>]*>Pedidos<\/h1>/.test(base))

  // 2. Estrutura que a impressão e as âncoras dos apps usam
  const completo = render(h(PageHeader, {
    title: 'Pedidos', description: 'Resumo', eyebrow: 'Passo 2 de 4', info: h('span', { id: 'ajuda' }),
    actions: h('button', null, 'Novo'), actionsProps: { 'data-tour-step': 'banner-acoes' },
    'data-tour-step': 'banner', 'aria-label': 'Cabeçalho da página', className: 'meu-recuo', id: 'topo',
  }))
  caso('raiz tem a classe fips-page-header e repassa className', /^<div[^>]*class="[^"]*fips-page-header[^"]*meu-recuo/.test(completo))
  caso('raiz repassa data-* e aria-*', /^<div[^>]*data-tour-step="banner"/.test(completo) && /^<div[^>]*aria-label="Cabeçalho da página"/.test(completo))
  caso('raiz repassa id', /^<div[^>]*id="topo"/.test(completo))
  caso('slot de ações recebe data-* de actionsProps', /<div[^>]*data-tour-step="banner-acoes"[^>]*class="fips-page-header__acoes"/.test(completo) || /<div[^>]*class="fips-page-header__acoes"[^>]*data-tour-step="banner-acoes"/.test(completo))
  caso('o banner leva fips-banner-shell--content', /<div class="fips-banner-shell--content[^"]*fips-page-header__banner"/.test(completo))
  caso('trilhos são svg filho direto do banner', /fips-page-header__banner"><svg[^>]*fips-banner-junction/.test(completo) || /fips-page-header__banner"><svg/.test(completo))
  caso('eyebrow vem antes do título', completo.indexOf('Passo 2 de 4') > -1 && completo.indexOf('Passo 2 de 4') < completo.indexOf('<h1'))
  caso('eyebrow é só texto, sem pílula', !/rounded-full/.test(completo))
  caso('info fica depois do título, na mesma linha', completo.indexOf('id="ajuda"') > completo.indexOf('</h1>') && completo.indexOf('id="ajuda"') < completo.indexOf('fips-page-header__descricao'))
  const semAcao = render(h(PageHeader, { title: 'x' }))
  caso('sem ações não renderiza o slot', !/fips-page-header__acoes/.test(semAcao))
  caso('sem ícone não renderiza o tile', !/fips-banner-icon-box/.test(semAcao) && /fips-page-header--sem-icone/.test(semAcao))
  caso('edge="bleed" e compact viram classes', /fips-page-header--bleed/.test(render(h(PageHeader, { title: 'x', edge: 'bleed' }))) && /fips-page-header--compact/.test(render(h(PageHeader, { title: 'x', compact: true }))))
  const comStats = render(h(PageHeader, { title: 'x', stats: [{ label: 'TOTAL', value: 3 }] }))
  caso('stats renderizam chips e a classe --stats', /fips-page-header--stats/.test(comStats) && /TOTAL/.test(comStats))
  caso('descrição em string é p; em JSX é div', /<p class="fips-page-header__descricao"/.test(base) && /<div class="fips-page-header__descricao"/.test(render(h(PageHeader, { title: 'x', description: h('span', null, 'a') }))))

  // 3. Tile com as opacidades do padrão, só por token
  const estilo = banner.FIPS_BANNER_ICON_BOX_STYLE
  caso('tile: fundo a 10% do --color-accent', estilo.background === 'color-mix(in srgb, var(--color-accent) 10%, transparent)', estilo.background)
  caso('tile: borda a 19% do --color-accent', estilo.border === '1px solid color-mix(in srgb, var(--color-accent) 19%, transparent)', estilo.border)

  // 4. Apelido PatternPanelHero
  const ppH = render(h(PatternPanelHero, { title: 'Painel', subtitle: 'Resumo do painel', icon: h('i'), action: h('button', null, 'Ir'), badge: 'Passo 1', dataTutorial: 'page-hero' }))
  caso('PatternPanelHero emite h1', conta(ppH, /<h1[ >]/g) === 1 && conta(ppH, /<h2[ >]/g) === 0)
  caso('PatternPanelHero: subtitle vira descrição, action vira ações, badge vira eyebrow', /Resumo do painel/.test(ppH) && /fips-page-header__acoes/.test(ppH) && /fips-page-header__eyebrow[^>]*>Passo 1/.test(ppH))
  caso('PatternPanelHero: dataTutorial vira data-tutorial na raiz', /^<div[^>]*data-tutorial="page-hero"/.test(ppH))

  // 5. Exports do pacote
  for (const nome of ['PageHeader', 'PatternPanelHero', 'BannerJunctionLines', 'BannerIconBox', 'FIPS_BANNER_CONTENT_CLASS', 'FIPS_BANNER_PAGE_CLASS', 'FIPS_BANNER_ICON_BOX_STYLE', 'FIPS_BANNER_PILL_STYLE']) {
    caso(`@fips-app/ds-fips exporta ${nome}`, pacote[nome] !== undefined)
  }
} finally {
  await vite.close()
}

// 6. CSS: regras que não podem voltar
const css = lerArq('src/styles/globals.css')
const iniCss = css.indexOf('/* ─── PageHeader ───')
const bloco = css.slice(iniCss, css.indexOf('/* ─── Dark mode: hero banner das doc pages'))
caso('CSS do PageHeader encontrado', iniCss > 0 && bloco.length > 500)
caso('medida pela largura do cartão: container query de 560px', /container:\s*fips-page-header\s*\/\s*inline-size/.test(bloco) && /@container fips-page-header \(min-width:\s*560px\)/.test(bloco))
caso('sem media query de largura de janela no PageHeader (só ponteiro de toque)', !/@media\s*\((min|max)-width/.test(bloco))
caso('título: cor por token, sem hex', /\.fips-page-header__titulo\s*{[^}]*color:\s*var\(--color-white/.test(bloco))
caso('título: fonte do DS (--font-heading)', /\.fips-page-header__titulo\s*{[^}]*font-family:\s*var\(--font-heading\)/.test(bloco))
caso('título não vira coluna fixa (sem flex-basis/width em px)', !/\.fips-page-header__titulo\s*{[^}]*(?<![-\w])(width|flex-basis|flex)\s*:/.test(bloco))
caso('sem hex nem rgb literal no bloco do PageHeader (fora do var())', !/#[0-9a-fA-F]{3,8}\b/.test(bloco.replace(/var\([^)]*\)/g, '')) && !/rgba?\(/.test(bloco))
caso('sem transition-all', !/transition-all|transition:\s*all/.test(bloco) && !/transition-all/.test(lerArq('src/components/composites/PageHeader.tsx')) && !/transition-all/.test(lerArq('src/components/composites/banner-shared.tsx')))
caso('alvo de 44px nas ações com ponteiro de toque', /@media \(pointer: coarse\)\s*{\s*\.fips-page-header__acoes > \*\s*{\s*min-height:\s*44px/.test(bloco))
caso('tema escuro por .dark nos tokens do banner', /\.dark\s*{[^}]*--fips-banner-content-bg:\s*linear-gradient\(135deg,\s*#1e2a3a/.test(css))
caso('gradiente claro na direção do token (from > to > #001a4a)', /--fips-banner-content-bg:\s*linear-gradient\(\s*135deg,\s*var\(--color-gov-gradient-from\) 0%,\s*var\(--color-gov-gradient-to\) 60%,\s*#001a4a 100%/.test(css))
caso('--color-gov-gradient-from é #004B9B e -to é #002A68 no claro', /--color-gov-gradient-from:\s*#004B9B/i.test(css) && /--color-gov-gradient-to:\s*#002A68/i.test(css))
const expCss = lerArq('exports/pattern-panel-hero/page-header.css')
caso('exports/page-header.css traz a mesma regra de toque e o mesmo contêiner', /pointer: coarse/.test(expCss) && /container:\s*fips-page-header/.test(expCss))

console.log(`\n${n} casos, ${falhas.length} falha(s)`)
if (falhas.length) console.log('FALHOU:\n- ' + falhas.join('\n- '))
process.exit(falhas.length ? 1 : 0)
