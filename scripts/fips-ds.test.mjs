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
