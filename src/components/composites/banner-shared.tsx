import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { JunctionLines } from '../icons/JunctionLines'

export const FIPS_BANNER_PAGE_CLASS = 'fips-banner-shell--page'
export const FIPS_BANNER_CONTENT_CLASS = 'fips-banner-shell--content'

/**
 * Tile âmbar do banner. As percentagens vêm do `#FDC24E18` / `#FDC24E30` do HeroBannerDoc —
 * que são alfas hexadecimais (0x18 ≈ 10%, 0x30 ≈ 19%), não 18%/30%. Lidos como percentagem,
 * o tile saía com o dobro do preenchimento do banner documentado e do `PageHeader` do Governança BI.
 */
export const FIPS_BANNER_ICON_BOX_STYLE: CSSProperties = {
  background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
  border: '1px solid color-mix(in srgb, var(--color-accent) 19%, transparent)',
}

export const FIPS_BANNER_PILL_STYLE: CSSProperties = {
  background: 'var(--fips-banner-pill-bg)',
  border: '1px solid var(--fips-banner-pill-border)',
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
    <JunctionLines
      className={cn('fips-banner-junction pointer-events-none', className)}
      style={style}
    />
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
