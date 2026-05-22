import { useState } from 'react'
import { Download } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { ExportModal } from '../../../components/composites/ExportModal'
import type { ExportCatalog } from '../../../utils/exportHelpers'
import { Button } from '../../../components/ui/button'

const CATALOG: ExportCatalog = [
  { id: 'codigo', key: 'id', label: 'Código', section: 'main' },
  { id: 'titulo', key: 'titulo', label: 'Título', section: 'main' },
  { id: 'status', key: 'status', label: 'Status', section: 'main' },
  { id: 'area', key: 'area', label: 'Área', section: 'main' },
  { id: 'detalhe', key: 'detalhe', label: 'Detalhe expandido', section: 'expanded' },
] as const

const MOCK_ROWS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  titulo: `Escopo demonstração ${i + 1}`,
  status: i % 3 === 0 ? 'concluido' : 'em_andamento',
  area: 'Suprimentos',
  detalhe: `Linha ${i + 1}`,
}))

export default function ExportModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <DocPage
      title="Export Modal"
      description="Modal de preview e exportação (XLSX, PDF, impressão) usado em listagens do FIPS Suprimentos — seleção de colunas, drag-and-drop e tamanhos Normal / Grande / Tela cheia."
    >
      <DemoSection title="Playground">
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Download className="h-4 w-4" aria-hidden />
          Abrir preview de exportação
        </Button>
        <ExportModal
          open={open}
          onClose={() => setOpen(false)}
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
