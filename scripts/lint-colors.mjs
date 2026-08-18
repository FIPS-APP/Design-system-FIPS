#!/usr/bin/env node
/**
 * Gate de cor crua.
 *
 * `governance/no-raw-color` é **erro** na biblioteca publicada e **warn** no resto
 * de `src/` (doc pages, chrome do site). Este script separa as duas coisas: falha
 * só nos erros e imprime a dívida restante, para o gate ser verde no dia 1 e ainda
 * assim mostrar o tamanho do buraco.
 *
 *   npm run lint:colors
 */
import { ESLint } from 'eslint'

const RULE = 'governance/no-raw-color'
const eslint = new ESLint()
const results = await eslint.lintFiles(['src'])

const errors = []
const debt = new Map()

for (const result of results) {
  const file = result.filePath.replace(`${process.cwd()}/`, '')
  for (const message of result.messages) {
    if (message.ruleId !== RULE) continue
    if (message.severity === 2) errors.push({ file, message })
    else debt.set(file, (debt.get(file) ?? 0) + 1)
  }
}

const debtTotal = [...debt.values()].reduce((sum, n) => sum + n, 0)

if (debtTotal > 0) {
  const top = [...debt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  console.log(`Dívida de cor crua (warn, fora da biblioteca): ${debtTotal} em ${debt.size} arquivos.`)
  for (const [file, count] of top) console.log(`  ${String(count).padStart(4)}  ${file}`)
  if (debt.size > top.length) console.log(`  … e mais ${debt.size - top.length} arquivos.`)
  console.log('')
}

if (errors.length > 0) {
  console.error(`${errors.length} cor(es) crua(s) na biblioteca — isso bloqueia:\n`)
  for (const { file, message } of errors) {
    console.error(`  ${file}:${message.line}:${message.column}  ${message.message}`)
  }
  process.exit(1)
}

console.log('Nenhuma cor crua na biblioteca publicada.')
