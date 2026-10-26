/**
 * Confere o pacote que vai para o registry (dist/ já buildado).
 * Roda no prepublishOnly; também à mão: npm run build && npm run check:pack
 *
 * 1. dependencies só aponta para o registry: URL, git ou file: quebram o
 *    install do consumidor (npm 12 recusa remote/git por padrão).
 * 2. Todo import que sobra no dist/index.js está declarado em dependencies
 *    ou peerDependencies. Um import de react-router num componente da lib,
 *    por exemplo, para aqui em vez de estourar no app.
 * 3. Nada de dependencies vai embutido no bundle (ver vite.config.lib.ts).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ler = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')
const pkg = JSON.parse(ler('package.json'))
const erros = []

for (const [nome, spec] of Object.entries(pkg.dependencies ?? {})) {
  if (/^(https?:|git(\+\w+)?:|github:|file:|link:)/.test(spec) || spec.includes('/')) {
    erros.push(`dependencies.${nome} = "${spec}" não vem do registry`)
  }
}

const declarados = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})])
const raiz = (id) => (id.startsWith('@') ? id.split('/').slice(0, 2).join('/') : id.split('/')[0])
// Nome de pacote npm (com subpath opcional); descarta strings do código embutido
// que só parecem import, como `{ from: F() }` do tailwind-merge.
const PACOTE = /^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*(\/[\w./-]*)?$/
const SEM_LINHA = String.raw`[^"'\n.][^"'\n]*`

for (const arquivo of ['dist/index.js', 'dist/index.cjs']) {
  const codigo = ler(arquivo)
  const ids = [
    ...codigo.matchAll(new RegExp(String.raw`\bfrom\s*["'](${SEM_LINHA})["']`, 'g')),
    ...codigo.matchAll(new RegExp(String.raw`\bimport\s*["'](${SEM_LINHA})["']`, 'g')),
    ...codigo.matchAll(new RegExp(String.raw`\b(?:require|import)\(\s*["'](${SEM_LINHA})["']\s*\)`, 'g')),
  ]
    .map((m) => m[1])
    .filter((id) => PACOTE.test(id))
    .map(raiz)
  for (const id of new Set(ids)) {
    if (!declarados.has(id)) erros.push(`${arquivo} importa "${id}", que não está em dependencies/peerDependencies`)
  }
  // O sourcemap lista cada arquivo que entrou no bundle: node_modules ali é código embutido.
  const fontes = JSON.parse(ler(`${arquivo}.map`)).sources
  const embutidos = new Set(
    fontes.map((f) => f.match(/node_modules\/((?:@[^/]+\/)?[^/]+)\//)?.[1]).filter(Boolean),
  )
  for (const nome of embutidos) erros.push(`${arquivo} embute ${nome} em vez de importar`)
}

if (erros.length) {
  console.error(`check:pack falhou:\n- ${erros.join('\n- ')}`)
  process.exit(1)
}
console.log(`check:pack ok: ${declarados.size} pacotes externos, nenhum embutido, nenhum fora do registry`)
