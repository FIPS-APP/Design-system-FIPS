import { Search } from 'lucide-react'
import { cn } from '../../lib/cn'
import { docHeaderSearchInputLightClass } from '../../lib/docHeaderChrome'

export type SearchPillProps = {
  compact?: boolean
  variant?: 'shell' | 'docHeader' | 'docs'
  dark?: boolean
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export function SearchPill({
  compact = false,
  variant = 'docs',
  dark = false,
  placeholder,
  className,
  'aria-label': ariaLabel,
}: SearchPillProps) {
  const defaultPlaceholder = variant === 'shell' ? 'Buscar...' : 'Buscar na documentação…'
  const ph = placeholder ?? defaultPlaceholder

  if (dark) {
    return (
      <div className={cn('relative mx-auto w-full max-w-xs', className)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="search"
          placeholder={ph}
          aria-label={ariaLabel ?? 'Buscar'}
          className="h-[35px] w-full rounded-lg border border-[#3F3F46] bg-[#141416] py-0 pl-9 pr-3 font-sans text-[13px] leading-normal text-[#E2E2E8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[#71717A] backdrop-blur-sm focus-visible:outline-none focus-visible:border-[#F6921E] focus-visible:ring-2 focus-visible:ring-[#F6921E] focus-visible:ring-offset-0"
        />
      </div>
    )
  }

  if (variant === 'docHeader') {
    return (
      <div className={cn('relative mx-auto w-full max-w-xs', className)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-neutral-500"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="search"
          placeholder={ph}
          aria-label={ariaLabel ?? 'Buscar'}
          className={docHeaderSearchInputLightClass}
        />
      </div>
    )
  }

  const shellClassic =
    'items-center rounded-lg border-[1.5px] border-white/[0.16] bg-white/[0.1] text-white/[0.72] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm'
  const docs =
    'items-center rounded-lg border-[1.5px] border-[var(--color-border)]/60 bg-[var(--color-surface)] text-[var(--color-fg-muted)] shadow-sm'

  const layoutShell = compact
    ? 'sm:flex h-[30px] w-full max-w-[210px] gap-2 px-3'
    : 'md:flex h-[35px] w-full max-w-xs gap-2 px-3'
  const layoutDocs = 'md:flex h-[35px] w-full max-w-xs gap-2 px-3'

  const isDarkVariant = variant === 'shell'

  return (
    <div
      role="search"
      aria-label={ariaLabel ?? 'Buscar'}
      className={cn(
        'hidden',
        isDarkVariant ? shellClassic : docs,
        isDarkVariant ? layoutShell : layoutDocs,
        className,
      )}
    >
      <Search
        className={cn(
          'h-4 w-4 shrink-0',
          isDarkVariant ? 'text-white/[0.65]' : 'text-[var(--color-fg-muted)]',
        )}
        aria-hidden
      />
      <span
        className={cn(
          'min-w-0 truncate font-sans',
          compact ? 'text-[12px] leading-none' : 'text-[13px] leading-normal',
        )}
      >
        {ph}
      </span>
    </div>
  )
}
