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
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[12px_12px_12px_24px] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:duration-200">
          {/* Header canônico DS-FIPS: faixa gov + trilhos + ícone-tile âmbar + eyebrow + título 21px */}
          <div
            className="relative flex shrink-0 items-center gap-3.5 overflow-hidden px-6 py-5 pr-14 text-white"
            style={{ background: 'var(--fips-banner-content-bg)' }}
          >
            {/* Decoração ferroviária (JunctionLines) */}
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
              <Sparkles className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
            </div>
            <div className="relative min-w-0">
              <span className="block font-heading text-[11px] leading-tight font-semibold tracking-[0.14em] text-[var(--color-accent-strong)] uppercase">
                Versão {CURRENT_VERSION}
              </span>
              <DialogPrimitive.Title className="font-heading text-[21px] leading-tight font-bold tracking-[-0.2px] text-white">
                Novidades do Sistema
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-[3px] text-xs leading-snug text-white/65">
                Confira as últimas atualizações e melhorias do Design System FIPS
              </DialogPrimitive.Description>
            </div>
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
