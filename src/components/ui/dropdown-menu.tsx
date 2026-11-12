import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Menu que abre num gatilho (ações da linha, filtros, conta). API do shadcn sobre Radix: teclado
 * (setas, Home, End, letra, Esc), foco que volta ao gatilho, portal para o body e colisão com a
 * borda da janela vêm do Radix. Visual do menu da conta da Gestão OPA (UserAccountMenu).
 */

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/** Mesma superfície do UserAccountMenu: raio assimétrico, borda, cartão e sombra elevada. */
export const dropdownMenuPainel =
  'rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]'

const linhaBase =
  'relative flex w-full cursor-default items-center gap-2 px-3.5 py-1 text-left text-[12px] outline-none select-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-3.5 [&>svg]:shrink-0'

const itemPadrao =
  'text-[var(--color-fg)] data-[highlighted]:bg-[var(--color-accent)]/20 dark:data-[highlighted]:bg-[var(--color-accent)]/12 [&>svg]:text-[var(--color-fg-muted)]'

const itemDestrutivo =
  'text-[var(--color-danger-text)] data-[highlighted]:bg-[var(--color-danger)]/10 [&>svg]:text-[var(--color-danger-text)]'

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, collisionPadding = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        'fips-dropdown-menu z-50 min-w-[12rem] max-w-[min(20rem,calc(100vw-1rem))] overflow-y-auto py-1',
        'max-h-[var(--radix-dropdown-menu-content-available-height)] origin-[var(--radix-dropdown-menu-content-transform-origin)]',
        dropdownMenuPainel,
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** `destructive` para a ação que apaga ou encerra (Excluir, Sair). Texto em `--color-danger-text`. */
  variant?: 'default' | 'destructive'
}

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, variant = 'default', ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-variant={variant}
    className={cn(linhaBase, variant === 'destructive' ? itemDestrutivo : itemPadrao, className)}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(linhaBase, itemPadrao, 'pr-8', className)}
    {...props}
  >
    {children}
    <span className="pointer-events-none absolute right-3 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-3.5 text-[var(--color-success-text)]" aria-hidden />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-3.5 pt-2 pb-0.5 text-[9px] font-semibold tracking-[0.08em] text-[var(--color-fg-muted)] uppercase',
      className,
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-[var(--color-border)]', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
}
