/**
 * Regra de publicação do `publish.yml` (FIPS-1167).
 * Rodar: npm run test:publicar
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { decidir } from './publicar-decisao.mjs'

const SCRIPT = fileURLToPath(new URL('./publicar-decisao.mjs', import.meta.url))

test('main com a versão mudada e fora do registro: publica e cria a tag', () => {
  const r = decidir({ evento: 'main', versaoAntes: '0.20.29', versaoAtual: '0.20.30', jaPublicada: false })
  assert.deepEqual([r.acao, r.criarTag], ['publicar', true])
})

test('main sem mudança de versão e já no registro: não publica, não falha', () => {
  const r = decidir({ evento: 'main', versaoAntes: '0.20.30', versaoAtual: '0.20.30', jaPublicada: true })
  assert.deepEqual([r.acao, r.criarTag], ['pular', false])
})

test('main sem mudança de versão e fora do registro (run anterior falhou ou foi cancelado): publica', () => {
  const r = decidir({ evento: 'main', versaoAntes: '0.20.30', versaoAtual: '0.20.30', jaPublicada: false })
  assert.deepEqual([r.acao, r.criarTag], ['publicar', true])
})

test('main com a versão mudada para uma que já existe: falha dizendo qual versão', () => {
  const r = decidir({ evento: 'main', versaoAntes: '0.20.31', versaoAtual: '0.20.30', jaPublicada: true })
  assert.equal(r.acao, 'falhar')
  assert.match(r.mensagem, /0\.20\.30/)
  assert.match(r.mensagem, /já existe no registro/)
})

test('main com commit anterior desconhecido: só publica o que o registro não tem', () => {
  assert.equal(decidir({ evento: 'main', versaoAntes: '', versaoAtual: '0.20.30', jaPublicada: true }).acao, 'pular')
  const r = decidir({ evento: 'main', versaoAntes: '', versaoAtual: '0.20.30', jaPublicada: false })
  assert.deepEqual([r.acao, r.criarTag], ['publicar', true])
})

test('tag à mão: publica se a versão não existe, sem criar outra tag', () => {
  const r = decidir({ evento: 'tag', tag: 'v0.20.30', versaoAtual: '0.20.30', jaPublicada: false })
  assert.deepEqual([r.acao, r.criarTag], ['publicar', false])
})

test('tag à mão depois da publicação por bump: não publica duas vezes a mesma versão', () => {
  const r = decidir({ evento: 'tag', tag: 'v0.20.30', versaoAtual: '0.20.30', jaPublicada: true })
  assert.equal(r.acao, 'pular')
})

test('tag que não bate com o package.json: falha', () => {
  const r = decidir({ evento: 'tag', tag: 'v0.20.31', versaoAtual: '0.20.30', jaPublicada: false })
  assert.equal(r.acao, 'falhar')
})

test('o script de linha de comando escreve as saídas e sai com 1 no caso de falha', () => {
  const dir = mkdtempSync(join(tmpdir(), 'publicar-'))
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ version: '0.20.30' }))
    const saida = join(dir, 'saida.txt')
    writeFileSync(saida, '')
    const base = { ...process.env, GITHUB_OUTPUT: saida, GITHUB_REF_TYPE: 'branch', GITHUB_REF_NAME: 'main' }
    const ok = spawnSync('node', [SCRIPT], { cwd: dir, env: { ...base, VERSAO_ANTES: '0.20.29', JA_PUBLICADA: 'false' }, encoding: 'utf8' })
    assert.equal(ok.status, 0)
    assert.match(readFileSync(saida, 'utf8'), /acao=publicar\ncriar_tag=true\nversao=0\.20\.30\n/)
    const falha = spawnSync('node', [SCRIPT], { cwd: dir, env: { ...base, VERSAO_ANTES: '0.20.29', JA_PUBLICADA: 'true' }, encoding: 'utf8' })
    assert.equal(falha.status, 1)
    assert.match(falha.stdout, /::error/)

    // Tag empurrada à mão: o script lê GITHUB_REF_TYPE e GITHUB_REF_NAME, não trata como push na main.
    const tag = { ...process.env, GITHUB_OUTPUT: saida, GITHUB_REF_TYPE: 'tag', JA_PUBLICADA: 'false', VERSAO_ANTES: '' }
    writeFileSync(saida, '')
    const tagOk = spawnSync('node', [SCRIPT], { cwd: dir, env: { ...tag, GITHUB_REF_NAME: 'v0.20.30' }, encoding: 'utf8' })
    assert.equal(tagOk.status, 0)
    assert.match(readFileSync(saida, 'utf8'), /acao=publicar\ncriar_tag=false\nversao=0\.20\.30\n/)
    const tagErrada = spawnSync('node', [SCRIPT], { cwd: dir, env: { ...tag, GITHUB_REF_NAME: 'v0.20.31' }, encoding: 'utf8' })
    assert.equal(tagErrada.status, 1)
    assert.match(tagErrada.stdout, /não bate com a versão/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

// Consulta ao registro (scripts/registro-versao.sh): um `npm` falso no PATH responde o que o
// registro responderia. Só "não existe" (E404) vira ja_publicada=false; outro erro falha o passo.
const CONSULTA = fileURLToPath(new URL('./registro-versao.sh', import.meta.url))

function consultar(npmFalso) {
  const dir = mkdtempSync(join(tmpdir(), 'registro-'))
  try {
    mkdirSync(join(dir, 'bin'))
    writeFileSync(join(dir, 'bin', 'npm'), `#!/usr/bin/env bash\n${npmFalso}\n`)
    chmodSync(join(dir, 'bin', 'npm'), 0o755)
    const saida = join(dir, 'saida.txt')
    writeFileSync(saida, '')
    const r = spawnSync('bash', [CONSULTA], {
      env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}`, GITHUB_OUTPUT: saida, NOME: '@fips-app/ds-fips', VERSAO: '0.21.9' },
      encoding: 'utf8',
    })
    return { status: r.status, stdout: r.stdout, saida: readFileSync(saida, 'utf8') }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('registro tem a versão: grava ja_publicada=true', () => {
  const r = consultar('echo 0.21.9')
  assert.equal(r.status, 0)
  assert.equal(r.saida, 'ja_publicada=true\n')
})

test('registro responde E404 (versão ou pacote inexistente): grava ja_publicada=false', () => {
  const r = consultar('echo "npm error code E404" >&2; exit 1')
  assert.equal(r.status, 0)
  assert.equal(r.saida, 'ja_publicada=false\n')
})

test('registro inacessível ou sem permissão: o passo falha com a mensagem do npm e não grava nada', () => {
  for (const codigo of ['ECONNREFUSED', 'E401', 'E403']) {
    const r = consultar(`echo "npm error code ${codigo}" >&2; exit 1`)
    assert.equal(r.status, 1, codigo)
    assert.equal(r.saida, '', codigo)
    assert.match(r.stdout, new RegExp(codigo), codigo)
  }
})
