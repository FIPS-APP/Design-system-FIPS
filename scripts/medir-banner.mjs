// Mede o banner de página em claro e escuro, a 1440 e a 375 px.
// Uso: node scripts/medir-banner.mjs <url> [--chrome=/caminho/do/chrome]
//        [--tema-chave=fips-theme] [--ls=chave=valor] [--n=2 | --todos] [--json]
// Precisa de playwright instalado no projeto. O DS não o traz no package.json:
// instale sem salvar (npm i --no-save playwright). Sai com código 1 se algum critério falhar.
//
// Critérios (aceite da issue do PageHeader):
//  1. exatamente um h1 na página e ele é o título do banner;
//  2. contraste do pior ponto do fundo atrás de cada texto: >= 4,5 (>= 3 só para texto grande);
//  3. ícone do tile >= 3;
//  4. o banner e o texto dele não passam da largura da janela nem da borda do banner (a rolagem da página é só informada: vem do site, não do banner);
//  4b. coluna do título com pelo menos 200 px (--coluna-min=N muda);
//  4c. com ponteiro de toque (a 375), todo botão do banner com pelo menos 44 px de altura;
//  5. título fora da fonte de reserva (Open Sans).
//
// Opções (todas opcionais; sem elas o comportamento é o do aceite):
//  --tema-chave=K  além da classe dark no html, grava K=dark|light no localStorage antes de abrir
//                  a página (apps que guardam o tema lá; a do DS é fips-theme).
//  --ls=K=V        grava K=V no localStorage antes de abrir a página (pode repetir; ex.: tour concluído,
//                  no DS fips_ds_tour_v1=completed).
//  --n=N           mede o N-ésimo banner da página (1 por padrão, o primeiro).
//  --todos         mede todos os banners da página. Só o primeiro precisa ser h1: a página tem um h1 só.
//  --seletor=CSS   só considera banner o elemento que casa com o seletor (ex.: .fips-page-header__banner).
//  --coluna-min=N  mínimo da coluna do título em px (200 por padrão).
//  --fundo-claro=TXT, --fundo-escuro=TXT  o fundo do banner começa por TXT; --tile-alfa=N opacidade do fundo do tile.
//  --json          acrescenta uma linha JSON por cenário, para quem quer tabular os números.
import { chromium } from 'playwright'

const url = process.argv[2]
if (!url) { console.error('uso: node medir-banner.mjs <url>'); process.exit(2) }
const opt = (nome) => (process.argv.find((a) => a.startsWith(`--${nome}=`)) || '').slice(nome.length + 3) || undefined
const chrome = opt('chrome')
const temaChave = opt('tema-chave')
const lsItens = process.argv.filter((a) => a.startsWith('--ls=')).map((a) => { const s = a.slice(5), i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)] })
const todos = process.argv.includes('--todos')
const nUnico = Number(opt('n') || 1)
//  --seletor=CSS   só considera como banner o elemento que casa com o seletor (ex.: .fips-page-header__banner).
const seletor = opt('seletor')
//  --fundo-claro=TXT / --fundo-escuro=TXT  o background-image do banner tem de começar assim (direção e cores do padrão).
//  --tile-alfa=N   o fundo do tile tem de ter essa opacidade (0,10 no padrão), com tolerância de 0,01.
const fundoEsperado = { claro: opt('fundo-claro'), escuro: opt('fundo-escuro') }
const tileAlfa = opt('tile-alfa') === undefined ? null : Number(opt('tile-alfa'))
const saidaJson = process.argv.includes('--json')
// Coluna do título: o defeito medido nos apps era 82 a 94 px a 375 (título em 3 linhas). Abaixo disto falha.
const COLUNA_MIN = Number(opt('coluna-min') || 200)

