/**
 * `npx fips-ds check` e `scripts/gerar-ai.mjs` sobre um pacote mínimo (scripts/fixtures/pacote).
 * app-limpo passa; cada arquivo de app-violacoes tem uma violação só. Para cada uma: o app limpo
 * com o arquivo acrescentado falha com aquele código, e sem ele volta a passar.
 * Rodar: npm run test:fips-ds
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.join(AQUI, '..')
const BIN = path.join(RAIZ, 'bin/fips-ds.mjs')
const FIX = path.join(AQUI, 'fixtures')
const PACOTE = path.join(FIX, 'pacote')

function check(app) {
  const r = spawnSync(process.execPath, [BIN, 'check', app, '--ds', PACOTE], { encoding: 'utf8' })
  const problemas = [...r.stdout.matchAll(/^\[([\w-]+)\] (\S+):(\d+) {2}(.*)$/gm)].map((m) => ({ codigo: m[1], arquivo: m[2], detalhe: m[4] }))
  return { status: r.status, problemas, saida: r.stdout + r.stderr }
}

function copiaDoLimpo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-check-'))
  fs.cpSync(path.join(FIX, 'app-limpo'), dir, { recursive: true })
  return dir
}

test('app-limpo passa: saída 0 e nenhum problema', () => {
  const r = check(path.join(FIX, 'app-limpo'))
  assert.equal(r.status, 0, r.saida)
  assert.deepEqual(r.problemas, [])
})

const CASOS = [
  ['src/import-inexistente.tsx', 'import-inexistente', 'ConfirmDialog'],
  ['src/var-sem-declaracao.css', 'var-sem-declaracao', '--color-surface-inventada'],
  ['src/hex-literal.tsx', 'hex-literal', '#004B9B'],
  ['src/login-local.tsx', 'casca-local', 'login-v1-container'],
  ['src/cartao-vidro.css', 'casca-local', 'liquid-card'],
  ['src/casca-hero.tsx', 'casca-local', 'casca-hero-faixa'],
  ['src/cabecalho-local.tsx', 'casca-local', 'PaginaCabecalho'],
  ['src/page-hero-filhos.tsx', 'casca-local', 'PageHero com filhos'],
  ['src/classname-visual.tsx', 'classname-visual', 'Button bg-[var(--color-primary)]'],
  ['src/classname-prefixo.tsx', 'classname-visual', 'Input sm:px-6'],
  ['package.json', 'dependencia-local', 'file:vendor/fips-app-ds-fips-0.21.0.tgz'],
]

for (const [arquivo, codigo, trecho] of CASOS) {
  test(`${arquivo}: falha com ${codigo} e, sem a violação, passa`, () => {
    const app = copiaDoLimpo()
    try {
      const destino = path.join(app, arquivo)
      const original = fs.existsSync(destino) ? fs.readFileSync(destino) : null
      fs.copyFileSync(path.join(FIX, 'app-violacoes', arquivo), destino)
      const r = check(app)
      assert.equal(r.status, 1, r.saida)
      assert.equal(r.problemas.length, 1, r.saida)
      assert.equal(r.problemas[0].codigo, codigo)
      assert.equal(r.problemas[0].arquivo, arquivo)
      assert.ok(r.problemas[0].detalhe.includes(trecho), r.problemas[0].detalhe)
      // mutação: tirar a violação faz passar
      if (original) fs.writeFileSync(destino, original)
      else fs.rmSync(destino)
      const depois = check(app)
      assert.equal(depois.status, 0, depois.saida)
    } finally {
      fs.rmSync(app, { recursive: true, force: true })
    }
  })
}

test('app-violacoes inteiro: uma violação por arquivo, todas acusadas', () => {
  const r = check(path.join(FIX, 'app-violacoes'))
  assert.equal(r.status, 1)
  const achados = r.problemas.map((p) => `${p.arquivo}|${p.codigo}`).sort()
  assert.deepEqual(achados, CASOS.map(([a, c]) => `${a}|${c}`).sort())
})

test('gerar-ai: manifest com exports por tipo, props das *Props e tokens de :root e .dark', async () => {
  const { gerar } = await import('./gerar-ai.mjs')
  const saida = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-ai-'))
  try {
    const { manifest, skill } = gerar({ ds: PACOTE, saida, data: '2026-11-11' })
    assert.equal(manifest.total, 9)
    assert.deepEqual(manifest.exports.componente, ['Button', 'Input', 'PageHeader', 'PageHero'])
    assert.deepEqual(manifest.exports.funcao, ['cn'])
    assert.deepEqual(manifest.exports.valor, ['marca'])
    assert.deepEqual(manifest.props.ButtonProps.find((p) => p.nome === 'variant').valores, ['primary', 'secondary'])
    assert.deepEqual(manifest.tokens.claro, { '--color-fg': '#1a1a1a', '--color-primary': '#004b9b' })
    assert.deepEqual(manifest.tokens.escuro, { '--color-primary': '#93bde4' })
    assert.equal(manifest.padroes.find((p) => p.tela.startsWith('Banner')).noPacote.PageHeader, true)
    assert.equal(manifest.padroes.find((p) => p.tela.startsWith('Casca')).noPacote.AppShell, false)
    assert.match(skill, /^---\nname: design-system-fips\n/)
    assert.match(skill, /gerado por scripts\/gerar-ai\.mjs/)
    assert.deepEqual(fs.readdirSync(saida).sort(), ['SKILL.md', 'manifest.json'])
  } finally {
    fs.rmSync(saida, { recursive: true, force: true })
  }
})

test('npm pack --dry-run leva ai/ e bin/', { skip: !fs.existsSync(path.join(RAIZ, 'ai/manifest.json')) && 'rode o build antes' }, () => {
  const r = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: RAIZ, encoding: 'utf8' })
  const arquivos = JSON.parse(r.stdout)[0].files.map((f) => f.path)
  for (const f of ['ai/manifest.json', 'ai/SKILL.md', 'ai/padroes.json', 'bin/fips-ds.mjs', 'bin/api.mjs', 'eslint/index.js']) assert.ok(arquivos.includes(f), `${f} fora do pacote`)
})

test('número de issue não é cor: "#153" em comentário, texto de JSX e string comum passa', () => {
  const app = copiaDoLimpo()
  try {
    fs.writeFileSync(
      path.join(app, 'src/numero-de-issue.tsx'),
      [
        '// o DS ainda não tem campo de arquivo (#153)',
        '/** ver #153 e #a1b */',
        "export const Aviso = () => <p title=\"veja a issue #153\">Pendente desde o #153</p>",
        "export const ROTULO = 'issue #153 no repositório'",
      ].join('\n'),
    )
    const r = check(app)
    assert.equal(r.status, 0, r.saida)
    // mutação: cor de verdade no mesmo arquivo é acusada
    fs.appendFileSync(path.join(app, 'src/numero-de-issue.tsx'), "\nexport const C = () => <div className=\"bg-[#153]\" style={{ borderColor: '#abc' }} />\n")
    const depois = check(app)
    assert.equal(depois.status, 1, depois.saida)
    assert.deepEqual(depois.problemas.map((p) => p.detalhe).sort(), ['#153', '#abc'])
  } finally {
    fs.rmSync(app, { recursive: true, force: true })
  }
})

