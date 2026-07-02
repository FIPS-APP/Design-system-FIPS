import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Check, LogOut, Settings, UserRound, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/badge'
import {
  FIPS_ROLE_BADGE_VARIANT,
  FIPS_ROLE_COLOR,
  FIPS_ROLE_LABEL,
  FIPS_USERS,
  fipsUserById,
  fipsUserInitials,
  type FipsUser,
} from '../../docs/data/users'

/**
 * Modal "Minha Conta" — padrão canônico DS-FIPS (header gov + trilhos + ícone-tile âmbar),
 * adaptado do dropdown de usuário do Governança BI (perfil ativo + troca de perfil demo + ações).
 */

export type UserMenuModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeUserId: string
  onActiveUserChange: (id: string) => void
}

function UserAvatar({ user, size = 44 }: { user: FipsUser; size?: number }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.fullName}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34), background: FIPS_ROLE_COLOR[user.role] }}
    >
      {fipsUserInitials(user.name)}
    </span>
  )
}

export function UserMenuModal({ open, onOpenChange, activeUserId, onActiveUserChange }: UserMenuModalProps) {
  const activeUser = fipsUserById(activeUserId)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[12px_12px_12px_24px] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200">
          {/* Header canônico DS-FIPS: faixa gov + trilhos + ícone-tile âmbar + eyebrow + título 21px */}
          <div
            className="relative flex shrink-0 items-center gap-3.5 overflow-hidden px-6 py-5 pr-14 text-white"
            style={{ background: 'var(--fips-banner-content-bg)' }}
          >
            <svg
              viewBox="0 0 320 200"
              fill="none"
              aria-hidden
              className="pointer-events-none absolute -top-2.5 -right-5 h-[200px] w-[360px] opacity-[0.06]"
            >
              <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <DialogPrimitive.Close
              className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/75 transition-colors hover:bg-white/[0.18] hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" aria-hidden />
            </DialogPrimitive.Close>

            <div
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10"
              style={{ boxShadow: '0 1px 2px rgba(0,42,104,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              <UserRound className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
            </div>
            <div className="relative min-w-0">
              <span className="block font-heading text-[11px] leading-tight font-semibold tracking-[0.14em] text-[var(--color-accent-strong)] uppercase">
                Minha Conta
              </span>
              <DialogPrimitive.Title className="truncate font-heading text-[21px] leading-tight font-bold tracking-[-0.2px] text-white">
                {activeUser.fullName}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-[3px] truncate text-xs leading-snug text-white/65">
                {activeUser.cargo}
              </DialogPrimitive.Description>
            </div>
          </div>

          {/* Corpo rolável */}
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {/* Perfil ativo */}
            <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-3">
              <UserAvatar user={activeUser} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--color-fg)] dark:text-white">{activeUser.email}</p>
                <p className="truncate text-[11px] text-[var(--color-fg-muted)]">{activeUser.cargo}</p>
                <div className="mt-1.5">
                  <Badge size="sm" variant={FIPS_ROLE_BADGE_VARIANT[activeUser.role]}>
                    {FIPS_ROLE_LABEL[activeUser.role]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Trocar de perfil (demo) */}
            <div className="mt-5">
              <p className="mb-2 px-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
                Trocar de perfil (demo)
              </p>
              <div className="space-y-1">
                {FIPS_USERS.map((u) => {
                  const isActive = u.id === activeUser.id
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onActiveUserChange(u.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
                        isActive ? 'bg-[var(--color-primary)]/8' : 'hover:bg-[var(--color-surface-muted)]',
                      )}
                    >
                      <UserAvatar user={u} size={28} />
                      <span className="min-w-0 flex-1 leading-[1.15]">
                        <span className="block truncate text-[12px] font-medium text-[var(--color-fg)] dark:text-white">
                          {u.name}
                        </span>
                        <span
                          className="block truncate text-[10px] font-medium"
                          style={{ color: FIPS_ROLE_COLOR[u.role] }}
                        >
                          {u.cargo}
                        </span>
                      </span>
                      {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-success-strong)]" aria-hidden />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Rodapé — ações da conta */}
          <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 p-2">
            <button
              type="button"
              onClick={() => toast('Meu perfil em breve')}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface)] dark:text-white/85"
            >
              <UserRound className="h-4 w-4 text-[var(--color-fg-muted)]" aria-hidden />
              Meu perfil
            </button>
            <button
              type="button"
              onClick={() => toast('Preferências em breve')}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface)] dark:text-white/85"
            >
              <Settings className="h-4 w-4 text-[var(--color-fg-muted)]" aria-hidden />
              Preferências
            </button>
            <button
              type="button"
              onClick={() => {
                toast('Sessão encerrada (demo)')
                onOpenChange(false)
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/8"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
