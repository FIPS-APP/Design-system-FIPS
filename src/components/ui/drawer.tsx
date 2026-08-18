import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

const Drawer = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerClose = DialogPrimitive.Close
const DrawerPortal = DialogPrimitive.Portal

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[2px] transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
      className,
    )}
    {...props}
  />
))
DrawerOverlay.displayName = 'DrawerOverlay'

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: 'left' | 'right'; showCloseButton?: boolean }
>(({ className, children, side = 'right', showCloseButton = true, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-y-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--color-surface)] p-6 shadow-[var(--shadow-elevated)] transition-transform duration-200 data-[state=open]:translate-x-0 sm:p-7',
        side === 'left'
          ? 'left-0 border-r border-[var(--color-border)] data-[state=closed]:-translate-x-full'
          : 'right-0 border-l border-[var(--color-border)] data-[state=closed]:translate-x-full',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close
          className="absolute top-5 right-5 rounded-lg border border-transparent p-1.5 text-[var(--color-fg-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] focus:ring-4 focus:ring-[var(--color-ring)]/16 focus:outline-none"
          aria-label="Fechar painel"
        >
          <X className="h-5 w-5" aria-hidden />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex flex-col gap-2 pr-10', className)} {...props} />
}

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-heading text-lg font-semibold tracking-tight', className)}
    {...props}
  />
))
DrawerTitle.displayName = 'DrawerTitle'

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-fg-muted)]', className)}
    {...props}
  />
))
DrawerDescription.displayName = 'DrawerDescription'

export interface DrawerHeroProps {
  /** Ícone lucide no tile âmbar. Omitido → só texto. */
  icon?: LucideIcon
  /** Rótulo dourado uppercase acima do título (Saira Expanded). */
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** aria-label do botão de fechar. */
  closeLabel?: string
  className?: string
}

/**
 * Header hero institucional FIPS para Drawer — gradiente azul 3-stops, tile âmbar,
 * eyebrow dourado, título branco 21px e X próprio (glass). Use com
 * `<DrawerContent showCloseButton={false}>`, pois já traz o próprio DrawerClose.
 */
function DrawerHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  closeLabel = 'Fechar painel',
  className,
}: DrawerHeroProps) {
  return (
    <div
      className={cn('relative flex shrink-0 items-center gap-4 overflow-hidden px-6 py-5 pr-14', className)}
      style={{ background: 'var(--fips-modal-hero-bg)' }}
    >
      {Icon ? (
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border"
          style={{
            background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-accent) 19%, transparent)',
            color: 'var(--color-accent)',
          }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      ) : null}
      <div className="relative min-w-0 flex-1 space-y-0.5">
        {eyebrow ? (
          <span
            className="font-heading block text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-accent-strong)' }}
          >
            {eyebrow}
          </span>
        ) : null}
        <DrawerTitle className="font-heading text-[21px] font-bold leading-[1.15] tracking-[-0.2px] text-white">
          {title}
        </DrawerTitle>
        {description ? (
          <DrawerDescription className="text-xs leading-snug text-white/65">{description}</DrawerDescription>
        ) : null}
      </div>
      <DrawerClose
        className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/90 transition-colors hover:bg-white/[0.18] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label={closeLabel}
      >
        <X className="h-4 w-4" aria-hidden />
      </DrawerClose>
    </div>
  )
}
DrawerHero.displayName = 'DrawerHero'

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHero,
  DrawerTitle,
  DrawerDescription,
}
