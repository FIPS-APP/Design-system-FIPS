/**
 * Regra de publicação do `publish.yml` (FIPS-1167).
 * Rodar: npm run test:publicar
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

test('main sem mudança de versão: não publica, não falha', () => {
  const r = decidir({ evento: 'main', versaoAntes: '0.20.30', versaoAtual: '0.20.30', jaPublicada: true })
  assert.deepEqual([r.acao, r.criarTag], ['pular', false])
  const semRegistro = decidir({ evento: 'main', versaoAntes: '0.20.30', versaoAtual: '0.20.30', jaPublicada: false })
  assert.equal(semRegistro.acao, 'pular')
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
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
