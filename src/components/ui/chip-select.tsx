import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

/** A partir de quantas opções o dropdown ganha busca (rolar dezenas de itens não escala). */
const BUSCA_MIN_OPCOES = 10

/** Comparação pra busca: sem acento e sem caixa ("Jose" acha "Jose"). */
export const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// Padrão "chip" de filtro do DS-FIPS (DataListingDemo): trigger 32.5px, radius 8,
// 11px/600, prefixo mudo "Label:" + valor bold. Usado na barra de ferramentas E
// dentro do drawer de filtros. NÃO confundir com <Select> (campo de formulário).
// Único ponto de verdade pro tamanho — mude aqui, muda em toda a barra/drawer.
export const chipTriggerCls = (open: boolean) => cn(
  'inline-flex items-center gap-1.5 rounded-lg border bg-[var(--color-surface)] px-3 py-[7px] text-[11px] font-semibold text-[var(--color-fg)] shadow-sm transition-all duration-150 hover:border-[var(--color-border)]',
  open ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20' : 'border-[var(--color-border)]/60',
)

export const chipOptionCls = (active: boolean) => cn(
  'flex cursor-pointer items-center gap-2 px-3.5 py-2 text-[11px] transition-colors duration-100',
  active ? 'bg-[var(--color-primary)]/8 font-bold text-[var(--color-primary)]' : 'font-medium text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]',
)

// Radio-circle do dropdown (padrão DS-FIPS: aro 14px, ponto 6px azul).
export function ChipRadio({ active }: { active: boolean }) {
  return (
    <span className={cn('flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px]', active ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]')}>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />}
    </span>
  )
}

// Select single-value no padrão chip (mesmo trigger do Período, dropdown com radio).
// `block` = full-width empilhado (drawer); default = inline por conteúdo (barra).
// O chip mostra o label do value via options — não tem placeholder; garanta um
// item "Todos"/"Todas" (value vazio) nas options pra não ficar vazio.
// Campos com muitas opções (Cargo, gestores…) ganham busca no topo automaticamente.
export function ChipSelect({ icon: Icon, fieldLabel, value, onChange, options, ariaLabel, className, block = false, searchable }: {
  icon: LucideIcon
  fieldLabel: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  ariaLabel: string
  className?: string
  block?: boolean
  /** Busca no topo do dropdown. Padrão: automático a partir de BUSCA_MIN_OPCOES opções. */
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [busca, setBusca] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const buscaRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  // Abriu: campo limpo e cursor já na busca (digita direto, sem clicar).
  useEffect(() => {
    if (!open) return
    setBusca('')
    buscaRef.current?.focus()
  }, [open])

  const comBusca = searchable ?? options.length >= BUSCA_MIN_OPCOES
  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim())
    if (!q) return options
    return options.filter((o) => normalizar(o.label).includes(q))
  }, [options, busca])

  const current = options.find((o) => o.value === value)?.label ?? ''
  return (
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-label={ariaLabel} className={cn(chipTriggerCls(open), block && 'flex w-full')}>
        <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" />
        <span className="shrink-0 text-[var(--color-fg-muted)]">{fieldLabel}:</span>
        <span className={cn('truncate font-bold text-[var(--color-fg)]', block && 'flex-1 text-left')}>{current}</span>
        <ChevronDown className={cn('h-2.5 w-2.5 shrink-0 text-[var(--color-fg-muted)] transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 flex max-h-[280px] min-w-[200px] flex-col overflow-hidden rounded-[8px_8px_8px_14px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_12px_36px_rgba(0,42,104,0.18),0_2px_8px_rgba(0,42,104,0.06)]">
          {/* Busca (só em campo com muitas opções) — mesma linguagem do SearchField. */}
          {comBusca && (
            <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" aria-hidden />
              <input
                ref={buscaRef}
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
                placeholder={`Buscar ${fieldLabel.toLowerCase()}…`}
                aria-label={`Buscar em ${fieldLabel}`}
                className="min-w-0 flex-1 border-none bg-transparent text-[11px] font-medium text-[var(--color-fg)] outline-none placeholder:font-normal placeholder:text-[var(--color-fg-muted)]"
              />
            </div>
          )}
          <div role="listbox" className="min-h-0 flex-1 overflow-y-auto py-1.5">
            {visiveis.map((o) => {
              const active = o.value === value
              return (
                <div key={o.value} role="option" aria-selected={active} onClick={() => { onChange(o.value); setOpen(false) }} className={chipOptionCls(active)}>
                  <ChipRadio active={active} />
                  <span className="flex-1 truncate">{o.label}</span>
                </div>
              )
            })}
            {visiveis.length === 0 && (
              <p className="px-3.5 py-3 text-center text-[11px] text-[var(--color-fg-muted)]">Nenhum resultado</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
