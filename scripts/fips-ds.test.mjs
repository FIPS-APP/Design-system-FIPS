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
import { npmComando, rodarNpm } from '../bin/api.mjs'
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
  ['package.json', 'dependencia-local', 'file:../x/fips-app-ds-fips-0.21.0.tgz'],
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

const integridade = (arq) => 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(arq)).digest('base64')

function gerarTgz(versao, destino, extra = '') {
  const src = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-tgz-'))
  try {
    fs.writeFileSync(path.join(src, 'package.json'), JSON.stringify({ name: '@fips-app/ds-fips', version: versao }))
    fs.writeFileSync(path.join(src, 'index.js'), `export const v = '${versao}${extra}'\n`)
    // npm pelo node, sem shell (no Windows `npm.cmd` sem shell dá EINVAL)
    const saida = rodarNpm(['pack', '--ignore-scripts', '--json', '--pack-destination', destino], { cwd: src, encoding: 'utf8' })
    return path.join(destino, JSON.parse(saida)[0].filename)
  } finally {
    fs.rmSync(src, { recursive: true, force: true })
  }
}

// app limpo com a dependência apontando para vendor/fips-app-ds-fips-<versao>.tgz
function appVendor(versao, { versaoDentro = versao, integrity = 'certa', lock, lockIntegrity } = {}) {
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
      lockfileVersion: 3, packages: { 'node_modules/@fips-app/ds-fips': { version: versao, resolved: lock, integrity: lockIntegrity ?? integridade(tgz) } },
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

test('vendor: lock com outra integridade para o mesmo arquivo falha dependencia-local', () => {
  const { app } = appVendor('0.23.1', { lock: 'file:vendor/fips-app-ds-fips-0.23.1.tgz', lockIntegrity: 'sha512-' + Buffer.alloc(64, 1).toString('base64') })
  try { soDependencia(check(app), 'outra integridade') } finally { fs.rmSync(app, { recursive: true, force: true }) }
})

for (const espec of ['file:../x/fips-app-ds-fips-0.23.1.tgz', 'link:../ds', 'https://exemplo.com/fips-app-ds-fips-0.23.1.tgz', 'file:../../vendor/fips-app-ds-fips-0.23.1.tgz']) {
  test(`vendor: ${espec} (fora de vendor/) falha dependencia-local mesmo com tgz e .integrity certos`, () => {
    const { app } = appVendor('0.23.1')
    try {
      fs.writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: 'a', private: true, dependencies: { '@fips-app/ds-fips': espec } }))
      soDependencia(check(app), espec)
    } finally { fs.rmSync(app, { recursive: true, force: true }) }
  })
}