const achar = ([n, seletor]) => {
  const px = (v) => parseFloat(v) || 0
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } }
  const candidatos = [...document.querySelectorAll('body *')].filter((e) => {
    if (seletor && !e.matches(seletor)) return false
    const c = getComputedStyle(e), r = e.getBoundingClientRect()
    return c.backgroundImage.includes('gradient') && r.width > 280 && r.height > 40 && r.height < 420 && e.querySelector('h1, h2, h3')
  })
  if (n === 0) return candidatos.length
  const banner = candidatos[n - 1]
  if (!banner) return null
  // limpa o que a medida do banner anterior deixou (texto transparente e ícones escondidos)
  document.querySelectorAll('style[data-medir-estilo]').forEach((e) => e.remove())
  document.querySelectorAll('[data-medir-oculto]').forEach((e) => { e.style.visibility = ''; e.removeAttribute('data-medir-oculto') })
  document.querySelectorAll('[data-medir]').forEach((e) => e.removeAttribute('data-medir'))
  document.querySelectorAll('[data-medir-titulo]').forEach((e) => e.removeAttribute('data-medir-titulo'))
  banner.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' })
  const emBotao = (e) => !!e.closest('button, a[role="button"]')
  const todosEl = [...banner.querySelectorAll('*')]
  const tit = banner.querySelector('h1, h2, h3')
  const pos = todosEl.indexOf(tit)
  const folha = (e) => e.children.length === 0 && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
  const eyebrow = todosEl.slice(0, pos).reverse().find((e) => folha(e) && !emBotao(e)) || null
  const desc = todosEl.slice(pos + 1).find((e) => folha(e) && !emBotao(e) && e.textContent.trim().length >= 18) || null
  const svgs = todosEl.filter((e) => e.tagName.toLowerCase() === 'svg')
  const icone = svgs.find((s) => { const w = s.getBoundingClientRect().width; return w >= 12 && w <= 30 && !emBotao(s) && !s.closest('h1,h2,h3') }) || null
  let tile = null
  if (icone) for (let p = icone.parentElement; p && p !== banner; p = p.parentElement) { const r = p.getBoundingClientRect(); if (r.width >= 30 && r.width <= 64 && Math.abs(r.width - r.height) < 3) { tile = p; break } }
  const botoes = [...banner.querySelectorAll('button, a[role="button"]')]
  const linhas = (e) => {
    const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), out = []
    for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent.trim()) continue; const r = document.createRange(); r.selectNodeContents(n); for (const c of r.getClientRects()) if (c.width > 1 && c.height > 1) out.push({ x: c.x, y: c.y, w: c.width, h: c.height }) }
    return out
  }
  const item = (id, e) => { if (!e) return null; const c = getComputedStyle(e); return { id, tag: e.tagName.toLowerCase(), px: px(c.fontSize), peso: c.fontWeight, cor: c.color, rects: linhas(e) } }
  const itens = [item('titulo', tit), item('descricao', desc), item('eyebrow', eyebrow), ...botoes.map((b, i) => item('botao' + i, b))].filter(Boolean)
  banner.setAttribute('data-medir', '1'); tit.setAttribute('data-medir-titulo', '1')
  const cs = getComputedStyle(banner)
  return {
    caixa: box(banner), fundo: cs.backgroundImage, raio: cs.borderRadius, sombra: cs.boxShadow, padding: cs.padding,
    h1: document.querySelectorAll('h1').length, nivelDoTitulo: tit.tagName.toLowerCase(),
    tile: tile ? { ...box(tile), raio: getComputedStyle(tile).borderRadius, fundo: getComputedStyle(tile).backgroundColor, borda: getComputedStyle(tile).border } : null,
    icone: icone ? { ...box(icone), cor: getComputedStyle(icone).stroke !== 'none' ? getComputedStyle(icone).stroke : getComputedStyle(icone).color } : null,
    rolaLateral: document.documentElement.scrollWidth > window.innerWidth + 1,
    tituloW: (tit.parentElement || tit).getBoundingClientRect().width,
    botoesH: botoes.map((b) => b.getBoundingClientRect().height),
    textoFora: Math.max(0, ...itens.flatMap((i) => i.rects.map((r) => r.x + r.w - (box(banner).x + box(banner).w)))),
    extravasa: box(banner).x + box(banner).w > window.innerWidth + 1 || box(banner).x < -1,
    itens,
  }
}

const esconder = () => {
  const st = document.createElement('style')
  st.setAttribute('data-medir-estilo', '1')
  st.textContent = '[data-medir] * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important }'
  document.head.appendChild(st)
  document.querySelectorAll('[data-medir] svg').forEach((s) => { if (s.getBoundingClientRect().width < 40) { s.style.visibility = 'hidden'; s.setAttribute('data-medir-oculto', '1') } })
}