test('definição de token com hex no CSS passa; hex fora de token é acusado', () => {
  const app = copiaDoLimpo()
  try {
    const css = path.join(app, 'src/tokens-do-app.css')
    fs.writeFileSync(css, ':root {\n  --color-marca-app: #004b9b;\n  --sombra-app: 0 1px 2px #0000001a;\n}\n')
    const r = check(app)
    assert.equal(r.status, 0, r.saida)
    // mutação: a mesma cor fora de definição de token é acusada
    fs.appendFileSync(css, '.caixa { color: #004b9b; }\n')
    const depois = check(app)
    assert.equal(depois.status, 1, depois.saida)
    assert.deepEqual(depois.problemas.map((p) => `${p.codigo} ${p.detalhe}`), ['hex-literal #004b9b'])
  } finally {
    fs.rmSync(app, { recursive: true, force: true })
  }
})

// ---------- pacote local (vendor) ----------
// tgz pequeno feito com `npm pack` de um pacote mínimo; `.integrity` calculado como o registro calcula (sha512 base64).
import crypto from 'node:crypto'

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const integridade = (arq) => 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(arq)).digest('base64')

function gerarTgz(versao, destino, extra = '') {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-tgz-'))
  try {
    fs.writeFileSync(path.join(src, 'package.json'), JSON.stringify({ name: '@fips-app/ds-fips', version: versao }))
    fs.writeFileSync(path.join(src, 'index.js'), `export const v = '${versao}${extra}'\n`)
    const r = spawnSync(NPM, ['pack', '--ignore-scripts', '--json', '--pack-destination', destino], { cwd: src, encoding: 'utf8' })
    assert.equal(r.status, 0, r.stderr)
    return path.join(destino, JSON.parse(r.stdout)[0].filename)
  } finally {
    fs.rmSync(src, { recursive: true, force: true })
  }
}

