/**
 * Select e ChipSelect: a rolagem da opção realçada não lança onde `scrollIntoView` não existe
 * (jsdom, que o vitest dos apps usa). Compila o auxiliar de verdade (build em memória com o vite
 * do repo) e o chama com um `document` sem o método; depois confere que os dois componentes
 * passam por ele, sem chamar `scrollIntoView` direto.
 * Rodar: npm run test:rolagem
 */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-rolagem-teclado')
let rolarOpcaoParaVista
const documentoOriginal = globalThis.document

before(async () => {
  const entrada = join(TMP, 'entrada.ts')
  mkdirSync(TMP, { recursive: true })
  writeFileSync(entrada, `export { rolarOpcaoParaVista } from '${join(RAIZ, 'src/lib/rolar-para-vista.ts')}'\n`)
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    build: { ssr: entrada, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  const chunk = lote.output.find((o) => o.type === 'chunk' && o.isEntry)
  const arquivo = join(TMP, 'modulo.mjs')
  writeFileSync(arquivo, chunk.code)
  ;({ rolarOpcaoParaVista } = await import(pathToFileURL(arquivo).href))
})

after(() => {
  globalThis.document = documentoOriginal
  rmSync(TMP, { recursive: true, force: true })
})

const comDocumento = (getElementById) => {
  globalThis.document = { getElementById }
}

test('elemento sem scrollIntoView (jsdom): não lança', () => {
  comDocumento(() => ({}))
  assert.doesNotThrow(() => rolarOpcaoParaVista('opt-2'))
})

test('elemento ausente: não lança', () => {
  comDocumento(() => null)
  assert.doesNotThrow(() => rolarOpcaoParaVista('opt-2'))
})

test('elemento com scrollIntoView (navegador): rola com block "nearest" e pede o id certo', () => {
  const chamadas = []
  const pedidos = []
  comDocumento((id) => {
    pedidos.push(id)
    return { scrollIntoView: (opcoes) => chamadas.push(opcoes) }
  })
  rolarOpcaoParaVista('opt-2')
  assert.deepEqual(pedidos, ['opt-2'])
  assert.deepEqual(chamadas, [{ block: 'nearest' }])
})

for (const arquivo of ['src/components/ui/select.tsx', 'src/components/ui/chip-select.tsx']) {
  test(`${arquivo}: rola pelo auxiliar guardado, sem chamar scrollIntoView direto`, () => {
    const fonte = readFileSync(join(RAIZ, arquivo), 'utf8')
    assert.match(fonte, /rolarOpcaoParaVista\(optId\(hi\)\)/)
    assert.doesNotMatch(fonte, /scrollIntoView/)
  })
}
