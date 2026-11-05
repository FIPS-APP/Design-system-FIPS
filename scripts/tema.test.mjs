/**
 * useFipsTheme, o hook de tema que o pacote exporta.
 * Monta o módulo de verdade (build em memória com o vite do repo) e roda contra um <html>,
 * um armazenamento e um MutationObserver de mentira, porque o repo não tem jsdom.
 * Cobre: importação sem window e sem localStorage, armazenamento que lança, tema guardado
 * aplicado na carga, toggle e setDark, observador da classe, render no servidor com
 * react-dom/server e a exportação (hook e tipo) em src/index.ts.
 * Rodar: npm run test:tema
 */
import { test, before, after, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import ts from 'typescript'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const TMP = join(RAIZ, 'node_modules', '.cache', 'teste-tema')
const HOOK = join(RAIZ, 'src/hooks/useFipsTheme.ts')

let arquivoComShim
let arquivoComReact
let instancias = 0
let ultimaAssinatura

async function compilar(alias) {
  const saida = await build({
    root: RAIZ,
    configFile: false,
    logLevel: 'silent',
    resolve: { alias },
    build: { ssr: HOOK, write: false, rollupOptions: { output: { format: 'es' } } },
  })
  const lote = Array.isArray(saida) ? saida[0] : saida
  return lote.output.find((o) => o.type === 'chunk' && o.isEntry).code
}

before(async () => {
  mkdirSync(TMP, { recursive: true })
  // react de mentira: só o que o hook usa, para rodar o hook como função comum.
  const shim = join(TMP, 'react-shim.mjs')
  writeFileSync(
    shim,
    `export function useSyncExternalStore(subscribe, getSnapshot) {
  globalThis.__assinatura = subscribe
  return getSnapshot()
}
export function useCallback(fn) { return fn }
`,
  )
  arquivoComShim = join(TMP, 'hook-shim.mjs')
  writeFileSync(arquivoComShim, await compilar([{ find: /^react$/, replacement: shim }]))
  // react de verdade, para o render no servidor.
  arquivoComReact = join(TMP, 'hook-react.mjs')
  writeFileSync(arquivoComReact, await compilar([]))
})

after(() => {
  limpar()
  rmSync(TMP, { recursive: true, force: true })
})

afterEach(limpar)

function limpar() {
  for (const nome of ['window', 'document', 'localStorage', 'MutationObserver', '__assinatura']) {
    delete globalThis[nome]
  }
}

/**
 * Monta window, document e MutationObserver de mentira.
 * `guardado`: o que já estava em localStorage['fips-theme'].
 * `bloqueado`: window.localStorage lança, como num navegador com o armazenamento negado.
 */
function ambiente({ guardado, bloqueado = false } = {}) {
  limpar()
  const classes = new Set()
  const observadores = new Set()
  // O observador de verdade avisa depois, em microtarefa: o de mentira também.
  const avisar = () => queueMicrotask(() => observadores.forEach((o) => o.cb([])))
  const html = {
    classList: {
      contains: (c) => classes.has(c),
      add(c) {
        if (!classes.has(c)) {
          classes.add(c)
          avisar()
        }
      },
      remove(c) {
        if (classes.delete(c)) avisar()
      },
      toggle(c, force) {
        const quer = force === undefined ? !classes.has(c) : force
        if (quer) this.add(c)
        else this.remove(c)
        return quer
      },
    },
  }
  const dados = new Map(guardado === undefined ? [] : [['fips-theme', guardado]])
  const armazenamento = {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, String(valor)),
  }
  const janela = {}
  Object.defineProperty(janela, 'localStorage', {
    get() {
      if (bloqueado) throw new Error('SecurityError: o armazenamento está bloqueado')
      return armazenamento
    },
  })
  globalThis.window = janela
  globalThis.document = { documentElement: html }
  globalThis.MutationObserver = class {
    constructor(cb) {
      this.cb = cb
    }
    observe() {
      observadores.add(this)
    }
    disconnect() {
      observadores.delete(this)
    }
  }
  return { html, dados, observadores }
}

/** Importa uma instância nova do módulo: estado de módulo (ouvintes, observador) zerado. */
async function importar(arquivo = arquivoComShim) {
  instancias += 1
  return import(`${pathToFileURL(arquivo).href}?n=${instancias}`)
}

/** Roda o hook como função comum e guarda o `subscribe` que ele passou ao React. */
function usar(modulo) {
  const resultado = modulo.useFipsTheme()
  ultimaAssinatura = globalThis.__assinatura
  return resultado
}

const microtarefas = () => new Promise((resolver) => setTimeout(resolver, 0))

test('importar sem window nem document: não lança e não toca no localStorage', async () => {
  limpar()
  const acessos = []
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      acessos.push('localStorage')
      throw new Error('localStorage lido sem window')
    },
  })
  const modulo = await importar()
  const { dark, toggle, setDark } = usar(modulo)
  assert.equal(dark, false)
  assert.doesNotThrow(() => toggle())
  assert.doesNotThrow(() => setDark(true))
  assert.deepEqual(acessos, [], 'nenhum acesso a localStorage fora do navegador')
})

test('tema escuro guardado: a classe .dark entra no <html> na carga', async () => {
  const { html } = ambiente({ guardado: 'dark' })
  await importar()
  assert.equal(html.classList.contains('dark'), true)
})

