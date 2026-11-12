import { useState } from 'react'
import { User } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { Field, FieldLabel } from '../../../components/ui/field'
import { SelectBusca } from '../../../components/ui/select-busca'
import { Modal, ModalFooter } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/button'

const NOMES = [
  'Ana Paula Ribeiro', 'Bruno Carvalho', 'Carla Mendes', 'Diego Nascimento', 'Elaine Souza', 'Fábio Teixeira',
  'Gabriela Lima', 'Hugo Almeida', 'Isabela Costa', 'José Antônio Silva', 'Karina Duarte', 'Leandro Barbosa',
  'Marina Rocha', 'Nelson Pires', 'Olívia Martins',
].map((n) => ({ value: n.toLowerCase().replace(/[^a-z]+/g, '-'), label: n }))

export default function SelectBuscaDoc() {
  const [pessoa, setPessoa] = useState('')
  const [aberto, setAberto] = useState(false)
  const [resp, setResp] = useState('')
  return (
    <DocPage
      title="Select com busca"
      description="Seleção única em campo de formulário com lista longa (usuário, local, equipamento). A pessoa digita e a lista filtra, sem acento e sem diferenciar maiúscula."
    >
      <DemoSection title="Seleção única">
        <div className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="sb-pessoa">Responsável</FieldLabel>
            <SelectBusca id="sb-pessoa" leftIcon={<User />} placeholder="Busque pelo nome" options={NOMES} value={pessoa} onChange={setPessoa} />
          </Field>
        </div>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Teclado: digitar com o campo focado abre a lista já filtrada. Setas movem o realce, Enter escolhe, Esc fecha só a lista e o foco volta ao campo.
          Com menos de uns 10 itens use o <code>Select</code>. Filtro de barra de ferramentas continua sendo o <code>ChipSelect</code> com <code>searchable</code>.
        </p>
      </DemoSection>
      <DemoSection title="Dentro de Modal">
        <Button onClick={() => setAberto(true)}>Abrir Modal</Button>
        <Modal open={aberto} onOpenChange={setAberto} title="Atribuir responsável" size="md">
          <Field>
            <FieldLabel htmlFor="sb-modal">Responsável</FieldLabel>
            <SelectBusca id="sb-modal" placeholder="Busque pelo nome" options={NOMES} value={resp} onChange={setResp} />
          </Field>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button onClick={() => setAberto(false)}>Salvar</Button>
          </ModalFooter>
        </Modal>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">A lista abre num portal para o body: o corpo rolável do Modal não a corta, nem a 375 px.</p>
      </DemoSection>
    </DocPage>
  )
}
