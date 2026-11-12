#!/usr/bin/env node
// npx fips-ds passo0 [pasta]          versão instalada x registro, regime, padrões por tela, contagem de exports
// npx fips-ds check [pasta] [--ds <pasta-do-pacote>]   confere o app; sai com 1 e relatório quando acha problema
// npx fips-ds vendor <versão> [pasta]   baixa a versão publicada para vendor/ com o .integrity do registro e instala
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { PACOTE, REGRAS, VENDOR, carregarTs, conferir, lerApi, localizarPacote, vendor } from './api.mjs'

const [cmd, ...resto] = process.argv.slice(2)
const opcao = (nome) => { const i = resto.indexOf(nome); return i >= 0 ? resto[i + 1] : undefined }
const pastaApp = path.resolve(resto.find((a, i) => !a.startsWith('--') && resto[i - 1] !== '--ds') || '.')

function regime(app) {
  const pkgPath = path.join(app, 'package.json')
  if (!fs.existsSync(pkgPath)) return { regime: 'sem package.json', especificacao: null }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const v = pkg.dependencies?.[PACOTE] ?? pkg.devDependencies?.[PACOTE]
  if (!v) {
    const uiSup = fs.existsSync(path.join(app, 'src/components/ui-sup')) || fs.existsSync(path.join(app, 'src/ui-sup'))
    return { regime: uiSup ? 'ui-sup (sem o pacote): respeitar a API local' : 'ui própria (sem o pacote): respeitar a API local', especificacao: null }
  }
  if (VENDOR.test(v)) return { regime: 'pacote local da versão publicada (vendor/; o check confere a integridade)', especificacao: v }
  if (/^(file:|link:|https?:|git)/.test(v) || /\.tgz$/.test(v)) return { regime: 'pacote por arquivo local (não confiável; o certo é o registro)', especificacao: v }
  return { regime: 'pacote do registro', especificacao: v }
}

function latest() {
  if (!process.env.NODE_AUTH_TOKEN && !process.env.GITHUB_TOKEN) return 'sem token (defina NODE_AUTH_TOKEN para consultar o registro)'
  try {
    return execFileSync('npm', ['view', PACOTE, 'version'], { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return 'registro não respondeu'
  }
}

function passo0() {
  const r = regime(pastaApp)
  const pacote = localizarPacote(opcao('--ds') ? path.resolve(opcao('--ds')) : path.join(pastaApp, 'node_modules', PACOTE))
  console.log(`app: ${pastaApp}`)
  console.log(`regime: ${r.regime}${r.especificacao ? ` ("${r.especificacao}")` : ''}`)
  if (!pacote) { console.log(`${PACOTE} não instalado`); return 0 }
  console.log(`instalado: ${pacote.versao}`)
  console.log(`registro (latest): ${latest()}`)
  let manifest = fs.existsSync(pacote.manifest) ? JSON.parse(fs.readFileSync(pacote.manifest, 'utf8')) : null
  if (!manifest && fs.existsSync(pacote.dts)) {
    const api = lerApi(carregarTs(pastaApp, pacote.pasta), pacote.dts)
    manifest = { total: api.exports.length, exports: Object.groupBy(api.exports, (e) => e.tipo) }
    for (const k of Object.keys(manifest.exports)) manifest.exports[k] = manifest.exports[k].map((e) => e.nome)
  }
  if (manifest) {
    const porTipo = Object.entries(manifest.exports).map(([k, v]) => `${v.length} ${k}`).join(', ')
    console.log(`exports: ${manifest.total} (${porTipo})`)
  }
  if (manifest?.padroes) {
    console.log('padrão por tela:')
    for (const p of manifest.padroes) {
      const comps = p.componentes.map((c) => (p.noPacote[c] ? c : `${c} (FALTA nesta versão${p.desde ? `; desde a ${p.desde}` : ''})`)).join(', ')
      console.log(`  ${p.tela}: ${comps}. Referência: ${p.referencia}${p.nota ? `. ${p.nota}` : ''}`)
    }
    console.log(`regras completas: ${path.relative(pastaApp, path.join(pacote.pasta, 'ai/SKILL.md'))}`)
  }
  return 0
}

function check() {
  const { problemas, avisos, pacote, arquivos } = conferir(pastaApp, { ds: opcao('--ds') })
  for (const a of avisos) console.log(`aviso: ${a}`)
  if (pacote) console.log(`${PACOTE} ${pacote.versao}; ${arquivos} arquivo(s) lidos em ${pastaApp}`)
  for (const p of problemas) console.log(`[${p.codigo}] ${p.arquivo}:${p.linha}  ${p.detalhe}`)
  const porCodigo = REGRAS.map((r) => `${r.codigo}=${problemas.filter((p) => p.codigo === r.codigo).length}`).join(' ')
  console.log(`${problemas.length} problema(s): ${porCodigo}`)
  return problemas.length ? 1 : 0
}

function cmdVendor() {
  const [versao, pasta] = resto.filter((a) => !a.startsWith('--'))
  vendor(path.resolve(pasta || '.'), versao, { log: (l) => console.log(l) })
  return 0
}

function ajuda() {
  console.log('uso: fips-ds passo0 [pasta] | fips-ds check [pasta] [--ds <pasta-do-pacote>] | fips-ds vendor <versão> [pasta]')
  console.log('o check confere:')
  for (const r of REGRAS) console.log(`  ${r.codigo}: ${r.descricao.replace(/`/g, '')}`)
  return cmd ? 2 : 0
}

try {
  process.exitCode = cmd === 'passo0' ? passo0() : cmd === 'check' ? check() : cmd === 'vendor' ? cmdVendor() : ajuda()
} catch (e) {
  console.error(`erro: ${e.message}`)
  process.exitCode = 2
}
