import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { BannerIconBox, BannerJunctionLines, FIPS_BANNER_CONTENT_CLASS } from './banner-shared'

export type PatternPanelHeroStat = {
  label: string
  value: string | number
  dotColor?: string
}

export type PatternPanelHeroProps = {
  title: ReactNode
  subtitle: string
  icon: ReactNode
  badge?: ReactNode
  badgePill?: boolean
  action?: ReactNode
  stats?: PatternPanelHeroStat[]
  compact?: boolean
  className?: string
}

export function PatternPanelHero({
  title,
  subtitle,
  icon,
  badge,
  badgePill = false,
  action,
  stats,
  compact = false,
  className,
}: PatternPanelHeroProps) {
  const mob = compact
  const hasStats = Boolean(stats?.length)

  return (
    <div
      className={cn(FIPS_BANNER_CONTENT_CLASS, mob && 'fips-banner-shell--compact', className)}
      style={{ padding: mob ? '18px 18px' : '22px 26px' }}
    >
      <BannerJunctionLines
        style={{ position: 'absolute', top: -10, right: -20, width: mob ? 180 : 360, height: 200 }}
      />
      {hasStats ? (
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex items-center gap-3.5">
              <BannerIconBox compact={mob}>{icon}</BannerIconBox>
              <div className="min-w-0">
                {badge ? (
                  <div className={badgePill ? 'mb-2' : 'mb-1'}>
                    {badgePill ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/10 px-3.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                        {badge}
                      </span>
                    ) : (
                      badge
                    )}
                  </div>
                ) : null}
                <h2
                  className="m-0 font-heading font-bold leading-[1.15] tracking-[-0.2px] text-white"
                  style={{ fontSize: mob ? 17 : 21 }}
                >
                  {title}
                </h2>
                <p className="mt-1 font-sans leading-[1.4] text-white/[0.67]" style={{ fontSize: mob ? 11 : 12 }}>
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2" style={{ paddingLeft: mob ? 0 : 58 }}>
              {stats!.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[11px] font-semibold text-white/75"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: s.dotColor ?? 'var(--color-accent-strong)' }}
                    aria-hidden
                  />
                  {s.label} <strong className="font-bold text-white">{s.value}</strong>
                </span>
              ))}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : (
        <div className="relative flex flex-wrap items-center" style={{ gap: mob ? 12 : 16 }}>
          <BannerIconBox compact={mob}>{icon}</BannerIconBox>
          <div className="min-w-0 flex-1">
            {badge ? (
              <div className={badgePill ? 'mb-2' : 'mb-1'}>
                {badgePill ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/10 px-3.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                    {badge}
                  </span>
                ) : (
                  badge
                )}
              </div>
            ) : null}
            <h2
              className="m-0 font-heading font-bold leading-[1.15] tracking-[-0.2px] text-white"
              style={{ fontSize: mob ? 17 : 21 }}
            >
              {title}
            </h2>
            <p className="mt-1 font-sans leading-[1.4] text-white/[0.67]" style={{ fontSize: mob ? 11 : 12, margin: '4px 0 0' }}>
              {subtitle}
            </p>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
    </div>
  )
}
