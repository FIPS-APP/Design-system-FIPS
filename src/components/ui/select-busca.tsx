import * as React from 'react'
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '../../lib/cn'
import { rolarOpcaoParaVista } from '../../lib/rolar-para-vista'
import type { FieldDensity } from './field'
import { FieldTrigger } from './field-trigger'
import { calcularPosicaoLista, mesmaPosicaoLista, type PosicaoLista } from './lista-flutuante'
import type { SelectOption } from './select'

// No servidor a lista nunca está aberta; useEffect evita o aviso do useLayoutEffect no React 18.
const useLayoutEffectSeguro = typeof document !== 'undefined' ? useLayoutEffect : useEffect

/** Comparação da busca: sem acento e sem caixa ("jose" acha "José"). */
const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export interface SelectBuscaProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Nome do campo no submit nativo de `<form>` (vai num input oculto com o valor atual). */
  name?: string
  leftIcon?: React.ReactNode
  density?: FieldDensity
  disabled?: boolean
  className?: string
  /** Texto da lista quando a busca não acha nada. */
  emptyText?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

/**
 * Select de formulário com busca: seleção única, a pessoa digita para filtrar a lista.
 * Para lista longa (usuário, local, equipamento). Lista curta continua no `Select`.
 *
 * Fechado, é o mesmo gatilho do `Select` (`FieldTrigger`). Aberto, o gatilho vira o campo de busca,
 * dentro do próprio formulário, e a lista abre num portal para o `body` com `position: fixed`
 * (mesma conta do `Select`, `lista-flutuante.ts`): nenhum corpo rolável de Modal ou Drawer a corta.
 * Como o foco fica no campo, e não na lista do portal, a armadilha de foco do Modal não o tira dali.
 *
 * Teclado (combobox editável, WAI-ARIA 1.2): setas movem o realce, Home e End movem o cursor do
 * texto, Enter escolhe, Escape fecha só a lista e devolve o foco ao gatilho. Digitar com o gatilho
 * focado abre a lista já filtrada. A opção realçada é anunciada por `aria-activedescendant`.
 */
