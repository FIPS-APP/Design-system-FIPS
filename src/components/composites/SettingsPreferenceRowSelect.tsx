import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Select, type SelectOption } from '../ui/select'

/**
 * Linha de preferência com escolha entre opções.
 *
 * Mesma anatomia do `SettingsPreferenceRow` — canto 10/10/10/18, recuo de 12px,
 * rótulo em 14/500 e descrição em 12 apagada sobre a superfície suave —
 * trocando o interruptor por um `Select`.
 *
 * O DS nasceu só com a versão de interruptor porque as preferências do
 * Suprimentos são de ligar e desligar. Existe preferência que não é binária:
 * "de quanto em quanto tempo o aviso de atraso repete" tem três respostas, e
 * nenhuma delas é sim ou não.
 */
export type SettingsPreferenceRowSelectProps = {
  label: ReactNode
  description?: ReactNode
  options: SelectOption[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  /** Rótulo acessível do campo; sem ele, o leitor de tela ouve só as opções. */
  fieldLabel: string
  variant?: 'default' | 'info'
}

export function SettingsPreferenceRowSelect({
  label,
  description,
  options,
  value,
  onValueChange,
  disabled,
  fieldLabel,
  variant = 'default',
}: SettingsPreferenceRowSelectProps) {
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
      <div className="w-[180px] shrink-0">
        <Select
          options={options}
          value={value}
          onChange={onValueChange}
          density="compact"
          disabled={disabled}
          aria-label={fieldLabel}
        />
      </div>
    </div>
  )
}
