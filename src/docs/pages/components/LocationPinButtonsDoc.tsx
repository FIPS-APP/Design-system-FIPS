import { useState } from 'react'
import { MapPin, Workflow } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { FormSectionCard, FormSectionHeader } from '../../../components/composites/FormSectionCard'
import { LocationPinButtons } from '../../../components/composites/LocationPinButtons'
import { Field, FieldLabel } from '../../../components/ui/field'
import { Select } from '../../../components/ui/select'

const CIDADES = ['Guarujá', 'Santos'] as const

export default function LocationPinButtonsDoc() {
  const [cidade, setCidade] = useState<string | null>(null)

  return (
    <DocPage
      title="Local de atividade (pin)"
      description="Botões com ícone MapPin para escolher cidade quando há poucas opções fixas. Não substitui Select encadeado de local/sublocal."
    >
      <DemoSection title="Campo Local de Atividade">
        <FormSectionCard>
          <FormSectionHeader num={3} title="Dados do Envolvido" Icon={Workflow} />
          <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]">
            <Field inset="control" density="compact">
              <FieldLabel required>Local de Atividade</FieldLabel>
              <LocationPinButtons options={CIDADES} value={cidade} onChange={setCidade} />
            </Field>
            <Field inset="control" density="compact">
              <FieldLabel required>Local da Atividade/Ocorrido</FieldLabel>
              <Select
                density="compact"
                leftIcon={<MapPin aria-hidden />}
                placeholder={cidade ? 'Selecione o local' : 'Selecione a cidade primeiro'}
                value=""
                onChange={() => {}}
                options={
                  cidade === 'Guarujá'
                    ? [{ value: 'terminal', label: 'Terminal' }]
                    : cidade === 'Santos'
                      ? [{ value: 'cais', label: 'Cais' }]
                      : []
                }
                disabled={!cidade}
              />
            </Field>
            <Field inset="control" density="compact">
              <FieldLabel>Sub Local da Atividade/Ocorrido</FieldLabel>
              <Select
                density="compact"
                leftIcon={<MapPin aria-hidden />}
                placeholder="Selecione o local primeiro"
                value=""
                onChange={() => {}}
                options={[]}
                disabled
              />
            </Field>
          </div>
        </FormSectionCard>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Doc canônica:{' '}
          <a href="/docs/components/select#location-pin-buttons" className="font-semibold text-[var(--color-primary)]">
            Select → Local (pin)
          </a>
          . Formulário:{' '}
          <a href="/docs/patterns/form-workspace" className="font-semibold text-[var(--color-primary)]">
            Form Workspace
          </a>
          .
          Card numerado:{' '}
          <a href="/docs/components/card#form-section-card" className="font-semibold text-[var(--color-primary)]">
            FormSectionCard
          </a>
          .
        </p>
      </DemoSection>
    </DocPage>
  )
}
