/**
 * Hooks de src/hooks e src/lib: useResetOnChange, useSyncedState e useIsClient.
 * Os dois primeiros ajustam estado durante a renderização, então o teste roda o hook
 * de verdade (build em memória com o vite do repo) sobre um `react` mínimo que refaz a
 * renderização enquanto houver setState nela, como o React faz. O useIsClient roda no
 * react-dom/server de verdade: no servidor ele tem de dar false.
 * Rodar: npm run test:hooks
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-hooks')

const REACT_MINIMO = `
let slots = []
let indice = 0
let sujo = false
export const motor = {
  zerar() { slots = [] },
  renderizar(fn) {
    let resultado
    for (let voltas = 0; ; voltas++) {
      if (voltas > 50) throw new Error('renderização sem fim')
      sujo = false
      indice = 0
      resultado = fn()
      if (!sujo) return resultado
    }
  },
}
export function useState(inicial) {
  const i = indice++
  if (!(i in slots)) slots[i] = typeof inicial === 'function' ? inicial() : inicial
  const definir = (v) => {
    const novo = typeof v === 'function' ? v(slots[i]) : v
    if (!Object.is(novo, slots[i])) { slots[i] = novo; sujo = true }
  }
  return [slots[i], definir]
}
export function useSyncExternalStore(_assinar, cliente) { return cliente() }
`

async function compilar(nome, entrada, alias) {
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    resolve: alias ? { alias } : undefined,
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, nome)
  writeFileSync(arquivo, chunk.code)
  return import(pathToFileURL(arquivo).href)
}

let motor, useStateMinimo, useResetOnChange, useSyncedState, useIsClientCliente, useIsClientServidor, React, renderToStaticMarkup

before(async () => {
  mkdirSync(TMP, { recursive: true })
  const falso = join(TMP, 'react-minimo.mjs')
  writeFileSync(falso, REACT_MINIMO)
  const hooks = join(TMP, 'hooks.ts')
  writeFileSync(
    hooks,
    `export { motor, useState as useStateMinimo } from '${falso}'\n` +
      `export { useResetOnChange } from '${join(RAIZ, 'src/hooks/useResetOnChange.ts')}'\n` +
      `export { useSyncedState } from '${join(RAIZ, 'src/hooks/useSyncedState.ts')}'\n` +
      `export { useIsClient } from '${join(RAIZ, 'src/lib/useIsClient.ts')}'\n`,
  )
  const m = await compilar('hooks-minimo.mjs', hooks, { react: falso })
  ;({ motor, useStateMinimo, useResetOnChange, useSyncedState, useIsClient: useIsClientCliente } = m)
  const real = join(TMP, 'is-client.ts')
  writeFileSync(real, `export { useIsClient } from '${join(RAIZ, 'src/lib/useIsClient.ts')}'\n`)
  ;({ useIsClient: useIsClientServidor } = await compilar('is-client-real.mjs', real))
  React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  ;({ renderToStaticMarkup } = await import(pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href))
})

after(() => rmSync(TMP, { recursive: true, force: true }))

// Modal que reinicia a seleção ao abrir, como o ExportModal e o ExportPreviewModal
const TODAS = ['a', 'b', 'c']
function modal(open) {
  const [selecao, setSelecao] = useStateMinimo([])
  useResetOnChange([open], () => { if (open) setSelecao(TODAS) })
  return { selecao, setSelecao }
}

test('useResetOnChange: roda o reset na primeira renderização e só quando as deps mudam', () => {
  motor.zerar()
  let chamadas = 0
  const passo = (deps) => motor.renderizar(() => useResetOnChange(deps, () => { chamadas++ }))
  passo([1, 'x'])
  assert.equal(chamadas, 1, 'primeira renderização')
  passo([1, 'x'])
  assert.equal(chamadas, 1, 'mesmas deps, array novo: não roda')
  passo([2, 'x'])
  assert.equal(chamadas, 2, 'uma dep mudou')
  passo([2, 'x', 'y'])
  assert.equal(chamadas, 3, 'número de deps mudou')
})

test('useResetOnChange: seleção do modal volta a todas as colunas ao reabrir', () => {
  motor.zerar()
  const r = (open) => motor.renderizar(() => modal(open))
  assert.deepEqual(r(true).selecao, TODAS, 'abriu')
  r(true).setSelecao(['a'])
  assert.deepEqual(r(true).selecao, ['a'], 'aberto e mexido: a escolha fica')
  assert.deepEqual(r(false).selecao, ['a'], 'fechado: não mexe')
  assert.deepEqual(r(true).selecao, TODAS, 'reabriu: volta a todas')
})

test('useSyncedState: sem prop o estado é livre', () => {
  motor.zerar()
  const r = (prop) => motor.renderizar(() => useSyncedState(prop, 'ini'))
  assert.equal(r(undefined)[0], 'ini')
  r(undefined)[1]('meu')
  assert.equal(r(undefined)[0], 'meu')
})

test('useSyncedState: com prop o estado acompanha quando ela muda', () => {
  motor.zerar()
  const r = (prop) => motor.renderizar(() => useSyncedState(prop, 'ini'))
  assert.equal(r('a')[0], 'a', 'começa na prop')
  r('a')[1]('local')
  assert.equal(r('a')[0], 'local', 'prop igual: a escolha local fica')
  assert.equal(r('b')[0], 'b', 'prop mudou: acompanha')
  assert.equal(r(undefined)[0], 'b', 'prop some: mantém o último valor')
})

test('useSyncedState: prop falsy mas definida (0) também acompanha', () => {
  motor.zerar()
  const r = (prop) => motor.renderizar(() => useSyncedState(prop, 9))
  assert.equal(r(5)[0], 5)
  assert.equal(r(0)[0], 0)
})

test('useIsClient: false no servidor, true no cliente', () => {
  const Probe = (hook) => () => React.createElement('i', null, String(hook()))
  assert.equal(renderToStaticMarkup(React.createElement(Probe(useIsClientServidor))), '<i>false</i>')
  assert.equal(motor.renderizar(() => useIsClientCliente()), true)
})
