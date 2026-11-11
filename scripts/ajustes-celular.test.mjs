/**
 * Medidas do celular conferidas contra as referências vivas (375 px). Trava as classes de espaçamento
 * (o número medido no navegador está em cada comentário). Rodar: node --test scripts/ajustes-celular.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const raiz = new URL('..', import.meta.url).pathname
const fonte = (arq) => readFileSync(raiz + 'src/components/composites/' + arq, 'utf8')

test('AppHeader no celular: recuo 16, espaço 12 entre menu e logo, 6 entre os botões da direita', () => {
  // 375 px: botão de menu em x=16 (era 12), sino em x=159 (era 171); de sm em diante 24/12/10 como antes.
  const f = fonte('AppHeader.tsx')
  const linha = f.split('\n').find((l) => l.includes('flex h-14 items-center') && l.includes('border-b'))
  assert.ok(linha, 'linha do cabeçalho não achada')
  assert.match(linha, /\bgap-3\b/)
  assert.match(linha, /\bpx-4\b/)
  assert.match(linha, /\bsm:px-6\b/)
  assert.match(linha, /\bsm:gap-3\b/)
  assert.doesNotMatch(linha, /\bpx-3\b/)
  const dir = f.split('\n').find((l) => l.includes('ml-auto flex shrink-0 items-center'))
  assert.ok(dir, 'grupo da direita não achado')
  assert.match(dir, /\bgap-1\.5\b/)
  assert.match(dir, /\bsm:gap-2\.5\b/)
})