const SelectBusca = React.forwardRef<HTMLDivElement, SelectBuscaProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Selecione…',
      name,
      leftIcon,
      density = 'default',
      disabled,
      className,
      emptyText = 'Nenhum resultado',
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-invalid': ariaInvalid,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [internal, setInternal] = useState(defaultValue ?? '')
    const val = controlledValue !== undefined ? controlledValue : internal
    const [busca, setBusca] = useState('')
    const [hi, setHi] = useState(0)
    const [pos, setPos] = useState<PosicaoLista | null>(null)
    // Realce vindo do teclado: só ele rola a lista e ganha o indicador de 3 px.
    const [teclado, setTeclado] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)
    const campoRef = useRef<HTMLDivElement>(null)
    const gatilhoRef = useRef<HTMLButtonElement>(null)
    const buscaRef = useRef<HTMLInputElement>(null)
    const listaRef = useRef<HTMLDivElement>(null)
    const uid = useId()
    const listId = `${uid}-lista`
    const optId = useCallback((i: number) => `${uid}-opcao-${i}`, [uid])

    const isCompact = density === 'compact' || density === 'dense'
    const isInvalid = ariaInvalid === true || ariaInvalid === 'true'
    const aberta = open && !disabled

    const visiveis = useMemo(() => {
      const q = semAcento(busca.trim())
      return q ? options.filter((o) => semAcento(o.label).includes(q)) : options
    }, [options, busca])

    const selecionada = options.find((o) => o.value === val)
    const ativo = aberta && hi >= 0 && hi < visiveis.length ? optId(hi) : undefined

    const abrir = (inicial = '', porTeclado = false) => {
      if (disabled) return
      const q = semAcento(inicial.trim())
      const lista = q ? options.filter((o) => semAcento(o.label).includes(q)) : options
      const marcada = lista.findIndex((o) => o.value === val)
      setBusca(inicial)
      setTeclado(porTeclado)
      setHi(lista.length ? Math.max(marcada, 0) : -1)
      setOpen(true)
    }
    const fechar = (devolverFoco = true) => {
      setOpen(false)
      if (devolverFoco) requestAnimationFrame(() => gatilhoRef.current?.focus())
    }
    const escolher = (v: string) => {
      setInternal(v)
      onChange?.(v)
      fechar()
    }

    // O campo de busca existe só com a lista aberta: abrir leva o foco para ele. A primeira
    // tecla digitada no gatilho já está em `busca`, então o cursor vai para o fim do texto.
    useEffect(() => {
      if (!aberta) return
      const campo = buscaRef.current
      if (!campo) return
      campo.focus()
      campo.setSelectionRange(campo.value.length, campo.value.length)
    }, [aberta])

    // Clique fora fecha. A lista mora no body, fora do wrapper: clicar nela é "dentro".
    useEffect(() => {
      if (!aberta) return
      const h = (e: MouseEvent) => {
        const alvo = e.target as Node
        if (!wrapRef.current?.contains(alvo) && !listaRef.current?.contains(alvo)) setOpen(false)
      }
      document.addEventListener('mousedown', h)
      return () => document.removeEventListener('mousedown', h)
    }, [aberta])

    // Escape fecha só a lista. Escuta na captura da window porque Dialog e Drawer (Radix) escutam
    // na captura do document.
    useEffect(() => {
      if (!aberta) return
      const h = (e: KeyboardEvent) => {
        if (e.key !== 'Escape' || !wrapRef.current?.contains(document.activeElement)) return
        e.preventDefault()
        e.stopPropagation()
        fechar()
      }
      window.addEventListener('keydown', h, true)
      return () => window.removeEventListener('keydown', h, true)
    }, [aberta])

    // Posição da lista: mesma medição do Select (gatilho e lista antes de pintar; de novo a cada
    // rolagem, resize e mudança de lugar do campo). Mede o campo, que tem o tamanho do gatilho.
    useLayoutEffectSeguro(() => {
      if (!aberta) return
      const campo = campoRef.current
      const lista = listaRef.current
      if (!campo || !lista) return
      const raiz = document.documentElement
      const medir = () => {
        const r = campo.getBoundingClientRect()
        lista.style.width = `${r.width}px`
        const alturaLista = lista.scrollHeight + lista.offsetHeight - lista.clientHeight
        const prox = calcularPosicaoLista(r, { largura: raiz.clientWidth, altura: raiz.clientHeight }, alturaLista)
        setPos((ant) => (mesmaPosicaoLista(ant, prox) ? ant : prox))
      }
      medir()
      window.addEventListener('scroll', medir, true)
      window.addEventListener('resize', medir)
      let quadro = 0
      let ultimo = ''
      const acompanhar = () => {
        const r = campo.getBoundingClientRect()
        const agora = `${r.top} ${r.left} ${r.width} ${r.height} ${lista.scrollHeight}`
        if (agora !== ultimo) {
          ultimo = agora
          medir()
        }
        quadro = requestAnimationFrame(acompanhar)
      }
      quadro = requestAnimationFrame(acompanhar)
      const visivel =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(([entrada]) => {
              if (entrada && !entrada.isIntersecting) setOpen(false)
            })
      visivel?.observe(campo)
      return () => {
        cancelAnimationFrame(quadro)
        window.removeEventListener('scroll', medir, true)
        window.removeEventListener('resize', medir)
        visivel?.disconnect()
        setPos(null)
      }
    }, [aberta, visiveis.length])

    useEffect(() => {
      if (aberta && teclado && hi >= 0) rolarOpcaoParaVista(optId(hi))
    }, [aberta, teclado, hi, optId])

    const mover = (proximo: (h: number) => number) => {
      setTeclado(true)
      setHi((h) => Math.min(Math.max(proximo(h), 0), visiveis.length - 1))
    }

    const aoTeclarNoGatilho = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(e.key)) {
        e.preventDefault()
        abrir('', true)
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        abrir(e.key, true)
      }
    }

    const aoTeclarNaBusca = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          mover((h) => h + 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          mover((h) => h - 1)
          break
        case 'Enter':
          e.preventDefault()
          if (hi >= 0 && visiveis[hi]) escolher(visiveis[hi].value)
          break
        case 'Tab':
          // Fecha e deixa o Tab seguir; o campo some, então o foco volta ao gatilho antes.
          gatilhoRef.current?.focus()
          setOpen(false)
          break
      }
    }

    const formato = cn(
      'flex w-full items-center gap-2 rounded-lg border border-[var(--color-border-control)] bg-[var(--color-surface)] text-left text-[var(--color-fg)]',
      isCompact ? 'h-8 px-2.5 text-[13px]' : 'h-12 px-4 text-[1.08rem]',
    )

    return (
      <div
        ref={(node) => {
          ;(wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('relative w-full', aberta && 'z-30', className)}
      >
        <div ref={campoRef} className="relative">
          {aberta ? (
            <div
              className={cn(
                formato,
                'border-[var(--color-primary-text)] ring-2 ring-[color:var(--color-primary-text)]/25',
                pos?.abrirParaCima ? 'rounded-t-none' : 'rounded-b-none',
              )}
            >
              <Search className={cn('shrink-0 text-[var(--color-fg-muted)]', isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4')} aria-hidden />
              <input
                ref={buscaRef}
                id={id}
                type="text"
                role="combobox"
                value={busca}
                name={name ? `${name}-busca` : undefined}
                autoComplete="off"
                aria-expanded
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={ativo}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                aria-invalid={isInvalid || undefined}
                placeholder={selecionada?.label ?? placeholder}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setTeclado(true)
                  setHi(0)
                }}
                onKeyDown={aoTeclarNaBusca}
                className="min-w-0 flex-1 border-none bg-transparent p-0 text-inherit outline-none placeholder:text-[var(--color-fg-muted)]"
              />
              <ChevronDown className={cn('shrink-0 rotate-180 text-[var(--color-fg-muted)]', isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4')} aria-hidden />
            </div>
          ) : (
            <FieldTrigger
              ref={gatilhoRef}
              id={id}
              role="combobox"
              aria-expanded={false}
              aria-haspopup="listbox"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              aria-invalid={isInvalid || undefined}
              disabled={disabled}
              leftIcon={leftIcon}
              rightIcon={<ChevronDown aria-hidden />}
              density={isCompact ? 'compact' : 'default'}
              value={selecionada?.label}
              placeholder={placeholder}
              onClick={() => abrir()}
              onKeyDown={aoTeclarNoGatilho}
              onKeyUp={(e) => {
                // Firefox clica o botão no keyup do Espaço, mesmo com preventDefault no keydown.
                if (e.key === ' ') e.preventDefault()
              }}
              className={cn(isInvalid && 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/25')}
            />
          )}
        </div>

        {aberta && typeof document !== 'undefined'
          ? createPortal(
              <div
                ref={listaRef}
                id={listId}
                role="listbox"
                aria-label={ariaLabel}
                data-lista-flutuante=""
                style={{
                  position: 'fixed',
                  left: pos?.left ?? 0,
                  width: pos?.width,
                  top: pos?.abrirParaCima ? undefined : (pos?.top ?? 0),
                  bottom: pos?.abrirParaCima ? pos.bottom : undefined,
                  maxHeight: pos?.maxHeight,
                  visibility: pos ? undefined : 'hidden',
                  // Modal e Drawer (Radix) põem pointer-events: none no body; a lista mora no body.
                  pointerEvents: 'auto',
                }}
                // Clique numa opção não tira o foco do campo de busca.
                onMouseDown={(e) => e.preventDefault()}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className={cn(
                  'z-[70] overflow-y-auto overscroll-contain border border-[var(--color-primary-text)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
                  pos?.abrirParaCima ? 'rounded-t-lg border-b-0' : 'rounded-b-lg border-t-0',
                )}
              >
                {visiveis.map((o, i) => {
                  const sel = o.value === val
                  return (
                    <div
                      key={o.value}
                      id={optId(i)}
                      role="option"
                      aria-selected={sel}
                      onClick={() => escolher(o.value)}
                      onMouseMove={() => {
                        if (teclado || hi !== i) {
                          setTeclado(false)
                          setHi(i)
                        }
                      }}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 transition-colors duration-100 motion-reduce:transition-none',
                        isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-[0.95rem]',
                        sel
                          ? 'bg-[color:var(--color-primary-text)]/[0.1] font-semibold text-[var(--color-primary-text)]'
                          : i === hi
                            ? 'bg-[var(--color-surface-muted)] text-[var(--color-fg)]'
                            : 'text-[var(--color-fg)]',
                        i === hi && teclado && 'shadow-[inset_3px_0_0_var(--color-primary-text)]',
                      )}
                    >
                      {sel ? (
                        <Check className={cn('shrink-0 text-[var(--color-primary-text)]', isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} aria-hidden />
                      ) : (
                        <span className={isCompact ? 'w-3' : 'w-3.5'} />
                      )}
                      <span className="flex-1 truncate">{o.label}</span>
                    </div>
                  )
                })}
                {visiveis.length === 0 && (
                  <p role="status" className="px-4 py-3 text-center text-sm text-[var(--color-fg-muted)]">{emptyText}</p>
                )}
              </div>,
              document.body,
            )
          : null}
        {name ? <input type="hidden" name={name} value={val} disabled={disabled} /> : null}
      </div>
    )
  },
)
SelectBusca.displayName = 'SelectBusca'

export { SelectBusca }
