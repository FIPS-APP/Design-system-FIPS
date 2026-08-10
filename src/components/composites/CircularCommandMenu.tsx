import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/cn'

export type CommandItem = {
  id: string
  icon: ReactNode
  label: string
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onClick?: () => void
}

export type CircularCommandMenuProps = {
  items?: CommandItem[]
  trigger?: ReactNode
  className?: string
  triggerClassName?: string
  radius?: number
  onSelect?: (item: CommandItem) => void
  /** aria-label do gatilho. Default cobre o uso mais comum (ação por linha de tabela). */
  ariaLabel?: string
}

const DEFAULT_TRIGGER_CLASS = cn(
  'relative z-20 flex h-14 w-14 items-center justify-center rounded-full',
  'bg-[var(--color-primary)] text-white shadow-lg',
  'transition-colors hover:opacity-90',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
)

/**
 * Menu radial de ações (Multitags → Tecnopano). Portal + órbita + teclado.
 * Peer: `framer-motion`.
 */
export function CircularCommandMenu({
  items = [],
  trigger,
  className,
  triggerClassName,
  radius = 120,
  onSelect,
  ariaLabel = 'Ações da linha',
}: CircularCommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const enabledItems = items.filter((i) => !i.disabled)
  const itemCount = enabledItems.length
  const angleStep = itemCount > 0 ? 360 / itemCount : 0
  const startAngle = -90

  useEffect(() => setMounted(true), [])

  const computeCenter = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect()
    if (!r) return
    // Margem = alcance real da órbita (raio + meia-bolinha 18 + 4 de folga).
    // Antes usava `radius + 44`, que reservava espaço demais e, perto das bordas,
    // arrastava o centro pra dentro — desencontrando o × central do × do gatilho.
    const m = radius + 22
    setCenter({
      x: Math.min(Math.max(r.left + r.width / 2, m), window.innerWidth - m),
      y: Math.min(Math.max(r.top + r.height / 2, m), window.innerHeight - m),
    })
  }, [radius])

  const open = () => {
    computeCenter()
    setActiveIndex(0)
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen) return
    const onResize = () => computeCenter()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [isOpen, computeCenter])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || itemCount === 0) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % itemCount)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
          break
        case 'Enter': {
          e.preventDefault()
          const selectedItem = enabledItems[activeIndex]
          if (selectedItem) {
            selectedItem.onClick?.()
            onSelect?.(selectedItem)
          }
          setIsOpen(false)
          break
        }
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          break
        default:
          break
      }
    },
    [isOpen, activeIndex, enabledItems, itemCount, onSelect],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getItemPosition = (index: number) => {
    const angle = ((startAngle + index * angleStep) * Math.PI) / 180
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (isOpen) setIsOpen(false)
          else open()
        }}
        className={triggerClassName ?? DEFAULT_TRIGGER_CLASS}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {trigger ?? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-[200]"
                  onClick={() => setIsOpen(false)}
                  aria-hidden
                />
                {itemCount > 0 && (
                  <div
                    className="pointer-events-none fixed z-[210]"
                    style={{ left: center.x, top: center.y }}
                    role="menu"
                  >
                    <motion.button
                      type="button"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 45 }}
                      exit={{ scale: 0, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={() => setIsOpen(false)}
                      style={{ marginLeft: -18, marginTop: -18 }}
                      className="cmd-glass-center pointer-events-auto absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full"
                      aria-label="Fechar menu"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </motion.button>
                    {enabledItems.map((item, index) => {
                      const position = getItemPosition(index)
                      const isActive = activeIndex === index
                      const tipOnLeft = center.x > window.innerWidth / 2
                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          style={{ zIndex: isActive ? 30 : 1 }}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            x: position.x - 18,
                            y: position.y - 18,
                            scale: 1,
                          }}
                          exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            delay: index * 0.04,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            item.onClick?.()
                            onSelect?.(item)
                            setIsOpen(false)
                          }}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            'cmd-glass pointer-events-auto absolute flex h-9 w-9 items-center justify-center rounded-full transition-[box-shadow,border-color]',
                            isActive && !item.danger && 'ring-2 ring-[var(--color-primary)]',
                            isActive && item.danger && 'ring-2 ring-[var(--color-danger)]',
                          )}
                          role="menuitem"
                          aria-label={item.label}
                        >
                          <div
                            className={
                              item.danger
                                ? 'text-[var(--color-danger)]'
                                : 'text-[var(--color-fg)]'
                            }
                          >
                            {item.icon}
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{
                              opacity: isActive ? 1 : 0,
                              scale: isActive ? 1 : 0.92,
                            }}
                            transition={{ duration: 0.12 }}
                            className={cn(
                              'pointer-events-none absolute z-40 rounded-md px-2.5 py-1 font-mono text-[10px] font-medium tracking-tight whitespace-nowrap shadow-lg',
                              'bg-[var(--color-fg)] text-[var(--color-surface)]',
                              tipOnLeft ? 'right-full mr-2' : 'left-full ml-2',
                            )}
                          >
                            <span>{item.label}</span>
                            {item.shortcut ? (
                              <span className="ml-2 opacity-60">{item.shortcut}</span>
                            ) : null}
                          </motion.div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
