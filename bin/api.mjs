// Leitura do pacote @fips-app/ds-fips e conferência de um app consumidor.
// Usado por `bin/fips-ds.mjs` (no app) e por `scripts/gerar-ai.mjs` (no build do pacote).
// Nada aqui é digitado à mão: exports e props saem do compilador do TypeScript sobre o `.d.ts`,
// tokens saem do `styles.css`.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { GOVERNED_COMPONENTS } from '../eslint/index.js'

export const PACOTE = '@fips-app/ds-fips'

// ---------- TypeScript ----------
// Vem do app (devDependency comum) ou de onde o pacote estiver; o pacote não depende dele.
export function carregarTs(...bases) {
  for (const b of [...bases, path.dirname(fileURLToPath(import.meta.url))]) {
    try {
      return createRequire(path.join(path.resolve(b), 'package.json'))('typescript')
    } catch { /* tenta a próxima */ }
  }
  throw new Error('typescript não encontrado: instale no app (npm i -D typescript)')
}

// ---------- onde está o pacote ----------
export function localizarPacote(pasta) {
  const pkgPath = path.join(pasta, 'package.json')
  if (!fs.existsSync(pkgPath)) return null
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const css = (pkg.exports && pkg.exports['./styles.css']) || './dist/styles.css'
  return {
    pasta,
    versao: pkg.version,
    dts: path.join(pasta, pkg.types || 'dist/index.d.ts'),
    css: path.join(pasta, typeof css === 'string' ? css : css.default),
    manifest: path.join(pasta, 'ai/manifest.json'),
  }
}

// ---------- exports e props pelo compilador ----------
export function lerApi(ts, dts) {
  const prog = ts.createProgram([dts], {
    jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, noEmit: true,
    moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020,
    esModuleInterop: true, types: [],
  })
  const c = prog.getTypeChecker()
  const sf = prog.getSourceFile(dts)
  if (!sf) throw new Error(`não li ${dts}`)
  const mod = c.getSymbolAtLocation(sf)
  const raiz = path.dirname(path.dirname(dts)) + path.sep
  const bandeira = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  const origemDe = (arq) => (/\/@types\/react(-dom)?\/|\/typescript\/lib\//.test(arq) ? 'html'
    : /\/class-variance-authority\//.test(arq) ? 'variante'
      : /\/@radix-ui\//.test(arq) ? 'radix'
        : arq.startsWith(raiz) && !arq.includes('/node_modules/') ? 'pacote' : 'externa')
  const valoresLiterais = (t) => {
    const partes = t.isUnion() ? t.types : [t]
    const vals = []
    for (const p of partes) {
      if (p.flags & ts.TypeFlags.StringLiteral) vals.push(p.value)
      else if (p.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void)) continue
      else return null
    }
    return vals.length ? [...new Set(vals)].sort() : null
  }
  const listarProps = (tipo) => c.getPropertiesOfType(tipo).map((p) => {
    const decl = (p.declarations || [])[0]
    const pTipo = c.getTypeOfSymbolAtLocation(p, sf)
    let txt = c.typeToString(pTipo, undefined, bandeira).replace(/ \| undefined$/, '')
    if (txt.length > 120) txt = txt.slice(0, 117) + '...'
    const prop = { nome: p.getName(), opcional: !!(p.flags & ts.SymbolFlags.Optional), tipo: txt, origem: decl ? origemDe(decl.getSourceFile().fileName) : 'sem-declaracao' }
    const vals = valoresLiterais(pTipo)
    if (vals) prop.valores = vals
    return prop
  }).filter((p) => p.origem !== 'html' && p.origem !== 'externa' && p.origem !== 'sem-declaracao')
    .sort((a, b) => a.nome.localeCompare(b.nome))

  const exportsLista = []
  const props = {}
  for (const s0 of c.getExportsOfModule(mod)) {
    const s = s0.flags & ts.SymbolFlags.Alias ? c.getAliasedSymbol(s0) : s0
    const nome = s0.getName()
    let tipo = 'tipo'
    if (s.flags & ts.SymbolFlags.Value) {
      const t = c.getTypeOfSymbolAtLocation(s, sf)
      const ass = t.getCallSignatures()
      // forwardRef/memo: objeto chamável
      tipo = ass.length && /^[A-Z]/.test(nome) ? 'componente' : ass.length ? 'funcao' : 'valor'
    } else if (/Props$/.test(nome) && (s.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias))) {
      props[nome] = listarProps(c.getDeclaredTypeOfSymbol(s))
    }
    exportsLista.push({ nome, tipo })
  }
  exportsLista.sort((a, b) => a.nome.localeCompare(b.nome))
  return { typescript: ts.version, exports: exportsLista, props }
}

