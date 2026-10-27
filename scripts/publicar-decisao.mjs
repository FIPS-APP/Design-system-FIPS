/**
 * Decide, no workflow `publish.yml`, se a versão do package.json deve ser publicada.
 * A regra fica aqui, e não em shell dentro do YAML, para ser testada: `npm run test:publicar`.
 *
 * Entradas (ambiente): GITHUB_REF_TYPE (`branch` ou `tag`), GITHUB_REF_NAME,
 * VERSAO_ANTES (versão do package.json no commit anterior da main; vazia se desconhecida),
 * JA_PUBLICADA (`true` ou `false`: a versão atual existe no registro).
 * Saídas (GITHUB_OUTPUT): acao (`publicar` ou `pular`), criar_tag (`true` ou `false`), versao.
 * Versão que muda para uma que já existe no registro termina com código 1.
 */
import { appendFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export function decidir({ evento, tag, versaoAntes, versaoAtual, jaPublicada }) {
  if (evento === 'tag') {
    if (tag !== `v${versaoAtual}`) {
      return {
        acao: 'falhar',
        criarTag: false,
        mensagem: `A tag ${tag} não bate com a versão ${versaoAtual} do package.json (esperava v${versaoAtual}).`,
      }
    }
    if (jaPublicada) {
      return { acao: 'pular', criarTag: false, mensagem: `A versão ${versaoAtual} já está no registro; a tag ${tag} não publica de novo.` }
    }
    return { acao: 'publicar', criarTag: false, mensagem: `Tag ${tag} criada à mão: publicando ${versaoAtual}.` }
  }

  if (!versaoAntes) {
    // Commit anterior desconhecido (primeiro push, push forçado): só publica o que o registro ainda não tem.
    return jaPublicada
      ? { acao: 'pular', criarTag: false, mensagem: `Commit anterior desconhecido e ${versaoAtual} já está no registro: nada a publicar.` }
      : { acao: 'publicar', criarTag: true, mensagem: `Commit anterior desconhecido e ${versaoAtual} não está no registro: publicando.` }
  }

  if (versaoAntes === versaoAtual) {
    return { acao: 'pular', criarTag: false, mensagem: `A versão não mudou (${versaoAtual}): nada a publicar.` }
  }

  if (jaPublicada) {
    return {
      acao: 'falhar',
      criarTag: false,
      mensagem:
        `A versão passou de ${versaoAntes} para ${versaoAtual}, mas ${versaoAtual} já existe no registro. ` +
        'O GitHub Packages não aceita republicar a mesma versão: escolha um número que ainda não foi publicado.',
    }
  }

  return { acao: 'publicar', criarTag: true, mensagem: `Versão ${versaoAntes} -> ${versaoAtual}: publicando e criando a tag v${versaoAtual}.` }
}

function principal() {
  const versaoAtual = JSON.parse(readFileSync('package.json', 'utf8')).version
  const resultado = decidir({
    evento: process.env.GITHUB_REF_TYPE === 'tag' ? 'tag' : 'main',
    tag: process.env.GITHUB_REF_NAME,
    versaoAntes: process.env.VERSAO_ANTES || '',
    versaoAtual,
    jaPublicada: process.env.JA_PUBLICADA === 'true',
  })
  if (resultado.acao === 'falhar') {
    console.log(`::error title=Publicação::${resultado.mensagem}`)
    process.exitCode = 1
    return
  }
  console.log(resultado.mensagem)
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `acao=${resultado.acao}\ncriar_tag=${resultado.criarTag}\nversao=${versaoAtual}\n`,
    )
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) principal()
