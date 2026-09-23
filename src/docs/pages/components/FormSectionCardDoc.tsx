import { Tag } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { FormSectionCard, FormSectionHeader } from '../../../components/composites/FormSectionCard'

export default function FormSectionCardDoc() {
  return (
    <DocPage
      title="Card de seção (formulário)"
      description="Bloco numerado com canto assimétrico para formulários densos (Registro, workspace)."
    >
      <DemoSection title="Anatomia">
        <FormSectionCard>
          <FormSectionHeader num={1} title="Tipo de OPA" hint="Selecione o tipo de registro" Icon={Tag} />
          <p className="text-sm text-[var(--color-fg-muted)]">Conteúdo da seção (campos, grids).</p>
        </FormSectionCard>
      </DemoSection>
    </DocPage>
  )
}