// ---------- CSS ----------
// Regras folha do CSS, descendo por @layer/@supports; @media e @container ficam marcadas como condicionais.
function blocos(css) {
  const saida = []
  const pilha = []
  let i = 0
  let inicio = 0
  while (i < css.length) {
    const ch = css[i]
    if (ch === '"' || ch === "'") { const q = ch; i++; while (i < css.length && css[i] !== q) { if (css[i] === '\\') i++; i++ } }
    else if (ch === '/' && css[i + 1] === '*') { const f = css.indexOf('*/', i + 2); i = f < 0 ? css.length : f + 1 }
    else if (ch === '{') { pilha.push({ prelude: css.slice(inicio, i).trim(), corpoInicio: i + 1 }); inicio = i + 1 }
    else if (ch === '}') {
      const topo = pilha.pop()
      if (topo) {
        const corpo = css.slice(topo.corpoInicio, i)
        if (!corpo.includes('{')) saida.push({ seletor: topo.prelude, corpo, condicional: pilha.some((p) => /^@(media|container)\b/.test(p.prelude)) })
      }
      inicio = i + 1
    } else if (ch === ';' && pilha.length === 0) inicio = i + 1
    i++
  }
  return saida
}

const DECL = /(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]+?)\s*(?:;|$)/g

// Tokens declarados em `:root`/`:host` (claro) e `.dark` (escuro), valor como está no CSS. Vale a última declaração.
export function lerTokens(cssPath) {
  const css = fs.readFileSync(cssPath, 'utf8')
  const claro = {}
  const escuro = {}
  for (const { seletor, corpo, condicional } of blocos(css)) {
    if (condicional) continue
    const sels = seletor.split(',').map((s) => s.trim())
    const ehClaro = sels.some((s) => s === ':root' || s === ':host')
    const ehEscuro = sels.includes('.dark')
    if (!ehClaro && !ehEscuro) continue
    for (const m of corpo.matchAll(DECL)) {
      if (ehClaro) claro[m[1]] = m[2]
      if (ehEscuro) escuro[m[1]] = m[2]
    }
  }
  const ordenar = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)))
  return { claro: ordenar(claro), escuro: ordenar(escuro) }
}

