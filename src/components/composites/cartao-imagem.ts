/**
 * Baixa um pedaço da tela como PNG, do jeito que ele está pintado, sem biblioteca: os estilos saem de
 * `getComputedStyle` (já resolvidos em `rgb(...)`, inclusive `color-mix()` e `var()`) e quem pinta é o próprio
 * navegador, por um `<foreignObject>` de SVG. Os gráficos do DS são HTML e SVG com tokens, então o clone leva
 * a aparência inteira. Só roda no navegador.
 *
 * Limites: imagem de outra origem sem CORS não entra (sai do clone, senão o canvas fica contaminado e o
 * `toBlob` falha); fonte é embutida a partir do `@font-face` das folhas da mesma origem (se falhar, o cartão
 * sai na fonte de sistema, legível).
 */

/** As propriedades que viajam. Lista curta de propósito: copiar as ~340 do `getComputedStyle` incharia o SVG. */
const PROPRIEDADES = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'background-color', 'background-image', 'background-size', 'background-position', 'background-repeat',
  'box-shadow', 'opacity', 'overflow', 'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'font-variant-numeric', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'text-decoration',
  'white-space', 'word-break', 'overflow-wrap', 'text-overflow', 'vertical-align', '-webkit-line-clamp',
  '-webkit-box-orient', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'align-content', 'justify-content', 'justify-items', 'row-gap', 'column-gap', 'order',
  'grid-template-columns', 'grid-template-rows', 'grid-column-start', 'grid-column-end', 'grid-row-start',
  'grid-row-end', 'object-fit', 'aspect-ratio', 'transform', 'transform-origin', 'fill', 'stroke', 'stroke-width',
  'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'fill-opacity', 'stroke-opacity', 'list-style-type',
] as const

function copiarEstilos(de: Element, para: Element): void {
  const lido = getComputedStyle(de)
  let texto = ''
  for (const prop of PROPRIEDADES) {
    const valor = lido.getPropertyValue(prop)
    if (valor) texto += `${prop}:${valor};`
  }
  // A caixa de borda medida fixa o tamanho (dentro do SVG não há o preflight que põe `border-box` em tudo).
  // Elemento em linha e filho de SVG não têm caixa própria para fixar.
  if (de instanceof HTMLElement && lido.display !== 'inline' && lido.display !== 'contents') {
    const caixa = de.getBoundingClientRect()
    if (caixa.width > 0 && caixa.height > 0) texto += `box-sizing:border-box;width:${caixa.width}px;height:${caixa.height}px;`
  }
  para.setAttribute('style', texto)
}

async function comoDataUri(url: string): Promise<string | null> {
  if (url.startsWith('data:')) return url
  try {
    const resposta = await fetch(url, { mode: 'cors' })
    if (!resposta.ok) return null
    const blob = await resposta.blob()
    return await new Promise<string>((ok, falha) => {
      const leitor = new FileReader()
      leitor.onload = () => ok(String(leitor.result))
      leitor.onerror = () => falha(new Error('falha ao ler a imagem'))
      leitor.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/** `@font-face` das folhas da página (só o bloco latino) com o arquivo em base64. Vazio se algo falhar. */
async function fontesComoCss(): Promise<string> {
  const blocos: string[] = []
  for (const folha of Array.from(document.styleSheets)) {
    let regras: CSSRuleList
    try {
      regras = folha.cssRules
    } catch {
      continue // folha de outra origem: não dá para ler
    }
    for (const regra of Array.from(regras)) {
      if (!(regra instanceof CSSFontFaceRule)) continue
      const faixa = regra.style.getPropertyValue('unicode-range')
      if (faixa && !/U\+0{1,4}(-|,|\s|$)/i.test(faixa)) continue // o latino começa em U+0000
      blocos.push(regra.cssText)
    }
  }
  const prontos = await Promise.all(
    blocos.map(async (bloco) => {
      const url = bloco.match(/url\(["']?([^"')]+)["']?\)/)?.[1]
      if (!url) return ''
      const dado = await comoDataUri(new URL(url, location.href).href)
      return dado ? bloco.replace(url, dado) : ''
    }),
  )
  return prontos.filter(Boolean).join('\n')
}

/**
 * Desenha `no` num PNG e baixa com `nomeArquivo`. Elementos com `data-sem-imagem` (o próprio botão de baixar)
 * ficam de fora. `escala` 2 mantém o arquivo nítido no zoom e na impressão.
 */
export async function baixarNoComoPng(no: HTMLElement, nomeArquivo: string, escala = 2): Promise<void> {
  const caixa = no.getBoundingClientRect()
  const largura = Math.ceil(caixa.width)
  const altura = Math.ceil(caixa.height)
  if (!largura || !altura) throw new Error('o cartão não está na tela para ser desenhado')

  const clone = no.cloneNode(true) as HTMLElement
  const origens = [no, ...Array.from(no.querySelectorAll('*'))]
  const copias = [clone, ...Array.from(clone.querySelectorAll('*'))]
  for (let i = 0; i < origens.length; i++) copiarEstilos(origens[i], copias[i])
  clone.querySelectorAll('[data-sem-imagem]').forEach((el) => el.remove())

  await Promise.all(
    Array.from(clone.querySelectorAll('img')).map(async (img) => {
      const dado = await comoDataUri(img.src)
      if (dado) img.setAttribute('src', dado)
      else img.remove()
    }),
  )

  clone.style.margin = '0'
  clone.style.position = 'static'
  clone.style.width = `${largura}px`
  clone.style.height = `${altura}px`

  const fontes = await fontesComoCss()
  const xml = new XMLSerializer().serializeToString(clone)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">` +
    `<foreignObject x="0" y="0" width="100%" height="100%">` +
    `<div xmlns="http://www.w3.org/1999/xhtml">${fontes ? `<style>${fontes}</style>` : ''}${xml}</div>` +
    `</foreignObject></svg>`

  const imagem = new Image()
  await new Promise<void>((ok, falha) => {
    imagem.onload = () => ok()
    imagem.onerror = () => falha(new Error('o navegador não conseguiu desenhar o cartão'))
    imagem.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  })

  const tela = document.createElement('canvas')
  tela.width = Math.round(largura * escala)
  tela.height = Math.round(altura * escala)
  const pincel = tela.getContext('2d')
  if (!pincel) throw new Error('canvas indisponível neste navegador')
  // Fundo opaco: o cartão tem cantos arredondados e, sem isto, o PNG sai transparente nos cantos.
  pincel.fillStyle = getComputedStyle(no).backgroundColor || '#ffffff'
  pincel.fillRect(0, 0, tela.width, tela.height)
  pincel.drawImage(imagem, 0, 0, tela.width, tela.height)

  const blob = await new Promise<Blob | null>((ok) => tela.toBlob(ok, 'image/png'))
  if (!blob) throw new Error('não deu para gerar o arquivo')
  const url = URL.createObjectURL(blob)
  const ancora = document.createElement('a')
  ancora.href = url
  ancora.download = nomeArquivo
  document.body.appendChild(ancora)
  ancora.click()
  ancora.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
