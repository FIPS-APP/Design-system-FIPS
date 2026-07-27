import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[3px] transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-elevated)] transition-transform duration-200 data-[state=closed]:scale-95 data-[state=open]:scale-100 sm:w-full sm:p-8',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close
          className={cn(
            'absolute top-4 right-4 z-[30] flex h-7 w-7 items-center justify-center rounded-lg transition-all',
            'border border-black/[0.08] bg-black/[0.04] text-zinc-500',
            'hover:border-[rgba(255,7,58,0.3)] hover:bg-[rgba(255,7,58,0.15)] hover:text-[#FF073A]',
            'dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400',
            'focus-visible:ring-2 focus-visible:ring-[#2563EB]/25 focus-visible:outline-none',
          )}
          aria-label="Fechar"
        >
          <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/** Azulejo neu do cabeçalho — paridade Tecnopano DialogIconTile. */
function DialogIconTile({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-black/10',
        'bg-gradient-to-br from-white via-[#ebebeb] to-[#e0e0e0]',
        'text-[rgba(55,55,55,0.82)] shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]',
        'dark:border-[#3a3a3a] dark:from-[#2c2c2c] dark:via-[#262626] dark:to-[#1f1f1f]',
        'dark:text-[#a1a1aa] dark:shadow-[0_3px_10px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.08)_inset,0_-1px_0_rgba(0,0,0,0.45)_inset]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-2 text-left', className, 'pr-12')} {...props} />
  )
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 flex shrink-0 flex-col-reverse gap-2 border-t border-black/[0.08] bg-transparent dark:border-white/[0.08] sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-heading text-xl leading-none font-semibold tracking-tight text-[var(--color-fg)] dark:text-white',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-fg-muted)]', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogIconTile,
}