// app limpo com a dependência apontando para vendor/fips-app-ds-fips-<versao>.tgz
function appVendor(versao, { versaoDentro = versao, integrity = 'certa', lock } = {}) {
  const app = copiaDoLimpo()
  const vendor = path.join(app, 'vendor')
  fs.mkdirSync(vendor)
  const nome = `fips-app-ds-fips-${versao}.tgz`
  const feito = gerarTgz(versaoDentro, vendor)
  if (path.basename(feito) !== nome) fs.renameSync(feito, path.join(vendor, nome))
  const tgz = path.join(vendor, nome)
  if (integrity === 'certa') fs.writeFileSync(`${tgz}.integrity`, integridade(tgz) + '\n')
  else if (integrity === 'outro') {
    const outro = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-outro-'))
    fs.writeFileSync(`${tgz}.integrity`, integridade(gerarTgz(versao, outro, '-branch')) + '\n')
    fs.rmSync(outro, { recursive: true, force: true })
  }
  const espec = `file:vendor/${nome}`
  fs.writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: 'app-vendor', private: true, dependencies: { '@fips-app/ds-fips': espec } }))
  if (lock) {
    fs.writeFileSync(path.join(app, 'package-lock.json'), JSON.stringify({
      lockfileVersion: 3, packages: { 'node_modules/@fips-app/ds-fips': { version: versao, resolved: lock, integrity: integridade(tgz) } },
    }))
  }
  return { app, tgz, espec }
}

function soDependencia(r, trecho) {
  assert.equal(r.status, 1, r.saida)
  assert.equal(r.problemas.length, 1, r.saida)
  assert.equal(r.problemas[0].codigo, 'dependencia-local')
  assert.equal(r.problemas[0].arquivo, 'package.json')
  assert.ok(r.problemas[0].detalhe.includes(trecho), r.problemas[0].detalhe)
}

