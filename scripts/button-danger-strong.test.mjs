/**
 * Button variant="dangerStrong" e size="xs".
 * Contraste do texto branco sobre o fundo nos dois temas: repouso, hover, foco (anel contra o cartão)
 * e desabilitado (opacidade composta sobre o cartão; isento do 1.4.3, medido e comparado com danger e primary); texto 4,5:1 (WCAG 1.4.3); anel 3:1 (1.4.11).
 * xs: 24 px de altura, medida na classe e no HTML renderizado; touch e md ficam como estavam.
 * Rodar: node --test scripts/button-danger-strong.test.mjs
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (c) => readFileSync(join(RAIZ, c), 'utf8')
const css = ler('src/styles/globals.css').replace(/\/\*[^]*?\*\//g, '')
const decl = (t) => Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
const bloco = (sel) => {
  const i = css.indexOf(`${sel} {`)
  assert.notEqual(i, -1, `bloco ${sel}`)
  return css.slice(i, css.indexOf('\n  }', i))
}
const iT = css.indexOf('@theme {')
const tema = css.slice(iT, css.indexOf('\n}', iT))
const TOKENS = {
  claro: { ...decl(tema), ...decl(bloco(':root')) },
  escuro: { ...decl(tema), ...decl(bloco(':root')), ...decl(bloco('.dark')) },
}
const resolver = (v, t, vistos = new Set()) => {
  const r = v.match(/^var\((--[\w-]+)\)$/)
  if (!r) return v
  assert.ok(!vistos.has(r[1]), `ciclo ${r[1]}`)
  vistos.add(r[1])
  assert.ok(TOKENS[t][r[1]], `token ${r[1]} não existe no tema ${t}`)
  return resolver(TOKENS[t][r[1]], t, vistos)
}
const hex = (v, t) => {
  const m = resolver(v, t).match(/^#([\da-f]{6})$/i)
  assert.ok(m, `cor não reconhecida: ${v}`)
  return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4), 16) }
}
const tok = (n, t) => hex(`var(${n})`, t)
const lum = ({ r, g, b }) => {
  const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const mix = (f, b, a) => ({ r: Math.round(f.r * a + b.r * (1 - a)), g: Math.round(f.g * a + b.g * (1 - a)), b: Math.round(f.b * a + b.b * (1 - a)) })
const BRANCO = { r: 255, g: 255, b: 255 }

let vite, V, B
before(async () => {
  vite = await createServer({
    root: RAIZ, configFile: false, logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom', esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true },
  })
  V = await vite.ssrLoadModule('/src/components/ui/button-variants.ts')
  B = await vite.ssrLoadModule('/src/components/ui/button.tsx')
})
after(async () => { await vite?.close() })

const cls = (o) => V.buttonVariants(o).split(/\s+/)
const tokenDe = (classes, prefixo) => {
  const c = classes.find((x) => x.startsWith(prefixo))
  assert.ok(c, `classe ${prefixo}… não encontrada`)
  return c.match(/var\((--[\w-]+)\)/)[1]
}
const opacidadeDesabilitado = () => Number(V.buttonVariants({}).match(/disabled:opacity-(\d+)/)[1]) / 100

for (const t of ['claro', 'escuro']) {
  const c = () => cls({ variant: 'dangerStrong' })
  const bg = () => tok(tokenDe(c(), 'bg-['), t)
  const bgHover = () => tok(tokenDe(c(), 'hover:bg-['), t)
  const cartao = () => tok('--color-surface', t)
  const registra = (rotulo, n) => console.log(`dangerStrong ${t} ${rotulo}: ${n.toFixed(2)}:1`)

  test(`dangerStrong ${t}: texto branco em repouso >= 4,5:1`, () => {
    assert.ok(c().includes('text-white'))
    const n = contraste(BRANCO, bg()); registra('repouso', n); assert.ok(n >= 4.5, n.toFixed(2))
  })
  test(`dangerStrong ${t}: hover >= 4,5:1`, () => {
    const n = contraste(BRANCO, bgHover()); registra('hover', n); assert.ok(n >= 4.5, n.toFixed(2))
  })
  test(`dangerStrong ${t}: foco, anel contra o cartão >= 3:1`, () => {
    assert.ok(cls({}).includes('focus-visible:ring-[var(--color-ring)]'))
    const n = contraste(tok('--color-ring', t), cartao()); registra('foco (anel)', n); assert.ok(n >= 3, n.toFixed(2))
  })
  // Desabilitado é isento do 1.4.3 (componente inativo). O Button inteiro usa opacity-55; aqui se mede o número
  // e se exige que a variante nova não fique pior que a danger e a primary, que já usam o mesmo desabilitado.
  test(`dangerStrong ${t}: desabilitado (opacidade composta sobre o cartão) não pior que danger e primary`, () => {
    const a = opacidadeDesabilitado()
    const medir = (nomeBg, cl) => contraste(mix(BRANCO, cartao(), a), mix(tok(tokenDe(cl, nomeBg), t), cartao(), a))
    const n = medir('bg-[', c()); registra('desabilitado', n)
    const d = medir('bg-[', cls({ variant: 'danger' })); const p = medir('bg-[', cls({ variant: 'primary' }))
    console.log(`  (referência ${t}: danger ${d.toFixed(2)}:1, primary ${p.toFixed(2)}:1)`)
    assert.ok(n >= Math.min(d, p), `${n.toFixed(2)} < ${Math.min(d, p).toFixed(2)}`)
  })
}

test('dangerStrong renderiza com as classes da variante', () => {
  const m = renderToStaticMarkup(React.createElement(B.Button, { variant: 'dangerStrong' }, 'Excluir'))
  assert.match(m, /bg-\[var\(--color-btn-danger-strong\)\]/)
  assert.match(m, /hover:bg-\[var\(--color-btn-danger-strong-hover\)\]/)
})

test('xs: altura de 24 px (h-6 e min-h-6), menor que sm', () => {
  const x = cls({ size: 'xs' })
  assert.ok(x.includes('h-6') && x.includes('min-h-6'))
  assert.ok(24 < 30 && cls({ size: 'sm' }).includes('h-[30px]'))
})
test('xs: fonte de 11 px, padding px-2.5, ícone de 12 px', () => {
  const x = cls({ size: 'xs' })
  for (const k of ['text-[11px]', 'px-2.5', '[&_svg]:size-3']) assert.ok(x.includes(k), k)
})
test('Button renderiza size="xs" com h-6', () => {
  const m = renderToStaticMarkup(React.createElement(B.Button, { size: 'xs' }, 'Filtrar'))
  assert.match(m, /class="[^"]*\bh-6\b[^"]*"/)
})
test('touch, md e lg não mudam', () => {
  assert.ok(cls({ size: 'touch' }).includes('h-12'))
  assert.ok(cls({ size: 'md' }).includes('h-9'))
  assert.ok(cls({ size: 'lg' }).includes('h-[42px]'))
})
