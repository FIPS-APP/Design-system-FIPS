import { cn } from '../../lib/cn'

/**
 * Trilho "grupo / página" do header — tipografia alinhada (corpo + heading no título).
 * Suporta dark mode.
 */
export function DocHeaderPageTrail({
  groupLabel,
  pageTitle,
  dark,
}: {
  groupLabel: string
  pageTitle: string
  dark?: boolean
}) {
  const titleClass = cn(
    'min-w-0 truncate font-heading text-sm font-semibold leading-snug tracking-tight',
    dark ? 'text-[#fafafa]' : 'text-[var(--color-fg)]',
  )

  const mobileMark = (
    <div
      className={cn(
        'flex h-8 w-auto shrink-0 items-center justify-center rounded-lg border bg-white px-1.5 sm:hidden',
        dark ? 'border-white/10' : 'border-black/10',
      )}
    >
      <img src="/appfips-logo-full.png" alt="App FIPS" className="h-full w-auto object-contain" />
    </div>
  )

  if (groupLabel === pageTitle) {
    return (
      <nav aria-label="Trilho da documentação" className="flex min-w-0 flex-1 items-center">
        {mobileMark}
        <p className={cn('m-0 hidden sm:block', titleClass)}>{pageTitle}</p>
      </nav>
    )
  }

  return (
    <nav aria-label="Trilho da documentação" className="flex min-w-0 flex-1 items-center">
      {mobileMark}
      <ol className="m-0 hidden min-w-0 list-none items-baseline gap-1 p-0 sm:flex sm:gap-1.5">
        <li
          className={cn(
            'min-w-0 max-w-[min(11rem,42vw)] shrink truncate font-sans text-[11px] font-medium leading-snug sm:max-w-[13rem] sm:text-xs',
            dark ? 'text-[#A1A1AA]' : 'text-[var(--color-fg-muted)]',
          )}
        >
          {groupLabel}
        </li>
        <li
          aria-hidden
          className={cn(
            'shrink-0 select-none font-sans text-[11px] font-light leading-none sm:text-xs',
            dark ? 'text-[#52525B]' : 'text-[var(--color-border-strong)]',
          )}
        >
          /
        </li>
        <li className={cn('min-w-0 flex-1', titleClass)}>{pageTitle}</li>
      </ol>
    </nav>
  )
}
