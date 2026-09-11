import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, Users, X } from 'lucide-react'
import { FIPS_ROLE_COLOR, FIPS_ROLE_LABEL, fipsUserInitials, type FipsUser } from '../../docs/data/users'

/**
 * BuscarUsuarioModal — "Entrar como usuário…" do menu Minha Conta.
 * Mesma anatomia canônica do `BuscarPessoaModal` (Radix cru + card FIPS
 * 12/12/12/24, faixa gov com tile do ícone ÂMBAR, campo fixo, lista .fips-scroll
 * com pb-6). Aqui a linha mostra avatar · nome · e-mail e o PAPEL colorido à
 * direita; busca sem acento/caixa por nome ou e-mail.
 * Ver `plans/spec-buscar-responsavel-modal.md` e o spec "Minha Conta".
 */

/** Remove acentos e caixa para busca tolerante (Unicode property escape, sem combinantes no fonte). */
function norm(s: string) {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function Avatar({ user }: { user: FipsUser }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.fullName}
        referrerPolicy="no-referrer"
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
      style={{ background: FIPS_ROLE_COLOR[user.role] }}
    >
      {fipsUserInitials(user.name)}
    </span>
  )
}

export function BuscarUsuarioModal({
  open,
  onOpenChange,
  users,
  onSelect,
  title = 'Entrar como usuário',
  descricao = 'Busque pelo nome ou e-mail.',
}: {
  open: boolean
  onOpenChange: (aberto: boolean) => void
  users: FipsUser[]
  onSelect: (user: FipsUser) => void
  title?: string
  descricao?: string
}) {
  const [q, setQ] = useState('')

  const hits = useMemo(() => {
    const query = norm(q.trim())
    if (!query) return users
    return users.filter((u) => norm(u.fullName).includes(query) || norm(u.email).includes(query))
  }, [q, users])

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
          {/* Header — faixa gov (ícone âmbar) */}
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
                <Dialog.Description className="text-xs leading-snug text-white/65">{descricao}</Dialog.Description>
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

          {/* Campo fixo */}
          <div className="shrink-0 px-6 pt-5 pb-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite o nome ou e-mail…"
                aria-label="Buscar usuário"
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

          {/* Lista rolável — barra fina + pb-6 */}
          <div className="fips-scroll flex-1 space-y-0.5 overflow-y-auto px-6 pb-6">
            {hits.length === 0 ? (
              <p className="py-8 text-center text-sm" style={{ color: 'var(--color-fg-muted)' }}>
                Ninguém encontrado.
              </p>
            ) : (
              hits.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onSelect(u)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
                >
                  <Avatar user={u} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold" style={{ color: 'var(--color-fg)' }}>
                      {u.fullName}
                    </span>
                    <span className="block truncate text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                      {u.email}
                    </span>
                  </span>
                  <span
                    className="ml-2 shrink-0 text-xs font-medium"
                    style={{ color: FIPS_ROLE_COLOR[u.role] }}
                  >
                    {FIPS_ROLE_LABEL[u.role]}
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
