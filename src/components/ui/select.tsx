import * as React from 'react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { rolarOpcaoParaVista } from '../../lib/rolar-para-vista'
import type { FieldDensity } from './field'
import { calcularPosicaoLista, mesmaPosicaoLista, type PosicaoLista } from './lista-flutuante'

// No servidor a lista nunca está aberta; useEffect evita o aviso do useLayoutEffect no React 18.
const useLayoutEffectSeguro = typeof document !== 'undefined' ? useLayoutEffect : useEffect

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps {
  options?: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Nome do campo no submit nativo de `<form>` (vai num input oculto com o valor atual). */
  name?: string
  leftIcon?: React.ReactNode
  /** Rótulo curto do campo, renderizado como prefixo mudo antes do valor (ex.: "Área:"). */
  fieldLabel?: string
  density?: FieldDensity
  disabled?: boolean
  className?: string
  'aria-label'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  children?: React.ReactNode
}

/**
 * Select com dropdown customizado — padrão DS-FIPS.
 * Aceita `options` prop OU `<option>` children para retrocompatibilidade.
 *
 * A lista abre num portal para o `body`, com `position: fixed` na coordenada do gatilho. Assim
 * nenhum ancestral com overflow (corpo rolável de Modal, Drawer, card de canto arredondado) a
 * corta. Ela sobe quando embaixo não cabe e, se faltar espaço dos dois lados, encolhe e rola.
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options: optionsProp,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Selecione…',
      name,
      leftIcon,
      fieldLabel,
      density = 'default',
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Parse options from children (<option>) if not provided via prop
    const options = React.useMemo<SelectOption[]>(() => {
      if (optionsProp) return optionsProp
      const parsed: SelectOption[] = []
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const p = child.props as { value?: string; children?: React.ReactNode }
          parsed.push({
            value: String(p.value ?? ''),
            label: String(p.children ?? p.value ?? ''),
          })
        }
      })
      return parsed
    }, [optionsProp, children])

    const [open, setOpen] = useState(false)
    const [internal, setInternal] = useState(defaultValue ?? '')
    const val = controlledValue !== undefined ? controlledValue : internal
    const wrapRef = useRef<HTMLDivElement>(null)
    const gatilhoRef = useRef<HTMLButtonElement>(null)
    const listaRef = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState<PosicaoLista | null>(null)
    const [hi, setHi] = useState(-1)
    // O realce veio do teclado: só então ele rola a lista e ganha o indicador de teclado.
    // Clique para abrir e hover do mouse não rolam nada.
    const [teclado, setTeclado] = useState(false)
    const uid = useId()
    const listId = `${uid}-lista`
    const optId = useCallback((i: number) => `${uid}-opcao-${i}`, [uid])

    const isDense = density === 'dense'
    const isCompact = density === 'compact' || isDense
    const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true'
    const listaAberta = open && !disabled

    // Close on outside click. A lista mora no body, fora do wrapper: clicar nela é "dentro".
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        const alvo = e.target as Node
        if (wrapRef.current && !wrapRef.current.contains(alvo) && !listaRef.current?.contains(alvo)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])


    // Posiciona a lista: mede o gatilho e a lista antes de pintar (a lista nasce `hidden`) e mede de
    // novo a cada rolagem e redimensionamento. A rolagem escuta na captura porque o corpo rolável de
    // um Modal não borbulha o `scroll` até a window. Se o gatilho sai da área visível (rolou para
    // fora do corpo do Modal, por exemplo), a lista fecha em vez de ficar solta na tela.
    useLayoutEffectSeguro(() => {
      if (!listaAberta) return
      const gatilho = gatilhoRef.current
      const lista = listaRef.current
      if (!gatilho || !lista) return
      const raiz = document.documentElement
      const medir = () => {
        const r = gatilho.getBoundingClientRect()
        // A largura vem antes da altura: rótulo longo quebra linha e muda a altura da lista.
        lista.style.width = `${r.width}px`
        const alturaLista = lista.scrollHeight + lista.offsetHeight - lista.clientHeight
        const prox = calcularPosicaoLista(r, { largura: raiz.clientWidth, altura: raiz.clientHeight }, alturaLista)
        setPos((ant) => (mesmaPosicaoLista(ant, prox) ? ant : prox))
      }
      medir()
      window.addEventListener('scroll', medir, true)
      window.addEventListener('resize', medir)
      const visivel =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(([entrada]) => {
              if (entrada && !entrada.isIntersecting) setOpen(false)
            })
      visivel?.observe(gatilho)
      return () => {
        window.removeEventListener('scroll', medir, true)
        window.removeEventListener('resize', medir)
        visivel?.disconnect()
        setPos(null)
      }
    }, [listaAberta, options.length])

    // Escape com a lista aberta fecha só a lista. Escuta na captura da window porque Dialog e
    // Drawer (Radix) escutam na captura do document, antes do onKeyDown do React.
    useEffect(() => {
      if (!open) return
      const h = (e: KeyboardEvent) => {
        if (e.key !== 'Escape' || !wrapRef.current?.contains(document.activeElement)) return
        e.preventDefault()
        e.stopPropagation()
        setOpen(false)
      }
      window.addEventListener('keydown', h, true)
      return () => window.removeEventListener('keydown', h, true)
    }, [open])

    // Opção realçada pelo teclado fica visível dentro da lista rolável.
    useEffect(() => {
      if (open && teclado && hi >= 0) rolarOpcaoParaVista(optId(hi))
    }, [open, teclado, hi, optId])

    const selectedIndex = options.findIndex((o) => o.value === val)
    const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : undefined

    const select = (v: string) => {
      setInternal(v)
      onChange?.(v)
      setOpen(false)
    }

    const abrir = (realce: number, porTeclado: boolean) => {
      setTeclado(porTeclado)
      setOpen(true)
      setHi(options.length ? realce : -1)
    }

    // Move o realce pelo teclado, sempre dentro das opções (sem opções, nenhum realce).
    const mover = (proximo: (h: number) => number) => {
      setTeclado(true)
      setHi((h) => Math.min(Math.max(proximo(h), 0), options.length - 1))
    }
    const ativo = open && hi >= 0 && hi < options.length ? optId(hi) : undefined

    // Teclado no padrão combobox "só seleção" (WAI-ARIA 1.2): o foco fica no gatilho e a opção
    // realçada é anunciada por aria-activedescendant.
    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      const ultimo = options.length - 1
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          abrir(selectedIndex >= 0 ? selectedIndex : 0, true)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          abrir(selectedIndex >= 0 ? selectedIndex : ultimo, true)
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault()
          abrir(e.key === 'Home' ? 0 : ultimo, true)
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
          e.preventDefault()
          mover(() => 0)
          break
        case 'End':
          e.preventDefault()
          mover(() => ultimo)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (hi >= 0 && options[hi]) select(options[hi].value)
          else setOpen(false)
          break
        case 'Tab':
          setOpen(false)
          break
      }
    }

    return (
      <div
        ref={(node) => {
          ;(wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('relative w-full', open && 'z-30', className)}
      >
        {/* Trigger */}
        <button
          ref={gatilhoRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          aria-activedescendant={ativo}
          aria-label={props['aria-label']}
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            if (open) setOpen(false)
            else abrir(selectedIndex, false)
          }}
          onKeyDown={onKeyDown}
          // Firefox clica o botão no keyup do Espaço, mesmo com preventDefault no keydown.
          onKeyUp={(e) => { if (e.key === ' ') e.preventDefault() }}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-[var(--color-border-control)] bg-[var(--color-surface)] text-left text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg-muted)] focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-fg-muted)] disabled:opacity-70 dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/25',
            isCompact ? 'h-8 px-2.5 text-[13px]' : 'h-12 px-4 text-[1.08rem]',
            leftIcon && (isCompact ? 'pl-8' : 'pl-11'),
            // Aberto, o gatilho perde o canto do lado em que a lista emenda (embaixo, ou em cima quando ela sobe).
            open && (pos?.abrirParaCima ? 'rounded-t-none' : 'rounded-b-none'),
            open && 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25 dark:border-[#93BDE4] dark:ring-[#93BDE4]/25',
            isInvalid && 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/25',
          )}
        >
          {leftIcon ? (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]',
                isCompact ? 'left-2.5 [&_svg]:h-3.5 [&_svg]:w-3.5' : 'left-4 [&_svg]:h-4 [&_svg]:w-4',
              )}
            >
              {leftIcon}
            </span>
          ) : null}
          {fieldLabel ? (
            <span className="shrink-0 text-[var(--color-fg-muted)]">{fieldLabel}:</span>
          ) : null}
          <span className={cn('flex-1 truncate', !selectedLabel && 'text-[var(--color-fg-muted)]')}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'shrink-0 text-[var(--color-fg-muted)] transition-transform duration-200',
              isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        {/* Dropdown: portal no body, fora de qualquer overflow de ancestral */}
        {listaAberta && typeof document !== 'undefined'
          ? createPortal(
              <div
                ref={listaRef}
                id={listId}
                role="listbox"
                aria-label={props['aria-label']}
                // Mesmo marcador do SelectBusca dos apps: quem fecha por clique fora com `contains` deve ignorar este alvo.
                data-lista-flutuante=""
                style={{
                  position: 'fixed',
                  left: pos?.left ?? 0,
                  width: pos?.width,
                  top: pos?.abrirParaCima ? undefined : (pos?.top ?? 0),
                  bottom: pos?.abrirParaCima ? pos.bottom : undefined,
                  maxHeight: pos?.maxHeight,
                  // Até a primeira medida a lista existe (para ser medida) mas não aparece.
                  visibility: pos ? undefined : 'hidden',
                  // Modal e Drawer (Radix) põem pointer-events: none no body e devolvem auto só ao
                  // conteúdo deles. A lista mora no body: sem isto ela fica visível e não recebe clique.
                  pointerEvents: 'auto',
                }}
                // Clique numa opção não tira o foco do gatilho.
                onMouseDown={(e) => e.preventDefault()}
                // Os mesmos Modal e Drawer travam a rolagem de tudo que está fora deles e cancelam, no
                // document, a roda e o toque sobre a lista. Parar o evento aqui (sem cancelá-lo) deixa o
                // navegador rolar a lista.
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className={cn(
                  // z-[70]: acima do Modal e do Drawer (z-50) e do tour guiado (z-[60]).
                  'z-[70] max-h-[200px] overflow-y-auto overscroll-contain border border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] dark:border-[#93BDE4]',
                  // O canto arredondado fica do lado oposto ao do gatilho, que emenda na lista.
                  pos?.abrirParaCima ? 'rounded-t-lg border-b-0' : 'rounded-b-lg border-t-0',
                )}
              >
                {options.map((o, i) => {
                  const sel = o.value === val
                  return (
                    <div
                      key={o.value}
                      id={optId(i)}
                      role="option"
                      aria-selected={sel}
                      onClick={() => select(o.value)}
                      // onMouseMove, não onMouseEnter: a lista que rola sob o ponteiro parado dispara mouseenter
                      // e puxaria o realce do teclado de volta. Só movimento real do mouse move o realce.
                      onMouseMove={() => { if (teclado || hi !== i) { setTeclado(false); setHi(i) } }}
                      onMouseLeave={() => { if (!teclado) setHi(-1) }}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 transition-colors duration-100',
                        isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-[0.95rem]',
                        sel
                          ? 'bg-[var(--color-primary)]/8 font-semibold text-[var(--color-primary)] dark:bg-[rgba(147,189,228,0.14)] dark:text-[#93BDE4]'
                          : i === hi
                            ? 'bg-[var(--color-surface-muted)] text-[var(--color-fg)] dark:bg-[#2a2a2a]'
                            : 'text-[var(--color-fg)]',
                        // Indicador do realce de teclado: barra de 3px (>= 3:1 contra a lista nos dois temas).
                        i === hi && teclado && 'shadow-[inset_3px_0_0_var(--color-primary)] dark:shadow-[inset_3px_0_0_var(--color-fips-blue-400)]',
                      )}
                    >
                      {sel ? (
                        <Check className={cn('shrink-0 text-[var(--color-primary)] dark:text-[#93BDE4]', isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} aria-hidden />
                      ) : (
                        <span className={isCompact ? 'w-3' : 'w-3.5'} />
                      )}
                      {o.label}
                    </div>
                  )
                })}
              </div>,
              document.body,
            )
          : null}
        {name ? <input type="hidden" name={name} value={val} disabled={disabled} /> : null}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select }
