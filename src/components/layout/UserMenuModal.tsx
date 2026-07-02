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
 * Modal "Minha Conta" — réplica fiel (compacta, sem faixa gov) do dropdown de
 * usuário do Governança BI: avatar + nome + e-mail + cargo + badge de perfil,
 * troca de perfil (demo) e ações, usando o Dialog do DS-FIPS no lugar de DropdownMenu.
 */

export type UserMenuModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeUserId: string
  onActiveUserChange: (id: string) => void
}

function UserAvatar({ user, size = 36 }: { user: FipsUser; size?: number }) {
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
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] max-w-[280px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200">
          <DialogPrimitive.Close
            className="absolute top-2.5 right-2.5 z-[1] flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-fg)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/30 focus-visible:outline-none"
            aria-label="Fechar"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </DialogPrimitive.Close>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* Cabeçalho compacto: avatar + nome + e-mail + cargo */}
            <div className="flex items-start gap-2.5 px-3.5 pt-3.5 pb-2.5">
              <UserAvatar user={activeUser} size={36} />
              <div className="min-w-0 flex-1 pt-0.5 leading-tight">
                <DialogPrimitive.Title className="truncate text-[13px] font-semibold text-[var(--color-fg)] dark:text-white">
                  {activeUser.fullName}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="truncate text-[11px] text-[var(--color-fg-muted)]">
                  {activeUser.email}
                </DialogPrimitive.Description>
                <p className="truncate text-[11px] font-medium text-[var(--color-fg-muted)]">{activeUser.cargo}</p>
              </div>
            </div>

            {/* Badge de perfil */}
            <div className="flex items-center gap-1 px-3.5 pb-2.5">
              <Badge size="sm" variant={FIPS_ROLE_BADGE_VARIANT[activeUser.role]}>
                {FIPS_ROLE_LABEL[activeUser.role]}
              </Badge>
            </div>

            <div className="h-px bg-[var(--color-border)]" />

            {/* Trocar de perfil (demo) */}
            <div className="px-3.5 pt-2 pb-0.5 text-[9px] font-semibold tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
              Trocar de perfil (demo)
            </div>
            <div className="pb-1">
              {FIPS_USERS.map((u) => {
                const isActive = u.id === activeUser.id
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => onActiveUserChange(u.id)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3.5 py-1 text-left transition-colors',
                      isActive ? 'bg-[var(--color-primary)]/8' : 'hover:bg-[var(--color-surface-muted)]',
                    )}
                  >
                    <UserAvatar user={u} size={24} />
                    <span className="min-w-0 flex-1 leading-[1.15]">
                      <span className="block truncate text-[12px] font-medium text-[var(--color-fg)] dark:text-white">
                        {u.name}
                      </span>
                      <span className="block truncate text-[9px] font-medium" style={{ color: FIPS_ROLE_COLOR[u.role] }}>
                        {u.cargo}
                      </span>
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-success-strong)]" aria-hidden />}
                  </button>
                )
              })}
            </div>

            <div className="h-px bg-[var(--color-border)]" />

            {/* Ações da conta */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toast('Meu perfil em breve')}
                className="flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-muted)] dark:text-white/85"
              >
                <UserRound className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" aria-hidden />
                Meu perfil
              </button>
              <button
                type="button"
                onClick={() => toast('Preferências em breve')}
                className="flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-muted)] dark:text-white/85"
              >
                <Settings className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" aria-hidden />
                Preferências
              </button>
              <button
                type="button"
                onClick={() => {
                  toast('Sessão encerrada (demo)')
                  onOpenChange(false)
                }}
                className="flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/8"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Sair
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
