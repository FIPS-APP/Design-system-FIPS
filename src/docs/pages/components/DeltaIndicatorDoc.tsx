import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { DeltaIndicator } from '../../../components/ui/delta-indicator'

const basicoCodigo = `import { DeltaIndicator } from '@fips-app/ds-fips'

<DeltaIndicator value={12.4} description="em relação ao mês anterior" />
<DeltaIndicator value={-3.2} />
<DeltaIndicator value={0} />`

const inversoCodigo = `<DeltaIndicator value={-8} goodWhen="down" unit="%" />
<DeltaIndicator value={5} goodWhen="down" unit=" pp" />`

const MEDIDAS = [
  ['Verde (--color-success-text) sobre cartão', '5,44:1', '11,53:1'],
  ['Vermelho (--color-danger-text) sobre cartão', '6,47:1', '9,17:1'],
  ['Cinza (--color-fg-muted) sobre cartão', '5,05:1', '6,86:1'],
]

export default function DeltaIndicatorDoc() {
  return (
    <PlaygroundProvider>
      <DocPage
        title="DeltaIndicator"
        description="Variação com seta, sinal e número. A cor reforça o sentido, não é o único aviso."
      >
        <DemoSection title="Sobe, desce e estável">
          <Copyable label="DeltaIndicator" code={basicoCodigo} preview={null}>
            <div className="flex flex-wrap items-center gap-6 rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <DeltaIndicator value={12.4} description="em relação ao mês anterior" />
              <DeltaIndicator value={-3.2} />
              <DeltaIndicator value={0} />
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="Quando cair é melhorar">
          <Copyable label="DeltaIndicator com goodWhen" code={inversoCodigo} preview={null}>
            <div className="flex flex-wrap items-center gap-6 rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <DeltaIndicator value={-8} goodWhen="down" />
              <DeltaIndicator value={5} goodWhen="down" unit=" pp" />
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="API e acessibilidade">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>value</code>: variação. Positivo sobe, negativo desce, zero (depois de arredondar) fica estável.</li>
            <li><code>goodWhen</code>: <code>up</code> (padrão) pinta a alta de verde; <code>down</code> inverte, para defeito, atraso e custo.</li>
            <li><code>unit</code> (padrão <code>%</code>) e <code>decimals</code> (padrão 1). Número em pt-BR, vírgula decimal.</li>
            <li>O sentido vai por ícone, sinal no texto e palavra para leitor de tela ("aumento de 12,4%"). <code>description</code> complementa a frase.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">Texto de 14 px em negrito. Mínimo 4,5:1. Travado em <code>scripts/delta-progress.test.mjs</code>.</p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Cor</th><th className="p-3">Claro</th><th className="p-3">Escuro</th>
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
            { label: 'DeltaIndicator', description: 'Alta, queda e estável.', code: basicoCodigo },
            { label: 'DeltaIndicator com goodWhen', description: 'Indicadores em que cair é melhorar.', code: inversoCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
