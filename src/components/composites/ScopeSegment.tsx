import type { LucideIcon } from 'lucide-react'

export type ScopeSegmentItem<K extends string> = {
  key: K
  label: string
  Icon: LucideIcon
  count: number
}

/**
 * Alçada Minha Área / Toda jurisdição na toolbar (paridade Gestão OPA /dashboard).
 * Fundo blue-100, borda primary 1.5px; segmento ativo azul cheio + contador mono.
 */
export function ScopeSegment<K extends string>({
  value,
  onChange,
  items,
  label = 'Alçada',
  countUnit = 'OPAs',
}: {
  value: K
  onChange: (key: K) => void
  items: ScopeSegmentItem<K>[]
  label?: string
  /** Texto do aria-label do contador (ex.: "10 OPAs"). */
  countUnit?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0"
      style={{
        gap: 2,
        padding: 2,
        background: 'var(--color-fips-blue-100)',
        borderRadius: 8,
        border: '1.5px solid var(--color-primary)',
      }}
    >
      {items.map(({ key, label: itemLabel, Icon, count }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            title={`${count} ${countUnit} com os filtros e o período atuais`}
            className="inline-flex items-center transition-all"
            style={{
              gap: 5,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: isActive ? '#fff' : 'var(--color-primary)',
              background: isActive ? 'var(--color-primary)' : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,42,104,0.18)' : 'none',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <Icon style={{ width: 12, height: 12 }} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
            {itemLabel}
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: isActive ? 'rgba(255,255,255,0.75)' : 'var(--color-primary)',
                opacity: isActive ? 1 : 0.65,
              }}
              aria-label={`${count} ${countUnit}`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
