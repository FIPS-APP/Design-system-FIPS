import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface AvisoSomenteLeituraProps {
  /** O motivo, numa frase: o que o perfil não faz nesta tela. */
  children: ReactNode
  /** Palavra de abertura em destaque. Padrão "Somente leitura." */
  titulo?: string
  className?: string
}

/**
 * Aviso de tela só para consulta: cadeado, "Somente leitura." em destaque e o motivo ao lado. As telas que
 * gravam escondem os botões quando a permissão não libera a ação; sem esta linha, quem chega não sabe se
 * falta permissão ou se a tela quebrou.
 */
export function AvisoSomenteLeitura({ children, titulo = 'Somente leitura.', className }: AvisoSomenteLeituraProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-[7px]',
        className,
      )}
    >
      <Lock className="mt-0.5 size-[13px] shrink-0 text-[var(--color-fg-muted)]" strokeWidth={2} aria-hidden />
      <span className="text-[11.5px] leading-[1.4] text-[var(--color-fg-muted)]">
        <strong className="text-[var(--color-fg)]">{titulo}</strong> {children}
      </span>
    </div>
  )
}