test('vendor: package.json em subpasta app/ com file:../vendor/ passa e o tgz fora de vendor/ da raiz não', () => {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-sub-'))
  try {
    const { app } = appVendor('0.23.1')
    const sub = path.join(raiz, 'app')
    fs.cpSync(app, sub, { recursive: true })
    fs.renameSync(path.join(sub, 'vendor'), path.join(raiz, 'vendor'))
    fs.writeFileSync(path.join(sub, 'package.json'), JSON.stringify({ name: 'a', private: true, dependencies: { '@fips-app/ds-fips': 'file:../vendor/fips-app-ds-fips-0.23.1.tgz' } }))
    fs.rmSync(app, { recursive: true, force: true })
    const r = check(sub)
    assert.equal(r.status, 0, r.saida)
    fs.rmSync(path.join(raiz, 'vendor/fips-app-ds-fips-0.23.1.tgz.integrity'))
    soDependencia(check(sub), '.integrity')
  } finally { fs.rmSync(raiz, { recursive: true, force: true }) }
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

// `fips-ds vendor` com um npm falso: um `.js` que o vendor roda pelo node (`npm_execpath`), igual em Linux, macOS e Windows.
// view devolve a integridade, pack copia o tgz, install grava o package.json; `falha` faz o view sair com E403.
function npmFalso(dir, tgzOrigem, integrityRegistro, { falha = false } = {}) {
  const js = path.join(dir, 'npm-falso.js')
  const log = path.join(dir, 'npm.log')
  fs.writeFileSync(js, `const fs = require('fs'), path = require('path')
const a = process.argv.slice(2)
fs.appendFileSync(${JSON.stringify(log)}, a.join(' ') + '\\n')
if (a[0] === 'view') {
  if (${falha}) { process.stderr.write('npm error code E403\\nnpm error 403 Forbidden - read_package\\n'); process.exit(1) }
  process.stdout.write(${JSON.stringify(integrityRegistro)} + '\\n'); process.exit(0)
}
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
`)
  return { js, log }
}

function rodarVendor(app, versao, js, { token = 'ghp_falso' } = {}) {
  const env = { ...process.env, npm_execpath: js }
  delete env.NODE_AUTH_TOKEN
  if (token) env.NODE_AUTH_TOKEN = token
  return spawnSync(process.execPath, [BIN, 'vendor', versao, app], { encoding: 'utf8', env })
}

function comTmpEApp(fn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-vendor-'))
  const app = copiaDoLimpo()
  try { fn(tmp, app) } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
    fs.rmSync(app, { recursive: true, force: true })
  }
}

test('fips-ds vendor: baixa, confere com o registro, grava .integrity e a dependência; o check passa', () => {
  comTmpEApp((tmp, app) => {
    const tgz = gerarTgz('0.23.1', tmp)
    const { js, log } = npmFalso(tmp, tgz, integridade(tgz))
    const r = rodarVendor(app, '0.23.1', js)
    assert.equal(r.status, 0, r.stdout + r.stderr)
    const alvo = path.join(app, 'vendor/fips-app-ds-fips-0.23.1.tgz')
    assert.equal(fs.readFileSync(`${alvo}.integrity`, 'utf8').trim(), integridade(tgz))
    assert.equal(JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8')).dependencies['@fips-app/ds-fips'], 'file:vendor/fips-app-ds-fips-0.23.1.tgz')
    const chamadas = fs.readFileSync(log, 'utf8')
    assert.match(chamadas, /^view @fips-app\/ds-fips@0\.23\.1 dist\.integrity --@fips-app:registry=https:\/\/npm\.pkg\.github\.com$/m)
    assert.match(chamadas, /^pack @fips-app\/ds-fips@0\.23\.1 --pack-destination .* --json --@fips-app:registry=https:\/\/npm\.pkg\.github\.com$/m)
    assert.match(chamadas, /^install --save-exact file:vendor\/fips-app-ds-fips-0\.23\.1\.tgz --@fips-app:registry=https:\/\/npm\.pkg\.github\.com$/m)
    assert.deepEqual(fs.readdirSync(app).filter((f) => f.startsWith('.fips-ds-vendor-')), [], 'pasta temporária removida')
    assert.equal(check(app).status, 0)
  })
})

test('fips-ds vendor: nova versão remove o tgz e o .integrity da anterior', () => {
  comTmpEApp((tmp, app) => {
    fs.mkdirSync(path.join(app, 'vendor'))
    for (const f of ['fips-app-ds-fips-0.21.0.tgz', 'fips-app-ds-fips-0.21.0.tgz.integrity']) fs.writeFileSync(path.join(app, 'vendor', f), 'velho')
    const tgz = gerarTgz('0.23.1', tmp)
    const { js } = npmFalso(tmp, tgz, integridade(tgz))
    const r = rodarVendor(app, '0.23.1', js)
    assert.equal(r.status, 0, r.stdout + r.stderr)
    assert.deepEqual(fs.readdirSync(path.join(app, 'vendor')).sort(), ['fips-app-ds-fips-0.23.1.tgz', 'fips-app-ds-fips-0.23.1.tgz.integrity'])
  })
})

test('fips-ds vendor: mesma versão com tgz divergente não apaga o que já estava em vendor/', () => {
  comTmpEApp((tmp, app) => {
    const tgz = gerarTgz('0.23.1', tmp)
    const outro = gerarTgz('0.23.1', fs.mkdtempSync(path.join(tmp, 'o-')), '-branch')
    fs.mkdirSync(path.join(app, 'vendor'))
    const atual = path.join(app, 'vendor/fips-app-ds-fips-0.23.1.tgz')
    fs.copyFileSync(tgz, atual)
    const { js } = npmFalso(tmp, tgz, integridade(outro))
    const r = rodarVendor(app, '0.23.1', js)
    assert.equal(r.status, 2, r.stdout + r.stderr)
    assert.equal(fs.readFileSync(atual).equals(fs.readFileSync(tgz)), true)
  })
})

test('fips-ds vendor: tgz baixado diferente do registro sai com erro e não cria vendor/', () => {
  comTmpEApp((tmp, app) => {
    const tgz = gerarTgz('0.23.1', tmp)
    const outro = gerarTgz('0.23.1', fs.mkdtempSync(path.join(tmp, 'o-')), '-branch')
    const { js, log } = npmFalso(tmp, tgz, integridade(outro))
    const r = rodarVendor(app, '0.23.1', js)
    assert.equal(r.status, 2, r.stdout + r.stderr)
    assert.match(r.stderr, /integridade/)
    assert.equal(fs.existsSync(path.join(app, 'vendor')), false)
    assert.doesNotMatch(fs.readFileSync(log, 'utf8'), /^install/m)
  })
})

test('fips-ds vendor: sem NODE_AUTH_TOKEN diz o que definir e não chama o npm nem grava nada', () => {
  comTmpEApp((tmp, app) => {
    const tgz = gerarTgz('0.23.1', tmp)
    const { js, log } = npmFalso(tmp, tgz, integridade(tgz))
    const r = rodarVendor(app, '0.23.1', js, { token: '' })
    assert.equal(r.status, 2, r.stdout + r.stderr)
    assert.match(r.stderr, /NODE_AUTH_TOKEN.*read:packages/)
    assert.equal(fs.existsSync(log), false)
    assert.equal(fs.existsSync(path.join(app, 'vendor')), false)
  })
})

test('fips-ds vendor: E403 do registro vira mensagem sobre o token, sem a saída crua do npm', () => {
  comTmpEApp((tmp, app) => {
    const tgz = gerarTgz('0.23.1', tmp)
    const { js } = npmFalso(tmp, tgz, integridade(tgz), { falha: true })
    const r = rodarVendor(app, '0.23.1', js)
    assert.equal(r.status, 2, r.stdout + r.stderr)
    assert.match(r.stderr, /recusou o token \(E401\/E403\).*read:packages/)
    assert.doesNotMatch(r.stderr, /Command failed/)
    assert.equal(fs.existsSync(path.join(app, 'vendor')), false)
  })
})

// ---------- como o vendor chama o npm (Windows: sem npm.cmd, sem shell) ----------
test('npmComando: com npm_execpath .js existente roda pelo node, sem shell', () => {
  const r = npmComando({ env: { npm_execpath: 'C:\\n\\node_modules\\npm\\bin\\npm-cli.js' }, execPath: 'C:\\n\\node.exe', existe: () => true, plataforma: 'win32' })
  assert.deepEqual(r, { cmd: 'C:\\n\\node.exe', prefixo: ['C:\\n\\node_modules\\npm\\bin\\npm-cli.js'] })
})

test('npmComando: win32 sem npm_execpath usa o npm-cli.js ao lado do node', () => {
  const vistos = []
  const r = npmComando({ env: {}, execPath: 'C:\\Program Files\\nodejs\\node.exe', existe: (f) => (vistos.push(f), true), plataforma: 'win32' })
  assert.deepEqual(r, { cmd: 'C:\\Program Files\\nodejs\\node.exe', prefixo: ['C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js'] })
  assert.deepEqual(vistos, ['C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js'])
})

test('npmComando: npm_execpath que não é .js ou não existe cai no plano B, e sem nenhum cai em npm (nunca npm.cmd)', () => {
  const planoB = 'C:\\n\\node_modules\\npm\\bin\\npm-cli.js'
  assert.deepEqual(npmComando({ env: { npm_execpath: 'C:\\n\\npm.cmd' }, execPath: 'C:\\n\\node.exe', existe: () => true, plataforma: 'win32' }).prefixo, [planoB])
  assert.deepEqual(npmComando({ env: { npm_execpath: 'C:\\x\\npm-cli.js' }, execPath: 'C:\\n\\node.exe', existe: (f) => f === planoB, plataforma: 'win32' }).prefixo, [planoB])
  assert.deepEqual(npmComando({ env: {}, execPath: 'C:\\n\\node.exe', existe: () => false, plataforma: 'win32' }), { cmd: 'npm', prefixo: [] })
  assert.deepEqual(npmComando({ env: {}, execPath: '/usr/bin/node', existe: () => false, plataforma: 'linux' }), { cmd: 'npm', prefixo: [] })
})

test('rodarNpm: argumento com espaço chega inteiro (sem shell)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fips-ds-esp-'))
  try {
    const js = path.join(tmp, 'eco.js')
    fs.writeFileSync(js, 'process.stdout.write(JSON.stringify(process.argv.slice(2)))')
    const saida = rodarNpm(['--pack-destination', 'C:\\OneDrive - Rumo\\app'], { encoding: 'utf8' }, { cmd: process.execPath, prefixo: [js] })
    assert.deepEqual(JSON.parse(saida), ['--pack-destination', 'C:\\OneDrive - Rumo\\app'])
  } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
})
