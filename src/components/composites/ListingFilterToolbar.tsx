import { useEffect, useRef, type ReactNode } from 'react'
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  Filter,
  Globe,
  Search,
  User,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScopeSegment } from './ScopeSegment'

export const LISTING_PERIOD_PRESETS = [
  'Últimos 7 dias',
  'Últimos 30 dias',
  'Últimos 90 dias',
  'Este ano',
  'Tudo',
] as const

export type ListingPeriodPreset = (typeof LISTING_PERIOD_PRESETS)[number] | 'Personalizado'

export type ListingFilterToolbarProps = {
  filterActiveCount: number
  onOpenFilters: () => void
  filtersOpen?: boolean
  scope: 'minha' | 'todos'
  onScopeChange: (scope: 'minha' | 'todos') => void
  countMinha: number
  countTodos: number
  search: string
  onSearchChange: (value: string) => void
  periodLabel: string
  period: ListingPeriodPreset
  onPeriodChange: (period: ListingPeriodPreset) => void
  showPeriod: boolean
  onShowPeriodChange: (open: boolean) => void
  dateStart: string
  dateEnd: string
  onDateStartChange: (v: string) => void
  onDateEndChange: (v: string) => void
  onApplyCustomPeriod: () => void
  canApplyCustomPeriod: boolean
  onExportExcel?: () => void
  onExportPdf?: () => void
  exportDisabled?: boolean
  /** Slot após Período, antes do export (ex.: spacer). */
  trailing?: ReactNode
}

/**
 * Card toolbar de listagem/dashboard — paridade Painel de Ações e Histórico OPA:
 * Filtros · Alçada · Busca flex-1 · Período · Excel/PDF.
 */
