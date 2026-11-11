/**
 * Regras de lint exportadas em `@fips-app/ds-fips/eslint` (eslint/index.js).
 * Rodar: node --test scripts/eslint-ds.test.mjs
 */
import { Linter } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'
import plugin from '../eslint/index.js'
import assert from 'node:assert/strict'

const linter = new Linter({ configType: 'flat' })
const cfg = [
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { governance: plugin },
    rules: {
      'governance/no-visual-overrides': 'error',
      'governance/no-invalid-ds-props': 'error',
      'governance/no-invented-header-chrome': 'error',
      'governance/no-invented-casca-shell': 'error',
    },
  },
]

function run(code, filename = 'App.tsx') {
  return linter.verify(code, cfg, { filename })
}

function assertHeaderChromeMessage(message) {
  assert.match(message, /fips-header-tile/, 'Mensagem deve citar fips-header-tile')
  assert.match(message, /0\.21\.0|casca cortada/, 'Mensagem deve citar versão DS ou casca cortada')
}

function assertCascaShellMessage(message, component = 'AppShell') {
  assert.match(message, new RegExp(component), `Mensagem deve citar ${component}`)
  assert.match(message, /@fips-app\/ds-fips/, 'Mensagem deve citar @fips-app/ds-fips')
  assert.match(message, /0\.21\.0/, 'Mensagem deve citar versão DS >=0.21.0')
}

console.log('--- Rodando Testes da Governança ESLint DS-FIPS ---')

// 1. Modal local de ./Modal -> 0 violações
const t1 = run("import { Modal } from './Modal'; export const x = <Modal open={true} onClose={() => {}}>A</Modal>;")
assert.equal(t1.length, 0, 'Modal local não deve acusar')
console.log('✓ Caso 1: Modal local de ./Modal ignorado')

// 2. Modal definido no próprio arquivo -> 0 violações
const t2 = run("function Modal(props) { return <div />; }\nexport const x = <Modal onClose={() => {}}>A</Modal>;")
assert.equal(t2.length, 0, 'Modal definido no próprio arquivo não deve acusar')
console.log('✓ Caso 2: Modal definido no próprio arquivo ignorado')

// 3. Modal de @fips-app/ds-fips com onClose -> 1 violação
const t3 = run("import { Modal } from '@fips-app/ds-fips'; export const x = <Modal open={true} onClose={() => {}}>A</Modal>;")
assert.equal(t3.length, 1, 'Modal do pacote com onClose deve acusar')
assert.match(t3[0].message, /onClose/, 'Mensagem deve citar onClose')
console.log('✓ Caso 3: Modal do pacote com onClose acusado')

// 4. Badge do pacote com sucesso -> 1 violação
const t4 = run("import { Badge } from '@fips-app/ds-fips'; export const x = <Badge variant=\"sucesso\">Ativo</Badge>;")
assert.equal(t4.length, 1, 'Badge com sucesso deve acusar')
console.log('✓ Caso 4: Badge com sucesso acusado')

// 5. Modal importado com apelido (alias) -> 1 violação
const t5 = run("import { Modal as DsModal } from '@fips-app/ds-fips'; export const x = <DsModal open={true} onClose={() => {}}>A</DsModal>;")
assert.equal(t5.length, 1, 'Modal com alias deve acusar')
console.log('✓ Caso 5: Modal importado como alias acusado')

// 6. Modal importado com namespace (import * as DS) -> 1 violação
const t6 = run("import * as DS from '@fips-app/ds-fips'; export const x = <DS.Modal open={true} onClose={() => {}}>A</DS.Modal>;")
assert.equal(t6.length, 1, 'DS.Modal deve acusar')
console.log('✓ Caso 6: DS.Modal via namespace acusado')

// 7. Modal de ui-sup com hero -> 1 violação (ui-sup é v0.6.2, não tem hero)
const t7 = run("import { Modal } from '@/components/ui-sup'; export const x = <Modal open={true} onOpenChange={() => {}} hero={true}>A</Modal>;")
assert.equal(t7.length, 1, 'Modal do ui-sup com hero deve acusar')
assert.match(t7[0].message, /ui-sup.*v0\.6\.2/, 'Deve avisar incompatibilidade com ui-sup')
console.log('✓ Caso 7: Modal do ui-sup com hero acusado')

// 8. Modal de ui-sup com onClose -> 1 violação
const t8 = run("import { Modal } from '@/components/ui-sup'; export const x = <Modal open={true} onClose={() => {}}>A</Modal>;")
assert.equal(t8.length, 1, 'Modal do ui-sup com onClose deve acusar')
console.log('✓ Caso 8: Modal do ui-sup com onClose acusado')

