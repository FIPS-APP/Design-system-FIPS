import { useState } from 'react'
import { Filter, Globe, Search, User } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { ScopeSegment } from '../../../components/composites/ScopeSegment'

export default function ScopeSegmentDoc() {
  const [scope, setScope] = useState<'minha' | 'todos'>('todos')

  return (
    <DocPage
      title="Recorte de área (ScopeSegment)"
      description="Alçada Minha Área | Toda jurisdição — colada ao botão Filtros na toolbar (Gestão OPA)."
    >
      <DemoSection title="Toolbar de listagem">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Entre período e exportação. Ativo: fundo <code>--color-primary</code>, texto branco, contador mono.
        </p>
        <div className="flex flex-wrap items-center gap-2 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <button
            type="button"
            className="inline-flex h-[30px] items-center gap-1.5 rounded-md border-[1.5px] border-[var(--color-primary)] px-3 text-xs font-semibold text-[var(--color-primary)]"
          >
            <Filter className="h-3.5 w-3.5" aria-hidden />
            Filtros
          </button>
          <ScopeSegment
            value={scope}
            onChange={setScope}
            label="Alçada"
            items={[
              { key: 'minha', label: 'Minha Área', Icon: User, count: 0 },
              { key: 'todos', label: 'Toda jurisdição', Icon: Globe, count: 97 },
            ]}
          />
          <div className="flex h-[34px] min-w-[10rem] flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-fg-muted)]">
            <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Buscar OPAs…
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Contexto:{' '}
          <a href="/docs/patterns/data-listing#scope-segment" className="font-semibold text-[var(--color-primary)]">
            Padrões → Data Listing → Toolbar
          </a>
          .
        </p>
      </DemoSection>
    </DocPage>
  )
}
