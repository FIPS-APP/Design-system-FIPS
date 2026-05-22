import { useState } from 'react'
import { BarChart3, Download, RefreshCw } from 'lucide-react'
import { PatternPanelHero } from '../../../components/composites/PatternPanelHero'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

const MOCK_ROWS = [
  { id: 1, titulo: 'Aquisição notebooks TI', status: 'Em andamento', area: 'TI' },
  { id: 2, titulo: 'Mobiliário escritório', status: 'Aguardando área', area: 'RH' },
  { id: 3, titulo: 'EPIs operação', status: 'Concluído', area: 'Operações' },
]

const STATUS_OPCOES = [
  { value: '', label: 'Todos' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'aguardando_aprovacao_area', label: 'Aguardando área' },
  { value: 'concluido', label: 'Concluído' },
]

export default function RelatoriosOperacionaisDemo() {
  const [status, setStatus] = useState('')
  const [itens] = useState(MOCK_ROWS)

  const filtered = status ? itens.filter((r) => r.status.toLowerCase().includes(status.replace(/_/g, ' ').slice(0, 4)) || true) : itens

  return (
    <div className="min-h-full bg-[var(--color-surface-muted)]">
      <PatternPanelHero
        title="Relatórios"
        subtitle="Escopos de Suprimentos — filtros e exportação CSV (demo)"
        icon={<BarChart3 className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />}
        stats={[{ label: 'Registros', value: String(filtered.length) }]}
      />

      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-8">
        <Card className="rounded-[12px_12px_12px_24px]">
          <CardHeader>
            <CardTitle className="font-heading text-base">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[var(--color-fg-muted)]">Status</span>
              <select
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPCOES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3">
              <Button variant="primary" size="sm">
                <RefreshCw size={16} className="mr-1" />
                Atualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[12px_12px_12px_24px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Área</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--color-border)]">
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3">{row.titulo}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3">{row.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
