import { useState, type ComponentType } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, Sparkles, Bug, Wrench, Rocket, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import {
  CHANGELOG,
  CURRENT_VERSION,
  type ChangelogType,
} from '../../docs/data/changelog'

/**
 * Modal "Novidades do Sistema" — padrão de versionamento FIPS (origem: Governança TI).
 * Acionado pelo item "Versão" do rodapé do sidebar. Header gradiente institucional,
 * mudanças em cards por tipo (Novidade / Melhoria / Correção / Importante).
 */

type TypeStyle = {
  icon: ComponentType<{ className?: string }>
  label: string
  /** fundo + borda do card */
  card: string
  /** cor do ícone e do rótulo (light usa tom forte; dark usa tom base) */
  accent: string
}

const TYPE_CONFIG: Record<ChangelogType, TypeStyle> = {
  feature: {
    icon: Sparkles,
    label: 'Novidade',
    card: 'border-[var(--color-success)]/25 bg-[var(--color-success)]/10',
    accent: 'text-[var(--color-success-strong)] dark:text-[var(--color-success)]',
  },
  improvement: {
    icon: Wrench,
    label: 'Melhoria',
    card: 'border-[var(--color-secondary)]/25 bg-[var(--color-secondary)]/10',
    accent: 'text-[var(--color-primary)] dark:text-[var(--color-secondary)]',
  },
  fix: {
    icon: Bug,
    label: 'Correção',
    card: 'border-[var(--color-danger)]/25 bg-[var(--color-danger)]/10',
    accent: 'text-[var(--color-danger)]',
  },
  breaking: {
    icon: Rocket,
    label: 'Importante',
    card: 'border-[var(--color-accent-strong)]/25 bg-[var(--color-accent-strong)]/10',
    accent: 'text-[var(--color-accent-strong)]',
  },
}

function formatDateBR(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR')
}

export type ChangelogModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangelogModal({ open, onOpenChange }: ChangelogModalProps) {
  const [showAll, setShowAll] = useState(false)
  const versionsToShow = showAll ? CHANGELOG : [CHANGELOG[0]]

  const handleOpenChange = (next: boolean) => {
    if (!next) setShowAll(false)
    onOpenChange(next)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <DialogPrimitive.Content
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200"
          aria-describedby={undefined}
        >
          {/* Header gradiente institucional */}
          <div className="relative bg-gradient-to-r from-[var(--color-fips-blue-950)] to-[var(--color-fips-sky-600)] p-6 text-white">
            <DialogPrimitive.Close
              className="absolute top-4 right-4 rounded-full p-2 text-white/90 transition-colors hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" aria-hidden />
            </DialogPrimitive.Close>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="font-heading text-xl font-bold tracking-tight">
                  Novidades do Sistema
                </DialogPrimitive.Title>
                <p className="text-sm text-white/80">Versão {CURRENT_VERSION}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Confira as últimas atualizações e melhorias do Design System FIPS
            </p>
          </div>

          {/* Corpo rolável */}
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {versionsToShow.map((version, vIndex) => (
              <div key={version.version} className={vIndex > 0 ? 'mt-6 border-t border-[var(--color-border)] pt-6' : ''}>
                <div className="mb-4">
                  <h3 className="font-heading font-semibold text-[var(--color-fg)] dark:text-white">{version.title}</h3>
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    v{version.version} • {formatDateBR(version.date)}
                  </p>
                </div>

                <div className="space-y-3">
                  {version.entries.map((entry, index) => {
                    const config = TYPE_CONFIG[entry.type]
                    const Icon = config.icon
                    return (
                      <div
                        key={index}
                        className={cn('flex items-start gap-3 rounded-lg border p-3', config.card)}
                      >
                        <div className={cn('mt-0.5 shrink-0 rounded-md p-1.5', config.accent)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={cn('text-xs font-semibold tracking-wide uppercase', config.accent)}>
                            {config.label}
                          </span>
                          <p className="mt-0.5 text-sm text-[var(--color-fg)] dark:text-white/80">{entry.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {CHANGELOG.length > 1 && !showAll && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline dark:text-[#93BDE4]"
              >
                Ver versões anteriores
              </button>
            )}
          </div>

          {/* Rodapé */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 p-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleOpenChange(false)}
            >
              <CheckCircle2 aria-hidden />
              Entendi, vamos lá!
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
