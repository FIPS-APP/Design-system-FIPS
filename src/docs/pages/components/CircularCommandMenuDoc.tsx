import { Pencil, Ban, Trash2 } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CircularCommandMenu } from '../../../components/composites/CircularCommandMenu'
import { RowActionsMenu } from '../../../components/composites/RowActionsMenu'

const DEMO_ACTIONS = [
  {
    key: 'edit',
    label: 'Editar pedido',
    icon: <Pencil className="h-4 w-4" />,
    onClick: () => undefined,
  },
  {
    key: 'cancel',
    label: 'Cancelar',
    icon: <Ban className="h-4 w-4" />,
    danger: true,
    onClick: () => undefined,
  },
  {
    key: 'delete',
    label: 'Excluir',
    icon: <Trash2 className="h-4 w-4" />,
    danger: true,
    onClick: () => undefined,
  },
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
