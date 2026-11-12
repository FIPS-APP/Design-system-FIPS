import { useState } from 'react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { Slider } from '../../../components/ui/slider'

const basicoCodigo = `import { useState } from 'react'
import { Slider } from '@fips-app/ds-fips'

const [segundos, setSegundos] = useState(30)

<div className="space-y-2">
  <label id="recolher" className="text-sm">Recolher após: {segundos}s</label>
  <Slider
    aria-labelledby="recolher"
    min={5}
    max={120}
    step={5}
    value={segundos}
    onValueChange={setSegundos}
    getValueText={(v) => \`\${v} segundos\`}
  />
</div>`

const desabilitadoCodigo = `<Slider aria-label="Volume" defaultValue={40} disabled />`

const MEDIDAS = [
  ['Trilho (--color-switch-off) sobre o cartão', '5,05:1', '4,09:1'],
  ['Parte preenchida e borda do polegar (--color-switch-on) sobre o cartão', '8,47:1', '5,19:1'],
  ['Trilho sobre o cartão suave (--color-surface-soft)', '4,96:1', '3,87:1'],
  ['Preenchido sobre o cartão suave', '8,31:1', '4,92:1'],
  ['Preenchido contra o trilho (só luminosidade; no escuro a diferença é de matiz)', '1,68:1', '1,27:1'],
]

export default function SliderDoc() {
  const [segundos, setSegundos] = useState(30)
  return (
    <PlaygroundProvider>
      <DocPage
        title="Slider"
        description="Escolha de um valor numérico dentro de uma faixa, arrastando o polegar ou usando o teclado."
      >
        <DemoSection title="Valor único">
          <Copyable label="Slider de valor único" code={basicoCodigo} preview={null}>
            <div className="max-w-sm space-y-2">
              <label id="recolher-demo" className="text-sm text-[var(--color-fg)]">Recolher após: {segundos}s</label>
              <Slider
                aria-labelledby="recolher-demo"
                min={5}
                max={120}
                step={5}
                value={segundos}
                onValueChange={setSegundos}
                getValueText={(v) => `${v} segundos`}
              />
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="Desabilitado">
          <Copyable label="Slider desabilitado" code={desabilitadoCodigo} preview={null}>
            <div className="max-w-sm">
              <Slider aria-label="Volume" defaultValue={40} disabled />
            </div>
          </Copyable>
        </DemoSection>

        <DemoSection title="API e acessibilidade">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>value</code> e <code>onValueChange</code> recebem número (não lista). Sem <code>value</code>, use <code>defaultValue</code>.</li>
            <li><code>onValueCommit</code> dispara uma vez ao soltar o polegar ou terminar uma tecla. Use para salvar.</li>
            <li><code>min</code>, <code>max</code>, <code>step</code>, <code>disabled</code> e <code>name</code> vão para o Radix.</li>
            <li>Nome acessível obrigatório: <code>aria-label</code> ou <code>aria-labelledby</code>. <code>getValueText</code> troca o número cru pela leitura com unidade.</li>
            <li>Teclado: setas movem um passo; PageUp e PageDown, dez passos; Home e End vão ao mínimo e ao máximo.</li>
            <li>Polegar de 24 px (alvo mínimo WCAG 2.5.8). Anel de foco de 2 px em <code>--color-ring</code>.</li>
            <li>Intervalo (dois polegares) não entra: nenhum app usa hoje.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Contraste medido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Mínimo 3:1 para componente de interface (WCAG 1.4.11). Travado em <code>scripts/slider.test.mjs</code>.
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Parte</th>
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
            { label: 'Slider de valor único', description: 'Controlado, com rótulo e leitura com unidade.', code: basicoCodigo },
            { label: 'Slider desabilitado', description: 'Valor fixo, sem interação.', code: desabilitadoCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
