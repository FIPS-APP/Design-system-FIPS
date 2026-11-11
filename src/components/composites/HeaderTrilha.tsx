import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { PassoDaTrilha, RenderizarLinkDaCasca } from './app-shell-tipos'

export interface HeaderTrilhaProps {
  passos: PassoDaTrilha[]
  /** Desenha o link de um passo com `href`. Sem ele, `<a href>`. */
  renderLink?: RenderizarLinkDaCasca
  className?: string
}

/**
 * Trilha de localização do cabeçalho ("Home › Inspeção › Nova"). O último passo é a tela atual, em
 * negrito. Some abaixo de 640px. `aria-label="Localização"`.
 */
export function HeaderTrilha({ passos, renderLink, className }: HeaderTrilhaProps) {
  return (
    <nav
      aria-label="Localização"
      className={cn('hidden min-w-0 items-center gap-1.5 text-sm text-[color-mix(in_srgb,var(--color-fg-muted)_72%,var(--color-fg))] sm:flex', className)}
    >
      {passos.map((passo, idx) => {
        const ultimo = idx === passos.length - 1
        const classe = cn('truncate', ultimo && 'font-semibold text-[var(--color-fg)]')
        return (
          <span key={`${passo.label}-${idx}`} className="flex min-w-0 items-center gap-1.5">
            {idx > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]/60" aria-hidden />
            ) : null}
            {passo.href && !ultimo ? (
              renderLink ? (
                renderLink({
                  href: passo.href,
                  className: cn(classe, 'hover:text-[var(--color-fg)] hover:underline'),
                  children: passo.label,
                })
              ) : (
                <a href={passo.href} className={cn(classe, 'hover:text-[var(--color-fg)] hover:underline')}>
                  {passo.label}
                </a>
              )
            ) : (
              <span className={classe} aria-current={ultimo ? 'page' : undefined}>
                {passo.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
