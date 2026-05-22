import { useState } from 'react'
import { Sparkles, Bug, Wrench } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { Modal, ModalFooter } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

/**
 * Padrão oficial FIPS Suprimentos: Dialog (Radix) + composite Modal/ModalFooter.
 * Usado em ChangelogModal, confirmações e formulários workflow (size workflow).
 */
export default function ModalRadixDoc() {
  const [changelogOpen, setChangelogOpen] = useState(false)

  return (
    <DocPage
      title="Modal Radix (composite)"
      description="Dialog primitivo com composite Modal e ModalFooter — botão X no canto, corpo scrollável e rodapé com fundo surface-muted. Referência do ChangelogModal e modais de produto."
    >
      <DemoSection title="Changelog / Novidades">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Header com ícone, lista com Badge por tipo, rodapé com botão primary «Entendi, continuar».
        </p>
        <Button type="button" variant="primary" size="md" onClick={() => setChangelogOpen(true)}>
          Abrir modal de novidades
        </Button>

        <Modal
          open={changelogOpen}
          onOpenChange={setChangelogOpen}
          size="lg"
          headerIcon={Sparkles}
          title="Novidades do sistema"
          description="Versão 0.5.2 · Design System FIPS — padrão alinhado ao Suprimentos."
          className="max-h-[min(90vh,720px)]"
        >
          <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/50">
            <li className="flex gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Sparkles className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <Badge variant="success">Novidade</Badge>
                <p className="text-sm leading-relaxed text-[var(--color-fg)]">
                  Composite Modal + ModalFooter documentado; fechar via X (top-5 right-5) ou overlay.
                </p>
              </div>
            </li>
            <li className="flex gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Wrench className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <Badge variant="info">Melhoria</Badge>
                <p className="text-sm leading-relaxed text-[var(--color-fg)]">
                  Tutorial contextual: faixa superior azul (#004B9B → #93BDE4), progresso laranja (#F6921E).
                </p>
              </div>
            </li>
            <li className="flex gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Bug className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <Badge variant="danger">Correção</Badge>
                <p className="text-sm leading-relaxed text-[var(--color-fg)]">
                  Hover do X: border surface + bg surface-soft (sem vermelho Tecnopano legado).
                </p>
              </div>
            </li>
          </ul>

          <ModalFooter>
            <Button type="button" variant="primary" size="md" onClick={() => setChangelogOpen(false)}>
              Entendi, continuar
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection title="Tokens e anatomia">
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-fg-muted)]">
          <li>
            <strong className="text-[var(--color-fg)]">DialogContent</strong> — rounded-2xl, overlay
            slate-950/35 + blur 3px, botão fechar absoluto top-5 right-5.
          </li>
          <li>
            <strong className="text-[var(--color-fg)]">ModalHeader</strong> — border-b, ícone opcional em círculo
            primary/10.
          </li>
          <li>
            <strong className="text-[var(--color-fg)]">ModalFooter</strong> — border-t, bg surface-muted/70, ações à
            direita (primary para confirmação).
          </li>
          <li>
            <strong className="text-[var(--color-fg)]">Tamanhos</strong> — sm…full; workflow = max-w 900px para
            aprovações.
          </li>
        </ul>
      </DemoSection>
    </DocPage>
  )
}
