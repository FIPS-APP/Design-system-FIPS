import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { FormSectionCard, FormSectionHeader } from '../../../components/composites/FormSectionCard'
import { PhotoEvidenceDropzone } from '../../../components/composites/PhotoEvidenceDropzone'

export default function PhotoEvidenceDropzoneDoc() {
  const [urls, setUrls] = useState<string[]>([])

  const add = (files: FileList) => {
    setUrls((prev) => [
      ...prev,
      ...Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => URL.createObjectURL(f)),
    ])
  }

  const remove = (url: string) => {
    URL.revokeObjectURL(url)
    setUrls((prev) => prev.filter((u) => u !== url))
  }

  return (
    <DocPage
      title="Fotos / evidências"
      description="Dropzone tracejado, grid de thumbnails e tile Adicionar. Copy e limites JPG, PNG, WebP, HEIC até 10 MB."
    >
      <DemoSection title="Seção 4 do formulário">
        <FormSectionCard>
          <FormSectionHeader
            num={4}
            title="Fotos / Evidências"
            hint="Opcional · JPG, PNG, WebP, HEIC · até 10 MB cada"
            Icon={ImagePlus}
          />
          <PhotoEvidenceDropzone urls={urls} onAddFiles={add} onRemove={remove} />
        </FormSectionCard>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Exemplo em página: <a href="/docs/patterns/form-workspace" className="font-semibold text-[var(--color-primary)]">Form Workspace</a>.
        </p>
      </DemoSection>
    </DocPage>
  )
}
