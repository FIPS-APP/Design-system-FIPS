import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, LogOut, Settings, UserRound, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/badge'
import { BuscarUsuarioModal } from '../composites/BuscarUsuarioModal'
import {
  FIPS_ROLE_BADGE_VARIANT,
  FIPS_ROLE_COLOR,
  FIPS_ROLE_LABEL,
  FIPS_ROLES,
  FIPS_USERS,
  fipsUserById,
  fipsUserInitials,
  type FipsUser,
  type FipsUserRole,
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
  /** Pessoa efetiva (impersonada por "Entrar como usuário"). */
  activeUserId: string
  onActiveUserChange: (id: string) => void
  /** Papel de acesso em teste ("Perfil (Modo Dev)") — NÃO troca a pessoa. */
  devRole: FipsUserRole
  onDevRoleChange: (role: FipsUserRole) => void
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
  devRole,
  onDevRoleChange,
}: UserAccountMenuProps) {
  const activeUser = fipsUserById(activeUserId)
  // Usuário efetivo: a pessoa (nome/e-mail/cargo/área) + o papel em teste (devRole).
  const effectiveUser: FipsUser = { ...activeUser, role: devRole }
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null)
  const [buscarOpen, setBuscarOpen] = useState(false)

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
                <UserAvatar user={effectiveUser} size={36} />
                <div className="min-w-0 flex-1 pt-0.5 leading-tight">
                  <p className="truncate text-[13px] font-semibold text-[var(--color-fg)] dark:text-white">
                    {activeUser.fullName}
                  </p>
                  <p className="truncate text-[11px] text-[var(--color-fg-muted)]">{activeUser.email}</p>
                  <p className="truncate text-[11px] font-medium text-[var(--color-fg-muted)]">{activeUser.cargo}</p>
                </div>
              </div>

              {/* Classificação de acesso: badge de perfil (papel em teste) + badge de área */}
              <div className="flex flex-wrap items-center gap-1 px-3.5 pb-2.5">
                <Badge size="sm" variant={FIPS_ROLE_BADGE_VARIANT[devRole]}>
                  {FIPS_ROLE_LABEL[devRole]}
                </Badge>
                {activeUser.area ? (
                  <Badge size="sm" variant="secondary">
                    {activeUser.area}
                  </Badge>
                ) : null}
              </div>

              <div className="h-px bg-[var(--color-border)]" />

              {/* Perfil (Modo Dev) */}
              <div className="px-3.5 pt-2 pb-0.5 text-[9px] font-semibold tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
                Perfil (Modo Dev)
              </div>
              {/* Lista de PAPÉIS (só o perfil — sem nome/foto), Check verde no ativo. */}
              <div className="pb-1">
                {FIPS_ROLES.map((role) => {
                  const isActive = role === devRole
                  return (
                    <button
                      key={role}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => onDevRoleChange(role)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] transition-colors',
                        isActive
                          ? 'bg-[var(--color-primary)]/8'
                          : 'hover:bg-[var(--color-accent)]/20 dark:hover:bg-[var(--color-accent)]/12',
                      )}
                    >
                      <span
                        className="min-w-0 flex-1 truncate font-medium"
                        style={{ color: FIPS_ROLE_COLOR[role] }}
                      >
                        {FIPS_ROLE_LABEL[role]}
                      </span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-success-strong)]" aria-hidden />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Entrar como usuário — abre o BuscarUsuarioModal */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenChange(false)
                  setBuscarOpen(true)
                }}
                className="group flex w-full items-center gap-2 px-3.5 py-1 pb-2 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-accent)]/20 dark:text-white/85 dark:hover:bg-[var(--color-accent)]/12"
              >
                <Users
                  className="h-3.5 w-3.5 text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-accent-strong)]"
                  aria-hidden
                />
                Entrar como usuário…
              </button>

              <div className="h-px bg-[var(--color-border)]" />

              {/* Ações da conta */}
              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => toast('Meu perfil em breve')}
                  className="group flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-accent)]/20 dark:text-white/85 dark:hover:bg-[var(--color-accent)]/12"
                >
                  <UserRound
                    className="h-3.5 w-3.5 text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-accent-strong)]"
                    aria-hidden
                  />
                  Meu perfil
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => toast('Preferências em breve')}
                  className="group flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-accent)]/20 dark:text-white/85 dark:hover:bg-[var(--color-accent)]/12"
                >
                  <Settings
                    className="h-3.5 w-3.5 text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-accent-strong)]"
                    aria-hidden
                  />
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

      <BuscarUsuarioModal
        open={buscarOpen}
        onOpenChange={setBuscarOpen}
        users={FIPS_USERS}
        onSelect={(u) => onActiveUserChange(u.id)}
      />
    </div>
  )
}
