import * as React from 'react'
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'

export type ToastVariant = 'sucesso' | 'erro' | 'atencao' | 'info' | 'neutro'

/** Fundo, borda, texto e destaque (borda lateral, ícone, barra de tempo) de cada variante. */
const ESTILO: Record<ToastVariant, { caixa: string; icone: LucideIcon }> = {
  sucesso: {
    caixa:
      '[--toast-fundo:var(--color-semantic-sucesso-bg)] [--toast-borda:var(--color-semantic-sucesso-border)] [--toast-texto:var(--color-semantic-sucesso-fg)] [--toast-destaque:var(--color-success-text)]',
    icone: CircleCheck,
  },
  erro: {
    caixa:
      '[--toast-fundo:var(--color-semantic-critico-bg)] [--toast-borda:var(--color-semantic-critico-border)] [--toast-texto:var(--color-semantic-critico-fg)] [--toast-destaque:var(--color-danger)]',
    icone: CircleX,
  },
  atencao: {
    caixa:
      '[--toast-fundo:var(--color-semantic-atencao-bg)] [--toast-borda:var(--color-semantic-atencao-border)] [--toast-texto:var(--color-semantic-atencao-fg)] [--toast-destaque:var(--color-semantic-atencao-fg)]',
    icone: TriangleAlert,
  },
  info: {
    caixa:
      '[--toast-fundo:var(--color-semantic-info-bg)] [--toast-borda:var(--color-semantic-info-border)] [--toast-texto:var(--color-semantic-info-fg)] [--toast-destaque:var(--color-semantic-info-fg)]',
    icone: Info,
  },
  neutro: {
    caixa:
      '[--toast-fundo:var(--color-surface-muted)] [--toast-borda:var(--color-border)] [--toast-texto:var(--color-fg)] [--toast-destaque:var(--color-fg-muted)]',
    icone: CircleAlert,
  },
}

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: ToastVariant
  title?: React.ReactNode
  message?: React.ReactNode
  /** Texto do botão de ação. Some se omitido. */
  actionLabel?: string
  onAction?: () => void
  /** Chamado pelo X. Sem ele, o X não aparece. */
  onClose?: () => void
  /** Duração em ms da barra de tempo. O fechamento por tempo é de quem usa (veja `useToast`). */
  duration?: number
  /** Saída em andamento (desliza para a direita). */
  saindo?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { variant = 'info', title, message, actionLabel, onAction, onClose, duration, saindo, className, ...props },
    ref,
  ) => {
    const estilo = ESTILO[variant] ?? ESTILO.info
    const Icone = estilo.icone
    return (
      <div
        ref={ref}
        role={variant === 'erro' ? 'alert' : 'status'}
        data-variant={variant}
        data-saindo={saindo ? 'true' : undefined}
        className={cn(
          'fips-toast relative flex w-[360px] max-w-[calc(100vw-32px)] items-center gap-3 overflow-hidden',
          'rounded-[10px] border border-l-4 border-[var(--toast-borda)] border-l-[var(--toast-destaque)]',
          'bg-[var(--color-surface)] px-4 py-3 text-[var(--toast-texto)] shadow-[var(--shadow-float)]',
          estilo.caixa,
          className,
        )}
        {...props}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[var(--toast-fundo)]" />
        <Icone aria-hidden className="relative h-[22px] w-[22px] shrink-0 text-[var(--toast-destaque)]" />
        <div className="relative min-w-0 flex-1">
          {title ? <div className="text-[13px] font-bold leading-tight">{title}</div> : null}
          {message ? <div className={cn('text-[12px] leading-[1.4]', title ? 'mt-0.5' : '')}>{message}</div> : null}
          {actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-1.5 cursor-pointer rounded border border-[var(--toast-texto)] bg-transparent px-2.5 py-[3px] text-[11px] font-bold text-[var(--toast-texto)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--toast-texto)]"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
        {onClose ? (
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={onClose}
            className="relative flex shrink-0 cursor-pointer rounded bg-transparent p-0.5 text-[var(--toast-texto)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--toast-texto)]"
          >
            <X aria-hidden className="h-3.5 w-3.5" />
          </button>
        ) : null}
        {duration ? (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px]">
            <span
              className="fips-toast-tempo block h-[3px] bg-[var(--toast-destaque)] opacity-35"
              style={{ animationDuration: `${duration}ms` }}
            />
          </span>
        ) : null}
      </div>
    )
  },
)
Toast.displayName = 'Toast'

export interface ToastData {
  variant?: ToastVariant
  title?: React.ReactNode
  message?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  /** ms até fechar sozinho. Sem valor, fica até o X. */
  duration?: number
}
export type ToastItem = ToastData & { id: number }

const MAXIMO = 5
const SAIDA_MS = 300

export interface ToastViewportProps {
  toasts: ToastItem[]
  onClose: (id: number) => void
  className?: string
}

/** Pilha no canto superior direito. Cada item fecha por tempo (`duration`), pelo X ou pela ação. */
function ToastViewport({ toasts, onClose, className }: ToastViewportProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2',
        className,
      )}
    >
      {toasts.map((t) => (
        <ToastLinha key={t.id} item={t} onClose={onClose} />
      ))}
    </div>
  )
}

function ToastLinha({ item, onClose }: { item: ToastItem; onClose: (id: number) => void }) {
  const { id, duration, onAction, ...resto } = item
  const [saindo, setSaindo] = React.useState(false)
  const fechar = React.useCallback(() => {
    setSaindo(true)
    window.setTimeout(() => onClose(id), SAIDA_MS)
  }, [id, onClose])

  React.useEffect(() => {
    if (!duration) return undefined
    const t = window.setTimeout(fechar, duration)
    return () => window.clearTimeout(t)
  }, [duration, fechar])

  return (
    <div className="pointer-events-auto">
      <Toast
        {...resto}
        duration={duration}
        saindo={saindo}
        onClose={fechar}
        onAction={() => {
          onAction?.()
          fechar()
        }}
      />
    </div>
  )
}

/** Estado da pilha: até 5 avisos, o mais novo em cima. Renderize `<ToastViewport toasts={toasts} onClose={removeToast} />` uma vez no app. */
function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const proximo = React.useRef(0)
  const addToast = React.useCallback((t: ToastData) => {
    const id = ++proximo.current
    setToasts((prev) => [{ ...t, id }, ...prev].slice(0, MAXIMO))
    return id
  }, [])
  const removeToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])
  return { toasts, addToast, removeToast }
}

export { Toast, ToastViewport, useToast }
