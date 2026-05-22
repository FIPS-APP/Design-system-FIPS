import { cva, type VariantProps } from 'class-variance-authority'

/** Alinhado ao DSButton — /docs/components/button */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[7px] whitespace-nowrap rounded-md border-[1.5px] border-transparent text-sm font-semibold tracking-[0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ring)]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-[var(--color-primary)] text-white shadow-[0_2px_8px_rgba(0,75,155,0.12)] hover:bg-[var(--color-primary-hover)] hover:shadow-[0_2px_8px_rgba(0,75,155,0.18)]',
        secondary:
          'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]',
        outline:
          'border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-fips-blue-200)]',
        ghost:
          'border-transparent bg-transparent text-[var(--color-fg-muted)] hover:bg-[var(--color-fips-blue-200)]/50',
        accent:
          'border-transparent bg-[var(--color-accent-strong)] text-white shadow-[0_2px_8px_rgba(246,146,30,0.2)] hover:bg-[var(--color-warning)] btn-shimmer',
        inverseOutline:
          'border-white/60 bg-white/[0.06] text-white hover:border-white/70 hover:bg-white/[0.12]',
        success:
          'border-transparent bg-[var(--color-success)] text-white shadow-[0_2px_8px_rgba(0,198,76,0.2)] hover:bg-[var(--color-success-strong)]',
        save:
          'border-transparent bg-[var(--color-success)] text-white shadow-[0_2px_8px_rgba(0,198,76,0.2)] hover:bg-[var(--color-success-strong)]',
        ouro:
          'border-transparent bg-[var(--color-accent)] text-[var(--color-primary-hover)] shadow-[var(--shadow-card)] hover:bg-[var(--color-accent-strong)] btn-shimmer',
        danger:
          'border-transparent bg-[var(--color-danger)] text-white shadow-[0_2px_8px_rgba(220,53,69,0.2)] hover:bg-[#c82333]',
        link:
          'h-auto min-h-0 border-transparent bg-transparent px-0 py-0 text-[var(--color-primary)] underline-offset-4 hover:underline active:scale-100',
      },
      size: {
        sm: 'h-[30px] min-h-[30px] px-3.5 text-[12px] [&_svg]:size-3.5',
        md: 'h-9 min-h-9 px-5 text-[13px] [&_svg]:size-3.5',
        lg: 'h-[42px] min-h-[42px] px-7 text-sm [&_svg]:size-4',
        icon: 'h-9 w-9 p-0 [&_svg]:size-3.5',
        iconSm: 'h-[30px] w-[30px] p-0 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
