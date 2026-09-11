import { useMemo, useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, Users, X } from 'lucide-react'
import { PessoaAvatar } from '../ui/avatar'

export type Pessoa = {
  matricula: string
  nome: string
  cargo?: string | null
  /** Área/subprocesso. */
  area?: string | null
  /** URL da foto. Sem ela o avatar cai nas iniciais. */
  foto?: string | null
  /** Quantos liderados — ordena a lista e define "quem tem equipe"; não é exibido. */
  qtd_lideranca?: number | null
}

/**
 * Modal "Buscar responsável" — anatomia portada VERBATIM do OPA-Gestão
 * (`OPA-GESTAO/src/composites/Modal.tsx`, tone `gov`), que herdou do NDM/QLP.
 * NÃO usa o `ui/Modal`/`DialogContent` do catálogo (shadcn: rounded-2xl +
 * gradiente cinza + ícone branco) — aqui o chrome é Radix cru com as classes do
 * FIPS: faixa gov, tile do ícone ÂMBAR, card `12/12/12/24` surface plano,
 * corpo `p-6` (é o `p-6` que dá o espaçamento inferior), scrollbar inset.
 * Ver `plans/spec-buscar-responsavel-modal.md`.
 *
 * DIFERENÇA DELIBERADA DO OPA: lá a busca é no servidor (`opa-lookup-qlp` → RPC
 * `search_qlp_supervisor`) e "sem busca a lista traz quem tem equipe" é o banco
 * ordenando por nº de liderados. Aqui (catálogo offline, sem backend nem CS real)
 * a mesma regra roda no cliente sobre o array `people`.
 */
export function BuscarPessoaModal({
  open,
  onOpenChange,
  onSelect,
  people,
  title = 'Buscar responsável',
  descricao = 'Busque pelo nome, cargo ou matrícula. Sem busca, a lista traz quem tem equipe.',
}: {
  open: boolean
  onOpenChange: (aberto: boolean) => void
  onSelect: (pessoa: Pessoa) => void
  people: Pessoa[]
  title?: string
  descricao?: ReactNode
}) {
  const [q, setQ] = useState('')

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase()
    // Sem busca: só quem tem equipe, ordenado por nº de liderados (igual ao servidor do OPA).
    if (!query) {
      return people
        .filter((p) => (p.qtd_lideranca ?? 0) > 0)
        .sort((a, b) => (b.qtd_lideranca ?? 0) - (a.qtd_lideranca ?? 0))
    }
    return people.filter(
      (p) =>
        p.nome.toLowerCase().includes(query) ||
        p.matricula.includes(query) ||
        (p.cargo ?? '').toLowerCase().includes(query),
    )
  }, [q, people])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) setQ('')
        onOpenChange(o)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
          aria-hidden
        />
        <Dialog.Content
          className={
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 ' +
            'w-[calc(100%-2rem)] max-w-md rounded-[12px_12px_12px_24px] bg-[var(--color-surface)] ' +
            'shadow-[var(--shadow-elevated)] focus:outline-none ' +
            'flex max-h-[85vh] flex-col overflow-hidden ' +
            'transition-all duration-200 data-[state=closed]:scale-95 data-[state=closed]:opacity-0'
          }
        >
          {/* Header — faixa gov */}
          <div
            className="relative flex shrink-0 items-center gap-4 overflow-hidden px-6 py-5 pr-14"
            style={{ background: 'var(--fips-banner-content-bg)' }}
          >
            <span
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border"
              style={{
                background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-accent) 19%, transparent)',
                color: 'var(--color-accent)',
                boxShadow: '0 1px 2px rgba(0,42,104,.3), inset 0 1px 0 rgba(255,255,255,.08)',
              }}
            >
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <div className="relative min-w-0 flex-1 space-y-0.5">
              <Dialog.Title className="font-heading text-[21px] font-bold leading-[1.2] tracking-[-0.2px] text-white">
                {title}
              </Dialog.Title>
              {descricao ? (
                <Dialog.Description className="text-xs leading-snug text-white/65">
                  {descricao}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-[14px] top-[14px] flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/90 transition-colors hover:bg-white/[0.18] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          {/* Campo de busca — FIXO (não rola com a lista) */}
          <div className="shrink-0 px-6 pt-5 pb-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite o nome, cargo ou matrícula…"
                aria-label="Buscar pessoa no QLP"
                autoFocus
                className="w-full"
                style={{
                  height: 38,
                  padding: '0 12px 0 34px',
                  fontSize: 13,
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 8,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Lista — rola; pb-6 dá o padding inferior DENTRO da rolagem; fips-scroll = barra fina sem setas */}
          <div className="fips-scroll flex-1 space-y-0.5 overflow-y-auto px-6 pb-6">
            {hits.length === 0 ? (
              <p className="py-8 text-center text-sm" style={{ color: 'var(--color-fg-muted)' }}>
                Ninguém encontrado.
              </p>
            ) : (
              hits.map((p) => (
                <button
                  key={p.matricula}
                  type="button"
                  onClick={() => {
                    onSelect(p)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]"
                >
                  <PessoaAvatar nome={p.nome} foto={p.foto} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>
                      {p.nome}
                    </span>
                    <span className="block truncate text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                      {[p.cargo, p.area].filter(Boolean).join(' · ') || '—'}
                    </span>
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                    {p.matricula}
                  </span>
                </button>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
