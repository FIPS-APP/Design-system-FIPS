import { Pencil, Ban, Trash2 } from 'lucide-react'
import { DocPage } from '../../components/DocPage'
import { CircularCommandMenu } from '../../../components/composites/CircularCommandMenu'
import { RowActionsMenu } from '../../../components/composites/RowActionsMenu'
import { ExportButtons } from '../../../components/composites/ExportButtons'

export default function CircularCommandMenuDoc() {
  return (
    <DocPage
      title="Circular Command Menu"
      description="Menu radial de ações da linha (Multitags → Tecnopano). Portal, órbita, teclado. Peer: framer-motion."
    >
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[var(--color-fg)]">RowActionsMenu</h2>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Clique no + da linha. Esc fecha. Setas navegam. Peer dependency: <code>framer-motion</code>.
        </p>
        <div className="flex min-h-[200px] items-center justify-center rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
          <RowActionsMenu
            rowId="demo-1"
            radius={56}
            actions={[
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
            ]}
          />
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-heading text-lg font-bold text-[var(--color-fg)]">CircularCommandMenu (FAB)</h2>
        <div className="flex min-h-[220px] items-center justify-center rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-10">
          <CircularCommandMenu
            radius={88}
            items={[
              {
                id: 'a',
                label: 'Editar',
                icon: <Pencil className="h-4 w-4" />,
                onClick: () => undefined,
              },
              {
                id: 'b',
                label: 'Bloquear',
                icon: <Ban className="h-4 w-4" />,
                danger: true,
                onClick: () => undefined,
              },
              {
                id: 'c',
                label: 'Excluir',
                icon: <Trash2 className="h-4 w-4" />,
                danger: true,
                onClick: () => undefined,
              },
            ]}
          />
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-heading text-lg font-bold text-[var(--color-fg)]">ExportButtons</h2>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Par Excel/PDF 32.5×32.5 — mesma toolbar da Data Listing.
        </p>
        <ExportButtons onExcel={() => undefined} onPdf={() => undefined} />
      </section>
    </DocPage>
  )
}
