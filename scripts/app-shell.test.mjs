/**
 * Casca do app: lógica pura (preferências do menu, nomes, posição do cartão do tutorial, selo).
 * Importa o .ts direto (Node 22 remove os tipos). Rodar: node --test scripts/app-shell.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'

const raiz = new URL('..', import.meta.url).pathname
const {
  lerPreferencias,
  preferenciasPadrao,
  primeiroEUltimo,
  iniciaisDoNome,
  posicaoDoCartao,
  seloVisivel,
  textoDoContador,
} = await import(pathToFileURL(join(raiz, 'src/components/composites/app-shell-logica.ts')).href)

test('preferências: sem nada guardado vale o padrão (recolher sozinho em 3 s)', () => {
  assert.deepEqual(lerPreferencias(null), { recolherAuto: true, segundos: 3 })
  assert.deepEqual(lerPreferencias(''), preferenciasPadrao())
})

test('preferências: campo ausente cai no padrão sem engolir o outro (false não vira padrão)', () => {
  assert.deepEqual(lerPreferencias('{"recolherAuto":false}'), { recolherAuto: false, segundos: 3 })
  assert.deepEqual(lerPreferencias('{"segundos":10}'), { recolherAuto: true, segundos: 10 })
})

test('preferências: segundos fora de 1 a 30, tipo errado e JSON quebrado caem no padrão', () => {
  assert.equal(lerPreferencias('{"segundos":0}').segundos, 3)
  assert.equal(lerPreferencias('{"segundos":31}').segundos, 3)
  assert.equal(lerPreferencias('{"segundos":"5"}').segundos, 3)
  assert.equal(lerPreferencias('{"segundos":1}').segundos, 1)
  assert.equal(lerPreferencias('{"segundos":30}').segundos, 30)
  assert.deepEqual(lerPreferencias('{quebrado'), preferenciasPadrao())
  assert.deepEqual(lerPreferencias('null'), preferenciasPadrao())
})

test('preferências: o padrão do app (não o do DS) vale quando nada foi guardado', () => {
  assert.deepEqual(lerPreferencias(null, { recolherAuto: false, segundos: 8 }), { recolherAuto: false, segundos: 8 })
})

test('nome do chip: primeiro e último; uma palavra só fica inteira', () => {
  assert.equal(primeiroEUltimo('Fipinho Baixada Santista'), 'Fipinho Santista')
  assert.equal(primeiroEUltimo('  Maria   Souza '), 'Maria Souza')
  assert.equal(primeiroEUltimo('Madonna'), 'Madonna')
  assert.equal(primeiroEUltimo(''), '')
})

test('iniciais: primeira e última letra; uma palavra, as duas primeiras; vazio, interrogação', () => {
  assert.equal(iniciaisDoNome('Fipinho Baixada Santista'), 'FS')
  assert.equal(iniciaisDoNome('madonna'), 'MA')
  assert.equal(iniciaisDoNome('   '), '?')
})

const janela = { largura: 1440, altura: 900 }
const caixa = (top, left, width, height) => ({ top, left, width, height, right: left + width, bottom: top + height })

test('cartão do tutorial: sem alvo fica no centro', () => {
  const p = posicaoDoCartao(null, 420, 280, janela)
  assert.equal(p.top, '50%')
  assert.equal(p.seta, 'nenhuma')
})

test('cartão do tutorial: abaixo do alvo quando cabe, com a seta para cima', () => {
  const p = posicaoDoCartao(caixa(100, 600, 36, 36), 420, 280, janela)
  assert.equal(p.seta, 'cima')
  assert.equal(p.top, `${136 + 12 + 16}px`)
})

test('cartão do tutorial: sem lugar embaixo vai para cima, com a seta para baixo', () => {
  const p = posicaoDoCartao(caixa(800, 600, 36, 36), 420, 280, janela)
  assert.equal(p.seta, 'baixo')
  assert.equal(p.top, `${800 - 280 - 12 - 16}px`)
})

test('cartão do tutorial: nunca passa das bordas na horizontal', () => {
  const p = posicaoDoCartao(caixa(100, 1400, 36, 36), 420, 280, janela)
  assert.equal(p.left, `${1440 - 420 - 16}px`)
  const q = posicaoDoCartao(caixa(100, 0, 36, 36), 420, 280, janela)
  assert.equal(q.left, '16px')
})

test('cartão do tutorial: alvo que ocupa a janela inteira encosta o cartão na borda (rodada 3; antes caía no centro, sobre o alvo)', () => {
  const p = posicaoDoCartao(caixa(0, 0, 1440, 900), 420, 280, janela)
  assert.equal(p.transform, 'none')
  assert.equal(p.seta, 'nenhuma')
  assert.ok(p.top === '16px' || p.top === `${900 - 280 - 16}px`, p.top)
})

test('selo do menu: zero e vazio não aparecem; texto e número positivo aparecem', () => {
  assert.equal(seloVisivel(undefined), false)
  assert.equal(seloVisivel(0), false)
  assert.equal(seloVisivel(''), false)
  assert.equal(seloVisivel('  '), false)
  assert.equal(seloVisivel(3), true)
  assert.equal(seloVisivel('novo'), true)
})

test('contador: 99+ acima de 99', () => {
  assert.equal(textoDoContador(7), '7')
  assert.equal(textoDoContador(99), '99')
  assert.equal(textoDoContador(100), '99+')
})
