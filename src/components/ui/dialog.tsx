import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

/** Grão SVG — paridade Tecnopano (Menu Automático / Assistente IA / ExportPreview). */
const DIALOG_GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`

const DIALOG_CONTENT_SCROLL_WRAPPER_CLASS =
  'relative z-[2] flex h-full min-h-0 max-h-[inherit] flex-col overflow-hidden'

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px] transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
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
        'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-1rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 sm:w-[calc(100%-1.5rem)] sm:w-full',
        'max-h-[calc(100dvh-1rem)] sm:max-h-[90vh]',
        'rounded-2xl border border-black/10 sm:rounded-[20px]',
        'bg-gradient-to-br from-[#fafafa] via-[#f0f0f2] to-[#e8e8ec]',
        'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_1px_0_rgba(255,255,255,0.9)_inset]',
        'dark:border-[#2e2e2e] dark:from-[#272727] dark:via-[#222222] dark:to-[#1d1d1d]',
        'dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]',
        // padding fixo (não sm:p-*) — assim `p-0` do consumidor vale em todos os breakpoints
        'overflow-hidden p-6 transition-transform duration-200 data-[state=closed]:scale-[0.97] data-[state=open]:scale-100',
        className,
        'overflow-hidden',
      )}
      {...props}
    >
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[20px] opacity-[0.025] mix-blend-multiply dark:opacity-[0.03] dark:mix-blend-overlay"
        style={{ backgroundImage: DIALOG_GRAIN_BG }}
      />
      {/* Faixa no topo — padrão FIPS azul (Tutorial / GuidedTour), não vermelho Tecnopano */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 left-0 z-[1] h-[3px] rounded-t-[20px] bg-gradient-to-r from-[#004B9B] via-[#93BDE4] to-transparent"
      />
      <div className={DIALOG_CONTENT_SCROLL_WRAPPER_CLASS}>{children}</div>
      {showCloseButton ? (
        <DialogPrimitive.Close
          className={cn(
            'absolute top-4 right-4 z-[30] flex h-7 w-7 items-center justify-center rounded-lg transition-all',
            'border border-black/[0.08] bg-black/[0.04] text-zinc-500',
            'hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] hover:text-[var(--color-primary)]',
            'dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400',
            'dark:hover:text-[var(--color-fips-blue-200)]',
            'focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/25 focus-visible:outline-none',
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
      'font-heading text-xl leading-none font-semibold tracking-tight text-[#18181b] dark:text-[#fafafa]',
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
    className={cn('text-sm text-zinc-600 dark:text-zinc-400', className)}
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
  DIALOG_CONTENT_SCROLL_WRAPPER_CLASS,
}
