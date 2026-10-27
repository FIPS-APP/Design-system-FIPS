/**
 * Regras de governança do eslint.config.js (FIPS-1196, fatia da cor literal e da pasta ui/).
 * Roda o ESLint de verdade sobre trechos de código com o caminho de um arquivo de
 * `src/components/` e confere o que cada regra acusa.
 * Rodar: npm run test:lint-governanca
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const eslint = new ESLint({ cwd: RAIZ })

async function acusacoes(codigo, arquivo, regra) {
  const [resultado] = await eslint.lintText(codigo, { filePath: join(RAIZ, arquivo) })
  return resultado.messages.filter((m) => m.ruleId === regra)
}

const COR = 'governance/no-literal-colors'
const OVERRIDE = 'governance/no-visual-overrides'

test('cor hexadecimal literal em src/components/ui/ é acusada', async () => {
  const achados = await acusacoes(`export const x = 'bg-[#ff0000] text-white'\n`, 'src/components/ui/sonda.tsx', COR)
  assert.equal(achados.length, 1)
  assert.match(achados[0].message, /#ff0000/)
})

test('rgb( e rgba( literais em src/components/ui/ são acusados, mesmo dentro de valor arbitrário do Tailwind', async () => {
  const achados = await acusacoes(
    `export const a = 'shadow-[0_1px_3px_rgba(1,2,3,0.4)]'\nexport const b = \`color: rgb(1, 2, 3)\`\n`,
    'src/components/ui/sonda.tsx',
    COR,
  )
  assert.equal(achados.length, 2)
})

test('token e var() não são acusados', async () => {
  const achados = await acusacoes(
    `export const x = 'bg-[var(--color-primary)] text-[var(--color-fg)] href-#secao'\n`,
    'src/components/ui/sonda.tsx',
    COR,
  )
  assert.equal(achados.length, 0)
})

test('cor listada em COLOR_EXCEPTIONS para o arquivo passa; a mesma cor em outro arquivo de ui/ não', async () => {
  const codigo = `export const x = 'shadow-[0_1px_3px_rgba(0,0,0,0.2)]'\n`
  assert.equal((await acusacoes(codigo, 'src/components/ui/switch.tsx', COR)).length, 0)
  assert.equal((await acusacoes(codigo, 'src/components/ui/sonda.tsx', COR)).length, 1)
})

test('pastas ainda não migradas (composites) ficam fora da regra de cor, de propósito', async () => {
  const achados = await acusacoes(`export const x = '#ff0000'\n`, 'src/components/composites/sonda.tsx', COR)
  assert.equal(achados.length, 0)
})

test('src/components/ui/ entra na regra de override visual', async () => {
  const achados = await acusacoes(
    `import { Button } from './button'\nexport const B = () => <Button className="rounded-none" />\n`,
    'src/components/ui/sonda.tsx',
    OVERRIDE,
  )
  assert.equal(achados.length, 1)
})
