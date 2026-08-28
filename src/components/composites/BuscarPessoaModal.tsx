import { useMemo, useState } from 'react'
import { Search, UserCog, Users } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/input'
import { PessoaAvatar } from '../ui/avatar'
import { ChipSelect } from '../ui/chip-select'

export type Pessoa = {
  matricula: string; nome: string; cargo?: string; area?: string; email?: string
  /** Supervisor imediato — só quem liga `filtroSup` precisa preencher. */
  sup?: string
  /** URL da foto (Bubble). Sem ela o avatar cai nas iniciais. */
  foto?: string
}

/**
 * Modal "Buscar pessoa no QLP" — padrão DS-FIPS (Modal + Field/Input): campo de
 * busca + lista com avatar(iniciais) · nome · cargo · área. Ao escolher, devolve
 * matrícula + nome (preenche CS + Nome do nível).
 *
 * Veio do `fips-qlp`, onde nasceu e roda em produção, com o `ChipSelect` e o
 * `PessoaAvatar` junto. O campo de busca usa o `Input` deste catálogo no lugar
 * do `FieldInput` de lá — mesmo controle, sem o invólucro de `Field`.
 */
export function BuscarPessoaModal({
  open,
  onClose,
  title,
  people,
  onSelect,
  filtroSup = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  people: Pessoa[]
  onSelect: (pessoa: Pessoa) => void
  /** Chip "Sup. Imediato" pra estreitar a lista por equipe. Exige `sup` nas pessoas. */
  filtroSup?: boolean
}) {
  const [q, setQ] = useState('')
  const [sup, setSup] = useState('')

  // Supervisores do próprio conjunto recebido — nunca uma lista fixa.
  const sups = useMemo(() => {
    const set = new Set(people.map((p) => (p.sup ?? '').trim()).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [people])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const base = people.filter((p) => {
      if (sup && (p.sup ?? '').trim() !== sup) return false
      if (!query) return true
      return p.nome.toLowerCase().includes(query) || p.matricula.includes(query) || (p.cargo ?? '').toLowerCase().includes(query)
    })
    return base.slice(0, 60)
  }, [q, sup, people])

  const limpar = () => { setQ(''); setSup('') }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => { if (!o) { limpar(); onClose() } }}
      headerIcon={Users}
      title={title}
      description="Busque pelo nome, cargo ou matrícula."
      size="md"
    >
      <div className="space-y-3">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--color-fg-muted)' }}
          />
          <Input
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite o nome, cargo ou matrícula…"
            aria-label="Buscar pessoa"
            autoFocus
          />
        </div>
        {filtroSup && sups.length > 0 && (
          <ChipSelect
            block
            icon={UserCog}
            fieldLabel="Sup. Imediato"
            ariaLabel="Filtrar por supervisor imediato"
            value={sup}
            onChange={setSup}
            options={[{ value: '', label: 'Todos' }, ...sups.map((s) => ({ value: s, label: s }))]}
          />
        )}
        <div className="max-h-[52vh] space-y-0.5 overflow-auto">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--color-fg-muted)' }}>Ninguém encontrado.</p>
          ) : (
            results.map((p) => (
              <button
                key={p.matricula}
                type="button"
                onClick={() => { onSelect(p); limpar(); onClose() }}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[var(--color-surface-muted)]"
              >
                <PessoaAvatar nome={p.nome} foto={p.foto} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>{p.nome}</span>
                  <span className="block truncate text-xs" style={{ color: 'var(--color-fg-muted)' }}>{[p.cargo, p.area].filter(Boolean).join(' · ') || '—'}</span>
                </span>
                <span className="ml-2 shrink-0 font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>{p.matricula}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