// 9. Arquivo de app sem nenhum import -> 0 violações
const t9 = run("export const x = <Modal open={true} onClose={() => {}}>A</Modal>;", 'src/pages/Home.tsx')
assert.equal(t9.length, 0, 'Arquivo sem imports não deve acusar Modal como sendo do DS')
console.log('✓ Caso 9: Arquivo real sem imports ignorado')

// 10. Trecho solto sem import (snippet.tsx) -> 1 violação
const t10 = run("export const x = <Modal open={true} onClose={() => {}}>A</Modal>;", 'snippet.tsx')
assert.equal(t10.length, 1, 'Trecho solto sem import deve acusar')
console.log('✓ Caso 10: Trecho solto sem import acusado')

// 11. header-tile inventado na casca -> 1 violação
const t11 = run('export const x = <button className="header-tile grid shrink-0">X</button>;')
assert.equal(t11.length, 1, 'header-tile bare deve acusar')
assertHeaderChromeMessage(t11[0].message)
console.log('✓ Caso 11: header-tile inventado acusado')

// 12. fips-header-tile correto -> 0 violações
const t12 = run('export const x = <button className="fips-header-tile">X</button>;')
assert.equal(t12.length, 0, 'fips-header-tile não deve acusar')
console.log('✓ Caso 12: fips-header-tile permitido')

// 13. fips-header-tile + header-tile junto -> 0 violações (contém fips-header-tile)
const t13 = run('export const x = <button className="fips-header-tile header-tile">X</button>;')
assert.equal(t13.length, 0, 'fips-header-tile com header-tile extra não deve acusar')
console.log('✓ Caso 13: fips-header-tile com header-tile extra permitido')

// 14. template/cn com header-tile sem fips -> 1 violação
const t14 = run(
  "const cn = (...a) => a.join(' '); export const x = <button className={cn('header-tile', 'grid')}>X</button>;",
)
assert.equal(t14.length, 1, 'cn com header-tile bare deve acusar')
assertHeaderChromeMessage(t14[0].message)
console.log('✓ Caso 14: cn/template com header-tile bare acusado')

// 15. TemplateLiteral quasi com header-tile bare -> 1 violação
const t15 = run('export const x = (y: string) => <button className={`header-tile ${y}`}>X</button>;')
assert.equal(t15.length, 1, 'TemplateLiteral com header-tile no quasi deve acusar')
assertHeaderChromeMessage(t15[0].message)
console.log('✓ Caso 15: TemplateLiteral com header-tile no quasi acusado')

// 16. TemplateLiteral quasi com fips-header-tile -> 0 violações
const t16 = run(
  'export const x = (y: string) => <button className={`fips-header-tile ${y}`}>X</button>;',
)
assert.equal(t16.length, 0, 'TemplateLiteral com fips-header-tile no quasi não deve acusar')
console.log('✓ Caso 16: TemplateLiteral com fips-header-tile no quasi permitido')

// 17. AppShell importado fora do pacote -> 1 violação
const t17 = run("import { AppShell } from '@/components/AppShell';")
assert.equal(t17.length, 1, 'AppShell de @/components/AppShell deve acusar')
assertCascaShellMessage(t17[0].message)
console.log('✓ Caso 17: AppShell importado fora do pacote acusado')

// 18. AppShell definido localmente -> 1 violação
const t18 = run('export function AppShell() { return null }')
assert.equal(t18.length, 1, 'export function AppShell local deve acusar')
assertCascaShellMessage(t18[0].message)
console.log('✓ Caso 18: AppShell definido localmente acusado')

// 19. HomeHero importado local + JSX -> 1 violação
const t19 = run("import HomeHero from './HomeHero'; export const x = <HomeHero />;")
assert.equal(t19.length, 1, 'HomeHero local com JSX deve acusar')
assertCascaShellMessage(t19[0].message, 'HomeHero')
console.log('✓ Caso 19: HomeHero local com JSX acusado')

// 20. AppShell e HomeHero do pacote -> 0 violações
const t20 = run(
  "import { AppShell, HomeHero } from '@fips-app/ds-fips'; export const x = <AppShell><HomeHero /></AppShell>;",
)
assert.equal(t20.length, 0, 'AppShell e HomeHero do pacote não devem acusar')
console.log('✓ Caso 20: AppShell e HomeHero do pacote permitidos')

// 21. AppShell com alias do pacote -> 0 violações
const t21 = run(
  "import { AppShell as Shell } from '@fips-app/ds-fips'; export const x = <Shell />;",
)
assert.equal(t21.length, 0, 'AppShell alias do pacote não deve acusar')
console.log('✓ Caso 21: AppShell alias do pacote permitido')

console.log('\nTodos os 21 testes do plugin ESLint passaram com sucesso!')
