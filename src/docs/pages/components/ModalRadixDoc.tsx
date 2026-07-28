import { useState } from 'react'
import { Sparkles, Bug, Wrench, FileSpreadsheet } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { Modal, ModalFooter } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { ExportButtons } from '../../../components/composites/ExportButtons'
import {
  ExportPreviewModal,
  type ExportIntent,
} from '../../../components/composites/ExportPreviewModal'

const EXPORT_COLUMNS = [
  { key: 'id', label: 'Código' },
  { key: 'sol', label: 'Solicitante' },
  { key: 'dept', label: 'Departamento' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Prioridade' },
  { key: 'valor', label: 'Valor' },
  { key: 'data', label: 'Data' },
]

const EXPORT_ROWS = Array.from({ length: 60 }, (_, i) => ({
  id: `REQ-${4000 - i}`,
  sol: ['Beatriz Santos', 'Ana Silva', 'Carlos Lima', 'Julia Santos'][i % 4],
  dept: ['Operações', 'TI', 'RH', 'Financeiro'][i % 4],
  status: ['Em análise', 'Pendente', 'Aprovada', 'Recusada'][i % 4],
  priority: ['Crítica', 'Alta', 'Média', 'Baixa'][i % 4],
  valor: `R$ ${(7333 + i * 17).toLocaleString('pt-BR')}`,
  data: `${String(25 - (i % 20)).padStart(2, '0')}/03/2026`,
}))

/**
 * Padrão oficial FIPS Suprimentos: Dialog (Radix) + composite Modal/ModalFooter.
 * ExportPreviewModal também vive aqui — é modal de produto (listagens).
 */
export default function ModalRadixDoc() {
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportIntent, setExportIntent] = useState<ExportIntent>('excel')

  return (
    <DocPage
      title="Modal Radix (composite)"
      description="Dialog FIPS (faixa azul, grain, X) + composite Modal/ModalFooter. Inclui o ExportPreviewModal das listagens — Tudo/Tabela/Expandida, chips e preview."
    >
      <DemoSection title="ExportPreviewModal (listagens)">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Modal canônico de exportação (Tecnopano → DS): header + Tela cheia, segmented Tudo/Tabela/Expandida,
          chips com drag, preview e footer Cancelar / Imprimir / Planilha|PDF.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ExportButtons
            onExcel={() => {
              setExportIntent('excel')
              setExportOpen(true)
            }}
            onPdf={() => {
              setExportIntent('pdf')
              setExportOpen(true)
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setExportIntent('excel')
              setExportOpen(true)
            }}
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden />
            Abrir Exportar planilha
          </Button>
        </div>
        <ExportPreviewModal
          open={exportOpen}
          onOpenChange={setExportOpen}
          intent={exportIntent}
          filename="requisicoes"
          columns={EXPORT_COLUMNS}
          tableColumnKeys={EXPORT_COLUMNS.map((c) => c.key)}
          expandedColumnKeys={EXPORT_COLUMNS.map((c) => c.key)}
          data={EXPORT_ROWS as Record<string, unknown>[]}
          onExportExcel={() => undefined}
          onExportPdf={() => undefined}
          onPrint={() => window.print()}
        />
      </DemoSection>

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
          description="Versão 0.9.2 · Design System FIPS — padrão alinhado ao Suprimentos."
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
                  ExportPreviewModal documentado em Modal Radix (família de modais de produto).
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
                  Dialog: faixa superior azul FIPS (#004B9B → #93BDE4), grain e X com hover primary.
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
                  CTA Planilha usa Button primary (azul) — sem vermelho Tecnopano legado.
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
            <strong className="text-[var(--color-fg)]">DialogContent</strong> — faixa azul 3px no topo, grain,
            overlay escuro + blur, X absoluto top-4 right-4.
          </li>
          <li>
            <strong className="text-[var(--color-fg)]">ExportPreviewModal</strong> — DialogContent com header
            próprio, Tela cheia (96dvh), preview scrollável, footer sticky.
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
