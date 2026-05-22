import { Children, forwardRef, isValidElement, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  Dialog,
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
          className={cn(
            'flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-h-[90vh]',
            sizeVariants[size],
            className,
          )}
        >
          {(title || description) && (
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
          )}
          {body.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-6 py-5">{body}</div>
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
