/**
 * Componentes que o site documenta e o pacote precisa exportar (FIPS-1190).
 * Lê os exports de `src/index.ts` pelo compilador do TypeScript (o mesmo que gera o
 * `dist/index.d.ts`) e confere os nomes, e que `BuscarUsuarioModal` não importa dado do site.
 * Rodar: npm run test:exports
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')

function exportadosDoPacote() {
  const leitura = ts.readConfigFile(join(RAIZ, 'tsconfig.lib.json'), ts.sys.readFile)
  const config = ts.parseJsonConfigFileContent(leitura.config, ts.sys, RAIZ)
  const entrada = join(RAIZ, 'src/index.ts')
  const programa = ts.createProgram([entrada], { ...config.options, noEmit: true, emitDeclarationOnly: false })
  const checador = programa.getTypeChecker()
  return new Set(
    checador.getExportsOfModule(checador.getSymbolAtLocation(programa.getSourceFile(entrada))).map((s) => s.getName()),
  )
}

const ESPERADOS = {
  DrawerHero: 'Drawer: header hero institucional',
  DrawerHeroProps: 'tipo das props do DrawerHero',
  useTableDensity: 'hook de densidade da Table (o Badge usa)',
  TableDensity: 'tipo devolvido por useTableDensity',
  FipsTabBar: 'barra de abas do cabeçalho',
  FipsTabItem: 'tipo do item do FipsTabBar',
  BuscarPessoaModal: 'modal Buscar responsável',
  BuscarPessoaModalProps: 'tipo das props do BuscarPessoaModal',
  Pessoa: 'tipo da pessoa do BuscarPessoaModal',
  PatternPanelHero: 'já saía (apelido do PageHeader); não pode regredir',
}

test('o pacote exporta os componentes documentados no site', () => {
  const exportados = exportadosDoPacote()
  const faltando = Object.keys(ESPERADOS).filter((nome) => !exportados.has(nome))
  assert.deepEqual(faltando, [], `não saem em src/index.ts: ${faltando.join(', ')}`)
})

test('BuscarUsuarioModal não importa dado do site', () => {
  const fonte = readFileSync(join(RAIZ, 'src/components/composites/BuscarUsuarioModal.tsx'), 'utf8')
  const importaDoSite = /from\s+['"][^'"]*\/docs\//.test(fonte)
  assert.equal(importaDoSite, false, 'BuscarUsuarioModal.tsx ainda importa de src/docs/')
})
