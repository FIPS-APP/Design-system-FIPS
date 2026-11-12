/**
 * Rótulo da estação "Segurança" no LoginDsShell: texto mínimo de 4,5:1 (WCAG 1.4.3)
 * sobre o fundo real da coluna institucional. A coluna é igual nos dois temas.
 * Fundo: pixel mais claro sob o rótulo, medido no navegador headless (18,68,117).
 * Rodar: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const fonte = readFileSync(join(RAIZ, 'src/components/composites/LoginDsShell.tsx'), 'utf8')
const css = readFileSync(join(RAIZ, 'src/styles/globals.css'), 'utf8')

const hex = (nome) => {
  const m = css.match(new RegExp(`${nome}:\\s*(#[0-9a-fA-F]{6})`))
  assert.ok(m, `${nome} não existe em globals.css`)
  return [1, 3, 5].map((i) => parseInt(m[1].slice(i, i + 2), 16))
}
const lum = (c) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
}
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const FUNDO_MEDIDO = [18, 68, 117]
const estacao = (nome) => {
  const i = fonte.indexOf(`nome: '${nome}'`)
  assert.notEqual(i, -1, `estação ${nome} não encontrada`)
  return fonte.slice(i, fonte.indexOf('},', i))
}

test('rótulo de Segurança usa token que passa de 4,5:1 sobre o fundo da coluna', () => {
  const m = estacao('Segurança').match(/rotulo:\s*'var\((--color-fips-[\w-]+)\)'/)
  assert.ok(m, 'Segurança sem token de rótulo')
  const c = contraste(hex(m[1]), FUNDO_MEDIDO)
  assert.ok(c >= 4.5, `${m[1]} mede ${c.toFixed(2)}:1`)
  assert.ok(contraste(hex('--color-fips-red-600'), FUNDO_MEDIDO) < 4.5, 'o vermelho do ponto deixou de ser o problema')
})

test('o rótulo usa o token de texto e as outras 4 estações seguem na cor própria', () => {
  assert.match(fonte, /color: 'rotulo' in estacao \? estacao\.rotulo : estacao\.cor/)
  for (const n of ['Eficiência', 'Pessoas', 'Integridade', 'Colaboração']) {
    assert.doesNotMatch(estacao(n), /rotulo:/, `${n} não deve ter rótulo próprio`)
  }
})
