/**
 * xlsx: versão corrigida e as chamadas que o pacote usa para gerar planilha.
 * A 0.18.5 tem GHSA-4r6h-8v6p-xvw6 (prototype pollution) e GHSA-5pgg-2g8v-p4x9 (ReDoS);
 * a correção está na 0.20.2 e só existe no CDN da SheetJS, não no npm.
 * Fica em devDependencies: nenhum export público usa o xlsx, e uma URL de CDN em
 * dependencies quebra o install do consumidor no npm 12 (EALLOWREMOTE).
 * Rodar: npm run test:xlsx
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')
const MINIMA = [0, 20, 2]
const versao = (v) => v.split('.').map(Number)
const nao_menor = (a, b) => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return true
}

test('package.json aponta o xlsx para o CDN da SheetJS, em versão corrigida, só em dev', () => {
  const pkg = JSON.parse(ler('package.json'))
  assert.equal(pkg.dependencies?.xlsx, undefined, 'xlsx não pode ir para dependencies')
  const spec = pkg.devDependencies.xlsx
  const m = spec.match(/^https:\/\/cdn\.sheetjs\.com\/xlsx-(\d+\.\d+\.\d+)\/xlsx-\1\.tgz$/)
  assert.ok(m, `xlsx em package.json: ${spec}`)
  assert.ok(nao_menor(versao(m[1]), MINIMA), `xlsx ${m[1]} abaixo de ${MINIMA.join('.')}`)
})

test('package-lock.json trava o xlsx em versão corrigida, com integridade sha512', () => {
  const entrada = JSON.parse(ler('package-lock.json')).packages['node_modules/xlsx']
  assert.ok(entrada, 'node_modules/xlsx ausente do lockfile')
  assert.ok(nao_menor(versao(entrada.version), MINIMA), `xlsx ${entrada.version} no lockfile, abaixo de ${MINIMA.join('.')}`)
  assert.match(entrada.integrity ?? '', /^sha512-/, 'xlsx sem integridade sha512 no lockfile')
})

test('as chamadas de exportData.ts geram uma planilha que volta a ser lida', () => {
  const XLSX = createRequire(import.meta.url)('xlsx')
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Nome', 'Valor'], ['a', 1]]), 'Dados')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Gerado em', 'hoje']]), 'Info')
  const bytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const lido = XLSX.read(bytes, { type: 'array' })
  assert.deepEqual(lido.SheetNames, ['Dados', 'Info'])
  assert.deepEqual(XLSX.utils.sheet_to_json(lido.Sheets.Dados, { header: 1 }), [['Nome', 'Valor'], ['a', 1]])
})
