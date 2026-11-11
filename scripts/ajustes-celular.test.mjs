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

test('SecaoNumerada: cabeçalho com recuo de 24 em qualquer largura do cartão', () => {
  // Coluna estreita a 1440 px e celular a 375 px: padL 24 (era 20 abaixo de @2xl). Manutenção leva-1: 24.
  const f = fonte('SecaoNumerada.tsx')
  const linha = f.split('\n').find((l) => l.includes("'flex items-center gap-3 px-"))
  assert.ok(linha, 'linha do cabeçalho não achada')
  assert.match(linha, /\bpx-6\b/)
  assert.match(linha, /\bpy-4\b/)
  assert.match(linha, /\bgap-3\b/)
  assert.doesNotMatch(linha, /\bpx-5\b/)
})

test('CartaoListagem: cabeçalho compacto no celular (14/12/12/12) e o de tela grande de sm em diante', () => {
  // 375 px: recuo 14/12/12/12 e espaço 12 (era 18/20/14/20 e 14); altura 145 para 137 no cartão de demonstração.
  // De sm em diante 18/20/14/20 e 14, como antes (1440 px: altura 81, sem mudança).
  const f = fonte('CartaoListagem.tsx')
  const linha = f.split('\n').find((l) => l.includes('flex flex-wrap items-center') && l.includes('border-b'))
  assert.ok(linha, 'linha do cabeçalho não achada')
  for (const c of ['gap-3', 'px-3', 'pb-3', 'pt-3.5', 'sm:gap-3.5', 'sm:px-5', 'sm:pb-3.5', 'sm:pt-[18px]']) {
    assert.ok(linha.split(/[\s"]+/).includes(c), `falta ${c}`)
  }
})
