import type { LucideIcon } from 'lucide-react'

export type ScopeSegmentItem<K extends string> = {
  key: K
  label: string
  Icon: LucideIcon
  count: number
}

/**
 * Recorte Minha Área / Toda jurisdição na toolbar de listagem.
 * Fundo branco, borda cinza, segmento ativo azul cheio + contador mono.
 */
export function ScopeSegment<K extends string>({
  value,
  onChange,
  items,
  label = 'Área',
}: {
  value: K
  onChange: (key: K) => void
  items: ScopeSegmentItem<K>[]
  label?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0"
      style={{
        gap: 2,
        padding: 2,
        background: 'var(--color-surface)',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
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
              aria-label={`${count} registros`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
