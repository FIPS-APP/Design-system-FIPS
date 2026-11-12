import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { ScrollArea } from '../../../components/ui/scroll-area'

const listaCodigo = `import { ScrollArea } from '@fips-app/ds-fips'

<ScrollArea aria-label="Histórico da requisição" className="h-56 w-full max-w-sm rounded-md border">
  <ul className="space-y-2 p-3 text-sm">
    {historico.map((h) => <li key={h.id}>{h.texto}</li>)}
  </ul>
</ScrollArea>`

const larguraCodigo = `import { ScrollArea } from '@fips-app/ds-fips'

<ScrollArea horizontal aria-label="Colunas da tabela" className="w-full max-w-sm rounded-md border">
  <div className="flex w-[640px] gap-3 p-3">{colunas}</div>
</ScrollArea>`

const MEDIDAS = [
  ['Polegar (--color-border-control) sobre --color-surface', '3,39:1', '3,62:1'],
  ['Polegar sobre --color-surface-soft', '3,32:1', '3,43:1'],
]

const itens = Array.from({ length: 14 }, (_, i) => `Registro ${i + 1}: atualização da requisição`)

export default function ScrollAreaDoc() {
  return (
    <PlaygroundProvider>
      <DocPage
        title="ScrollArea"
        description="Área com rolagem e barra visível. Use quando o conteúdo passa da altura e a barra do sistema some ou destoa."
      >
        <DemoSection title="Lista com altura fixa">
          <Copyable label="ScrollArea vertical" code={listaCodigo} preview={null}>
            <ScrollArea
              aria-label="Histórico da requisição"
              className="h-56 w-full max-w-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <ul className="space-y-2 p-3 text-sm text-[var(--color-fg)]">
                {itens.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </ScrollArea>
          </Copyable>
        </DemoSection>

        <DemoSection title="Rolagem horizontal">
          <Copyable label="ScrollArea horizontal" code={larguraCodigo} preview={null}>
            <ScrollArea
              horizontal
              aria-label="Colunas da tabela"
              className="w-full max-w-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="flex w-[640px] gap-3 p-3 pb-5 text-sm text-[var(--color-fg)]">
                {['Número', 'Solicitante', 'Setor', 'Situação', 'Prazo'].map((c) => (
                  <span key={c} className="w-28 shrink-0">{c}</span>
                ))}
              </div>
            </ScrollArea>
          </Copyable>
        </DemoSection>

        <DemoSection title="API, teclado e movimento">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>className</code> no contêiner define a altura (<code>h-56</code>) ou a largura máxima. Sem altura, a área cresce e não rola.</li>
            <li>A barra fica sempre visível. Para a barra horizontal, passe <code>horizontal</code>; <code>ScrollBar</code> também sai do pacote para quem montar a sua.</li>
            <li>O trecho que rola recebe foco por Tab. Com foco nele, setas, PageUp, PageDown, Home e End rolam. O foco aparece com o anel do tema.</li>
            <li>Passe <code>aria-label</code> ou <code>aria-labelledby</code> para o trecho ser anunciado como região.</li>
            <li>Sem animação com redução de movimento ligada no sistema.</li>
            <li>Dentro de <code>Modal</code> ou <code>Drawer</code>, dê a altura à <code>ScrollArea</code> e não ao corpo do diálogo, para não ter duas barras.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste da barra medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Travado em <code>scripts/scroll-area.test.mjs</code> (mínimo 3:1, WCAG 1.4.11).
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Par</th>
                  <th className="p-3">Claro</th>
                  <th className="p-3">Escuro</th>
                </tr>
              </thead>
              <tbody>
                {MEDIDAS.map((l) => (
                  <tr key={l[0]} className="border-b border-[var(--color-border)] last:border-0">
                    {l.map((c, i) => <td key={i} className="p-3">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoSection>

        <CodePlayground />

        <CodeExportSection
          items={[
            { label: 'ScrollArea vertical', description: 'Lista com altura fixa e rótulo.', code: listaCodigo },
            { label: 'ScrollArea horizontal', description: 'Conteúdo mais largo que a área.', code: larguraCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