// Toda variável declarada em qualquer lugar do texto (`--x:` em CSS, `'--x':` em style, `[--x:..]` em classe).
export function declaracoes(texto) {
  return new Set([...texto.matchAll(/(?<![\w-])(--[A-Za-z0-9_-]+)\s*['"]?\s*:/g)].map((m) => m[1]))
}

// ---------- o que o check confere ----------
export const REGRAS = [
  { codigo: 'import-inexistente', descricao: 'nome importado de `@fips-app/ds-fips` que o `.d.ts` instalado não exporta' },
  { codigo: 'var-sem-declaracao', descricao: '`var(--x)` sem `--x:` no `styles.css` instalado nem no CSS do app' },
  { codigo: 'hex-literal', descricao: 'cor hex literal em `.tsx`, `.jsx` ou `.css` do app' },
  { codigo: 'dependencia-local', descricao: '`@fips-app/ds-fips` por `file:`, `link:`, URL ou `.tgz` no `package.json`; o certo é o registro' },
  { codigo: 'casca-local', descricao: 'casca, entrada ou banner feitos no app: `login-v1-container`, `liquid-card`, `casca-hero-*`, `PaginaCabecalho`, `PageHero` com filhos' },
  { codigo: 'classname-visual', descricao: `classe visual (cor, borda, raio, sombra, altura, padding, fonte, anel, opacidade, size, outline) em \`className\` de ${[...GOVERNED_COMPONENTS].map((n) => '`' + n + '`').join(', ')} do pacote, também com prefixo (\`sm:\`, \`hover:\`, \`dark:\`, \`data-[...]:\`)` },
]

export const VISUAL =
  /^(?:bg-|text-|border(?:$|-)|rounded(?:$|-)|shadow(?:$|-)|h(?:$|-)|min-h(?:$|-)|max-h(?:$|-)|p(?:$|-|x-|y-|t-|r-|b-|l-)|font(?:$|-)|leading(?:$|-)|tracking(?:$|-)|ring(?:$|-)|opacity(?:$|-)|size-|outline(?:$|-))/
// tira os prefixos de variante (`sm:`, `hover:`, `data-[state=active]:`, `[&>svg]:`) e o `!`
export const semPrefixo = (t) => t.replace(/^(?:\[[^\]]*\]:|[^:[\]]+(?:\[[^\]]*\])?[^:[\]]*:)+/, '').replace(/^!/, '')

const HEX = /(?<![A-Za-z0-9&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\w-])/g
// Em .tsx/.jsx só conta hex dentro de string em contexto de cor: a string inteira é a cor ('#fff'),
// ou o # vem depois de `[`, `:`, `(` ou `,` (Tailwind arbitrário, CSS em string, função de cor),
// ou depois de espaço numa string que parece declaração CSS (tem `:` ou `;`).
// Comentário e texto de JSX ficam de fora: "veja #153" é número de issue, não cor.
const HEX_EM_STRING = (s) => {
  const achados = []
  for (const m of s.matchAll(HEX)) {
    const antes = s.slice(0, m.index).trimEnd()
    const ult = antes.slice(-1)
    const inteira = s.trim() === m[0]
    const contexto = ['[', ':', '(', ','].includes(s[m.index - 1]) || ['[', ':', '(', ','].includes(ult)
    const declaracaoCss = /\s/.test(s[m.index - 1] || '') && /[:;]/.test(s)
    if (inteira || contexto || declaracaoCss) achados.push(m)
  }
  return achados
}
const SINAIS_CLASSE = [/login-v1-container/g, /liquid-card/g, /casca-hero-[\w-]*/g]
const IGNORAR = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', '.next', 'vendor'])

function arquivos(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return IGNORAR.has(e.name) || e.name.startsWith('.') ? [] : arquivos(p)
    return /\.(tsx|ts|jsx|css)$/.test(e.name) && !/\.(test|spec)\.[jt]sx?$/.test(e.name) && !e.name.endsWith('.d.ts') ? [p] : []
  })
}

const linhaDe = (texto, idx) => texto.slice(0, idx).split('\n').length

