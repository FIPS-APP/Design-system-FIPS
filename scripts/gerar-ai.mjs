#!/usr/bin/env node
// Gera `ai/manifest.json` e `ai/SKILL.md` a partir do pacote construído (roda no fim do `npm run build`)
// e copia o SKILL.md para `skills/design-system-fips/SKILL.md`.
//
//   node scripts/gerar-ai.mjs                       pacote = raiz do repo (dist/), data = entrada da versão no changelog
//   node scripts/gerar-ai.mjs --ds <pasta> --saida <pasta> --data AAAA-MM-DD --sem-skill
//
// Exports e props: compilador do TypeScript sobre o `.d.ts`. Tokens: `:root` e `.dark` do `styles.css`.
// Padrões por tela, proibições e regimes: `ai/padroes.json` (versionado). Nada mais é digitado aqui.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { REGRAS, carregarTs, lerApi, lerTokens, localizarPacote } from '../bin/api.mjs'

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const opcao = (nome) => { const i = args.indexOf(nome); return i >= 0 ? args[i + 1] : undefined }

function dataDaVersao(versao) {
  const txt = fs.readFileSync(path.join(RAIZ, 'src/docs/data/changelog.ts'), 'utf8')
  const m = txt.match(new RegExp(`version:\\s*'${versao.replace(/\./g, '\\.')}',\\s*date:\\s*'(\\d{4}-\\d{2}-\\d{2})'`))
  if (!m) throw new Error(`versão ${versao} sem entrada em src/docs/data/changelog.ts`)
  return m[1]
}

export function gerar({ ds = RAIZ, saida = path.join(RAIZ, 'ai'), data, padroesPath = path.join(RAIZ, 'ai/padroes.json') } = {}) {
  const pacote = localizarPacote(ds)
  if (!pacote || !fs.existsSync(pacote.dts)) throw new Error(`sem ${pacote?.dts ?? ds}: rode o build antes`)
  const api = lerApi(carregarTs(ds, RAIZ), pacote.dts)
  const tokens = lerTokens(pacote.css)
  const entrada = JSON.parse(fs.readFileSync(padroesPath, 'utf8'))
  const nomes = new Set(api.exports.map((e) => e.nome))
  const exportsPorTipo = {}
  for (const tipo of ['componente', 'funcao', 'valor', 'tipo']) exportsPorTipo[tipo] = api.exports.filter((e) => e.tipo === tipo).map((e) => e.nome)
  const padroes = entrada.padroes.map((p) => ({ ...p, noPacote: Object.fromEntries(p.componentes.map((c) => [c, nomes.has(c)])) }))
  const manifest = {
    pacote: '@fips-app/ds-fips',
    versao: pacote.versao,
    data: data ?? dataDaVersao(pacote.versao),
    typescript: api.typescript,
    total: api.exports.length,
    exports: exportsPorTipo,
    props: api.props,
    tokens,
    padroes,
    marca: entrada.marca,
    proibicoes: entrada.proibicoes,
    regimes: entrada.regimes,
    antesDePronto: entrada.antesDePronto,
    check: REGRAS,
  }
  const skill = textoSkill(manifest)
  fs.mkdirSync(saida, { recursive: true })
  fs.writeFileSync(path.join(saida, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n')
  fs.writeFileSync(path.join(saida, 'SKILL.md'), skill)
  return { manifest, skill }
}

export function textoSkill(m) {
  const l = []
  const nTokens = new Set([...Object.keys(m.tokens.claro), ...Object.keys(m.tokens.escuro)]).size
  l.push('---')
  l.push('name: design-system-fips')
  l.push(`description: Use antes de criar, editar ou revisar tela, componente ou CSS de app FIPS. Regras do @fips-app/ds-fips ${m.versao}, geradas do pacote; o pacote instalado no app vence este texto.`)
  l.push('---')
  l.push('')
  l.push('<!-- gerado por scripts/gerar-ai.mjs (dist + ai/padroes.json); não edite à mão -->')
  l.push('')
  l.push(`# Design System FIPS ${m.versao} (${m.data})`)
  l.push('')
  l.push(`Gerado do pacote: ${m.total} exports (${Object.entries(m.exports).map(([k, v]) => `${v.length} ${k}`).join(', ')}), ${Object.keys(m.props).length} tipos \`*Props\`, ${nTokens} variáveis CSS em \`:root\`/\`.dark\`. Lista completa em \`ai/manifest.json\` (\`@fips-app/ds-fips/ai/manifest.json\`).`)
  l.push('')
  l.push('## 1. Passo 0')
  l.push('1. No app: `npx fips-ds passo0`. Mostra versão instalada e do registro, regime, padrões da tela e exports.')
  l.push('2. Nome, prop, variante ou token: só o que está em `node_modules/@fips-app/ds-fips/ai/manifest.json`, no `dist/index.d.ts` ou no `dist/styles.css` instalados. Se este texto divergir do pacote instalado, vale o pacote.')
  l.push('')
  l.push('## 2. Padrão de cada tela')
  l.push('| Tela | Referência viva | Do pacote | Nesta versão |')
  l.push('| --- | --- | --- | --- |')
  for (const p of m.padroes) {
    const falta = p.componentes.filter((c) => !p.noPacote[c])
    const estado = falta.length ? `falta ${falta.map((c) => '`' + c + '`').join(', ')}${p.desde ? ` (desde a ${p.desde})` : ''}` : 'tem'
    l.push(`| ${p.tela} | ${p.referencia} | ${p.componentes.map((c) => '`' + c + '`').join(', ')}${p.nota ? `. ${p.nota}` : ''} | ${estado} |`)
  }
  l.push('')
  l.push(m.marca)
  l.push('')
  l.push('## 3. Proibido')
  for (const p of m.proibicoes) l.push(`- ${p}`)
  l.push('')
  l.push('## 4. O que `npx fips-ds check` confere (sai com 1 se achar)')
  for (const r of m.check) l.push(`- \`${r.codigo}\`: ${r.descricao}.`)
  l.push('')
  l.push('Lint das mesmas regras de primitivo e casca: `import governance from \'@fips-app/ds-fips/eslint\'` (ESLint 9, flat config).')
  l.push('')
  l.push('## 5. Antes de dizer "pronto"')
  m.antesDePronto.forEach((p, i) => l.push(`${i + 1}. ${p}`))
  l.push('')
  l.push('## 6. Regimes que mudam a regra')
  for (const r of m.regimes) l.push(`- ${r}`)
  l.push('')
  return l.join('\n')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ds = opcao('--ds') ? path.resolve(opcao('--ds')) : RAIZ
  const saida = opcao('--saida') ? path.resolve(opcao('--saida')) : path.join(RAIZ, 'ai')
  const { manifest, skill } = gerar({ ds, saida, data: opcao('--data') })
  if (!args.includes('--sem-skill')) fs.writeFileSync(path.join(RAIZ, 'skills/design-system-fips/SKILL.md'), skill)
  console.log(`ai: ${manifest.versao} (${manifest.data}), ${manifest.total} exports, ${Object.keys(manifest.props).length} *Props, ${Object.keys(manifest.tokens.claro).length} tokens claro / ${Object.keys(manifest.tokens.escuro).length} escuro`)
}
