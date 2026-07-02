import { DocPage } from '../components/DocPage'
import { Badge } from '../../components/ui/badge'
import type { BadgeVariantProps } from '../../components/ui/badge-variants'
import { CHANGELOG } from '../data/changelog'

const entries = CHANGELOG

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${MESES[m - 1]} ${y}`
}

type Kind = 'major' | 'minor' | 'patch' | 'inicial'

function bumpKind(curr: string, prev?: string): Kind {
  if (!prev) return 'inicial'
  const [aMaj, aMin] = curr.split('.').map(Number)
  const [bMaj, bMin] = prev.split('.').map(Number)
  if (aMaj > bMaj) return 'major'
  if (aMin > bMin) return 'minor'
  return 'patch'
}

const KIND_META: Record<
  Kind,
  { label: string; variant: NonNullable<BadgeVariantProps['variant']> }
> = {
  major: { label: 'Major', variant: 'warning' },
  minor: { label: 'Minor', variant: 'info' },
  patch: { label: 'Patch', variant: 'secondary' },
  inicial: { label: 'Marco inicial', variant: 'success' },
}

export default function ChangelogPage() {
  return (
    <DocPage
      title="Histórico de versões"
      description="Evolução do pacote de design system e da documentação interna, em ordem cronológica decrescente."
    >
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <ol className="relative">
          {entries.map((e, i) => {
            const isLatest = i === 0
            const isLast = i === entries.length - 1
            const meta = KIND_META[bumpKind(e.version, entries[i + 1]?.version)]
            return (
              <li key={e.version} className="grid grid-cols-[18px_1fr] gap-x-4 sm:gap-x-5">
                {/* trilho da timeline */}
                <div className="relative flex flex-col items-center">
                  <span
                    aria-hidden
                    className={
                      isLatest
                        ? 'mt-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-accent-strong)] shadow-[0_0_0_4px_rgba(246,146,30,0.2)]'
                        : 'mt-[5px] h-2.5 w-2.5 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)] dark:border-[#93BDE4]'
                    }
                  />
                  {!isLast && <span aria-hidden className="w-px flex-1 bg-[var(--color-border)]" />}
                </div>

                {/* conteúdo da versão */}
                <div className={isLast ? 'pb-0' : 'pb-9'}>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    <h2 className="font-heading text-lg font-semibold tracking-tight text-[var(--color-fg)] dark:text-white">
                      v{e.version}
                    </h2>
                    {isLatest ? <Badge variant="warning">Atual</Badge> : null}
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <time className="ml-auto text-xs font-medium tabular-nums text-[var(--color-fg-muted)] dark:text-white/60">
                      {formatDate(e.date)}
                    </time>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {e.entries.map((entry) => (
                      <li
                        key={entry.description}
                        className="flex gap-2.5 text-sm leading-relaxed text-[var(--color-fg-muted)] dark:text-white/70"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent-strong)]"
                        />
                        <span>{entry.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </DocPage>
  )
}