test('tema claro guardado, nada guardado ou valor desconhecido: sem classe', async () => {
  for (const guardado of ['light', undefined, 'azul', '']) {
    const { html } = ambiente({ guardado })
    await importar()
    assert.equal(html.classList.contains('dark'), false, `guardado=${JSON.stringify(guardado)}`)
  }
})

test('armazenamento bloqueado: importar não lança e o tema alterna só nesta visita', async () => {
  const { html } = ambiente({ bloqueado: true })
  const modulo = await importar()
  assert.equal(usar(modulo).dark, false)
  usar(modulo).toggle()
  assert.equal(html.classList.contains('dark'), true, 'a tela muda mesmo sem onde guardar')
  assert.equal(usar(modulo).dark, true)
  usar(modulo).toggle()
  assert.equal(usar(modulo).dark, false, 'e volta ao claro')
})

test('toggle alterna a classe e guarda a escolha em fips-theme', async () => {
  const { html, dados } = ambiente()
  const modulo = await importar()
  usar(modulo).toggle()
  assert.equal(html.classList.contains('dark'), true)
  assert.equal(dados.get('fips-theme'), 'dark')
  usar(modulo).toggle()
  assert.equal(html.classList.contains('dark'), false)
  assert.equal(dados.get('fips-theme'), 'light')
})

test('setDark força o tema e guarda; repetir o mesmo valor não desfaz', async () => {
  const { html, dados } = ambiente()
  const modulo = await importar()
  const { setDark } = usar(modulo)
  setDark(true)
  setDark(true)
  assert.equal(html.classList.contains('dark'), true)
  assert.equal(dados.get('fips-theme'), 'dark')
  setDark(false)
  setDark(false)
  assert.equal(html.classList.contains('dark'), false)
  assert.equal(dados.get('fips-theme'), 'light')
})

test('toggle lê o tema de agora, não o de quando o hook rodou', async () => {
  const { html } = ambiente()
  const modulo = await importar()
  const { toggle } = usar(modulo) // dark era false aqui
  html.classList.add('dark') // outro código do app escureceu a tela depois
  toggle()
  assert.equal(html.classList.contains('dark'), false, 'vai para o claro, que é o oposto do que está na tela')
})

test('toggle e setDark avisam quem assinou, na hora', async () => {
  ambiente()
  const modulo = await importar()
  const { toggle, setDark } = usar(modulo)
  let avisos = 0
  const sair = ultimaAssinatura(() => {
    avisos += 1
  })
  toggle()
  assert.equal(avisos, 1)
  setDark(false)
  assert.equal(avisos, 2)
  sair()
})

test('classe mudada por fora também avisa, e o observador sai com o último assinante', async () => {
  const { html, observadores } = ambiente()
  const modulo = await importar()
  usar(modulo)
  let avisos = 0
  const sairA = ultimaAssinatura(() => {
    avisos += 1
  })
  const sairB = ultimaAssinatura(() => {})
  assert.equal(observadores.size, 1, 'um observador só, não um por assinante')
  html.classList.add('dark')
  await microtarefas()
  assert.ok(avisos >= 1, 'a mudança de fora chegou ao assinante')
  sairA()
  assert.equal(observadores.size, 1, 'ainda há um assinante')
  sairB()
  assert.equal(observadores.size, 0, 'sem assinantes, o observador é desligado')
})

test('render no servidor: claro, sem window, sem lançar', async () => {
  limpar()
  const acessos = []
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      acessos.push('localStorage')
      throw new Error('localStorage lido no servidor')
    },
  })
  const modulo = await importar(arquivoComReact)
  const React = (await import(pathToFileURL(join(RAIZ, 'node_modules/react/index.js')).href)).default
  const { renderToStaticMarkup } = await import(
    pathToFileURL(join(RAIZ, 'node_modules/react-dom/server.node.js')).href
  )
  const Tela = () => {
    const { dark } = modulo.useFipsTheme()
    return React.createElement('span', null, dark ? 'escuro' : 'claro')
  }
  assert.equal(renderToStaticMarkup(React.createElement(Tela)), '<span>claro</span>')
  assert.deepEqual(acessos, [])
})

test('src/index.ts exporta useFipsTheme com o tipo de retorno nomeado', () => {
  const leitura = ts.readConfigFile(join(RAIZ, 'tsconfig.lib.json'), ts.sys.readFile)
  const config = ts.parseJsonConfigFileContent(leitura.config, ts.sys, RAIZ)
  const entrada = join(RAIZ, 'src/index.ts')
  const programa = ts.createProgram([entrada], { ...config.options, noEmit: true, emitDeclarationOnly: false })
  const checador = programa.getTypeChecker()
  const exportados = new Map(
    checador.getExportsOfModule(checador.getSymbolAtLocation(programa.getSourceFile(entrada))).map((s) => [s.getName(), s]),
  )

  assert.ok(exportados.has('useFipsTheme'), 'useFipsTheme não sai em src/index.ts')
  assert.ok(exportados.has('UseFipsThemeResult'), 'UseFipsThemeResult não sai em src/index.ts')

  const funcao = checador.getTypeOfSymbolAtLocation(exportados.get('useFipsTheme'), programa.getSourceFile(entrada))
  const [assinatura] = funcao.getCallSignatures()
  assert.equal(checador.typeToString(assinatura.getReturnType()), 'UseFipsThemeResult')

  const tipo = checador.getDeclaredTypeOfSymbol(exportados.get('UseFipsThemeResult'))
  const campos = checador.getPropertiesOfType(tipo).map((p) => p.getName()).sort()
  assert.deepEqual(campos, ['dark', 'setDark', 'toggle'])
})
