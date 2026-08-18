import { type ReactNode } from 'react'

type DocPageProps = {
  title: string
  description?: string
  children: ReactNode
}

export function DocPage({ title, description, children }: DocPageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
      <header className="space-y-5 border-b border-[var(--color-border)] pb-8 dark:-mx-4 dark:-mt-8 dark:rounded-b-2xl dark:border-b-0 dark:bg-[var(--color-gov-gradient-from)] dark:px-8 dark:py-10 sm:dark:-mx-8 lg:dark:-mx-10 lg:dark:-mt-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-muted)] dark:text-[var(--color-accent)]">
            Design System FIPS
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--color-fg)] dark:text-white md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] dark:text-white/70">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <div className="space-y-10">{children}</div>
    </div>
  )
}

type DemoSectionProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DemoSection({ title, children, className }: DemoSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold tracking-wider text-[var(--color-fg-muted)] uppercase">
        {title}
      </h2>
      <div
        className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] ${className ?? ''}`}
      >
        {children}
      </div>
    </section>
  )
}