export function conferir(app, { ds } = {}) {
  app = path.resolve(app)
  const problemas = []
  const add = (codigo, arq, linha, detalhe) => problemas.push({ codigo, arquivo: path.relative(app, arq) || '.', linha, detalhe })
  const avisos = []

  // dependência
  const pkgApp = path.join(app, 'package.json')
  if (fs.existsSync(pkgApp)) {
    const pkg = JSON.parse(fs.readFileSync(pkgApp, 'utf8'))
    for (const campo of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const v = pkg[campo]?.[PACOTE]
      if (v && (/^(file:|link:|https?:|git)/.test(v) || /\.tgz$/.test(v))) add('dependencia-local', pkgApp, 1, `${campo}: "${PACOTE}": "${v}"`)
    }
  }

  const pacote = localizarPacote(ds ? path.resolve(ds) : path.join(app, 'node_modules', PACOTE))
  const raizCodigo = fs.existsSync(path.join(app, 'src')) ? path.join(app, 'src') : app
  const lista = arquivos(raizCodigo)
  const textos = new Map(lista.map((f) => [f, fs.readFileSync(f, 'utf8')]))

  let ts = null
  let exportados = null
  let declaradas = null
  if (pacote && fs.existsSync(pacote.dts)) {
    ts = carregarTs(app, pacote.pasta)
    exportados = new Set(lerApi(ts, pacote.dts).exports.map((e) => e.nome))
    declaradas = fs.existsSync(pacote.css) ? declaracoes(fs.readFileSync(pacote.css, 'utf8')) : new Set()
    // CSS do app (fora de src também, ex.: index.css na raiz) e o tema do Tailwind que o app importa
    for (const f of arquivos(app).filter((f) => f.endsWith('.css'))) for (const d of declaracoes(fs.readFileSync(f, 'utf8'))) declaradas.add(d)
    const temaTw = path.join(app, 'node_modules/tailwindcss/theme.css')
    if (fs.existsSync(temaTw)) for (const d of declaracoes(fs.readFileSync(temaTw, 'utf8'))) declaradas.add(d)
    for (const t of textos.values()) for (const d of declaracoes(t)) declaradas.add(d)
  } else {
    avisos.push(`${PACOTE} não está instalado em ${app}: import e var() não conferidos (app de ui própria ou ui-sup)`)
    ts = carregarTs(app)
  }

  for (const [arq, texto] of textos) {
    const ehCss = arq.endsWith('.css')
    const semComentario = ehCss ? texto.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')) : texto
    // Em CSS, a definição de token (`--nome: #hex;`) é o lugar certo do hex: só conta hex fora dela.
    const semDefinicaoDeToken = ehCss ? semComentario.replace(/--[\w-]+\s*:[^;{}]*/g, (m) => m.replace(/[^\n]/g, ' ')) : semComentario
    if (ehCss) for (const m of semDefinicaoDeToken.matchAll(HEX)) add('hex-literal', arq, linhaDe(texto, m.index), m[0])
    if (declaradas) {
      for (const m of semComentario.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) if (!declaradas.has(m[1])) add('var-sem-declaracao', arq, linhaDe(texto, m.index), m[1])
    }
    for (const re of SINAIS_CLASSE) for (const m of texto.matchAll(re)) add('casca-local', arq, linhaDe(texto, m.index), m[0])
    if (ehCss) continue

    const sf = ts.createSourceFile(arq, texto, ts.ScriptTarget.Latest, true, arq.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.TSX)
    const linha = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1
    const doPacote = new Map() // nome local -> nome exportado
    for (const d of sf.statements) {
      if (!ts.isImportDeclaration(d) || d.moduleSpecifier.text !== PACOTE) continue
      const nb = d.importClause?.namedBindings
      if (!nb || !ts.isNamedImports(nb)) continue
      for (const e of nb.elements) {
        const nome = (e.propertyName || e.name).text
        doPacote.set(e.name.text, nome)
        if (exportados && !exportados.has(nome)) add('import-inexistente', arq, linha(e), nome)
      }
    }
    const visitar = (n) => {
      if (!arq.endsWith('.ts') && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n))) {
        for (const m of HEX_EM_STRING(n.text)) add('hex-literal', arq, linha(n), m[0])
      }
      if (ts.isIdentifier(n) && n.text === 'PaginaCabecalho') add('casca-local', arq, linha(n), 'PaginaCabecalho')
      if (ts.isJsxElement(n) && n.openingElement.tagName.getText(sf) === 'PageHero') {
        const filhos = n.children.filter((f) => !(ts.isJsxText(f) && !f.text.trim()))
        if (filhos.length) add('casca-local', arq, linha(n), 'PageHero com filhos')
      }
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const original = doPacote.get(n.tagName.getText(sf))
        if (original && GOVERNED_COMPONENTS.has(original)) {
          for (const a of n.attributes.properties) {
            if (!ts.isJsxAttribute(a) || a.name.getText(sf) !== 'className' || !a.initializer) continue
            const literais = [...a.initializer.getText(sf).matchAll(/["'`]([^"'`]*)["'`]/g)].map((m) => m[1]).join(' ')
            for (const t of literais.split(/\s+/)) {
              const util = semPrefixo(t)
              if (util && VISUAL.test(util)) add('classname-visual', arq, linha(a), `${original} ${t}`)
            }
          }
        }
      }
      ts.forEachChild(n, visitar)
    }
    visitar(sf)
  }
  problemas.sort((a, b) => a.arquivo.localeCompare(b.arquivo) || a.linha - b.linha || a.codigo.localeCompare(b.codigo))
  return { problemas, avisos, pacote, arquivos: lista.length }
}
