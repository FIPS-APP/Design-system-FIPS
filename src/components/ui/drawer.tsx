import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: 'left' | 'right' }
>(({ className, children, side = 'right', ...props }, ref) => (
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
      <DialogPrimitive.Close
        className="absolute top-5 right-5 rounded-lg border border-transparent p-1.5 text-[var(--color-fg-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] focus:ring-4 focus:ring-[var(--color-ring)]/16 focus:outline-none"
        aria-label="Fechar painel"
      >
        <X className="h-5 w-5" aria-hidden />
      </DialogPrimitive.Close>
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

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
}
