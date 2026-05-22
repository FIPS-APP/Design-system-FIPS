import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const FIPS_BANNER_PAGE_CLASS = 'fips-banner-shell--page'
export const FIPS_BANNER_CONTENT_CLASS = 'fips-banner-shell--content'

export const FIPS_BANNER_ICON_BOX_STYLE: CSSProperties = {
  background: 'color-mix(in srgb, var(--color-accent) 18%, transparent)',
  border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
}

export const FIPS_BANNER_PILL_STYLE: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 20,
  padding: '5px 14px',
}

export function BannerJunctionLines({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      className={cn('fips-banner-junction pointer-events-none', className)}
      style={style}
      aria-hidden
    >
      <path d="M0 60H100C120 60 120 60 140 40L200 40H320" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 60H100C120 60 120 60 140 80L200 80H320" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 100L160 100H320" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M0 120H60C80 120 80 120 100 140L160 140H320" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

export function BannerIconBox({ children, compact }: { children: ReactNode; compact?: boolean }) {
  const size = compact ? 38 : 44
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, borderRadius: 11, ...FIPS_BANNER_ICON_BOX_STYLE }}
    >
      {children}
    </div>
  )
}