test('vendor: tgz com .integrity certo e versão igual passa', () => {
  const { app } = appVendor('0.23.1', { lock: 'file:vendor/fips-app-ds-fips-0.23.1.tgz' })
  try {
    const r = check(app)
    assert.equal(r.status, 0, r.saida)
    assert.deepEqual(r.problemas, [])
  } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: .integrity de outro tgz (tgz de branch) falha dependencia-local', () => {
  const { app } = appVendor('0.23.1', { integrity: 'outro' })
  try { soDependencia(check(app), 'integridade') } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: tgz trocado à mão depois do vendor falha dependencia-local', () => {
  const { app, tgz } = appVendor('0.23.1')
  try {
    assert.equal(check(app).status, 0)
    fs.copyFileSync(gerarTgz('0.23.1', fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-mao-')), '-mao'), tgz)
    soDependencia(check(app), 'integridade')
  } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: sem .integrity falha dependencia-local', () => {
  const { app } = appVendor('0.23.1', { integrity: 'nenhuma' })
  try { soDependencia(check(app), '.integrity') } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: versão dentro do tgz diferente da do nome falha dependencia-local', () => {
  const { app } = appVendor('0.23.1', { versaoDentro: '0.21.0' })
  try { soDependencia(check(app), '0.21.0') } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: lock com resolved em outro arquivo falha dependencia-local', () => {
  const { app } = appVendor('0.23.1', { lock: 'file:vendor/fips-app-ds-fips-0.21.0.tgz' })
  try { soDependencia(check(app), 'package-lock.json') } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

test('vendor: dois tgz em vendor/ avisa e usa só o referenciado', () => {
  const { app } = appVendor('0.23.1')
  try {
    gerarTgz('0.21.0', path.join(app, 'vendor'))
    const r = check(app)
    assert.equal(r.status, 0, r.saida)
    assert.match(r.saida, /aviso: vendor\/ tem 2 tgz do pacote; vale só o referenciado: vendor\/fips-app-ds-fips-0\.23\.1\.tgz/)
  } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

// `fips-ds vendor` com um `npm` falso no PATH: view devolve a integridade, pack copia o tgz, install grava o package.json.
function npmFalso(dir, tgzOrigem, integrityRegistro) {
  const bin = path.join(dir, 'bin-falso')
  fs.mkdirSync(bin)
  const log = path.join(dir, 'npm.log')
  const js = `#!${process.execPath}
const fs = require('fs'), path = require('path')
const a = process.argv.slice(2)
fs.appendFileSync(${JSON.stringify(log)}, a.join(' ') + '\\n')
if (a[0] === 'view') { process.stdout.write(${JSON.stringify(integrityRegistro)} + '\\n'); process.exit(0) }
if (a[0] === 'pack') {
  const d = a[a.indexOf('--pack-destination') + 1]
  const nome = 'fips-app-ds-fips-' + a[1].split('@').pop() + '.tgz'
  fs.copyFileSync(${JSON.stringify(tgzOrigem)}, path.join(d, nome))
  process.stdout.write(JSON.stringify([{ filename: nome }])); process.exit(0)
}
if (a[0] === 'install') {
  const p = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  p.dependencies = { ...p.dependencies, '@fips-app/ds-fips': a.find((x) => x.startsWith('file:')) }
  fs.writeFileSync('package.json', JSON.stringify(p)); process.exit(0)
}
process.exit(9)
`
  fs.writeFileSync(path.join(bin, 'npm'), js, { mode: 0o755 })
  return { bin, log }
}

function rodarVendor(app, versao, bin) {
  return spawnSync(process.execPath, [BIN, 'vendor', versao, app], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` } })
}

test('fips-ds vendor: baixa, confere com o registro, grava .integrity e a dependência; o check passa', { skip: process.platform === 'win32' }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-vendor-'))
  const app = copiaDoLimpo()
  try {
    const tgz = gerarTgz('0.23.1', tmp)
    const { bin, log } = npmFalso(tmp, tgz, integridade(tgz))
    const r = rodarVendor(app, '0.23.1', bin)
    assert.equal(r.status, 0, r.stdout + r.stderr)
    const alvo = path.join(app, 'vendor/fips-app-ds-fips-0.23.1.tgz')
    assert.equal(fs.readFileSync(`${alvo}.integrity`, 'utf8').trim(), integridade(tgz))
    assert.equal(JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8')).dependencies['@fips-app/ds-fips'], 'file:vendor/fips-app-ds-fips-0.23.1.tgz')
    assert.match(fs.readFileSync(log, 'utf8'), /^view @fips-app\/ds-fips@0\.23\.1 dist\.integrity/m)
    assert.match(fs.readFileSync(log, 'utf8'), /^install --save-exact file:vendor\/fips-app-ds-fips-0\.23\.1\.tgz/m)
    assert.equal(check(app).status, 0)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
    fs.rmSync(app, { recursive: true, force: true })
  }
})

test('fips-ds vendor: tgz baixado diferente do registro sai com erro e não deixa nada em vendor/', { skip: process.platform === 'win32' }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-vendor-'))
  const app = copiaDoLimpo()
  try {
    const tgz = gerarTgz('0.23.1', tmp)
    const outro = gerarTgz('0.23.1', fs.mkdtempSync(path.join(tmp, 'o-')), '-branch')
    const { bin, log } = npmFalso(tmp, tgz, integridade(outro))
    const r = rodarVendor(app, '0.23.1', bin)
    assert.equal(r.status, 2, r.stdout + r.stderr)
    assert.match(r.stderr, /integridade/)
    assert.deepEqual(fs.readdirSync(path.join(app, 'vendor')), [])
    assert.doesNotMatch(fs.readFileSync(log, 'utf8'), /^install/m)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
    fs.rmSync(app, { recursive: true, force: true })
  }
})