const amostrar = async ({ png, itens, recorte }) => {
  const bmp = await createImageBitmap(await (await fetch('data:image/png;base64,' + png)).blob())
  const cv = document.createElement('canvas'); cv.width = bmp.width; cv.height = bmp.height
  const ctx = cv.getContext('2d', { willReadFrequently: true }); ctx.drawImage(bmp, 0, 0)
  const c1 = document.createElement('canvas'); c1.width = c1.height = 1
  const x1 = c1.getContext('2d', { willReadFrequently: true })
  const cor = (s) => { x1.clearRect(0, 0, 1, 1); x1.fillStyle = '#000'; x1.fillStyle = s; x1.fillRect(0, 0, 1, 1); const d = x1.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255] }
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
  const razao = (a, b) => { const p = lum(a), q = lum(b); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05) }
  return itens.map((it) => {
    const fg = cor(it.cor); let min = 99
    for (const r0 of it.rects) {
      const rx0 = Math.max(r0.x, recorte.x), ry0 = Math.max(r0.y, recorte.y), rx1 = Math.min(r0.x + r0.w, recorte.x + recorte.w), ry1 = Math.min(r0.y + r0.h, recorte.y + recorte.h)
      if (rx1 - rx0 < 1 || ry1 - ry0 < 1) continue
      const w = Math.ceil(rx1 - rx0), h = Math.ceil(ry1 - ry0)
      const data = ctx.getImageData(Math.floor(rx0), Math.floor(ry0), w, h).data
      for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4, bg = [data[i], data[i + 1], data[i + 2]], a = fg[3]
        min = Math.min(min, razao([0, 1, 2].map((k) => fg[k] * a + bg[k] * (1 - a)), bg))
      }
    }
    return { id: it.id, minimo: min === 99 ? null : +min.toFixed(2) }
  })
}

