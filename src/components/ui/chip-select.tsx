import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown, Search, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

/** A partir de quantas opções o dropdown ganha busca (rolar dezenas de itens não escala). */
const BUSCA_MIN_OPCOES = 10

/** Comparação pra busca: sem acento e sem caixa ("Jose" acha "Jose"). */
export const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/** Ponteiro fino (mouse): focar o campo de busca ao abrir é seguro; no toque abriria o teclado virtual. */
const ponteiroFino = () => typeof window === 'undefined' || !!window.matchMedia?.('(pointer: fine)').matches

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
  const [hi, setHi] = useState(-1)
  // O realce veio do teclado: só então ele rola a lista e ganha o indicador de teclado.
  // Clique para abrir e hover do mouse não rolam nada.
  const [teclado, setTeclado] = useState(false)
  // O campo de busca recebe o foco ao abrir (ponteiro fino). Sem isso o foco fica no gatilho.
  const [focaBusca, setFocaBusca] = useState(ponteiroFino)
  const ref = useRef<HTMLDivElement>(null)
  const gatilhoRef = useRef<HTMLButtonElement>(null)
  const buscaRef = useRef<HTMLInputElement>(null)
  const uid = useId()
  const listId = `${uid}-lista`
  const optId = useCallback((i: number) => `${uid}-opcao-${i}`, [uid])
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  // Abriu: cursor já na busca (digita direto, sem clicar). Só com ponteiro fino:
  // no toque, focar o campo abre o teclado virtual por cima da lista.
  useEffect(() => {
    if (open && focaBusca) buscaRef.current?.focus()
  }, [open, focaBusca])
  // Escape com o dropdown aberto fecha só o dropdown (e devolve o foco ao gatilho). Escuta na
  // captura da window porque o drawer de filtros (Radix) escuta na captura do document.
  useEffect(() => {
    if (!open) return
    const h = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || !ref.current?.contains(document.activeElement)) return
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      gatilhoRef.current?.focus()
    }
    window.addEventListener('keydown', h, true)
    return () => window.removeEventListener('keydown', h, true)
  }, [open])
  // Opção realçada pelo teclado fica visível dentro da lista rolável.
  useEffect(() => {
    if (open && teclado && hi >= 0) document.getElementById(optId(hi))?.scrollIntoView({ block: 'nearest' })
  }, [open, teclado, hi, optId])

  const comBusca = searchable ?? options.length >= BUSCA_MIN_OPCOES
  const visiveis = useMemo(() => {
    const q = normalizar(busca.trim())
    if (!q) return options
    return options.filter((o) => normalizar(o.label).includes(q))
  }, [options, busca])

  // Abrir limpa a busca na mesma atualização, para o realce (índice em `options`) e a lista
  // completa chegarem juntos e a opção selecionada ser rolada para a vista.
  const abrir = (realce: number, porTeclado: boolean) => {
    setBusca('')
    setTeclado(porTeclado)
    setFocaBusca(ponteiroFino())
    setOpen(true)
    setHi(options.length ? realce : -1)
  }
  // Move o realce pelo teclado, sempre dentro das opções visíveis.
  const mover = (proximo: (h: number) => number) => {
    setTeclado(true)
    setHi((h) => Math.min(Math.max(proximo(h), 0), visiveis.length - 1))
  }
  const fechar = () => {
    setOpen(false)
    gatilhoRef.current?.focus()
  }
  const escolher = (v: string) => {
    onChange(v)
    fechar()
  }

  // Mesmo teclado no gatilho e no campo de busca: setas, Home/End, Enter, Escape e Tab.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const atual = options.findIndex((o) => o.value === value)
    const ultimo = visiveis.length - 1
    const noCampo = e.currentTarget === buscaRef.current
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(e.key)) {
        e.preventDefault()
        abrir(e.key === 'End' || (e.key === 'ArrowUp' && atual < 0) ? options.length - 1 : e.key === 'Home' ? 0 : Math.max(atual, 0), true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        mover((h) => h + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        mover((h) => h - 1)
        break
      case 'Home':
      case 'End':
        // No campo de busca, Home/End movem o cursor do texto.
        if (noCampo) break
        e.preventDefault()
        mover(() => (e.key === 'Home' ? 0 : ultimo))
        break
      case ' ':
        if (noCampo) break
        e.preventDefault()
        if (hi >= 0 && visiveis[hi]) escolher(visiveis[hi].value)
        break
      case 'Enter':
        e.preventDefault()
        if (hi >= 0 && visiveis[hi]) escolher(visiveis[hi].value)
        break
      case 'Tab':
        // Fechar desmonta o campo que tem o foco antes de o navegador mover o foco, e o focus trap
        // do drawer (Radix) leva o foco ao início do painel. Devolver o foco ao gatilho antes de
        // fechar faz o Tab seguir dali; o Shift+Tab fica no próprio gatilho.
        if (noCampo) {
          if (e.shiftKey) e.preventDefault()
          gatilhoRef.current?.focus()
        }
        setOpen(false)
        break
    }
  }

  const ativo = open && hi >= 0 && hi < visiveis.length ? optId(hi) : undefined
  const current = options.find((o) => o.value === value)?.label ?? ''
  return (
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <button
        ref={gatilhoRef}
        type="button"
        onClick={() => (open ? setOpen(false) : abrir(options.findIndex((o) => o.value === value), false))}
        onKeyDown={onKeyDown}
        // Firefox clica o botão no keyup do Espaço, mesmo com preventDefault no keydown.
        onKeyUp={(e) => { if (e.key === ' ') e.preventDefault() }}
        aria-label={ariaLabel}
        // Sem busca, ou com a busca sem foco (toque), o foco fica no gatilho: ele é o combobox e anuncia o realce.
        role={comBusca && focaBusca ? undefined : 'combobox'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={comBusca && focaBusca ? undefined : ativo}
        className={cn(chipTriggerCls(open), block && 'flex w-full')}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" aria-hidden />
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
                name={`busca-${normalizar(fieldLabel).replace(/[^a-z0-9]+/g, '-')}`}
                autoComplete="off"
                role="combobox"
                aria-expanded
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={ativo}
                onChange={(e) => { setBusca(e.target.value); setTeclado(true); setHi(0) }}
                onKeyDown={onKeyDown}
                placeholder={`Buscar ${fieldLabel.toLowerCase()}…`}
                aria-label={`Buscar em ${fieldLabel}`}
                className="min-w-0 flex-1 rounded-sm border-none bg-transparent text-[11px] font-medium text-[var(--color-fg)] outline-none placeholder:font-normal placeholder:text-[var(--color-fg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] dark:focus-visible:ring-[var(--color-fips-blue-400)]"
              />
            </div>
          )}
          {/* onMouseDown: clique numa opção não tira o foco do gatilho nem da busca. */}
          <div id={listId} role="listbox" aria-label={ariaLabel} onMouseDown={(e) => e.preventDefault()} className="min-h-0 flex-1 overflow-y-auto py-1.5">
            {visiveis.map((o, i) => {
              const active = o.value === value
              return (
                <div
                  key={o.value}
                  id={optId(i)}
                  role="option"
                  aria-selected={active}
                  onClick={() => escolher(o.value)}
                  // onMouseMove, não onMouseEnter: a lista que rola sob o ponteiro parado dispara mouseenter
                  // e puxaria o realce do teclado de volta. Só movimento real do mouse move o realce.
                  onMouseMove={() => { if (teclado || hi !== i) { setTeclado(false); setHi(i) } }}
                  onMouseLeave={() => { if (!teclado) setHi(-1) }}
                  className={cn(
                    chipOptionCls(active),
                    i === hi && !active && 'bg-[var(--color-surface-muted)]',
                    // Indicador do realce de teclado: barra de 3px (>= 3:1 contra a lista nos dois temas).
                    i === hi && teclado && 'shadow-[inset_3px_0_0_var(--color-primary)] dark:shadow-[inset_3px_0_0_var(--color-fips-blue-400)]',
                  )}
                >
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
