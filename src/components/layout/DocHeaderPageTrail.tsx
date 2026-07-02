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
    'min-w-0 truncate font-heading text-sm font-semibold leading-snug tracking-tight sm:text-base',
    dark ? 'text-[#fafafa]' : 'text-[var(--color-fg)]',
  )

  if (groupLabel === pageTitle) {
    return (
      <nav aria-label="Trilho da documentação" className="min-w-0 flex-1">
        <p className={cn('m-0', titleClass)}>{pageTitle}</p>
      </nav>
    )
  }

  return (
    <nav aria-label="Trilho da documentação" className="min-w-0 flex-1">
      <ol className="m-0 flex min-w-0 list-none items-baseline gap-1.5 p-0 sm:gap-2">
        <li
          className={cn(
            'min-w-0 max-w-[min(11rem,42vw)] shrink truncate font-sans text-xs font-medium leading-snug sm:max-w-[13rem] sm:text-[13px]',
            dark ? 'text-[#A1A1AA]' : 'text-[var(--color-fg-muted)]',
          )}
        >
          {groupLabel}
        </li>
        <li
          aria-hidden
          className={cn(
            'shrink-0 select-none font-sans text-xs font-light leading-none sm:text-[13px]',
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