const falhas = []
const browser = await chromium.launch({ headless: true, executablePath: chrome })
for (const tema of ['claro', 'escuro']) {
  for (const largura of [1440, 375]) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: largura > 600 ? 900 : 800 }, deviceScaleFactor: 1 })
    await ctx.addInitScript(([itens, chave, t]) => {
      try {
        for (const [k, v] of itens) localStorage.setItem(k, v)
        if (chave) localStorage.setItem(chave, t)
      } catch { /* sem localStorage */ }
    }, [lsItens, temaChave, tema === 'escuro' ? 'dark' : 'light'])
    const page = await ctx.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.evaluate((t) => { document.documentElement.classList.toggle('dark', t === 'escuro') }, tema)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    const total = await page.evaluate(achar, [0, seletor])
    const alvos = todos ? Array.from({ length: total }, (_, i) => i + 1) : [nUnico]
    if (!total) { falhas.push(`${tema} ${largura}: banner não achado`); await ctx.close(); continue }
    for (const n of alvos) {
      const m = await page.evaluate(achar, [n, seletor])
      const rotulo = `${tema} ${largura}${todos || nUnico > 1 ? ` banner ${n}/${total}` : ''}`
      if (!m) { falhas.push(`${rotulo}: banner não achado`); continue }
      let fonte = '?'
      try {
        const cdp = await ctx.newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable')
        const { root } = await cdp.send('DOM.getDocument')
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-medir-titulo]' })
        fonte = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.map((f) => f.familyName).join(', ')
        await cdp.detach()
      } catch { /* sem CDP */ }
      await page.evaluate(esconder)
      const png = (await page.screenshot({ type: 'png' })).toString('base64')
      const cont = await page.evaluate(amostrar, { png, itens: m.itens, recorte: m.caixa })
      const icon = m.icone ? (await page.evaluate(amostrar, { png, itens: [{ id: 'icone', cor: m.icone.cor, rects: [{ x: m.icone.x, y: m.icone.y, w: m.icone.w, h: m.icone.h }] }], recorte: m.caixa }))[0] : null
      console.log(`\n== ${rotulo}: altura ${m.caixa.h.toFixed(1)} px | título ${m.nivelDoTitulo} (${m.itens[0].px}px, ${m.itens[0].peso}) fonte: ${fonte} | h1 na página: ${m.h1} | coluna do título ${m.tituloW.toFixed(1)} px | rolagem da página: ${m.rolaLateral ? 'sim' : 'não'}`)
      console.log(`   fundo: ${m.fundo}`)
      console.log(`   raio: ${m.raio} | padding: ${m.padding} | tile: ${m.tile ? `${m.tile.w}x${m.tile.h} raio ${m.tile.raio}` : 'não achado'}`)
      for (const c of cont) {
        const it = m.itens.find((i) => i.id === c.id)
        const grande = it.px >= 24 || (it.px >= 18.66 && Number(it.peso) >= 700)
        const meta = c.id.startsWith('botao') ? null : grande ? 3 : 4.5
        const ok = meta === null || (c.minimo !== null && c.minimo >= meta)
        console.log(`   contraste ${c.id}: ${c.minimo} ${meta === null ? '(botão: informativo)' : ok ? `ok (meta ${meta})` : `ABAIXO de ${meta}`}`)
        if (!ok) falhas.push(`${rotulo}: ${c.id} ${c.minimo} < ${meta}`)
      }
      if (icon) { console.log(`   contraste icone: ${icon.minimo} ${icon.minimo >= 3 ? 'ok (meta 3)' : 'ABAIXO de 3'}`); if (icon.minimo < 3) falhas.push(`${rotulo}: icone ${icon.minimo} < 3`) }
      if (saidaJson) console.log('JSON ' + JSON.stringify({ rotulo, altura: +m.caixa.h.toFixed(1), largura: +m.caixa.w.toFixed(1), titulo: m.nivelDoTitulo, h1: m.h1, fonte, rolaLateral: m.rolaLateral, fundo: m.fundo, raio: m.raio, padding: m.padding, sombra: m.sombra, tile: m.tile, itens: m.itens.map((i) => ({ id: i.id, tag: i.tag, px: i.px, peso: i.peso, cor: i.cor })), contraste: Object.fromEntries([...cont.map((c) => [c.id, c.minimo]), ['icone', icon ? icon.minimo : null]]) }))
      const primeiro = n === 1
      if (primeiro && m.h1 !== 1) falhas.push(`${rotulo}: ${m.h1} h1 na página (esperado 1)`)
      if (primeiro && m.nivelDoTitulo !== 'h1') falhas.push(`${rotulo}: título do banner é ${m.nivelDoTitulo}`)
      if (!primeiro && m.nivelDoTitulo === 'h1') falhas.push(`${rotulo}: segundo h1 na página`)
      if (fundoEsperado[tema] && !m.fundo.startsWith(fundoEsperado[tema])) falhas.push(`${rotulo}: fundo ${m.fundo.slice(0, 70)} (esperado começar por ${fundoEsperado[tema]})`)
      if (tileAlfa !== null) {
        const a = m.tile && /(?:,|\/)\s*([\d.]+)\)$/.exec(m.tile.fundo)
        const alfa = a ? Number(a[1]) : null
        if (alfa === null || Math.abs(alfa - tileAlfa) > 0.01) falhas.push(`${rotulo}: fundo do tile com opacidade ${alfa} (esperado ${tileAlfa})`)
      }
      if (m.extravasa) falhas.push(`${rotulo}: o banner passa da largura da janela`)
      if (m.textoFora > 1) falhas.push(`${rotulo}: texto passa da borda do banner (${m.textoFora.toFixed(1)} px)`)
      if (m.tituloW < COLUNA_MIN) falhas.push(`${rotulo}: coluna do título com ${m.tituloW.toFixed(1)} px (mínimo ${COLUNA_MIN})`)
      if (/Open Sans/.test(fonte) && !/Saira/.test(fonte)) falhas.push(`${rotulo}: título em ${fonte} (fonte de reserva)`)
    }
    if (largura === 375) {
      // Toque: com ponteiro grosso (contexto com toque), todo botão do banner tem de ter 44 px de altura.
      const ctxT = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 })
      await ctxT.addInitScript(([itens, chave, t]) => {
        try { for (const [k, v] of itens) localStorage.setItem(k, v); if (chave) localStorage.setItem(chave, t) } catch { /* sem localStorage */ }
      }, [lsItens, temaChave, tema === 'escuro' ? 'dark' : 'light'])
      const pT = await ctxT.newPage()
      await pT.goto(url, { waitUntil: 'networkidle' })
      const grosso = await pT.evaluate(() => matchMedia('(pointer: coarse)').matches)
      if (!grosso) falhas.push(`${tema} 375 toque: o navegador não reportou pointer: coarse`)
      const total2 = await pT.evaluate(achar, [0, seletor])
      for (let n = 1; n <= total2; n++) {
        const m = await pT.evaluate(achar, [n, seletor])
        if (!m || !m.botoesH.length) continue
        const menor = Math.min(...m.botoesH)
        console.log(`   toque ${tema} 375 banner ${n}/${total2}: menor botão ${menor.toFixed(1)} px ${menor >= 44 ? 'ok (meta 44)' : 'ABAIXO de 44'}`)
        if (menor < 44) falhas.push(`${tema} 375 toque banner ${n}/${total2}: botão com ${menor.toFixed(1)} px (meta 44)`)
      }
      await ctxT.close()
    }
    await ctx.close()
  }
}
await browser.close()
console.log(falhas.length ? `\nFALHOU (${falhas.length}):\n- ${falhas.join('\n- ')}` : '\nOK: todos os critérios passaram')
process.exit(falhas.length ? 1 : 0)
