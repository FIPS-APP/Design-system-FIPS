import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { ExportModal } from '../../../components/composites/ExportModal'
import {
  ExportPreviewModal,
  type ExportIntent,
} from '../../../components/composites/ExportPreviewModal'
import type { ExportCatalog } from '../../../utils/exportHelpers'
import { Button } from '../../../components/ui/button'
import { ExportButtons } from '../../../components/composites/ExportButtons'

const CATALOG: ExportCatalog = [
  { id: 'codigo', key: 'id', label: 'Código', section: 'main' },
  { id: 'titulo', key: 'titulo', label: 'Título', section: 'main' },
  { id: 'status', key: 'status', label: 'Status', section: 'main' },
  { id: 'area', key: 'area', label: 'Área', section: 'main' },
  { id: 'detalhe', key: 'detalhe', label: 'Detalhe expandido', section: 'expanded' },
] as const

const PREVIEW_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'titulo', label: 'Título' },
  { key: 'status', label: 'Status' },
  { key: 'area', label: 'Área' },
  { key: 'detalhe', label: 'Detalhe' },
]

const MOCK_ROWS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  titulo: `Escopo demonstração ${i + 1}`,
  status: i % 3 === 0 ? 'concluido' : 'em_andamento',
  area: 'Suprimentos',
  detalhe: `Linha ${i + 1}`,
}))

export default function ExportModalDemo() {
  const [openLegacy, setOpenLegacy] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [intent, setIntent] = useState<ExportIntent>('excel')

  return (
    <DocPage
      title="Export Modal"
      description="Modal de preview de exportação — paridade Tecnopano ExportPreviewModal (Tudo/Tabela/Expandida, chips, drag, Imprimir/Planilha). ExportModal legado permanece abaixo."
    >
      <DemoSection title="ExportPreviewModal (canônico Tecnopano)">
        <div className="flex flex-wrap items-center gap-3">
          <ExportButtons
            onExcel={() => {
              setIntent('excel')
              setOpenPreview(true)
            }}
            onPdf={() => {
              setIntent('pdf')
              setOpenPreview(true)
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setIntent('excel')
              setOpenPreview(true)
            }}
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden />
            Abrir planilha
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIntent('pdf')
              setOpenPreview(true)
            }}
          >
            <FileText className="h-4 w-4" aria-hidden />
            Abrir PDF
          </Button>
        </div>
        <ExportPreviewModal
          open={openPreview}
          onOpenChange={setOpenPreview}
          intent={intent}
          filename="escopos_demo"
          columns={PREVIEW_COLUMNS}
          tableColumnKeys={['id', 'titulo', 'status', 'area']}
          expandedColumnKeys={['id', 'titulo', 'status', 'area', 'detalhe']}
          data={MOCK_ROWS as Record<string, unknown>[]}
          onExportExcel={() => undefined}
          onExportPdf={() => undefined}
          onPrint={() => window.print()}
        />
      </DemoSection>

      <DemoSection title="ExportModal (legado / portal)">
        <Button variant="primary" onClick={() => setOpenLegacy(true)}>
          <Download className="h-4 w-4" aria-hidden />
          Abrir ExportModal legado
        </Button>
        <ExportModal
          open={openLegacy}
          onClose={() => setOpenLegacy(false)}
          title="Escopos de Suprimentos"
          subtitle="Exportação em lote (demo)"
          catalog={CATALOG}
          rows={MOCK_ROWS}
          filterPills={['Status: Todos', 'Área: Suprimentos']}
          filename="escopos_demo"
        />
      </DemoSection>
    </DocPage>
  )
}