export function ListingFilterToolbar({
  filterActiveCount,
  onOpenFilters,
  filtersOpen = false,
  scope,
  onScopeChange,
  countMinha,
  countTodos,
  search,
  onSearchChange,
  periodLabel,
  period,
  onPeriodChange,
  showPeriod,
  onShowPeriodChange,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
  onApplyCustomPeriod,
  canApplyCustomPeriod,
  onExportExcel,
  onExportPdf,
  exportDisabled = false,
  trailing,
}: ListingFilterToolbarProps) {
  const periodRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPeriod) return
    const h = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) onShowPeriodChange(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showPeriod, onShowPeriodChange])

  return (
    <div
      className="mt-3 flex flex-wrap items-center"
      style={{
        padding: '14px 18px',
        gap: 10,
        background: 'var(--color-surface)',
        borderRadius: '10px 10px 10px 18px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0,75,155,.04)',
      }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenFilters}
        aria-expanded={filtersOpen}
        aria-haspopup="dialog"
      >
        <Filter className="h-4 w-4" />
        Filtros
        {filterActiveCount > 0 && (
          <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-[var(--color-surface)]">
            {filterActiveCount}
          </span>
        )}
      </Button>

      <ScopeSegment
        value={scope}
        onChange={onScopeChange}
        label="Alçada"
        countUnit="OPAs"
        items={[
          { key: 'minha', label: 'Minha Área', Icon: User, count: countMinha },
          { key: 'todos', label: 'Toda jurisdição', Icon: Globe, count: countTodos },
        ]}
      />

      <div className="min-w-0 flex-1">
        <Input
          type="search"
          density="compact"
          leftIcon={<Search className="h-4 w-4" />}
          placeholder="Buscar OPAs por número, área, responsável, município…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar OPAs"
        />
      </div>

      <div ref={periodRef} className="relative">
        <button
          type="button"
          onClick={() => onShowPeriodChange(!showPeriod)}
          aria-expanded={showPeriod}
          aria-haspopup="listbox"
          className="inline-flex items-center transition-all"
          style={{
            gap: 6,
            padding: '7px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-fg)',
            background: 'var(--color-surface)',
            border: `1px solid ${showPeriod ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 8,
          }}
        >
          <Calendar style={{ width: 13, height: 13 }} strokeWidth={2} aria-hidden />
          <span style={{ color: 'var(--color-fg-muted)' }}>Período:</span>
          <span style={{ fontWeight: 700 }}>{periodLabel}</span>
          <ChevronDown
            style={{
              width: 10,
              height: 10,
              color: showPeriod ? 'var(--color-primary)' : 'var(--color-fg-muted)',
              transition: 'transform .15s',
              transform: showPeriod ? 'rotate(180deg)' : 'none',
            }}
            strokeWidth={2.5}
            aria-hidden
          />
        </button>
        {showPeriod ? (
          <ul
            role="listbox"
            aria-label="Selecionar período"
            className="absolute right-0 top-full z-30 mt-2 overflow-hidden"
            style={{
              minWidth: 200,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              boxShadow: '0 10px 30px rgba(0,42,104,0.15)',
              padding: 4,
            }}
          >
            {LISTING_PERIOD_PRESETS.map((p) => {
              const isActive = period === p
              return (
                <li key={p}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onPeriodChange(p)
                      onShowPeriodChange(false)
                    }}
                    className="flex w-full items-center transition-colors"
                    style={{
                      gap: 8,
                      padding: '7px 10px',
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-fg)',
                      background: isActive ? 'var(--color-fips-blue-200)' : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Calendar
                      style={{ width: 12, height: 12, color: isActive ? 'var(--color-primary)' : 'var(--color-fg-muted)' }}
                      strokeWidth={2}
                      aria-hidden
                    />
                    {p}
                    {isActive ? (
                      <CheckCircle2
                        style={{ width: 12, height: 12, marginLeft: 'auto', color: 'var(--color-primary)' }}
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              )
            })}
            <li style={{ marginTop: 4, padding: '10px 10px 8px', borderTop: '1px solid var(--color-border)' }}>
              <p
                className="font-heading"
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--color-fg-muted)',
                  marginBottom: 8,
                }}
              >
                Intervalo personalizado
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-1">
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-fg-muted)' }}>Data início</span>
                  <input
                    type="date"
                    value={dateStart}
                    max={dateEnd || undefined}
                    onChange={(e) => onDateStartChange(e.target.value)}
                    className="transition-colors focus:border-[var(--color-primary)]"
                    style={{
                      padding: '5px 8px',
                      fontSize: 11,
                      color: 'var(--color-fg)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 6,
                      outline: 'none',
                    }}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-fg-muted)' }}>Data fim</span>
                  <input
                    type="date"
                    value={dateEnd}
                    min={dateStart || undefined}
                    onChange={(e) => onDateEndChange(e.target.value)}
                    className="transition-colors focus:border-[var(--color-primary)]"
                    style={{
                      padding: '5px 8px',
                      fontSize: 11,
                      color: 'var(--color-fg)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 6,
                      outline: 'none',
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={onApplyCustomPeriod}
                  disabled={!canApplyCustomPeriod}
                  className="text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'var(--color-primary)',
                    borderRadius: 6,
                    marginTop: 4,
                  }}
                >
                  Aplicar intervalo
                </button>
              </div>
            </li>
          </ul>
        ) : null}
      </div>

      {trailing}

      <button
        type="button"
        title="Exportar para Excel"
        aria-label="Exportar Excel"
        onClick={onExportExcel}
        disabled={exportDisabled}
        className="inline-flex items-center justify-center transition-all disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          width: 34,
          height: 34,
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-surface)',
          cursor: 'pointer',
        }}
      >
        <FileSpreadsheet style={{ width: 16, height: 16, color: '#1D6F42' }} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        title="Exportar para PDF"
        aria-label="Exportar PDF"
        onClick={onExportPdf}
        disabled={exportDisabled}
        className="inline-flex items-center justify-center transition-all disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          width: 34,
          height: 34,
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-surface)',
          cursor: 'pointer',
        }}
      >
        <FileDown style={{ width: 16, height: 16, color: '#C0392B' }} strokeWidth={1.8} />
      </button>
    </div>
  )
}
