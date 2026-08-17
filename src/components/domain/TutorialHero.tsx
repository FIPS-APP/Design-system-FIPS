import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface TutorialHeroProps {
  /** Rótulo curto uppercase acima do título (dourado). */
  eyebrow?: ReactNode
  title: ReactNode
  /** Ícone do tile âmbar (24px de caixa útil). */
  icon: ReactNode
  onClose: () => void
  closeLabel?: string
  className?: string
}

/**
 * Header hero das superfícies de tutorial — mesma anatomia do `Modal hero` e do
 * `WorkspaceFormDialog` (padrão canônico em `patterns.md § Header hero + form dialog`):
 * faixa gradiente gov de 3 stops, tile âmbar 44×44, eyebrow dourado, título Saira 21px
 * branco e X próprio no canto.
 *
 * Existe porque o tour e o tutorial contextual não podem usar o `Modal` (são superfícies
 * não bloqueantes, sem Dialog/focus trap) — mas devem ser visualmente o mesmo modal.
 */
export function TutorialHero({
  eyebrow,
  title,
  icon,
  onClose,
  closeLabel = 'Fechar',
  className,
}: TutorialHeroProps) {
  return (
    <div
      className={cn('relative flex shrink-0 items-center gap-3.5 overflow-hidden px-6 py-5 pr-14', className)}
      style={{
        background:
          'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)',
      }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border"
        style={{
          background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
          borderColor: 'color-mix(in srgb, var(--color-accent) 19%, transparent)',
          color: 'var(--color-accent)',
        }}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <span className="block font-heading text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--color-accent-strong)]">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-heading text-[21px] font-bold leading-tight tracking-[-0.2px] text-white">{title}</h2>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/75 transition-colors hover:bg-white/[0.18] hover:text-white focus:outline-none"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
