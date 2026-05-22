import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Switch } from '../ui/switch'

type SettingsPreferenceRowProps = {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  variant?: 'default' | 'info'
}

export function SettingsPreferenceRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  variant = 'default',
}: SettingsPreferenceRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-[10px_10px_10px_18px] border px-3 py-3 transition-colors',
        variant === 'info'
          ? 'border-[var(--color-fips-blue-400)]/35 bg-[var(--color-semantic-info-bg)] hover:bg-[color-mix(in_srgb,var(--color-semantic-info-bg)_85%,var(--color-fips-blue-200))]'
          : 'border-transparent bg-[var(--color-surface-soft)] hover:bg-[var(--color-surface-muted)]',
      )}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--color-fg)]">{label}</div>
        {description ? (
          <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{description}</p>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}
