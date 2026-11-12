import { useState } from 'react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { CodeExportSection } from '../../components/CodeExport'
import { PlaygroundProvider, Copyable, CodePlayground } from '../../components/CodePlayground'
import { CurrencyInput } from '../../../components/ui/currency-input'
import { Field, FieldHint, FieldLabel, FieldMessage } from '../../../components/ui/field'

const basicoCodigo = `import { CurrencyInput, Field, FieldHint, FieldLabel } from '@fips-app/ds-fips'

const [valor, setValor] = useState('') // decimal em texto: "1234.56"

<Field>
  <FieldLabel htmlFor="valor">Valor estimado (R$)</FieldLabel>
  <CurrencyInput id="valor" value={valor} onValueChange={setValor} placeholder="0,00" />
  <FieldHint>Digite ou cole 1.234,56 ou 1234.56.</FieldHint>
</Field>`

const erroCodigo = `<Field>
  <FieldLabel htmlFor="valor-erro" required>Valor estimado (R$)</FieldLabel>
  <CurrencyInput id="valor-erro" value={valor} onValueChange={setValor} aria-invalid={!valor} aria-describedby="valor-erro-msg" />
  {!valor ? <FieldMessage id="valor-erro-msg">Informe o valor.</FieldMessage> : null}
</Field>`

const FORMAS = [
  ['1.234,56', '1234.56'],
  ['1234.56', '1234.56'],
  ['1.234', '1234'],
  ['1234,5', '1234.50'],
  ['12.5', '12.50'],
  ['1.234.567,89', '1234567.89'],
  ['abc', '(vazio)'],
]

function Basico() {
  const [valor, setValor] = useState('')
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="demo-valor">Valor estimado (R$)</FieldLabel>
      <CurrencyInput id="demo-valor" value={valor} onValueChange={setValor} placeholder="0,00" />
      <FieldHint>Valor entregue ao app: {valor === '' ? 'vazio' : valor}</FieldHint>
    </Field>
  )
}

function ComErro() {
  const [valor, setValor] = useState('')
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="demo-valor-erro" required>Valor estimado (R$)</FieldLabel>
      <CurrencyInput
        id="demo-valor-erro"
        value={valor}
        onValueChange={setValor}
        aria-invalid={valor === ''}
        aria-describedby="demo-valor-erro-msg"
      />
      {valor === '' ? <FieldMessage id="demo-valor-erro-msg">Informe o valor.</FieldMessage> : null}
    </Field>
  )
}

export default function CurrencyInputDoc() {
  return (
    <PlaygroundProvider>
      <DocPage title="CurrencyInput" description="Campo de valor em reais. Mostra 1.234,56 e entrega ao app o decimal em texto, 1234.56.">
        <DemoSection title="Com Field">
          <Copyable label="CurrencyInput com Field" code={basicoCodigo} preview={null}>
            <Basico />
          </Copyable>
        </DemoSection>

        <DemoSection title="Com erro">
          <Copyable label="CurrencyInput com erro" code={erroCodigo} preview={null}>
            <ComErro />
          </Copyable>
        </DemoSection>

        <DemoSection title="API">
          <ul className="space-y-1.5 text-sm text-[var(--color-fg)]">
            <li><code>value</code> e <code>onValueChange</code>: decimal em texto ("1234.56"), sem float. Vazio é "". O mesmo contrato dos apps que já tinham o campo.</li>
            <li>Aceita as props de <code>Input</code> (<code>id</code>, <code>disabled</code>, <code>aria-invalid</code>, <code>density</code>, <code>pending</code>), menos <code>type</code>, <code>inputMode</code> e <code>leftIcon</code>.</li>
            <li><code>allowNegative</code>: aceita "-" no início. Sem ele, o sinal é descartado.</li>
            <li><code>showSymbol</code>: "R$" à esquerda (padrão). O símbolo é decorativo; ponha "(R$)" no rótulo.</li>
            <li>Enquanto o campo tem foco, mostra o que a pessoa digitou. Ao sair, formata com milhar e duas casas. Zero é valor válido ("0,00").</li>
            <li>Até 12 dígitos inteiros e 2 casas decimais. Mais que isso é cortado.</li>
            <li><code>formatCurrency</code> e <code>parseCurrency</code> também são exportados, para tabela e relatório.</li>
          </ul>
        </DemoSection>

        <DemoSection title="Como o texto é lido">
          <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
            Vírgula é sempre decimal. Ponto é decimal só quando é o único separador e tem 1 ou 2 dígitos depois; senão é milhar. Travado em <code>scripts/currency-input.test.mjs</code>.
          </p>
          <div className="overflow-x-auto rounded-[10px_10px_10px_18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-left text-xs text-[var(--color-fg)]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                  <th className="p-3">Digitado ou colado</th>
                  <th className="p-3">Entregue ao app</th>
                </tr>
              </thead>
              <tbody>
                {FORMAS.map((l) => (
                  <tr key={l[0]} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="p-3">{l[0]}</td>
                    <td className="p-3">{l[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoSection>

        <CodePlayground />

        <CodeExportSection
          items={[
            { label: 'CurrencyInput com Field', description: 'Rótulo, dica e valor em texto decimal.', code: basicoCodigo },
            { label: 'CurrencyInput com erro', description: 'aria-invalid e mensagem ligada por aria-describedby.', code: erroCodigo },
          ]}
        />
      </DocPage>
    </PlaygroundProvider>
  )
}
