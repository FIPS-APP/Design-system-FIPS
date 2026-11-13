import { Pencil, Trash2, Eye } from 'lucide-react'
import { PlaygroundProvider, Copyable } from '../../components/CodePlayground'
import { Button } from '../../../components/ui/button'
import { BotaoIconeRotulo } from '../../../components/ui/botao-icone-rotulo'

const CODIGO = `// DS-FIPS: botão de ação com ícone parado e nome no hover
import { Trash2 } from 'lucide-react'
import { Button, BotaoIconeRotulo } from '@fips-app/ds-fips'

<div className="flex items-center gap-2">
  <BotaoIconeRotulo icon={Trash2} label="Excluir" aria-label="Excluir rascunho da inspeção 12" variant="danger" onClick={abrirExclusao} />
  <Button size="sm" onClick={continuar}>Continuar</Button>
</div>`

const PROPS: Array<[string, string]> = [
  ['icon', 'Ícone Lucide mostrado sempre.'],
  ['label', 'Nome que aparece ao abrir. Sem aria-label, também é o nome para leitor de tela.'],
  ['aria-label', 'Opcional. Nome mais longo com o contexto da linha, para lista com vários botões iguais ("Excluir rascunho da inspeção 12"). Começa pelo label, para o nome falado conter o nome visível.'],
  ['variant', 'danger (exclusão, vermelho), outline ou ghost. Padrão outline.'],
  ['size', 'iconSm (30px, igual ao Button iconSm) ou icon (36px). Padrão iconSm.'],
  ['disabled', 'Desabilitado não abre no hover nem no foco.'],
  ['onClick, title, data-*, aria-*', 'Repassados ao <button>. type vale "button" se não vier outro.'],
]

export default function BotaoIconeRotuloDoc() {
  return (
    <PlaygroundProvider>
      <div className="min-h-screen bg-[var(--color-surface-muted)] px-10 py-10 text-[var(--color-fg)]">
        <h1 className="font-[Saira_Expanded] text-4xl font-bold text-[var(--color-gov-azul-escuro)]">
          Botão ícone com rótulo
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Ação de linha ou de cartão que não ocupa espaço no repouso: mostra só o ícone, em 30px. No hover ou
          no foco do teclado abre e mostra o nome ao lado. Use para ações secundárias ao lado de um botão
          principal, como Excluir ao lado de Continuar. No toque não há hover: o clique e o leitor de tela
          seguem iguais, só o nome não aparece.
        </p>

        <section className="mt-9">
          <h2 className="mb-3 font-[Saira_Expanded] text-xl font-bold text-[var(--color-gov-azul-escuro)]">
            Variantes e tamanhos
          </h2>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Passe o mouse ou use Tab. O vermelho do <code>danger</code> sai do token de texto de perigo no
            repouso e do botão de perigo ao abrir.
          </p>
          <Copyable label="Botão ícone com rótulo" code={CODIGO} preview={<span>BotaoIconeRotulo</span>}>
            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <div className="flex items-center gap-2">
                <BotaoIconeRotulo icon={Trash2} label="Excluir" variant="danger" />
                <Button size="sm">Continuar</Button>
              </div>
              <BotaoIconeRotulo icon={Pencil} label="Editar" variant="outline" />
              <BotaoIconeRotulo icon={Eye} label="Ver detalhes" variant="ghost" />
              <BotaoIconeRotulo icon={Trash2} label="Excluir" variant="danger" size="icon" />
              <BotaoIconeRotulo icon={Trash2} label="Excluir" variant="danger" disabled />
            </div>
          </Copyable>
        </section>

        <section className="mt-9 max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Prop</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-fg)]">Uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PROPS.map(([prop, uso]) => (
                <tr key={prop} className="bg-[var(--color-surface)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-fg)]">{prop}</td>
                  <td className="px-4 py-3 text-[var(--color-fg-muted)]">{uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </PlaygroundProvider>
  )
}
