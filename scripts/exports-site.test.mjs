/**
 * Componentes que o site documenta e o pacote precisa exportar (FIPS-1190).
 * Lê os exports de `src/index.ts` pelo compilador do TypeScript (o mesmo que gera o
 * `dist/index.d.ts`) e confere os nomes, e que nenhum arquivo alcançável a partir dele vem de `src/docs/`.
 * Rodar: npm run test:exports
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')

const ENTRADA = join(RAIZ, 'src/index.ts')

function programaDoPacote() {
  const leitura = ts.readConfigFile(join(RAIZ, 'tsconfig.lib.json'), ts.sys.readFile)
  const config = ts.parseJsonConfigFileContent(leitura.config, ts.sys, RAIZ)
  return ts.createProgram([ENTRADA], { ...config.options, noEmit: true, emitDeclarationOnly: false })
}

function exportadosDoPacote() {
  const entrada = ENTRADA
  const programa = programaDoPacote()
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
  FipsTabBarProps: 'tipo das props do FipsTabBar',
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

test('nenhum arquivo do pacote vem de src/docs', () => {
  const docs = join(RAIZ, 'src/docs').replaceAll('\\', '/') + '/'
  const doSite = programaDoPacote()
    .getSourceFiles()
    .map((f) => f.fileName)
    .filter((f) => f.startsWith(docs))
  assert.deepEqual(doSite, [], `o pacote alcança arquivos do site: ${doSite.join(', ')}`)
})
