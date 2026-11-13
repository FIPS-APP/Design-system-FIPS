import { Eye, ExternalLink, FileText, Trash2 } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CircularCommandMenu } from '../../../components/composites/CircularCommandMenu'
import { RowActionsMenu, type RowMenuAction } from '../../../components/composites/RowActionsMenu'

const DEMO_ACTIONS: RowMenuAction[] = [
  { key: 'ver', label: 'Ver anomalias', icon: <Eye className="h-4 w-4" />, tom: 'primario', onClick: () => undefined },
  { key: 'abrir', label: 'Abrir inspeção', icon: <ExternalLink className="h-4 w-4" />, tom: 'primario', onClick: () => undefined },
  { key: 'pdf', label: 'PDF', icon: <FileText className="h-4 w-4" />, tom: 'pdf', onClick: () => undefined },
  { key: 'excluir', label: 'Excluir', icon: <Trash2 className="h-4 w-4" />, tom: 'perigo', onClick: () => undefined },
]

const TONS: [string, string, string][] = [
  ['primario', '--color-primary-text', 'Ver, abrir. Azul nos dois temas.'],
  ['pdf', '--color-danger-text', 'PDF. O mesmo vermelho escuro do botão de PDF da barra.'],
  ['perigo', '--color-btn-danger-hover (claro) / --color-red-400 (escuro)', 'Excluir. `danger: true` sem `tom` também vira perigo.'],
  ['neutro', '--color-fg', 'Padrão.'],
]

export default function CircularCommandMenuDoc() {
  return (
    <DocPage
      title="Ações"
      description="Menu radial de ações (Multitags → Tecnopano). Portal, órbita, navegação por teclado. Peer: framer-motion."
    >
      <DemoSection title="RowActionsMenu — gatilho compacto (linha de tabela)">
        <p className="mb-6 text-sm text-[var(--color-fg-muted)]">
          Preset do <code>CircularCommandMenu</code> com gatilho de 28px, para a coluna de ações de uma linha de
          tabela. Clique no <strong>+</strong>. <kbd className="rounded border border-[var(--color-border)] px-1 text-xs">Esc</kbd> fecha,
          setas navegam entre as opções, <kbd className="rounded border border-[var(--color-border)] px-1 text-xs">Enter</kbd> confirma a ativa.
        </p>
        <div className="flex min-h-[140px] items-center justify-center rounded-[12px_12px_12px_24px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]">
          <RowActionsMenu rowId="demo-1" radius={56} actions={DEMO_ACTIONS} />
        </div>
      </DemoSection>

      <DemoSection title="Cor por ação (tom)">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Cada ação tem a sua cor, igual no repouso, no realce (mouse ou teclado), no foco e no clique: o realce
          ganha fundo leve (8%, 16% ao clicar) e anel na cor da própria ação; as outras ficam apagadas (opacidade
          0,8 e escala 94%). Aberto pelo mouse, o menu começa sem realce; pelo teclado, no primeiro item.
          <code> onOpenChange</code> avisa quando o menu abre e fecha (a <code>TabelaExpansivel</code> usa para o
          holofote da linha).
        </p>
        <table className="w-full text-left text-sm text-[var(--color-fg)]">
          <thead>
            <tr>
              <th className="py-1 pr-4">tom</th>
              <th className="py-1 pr-4">Token</th>
              <th className="py-1">Quando</th>
            </tr>
          </thead>
          <tbody>
            {TONS.map(([t, token, uso]) => (
              <tr key={t} className="border-t border-[var(--color-border)]">
                <td className="py-1 pr-4"><code>{t}</code></td>
                <td className="py-1 pr-4"><code>{token}</code></td>
                <td className="py-1">{uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoSection>

      <DemoSection title="CircularCommandMenu — gatilho padrão (FAB)">
        <p className="mb-6 text-sm text-[var(--color-fg-muted)]">
          É o <strong>mesmo componente</strong> acima, sem o preset de trigger compacto — círculo de 56px na cor
          primária, para uma ação flutuante de página (canto inferior direito, painel de detalhe, etc.), não para
          dentro de uma célula de tabela.
        </p>
        <div className="flex min-h-[160px] items-center justify-center rounded-[12px_12px_12px_24px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]">
          <CircularCommandMenu radius={88} items={DEMO_ACTIONS.map((a) => ({ ...a, id: a.key }))} ariaLabel="Ações rápidas" />
        </div>
      </DemoSection>

      <DemoSection title="Quando usar">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-[var(--color-fg)]">RowActionsMenu</p>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Dentro de uma linha de tabela ou card de lista — o gatilho precisa ser pequeno o bastante pra caber
              numa célula sem alterar a altura da linha.
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-[var(--color-fg)]">CircularCommandMenu</p>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Ação de destaque isolada na página — não use dentro de uma linha de tabela, o gatilho de 56px é grande
              demais pra esse contexto.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--color-fg-muted)]">
          2 a 6 itens funcionam bem — acima disso o menu radial fica apertado; prefira um <code>Dialog</code> ou
          menu de lista tradicional.
        </p>
      </DemoSection>
    </DocPage>
  )
}
