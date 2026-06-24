import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[rgba(147,189,228,0.14)] dark:text-[#93BDE4]',
        secondary:
          'border-transparent bg-[var(--color-surface-muted)] text-[var(--color-fg)]',
        success:
          'border-[var(--color-semantic-sucesso-border)] bg-[var(--color-semantic-sucesso-bg)] text-[var(--color-semantic-sucesso-fg)]',
        warning:
          'border-[var(--color-fips-yellow-400)] bg-[var(--color-badge-warning-bg)] text-[var(--color-accent-strong)] dark:text-[#FDC24E]',
        danger:
          'border-[var(--color-semantic-critico-border)] bg-[var(--color-semantic-critico-bg)] text-[var(--color-semantic-critico-fg)]',
        outline: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]',
        info: 'border-[var(--color-semantic-info-border)] bg-[var(--color-semantic-info-bg)] text-[var(--color-semantic-info-fg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
