import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, LogOut, Settings, UserRound } from 'lucide-react'
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
 * Menu "Minha Conta" — réplica fiel do dropdown de usuário do Governança BI:
 * painel ancorado embaixo do chip (não é modal centralizado), fecha ao clicar
 * fora ou Esc. Portado para `document.body` com posição calculada a partir do
 * trigger — headers do DS-FIPS (DocLayout, DocHeaderStandard) têm `overflow-hidden`
 * pro clipping do art decorativo, que cortaria um painel `absolute` in-place.
 */

export type UserAccountMenuProps = {
  trigger: ReactNode
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

export function UserAccountMenu({
  trigger,
  open,
  onOpenChange,
  activeUserId,
  onActiveUserChange,
}: UserAccountMenuProps) {
  const activeUser = fipsUserById(activeUserId)
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null)

  /** Recalcula a posição do painel a partir do trigger — necessário pois ele é portado pro body. */
  useLayoutEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  /** Fecha o painel ao clicar fora ou pressionar Esc — mesmo padrão do popover "Modo menu" do sidebar. */
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      const insideAnchor = anchorRef.current?.contains(target)
      const insidePanel = panelRef.current?.contains(target)
      if (!insideAnchor && !insidePanel) onOpenChange(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <div ref={anchorRef} className="inline-flex">
      {trigger}
      {open && position
        ? createPortal(
            <div
              ref={panelRef}
              role="menu"
              aria-label="Minha conta"
              className="fixed z-50 flex w-[280px] flex-col overflow-hidden rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] animate-in fade-in zoom-in-95 duration-150"
              style={{ top: position.top, right: position.right }}
            >
              {/* Cabeçalho compacto: avatar + nome + e-mail + cargo */}
              <div className="flex items-start gap-2.5 px-3.5 pt-3.5 pb-2.5">
                <UserAvatar user={activeUser} size={36} />
                <div className="min-w-0 flex-1 pt-0.5 leading-tight">
                  <p className="truncate text-[13px] font-semibold text-[var(--color-fg)] dark:text-white">
                    {activeUser.fullName}
                  </p>
                  <p className="truncate text-[11px] text-[var(--color-fg-muted)]">{activeUser.email}</p>
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
                      role="menuitemradio"
                      aria-checked={isActive}
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
                        <span
                          className="block truncate text-[9px] font-medium"
                          style={{ color: FIPS_ROLE_COLOR[u.role] }}
                        >
                          {u.cargo}
                        </span>
                      </span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-success-strong)]" aria-hidden />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="h-px bg-[var(--color-border)]" />

              {/* Ações da conta */}
              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => toast('Meu perfil em breve')}
                  className="flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-muted)] dark:text-white/85"
                >
                  <UserRound className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" aria-hidden />
                  Meu perfil
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => toast('Preferências em breve')}
                  className="flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-muted)] dark:text-white/85"
                >
                  <Settings className="h-3.5 w-3.5 text-[var(--color-fg-muted)]" aria-hidden />
                  Preferências
                </button>
                <button
                  type="button"
                  role="menuitem"
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
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
