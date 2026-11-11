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

const exportados = exportsDoPacote()

test('src/index.ts exporta LoginDsShell', () => {
  assert.ok(exportados.has('LoginDsShell'), 'LoginDsShell fora do src/index.ts')
})

test('componente da biblioteca usado no site tem export no pacote', () => {
  const faltam = []
  for (const pagina of paginas()) {
    for (const nome of componentesImportados(pagina)) {
      if (!exportados.has(nome)) faltam.push(`${relative(raiz, pagina)}: ${nome}`)
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
