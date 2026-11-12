// Toda página de componente ou padrão do site mostra algo que o pacote exporta.
// Regra 1: componente da biblioteca importado por página do site tem export em src/index.ts.
// Regra 2: página que não importa componente da biblioteca leva o nome de um export (BadgeDoc -> Badge)
//          ou está na lista de exceção, com o motivo.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entrada = process.env.DS_INDEX ?? join(raiz, 'src/index.ts')

// Pastas da biblioteca. layout/ e domain/ são do site e não entram no pacote.
const PASTAS_DA_BIBLIOTECA = [
  'src/components/ui/',
  'src/components/composites/',
  'src/components/patterns/',
  'src/components/brand/',
  'src/components/icons/',
  'src/composites/',
]

// Página sem componente da biblioteca e sem nome de export. Cada uma com o motivo.
// Só texto ou protótipo; quem entrar aqui com componente de verdade falha no último teste.
const EXCECOES = {
  'src/docs/pages/components/HeaderDoc.tsx':
    'documenta o cabeçalho do próprio site de documentação; nas apps o cabeçalho vem do AppShell',
  'src/docs/pages/components/ToastDoc.tsx':
    'protótipo desenhado na página; o pacote ainda não tem aviso passageiro (pendência registrada)',
  'src/docs/pages/patterns/DashboardDemo.tsx':
    'protótipo de painel montado na página; os gráficos do pacote estão em GraficosDoc',
}

function exportsDoPacote() {
  const programa = ts.createProgram([entrada], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
    noEmit: true,
  })
  const checker = programa.getTypeChecker()
  const fonte = programa.getSourceFile(entrada)
  const modulo = checker.getSymbolAtLocation(fonte)
  return new Set(checker.getExportsOfModule(modulo).map((s) => s.getName()))
}

function paginas() {
  const lista = []
  for (const pasta of ['components', 'patterns', 'motion']) {
    const dir = join(raiz, 'src/docs/pages', pasta)
    for (const nome of readdirSync(dir)) if (nome.endsWith('.tsx')) lista.push(join(dir, nome))
  }
  lista.push(join(raiz, 'src/docs/pages/LoginPage.tsx'))
  return lista
}

// Nomes em PascalCase importados de arquivos da biblioteca (componentes, não utilitários nem tipos).
function componentesImportados(arquivo) {
  const texto = readFileSync(arquivo, 'utf8')
  const fonte = ts.createSourceFile(arquivo, texto, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX)
  const nomes = []
  for (const no of fonte.statements) {
    if (!ts.isImportDeclaration(no) || no.importClause?.isTypeOnly) continue
    const caminho = no.moduleSpecifier.text
    if (!caminho.startsWith('.')) continue
    const alvo = relative(raiz, resolve(dirname(arquivo), caminho)) + '/'
    if (!PASTAS_DA_BIBLIOTECA.some((p) => alvo.startsWith(p) || alvo === p)) continue
    const ligacoes = no.importClause?.namedBindings
    if (!ligacoes || !ts.isNamedImports(ligacoes)) continue
    for (const el of ligacoes.elements) {
      if (el.isTypeOnly) continue
      const nome = (el.propertyName ?? el.name).text
      if (/^[A-Z][a-z]/.test(nome)) nomes.push(nome)
    }
  }
  return nomes
}

// Componente que o site mostra e cujo export sai num PR já aberto. Sai daqui quando o PR entrar.
const PENDENTES_EM_PR = {
  FipsTabBar: 'export no PR #145',
  BuscarPessoaModal: 'export no PR #145',
  SettingsPreferenceRow: 'export no PR #6',
}

const exportados = exportsDoPacote()

test('src/index.ts exporta LoginDsShell', () => {
  assert.ok(exportados.has('LoginDsShell'), 'LoginDsShell fora do src/index.ts')
})

test('componente da biblioteca usado no site tem export no pacote', () => {
  const faltam = []
  for (const pagina of paginas()) {
    for (const nome of componentesImportados(pagina)) {
      if (!exportados.has(nome) && !PENDENTES_EM_PR[nome]) faltam.push(`${relative(raiz, pagina)}: ${nome}`)
    }
  }
  assert.deepEqual(faltam, [])
})

test('página sem componente da biblioteca tem nome de export ou está na exceção', () => {
  const soltas = []
  for (const pagina of paginas()) {
    const rel = relative(raiz, pagina)
    if (componentesImportados(pagina).length > 0) continue
    const nome = rel.split('/').pop().replace(/(Doc|Demo|Page)?\.tsx$/, '')
    if (exportados.has(nome)) continue
    if (EXCECOES[rel]) continue
    soltas.push(rel)
  }
  assert.deepEqual(soltas, [])
})

test('exceção aponta para página que existe e ainda não tem componente', () => {
  const todas = new Set(paginas().map((p) => relative(raiz, p)))
  for (const rel of Object.keys(EXCECOES)) {
    assert.ok(todas.has(rel), `exceção para página inexistente: ${rel}`)
    assert.equal(componentesImportados(join(raiz, rel)).length, 0, `exceção sobrando: ${rel} já importa componente`)
  }
})

// Componentes que o site documenta e o pacote precisa exportar (FIPS-1190), e nenhum arquivo do pacote vem de src/docs.

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
