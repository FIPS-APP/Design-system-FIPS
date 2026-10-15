import { type LucideIcon } from 'lucide-react'
import { PillFilter, type PillOption } from './PillFilter'

/** Rótulo + pills do drawer de filtros (poucas opções). */
export function PillGroup({
  icon: Icon,
  label,
  options,
  value,
  onChange,
  multiple = false,
}: {
  icon: LucideIcon
  label: string
  options: PillOption[]
  value: string | string[]
  onChange: (v: string) => void
  multiple?: boolean
}) {
  return (
    <div>
      <p className="mb-1.5 ml-[7px] flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-fg)]">
        <Icon className="h-3 w-3 shrink-0 text-[var(--color-fg-muted)]" aria-hidden /> {label}
      </p>
      <PillFilter options={options} value={value} onChange={onChange} multiple={multiple} />
    </div>
  )
}
