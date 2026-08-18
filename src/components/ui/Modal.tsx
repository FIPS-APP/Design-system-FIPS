import { Children, forwardRef, isValidElement, type ReactNode } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'workflow'
  showCloseButton?: boolean
  layer?: number
  headerIcon?: LucideIcon
  /** Header hero — gradiente institucional FIPS (fundo azul, ícone glass, texto branco). Default: header simples atual. */
  hero?: boolean
  /** Rótulo dourado uppercase acima do título. Só tem efeito com `hero`. */
  eyebrow?: ReactNode
  /** Remove o padding do corpo (`px-6 py-5`); o conteúdo controla o próprio espaçamento. */
  noPadBody?: boolean
}

const sizeVariants = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-4xl',
  workflow: 'max-w-[900px]',
}

function isModalFooterChild(child: ReactNode): child is React.ReactElement<ModalFooterProps> {
  return isValidElement(child) && (child.type as { displayName?: string })?.displayName === 'ModalFooter'
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      className,
      size = 'md',
      headerIcon: HeaderIcon,
      hero = false,
      eyebrow,
      noPadBody = false,
    },
    ref,
  ) => {
    const childList = Children.toArray(children)
    const footers = childList.filter(isModalFooterChild)
    const body = childList.filter((child) => !isModalFooterChild(child))

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          showCloseButton={!hero}
          className={cn(
            'flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-h-[90vh] sm:p-0',
            sizeVariants[size],
            className,
          )}
        >
          {(title || description) && (hero ? (
            <div
              className="relative flex shrink-0 items-center gap-3.5 overflow-hidden px-6 py-5 pr-14"
              style={{ background: 'var(--fips-modal-hero-bg)' }}
            >
              {HeaderIcon ? (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.16] text-white"
                  style={{
                    background: 'var(--fips-modal-hero-icon-bg)',
                    boxShadow: 'var(--fips-modal-hero-icon-shadow)',
                  }}
                >
                  <HeaderIcon className="h-5 w-5" aria-hidden />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                {eyebrow ? (
                  <span className="block font-heading text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--color-accent-strong)]">{eyebrow}</span>
                ) : null}
                {title ? (
                  <DialogTitle className="font-heading text-[21px] font-bold leading-tight tracking-[-0.2px] text-white">{title}</DialogTitle>
                ) : null}
                {description ? <DialogDescription className="mt-0.5 text-xs leading-snug text-white/65">{description}</DialogDescription> : null}
              </div>
              <DialogClose
                className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/75 transition-colors hover:bg-white/[0.18] hover:text-white focus:outline-none"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" aria-hidden />
              </DialogClose>
            </div>
          ) : (
            <DialogHeader
              className={cn(
                'flex-row items-start gap-3 border-b border-[var(--color-border)] px-6 py-4 pr-14 text-left',
                HeaderIcon && 'gap-4',
              )}
            >
              {HeaderIcon ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-fips-blue-200)]/60 text-[var(--color-primary)]">
                  <HeaderIcon className="h-5 w-5" aria-hidden />
                </div>
              ) : null}
              <div className="min-w-0 flex-1 space-y-1">
                {title ? (
                  <DialogTitle className="text-lg text-[var(--color-fg)] dark:text-white">{title}</DialogTitle>
                ) : null}
                {description ? <DialogDescription>{description}</DialogDescription> : null}
              </div>
            </DialogHeader>
          ))}
          {body.length > 0 ? (
            <div className={cn('flex-1 overflow-y-auto', noPadBody ? 'p-0' : 'px-6 py-5')}>{body}</div>
          ) : null}
          {footers}
        </DialogContent>
      </Dialog>
    )
  },
)

Modal.displayName = 'Modal'

export interface ModalFooterProps {
  children: ReactNode
  className?: string
  hint?: ReactNode
}

const ModalFooter = ({ children, className, hint }: ModalFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {hint ? (
        <p className="text-xs text-[var(--color-fg-muted)] sm:mr-auto">{hint}</p>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
      <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalFooter }
